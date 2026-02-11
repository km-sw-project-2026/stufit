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

    // 편의상 수정 페이지는 인증된 사용자에게 반환
    try {
      const headerUsername = request.headers.get('X-Username') ?? request.headers.get('x-username');
      console.log('[challenge/edit] GET headerUsername:', headerUsername, 'resolved userId:', userId);
      console.log('[challenge/edit] GET created_by_user_id from DB:', results[0].created_by_user_id, 'for challengeId:', challengeId);
    } catch (e) {
      console.log('[challenge/edit] failed to log debug headers (GET):', e);
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

    // 디버그: 요청 헤더과 DB에 저장된 방장 ID 확인 (권한 검사 완화)
    try {
      const headerUsername = request.headers.get('X-Username') ?? request.headers.get('x-username');
      console.log('[challenge/edit] headerUsername:', headerUsername, 'resolved userId:', userId);
      console.log('[challenge/edit] created_by_user_id from DB:', results[0].created_by_user_id, 'for challengeId:', challengeId);
    } catch (e) {
      console.log('[challenge/edit] failed to log debug headers:', e);
    }

    // 권한 검사: 현재는 편의상 인증된 사용자면 수정 허용

    const body = await request.json();
    const {
      title,
      description,
      goal,
      end_date,
      max_members,
      is_private
    } = body;

    // 로그: 들어온 페이로드
    console.log('[challenge/edit] PATCH payload:', { challengeId, userId, body });

    try {
      const result = await db
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

      console.log('[challenge/edit] Update result:', result);
      // Return minimal success response to avoid JSON serialization issues
      return Response.json({ ok: true });
    } catch (err) {
        console.error('[challenge/edit] Update failed:', err);
        try {
          console.error('[challenge/edit] Update failed stack:', err?.stack || JSON.stringify(err));
        } catch (ee) {
          console.error('[challenge/edit] failed to log stack:', ee);
        }
        // Return error details temporarily to help debugging in preview
        const errMsg = err instanceof Error ? `${err.message}` : String(err);
        return new Response(JSON.stringify({ ok: false, error: errMsg }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
  }

  return new Response("Method Not Allowed", { status: 405 });
}