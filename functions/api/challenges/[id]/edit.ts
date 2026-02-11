export default async function handler(
  request: Request,
  { env, params, userId }: { env: any; params: { id: string }; userId: number }
) {
  // Top-level try/catch to capture unexpected runtime errors and ensure logs
  try {
    const method = request.method;
    const challengeId = params.id;
    const db = env.D1_DB;
    const url = new URL(request.url);
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

    // Only owner can access edit view
    if (results[0].created_by_user_id !== userId) {
      return new Response(JSON.stringify({ ok: false, message: 'Forbidden: not owner' }), { status: 403, headers: { 'Content-Type': 'application/json' } });
    }

    return Response.json(results[0]);
  }

  // PATCH /challenges/{id}/edit
  if (method === "PATCH") {
    const { results } = await db
      .prepare(`SELECT created_by_user_id FROM challenges WHERE challenge_id = ?`)
      .bind(challengeId)
      .all();

    if (results.length === 0) {
      return new Response("Challenge not found", { status: 404 });
    }

    // Only owner can update
    if (results[0].created_by_user_id !== userId) {
      return new Response(JSON.stringify({ ok: false, message: 'Forbidden: you are not the owner' }), { status: 403, headers: { 'Content-Type': 'application/json' } });
    }

    const rawBody = await request.text();
    let body: any = {};
    try {
      body = rawBody ? JSON.parse(rawBody) : {};
    } catch (errBody) {
      return new Response(JSON.stringify({ ok: false, error: `Bad JSON: ${String(errBody)}`, rawBody }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const { title, description, goal, end_date, max_members, is_private } = body;

    // Fill missing fields from DB to avoid undefined bindings
    const existing = await db.prepare(`SELECT title, description, goal, end_date, max_members, is_private FROM challenges WHERE challenge_id = ?`).bind(challengeId).first();
    if (!existing) {
      return new Response(JSON.stringify({ ok: false, error: 'Challenge not found (during update)' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
    }

    const newTitle = (typeof title !== 'undefined' && title !== null) ? title : existing.title;
    const newDescription = (typeof description !== 'undefined' && description !== null) ? description : existing.description;
    const newGoal = (typeof goal !== 'undefined' && goal !== null) ? goal : existing.goal;
    const newEndDate = (typeof end_date !== 'undefined' && end_date !== null) ? end_date : existing.end_date;
    const newMaxMembers = (typeof max_members !== 'undefined' && max_members !== null) ? max_members : existing.max_members;
    const newIsPrivate = (typeof is_private !== 'undefined' && is_private !== null) ? is_private : existing.is_private;

    try {
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
        .bind(newTitle, newDescription, newGoal, newEndDate, newMaxMembers, newIsPrivate, challengeId)
        .run();

      return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (err) {
      console.error('[challenge/edit] Update failed:', err);
      const errMsg = err instanceof Error ? `${err.message}` : String(err);
      return new Response(JSON.stringify({ ok: false, error: errMsg }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
  }

  return new Response("Method Not Allowed", { status: 405 });
  } catch (err) {
    console.error('[challenge/edit] Uncaught handler error:', err);
    const errMsg = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ ok: false, error: errMsg }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}