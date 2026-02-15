// ----------------원래 쓰던 코드

// export async function onRequestPost({ env, params, userId }) {
//   try {
//     if (!userId) {
//       return Response.json({ success: false, message: '로그인이 필요합니다.' }, { status: 401 });
//     }

//     const commentId = Number(params.id);
//     if (Number.isNaN(commentId)) return new Response('Invalid comment id', { status: 400 });

//     const exists = await env.D1_DB
//       .prepare('SELECT 1 FROM comment_likes WHERE comment_id = ? AND user_id = ?')
//       .bind(commentId, userId)
//       .first();

//     if (exists) {
//       await env.D1_DB.prepare('DELETE FROM comment_likes WHERE comment_id = ? AND user_id = ?').bind(commentId, userId).run();
//     } else {
//       await env.D1_DB.prepare('INSERT INTO comment_likes (comment_id, user_id) VALUES (?, ?)').bind(commentId, userId).run();
//     }

//     const countRow = await env.D1_DB.prepare('SELECT COUNT(*) as cnt FROM comment_likes WHERE comment_id = ?').bind(commentId).first();
//     const count = countRow?.cnt || 0;

//     return Response.json({ success: true, data: { liked: !exists, count } });
//   } catch (err) {
//     const message = err instanceof Error ? err.message : String(err);
//     return Response.json({ success: false, message: '좋아요 처리 실패', error: message }, { status: 500 });
//   }
// }


// ----------------------------- 밑에 수정 코드


export async function onRequestPost(context) {
    const { request, env, params } = context;
    const postId = params.id;
    const username = request.headers.get("X-Username"); // 브라우저에서 보낸 이름

    if (!username) {
        return new Response(JSON.stringify({ success: false, message: "로그인이 필요합니다." }), { status: 401 });
    }

    try {
        // 1. 현재 좋아요 상태 확인 (user_id 컬럼 사용)
        const existing = await env.DB.prepare(`
            SELECT id FROM post_likes WHERE post_id = ? AND user_id = ?
        `).bind(postId, username).first();

        let liked = false;
        if (existing) {
            // 좋아요 취소
            await env.DB.prepare(`DELETE FROM post_likes WHERE id = ?`).bind(existing.id).run();
        } else {
            // 좋아요 기록 (반드시 user_id라고 적어야 함)
            await env.DB.prepare(`INSERT INTO post_likes (post_id, user_id) VALUES (?, ?)`).bind(postId, username).run();
            liked = true;
        }

        // 2. 게시물의 전체 좋아요 수 다시 계산
        const countResult = await env.DB.prepare(`
            SELECT COUNT(*) as count FROM post_likes WHERE post_id = ?
        `).bind(postId).first();
        const count = parseInt(countResult.count);

        // 3. 게시물 정보 확인
        const post = await env.DB.prepare(`
            SELECT author, category, popular_reward_paid FROM posts WHERE post_id = ?
        `).bind(postId).first();

        let promoted = false;
        let message = "";

        // 4. 인기글 승격 및 포인트 지급 (기준: 좋아요 1개)
        if (count >= 1 && post && Number(post.popular_reward_paid) === 0) {
            // 포인트 지급
            await env.DB.prepare(`UPDATE users SET points = points + 300 WHERE username = ?`).bind(post.author).run();
            // 인기글 카테고리 변경
            await env.DB.prepare(`UPDATE posts SET category = 'popular', popular_reward_paid = 1 WHERE post_id = ?`).bind(postId).run();
            promoted = true;
            message = "축하합니다! 인기글로 선정되었습니다.";
        }

        // 5. posts 테이블의 like_count 컬럼 업데이트
        await env.DB.prepare(`UPDATE posts SET like_count = ? WHERE post_id = ?`).bind(count, postId).run();

        return new Response(JSON.stringify({
            success: true,
            data: { liked, count, promoted, message, category: promoted ? 'popular' : post.category }
        }), { headers: { "Content-Type": "application/json" } });

    } catch (err) {
        // 에러 발생 시 구체적인 원인 반환
        return new Response(JSON.stringify({ success: false, message: err.message }), { status: 500 });
    }
}