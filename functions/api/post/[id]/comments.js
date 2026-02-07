export async function onRequestGet({ env, params, userId }) {
  try {
    const postId = Number(params.id);
    if (Number.isNaN(postId)) return new Response('Invalid post id', { status: 400 });

    const likerId = userId || -1;
    const result = await env.D1_DB
      .prepare(
        `SELECT c.*, u.username,
                (SELECT COUNT(*) FROM comment_likes cl WHERE cl.comment_id = c.comment_id) AS like_count,
                CASE WHEN cl2.user_id IS NULL THEN 0 ELSE 1 END AS user_liked
         FROM comments c
         LEFT JOIN users u ON c.user_id = u.user_id
         LEFT JOIN comment_likes cl2 ON cl2.comment_id = c.comment_id AND cl2.user_id = ?
         WHERE c.post_id = ?
         ORDER BY c.created_at ASC`
      )
      .bind(likerId, postId)
      .all();

    return Response.json({ success: true, data: result.results || [] });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return Response.json({ success: false, message: '댓글을 불러올 수 없습니다.', error: message }, { status: 500 });
  }
}

export async function onRequestPost({ request, env, params, userId }) {
  try {
    if (!userId) {
      return Response.json({ success: false, message: '로그인이 필요합니다.' }, { status: 401 });
    }

    const postId = Number(params.id);
    if (Number.isNaN(postId)) return new Response('Invalid post id', { status: 400 });

    const body = await request.json().catch(() => null) || {};
    const content = typeof body.content === 'string' ? body.content.trim() : '';
    if (!content) {
      return Response.json({ success: false, message: '댓글 내용을 입력해주세요.' }, { status: 400 });
    }

    const now = new Date().toISOString();
    const insert = await env.D1_DB
      .prepare('INSERT INTO comments (post_id, user_id, content, created_at) VALUES (?, ?, ?, ?)')
      .bind(postId, userId, content, now)
      .run();

    const commentId = insert.meta?.last_row_id || insert.lastInsertRowid;
    const created = await env.D1_DB
      .prepare('SELECT c.*, u.username FROM comments c LEFT JOIN users u ON c.user_id = u.user_id WHERE c.comment_id = ?')
      .bind(commentId)
      .first();

    return Response.json({ success: true, data: created }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return Response.json({ success: false, message: '댓글 생성에 실패했습니다.', error: message }, { status: 500 });
  }
}
