export const onRequestGet = async (context: { request: Request; env: any }) => {
  const { request, env } = context;
  try {
    const url = new URL(request.url);
    const userIdArg = url.searchParams.get('userId');
    const username = request.headers.get('X-Username');

    if (!env.D1_DB) {
      return Response.json({ error: 'DB not configured' }, { status: 500 });
    }

    let userId = userIdArg;

    // 만약 userId가 없으면 username으로 조회
    if (!userId && username) {
      const user = await env.D1_DB.prepare("SELECT user_id FROM users WHERE username = ?").bind(username).first();
      if (user) userId = user.user_id;
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

    // 3. 포인트 조회 (기존 /api/user/points 로직 통합)
    const profileResult = await env.D1_DB.prepare(
      "SELECT points FROM user_profiles WHERE user_id = ?"
    ).bind(userId).first();

    return Response.json({
      success: true,
      stats: {
        posts: postCountResult?.count || 0,
        comments: commentCountResult?.count || 0,
        points: profileResult?.points || 0
      }
    });

  } catch (err) {
    console.error('Stats fetch error:', err);
    return Response.json({ error: (err as Error).message }, { status: 500 });
  }
};
