export async function onRequestPatch({ request, env, params, userId }) {
  try {
    if (!userId) {
      return Response.json({ success: false, message: '로그인이 필요합니다.' }, { status: 401 });
    }

    const commentId = Number(params.id);
    if (Number.isNaN(commentId)) return new Response('Invalid comment id', { status: 400 });

    const comment = await env.D1_DB.prepare('SELECT * FROM comments WHERE comment_id = ?').bind(commentId).first();
    if (!comment) return Response.json({ success: false, message: '댓글 없음' }, { status: 404 });
    if (comment.user_id !== userId) {
      return Response.json({ success: false, message: '권한 없음' }, { status: 403 });
    }

    const body = await request.json().catch(() => null) || {};
    const content = typeof body.content === 'string' ? body.content.trim() : '';
    if (!content) {
      return Response.json({ success: false, message: '댓글 내용을 입력해주세요.' }, { status: 400 });
    }

    await env.D1_DB.prepare('UPDATE comments SET content = ? WHERE comment_id = ?').bind(content, commentId).run();

    const updated = await env.D1_DB
      .prepare('SELECT c.*, u.username FROM comments c LEFT JOIN users u ON c.user_id = u.user_id WHERE c.comment_id = ?')
      .bind(commentId)
      .first();

    return Response.json({ success: true, data: updated });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return Response.json({ success: false, message: '댓글 수정 실패', error: message }, { status: 500 });
  }
}

export async function onRequestDelete({ env, params, userId }) {
  try {
    if (!userId) {
      return Response.json({ success: false, message: '로그인이 필요합니다.' }, { status: 401 });
    }

    const commentId = Number(params.id);
    if (Number.isNaN(commentId)) return new Response('Invalid comment id', { status: 400 });

    const comment = await env.D1_DB.prepare('SELECT * FROM comments WHERE comment_id = ?').bind(commentId).first();
    if (!comment) return Response.json({ success: false, message: '댓글 없음' }, { status: 404 });
    if (comment.user_id !== userId) {
      return Response.json({ success: false, message: '권한 없음' }, { status: 403 });
    }

    await env.D1_DB.prepare('DELETE FROM comments WHERE comment_id = ?').bind(commentId).run();

    return Response.json({ success: true, data: { commentId } });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return Response.json({ success: false, message: '댓글 삭제 실패', error: message }, { status: 500 });
  }
}
