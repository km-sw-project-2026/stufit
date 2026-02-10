// // Cloudflare Pages용 타입 정의
// type PagesFunction<T = any> = (context: { request: Request, env: T }) => Promise<Response>;

// interface Env {
//   D1_DB: D1Database;
// }

// export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
//   try {
//     const { userId, date } = await request.json() as { userId: string, date: string };

//     // 1. 데이터 누락 체크
//     if (!userId || !date) {
//       return new Response(JSON.stringify({ message: "데이터가 부족합니다." }), { 
//         status: 400, 
//         headers: { "Content-Type": "application/json" } 
//       });
//     }

//     // 2. 이미 오늘 출석했는지 확인 (중복 출석 방지)
//     const existing = await env.D1_DB.prepare(
//       "SELECT * FROM attendance WHERE user_id = ? AND date = ?"
//     ).bind(userId, date).first();

//     if (existing) {
//       return new Response(JSON.stringify({ message: "이미 오늘 출석하셨습니다." }), { 
//         status: 409,
//         headers: { "Content-Type": "application/json" }
//       });
//     }

//     // 3. 출석 데이터 삽입
//     await env.D1_DB.prepare(
//       "INSERT INTO attendance (user_id, date) VALUES (?, ?)"
//     ).bind(userId, date).run();

//     return new Response(JSON.stringify({ success: true, message: "출석 데이터가 DB에 저장되었습니다." }), {
//       status: 200,
//       headers: { "Content-Type": "application/json" }
//     });

//   } catch (e: any) {
//     console.error("Attendance Server Error:", e);
//     return new Response(JSON.stringify({ error: e.message }), { 
//       status: 500,
//       headers: { "Content-Type": "application/json" }
//     });
//   }
// };