
export async function onRequestGet({ env, params }) {
    const { id } = params;

    // D1 데이터베이스에서 'posts' 테이블에서 해당 ID의 게시물 조회
    const result = await env.D1_DB.prepare('SELECT * FROM posts WHERE post_id = ?').bind(id).first();

    if (!result) {
        return new Response('Post not found', { status: 404 });
    }

    // 결과를 JSON 형식으로 반환
    return Response.json(result);
}
