export async function onRequestGet({ env }) {
    try {
        if (!env?.D1_DB) {
            return new Response(
                JSON.stringify({ message: '서버 설정 오류입니다.' }),
                { status: 500, headers: { "Content-Type": "application/json" } }
            );
        }

        const result = await env.D1_DB.prepare(`
            SELECT p.*, u.username as author, 
            (SELECT COUNT(*) FROM post_likes WHERE post_id = p.post_id) as likes,
            (SELECT COUNT(*) FROM comments WHERE post_id = p.post_id) as comments,
            CASE WHEN (SELECT 1 FROM post_likes WHERE post_id = p.post_id AND user_id = 0) IS NOT NULL THEN 1 ELSE 0 END as liked
            FROM posts p
            JOIN users u ON p.user_id = u.user_id
            WHERE p.deleted_at IS NULL
            ORDER BY p.created_at DESC
        `).all();
        // user_id = 0 check for 'liked' is a placeholder. Real 'liked' needs userId context which we might not have in public GET. 
        // Frontend handles 'liked' state often by checking if user liked it.

        const posts = (result.results || []).map(post => ({
            ...post,
            id: post.post_id, // frontend expects 'id'
            date: new Date(post.created_at).toLocaleString('ko-KR')
        }));

        return new Response(
            JSON.stringify({ success: true, data: posts }),
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
        const body = await request.json();
        const { title, content, category } = body;

        if (!title || !content) {
             return new Response(JSON.stringify({ success: false, message: '제목과 내용을 입력해주세요.' }), { status: 400 });
        }

        const validCategory = ['popular', 'tips', 'data'].includes(category) ? category : 'data';

        const result = await env.D1_DB.prepare(
            'INSERT INTO posts (user_id, title, content, category) VALUES (?, ?, ?, ?)'
        ).bind(userId, title, content, validCategory).run();

        if (result.success) {
             // Fetch the created post to return it
             const newPost = await env.D1_DB.prepare(`
                SELECT p.*, u.username as author, 0 as likes, 0 as comments
                FROM posts p
                JOIN users u ON p.user_id = u.user_id
                WHERE p.post_id = last_insert_rowid()
             `).first();
             
             return new Response(JSON.stringify({ success: true, data: {
                 ...newPost,
                 id: newPost.post_id,
                 date: new Date(newPost.created_at).toLocaleString('ko-KR')
             }}), { status: 201 });
        } else {
            throw new Error('DB Insert Failed');
        }
    } catch (err) {
        console.error("❌ POST CREATE ERROR:", err);
        return new Response(JSON.stringify({ success: false, message: '게시글 작성 실패' }), { status: 500 });
    }
}