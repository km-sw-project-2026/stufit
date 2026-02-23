declare interface D1Database {
  prepare(query: string): any;
}

interface Env {
  D1_DB: D1Database;
}

type PagesFunction<T = any> = (context: { params: { id: string }, env: T }) => Promise<Response>;

export const onRequestPatch: PagesFunction<Env> = async ({ params, env }) => {
  const challengeId = params.id;
  try {
    // 완료된 챌린지는 deleted_at을 설정하여 목록에서 제거
    await env.D1_DB.prepare("UPDATE challenges SET deleted_at = CURRENT_TIMESTAMP WHERE challenge_id = ?")
      .bind(challengeId)
      .run();

    return Response.json({ success: true, message: "챌린지가 종료 처리되었습니다." });
  } catch (e) {
    console.error('Complete error:', e);
    return new Response("챌린지 종료 처리 실패", { status: 500 });
  }
};