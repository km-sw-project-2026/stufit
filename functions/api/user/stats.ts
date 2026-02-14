// --------------원래 쓰던 코드

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


// -------------------------------------------수정 코드(밑에)

// export const onRequestGet = async (context: { request: Request; env: any }) => {
//   const { request, env } = context;
//   try {
//     const url = new URL(request.url);
    
//     // 1. 다양한 경로로 유저 ID를 확인합니다.
//     // 로그에 찍힌 'userId: 4' 같은 형식을 우선적으로 잡습니다.
//     const queryUserId = url.searchParams.get('userId');
//     const headerUserId = request.headers.get('X-UserId');
    
//     // 유효한 ID가 있는지 확인
//     const finalUserId = queryUserId || headerUserId;

//     if (!env.D1_DB) {
//       return Response.json({ error: 'DB 설정 오류' }, { status: 500 });
//     }

//     if (!finalUserId || finalUserId === 'null' || finalUserId === 'undefined') {
//       console.log('⚠️ 유저 ID를 찾을 수 없어 0을 반환합니다.');
//       return Response.json({
//         success: true,
//         stats: { posts: 0, comments: 0, points: 0 }
//       });
//     }

//     // 2. 해당 유저가 쓴 게시글 수 계산 (posts 테이블)
//     const postCount = await env.D1_DB.prepare(
//       "SELECT COUNT(*) as count FROM posts WHERE user_id = ? AND deleted_at IS NULL"
//     ).bind(finalUserId).first();

//     // 3. 해당 유저가 쓴 댓글 수 계산 (comments 테이블)
//     const commentCount = await env.D1_DB.prepare(
//       "SELECT COUNT(*) as count FROM comments WHERE user_id = ?"
//     ).bind(finalUserId).first();

//     // 4. 포인트 정보 계산 (user_profiles 테이블)
//     const profile = await env.D1_DB.prepare(
//       "SELECT points FROM user_profiles WHERE user_id = ?"
//     ).bind(finalUserId).first();

//     // 프론트엔드 MyPage.jsx가 사용하는 형식으로 정확히 반환
//     return Response.json({
//       success: true,
//       stats: {
//         posts: postCount?.count || 0,
//         comments: commentCount?.count || 0,
//         points: profile?.points || 0
//       }
//     });

//   } catch (err: any) {
//     console.error('❌ Stats Error:', err.message);
//     return Response.json({ 
//       success: false, 
//       stats: { posts: 0, comments: 0, points: 0 } 
//     }, { status: 500 });
//   }
// };