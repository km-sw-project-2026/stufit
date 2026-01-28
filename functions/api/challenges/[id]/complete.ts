declare interface D1Database {
  prepare(query: string): any;
}

interface Env {
  DB: D1Database;
}

type PagesFunction<T = any> = (context: { params: { id: string }, env: T }) => Promise<Response>;

export const onRequestPatch: PagesFunction<Env> = async ({ params, env }) => {
  const challengeId = params.id;
  try {
    await env.DB.prepare("UPDATE challenges SET end_date = CURRENT_TIMESTAMP WHERE challenge_id = ?")
      .bind(challengeId)
      .run();

    return Response.json({ success: true, message: "챌린지가 종료 처리되었습니다." });
  } catch (e) {
    return new Response("챌린지 종료 처리 실패", { status: 500 });
  }
};