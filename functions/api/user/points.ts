export async function onRequestGet(context: { request: Request; env: any; userId?: number }) {
    try {
        const { request, env, userId: authenticatedUserId } = context;

        if (!env?.D1_DB) {
            return new Response(
                JSON.stringify({ message: '서버 설정 오류입니다.' }),
                { status: 500, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const url = new URL(request.url);
        const userIdRaw = url.searchParams.get('userId');
        const fallbackUserId = Number(userIdRaw);
        const userId = typeof authenticatedUserId === 'number' ? authenticatedUserId : fallbackUserId;

        if (!userId || Number.isNaN(userId)) {
            return new Response(
                JSON.stringify({ message: 'userId가 필요합니다.' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const profile = await env.D1_DB
            .prepare('SELECT points FROM user_profiles WHERE user_id = ?')
            .bind(userId)
            .first();

        if (!profile) {
            return new Response(
                JSON.stringify({ message: '사용자 정보를 찾을 수 없습니다.' }),
                { status: 404, headers: { 'Content-Type': 'application/json' } }
            );
        }

        return new Response(
            JSON.stringify({ success: true, points: profile.points ?? 0 }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (err) {
        console.error('❌ POINTS GET ERROR:', err?.message);
        return new Response(
            JSON.stringify({ message: '포인트를 불러올 수 없습니다.' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
