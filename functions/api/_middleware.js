// Cloudflare Pages Functions Middleware
// X-Username 헤더를 userId로 변환

export async function onRequest(context) {
  const { request, env, next } = context;
  
  // X-Username 헤더 확인 (인코딩된 값도 처리할 수 있도록 디코드)
  const rawUsername = request.headers.get('X-Username');
  const username = rawUsername ? decodeURIComponent(rawUsername) : null;
  
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
  
  // userId를 context에 추가
  context.userId = userId;
  
  // 다음 핸들러로 전달
  const response = await next();
  return response;
}
