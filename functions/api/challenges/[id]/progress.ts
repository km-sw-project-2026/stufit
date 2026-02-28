// VS Code의 인식 오류를 해결하기 위한 선언
declare interface D1Database {
  prepare(query: string): any;
}

interface Env {
  D1_DB: D1Database;
}

type PagesFunction<T = any> = (context: { params: { id: string }, env: T }) => Promise<Response>;

// 실제 API 로직
export const onRequestGet: PagesFunction<Env> = async ({ params, env }) => {
  const challengeId = params.id;
  try {
    const { results } = await env.D1_DB.prepare(`
      SELECT u.username, dp.date, dp.study_time_minutes, dp.is_checked 
      FROM challenge_daily_progress dp
      JOIN users u ON dp.user_id = u.user_id
      WHERE dp.challenge_id = ?
      ORDER BY dp.date DESC
    `).bind(challengeId).all();

    return Response.json({ success: true, data: results });
  } catch (e) {
    return new Response("진행 현황 조회 실패", { status: 500 });
  }
};

// DELETE: remove all progress rows for the authenticated user in this challenge
export const onRequestDelete: PagesFunction<Env> = async ({ params, env, request }: any) => {
  const challengeId = Number(params.id);
  try {
    if (!env?.D1_DB) {
      return Response.json({ success: false, message: 'DB not configured' }, { status: 500 });
    }

    // middleware should set userId on the request context; try to extract from headers as fallback
    // The platform passes userId via context in other handlers; here use header X-User-Id if available
    const url = new URL(request.url);
    const headerUser = request.headers.get('X-Username');
    let userId: number | null = null;

    // Try to resolve user_id from username header
    if (headerUser) {
      try {
        const decoded = decodeURIComponent(headerUser);
        const row = await env.D1_DB.prepare('SELECT user_id FROM users WHERE username = ?').bind(decoded).first();
        if (row && row.user_id) userId = Number(row.user_id);
      } catch (e) {
        // ignore
      }
    }

    // If still not resolved, try query param userId
    const qUser = url.searchParams.get('userId');
    if (!userId && qUser) {
      const parsed = Number(qUser);
      if (Number.isInteger(parsed) && parsed > 0) userId = parsed;
    }

    if (!userId) {
      return Response.json({ success: false, message: 'User identification required' }, { status: 400 });
    }

    // Delete progress rows for this user & challenge
    await env.D1_DB.prepare('DELETE FROM challenge_daily_progress WHERE challenge_id = ? AND user_id = ?')
      .bind(challengeId, userId).run();

    // Also remove any challenge_results rows for this user/challenge (if applicable)
    await env.D1_DB.prepare('DELETE FROM challenge_results WHERE challenge_id = ? AND user_id = ?')
      .bind(challengeId, userId).run();

    return Response.json({ success: true, message: 'Progress cleared' });
  } catch (err) {
    console.error('progress DELETE error', err);
    return Response.json({ success: false, message: 'Server error' }, { status: 500 });
  }
};