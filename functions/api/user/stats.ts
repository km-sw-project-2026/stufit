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

// 1. 에디터가 인식하지 못하는 클라우드플레어 전용 타입들을 직접 정의합니다.
interface D1Database {
  prepare: (query: string) => {
    bind: (...args: any[]) => {
      first: <T = any>() => Promise<T | null>;
      all: <T = any>() => Promise<{ results: T[] }>;
    };
  };
  batch: (queries: any[]) => Promise<any[]>;
}

interface Env {
  // Cloudflare 대시보드에 설정한 Binding 이름과 정확히 일치해야 합니다.
  D1_DB: D1Database; 
}

// 2. PagesFunction 타입을 정의하여 context 내부의 env와 request를 인식시킵니다.
type PagesFunction<E = any> = (context: {
  request: Request;
  env: E;
  params: Record<string, string>;
}) => Promise<Response>;

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  // 유저 ID가 없는 경우 에러 처리
  if (!userId) {
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'User ID is required' 
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    // 3. 실제 DB에서 게시글 수, 댓글 수, 포인트를 가져옵니다.
    // D1 Studio의 테이블 구조(posts, comments, users)를 기반으로 쿼리합니다.
    const [postsRes, commentsRes, userRes] = await Promise.all([
      env.D1_DB.prepare("SELECT COUNT(*) as count FROM posts WHERE userId = ?").bind(userId).first(),
      env.D1_DB.prepare("SELECT COUNT(*) as count FROM comments WHERE userId = ?").bind(userId).first(),
      env.D1_DB.prepare("SELECT points FROM users WHERE id = ?").bind(userId).first()
    ]);

    // 결과값이 없을 경우를 대비해 기본값 0을 설정합니다.
    const postsCount = (postsRes as any)?.count || 0;
    const commentsCount = (commentsRes as any)?.count || 0;
    const pointsCount = (userRes as any)?.points || 0;

    return new Response(JSON.stringify({
      success: true,
      stats: {
        posts: postsCount,
        comments: commentsCount,
        points: pointsCount
      }
    }), {
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache' 
      }
    });

  } catch (error: any) {
    // 500 에러 발생 시 구체적인 원인을 반환하도록 설정합니다.
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};