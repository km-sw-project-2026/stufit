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
    // status 컬럼이 있는지 확인
    const pragma = await env.D1_DB.prepare("PRAGMA table_info('challenges')").all();
    const hasStatus = (pragma.results || []).some((c: any) => c.name === 'status');

    if (hasStatus) {
      // status 컬럼이 있으면 completed로 설정
      await env.D1_DB.prepare("UPDATE challenges SET status = 'completed', end_date = CURRENT_TIMESTAMP WHERE challenge_id = ?")
        .bind(challengeId)
        .run();
    } else {
      // status 컬럼이 없으면 end_date만 업데이트 (과거 시간으로 설정)
      await env.D1_DB.prepare("UPDATE challenges SET end_date = datetime('now', '-1 day') WHERE challenge_id = ?")
        .bind(challengeId)
        .run();
    }

    return Response.json({ success: true, message: "챌린지가 종료 처리되었습니다." });
  } catch (e) {
    console.error('Complete error:', e);
    return new Response("챌린지 종료 처리 실패", { status: 500 });
  }
};