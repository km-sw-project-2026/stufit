import { resolveTierFromScore } from "../utils/tier";

export async function onRequestGet(context: {
  request: Request;
  env: any;
  userId?: number;
}) {
  try {
    const { request, env, userId: authenticatedUserId } = context;

    if (!env?.D1_DB) {
      return new Response(
        JSON.stringify({ message: "서버 설정 오류입니다." }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }

    const url = new URL(request.url);
    const userIdRaw = url.searchParams.get("userId");
    const fallbackUserId = Number(userIdRaw);
    const userId =
      typeof authenticatedUserId === "number"
        ? authenticatedUserId
        : fallbackUserId;

    if (!userId || Number.isNaN(userId)) {
      return new Response(JSON.stringify({ message: "userId가 필요합니다." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const existingUser = await env.D1_DB.prepare(
      "SELECT user_id FROM users WHERE user_id = ?",
    )
      .bind(userId)
      .first();

    if (!existingUser) {
      return new Response(
        JSON.stringify({
          message: "유효하지 않은 사용자입니다. 다시 로그인 후 시도해주세요.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const profile = await env.D1_DB.prepare(
      "SELECT points FROM user_profiles WHERE user_id = ?",
    )
      .bind(userId)
      .first();

    if (!profile) {
      return new Response(
        JSON.stringify({ message: "사용자 정보를 찾을 수 없습니다." }),
        { status: 404, headers: { "Content-Type": "application/json" } },
      );
    }

    return new Response(
      JSON.stringify({ success: true, points: profile.points ?? 0 }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("❌ POINTS GET ERROR:", (err as any)?.message);
    return new Response(
      JSON.stringify({ message: "포인트를 불러올 수 없습니다." }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}

export async function onRequestPost(context: {
  request: Request;
  env: any;
  userId?: number;
}) {
  try {
    const { request, env, userId: authenticatedUserId } = context;

    if (!env?.D1_DB) {
      return new Response(
        JSON.stringify({ message: "서버 설정 오류입니다." }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }

    let body: any;
    try {
      body = await request.json();
    } catch (parseErr) {
      console.error("❌ POINTS POST JSON ERROR:", parseErr);
      return new Response(
        JSON.stringify({ message: "요청 본문이 유효하지 않습니다." }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const requestedUserId = Number(body?.userId);
    const hasRequestedUserId =
      Number.isInteger(requestedUserId) && requestedUserId > 0;
    const url = new URL(request.url);
    const queryUserId = Number(url.searchParams.get("userId"));
    const parsedQueryUserId =
      Number.isInteger(queryUserId) && queryUserId > 0 ? queryUserId : null;
    const headerUserIdRaw =
      request.headers.get("X-User-Id") || request.headers.get("X-UserId");
    const headerUserId = Number(headerUserIdRaw);
    const parsedHeaderUserId =
      Number.isInteger(headerUserId) && headerUserId > 0 ? headerUserId : null;
    const rawUsername = request.headers.get("X-Username");
    let username = rawUsername;
    if (rawUsername) {
      try {
        username = decodeURIComponent(rawUsername);
      } catch {
        username = rawUsername;
      }
    }

    let userId = hasRequestedUserId
      ? requestedUserId
      : Number.isInteger(authenticatedUserId) && Number(authenticatedUserId) > 0
        ? Number(authenticatedUserId)
        : null;

    if (!userId && username) {
      const user = await env.D1_DB.prepare(
        "SELECT user_id FROM users WHERE username = ?",
      )
        .bind(username)
        .first();
      const resolved = Number(user?.user_id);
      if (Number.isInteger(resolved) && resolved > 0) {
        userId = resolved;
      }
    }

    if (!userId) {
      userId = parsedHeaderUserId || parsedQueryUserId;
    }

    const amount = Number(body?.amount || 0);
    const scoreAmount = Number(body?.scoreAmount || 0);

    if (!userId || Number.isNaN(userId)) {
      return new Response(JSON.stringify({ message: "userId가 필요합니다." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const hasPointDelta = !Number.isNaN(amount) && amount !== 0;
    const hasScoreDelta = !Number.isNaN(scoreAmount) && scoreAmount !== 0;

    if (!hasPointDelta && !hasScoreDelta) {
      return new Response(
        JSON.stringify({ message: "변경할 points/score 값이 없습니다." }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    if (Math.abs(amount) > 1000000 || Math.abs(scoreAmount) > 1000000) {
      return new Response(
        JSON.stringify({ message: "변경 값이 너무 큽니다." }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    await env.D1_DB.prepare(
      "INSERT OR IGNORE INTO user_profiles (user_id, tier, score, points) VALUES (?, ?, ?, ?)",
    )
      .bind(userId, "bronze", 0, 0)
      .run();

    if (hasPointDelta) {
      await env.D1_DB.prepare(
        "UPDATE user_profiles SET points = points + ? WHERE user_id = ?",
      )
        .bind(amount, userId)
        .run();
    }

    if (hasScoreDelta) {
      const currentProfileForScore = await env.D1_DB.prepare(
        "SELECT score FROM user_profiles WHERE user_id = ?",
      )
        .bind(userId)
        .first();
      const currentScore = Number(currentProfileForScore?.score) || 0;
      const nextScore = Math.max(0, currentScore + scoreAmount);
      const nextTier = resolveTierFromScore(nextScore);

      await env.D1_DB.prepare(
        "UPDATE user_profiles SET score = ?, tier = ? WHERE user_id = ?",
      )
        .bind(nextScore, nextTier, userId)
        .run();
    }

    const now = new Date().toISOString();
    if (hasPointDelta) {
      try {
        await env.D1_DB.prepare(
          "INSERT INTO point_logs (user_id, point, reason, created_at) VALUES (?, ?, ?, ?)",
        )
          .bind(userId, amount, "상점 테스트 포인트 지급", now)
          .run();
      } catch (pointColumnErr: any) {
        try {
          await env.D1_DB.prepare(
            "INSERT INTO point_logs (user_id, points, reason, created_at) VALUES (?, ?, ?, ?)",
          )
            .bind(userId, amount, "상점 테스트 포인트 지급", now)
            .run();
        } catch (pointsColumnErr: any) {
          console.warn(
            "⚠️ POINT LOG INSERT SKIPPED:",
            pointColumnErr?.message || String(pointColumnErr),
            "|",
            pointsColumnErr?.message || String(pointsColumnErr),
          );
        }
      }
    }

    const profile = await env.D1_DB.prepare(
      "SELECT points, score FROM user_profiles WHERE user_id = ?",
    )
      .bind(userId)
      .first();

    return new Response(
      JSON.stringify({
        success: true,
        points: profile?.points ?? 0,
        score: profile?.score ?? 0,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("❌ POINTS POST ERROR:", (err as any)?.message);
    return new Response(
      JSON.stringify({ message: "포인트 지급에 실패했습니다." }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
