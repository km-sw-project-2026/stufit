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
            .prepare('SELECT score FROM user_profiles WHERE user_id = ?')
            .bind(userId)
            .first();

        return new Response(
            JSON.stringify({ success: true, score: Number(profile?.score) || 0 }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (err: any) {
        console.error('❌ SCORE GET ERROR:', err?.message || String(err));
        return new Response(
            JSON.stringify({ message: '점수를 불러올 수 없습니다.' }),
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
            console.error('❌ SCORE POST JSON ERROR:', parseErr);
            return new Response(
                JSON.stringify({ message: '요청 본문이 유효하지 않습니다.' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const requestedUserId = Number(body?.userId);
        const hasRequestedUserId = !Number.isNaN(requestedUserId) && requestedUserId > 0;
        const userId = hasRequestedUserId
            ? requestedUserId
            : (typeof authenticatedUserId === 'number' ? authenticatedUserId : Number.NaN);

        const amount = Number(body?.amount);

        if (!userId || Number.isNaN(userId)) {
            return new Response(
                JSON.stringify({ message: 'userId가 필요합니다.' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        if (Number.isNaN(amount) || amount === 0 || Math.abs(amount) > 1000000) {
            return new Response(
                JSON.stringify({ message: '변경 점수가 올바르지 않습니다.' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        await env.D1_DB
            .prepare('INSERT OR IGNORE INTO user_profiles (user_id, tier, score, points) VALUES (?, ?, ?, ?)')
            .bind(userId, 'bronze', 0, 0)
            .run();

        // 현재 점수 조회
        const currentProfile = await env.D1_DB
            .prepare('SELECT score FROM user_profiles WHERE user_id = ?')
            .bind(userId)
            .first();

        const currentScore = Number(currentProfile?.score) || 0;
        const newScore = Math.max(0, currentScore + amount); // 0 미만으로 떨어지지 않도록

        await env.D1_DB
            .prepare('UPDATE user_profiles SET score = ? WHERE user_id = ?')
            .bind(newScore, userId)
            .run();

        return new Response(
            JSON.stringify({ success: true, score: newScore }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (err: any) {
        console.error('❌ SCORE POST ERROR:', err?.message || String(err));
        return new Response(
            JSON.stringify({ message: '점수 저장에 실패했습니다.' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
