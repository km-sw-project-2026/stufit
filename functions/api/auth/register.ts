// functions/api/auth/register.ts
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

    // 아이디 중복 체크
    const exists = await env.D1_DB
      .prepare("SELECT user_id FROM users WHERE username = ?")
      .bind(username)
      .first();

    if (exists) {
      return new Response(
        JSON.stringify({ message: "이미 사용 중인 아이디입니다." }),
        { status: 409, headers: { "Content-Type": "application/json" } }
      );
    }

    // users 테이블에 삽입
    await env.D1_DB
      .prepare("INSERT INTO users (username, password) VALUES (?, ?)")
      .bind(username, password)
      .run();

    // 새로 생성된 사용자 조회
    const newUser = await env.D1_DB
      .prepare("SELECT user_id FROM users WHERE username = ?")
      .bind(username)
      .first();

    if (!newUser) {
      throw new Error("사용자 생성 실패");
    }

    // user_profiles 초기화 (실패해도 계속)
    try {
      await env.D1_DB
        .prepare(
          "INSERT INTO user_profiles (user_id, tier, score, points) VALUES (?, ?, ?, ?)"
        )
        .bind(newUser.user_id, "bronze", 0, 0)
        .run();
    } catch (profileErr) {
      console.warn("⚠️ user_profiles 생성 실패:", (profileErr as any)?.message);
    }

    return new Response(
      JSON.stringify({ message: "회원가입 성공", userId: newUser.user_id }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("❌ REGISTER ERROR:", (err as any)?.message);
    return new Response(
      JSON.stringify({ message: "회원가입 중 오류가 발생했습니다." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
