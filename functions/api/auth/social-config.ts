export async function onRequestGet(context: { request: Request; env: any }) {
  const url = new URL(context.request.url);
  const origin = url.origin;

  const naverClientId = env.NAVER_CLIENT_ID || "";
  const kakaoClientId = env.KAKAO_CLIENT_ID || "";

  const naverState = Math.random().toString(36).substring(2, 10);
  const naverRedirect = `${origin}/api/auth/naver/callback`;
  const kakaoRedirect = `${origin}/api/auth/kakao/callback`;

  return new Response(JSON.stringify({
    naver: naverClientId
      ? `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${naverClientId}&redirect_uri=${encodeURIComponent(naverRedirect)}&state=${naverState}`
      : null,
    kakao: kakaoClientId
      ? `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${kakaoClientId}&redirect_uri=${encodeURIComponent(kakaoRedirect)}`
      : null,
  }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
