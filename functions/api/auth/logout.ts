// functions/api/auth/logout.ts
export async function onRequestPost(context: { request: Request; env: any }) {
  try {
    // 로그아웃은 클라이언트 측에서 토큰을 제거하는 것이 주요 작업
    // 서버 측에서는 성공 메시지만 반환
    return new Response(
      JSON.stringify({ message: "로그아웃 성공" }),
      { 
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ message: "서버 오류", err }),
      { status: 500 }
    );
  }
}
