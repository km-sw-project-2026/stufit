type HandlerContext = {
  env: any;
  userId: number;
};

export default async function handler(request: Request, { env, userId }: HandlerContext) {
  try {
    if (request.method !== 'PATCH') return new Response('Method not allowed', { status: 405 });

    const id = Number(new URL(request.url).pathname.split('/')[3]);
    if (Number.isNaN(id)) return new Response('Invalid challengeId', { status: 400 });

    const today = new Date().toISOString().slice(0, 10);

    const already = await env.D1_DB.prepare(
      'SELECT 1 FROM challenge_daily_progress WHERE challenge_id = ? AND user_id = ? AND date = ?'
    ).bind(id, userId, today).first();

    if (already) return Response.json({ success: false, message: '오늘 이미 인증 완료' }, { status: 400 });

    await env.D1_DB.prepare(
      'INSERT INTO challenge_daily_progress (challenge_id, user_id, date, is_checked, study_time_minutes) VALUES (?, ?, ?, 1, 0)'
    ).bind(id, userId, today).run();

    console.log(`[Verify] Inserted progress for user ${userId}, challenge ${id}`);

    // Update challenge_members status to 'submitted' (check if column exists)
    try {
      const pragma = await env.D1_DB.prepare("PRAGMA table_info('challenge_members')").all();
      const hasStatus = (pragma.results || []).some((c: any) => c.name === 'status');
      
      if (hasStatus) {
        const updateResult = await env.D1_DB.prepare(
          'UPDATE challenge_members SET status = ? WHERE challenge_id = ? AND user_id = ?'
        ).bind('submitted', id, userId).run();
        console.log(`[Verify] Updated status to 'submitted' for user ${userId}, challenge ${id}`, updateResult);
      } else {
        console.warn('[Verify] status column does not exist in challenge_members');
      }
    } catch (statusErr) {
      console.error('[Verify] Failed to update status:', statusErr);
    }

    const progressCount = await env.D1_DB.prepare(
      'SELECT COUNT(*) as cnt FROM challenge_daily_progress WHERE challenge_id = ? AND user_id = ?'
    ).bind(id, userId).first();

    const newProgressRate = progressCount.cnt * 10;
    const earnedPoint = 100;
    const currentStreak = 1;

    return Response.json({
      success: true,
      data: { newProgressRate, earnedPoint, currentStreak },
      message: '오늘 인증 완료'
    });

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return Response.json({ success: false, message: 'DB 오류 발생', error: message }, { status: 500 });
  }
}
