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

    return Response.json({ success: true, data: { liked: !exists, count } });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return Response.json({ success: false, message: '좋아요 처리 실패', error: message }, { status: 500 });
  }
}
