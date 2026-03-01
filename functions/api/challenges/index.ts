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
      const hasIsStarted = await hasColumn('challenges', 'is_started');

      await env.D1_DB.prepare(`CREATE TABLE IF NOT EXISTS challenge_started_flags (
        challenge_id INTEGER PRIMARY KEY,
        started_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      )`).run();

      // If a code query param is provided, return the matching challenge (used for "join by code")
      if (code) {
        console.log('Looking up challenge by code:', code);
        // case-insensitive match for code, but exclude full/started challenges
        const row = hasIsStarted
          ? await env.D1_DB
              .prepare(
                `SELECT c.*, 
                  (SELECT COUNT(*) FROM challenge_members cm WHERE cm.challenge_id = c.challenge_id) AS member_count
                 FROM challenges c
                 WHERE lower(c.challenge_code) = lower(?)
                   AND c.deleted_at IS NULL
                   AND c.is_started = 0
                   AND (SELECT COUNT(*) FROM challenge_members cm2 WHERE cm2.challenge_id = c.challenge_id) < c.max_members
                 LIMIT 1`
              )
              .bind(code)
              .first()
          : await env.D1_DB
              .prepare(
                `SELECT c.*, 
                  (SELECT COUNT(*) FROM challenge_members cm WHERE cm.challenge_id = c.challenge_id) AS member_count
                 FROM challenges c
                 WHERE lower(c.challenge_code) = lower(?)
                   AND c.deleted_at IS NULL
                   AND c.challenge_id NOT IN (SELECT challenge_id FROM challenge_started_flags)
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

      const userChallenges = hasIsStarted
        ? await env.D1_DB
            .prepare(
              `SELECT c.*, 
                 (SELECT COUNT(*) FROM challenge_members cm2 WHERE cm2.challenge_id = c.challenge_id) AS member_count
               FROM challenges c
               INNER JOIN challenge_members cm ON c.challenge_id = cm.challenge_id
               WHERE cm.user_id = ?
                 AND c.deleted_at IS NULL
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
               ORDER BY c.created_at DESC`
            )
            .bind(userId)
            .all();

      const rawChallenges = Array.isArray(userChallenges?.results) ? userChallenges.results : [];
      const normalizedChallenges: any[] = [];

      if (hasIsStarted) {
        for (const row of rawChallenges) {
          const memberCount = Number((row as any)?.member_count || 0);
          const maxMembers = Number((row as any)?.max_members || 0);
          const computedStarted = Number((row as any)?.is_started || 0) === 1 || (maxMembers > 0 && memberCount >= maxMembers);
          normalizedChallenges.push({
            ...row,
            is_started: computedStarted ? 1 : 0,
            member_count: memberCount
          });
        }
      } else {
        const startedById = new Map<number, boolean>();

        for (const row of rawChallenges) {
          const challengeId = Number((row as any)?.challenge_id || 0);
          if (!challengeId) continue;
          const flag = await env.D1_DB
            .prepare('SELECT 1 FROM challenge_started_flags WHERE challenge_id = ?')
            .bind(challengeId)
            .first();
          startedById.set(challengeId, Boolean(flag));
        }

        for (const row of rawChallenges) {
          const challengeId = Number((row as any)?.challenge_id || 0);
          const memberCount = Number((row as any)?.member_count || 0);
          const maxMembers = Number((row as any)?.max_members || 0);
          let computedStarted = Boolean(startedById.get(challengeId));

          if (!computedStarted && maxMembers > 0 && memberCount >= maxMembers) {
            computedStarted = true;
            if (challengeId) {
              await env.D1_DB
                .prepare("INSERT OR REPLACE INTO challenge_started_flags (challenge_id, started_at) VALUES (?, datetime('now'))")
                .bind(challengeId)
                .run();
            }
          }

          normalizedChallenges.push({
            ...row,
            is_started: computedStarted ? 1 : 0,
            member_count: memberCount
          });
        }
      }

      console.log('Found challenges:', normalizedChallenges.length || 0);

      return Response.json({
        success: true,
        challenges: normalizedChallenges
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

  const { challengeName, category, maxParticipants, endDate, goalDescription, inviteCode, timerHours, timerMinutes, duration, betPoints } = body;
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

  // maxParticipants 타입 검증: 최소 2명 이상만 허용
  if (isNaN(Number(maxParticipants)) || Number(maxParticipants) < 2) {
    console.error('maxParticipants 타입 오류 or too small:', maxParticipants);
    return Response.json(
      { success: false, message: '최대 참가자 수는 2 이상의 숫자여야 합니다.' },
      { status: 400 }
    );
  }

  // betPoints 타입 검증 (선택 항목)
  if (typeof betPoints !== 'undefined' && betPoints !== null && betPoints !== '') {
    if (isNaN(Number(betPoints)) || Number(betPoints) < 0) {
      console.error('betPoints 타입 오류:', betPoints);
      return Response.json(
        { success: false, message: '점수 배팅은 0 이상의 숫자여야 합니다.' },
        { status: 400 }
      );
    }
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

    // 배팅 포인트 처리 전 유저 잔액 검사 (선택)
    if (typeof betPoints !== 'undefined' && betPoints !== null && Number(betPoints) > 0) {
      // ensure user_profiles row exists
      try {
        await env.D1_DB
          .prepare("INSERT OR IGNORE INTO user_profiles (user_id, tier, score, points) VALUES (?, 'bronze', 0, 0)")
          .bind(userId)
          .run();
      } catch (e) {
        // ignore insert-or-ignore errors
      }

      const profileRow = await env.D1_DB
        .prepare('SELECT score FROM user_profiles WHERE user_id = ?')
        .bind(userId)
        .first();
      const currentScore = Number((profileRow as any)?.score || 0);
      const requiredBet = Number(betPoints);
      if (currentScore < requiredBet) {
        console.error('betPoints 부족: score=', currentScore, 'required=', betPoints);
        return Response.json(
          { success: false, message: 'score가 부족합니다.' },
          { status: 400 }
        );
      }
    }

    // 챌린지 생성
    console.log('Inserting challenge...');
    // 일부 DB 인스턴스(예: 오래된 마이그레이션)를 위해 컬럼 존재 여부에 따라 INSERT 문을 다르게 구성
    const includeIsStarted = await hasColumn('challenges', 'is_started');
    const includeBetPoints = await hasColumn('challenges', 'bet_points');
    const normalizedBetPoints = typeof betPoints !== 'undefined' && betPoints !== null && betPoints !== ''
      ? Number(betPoints)
      : 0;
    let insertSql: string;
    let bindValues: any[];
    if (includeIsStarted) {
      if (includeBetPoints) {
        insertSql = `INSERT INTO challenges 
         (title, description, category, max_members, goal, end_date, challenge_code, created_by_user_id, timer_hours, timer_minutes, bet_points, is_started, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, datetime('now'))`;
        bindValues = [
          challengeName,
          goalDescription,
          category,
          Number(maxParticipants),
          goalDescription,
          endDate,
          normalizedInviteCode || null,
          userId,
          timerHours || 0,
          timerMinutes || 0,
          normalizedBetPoints
        ];
      } else {
        insertSql = `INSERT INTO challenges 
         (title, description, category, max_members, goal, end_date, challenge_code, created_by_user_id, timer_hours, timer_minutes, is_started, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, datetime('now'))`;
        bindValues = [
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
        ];
      }
    } else {
      if (includeBetPoints) {
        insertSql = `INSERT INTO challenges 
         (title, description, category, max_members, goal, end_date, challenge_code, created_by_user_id, timer_hours, timer_minutes, bet_points, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`;
        bindValues = [
          challengeName,
          goalDescription,
          category,
          Number(maxParticipants),
          goalDescription,
          endDate,
          normalizedInviteCode || null,
          userId,
          timerHours || 0,
          timerMinutes || 0,
          normalizedBetPoints
        ];
      } else {
        insertSql = `INSERT INTO challenges 
         (title, description, category, max_members, goal, end_date, challenge_code, created_by_user_id, timer_hours, timer_minutes, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`;
        bindValues = [
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
        ];
      }
    }

    const insertResult = await env.D1_DB.prepare(insertSql).bind(...bindValues).run();

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

    // 배팅 포인트 차감: 챌린지 생성 후에 실제로 참가자가 되었다고 판단하여 차감
    if (typeof betPoints !== 'undefined' && betPoints !== null && Number(betPoints) > 0) {
      try {
        const pointLogInfo = await env.D1_DB.prepare("PRAGMA table_info('point_logs')").all();
        const pointLogColumns = Array.isArray(pointLogInfo?.results) ? pointLogInfo.results : [];
        const pointLogColumn = pointLogColumns.some((col: any) => col.name === 'point')
          ? 'point'
          : pointLogColumns.some((col: any) => col.name === 'points')
            ? 'points'
            : null;

        const profileRow = await env.D1_DB
          .prepare('SELECT score FROM user_profiles WHERE user_id = ?')
          .bind(userId)
          .first();
        const currentScore = Number((profileRow as any)?.score || 0);
        const requiredBet = Number(betPoints);

        if (currentScore >= requiredBet) {
          await env.D1_DB
            .prepare('UPDATE user_profiles SET score = score - ? WHERE user_id = ?')
            .bind(requiredBet, userId)
            .run();

          if (pointLogColumn) {
            await env.D1_DB
              .prepare(`INSERT INTO point_logs (user_id, ${pointLogColumn}, reason, created_at) VALUES (?, ?, ?, ?)`)
              .bind(userId, -requiredBet, `challenge_bet:${challengeId}:create`, new Date().toISOString())
              .run();
          }
        } else {
          return Response.json(
            { success: false, message: 'score가 부족합니다.' },
            { status: 400 }
          );
        }
      } catch (e) {
        console.error('포인트 차감 오류:', e instanceof Error ? e.message : String(e));
        // 차감 실패 시에도 진행은 가능하지만 로그를 남깁니다.
      }
    }

    // 구 스키마 호환: challenges.bet_points 컬럼이 없는 경우 매핑 테이블에 저장
    if (typeof betPoints !== 'undefined' && betPoints !== null && Number(betPoints) > 0 && !includeBetPoints) {
      try {
        await env.D1_DB.prepare(`CREATE TABLE IF NOT EXISTS challenge_bets (
          challenge_id INTEGER PRIMARY KEY,
          bet_points INTEGER NOT NULL
        )`).run();
        await env.D1_DB
          .prepare('INSERT OR REPLACE INTO challenge_bets (challenge_id, bet_points) VALUES (?, ?)')
          .bind(challengeId, Number(betPoints))
          .run();
      } catch (e) {
        console.error('challenge_bets 저장 오류:', e instanceof Error ? e.message : String(e));
      }
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
        const createdAtStr = String(createdChallenge.created_at).replace(' ', 'T');
        const createdAtUTC = createdAtStr.endsWith('Z') ? createdAtStr : createdAtStr + 'Z';
        const s = new Date(createdAtUTC);
        const e = new Date(createdChallenge.end_date);
        const sd = Date.UTC(s.getUTCFullYear(), s.getUTCMonth(), s.getUTCDate());
        const ed = Date.UTC(e.getUTCFullYear(), e.getUTCMonth(), e.getUTCDate());
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
