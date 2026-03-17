declare interface D1Database {
  prepare(query: string): any;
}

interface Env {
  D1_DB: D1Database;
}

type PagesFunction<T = any> = (context: { request: Request, params: { id: string }, env: T }) => Promise<Response>;

const getDateOnly = (raw: any): string | null => {
  if (!raw) return null;
  const text = String(raw).trim();
  if (!text) return null;
  const direct = text.slice(0, 10);
  if (/^\d{4}-\d{2}-\d{2}$/.test(direct)) return direct;
  const bySpace = text.split(' ')[0];
  if (/^\d{4}-\d{2}-\d{2}$/.test(bySpace)) return bySpace;
  return null;
};

const addDaysUtc = (dateOnly: string, days: number): string => {
  const [y, m, d] = dateOnly.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + days));
  return dt.toISOString().slice(0, 10);
};

const getTodayInSeoul = (): string => {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  return formatter.format(new Date());
};

export const onRequest: PagesFunction<Env> = async ({ request, params, env }) => {
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  const challengeId = params.id;
  let body: { userId?: string | number; score?: number } = {};

  try {
    body = await request.json() as { userId?: string | number; score?: number };
  } catch {
    return Response.json({ success: false, message: '요청 본문이 올바르지 않습니다.' }, { status: 400 });
  }

  const userId = Number(body?.userId);
  const score = Number(body?.score);

  if (!challengeId || Number.isNaN(Number(challengeId))) {
    return Response.json({ success: false, message: '유효하지 않은 챌린지입니다.' }, { status: 400 });
  }

  if (!userId || Number.isNaN(userId)) {
    return Response.json({ success: false, message: '유효한 사용자 정보가 필요합니다.' }, { status: 400 });
  }

  if (Number.isNaN(score) || score < 0) {
    return Response.json({ success: false, message: '점수는 0 이상의 숫자여야 합니다.' }, { status: 400 });
  }

  try {
    const challenge = await env.D1_DB
      .prepare('SELECT end_date FROM challenges WHERE challenge_id = ?')
      .bind(challengeId)
      .first();

    if (!challenge) {
      return Response.json({ success: false, message: '챌린지를 찾을 수 없습니다.' }, { status: 404 });
    }

    const endDate = getDateOnly((challenge as any).end_date);
    if (endDate) {
      const lastSubmitDate = addDaysUtc(endDate, 1);
      const todayKst = getTodayInSeoul();

      // end_date + 1일이 지난 뒤에는 제출 불가
      if (todayKst > lastSubmitDate) {
        return Response.json(
          { success: false, expired: true, message: '점수 제출 기간이 종료되었습니다. (종료일 다음날까지만 제출 가능)' },
          { status: 400 }
        );
      }
    }

    const already = await env.D1_DB
      .prepare('SELECT 1 FROM challenge_results WHERE user_id = ? AND challenge_id = ?')
      .bind(userId, challengeId)
      .first();

    if (already) {
      return Response.json(
        { success: false, alreadySubmitted: true, message: '공부 챌린지 점수는 1회만 제출할 수 있습니다.' },
        { status: 409 }
      );
    }

    await env.D1_DB
      .prepare(`
        INSERT INTO challenge_results (user_id, challenge_id, score)
        VALUES (?, ?, ?)
      `)
      .bind(userId, challengeId, score)
      .run();

    return Response.json({ success: true, message: "점수가 성공적으로 입력되었습니다." });
  } catch (e) {
    return Response.json({ success: false, message: '점수 입력 실패' }, { status: 500 });
  }
};


// -----------------------------------------------------------


// functions/api/challenges/scores.ts

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


// declare interface D1Database {
//   prepare(query: string): any;
// }

// interface Env {
//   D1_DB: D1Database;
// }

// type PagesFunction<T = any> = (context: { request: Request, params: { id: string }, env: T }) => Promise<Response>;

