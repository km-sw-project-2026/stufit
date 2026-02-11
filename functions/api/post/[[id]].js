
export async function onRequestGet({ env, params }) {
    const { id } = params;

    const result = await env.D1_DB.prepare('SELECT p.*, u.username FROM posts p LEFT JOIN users u ON p.user_id = u.user_id WHERE post_id = ?').bind(id).first();

    if (!result) {
        return new Response('Post not found', { status: 404 });
    }

    return Response.json(result);
}

// Authenticated handler for methods that require a logged-in user (DELETE / PUT)
export default async function onRequest(request, { env, params, userId }) {
    try {
        const id = Number(params.id);
        if (Number.isNaN(id)) return new Response('Invalid post id', { status: 400 });

        console.log('[post/[[id]]] handler', request.method, 'postId:', id, 'userId:', userId);

        // fetch post
        const post = await env.D1_DB.prepare('SELECT * FROM posts WHERE post_id = ?').bind(id).first();
        if (!post) return Response.json({ success: false, message: '게시글 없음' }, { status: 404 });

        // only owner can modify/delete
        if (post.user_id !== userId) {
            return Response.json({ success: false, message: '권한 없음' }, { status: 403 });
        }

        if (request.method === 'DELETE') {
            console.log('[post/[[id]]] deleting post:', id);
            // 게시글 삭제 시 연관 데이터(댓글, 좋아요 등) 먼저 삭제 (Cascade)
            
            // 1. 댓글의 좋아요 삭제
            await env.D1_DB.prepare(`
                DELETE FROM comment_likes 
                WHERE comment_id IN (SELECT comment_id FROM comments WHERE post_id = ?)
            `).bind(id).run();

            // 2. 댓글 삭제
            await env.D1_DB.prepare('DELETE FROM comments WHERE post_id = ?').bind(id).run();

            // 3. 게시글 좋아요 삭제
            await env.D1_DB.prepare('DELETE FROM post_likes WHERE post_id = ?').bind(id).run();

            // 4. 게시글 삭제
            const delRes = await env.D1_DB.prepare('DELETE FROM posts WHERE post_id = ?').bind(id).run();
            console.log('[post/[[id]]] delete result meta:', delRes?.meta || delRes);

            return Response.json({ success: true, data: { postId: id }, message: '게시글 삭제 완료' });
        }

        if (request.method === 'PUT' || request.method === 'PATCH') {
            const body = await request.json().catch(() => null) || {};
            const { title, content } = body;
            if (!title && !content) return Response.json({ success: false, message: '변경할 내용이 없습니다.' }, { status: 400 });

            const now = new Date().toISOString();
            await env.D1_DB.prepare('UPDATE posts SET title = COALESCE(?, title), content = COALESCE(?, content), updated_at = ? WHERE post_id = ?')
                .bind(title, content, now, id).run();

            const updated = await env.D1_DB.prepare('SELECT * FROM posts WHERE post_id = ?').bind(id).first();
            return Response.json({ success: true, data: updated, message: '게시글 수정 완료' });
        }

        return new Response('Method not allowed', { status: 405 });
    } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        return Response.json({ success: false, message: 'DB 오류 발생', error: message }, { status: 500 });
    }
}
