export async function onRequestGet({ env }) {
    try {
        if (!env?.D1_DB) {
            return new Response(
                JSON.stringify({ message: '서버 설정 오류입니다.' }),
                { status: 500, headers: { "Content-Type": "application/json" } }
            );
        }

        const result = await env.D1_DB.prepare('SELECT * FROM posts').all();
        return new Response(
            JSON.stringify({ success: true, data: result.results || [] }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (err) {
        console.error("❌ POSTS ERROR:", err?.message);
        return new Response(
            JSON.stringify({ success: false, message: '게시글을 불러올 수 없습니다.' }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}