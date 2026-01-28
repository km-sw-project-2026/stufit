export default async function handler(
  request: Request,
  { env, params, userId }: { env: any; params: { id: string }; userId: number }
) {
  const method = request.method;
  const challengeId = params.id;
  const db = env.D1_DB;

  // GET /challenges/{id}/edit
  if (method === "GET") {
    const { results } = await db
      .prepare(`
        SELECT
          challenge_id,
          created_by_user_id,
          title,
          description,
          goal,
          end_date,
          max_members,
          is_private,
          category
        FROM challenges
        WHERE challenge_id = ?
      `)
      .bind(challengeId)
      .all();

    if (results.length === 0) {
      return new Response("Challenge not found", { status: 404 });
    }

    // 👑 방장만 수정 페이지 접근 가능
    if (results[0].created_by_user_id !== userId) {
      return new Response("Forbidden", { status: 403 });
    }

    return Response.json(results[0]);
  }

  // PATCH /challenges/{id}
  if (method === "PATCH") {
    // 방장 체크
    const { results } = await db
      .prepare(`
        SELECT created_by_user_id
        FROM challenges
        WHERE challenge_id = ?
      `)
      .bind(challengeId)
      .all();

    if (results.length === 0) {
      return new Response("Challenge not found", { status: 404 });
    }

    if (results[0].created_by_user_id !== userId) {
      return new Response("Forbidden", { status: 403 });
    }

    const body = await request.json();
    const {
      title,
      description,
      goal,
      end_date,
      max_members,
      is_private
    } = body;

    await db
      .prepare(`
        UPDATE challenges
        SET
          title = ?,
          description = ?,
          goal = ?,
          end_date = ?,
          max_members = ?,
          is_private = ?
        WHERE challenge_id = ?
      `)
      .bind(
        title,
        description,
        goal,
        end_date,
        max_members,
        is_private,
        challengeId
      )
      .run();

    return Response.json({ ok: true });
  }

  return new Response("Method Not Allowed", { status: 405 });
}