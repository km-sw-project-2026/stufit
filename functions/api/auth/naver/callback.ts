export async function onRequestGet(context: { request: Request; env: any }) {
  const { request, env } = context;
  if (!env?.D1_DB) {
    return new Response("서버 설정 오류", { status: 500 });
  }

  // 테이블 자동 생성
  await ensureTables(env.D1_DB);

  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  if (!code) {
    return new Response("인증 코드 누락", { status: 400 });
  }

  const NAVER_CLIENT_ID = env.NAVER_CLIENT_ID || "";
  const NAVER_CLIENT_SECRET = env.NAVER_CLIENT_SECRET || "";
  const redirectUri = `${url.origin}/api/auth/naver/callback`;

  if (!NAVER_CLIENT_ID || !NAVER_CLIENT_SECRET) {
    return new Response("NAVER_CLIENT_ID 또는 NAVER_CLIENT_SECRET이 설정되지 않았습니다.", { status: 500 });
  }

  try {
    // 1. code → access_token 교환
    const tokenRes = await fetch("https://nid.naver.com/oauth2.0/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        client_id: NAVER_CLIENT_ID,
        client_secret: NAVER_CLIENT_SECRET,
        code,
        state: state || "",
        redirect_uri: redirectUri,
      }),
    });
    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;
    if (!accessToken) {
      return new Response("토큰 교환 실패", { status: 400 });
    }

    // 2. access_token → 사용자 정보 조회
    const profileRes = await fetch("https://openapi.naver.com/v1/nid/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const profileData = await profileRes.json();
    const naverId = profileData?.response?.id;
    const email = profileData?.response?.email || "";
    const nickname = profileData?.response?.nickname || `naver_user`;

    if (!naverId) {
      return new Response("사용자 정보 조회 실패", { status: 400 });
    }

    // 3. social_accounts 조회 / 등록
    const existing = await env.D1_DB.prepare(
      "SELECT user_id FROM social_accounts WHERE provider = ? AND social_id = ?",
    ).bind("naver", naverId).first();

    let userId: number;
    let username: string;

    if (existing) {
      userId = existing.user_id as number;
      const user = await env.D1_DB.prepare(
        "SELECT username FROM users WHERE user_id = ?",
      ).bind(userId).first();
      username = (user as any)?.username || "";
    } else {
      // 새 사용자 생성
      const safeNick = nickname.replace(/[^a-zA-Z0-9가-힣_]/g, "");
      const baseUsername = `naver_${safeNick}`;
      username = baseUsername;
      username = await ensureUniqueUsername(env.D1_DB, username);

      await env.D1_DB.prepare(
        "INSERT INTO users (username, password) VALUES (?, ?)",
      ).bind(username, `social_naver_${naverId}`).run();

      const newUser = await env.D1_DB.prepare(
        "SELECT user_id FROM users WHERE username = ?",
      ).bind(username).first();
      userId = (newUser as any).user_id;

      await env.D1_DB.prepare(
        "INSERT INTO user_profiles (user_id, tier, score, points) VALUES (?, 'bronze', 0, 0)",
      ).bind(userId).run();

      await env.D1_DB.prepare(
        "INSERT INTO social_accounts (provider, social_id, user_id) VALUES (?, ?, ?)",
      ).bind("naver", naverId, userId).run();
    }

    // 4. 로그인 페이지로 리다이렉트 (자동 로그인 처리)
    const redirectUrl = `${url.origin}/login?socialLogin=1&userId=${userId}&username=${encodeURIComponent(username)}`;
    return Response.redirect(redirectUrl, 302);
  } catch (err: any) {
    console.error("네이버 로그인 에러:", err?.message);
    const redirectUrl = `${url.origin}/login?error=${encodeURIComponent("소셜 로그인 중 오류가 발생했습니다.")}`;
    return Response.redirect(redirectUrl, 302);
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
