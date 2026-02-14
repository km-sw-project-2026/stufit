type HandlerContext = {
  env: any;
  userId: number;
};

export default async function handler(request: Request, { env, userId }: HandlerContext) {
  console.log('[Verify] Handler called, userId:', userId);
  try {
    if (request.method !== 'PATCH') return new Response('Method not allowed', { status: 405 });

    const id = Number(new URL(request.url).pathname.split('/')[3]);
    console.log('[Verify] challenge_id:', id);
    if (Number.isNaN(id)) return new Response('Invalid challengeId', { status: 400 });

    // 한국 시간(UTC+9) 기준 현재 날짜
    const now = new Date();
    const koreanTime = new Date(now.getTime() + 9 * 60 * 60 * 1000);
    const today = koreanTime.toISOString().split('T')[0];
    console.log('[Verify] today:', today);

    const already = await env.D1_DB.prepare(
      'SELECT 1 FROM challenge_daily_progress WHERE challenge_id = ? AND user_id = ? AND date = ?'
    ).bind(id, userId, today).first();

    if (already) return Response.json({ success: false, message: '오늘 이미 인증 완료' }, { status: 400 });

    await env.D1_DB.prepare(
      'INSERT INTO challenge_daily_progress (challenge_id, user_id, date, is_checked, study_time_minutes) VALUES (?, ?, ?, 1, 0)'
    ).bind(id, userId, today).run();

    console.log('[Verify] Inserted progress for user ${userId}, challenge ${id}');

    // Update challenge_members status to 'submitted' (check if column exists)
    console.log('[Verify] About to update status...');
    try {
      const updateResult = await env.D1_DB.prepare(
        'UPDATE challenge_members SET status = ? WHERE challenge_id = ? AND user_id = ?'
      ).bind('submitted', id, userId).run();
      console.log('[Verify] Status update result:', JSON.stringify(updateResult));
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
