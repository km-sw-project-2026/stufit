// Cloudflare Pages용 타입 정의
// type PagesFunction<T = any> = (context: { request: Request, env: T }) => Promise<Response>;

interface Env {
  D1_DB: D1Database;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    // 1. 데이터 수신 및 누락 체크
    const { userId, date } = await request.json() as { userId: string, date: string };

    if (!userId || !date) {
      return new Response(JSON.stringify({ message: "데이터가 부족합니다." }), { 
        status: 400, 
        headers: { "Content-Type": "application/json" } 
      });
    }

    // 2. 이미 오늘 출석했는지 확인 (중복 출석 방지) (테이블명: attendance_logs)
    const existing = await env.D1_DB.prepare(
      "SELECT * FROM attendance_logs WHERE user_id = ? AND date = ?"
    ).bind(userId, date).first();

    if (existing) {
      return new Response(JSON.stringify({ message: "이미 오늘 출석하셨습니다." }), { 
        status: 409,
        headers: { "Content-Type": "application/json" }
      });
    }

    // 3. 요일별 포인트 계산 (0: 일요일 ~ 6: 토요일)
    // Cloudflare Workers 시간은 UTC.
    const now = new Date();
    // KST 변환 (UTC+9)
    const kstOffset = 9 * 60 * 60 * 1000;
    const kstDate = new Date(now.getTime() + kstOffset);
    const dayOfWeek = kstDate.getUTCDay(); // 0(Sun) ~ 6(Sat)

    const rewardPoints = 100 + (dayOfWeek * 20);

    // 4. DB 트랜잭션 처리 (출석 기록 + 포인트 로그 + 유저 포인트 업데이트)
    const stmts = [
      // 4-1. 출석 기록 추가
      env.D1_DB.prepare(
        "INSERT INTO attendance_logs (user_id, date) VALUES (?, ?)"
      ).bind(userId, date),

      // 4-2. 포인트 로그 추가 (테이블명: point_logs, 컬럼: point)
      env.D1_DB.prepare(
        "INSERT INTO point_logs (user_id, reason, point, created_at) VALUES (?, ?, ?, ?)"
      ).bind(userId, '출석체크 ( ' + date + ' )', rewardPoints, kstDate.toISOString()),

      // 4-3. 유저 프로필 포인트 업데이트 (테이블명: user_profiles, 컬럼: points)
      env.D1_DB.prepare(
        "UPDATE user_profiles SET points = points + ? WHERE user_id = ?"
      ).bind(rewardPoints, userId)
    ];

    await env.D1_DB.batch(stmts);

    return new Response(JSON.stringify({ 
      success: true, 
      message: '출석 완료! ' + rewardPoints + 'P가 지급되었습니다.',
      rewardPoints 
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (e) {
    console.error("Attendance Server Error:", e);
    return new Response(JSON.stringify({ error: e.message, stack: e.stack }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};