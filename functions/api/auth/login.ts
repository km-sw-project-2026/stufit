export async function onRequestPost(context: { request: Request; env: any }) {
  try {
    const { request, env } = context;

    if (!env?.D1_DB) {
      console.error("❌ D1_DB 없음");
      return new Response(
        JSON.stringify({ message: "서버 설정 오류입니다." }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    let body;
    try {
      body = await request.json();
    } catch (parseErr) {
      console.error("❌ JSON 파싱 오류:", parseErr);
      return new Response(
        JSON.stringify({ message: "요청 본문이 유효하지 않습니다." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const { username, password } = body;

    if (!username || !password) {
      return new Response(
        JSON.stringify({ message: "username과 password는 필수입니다." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // 사용자 조회
    const user = await env.D1_DB
      .prepare("SELECT user_id, password FROM users WHERE username = ?")
      .bind(username)
      .first();

    if (!user || user.password !== password) {
      return new Response(
        JSON.stringify({ message: "아이디 또는 비밀번호가 틀렸습니다." }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        message: "로그인 성공",
        userId: user.user_id
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("❌ LOGIN ERROR:", err?.message);
    return new Response(
      JSON.stringify({ message: "서버 오류가 발생했습니다." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

