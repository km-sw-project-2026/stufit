// functions/api/auth/register.ts
export async function onRequestPost(context: { request: Request; env: any }) {
  const { request, env } = context;
  const { username, password } = await request.json();

  // 1. 유효성 검사
  if (!username || !password) {
    return new Response(
      JSON.stringify({ message: "username과 password는 필수입니다." }),
      { status: 400 }
    );
  }

  try {
    // 2. 아이디 중복 체크
    const exists = await env.DB
      .prepare("SELECT id FROM users WHERE username = ?")
      .bind(username)
      .first();

    if (exists) {
      return new Response(
        JSON.stringify({ message: "이미 사용 중인 아이디입니다." }),
        { status: 409 }
      );
    }

    // 3. 회원 생성
    await env.DB
      .prepare("INSERT INTO users (username, password) VALUES (?, ?)")
      .bind(username, password)
      .run();

    // 4. 성공 응답
    return new Response(
      JSON.stringify({ message: "회원가입 성공" }),
      { status: 201 }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ message: "서버 오류", err }),
      { status: 500 }
    );
  }
}