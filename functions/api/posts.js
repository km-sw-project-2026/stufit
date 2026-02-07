export async function onRequestGet({ env, userId }) {
    try {
        if (!env?.D1_DB) {
            return new Response(
                JSON.stringify({ message: '서버 설정 오류입니다.' }),
                { status: 500, headers: { "Content-Type": "application/json" } }
            );
        }

        const likerId = userId || -1;
        const result = await env.D1_DB
            .prepare(
                `SELECT p.*, u.username,
                        (SELECT COUNT(*) FROM comments c WHERE c.post_id = p.post_id) AS comment_count,
                        (SELECT COUNT(*) FROM post_likes pl2 WHERE pl2.post_id = p.post_id) AS like_count,
                        CASE WHEN pl.user_id IS NULL THEN 0 ELSE 1 END AS user_liked
                 FROM posts p
                 LEFT JOIN users u ON p.user_id = u.user_id
                 LEFT JOIN post_likes pl ON pl.post_id = p.post_id AND pl.user_id = ?
                 ORDER BY p.created_at DESC`
            )
            .bind(likerId)
            .all();
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

export async function onRequestPost({ request, env, userId }) {
    try {
        if (!env?.D1_DB) {
            return new Response(
                JSON.stringify({ message: '서버 설정 오류입니다.' }),
                { status: 500, headers: { "Content-Type": "application/json" } }
            );
        }

        if (!userId) {
            return new Response(
                JSON.stringify({ success: false, message: '로그인이 필요합니다.' }),
                { status: 401, headers: { "Content-Type": "application/json" } }
            );
        }

        const body = await request.json().catch(() => null) || {};
        const title = typeof body.title === 'string' ? body.title.trim() : '';
        const content = typeof body.content === 'string' ? body.content.trim() : '';

        if (!title || !content) {
            return new Response(
                JSON.stringify({ success: false, message: '제목과 내용을 입력해주세요.' }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        const now = new Date().toISOString();
        const insertResult = await env.D1_DB
            .prepare('INSERT INTO posts (user_id, title, content, created_at) VALUES (?, ?, ?, ?)')
            .bind(userId, title, content, now)
            .run();

        const postId = insertResult.meta?.last_row_id || insertResult.lastInsertRowid;
        if (!postId) {
            throw new Error('게시글 ID를 가져올 수 없습니다.');
        }

        const created = await env.D1_DB
            .prepare('SELECT p.*, u.username FROM posts p LEFT JOIN users u ON p.user_id = u.user_id WHERE p.post_id = ?')
            .bind(postId)
            .first();

        return new Response(
            JSON.stringify({ success: true, data: created }),
            { status: 201, headers: { "Content-Type": "application/json" } }
        );
    } catch (err) {
        console.error('❌ POSTS CREATE ERROR:', err?.message);
        return new Response(
            JSON.stringify({ success: false, message: '게시글 생성에 실패했습니다.' }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}