export async function onRequestPost(context: { request: Request; env: any }) {
  const { request, env } = context;
  const { username, password } = await request.json();

  // 1. 입력값 검증
  if (!username || !password) {
    return new Response(
      JSON.stringify({ message: "username과 password는 필수입니다." }),
      { status: 400 }
    );
  }

  try {
    // 2. 사용자 조회
    const user = await env.DB
      .prepare("SELECT id, password FROM users WHERE username = ?")
      .bind(username)
      .first();

    // 3. 로그인 실패
    if (!user || user.password !== password) {
      return new Response(
        JSON.stringify({ message: "아이디 또는 비밀번호가 틀렸습니다." }),
        { status: 401 }
      );
    }

    // 4. 로그인 성공
    return new Response(
      JSON.stringify({
        message: "로그인 성공",
        userId: user.id
      }),
      { status: 200 }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ message: "서버 오류", err }),
      { status: 500 }
    );
  }
}
