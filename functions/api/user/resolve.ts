export async function onRequestGet(context: { request: Request; env: any }) {
    try {
        const { request, env } = context;

        if (!env?.D1_DB) {
            return new Response(
                JSON.stringify({ message: '서버 설정 오류입니다.' }),
                { status: 500, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const url = new URL(request.url);
        const username = url.searchParams.get('username');

        if (!username) {
            return new Response(
                JSON.stringify({ message: 'username이 필요합니다.' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const user = await env.D1_DB
            .prepare('SELECT user_id FROM users WHERE username = ?')
            .bind(username)
            .first();

        if (!user) {
            return new Response(
                JSON.stringify({ message: '사용자 정보를 찾을 수 없습니다.' }),
                { status: 404, headers: { 'Content-Type': 'application/json' } }
            );
        }

        return new Response(
            JSON.stringify({ success: true, userId: user.user_id }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (err) {
        console.error('❌ RESOLVE USER ERROR:', err?.message);
        return new Response(
            JSON.stringify({ message: '사용자 정보를 불러올 수 없습니다.' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
