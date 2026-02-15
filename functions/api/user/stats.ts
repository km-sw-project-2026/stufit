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

    let postCountResult: any = null;
    let commentCountResult: any = null;
    let profileResult: any = { points: 0, score: 0 };

    if (username) {
      try {
        postCountResult = await env.D1_DB.prepare(
          `SELECT COUNT(*) as count
           FROM posts p
           JOIN users u ON u.user_id = p.user_id
           WHERE u.username = ? AND p.deleted_at IS NULL`
        ).bind(username).first();
      } catch (postCountErr) {
        const message = String((postCountErr as any)?.message || postCountErr || '');
        if (message.includes('no such column') && message.includes('deleted_at')) {
          postCountResult = await env.D1_DB.prepare(
            `SELECT COUNT(*) as count
             FROM posts p
             JOIN users u ON u.user_id = p.user_id
             WHERE u.username = ?`
          ).bind(username).first();
        } else {
          throw postCountErr;
        }
      }

      // 댓글 수 기준: 내가 작성한 글들에 달린 댓글 총합
      commentCountResult = await env.D1_DB.prepare(
        `SELECT COUNT(*) as count
         FROM comments c
         JOIN posts p ON p.post_id = c.post_id
         JOIN users u ON u.user_id = p.user_id
         WHERE u.username = ?`
      ).bind(username).first();

      try {
        profileResult = await env.D1_DB.prepare(
          `SELECT up.points as points, up.score as score
           FROM user_profiles up
           JOIN users u ON u.user_id = up.user_id
           WHERE u.username = ?`
        ).bind(username).first();
      } catch {
        profileResult = { points: 0, score: 0 };
      }
    } else {
      try {
        postCountResult = await env.D1_DB.prepare(
          "SELECT COUNT(*) as count FROM posts WHERE user_id = ? AND deleted_at IS NULL"
        ).bind(userId).first();
      } catch (postCountErr) {
        const message = String((postCountErr as any)?.message || postCountErr || '');
        if (message.includes('no such column') && message.includes('deleted_at')) {
          postCountResult = await env.D1_DB.prepare(
            "SELECT COUNT(*) as count FROM posts WHERE user_id = ?"
          ).bind(userId).first();
        } else {
          throw postCountErr;
        }
      }

      // 댓글 수 기준: 내 글에 달린 댓글 총합
      commentCountResult = await env.D1_DB.prepare(
        `SELECT COUNT(*) as count
         FROM comments c
         JOIN posts p ON p.post_id = c.post_id
         WHERE p.user_id = ?`
      ).bind(userId).first();

      try {
        profileResult = await env.D1_DB.prepare(
          "SELECT points, score FROM user_profiles WHERE user_id = ?"
        ).bind(userId).first();
      } catch {
        profileResult = { points: 0, score: 0 };
      }
    }

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

