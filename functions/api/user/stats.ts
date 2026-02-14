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
    // 1. 프론트엔드에서 쿼리 파라미터로 보낸 userId를 우선 확인
    const userIdArg = url.searchParams.get('userId');
    // 2. 헤더에 포함된 username을 확인 (로그에서 확인된 방식)
    const username = request.headers.get('X-Username');

    if (!env.D1_DB) {
      return Response.json({ error: 'DB not configured' }, { status: 500 });
    }

    let userId: string | number | null = userIdArg;

    // [핵심 수정] userId가 없거나 부정확할 경우 username으로 users 테이블에서 정확한 ID를 찾습니다.
    if ((!userId || userId === 'null' || userId === 'undefined') && username) {
      const user = await env.D1_DB.prepare("SELECT user_id FROM users WHERE username = ?")
        .bind(username)
        .first();
      if (user) {
        userId = user.user_id;
      }
    }

    // 최종적으로 유저를 식별할 수 없는 경우 0을 반환하여 에러를 방지합니다.
    if (!userId) {
      return Response.json({
        success: true,
        stats: { posts: 0, comments: 0, points: 0 }
      });
    }

    // 3. 게시글 수 조회 (database.sql의 posts 테이블 참조)
    const postCountResult = await env.D1_DB.prepare(
      "SELECT COUNT(*) as count FROM posts WHERE user_id = ? AND deleted_at IS NULL"
    ).bind(userId).first();

    // 4. 댓글 수 조회 (database.sql의 comments 테이블 참조)
    const commentCountResult = await env.D1_DB.prepare(
      "SELECT COUNT(*) as count FROM comments WHERE user_id = ?"
    ).bind(userId).first();

    // 5. 포인트 조회 (database.sql의 user_profiles 테이블 참조)
    const profileResult = await env.D1_DB.prepare(
      "SELECT points FROM user_profiles WHERE user_id = ?"
    ).bind(userId).first();

    // 프론트엔드 MyPage.jsx가 기대하는 형식 그대로 반환합니다.
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
    return Response.json({ 
      success: false, 
      error: (err as Error).message,
      stats: { posts: 0, comments: 0, points: 0 } 
    }, { status: 500 });
  }
};