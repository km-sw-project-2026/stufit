// // functions/api/attendance.ts
// interface Env {
//   D1_DB: any;
// }

// export const onRequest: PagesFunction<Env> = async ({ request, env }) => {
//   if (request.method === "POST") {
//     try {
//       const body = await request.json() as { userId: string, date: string };
//       const { userId, date } = body;

//       // 1. userId가 전송되었는지 확인
//       if (!userId) {
//         return new Response(JSON.stringify({ success: false, message: "유저 아이디가 전송되지 않았습니다." }), { 
//           status: 401,
//           headers: { "Content-Type": "application/json" }
//         });
//       }

//       // 2. 실제 DB 테이블(attendance_logs)에 데이터 삽입
//       await env.D1_DB.prepare(`
//         INSERT INTO attendance_logs (user_id, check_date)
//         VALUES (?, ?)
//       `).bind(userId, date).run();

//       return new Response(JSON.stringify({ success: true, message: "출석 성공!" }), {
//         headers: { "Content-Type": "application/json" }
//       });

//     } catch (e: any) {
//       // 중복 출석 등의 에러 처리
//       return new Response(JSON.stringify({ success: false, message: "이미 오늘 출석했거나 서버 오류입니다." }), { 
//         status: 500,
//         headers: { "Content-Type": "application/json" }
//       });
//     }
//   }
//   return new Response("Method Not Allowed", { status: 405 });
// };