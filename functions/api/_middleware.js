// Cloudflare Pages Functions Middleware
// X-Username 헤더를 userId로 변환

export async function onRequest(context) {
  const { request, env, next } = context;

  // 쿠키에서 sessionId 확인
  const cookieHeader = request.headers.get("Cookie");
  let sessionId = null;
  if (cookieHeader) {
    const cookies = cookieHeader.split(";").reduce((acc, cookie) => {
      const [key, value] = cookie.split("=").map(c => c.trim());
      acc[key] = value;
      return acc;
    }, {});
    sessionId = cookies["sessionId"];
  }

  let userId;

  if (sessionId && env?.D1_DB) {
    try {
      const sessionRow = await env.D1_DB.prepare(
        "SELECT user_id FROM sessions WHERE session_id = ?",
      )
        .bind(sessionId)
        .first();

      if (sessionRow?.user_id) {
        userId = sessionRow.user_id;
      }
    } catch (err) {
      console.warn("Failed to resolve sessionId to userId:", err);
    }
  }

  if (!userId) {
    console.debug("[middleware] userId not resolved from sessionId");
  } else {
    console.debug("[middleware] resolved userId:", userId);
  }

  // userId를 context에 추가
  context.userId = userId;

  // 헤더에서 잠재적으로 위험한 fallback용 헤더 제거 (보안 패치)
  const newHeaders = new Headers(request.headers);
  newHeaders.delete("X-Username");
  newHeaders.delete("X-User-Id");
  newHeaders.delete("X-UserId");
  const newRequest = new Request(request, { headers: newHeaders });

  // 다음 핸들러로 전달
  const response = await next(newRequest);
  return response;
}
