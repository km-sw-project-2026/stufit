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


// 에디터 빨간 줄 방지를 위한 타입 정의
interface D1Database {
  prepare: (query: string) => {
    bind: (...args: any[]) => {
      first: <T = any>() => Promise<T | null>;
    };
  };
}

interface Env {
  D1_DB: D1Database;
}

type PagesFunction<E = any> = (context: {
  request: Request;
  env: E;
}) => Promise<Response>;

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return new Response(JSON.stringify({ error: 'User ID is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    // D1 Studio의 posts, comments 테이블에서 개수를 직접 가져옵니다.
    const [postsRes, commentsRes, userRes] = await Promise.all([
      env.D1_DB.prepare("SELECT COUNT(*) as count FROM posts WHERE user_id = ? AND deleted_at IS NULL").bind(userId).first(),
      env.D1_DB.prepare("SELECT COUNT(*) as count FROM comments WHERE user_id = ? AND deleted_at IS NULL").bind(userId).first(),
      env.D1_DB.prepare("SELECT points FROM users WHERE user_id = ?").bind(userId).first()
    ]);

    return new Response(JSON.stringify({
      success: true,
      stats: {
        posts: (postsRes as any)?.count || 0,
        comments: (commentsRes as any)?.count || 0,
        points: (userRes as any)?.points || 0
      }
    }), {
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};