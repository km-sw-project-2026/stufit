// Cloudflare Pages용 타입 정의
// import type { D1Database } from "@cloudflare/workers-types";


// 원래 쓰던 코드

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
    console.log(`[Attendance API] Parsed data - UserId: ${userId}, Date: ${date}`);

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

  } catch (e: any) {
    console.error("Attendance Server Error:", e);
    return new Response(JSON.stringify({ error: e.message, stack: e.stack }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};



// --------------------------------------- 수정 코드( 밑에)


// interface Env {
//   // ⚠️ 중요: 만약 wrangler.json의 binding이 'D1_DB'라면 아래 DB를 D1_DB로 수정하세요.
//   DB: any; 
// }

// export const onRequest: any = async (context: { request: Request; env: Env }) => {
//   const { request, env } = context;
//   const url = new URL(request.url);

//   // 1. D1 데이터베이스 연결 확인 (500 에러 방지)
//   if (!env.DB) {
//     return new Response(JSON.stringify({ error: "DB binding not found. Check your wrangler.json" }), { 
//       status: 500,
//       headers: { "Content-Type": "application/json" }
//     });
//   }

//   // 🚀 [GET] 출석 데이터 조회
//   if (request.method === "GET") {
//     const userId = url.searchParams.get("userId");
    
//     // 401 Unauthorized 에러 방지 로직
//     if (!userId || userId === "null" || userId === "undefined") {
//       return new Response(JSON.stringify({ message: "로그인이 필요합니다." }), { 
//         status: 401,
//         headers: { "Content-Type": "application/json" }
//       });
//     }

//     try {
//       // 대소문자 구분 없이 테이블명 확인
//       const { results } = await env.DB.prepare(
//         "SELECT date FROM attendance_logs WHERE user_id = ? ORDER BY date DESC"
//       ).bind(userId).all();

//       return new Response(JSON.stringify({ logs: results || [] }), {
//         status: 200,
//         headers: { "Content-Type": "application/json" }
//       });
//     } catch (e: any) {
//       return new Response(JSON.stringify({ error: e.message }), { status: 500 });
//     }
//   }

//   // 🚀 [POST] 출석 데이터 저장
//   if (request.method === "POST") {
//     try {
//       const body: any = await request.json();
//       const { userId, date } = body;

//       if (!userId || userId === "null") {
//         return new Response(JSON.stringify({ message: "사용자 인증에 실패했습니다." }), { status: 401 });
//       }

//       // 중복 체크
//       const existing = await env.DB.prepare(
//         "SELECT * FROM attendance_logs WHERE user_id = ? AND date = ?"
//       ).bind(userId, date).first();

//       if (existing) {
//         return new Response(JSON.stringify({ message: "이미 오늘 출석하셨습니다." }), { status: 409 });
//       }

//       const now = new Date();
//       const kstDate = new Date(now.getTime() + (9 * 60 * 60 * 1000));
//       const dayOfWeek = kstDate.getUTCDay(); 
//       const rewardPoints = 100 + (dayOfWeek * 20);

//       // DB 트랜잭션
//       const stmts = [
//         env.DB.prepare("INSERT INTO attendance_logs (user_id, date) VALUES (?, ?)").bind(userId, date),
//         env.DB.prepare("INSERT INTO point_logs (user_id, reason, point, created_at) VALUES (?, ?, ?, ?)").bind(
//           userId, `출석체크 (${date})`, rewardPoints, kstDate.toISOString()
//         ),
//         env.DB.prepare("UPDATE user_profiles SET points = points + ? WHERE user_id = ?").bind(rewardPoints, userId)
//       ];

//       await env.DB.batch(stmts);

//       return new Response(JSON.stringify({ 
//         success: true, 
//         message: `${rewardPoints}P가 지급되었습니다.`,
//         rewardPoints 
//       }), { status: 200 });

//     } catch (e: any) {
//       return new Response(JSON.stringify({ error: e.message }), { status: 500 });
//     }
//   }

//   return new Response("Method Not Allowed", { status: 405 });
// };