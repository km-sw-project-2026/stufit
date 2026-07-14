// ----------------원래 쓰던 코드

export async function onRequestPost({ env, params, userId }) {
  try {
    if (!userId) {
      return Response.json(
        { success: false, message: "로그인이 필요합니다." },
        { status: 401 },
      );
    }

    const commentId = Number(params.id);
    if (Number.isNaN(commentId))
      return new Response("Invalid comment id", { status: 400 });

    const exists = await env.D1_DB.prepare(
      "SELECT 1 FROM comment_likes WHERE comment_id = ? AND user_id = ?",
    )
      .bind(commentId, userId)
      .first();

    if (exists) {
      await env.D1_DB.prepare(
        "DELETE FROM comment_likes WHERE comment_id = ? AND user_id = ?",
      )
        .bind(commentId, userId)
        .run();
    } else {
      await env.D1_DB.prepare(
        "INSERT INTO comment_likes (comment_id, user_id) VALUES (?, ?)",
      )
        .bind(commentId, userId)
        .run();
    }

    const countRow = await env.D1_DB.prepare(
      "SELECT COUNT(*) as cnt FROM comment_likes WHERE comment_id = ?",
    )
      .bind(commentId)
      .first();
    const count = countRow?.cnt || 0;

    return Response.json({ success: true, data: { liked: !exists, count } });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return Response.json(
      { success: false, message: "좋아요 처리 실패", error: message },
      { status: 500 },
    );
  }
}
