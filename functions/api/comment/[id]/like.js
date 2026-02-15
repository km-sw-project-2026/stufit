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
    const username = request.headers.get("X-Username");

    if (!username) {
        return new Response(JSON.stringify({ success: false, message: "로그인이 필요합니다." }), { status: 401 });
    }

    try {
        // 1. 현재 좋아요 상태 확인
        const existing = await env.DB.prepare(`
            SELECT id FROM post_likes WHERE post_id = ? AND username = ?
        `).bind(postId, username).first();

        let liked = false;
        if (existing) {
            await env.DB.prepare(`DELETE FROM post_likes WHERE id = ?`).bind(existing.id).run();
        } else {
            await env.DB.prepare(`INSERT INTO post_likes (post_id, username) VALUES (?, ?)`).bind(postId, username).run();
            liked = true;
        }

        // 2. 해당 게시물의 전체 좋아요 수 계산
        const countResult = await env.DB.prepare(`
            SELECT COUNT(*) as count FROM post_likes WHERE post_id = ?
        `).bind(postId).first();
        
        const count = parseInt(countResult.count);

        // 3. 게시물 정보 및 보상 지급 여부 확인
        const post = await env.DB.prepare(`
            SELECT author, category, popular_reward_paid FROM posts WHERE post_id = ?
        `).bind(postId).first();

        let promoted = false;
        let message = "";

        // [실험용 기준 1개] 조건 검사 (숫자 형변환 추가)
        if (count >= 1 && post && Number(post.popular_reward_paid) === 0) {
            // 포인트 300P 지급
            await env.DB.prepare(`
                UPDATE users SET points = points + 300 WHERE username = ?
            `).bind(post.author).run();

            // 카테고리 변경 및 지급 완료 표시
            await env.DB.prepare(`
                UPDATE posts SET category = 'popular', popular_reward_paid = 1 WHERE post_id = ?
            `).bind(postId).run();

            promoted = true;
            message = "축하합니다! 인기글로 선정되어 300P가 지급되었습니다.";
        }

        // 4. 최종 좋아요 수 업데이트 (DB 동기화)
        await env.DB.prepare(`
            UPDATE posts SET like_count = ? WHERE post_id = ?
        `).bind(count, postId).run();

        return new Response(JSON.stringify({
            success: true,
            data: { liked, count, promoted, message, category: promoted ? 'popular' : post.category }
        }), { headers: { "Content-Type": "application/json" } });

    } catch (err) {
        return new Response(JSON.stringify({ success: false, message: err.message }), { status: 500 });
    }
}