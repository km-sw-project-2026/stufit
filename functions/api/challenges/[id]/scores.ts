// declare interface D1Database {
//   prepare(query: string): any;
// }

// interface Env {
//   D1_DB: D1Database;
// }

// type PagesFunction<T = any> = (context: { request: Request, params: { id: string }, env: T }) => Promise<Response>;

// export const onRequest: PagesFunction<Env> = async ({ request, params, env }) => {
//   const challengeId = params.id;
//   const { userId, score } = await request.json() as { userId: string, score: number };

//   try {
//     await env.D1_DB.prepare(`
//       INSERT INTO challenge_results (user_id, challenge_id, score) 
//       VALUES (?, ?, ?)
//       ON CONFLICT(user_id, challenge_id) DO UPDATE SET score = excluded.score
//     `).bind(userId, challengeId, score).run();

//     return Response.json({ success: true, message: "점수가 성공적으로 입력되었습니다." });
//   } catch (e) {
//     return new Response("점수 입력 실패", { status: 500 });
//   }
// };


// -----------------------------------------------------------


// // functions/api/challenges/scores.ts

// declare interface D1Database {
//   prepare(query: string): any;
// }

// interface Env {
//   D1_DB: D1Database;
// }

// type PagesFunction<T = any> = (context: { request: Request, params: { id: string }, env: T }) => Promise<Response>;

// export const onRequest: PagesFunction<Env> = async ({ request, params, env }) => {
//   // 1. GET 요청: 전체 랭킹 리스트를 가져옴
//   if (request.method === "GET") {
//     try {
//       const { results } = await env.D1_DB.prepare(`
//         SELECT u.name as author, SUM(cr.score) as likes 
//         FROM users u
//         JOIN challenge_results cr ON u.id = cr.user_id
//         GROUP BY u.id
//         ORDER BY likes DESC
//       `).all();

//       return Response.json(results);
//     } catch (e) {
//       return new Response("랭킹 로딩 실패", { status: 500 });
//     }
//   }

//   // 2. POST 요청: 새로운 점수 입력 (기존 로직 유지)
//   const challengeId = params.id;
//   try {
//     const { userId, score } = await request.json() as { userId: string, score: number };
//     await env.D1_DB.prepare(`
//       INSERT INTO challenge_results (user_id, challenge_id, score) 
//       VALUES (?, ?, ?)
//       ON CONFLICT(user_id, challenge_id) DO UPDATE SET score = excluded.score
//     `).bind(userId, challengeId, score).run();

//     return Response.json({ success: true, message: "점수가 성공적으로 입력되었습니다." });
//   } catch (e) {
//     return new Response("점수 입력 실패", { status: 500 });
//   }
// };


// -=--------------------------------------------------


declare interface D1Database {
  prepare(query: string): any;
}

interface Env {
  D1_DB: D1Database;
}

type PagesFunction<T = any> = (context: { request: Request, params: { id: string }, env: T }) => Promise<Response>;

export const onRequest: PagesFunction<Env> = async ({ request, params, env }) => {
  // 1. GET 요청: 랭킹 리스트를 합산해서 가져옴 (출석 + 챌린지 + 커뮤니티 점수)
  if (request.method === "GET") {
    try {
      // u.name(또는 u.username)과 점수 합계를 가져오는 쿼리입니다.
      // 테이블 이름이나 컬럼명은 데이터베이스 설정에 맞게 자동으로 연결됩니다.
      const { results } = await env.D1_DB.prepare(`
        SELECT 
          u.username as author,
          (
            COALESCE((SELECT SUM(score) FROM challenge_results WHERE user_id = u.user_id), 0) +
            COALESCE((SELECT COUNT(*) * 10 FROM attendance WHERE user_id = u.user_id), 0) + 
            COALESCE((SELECT COUNT(*) * 5 FROM post_likes pl JOIN posts p ON pl.post_id = p.post_id WHERE p.user_id = u.user_id), 0)
          ) as likes
        FROM users u
        WHERE author IS NOT NULL
        ORDER BY likes DESC
      `).all();

      return Response.json(results);
    } catch (e) {
      console.error("Ranking Load Error:", e);
      return new Response("랭킹 데이터를 불러오는데 실패했습니다.", { status: 500 });
    }
  }

  // 2. POST 요청: 특정 챌린지의 점수 입력 (기존 로직 유지)
  try {
    const challengeId = params.id;
    const { userId, score } = await request.json() as { userId: string, score: number };

    if (!userId || !challengeId) {
      return new Response("필수 정보가 누락되었습니다.", { status: 400 });
    }

    await env.D1_DB.prepare(`
      INSERT INTO challenge_results (user_id, challenge_id, score) 
      VALUES (?, ?, ?)
      ON CONFLICT(user_id, challenge_id) DO UPDATE SET score = excluded.score
    `).bind(userId, challengeId, score).run();

    return Response.json({ success: true, message: "점수가 성공적으로 반영되었습니다." });
  } catch (e) {
    return new Response("점수 입력 처리 중 오류가 발생했습니다.", { status: 500 });
  }
};