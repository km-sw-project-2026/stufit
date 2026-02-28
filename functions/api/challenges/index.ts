type HandlerContext = {
  env: any;
  userId: number;
};

export default async function handler(request: Request, { env, userId }: HandlerContext) {
  console.log('=== Challenge API Handler ===');
  console.log('Method:', request.method);
  console.log('userId:', userId);

  const hasColumn = async (tableName: string, columnName: string) => {
    const pragma = await env.D1_DB.prepare(`PRAGMA table_info('${tableName}')`).all();
    return (pragma.results || []).some((c: any) => c.name === columnName);
  };

  // ========== GET: 챌린지 목록 조회 ==========
  if (request.method === 'GET') {
    try {
      const url = new URL(request.url);
      const code = url.searchParams.get('code');

      // If a code query param is provided, return the matching challenge (used for "join by code")
      if (code) {
        console.log('Looking up challenge by code:', code);
        // case-insensitive match for code, but exclude full challenges
        const row = await env.D1_DB
          .prepare(
            `SELECT c.*, 
              (SELECT COUNT(*) FROM challenge_members cm WHERE cm.challenge_id = c.challenge_id) AS member_count
             FROM challenges c
             WHERE lower(c.challenge_code) = lower(?)
               AND c.deleted_at IS NULL
               AND (SELECT COUNT(*) FROM challenge_members cm2 WHERE cm2.challenge_id = c.challenge_id) < c.max_members
             LIMIT 1`
          )
          .bind(code)
          .first();

        if (!row) {
          return Response.json({ success: false, message: '코드에 해당하는 챌린지를 찾을 수 없습니다.' }, { status: 404 });
        }

        return Response.json({ success: true, challenge: row }, { status: 200 });
      }

      console.log('Fetching challenges for userId:', userId);

      // Check if requesting completed challenges count
      const includeCompleted = url.searchParams.get('includeCompleted') === 'true';
      const countOnly = url.searchParams.get('countOnly') === 'true';

      if (countOnly && includeCompleted) {
        // Return count of completed challenges
        const completedCount = await env.D1_DB
          .prepare(
            `SELECT COUNT(*) as count FROM challenges c
             INNER JOIN challenge_members cm ON c.challenge_id = cm.challenge_id
             WHERE cm.user_id = ? AND c.deleted_at IS NOT NULL`
          )
          .bind(userId)
          .first();
        
        return Response.json({
          success: true,
          count: completedCount?.count || 0
        });
      }

      const hasIsStarted = await hasColumn('challenges', 'is_started');

      const userChallenges = hasIsStarted
        ? await env.D1_DB
            .prepare(
              `SELECT c.*, 
                 (SELECT COUNT(*) FROM challenge_members cm2 WHERE cm2.challenge_id = c.challenge_id) AS member_count
               FROM challenges c
               INNER JOIN challenge_members cm ON c.challenge_id = cm.challenge_id
               WHERE cm.user_id = ?
                 AND c.deleted_at IS NULL
                 AND (
                   c.is_started = 1
                   OR (SELECT COUNT(*) FROM challenge_members cm3 WHERE cm3.challenge_id = c.challenge_id) >= c.max_members
                 )
               ORDER BY c.created_at DESC`
            )
            .bind(userId)
            .all()
        : await env.D1_DB
            .prepare(
              `SELECT c.*, 
                 (SELECT COUNT(*) FROM challenge_members cm2 WHERE cm2.challenge_id = c.challenge_id) AS member_count
               FROM challenges c
               INNER JOIN challenge_members cm ON c.challenge_id = cm.challenge_id
               WHERE cm.user_id = ?
                 AND c.deleted_at IS NULL
                 AND (SELECT COUNT(*) FROM challenge_members cm3 WHERE cm3.challenge_id = c.challenge_id) >= c.max_members
               ORDER BY c.created_at DESC`
            )
            .bind(userId)
            .all();

      console.log('Found challenges:', userChallenges.results?.length || 0);

      return Response.json({
        success: true,
        challenges: userChallenges.results || []
      });

    } catch (err: unknown) {
      console.error('챌린지 목록 조회 오류:', err);
      const errorMessage = err instanceof Error ? err.message : String(err);
      return Response.json(
        { success: false, message: '챌린지 목록을 불러올 수 없습니다.', error: errorMessage },
        { status: 500 }
      );
    }
  }

  // ========== POST: 챌린지 생성 ==========
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  // ========== 2️⃣ 요청 바디 파싱 (JSON 파싱 오류 처리) ==========
  let body;
  try {
    body = await request.json();
  } catch (parseError) {
    console.error('JSON 파싱 오류:', parseError);
    return Response.json(
      { success: false, message: 'JSON 형식이 올바르지 않습니다.' },
      { status: 400 }
    );
  }

  const { challengeName, category, maxParticipants, endDate, goalDescription, inviteCode, timerHours, timerMinutes, duration } = body;
  const normalizedInviteCode = typeof inviteCode === 'string' ? inviteCode.trim() : '';

  console.log('Received data:', { challengeName, category, maxParticipants, endDate, goalDescription, inviteCode, timerHours, timerMinutes });

  // ========== 3️⃣ 입력 검증 (try 밖에서 - 400 에러) ==========
  
  // 필수 값 검증 (inviteCode는 선택사항)
  if (!challengeName || !category || !maxParticipants || !endDate || !goalDescription) {
    console.error('필수 값 누락:', { challengeName, category, maxParticipants, endDate, goalDescription });
    return Response.json(
      { success: false, message: '필수 항목을 모두 입력해주세요.' },
      { status: 400 }
    );
  }

  // maxParticipants 타입 검증
  if (isNaN(Number(maxParticipants)) || Number(maxParticipants) <= 0) {
    console.error('maxParticipants 타입 오류:', maxParticipants);
    return Response.json(
      { success: false, message: '최대 참가자 수는 1 이상의 숫자여야 합니다.' },
      { status: 400 }
    );
  }

  // category 값 검증
  if (!['DAILY', 'STUDY', 'EXERCISE'].includes(category)) {
    console.error('category 값 오류:', category);
    return Response.json(
      { success: false, message: `카테고리는 DAILY, STUDY, EXERCISE 중 하나여야 합니다. (입력값: ${category})` },
      { status: 400 }
    );
  }

  // endDate 형식 검증
  if (!/^\d{4}-\d{2}-\d{2}$/.test(endDate)) {
    console.error('endDate 형식 오류:', endDate);
    return Response.json(
      { success: false, message: '종료일 형식이 올바르지 않습니다. (YYYY-MM-DD 형식)' },
      { status: 400 }
    );
  }

  // ========== 4️⃣ DB 작업 (try 안에서 - 500 에러) ==========
  try {
    // env.D1_DB 바인딩 확인
    if (!env.D1_DB) {
      console.error('D1_DB 바인딩이 설정되지 않았습니다.');
      return Response.json(
        { success: false, message: '데이터베이스 연결 설정 오류' },
        { status: 500 }
      );
    }

    // 초대 코드 중복 확인 (선택 입력)
    if (normalizedInviteCode) {
      console.log('Checking duplicate inviteCode:', normalizedInviteCode);
      const exists = await env.D1_DB
        .prepare('SELECT 1 FROM challenges WHERE challenge_code = ?')
        .bind(normalizedInviteCode)
        .first();

      if (exists) {
        console.error('inviteCode 중복:', normalizedInviteCode);
        return Response.json(
          { success: false, message: '이미 사용 중인 초대 코드입니다.' },
          { status: 409 } // Conflict
        );
      }
    }

    // 챌린지 생성
    console.log('Inserting challenge...');
    const insertResult = await env.D1_DB
      .prepare(
        `INSERT INTO challenges 
         (title, description, category, max_members, goal, end_date, challenge_code, created_by_user_id, timer_hours, timer_minutes, is_started, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, datetime('now'))`
      )
      .bind(
        challengeName,
        goalDescription,
        category,
        Number(maxParticipants),
        goalDescription,
        endDate,
        normalizedInviteCode || null,
        userId,
        timerHours || 0,
        timerMinutes || 0
      )
      .run();

    const challengeId = insertResult.meta.last_row_id || insertResult.lastInsertRowid;
    
    if (!challengeId) {
      throw new Error('챌린지 ID를 가져올 수 없습니다.');
    }

    console.log('Challenge created with ID:', challengeId);

    // 챌린지 멤버 추가
    console.log('Adding user to challenge_members...');
    try {
      // use INSERT OR IGNORE so duplicate PK doesn't error out on retries
      await env.D1_DB
        .prepare("INSERT OR IGNORE INTO challenge_members (challenge_id, user_id, joined_at) VALUES (?, ?, datetime('now'))")
        .bind(challengeId, userId)
        .run();

      const memberCountRow = await env.D1_DB
        .prepare('SELECT COUNT(*) AS count FROM challenge_members WHERE challenge_id = ?')
        .bind(challengeId)
        .first();
      const currentMemberCount = Number((memberCountRow as any)?.count || 0);
      const hasIsStarted = await hasColumn('challenges', 'is_started');
      if (hasIsStarted && currentMemberCount >= Number(maxParticipants)) {
        await env.D1_DB
          .prepare('UPDATE challenges SET is_started = 1 WHERE challenge_id = ?')
          .bind(challengeId)
          .run();
      }
    } catch (e) {
      console.error('참가자 추가 중 오류(무시):', e instanceof Error ? e.message : String(e));
    }

    const createdChallenge = await env.D1_DB
      .prepare('SELECT * FROM challenges WHERE challenge_id = ?')
      .bind(challengeId)
      .first();

    // compute duration to include in response: prefer client-provided `duration`,
    // otherwise compute inclusive day count from created_at -> end_date
    try {
      const msPerDay = 24 * 60 * 60 * 1000;
      let computedDuration = null;
      if (typeof duration !== 'undefined' && duration !== null && !isNaN(Number(duration))) {
        computedDuration = Number(duration);
      } else if (createdChallenge && createdChallenge.end_date && createdChallenge.created_at) {
        const s = new Date(createdChallenge.created_at);
        const e = new Date(createdChallenge.end_date);
        const sd = Date.UTC(s.getFullYear(), s.getMonth(), s.getDate());
        const ed = Date.UTC(e.getFullYear(), e.getMonth(), e.getDate());
        const diffExclusive = Math.floor((ed - sd) / msPerDay);
        computedDuration = diffExclusive + 1;
      }
      if (computedDuration !== null && createdChallenge) {
        (createdChallenge as any).duration = computedDuration;
      }
    } catch (e) {
      // ignore duration computation errors
    }

    // fetch members robustly (handle DBs without status)
    const pragma = await env.D1_DB.prepare("PRAGMA table_info('challenge_members')").all();
    const hasStatus = (pragma.results || []).some((c: any) => c.name === 'status');
    let members;
    if (hasStatus) {
      members = await env.D1_DB
        .prepare('SELECT u.user_id, u.username, cm.status FROM challenge_members cm JOIN users u ON cm.user_id = u.user_id WHERE cm.challenge_id = ?')
        .bind(challengeId)
        .all();
    } else {
      members = await env.D1_DB
        .prepare('SELECT u.user_id, u.username FROM challenge_members cm JOIN users u ON cm.user_id = u.user_id WHERE cm.challenge_id = ?')
        .bind(challengeId)
        .all();
      members.results = (members.results || []).map((r: any) => ({ ...r, status: 'not_submitted' }));
    }

    console.log('✅ Challenge creation complete!');
    return Response.json(
      { 
        success: true, 
        data: { challengeId, challenge: createdChallenge || null, members: members.results || [], isJoined: true }, 
        message: '챌린지가 성공적으로 생성되었습니다!' 
      },
      { status: 201 }
    );

  } catch (err: unknown) {
    // ========== 5️⃣ DB 오류 분류 ==========
    console.error('=== DB 작업 중 오류 발생 ===');
    console.error('Error:', err);
    
    const errorMessage = err instanceof Error ? err.message : String(err);
    const errorStack = err instanceof Error ? err.stack : undefined;
    
    console.error('Message:', errorMessage);
    console.error('Stack:', errorStack);

    // D1 특정 에러 처리
    if (errorMessage.includes('UNIQUE constraint failed')) {
      return Response.json(
        { success: false, message: '중복된 데이터가 존재합니다.' },
        { status: 409 }
      );
    }

    if (errorMessage.includes('NOT NULL constraint failed')) {
      return Response.json(
        { success: false, message: '필수 데이터가 누락되었습니다.' },
        { status: 400 }
      );
    }

    if (errorMessage.includes('FOREIGN KEY constraint failed')) {
      return Response.json(
        { success: false, message: '잘못된 사용자 ID입니다.' },
        { status: 400 }
      );
    }

    if (errorMessage.includes('no such table') || errorMessage.includes('no such column')) {
      return Response.json(
        { success: false, message: '데이터베이스 스키마 오류' },
        { status: 500 }
      );
    }

    // 기타 DB 오류
    return Response.json(
      { 
        success: false, 
        message: '데이터베이스 오류가 발생했습니다.',
        error: errorMessage 
      },
      { status: 500 }
    );
  }
}
