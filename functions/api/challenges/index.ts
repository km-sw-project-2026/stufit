type HandlerContext = {
  env: any;
  userId: number;
};

export default async function handler(request: Request, { env, userId }: HandlerContext) {
  console.log('=== Challenge API Handler ===');
  console.log('Method:', request.method);
  console.log('userId:', userId);

  // ========== GET: 챌린지 목록 조회 ==========
  if (request.method === 'GET') {
    try {
      console.log('Fetching challenges for userId:', userId);

      const userChallenges = await env.D1_DB
        .prepare(
          `SELECT c.* FROM challenges c
           INNER JOIN challenge_members cm ON c.challenge_id = cm.challenge_id
           WHERE cm.user_id = ? AND c.deleted_at IS NULL
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

  const { challengeName, category, maxParticipants, endDate, goalDescription, inviteCode, timerHours, timerMinutes } = body;

  console.log('Received data:', { challengeName, category, maxParticipants, endDate, goalDescription, inviteCode, timerHours, timerMinutes });

  // ========== 3️⃣ 입력 검증 (try 밖에서 - 400 에러) ==========
  
  // 필수 값 검증
  if (!challengeName || !category || !maxParticipants || !endDate || !goalDescription || !inviteCode) {
    console.error('필수 값 누락:', { challengeName, category, maxParticipants, endDate, goalDescription, inviteCode });
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

    // 초대 코드 중복 확인
    console.log('Checking duplicate inviteCode:', inviteCode);
    const exists = await env.D1_DB
      .prepare('SELECT 1 FROM challenges WHERE challenge_code = ?')
      .bind(inviteCode)
      .first();

    if (exists) {
      console.error('inviteCode 중복:', inviteCode);
      return Response.json(
        { success: false, message: '이미 사용 중인 초대 코드입니다.' },
        { status: 409 } // Conflict
      );
    }

    // 챌린지 생성
    console.log('Inserting challenge...');
    const insertResult = await env.D1_DB
      .prepare(
        `INSERT INTO challenges 
         (title, description, category, max_members, goal, end_date, challenge_code, created_by_user_id, timer_hours, timer_minutes, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`
      )
      .bind(
        challengeName,
        goalDescription,
        category,
        Number(maxParticipants),
        goalDescription,
        endDate,
        inviteCode,
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
    await env.D1_DB
      .prepare(
        'INSERT INTO challenge_members (challenge_id, user_id, joined_at) VALUES (?, ?, datetime(\'now\'))'
      )
      .bind(challengeId, userId)
      .run();

    console.log('✅ Challenge creation complete!');
    return Response.json(
      { 
        success: true, 
        data: { challengeId }, 
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
