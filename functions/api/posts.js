export async function onRequestGet({ env }) {
    // D1 데이터베이스에서 posts 테이블을 쿼리하여 데이터를 가져옵니다.
    const result = await env.D1_DB.prepare('SELECT * FROM posts').all();

    // 가져온 데이터를 JSON 형식으로 반환합니다.
    return Response.json(result.results);
}