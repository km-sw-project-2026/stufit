declare interface D1Database {
  prepare(query: string): any;
}

interface Env {
  D1_DB: D1Database;
}

type PagesFunction<T = any> = (context: { request: Request, params: { id: string }, env: T }) => Promise<Response>;

export const onRequest: PagesFunction<Env> = async ({ request, params, env }) => {
  const challengeId = params.id;
  const { userId, score } = await request.json() as { userId: string, score: number };

  try {
    await env.D1_DB.prepare(`
      INSERT INTO challenge_results (user_id, challenge_id, score) 
      VALUES (?, ?, ?)
      ON CONFLICT(user_id, challenge_id) DO UPDATE SET score = excluded.score
    `).bind(userId, challengeId, score).run();

    return Response.json({ success: true, message: "점수가 성공적으로 입력되었습니다." });
  } catch (e) {
    return new Response("점수 입력 실패", { status: 500 });
  }
};