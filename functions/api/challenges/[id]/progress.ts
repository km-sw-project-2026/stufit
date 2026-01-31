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