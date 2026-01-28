export default async function handler(
  request: Request,
  { env, params, userId }: { env: any; params: { id: string }; userId: number }
) {
  if (request.method !== "GET") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const db = env.D1_DB;
  const challengeId = params.id;

  // 참여자인지 확인
  const memberCheck = await db
    .prepare(
      "SELECT 1 FROM challenge_members WHERE challenge_id = ? AND user_id = ?"
    )
    .bind(challengeId, userId)
    .all();

  if (memberCheck.results.length === 0) {
    return new Response("Forbidden", { status: 403 });
  }

  // 결과 조회
  const { results } = await db
    .prepare(
      `
      SELECT user_id, score
      FROM challenge_results
      WHERE challenge_id = ?
      ORDER BY score DESC
      `
    )
    .bind(challengeId)
    .all();

  return Response.json(results);
}
