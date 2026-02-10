export async function onRequestPost({ env, params, userId }) {
  try {
    if (!userId) {
      return Response.json({ success: false, message: '로그인이 필요합니다.' }, { status: 401 });
    }

    const postId = Number(params.id);
    if (Number.isNaN(postId)) return new Response('Invalid post id', { status: 400 });

    const exists = await env.D1_DB
      .prepare('SELECT 1 FROM post_likes WHERE post_id = ? AND user_id = ?')
      .bind(postId, userId)
      .first();

    if (exists) {
      await env.D1_DB.prepare('DELETE FROM post_likes WHERE post_id = ? AND user_id = ?').bind(postId, userId).run();
    } else {
      await env.D1_DB.prepare('INSERT INTO post_likes (post_id, user_id) VALUES (?, ?)').bind(postId, userId).run();
    }

    const countRow = await env.D1_DB.prepare('SELECT COUNT(*) as cnt FROM post_likes WHERE post_id = ?').bind(postId).first();
    const count = countRow?.cnt || 0;

    // 좋아요 1개 이상이면 Popular 등록 및 포인트 지급 (테스트용)
    if (count >= 1) {
      const post = await env.D1_DB
        .prepare('SELECT user_id, popular_reward_paid FROM posts WHERE post_id = ?')
        .bind(postId)
        .first();

      if (post && post.popular_reward_paid === 0) {
        // 카테고리를 'popular'로 변경
        await env.D1_DB
          .prepare('UPDATE posts SET category = ?, popular_reward_paid = 1 WHERE post_id = ?')
          .bind('popular', postId)
          .run();

        // 작성자에게 포인트 200 지급
        const authorId = post.user_id;
        
        // user_profiles 테이블에 포인트 추가
        await env.D1_DB
          .prepare('UPDATE user_profiles SET points = points + 200 WHERE user_id = ?')
          .bind(authorId)
          .run();

        // point_logs에 기록
        const now = new Date().toISOString();
        await env.D1_DB
          .prepare('INSERT INTO point_logs (user_id, point, reason, created_at) VALUES (?, ?, ?, ?)')
          .bind(authorId, 200, 'Popular 게시글 등록 (좋아요 200개 달성)', now)
          .run();
      }
    }

    return Response.json({ success: true, data: { liked: !exists, count } });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return Response.json({ success: false, message: '좋아요 처리 실패', error: message }, { status: 500 });
  }
}
