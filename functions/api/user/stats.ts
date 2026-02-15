// --------------원래 쓰던 코드

export const onRequestGet = async (context: { request: Request; env: any; userId?: number }) => {
  const { request, env, userId: middlewareUserId } = context;
  try {
    const url = new URL(request.url);
    const userIdArg = url.searchParams.get('userId');
    const rawUsername = request.headers.get('X-Username');
    const queryUserId = Number(userIdArg);
    const parsedUserId = Number.isInteger(queryUserId) && queryUserId > 0 ? queryUserId : null;
    const resolvedMiddlewareUserId = typeof middlewareUserId === 'number' && middlewareUserId > 0 ? middlewareUserId : null;
    let username = rawUsername;
    if (rawUsername) {
      try {
        username = decodeURIComponent(rawUsername);
      } catch {
        username = rawUsername;
      }
    }

    if (!env.D1_DB) {
      return Response.json({ error: 'DB not configured' }, { status: 500 });
    }

    let userId: number | null = resolvedMiddlewareUserId;

    if (!userId && username) {
      const user = await env.D1_DB.prepare("SELECT user_id FROM users WHERE username = ?").bind(username).first();
      const resolved = Number(user?.user_id);
      if (Number.isInteger(resolved) && resolved > 0) {
        userId = resolved;
      }
    }

    // fallback: username 해석이 안될 때만 query userId 사용
    if (!userId) {
      userId = parsedUserId;
    }

    if (!userId) {
      return Response.json({ error: 'User ID or Username required' }, { status: 400 });
    }

    // 1. 게시글 수 조회
    const postCountResult = await env.D1_DB.prepare(
      "SELECT COUNT(*) as count FROM posts WHERE user_id = ? AND deleted_at IS NULL"
    ).bind(userId).first();

    // 2. 댓글 수 조회
    const commentCountResult = await env.D1_DB.prepare(
      "SELECT COUNT(*) as count FROM comments WHERE user_id = ?"
    ).bind(userId).first();

    // 3. 포인트와 점수 조회
    const profileResult = await env.D1_DB.prepare(
      "SELECT points, score FROM user_profiles WHERE user_id = ?"
    ).bind(userId).first();

    return Response.json({
      success: true,
      stats: {
        posts: postCountResult?.count || 0,
        comments: commentCountResult?.count || 0,
        points: profileResult?.points || 0,
        score: profileResult?.score || 0
      }
    });

  } catch (err) {
    console.error('Stats fetch error:', err);
    return Response.json({ error: (err as Error).message }, { status: 500 });
  }
};

