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

export async function onRequestPost(context: { request: Request; env: any; userId?: number }) {
    try {
        const { request, env, userId: authenticatedUserId } = context;

        if (!env?.D1_DB) {
            return new Response(
                JSON.stringify({ message: '서버 설정 오류입니다.' }),
                { status: 500, headers: { 'Content-Type': 'application/json' } }
            );
        }

        let body: any;
        try {
            body = await request.json();
        } catch (parseErr) {
            console.error('❌ POINTS POST JSON ERROR:', parseErr);
            return new Response(
                JSON.stringify({ message: '요청 본문이 유효하지 않습니다.' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const fallbackUserId = Number(body?.userId);
        const userId = typeof authenticatedUserId === 'number' ? authenticatedUserId : fallbackUserId;
        const amount = Number(body?.amount);

        if (!userId || Number.isNaN(userId)) {
            return new Response(
                JSON.stringify({ message: 'userId가 필요합니다.' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        if (!amount || Number.isNaN(amount) || amount <= 0 || amount > 1000000) {
            return new Response(
                JSON.stringify({ message: '지급 포인트가 올바르지 않습니다.' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        await env.D1_DB
            .prepare('INSERT OR IGNORE INTO user_profiles (user_id, tier, score, points) VALUES (?, ?, ?, ?)')
            .bind(userId, 'bronze', 0, 0)
            .run();

        await env.D1_DB
            .prepare('UPDATE user_profiles SET points = points + ? WHERE user_id = ?')
            .bind(amount, userId)
            .run();

        const now = new Date().toISOString();
        await env.D1_DB
            .prepare('INSERT INTO point_logs (user_id, point, reason, created_at) VALUES (?, ?, ?, ?)')
            .bind(userId, amount, '상점 테스트 포인트 지급', now)
            .run();

        const profile = await env.D1_DB
            .prepare('SELECT points FROM user_profiles WHERE user_id = ?')
            .bind(userId)
            .first();

        return new Response(
            JSON.stringify({ success: true, points: profile?.points ?? 0 }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (err) {
        console.error('❌ POINTS POST ERROR:', err?.message);
        return new Response(
            JSON.stringify({ message: '포인트 지급에 실패했습니다.' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
