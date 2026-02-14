// --------------원래 쓰던 코드

// export const onRequestGet = async (context: { request: Request; env: any }) => {
//   const { request, env } = context;
//   try {
//     const url = new URL(request.url);
//     const userIdArg = url.searchParams.get('userId');
//     const username = request.headers.get('X-Username');

//     if (!env.D1_DB) {
//       return Response.json({ error: 'DB not configured' }, { status: 500 });
//     }

//     let userId = userIdArg;

//     // 만약 userId가 없으면 username으로 조회
//     if (!userId && username) {
//       const user = await env.D1_DB.prepare("SELECT user_id FROM users WHERE username = ?").bind(username).first();
//       if (user) userId = user.user_id;
//     }

//     if (!userId) {
//       return Response.json({ error: 'User ID or Username required' }, { status: 400 });
//     }

//     // 1. 게시글 수 조회
//     const postCountResult = await env.D1_DB.prepare(
//       "SELECT COUNT(*) as count FROM posts WHERE user_id = ? AND deleted_at IS NULL"
//     ).bind(userId).first();

//     // 2. 댓글 수 조회
//     const commentCountResult = await env.D1_DB.prepare(
//       "SELECT COUNT(*) as count FROM comments WHERE user_id = ?"
//     ).bind(userId).first();

//     // 3. 포인트 조회 (기존 /api/user/points 로직 통합)
//     const profileResult = await env.D1_DB.prepare(
//       "SELECT points FROM user_profiles WHERE user_id = ?"
//     ).bind(userId).first();

//     return Response.json({
//       success: true,
//       stats: {
//         posts: postCountResult?.count || 0,
//         comments: commentCountResult?.count || 0,
//         points: profileResult?.points || 0
//       }
//     });

//   } catch (err) {
//     console.error('Stats fetch error:', err);
//     return Response.json({ error: (err as Error).message }, { status: 500 });
//   }
// };


// -------------------------------------------수정 코드(밑에)

export const onRequestGet = async (context: { request: Request; env: any }) => {
  const { request, env } = context;
  try {
    const url = new URL(request.url);
    const userIdArg = url.searchParams.get('userId');
    const username = request.headers.get('X-Username');

    if (!env.D1_DB) {
      return Response.json({ error: 'DB not configured' }, { status: 500 });
    }

    let userId: string | number | null = userIdArg;

    // 1. 유저 ID가 없는 경우 username으로 user_id를 찾아옵니다.
    // DB 스크린샷에 따라 'user_profiles' 테이블을 참조하도록 수정했습니다.
    if (!userId && username) {
      const user = await env.D1_DB.prepare("SELECT user_id FROM user_profiles WHERE username = ?")
        .bind(username)
        .first();
      if (user) {
        userId = user.user_id;
      }
    }

    if (!userId) {
      return Response.json({ error: 'User ID or Username required' }, { status: 400 });
    }

    // 2. 게시글 수 조회 (deleted_at이 없는 실제 게시글만 카운트)
    const postCountResult = await env.D1_DB.prepare(
      "SELECT COUNT(*) as count FROM posts WHERE user_id = ? AND deleted_at IS NULL"
    ).bind(userId).first();

    // 3. 댓글 수 조회
    const commentCountResult = await env.D1_DB.prepare(
      "SELECT COUNT(*) as count FROM comments WHERE user_id = ?"
    ).bind(userId).first();

    // 4. 포인트 조회
    const profileResult = await env.D1_DB.prepare(
      "SELECT points FROM user_profiles WHERE user_id = ?"
    ).bind(userId).first();

    // 기존 stats 구조를 그대로 유지하여 반환합니다.
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