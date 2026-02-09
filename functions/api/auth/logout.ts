// functions/api/auth/logout.ts
export async function onRequestPost(context: { request: Request; env: any }) {
  try {
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
    console.error("❌ LOGOUT ERROR:", err?.message);
    return new Response(
      JSON.stringify({ message: "로그아웃 중 오류가 발생했습니다." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
