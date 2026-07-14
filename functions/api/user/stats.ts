// --------------원래 쓰던 코드

export const onRequestGet = async (context: {
  request: Request;
  env: any;
  userId?: number;
}) => {
  const { request, env, userId: middlewareUserId } = context;
  try {
    const url = new URL(request.url);
    const userIdArg = url.searchParams.get("userId");
    const rawUsername = request.headers.get("X-Username");
    const queryUserId = Number(userIdArg);
    const parsedUserId =
      Number.isInteger(queryUserId) && queryUserId > 0 ? queryUserId : null;
    const resolvedMiddlewareUserId =
      typeof middlewareUserId === "number" && middlewareUserId > 0
        ? middlewareUserId
        : null;
    let username = rawUsername;
    if (rawUsername) {
      try {
        username = decodeURIComponent(rawUsername);
      } catch {
        username = rawUsername;
      }
    }

    if (!env.D1_DB) {
      return Response.json({ error: "DB not configured" }, { status: 500 });
    }

    let targetUserId: number | null = parsedUserId || resolvedMiddlewareUserId;

    if (!targetUserId && username) {
      const user = await env.D1_DB.prepare(
        "SELECT user_id FROM users WHERE username = ?",
      )
        .bind(username)
        .first();
      const resolved = Number(user?.user_id);
      if (Number.isInteger(resolved) && resolved > 0) {
        targetUserId = resolved;
      }
    }

    if (!targetUserId) {
      return Response.json(
        { error: "User ID or Username required" },
        { status: 400 },
      );
    }

    let postCountResult: any = null;
    let commentCountResult: any = null;
    let profileResult: any = { points: 0, score: 0 };
    let joinDateResult: any = null;
    let completedChallengesResult: any = null;

    try {
      postCountResult = await env.D1_DB.prepare(
        "SELECT COUNT(*) as count FROM posts WHERE user_id = ? AND deleted_at IS NULL",
      )
        .bind(targetUserId)
        .first();
    } catch (postCountErr) {
      const message = String(
        (postCountErr as any)?.message || postCountErr || "",
      );
      if (
        message.includes("no such column") &&
        message.includes("deleted_at")
      ) {
        postCountResult = await env.D1_DB.prepare(
          "SELECT COUNT(*) as count FROM posts WHERE user_id = ?",
        )
          .bind(targetUserId)
          .first();
      } else {
        throw postCountErr;
      }
    }

    commentCountResult = await env.D1_DB.prepare(
      `SELECT COUNT(*) as count
       FROM comments c
       JOIN posts p ON p.post_id = c.post_id
       WHERE p.user_id = ?`,
    )
      .bind(targetUserId)
      .first();

    try {
      profileResult = await env.D1_DB.prepare(
        "SELECT points, score FROM user_profiles WHERE user_id = ?",
      )
        .bind(targetUserId)
        .first();
    } catch {
      profileResult = { points: 0, score: 0 };
    }

    try {
      joinDateResult = await env.D1_DB.prepare(
        "SELECT created_at FROM users WHERE user_id = ?",
      )
        .bind(targetUserId)
        .first();
    } catch {
      joinDateResult = null;
    }

    try {
      completedChallengesResult = await env.D1_DB.prepare(
        `SELECT COUNT(*) as count
         FROM challenges c
         JOIN challenge_members cm ON cm.challenge_id = c.challenge_id
         WHERE cm.user_id = ?
           AND c.deleted_at IS NOT NULL`,
      )
        .bind(targetUserId)
        .first();
    } catch {
      completedChallengesResult = { count: 0 };
    }

    return Response.json({
      success: true,
      stats: {
        posts: postCountResult?.count || 0,
        comments: commentCountResult?.count || 0,
        points: profileResult?.points || 0,
        score: profileResult?.score || 0,
        joinDate: joinDateResult?.created_at || null,
        completedChallenges: completedChallengesResult?.count || 0,
      },
    });
  } catch (err) {
    console.error("Stats fetch error:", err);
    return Response.json({ error: (err as Error).message }, { status: 500 });
  }
};
