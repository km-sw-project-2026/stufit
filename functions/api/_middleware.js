// Cloudflare Pages Functions Middleware
// X-Username 헤더를 userId로 변환

export async function onRequest(context) {
  const { request, env, next } = context;
  
  // X-Username 헤더 확인
  const username = request.headers.get('X-Username');
  
  let userId;
  
  if (username && env?.D1_DB) {
    try {
      // username으로 userId 조회
      const userRow = await env.D1_DB
        .prepare('SELECT user_id FROM users WHERE username = ?')
        .bind(username)
        .first();
      
      if (userRow?.user_id) {
        userId = userRow.user_id;
      }
    } catch (err) {
      console.warn('Failed to resolve username to userId:', err);
    }
  }

  // Fallback: allow clients to send userId directly (useful for dev or when username lookup fails)
  if (!userId) {
    const headerUserId = request.headers.get('X-User-Id') || request.headers.get('X-UserId');
    if (headerUserId) {
      const parsed = Number(headerUserId);
      if (!Number.isNaN(parsed)) {
        userId = parsed;
      }
    }
  }

  if (!userId) {
    // Add a helpful debug note; avoid leaking sensitive data in production logs.
    console.debug('[middleware] userId not resolved from X-Username or X-User-Id');
  } else {
    console.debug('[middleware] resolved userId:', userId);
  }
  
  // userId를 context에 추가
  context.userId = userId;
  
  // 다음 핸들러로 전달
  const response = await next();
  return response;
}
