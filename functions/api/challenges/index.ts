type HandlerContext = {
  env: any;
  userId: number;
};

export default async function handler(request: Request, { env, userId }: HandlerContext) {
  try {
    if (request.method !== 'POST') return new Response('Method not allowed', { status: 405 });

    const body = await request.json();
    const { challengeName, category, maxParticipants, endDate, goalDescription, inviteCode } = body;

    if (!challengeName || !category || !maxParticipants || !endDate || !goalDescription || !inviteCode) {
      return Response.json({ success: false, message: '필수 값 누락' }, { status: 400 });
    }

    if (isNaN(Number(maxParticipants)) || Number(maxParticipants) <= 0) {
      return Response.json({ success: false, message: 'maxParticipants 숫자 오류' }, { status: 400 });
    }

    if (!['DAILY', 'STUDY', 'EXERCISE'].includes(category)) {
      return Response.json({ success: false, message: 'category 값 오류' }, { status: 400 });
    }

    const exists = await env.D1_DB.prepare('SELECT 1 FROM challenges WHERE challenge_code = ?')
      .bind(inviteCode).first();
    if (exists) return Response.json({ success: false, message: 'inviteCode 중복' }, { status: 409 });

    const result = await env.D1_DB.prepare(
      `INSERT INTO challenges 
       (title, category, max_members, goal, end_date, challenge_code, created_by_user_id, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))`
    ).bind(challengeName, category, maxParticipants, goalDescription, endDate, inviteCode, userId).run();

    const challengeId = result.lastInsertRowid;

    await env.D1_DB.prepare(
      'INSERT INTO challenge_members (challenge_id, user_id, joined_at) VALUES (?, ?, datetime(\'now\'))'
    ).bind(challengeId, userId).run();

    return Response.json({ success: true, data: { challengeId }, message: '챌린지 생성 완료' });

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return Response.json({ success: false, message: 'DB 오류 발생', error: message }, { status: 500 });
  }
}
