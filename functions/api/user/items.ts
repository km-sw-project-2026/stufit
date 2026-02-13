// GET: 사용자의 구매한 아이템 및 활성 아이템 조회
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

        // 구매한 아이템 목록 조회
        const purchasedItems = await env.D1_DB
            .prepare('SELECT item_id FROM user_items WHERE user_id = ?')
            .bind(userId)
            .all();

        // 활성 아이템 조회
        const profile = await env.D1_DB
            .prepare('SELECT profile_image_item_id, profile_border_item_id, profile_background_item_id FROM user_profiles WHERE user_id = ?')
            .bind(userId)
            .first();

        const itemIds = purchasedItems?.results?.map((row: any) => Number(row.item_id)) || [];
        
        const activeItems = {
            image: profile?.profile_image_item_id || null,
            frame: profile?.profile_border_item_id || null,
            bg: profile?.profile_background_item_id || null,
        };

        return new Response(
            JSON.stringify({ 
                success: true, 
                purchasedItems: itemIds,
                activeItems: activeItems
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (err: any) {
        console.error('❌ USER ITEMS GET ERROR:', err?.message || String(err));
        return new Response(
            JSON.stringify({ message: '아이템 정보를 불러올 수 없습니다.' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}

// PUT: 활성 아이템 설정
export async function onRequestPut(context: { request: Request; env: any; userId?: number }) {
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
        const itemType = body?.itemType; // 'image', 'frame', 'bg'
        const itemId = body?.itemId ? Number(body.itemId) : null;

        if (!userId || Number.isNaN(userId)) {
            return new Response(
                JSON.stringify({ message: 'userId가 필요합니다.' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        if (!itemType || !['image', 'frame', 'bg'].includes(itemType)) {
            return new Response(
                JSON.stringify({ message: 'itemType이 유효하지 않습니다.' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // itemId가 있으면 사용자가 해당 아이템을 보유하고 있는지 확인
        if (itemId !== null && !Number.isNaN(itemId)) {
            const hasItem = await env.D1_DB
                .prepare('SELECT 1 FROM user_items WHERE user_id = ? AND item_id = ?')
                .bind(userId, itemId)
                .first();

            if (!hasItem) {
                return new Response(
                    JSON.stringify({ message: '보유하지 않은 아이템입니다.' }),
                    { status: 400, headers: { 'Content-Type': 'application/json' } }
                );
            }
        }

        // user_profiles 업데이트
        let updateQuery = '';
        if (itemType === 'image') {
            updateQuery = 'UPDATE user_profiles SET profile_image_item_id = ? WHERE user_id = ?';
        } else if (itemType === 'frame') {
            updateQuery = 'UPDATE user_profiles SET profile_border_item_id = ? WHERE user_id = ?';
        } else if (itemType === 'bg') {
            updateQuery = 'UPDATE user_profiles SET profile_background_item_id = ? WHERE user_id = ?';
        }

        await env.D1_DB
            .prepare(updateQuery)
            .bind(itemId, userId)
            .run();

        return new Response(
            JSON.stringify({ success: true, message: '아이템이 적용되었습니다.' }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (err: any) {
        console.error('❌ USER ITEMS PUT ERROR:', err?.message || String(err));
        return new Response(
            JSON.stringify({ message: '아이템 적용에 실패했습니다.' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
