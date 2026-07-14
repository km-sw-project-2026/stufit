export async function onRequestGet(context: { request: Request; env: any }) {
  const { request, env } = context;
  if (!env?.D1_DB) {
    return new Response("서버 설정 오류", { status: 500 });
  }

  // 테이블 자동 생성
  await ensureTables(env.D1_DB);

  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return new Response("인증 코드 누락", { status: 400 });
  }

  const KAKAO_CLIENT_ID = env.KAKAO_CLIENT_ID || "";
  const KAKAO_CLIENT_SECRET = env.KAKAO_CLIENT_SECRET || "";
  const redirectUri = `${url.origin}/api/auth/kakao/callback`;

  if (!KAKAO_CLIENT_ID) {
    return new Response("KAKAO_CLIENT_ID가 설정되지 않았습니다.", { status: 500 });
  }

  try {
    // 1. code → access_token 교환
    const tokenRes = await fetch("https://kauth.kakao.com/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        client_id: KAKAO_CLIENT_ID,
        client_secret: KAKAO_CLIENT_SECRET,
        code,
        redirect_uri: redirectUri,
      }),
    });
    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;
    if (!accessToken) {
      return new Response("토큰 교환 실패", { status: 400 });
    }

    // 2. access_token → 사용자 정보 조회
    const profileRes = await fetch("https://kapi.kakao.com/v2/user/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const profileData = await profileRes.json();
    const kakaoId = String(profileData?.id || "");
    const kakaoAccount = profileData?.kakao_account || {};
    const profile = kakaoAccount?.profile || {};
    const nickname = profile?.nickname || `u`;

    if (!kakaoId) {
      return new Response("사용자 정보 조회 실패", { status: 400 });
    }

    // 3. social_accounts 조회 / 등록
    const existing = await env.D1_DB.prepare(
      "SELECT user_id FROM social_accounts WHERE provider = ? AND social_id = ?",
    ).bind("kakao", kakaoId).first();

    let userId: number;
    let username: string;

    if (existing) {
      userId = existing.user_id as number;
      const user = await env.D1_DB.prepare(
        "SELECT username FROM users WHERE user_id = ?",
      ).bind(userId).first();
      username = (user as any)?.username || "";
    } else {
      const safeNick = nickname.replace(/[^a-zA-Z0-9가-힣_]/g, "");
      const baseUsername = `k${safeNick}`;
      username = await ensureUniqueUsername(env.D1_DB, baseUsername);

      await env.D1_DB.prepare(
        "INSERT INTO users (username, password) VALUES (?, ?)",
      ).bind(username, `social_kakao_${kakaoId}`).run();

      const newUser = await env.D1_DB.prepare(
        "SELECT user_id FROM users WHERE username = ?",
      ).bind(username).first();
      userId = (newUser as any).user_id;

      await env.D1_DB.prepare(
        "INSERT INTO user_profiles (user_id, tier, score, points) VALUES (?, 'bronze', 0, 0)",
      ).bind(userId).run();

      await env.D1_DB.prepare(
        "INSERT INTO social_accounts (provider, social_id, user_id) VALUES (?, ?, ?)",
      ).bind("kakao", kakaoId, userId).run();
    }

    // 4. HTML 페이지로 직접 응답 (SPA fallback 우회)
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>로그인 처리중</title></head><body><script>
      localStorage.setItem("username", ${JSON.stringify(username)});
      localStorage.setItem("userId", "${userId}");
      localStorage.setItem("joinDate", new Date().toLocaleDateString("ko-KR"));
      window.dispatchEvent(new Event("loginStatusChanged"));
      window.location.href = "/challenge";
    </script>로그인 처리중...</body></html>`;
    return new Response(html, {
      status: 200,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  } catch (err: any) {
    console.error("카카오 로그인 에러:", err?.message);
    const errorHtml = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>로그인 오류</title></head><body><script>alert("소셜 로그인 중 오류가 발생했습니다.");window.location.href="/login";</script></body></html>`;
    return new Response(errorHtml, { status: 200, headers: { "Content-Type": "text/html; charset=utf-8" } });
  }
}

async function ensureUniqueUsername(db: any, base: string): Promise<string> {
  let username = base;
  let suffix = 1;
  while (true) {
    const existed = await db.prepare("SELECT user_id FROM users WHERE username = ?").bind(username).first();
    if (!existed) return username;
    username = `${base}_${suffix}`;
    suffix++;
  }
}

async function ensureTables(db: any) {
  await db.prepare(`CREATE TABLE IF NOT EXISTS social_accounts (
    provider TEXT NOT NULL,
    social_id TEXT NOT NULL,
    user_id INTEGER NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (provider, social_id)
  )`).run();
}
