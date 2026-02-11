// Cloudflare Pages용 타입 정의
// import type { D1Database } from "@cloudflare/workers-types";

type PagesFunction<T = any> = (context: { request: Request, env: T }) => Promise<Response>;

interface Env {
  D1_DB: any;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  console.log('[Attendance API] Started processing request');
  try {
    const bodyText = await request.text();
    console.log('[Attendance API] Raw body:', bodyText);
    
    let body;
    try {
      body = JSON.parse(bodyText);
    } catch (e) {
       console.error('[Attendance API] JSON parse error:', e);
       return new Response(JSON.stringify({ message: "Invalid JSON" }), { status: 400 });
    }
    
    const { userId, date } = body as { userId: string, date: string };
    const userIdNum = parseInt(userId, 10);
    console.log(`[Attendance API] Parsed data - UserId: ${userIdNum}, Date: ${date}`);

    if (!userId || !date) {
      return new Response(JSON.stringify({ message: "데이터가 부족합니다." }), { 
        status: 400, 
        headers: { "Content-Type": "application/json" } 
      });
    }

    // 2. 이미 오늘 출석했는지 확인 (중복 출석 방지)
    const existing = await env.D1_DB.prepare(
      "SELECT * FROM attendance_logs WHERE user_id = ? AND date = ?"
    ).bind(userIdNum, date).first();

    if (existing) {
      return new Response(JSON.stringify({ message: "이미 오늘 출석하셨습니다." }), { 
        status: 409,
        headers: { "Content-Type": "application/json" }
      });
    }

    // 3. 요일별 포인트 계산 (0: 일요일 ~ 6: 토요일)
    const now = new Date();
    // KST 변환 (UTC+9)
    const kstOffset = 9 * 60 * 60 * 1000;
    const kstDate = new Date(now.getTime() + kstOffset);
    const dayOfWeek = kstDate.getUTCDay(); // 0(Sun) ~ 6(Sat)

    const rewardPoints = 100 + (dayOfWeek * 20);

    // 4. user_profiles 존재 확인
    const userProfile = await env.D1_DB.prepare(
      "SELECT * FROM user_profiles WHERE user_id = ?"
    ).bind(userIdNum).first();

    // 4-1. DB 트랜잭션 처리 (출석 기록 + 포인트 로그 + 유저 포인트 업데이트)
    const stmts = [
      // 출석 기록 추가
      env.D1_DB.prepare(
        "INSERT INTO attendance_logs (user_id, date) VALUES (?, ?)"
      ).bind(userIdNum, date),

      // 포인트 로그 추가
      env.D1_DB.prepare(
        "INSERT INTO point_logs (user_id, reason, point, created_at) VALUES (?, ?, ?, ?)"
      ).bind(userIdNum, '출석체크 ( ' + date + ' )', rewardPoints, kstDate.toISOString())
    ];

    // user_profiles가 없으면 먼저 생성
    if (!userProfile) {
      stmts.push(
        env.D1_DB.prepare(
          "INSERT INTO user_profiles (user_id, points) VALUES (?, ?)"
        ).bind(userIdNum, rewardPoints)
      );
    } else {
      // 있으면 포인트 업데이트
      stmts.push(
        env.D1_DB.prepare(
          "UPDATE user_profiles SET points = points + ? WHERE user_id = ?"
        ).bind(rewardPoints, userIdNum)
      );
    }

    await env.D1_DB.batch(stmts);

    return new Response(JSON.stringify({ 
      success: true, 
      message: '출석 완료! ' + rewardPoints + 'P가 지급되었습니다.',
      rewardPoints 
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (e: any) {
    console.error("Attendance Server Error:", e);
    return new Response(JSON.stringify({ error: e.message, stack: e.stack }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