// export const onRequest: PagesFunction<Env> = async ({ request, params, env }) => {
//   // 1. GET 요청: 랭킹 리스트를 합산해서 가져옴 (출석 + 챌린지 + 커뮤니티 점수)
//   if (request.method === "GET") {
//     try {
//       // u.name(또는 u.username)과 점수 합계를 가져오는 쿼리입니다.
//       // 테이블 이름이나 컬럼명은 데이터베이스 설정에 맞게 자동으로 연결됩니다.
//       const { results } = await env.D1_DB.prepare(`
//         SELECT 
//           u.username as author,
//           (
//             COALESCE((SELECT SUM(score) FROM challenge_results WHERE user_id = u.user_id), 0) +
//             COALESCE((SELECT COUNT(*) * 10 FROM attendance WHERE user_id = u.user_id), 0) + 
//             COALESCE((SELECT COUNT(*) * 5 FROM post_likes pl JOIN posts p ON pl.post_id = p.post_id WHERE p.user_id = u.user_id), 0)
//           ) as likes
//         FROM users u
//         WHERE author IS NOT NULL
//         ORDER BY likes DESC
//       `).all();

//       return Response.json(results);
//     } catch (e) {
//       console.error("Ranking Load Error:", e);
//       return new Response("랭킹 데이터를 불러오는데 실패했습니다.", { status: 500 });
//     }
//   }

//   // 2. POST 요청: 특정 챌린지의 점수 입력 (기존 로직 유지)
//   try {
//     const challengeId = params.id;
//     const { userId, score } = await request.json() as { userId: string, score: number };

//     if (!userId || !challengeId) {
//       return new Response("필수 정보가 누락되었습니다.", { status: 400 });
//     }

//     await env.D1_DB.prepare(`
//       INSERT INTO challenge_results (user_id, challenge_id, score) 
//       VALUES (?, ?, ?)
//       ON CONFLICT(user_id, challenge_id) DO UPDATE SET score = excluded.score
//     `).bind(userId, challengeId, score).run();

//     return Response.json({ success: true, message: "점수가 성공적으로 반영되었습니다." });
//   } catch (e) {
//     return new Response("점수 입력 처리 중 오류가 발생했습니다.", { status: 500 });
//   }
// };


// ------------------------------------------------------


// declare interface D1Database {
//   prepare(query: string): any;
// }

// interface Env {
//   D1_DB: D1Database;
// }

// type PagesFunction<T = any> = (context: { request: Request, params: { id: string }, env: T }) => Promise<Response>;

// export const onRequest: PagesFunction<Env> = async ({ request, params, env }) => {
//   // 1. GET 요청: 랭킹 리스트 불러오기
//   if (request.method === "GET") {
//     try {
//       // 대시보드 이미지(image_e532da.png)의 실제 테이블 이름인 'attendance_logs'를 사용합니다.
//       const { results } = await env.D1_DB.prepare(`
//         SELECT 
//           u.username as author,
//           (
//             -- 챌린지 점수 합산
//             COALESCE((SELECT SUM(score) FROM challenge_results WHERE user_id = u.user_id), 0) +
//             -- 출석 점수 합산 (테이블명을 실제 DB와 일치시킴: attendance_logs)
//             COALESCE((SELECT COUNT(*) * 10 FROM attendance_logs WHERE user_id = u.user_id), 0) + 
//             -- 좋아요 점수 합산
//             COALESCE((SELECT COUNT(*) * 5 FROM post_likes pl JOIN posts p ON pl.post_id = p.post_id WHERE p.user_id = u.user_id), 0)
//           ) as likes
//         FROM users u
//         WHERE u.username IS NOT NULL
//         ORDER BY likes DESC
//       `).all();

//       return Response.json(results);
//     } catch (e) {
//       console.error("Ranking Load Error:", e);
//       return new Response("랭킹 데이터를 불러오는데 실패했습니다.", { status: 500 });
//     }
//   }

//   // 2. POST 요청: 점수 입력
//   if (request.method === "POST") {
//     try {
//       const challengeId = params.id;
//       const { userId, score } = await request.json() as { userId: string, score: number };

//       if (!userId || !challengeId) {
//         return new Response("필수 정보가 누락되었습니다.", { status: 400 });
//       }

//       await env.D1_DB.prepare(`
//         INSERT INTO challenge_results (user_id, challenge_id, score) 
//         VALUES (?, ?, ?)
//         ON CONFLICT(user_id, challenge_id) DO UPDATE SET score = excluded.score
//       `).bind(userId, challengeId, score).run();

//       return Response.json({ success: true, message: "점수가 성공적으로 반영되었습니다." });
//     } catch (e) {
//       return new Response("점수 입력 처리 중 오류가 발생했습니다.", { status: 500 });
//     }
//   }

//   return new Response("Method Not Allowed", { status: 405 });
// };