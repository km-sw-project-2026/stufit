export default async function handler(
  request: Request,
  { env, params, userId }: { env: any; params: { id: string }; userId: number }
) {
  if (request.method !== "DELETE") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const db = env.DB;
  const challengeId = params.id;

  // 방장 여부 확인
  const { results } = await db
    .prepare(
      "SELECT created_by_user_id FROM challenges WHERE challenge_id = ?"
    )
    .bind(challengeId)
    .all();

  if (results.length === 0) {
    return new Response("Challenge not found", { status: 404 });
  }

  const isOwner = results[0].created_by_user_id === userId;

  if (isOwner) {
    // 방장이면 챌린지 삭제
    await db
      .prepare("DELETE FROM challenges WHERE challenge_id = ?")
      .bind(challengeId)
      .run();
  } else {
    // 멤버 나가기
    await db
      .prepare(
        "DELETE FROM challenge_members WHERE challenge_id = ? AND user_id = ?"
      )
      .bind(challengeId, userId)
      .run();

    // 점수 -100
    await db
      .prepare("UPDATE user_profiles SET score = score - 100 WHERE user_id = ?")
      .bind(userId)
      .run();
  }

  return Response.json({ ok: true });
}
