export async function onRequestPost(context: { request: Request; env: any; userId?: number }) {
    try {
        const { request, env, userId: authenticatedUserId } = context;

        if (!env?.D1_DB) {
            return new Response(
                JSON.stringify({ message: '서버 설정 오류입니다.' }),
                { status: 500, headers: { 'Content-Type': 'application/json' } }
            );
        }

        let body;
        try {
            body = await request.json();
        } catch (parseErr) {
            console.error('❌ JSON 파싱 오류:', parseErr);
            return new Response(
                JSON.stringify({ message: '요청 본문이 유효하지 않습니다.' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const fallbackUserId = Number(body?.userId);
        const userId = typeof authenticatedUserId === 'number' ? authenticatedUserId : fallbackUserId;
        const price = Number(body?.price);

        if (!userId || Number.isNaN(userId)) {
            return new Response(
                JSON.stringify({ message: 'userId가 필요합니다.' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        if (!price || Number.isNaN(price) || price <= 0) {
            return new Response(
                JSON.stringify({ message: '가격 정보가 올바르지 않습니다.' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        let profile = await env.D1_DB
            .prepare('SELECT points FROM user_profiles WHERE user_id = ?')
            .bind(userId)
            .first();

        if (!profile) {
            await env.D1_DB
                .prepare('INSERT OR IGNORE INTO user_profiles (user_id, tier, score, points) VALUES (?, ?, ?, ?)')
                .bind(userId, 'bronze', 0, 0)
                .run();

            profile = await env.D1_DB
                .prepare('SELECT points FROM user_profiles WHERE user_id = ?')
                .bind(userId)
                .first();

            if (!profile) {
                return new Response(
                    JSON.stringify({ message: '사용자 정보를 찾을 수 없습니다.' }),
                    { status: 404, headers: { 'Content-Type': 'application/json' } }
                );
            }
        }

        const currentPoints = Number(profile.points) || 0;
        if (currentPoints < price) {
            return new Response(
                JSON.stringify({ message: '포인트가 부족합니다.' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        await env.D1_DB
            .prepare('UPDATE user_profiles SET points = points - ? WHERE user_id = ?')
            .bind(price, userId)
            .run();

        const nextPoints = currentPoints - price;

        return new Response(
            JSON.stringify({ success: true, points: nextPoints }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (err) {
        console.error('❌ PURCHASE ERROR:', err?.message);
        return new Response(
            JSON.stringify({ message: '구매 처리에 실패했습니다.' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
