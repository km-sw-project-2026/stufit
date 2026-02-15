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
  const { env, params, request } = context;
  
  try {
    // 1. 요청 바디에서 userId 추출
    const body = await request.json().catch(() => ({}));
    const userId = body.userId;

    if (!userId) {
      return Response.json({ success: false, message: '로그인이 필요합니다.' }, { status: 401 });
    }

    const postId = Number(params.id);
    if (Number.isNaN(postId)) {
      return new Response('Invalid post id', { status: 400 });
    }

    // 2. 현재 유저가 이 게시글에 좋아요를 눌렀는지 확인
    const exists = await env.D1_DB
      .prepare('SELECT 1 FROM post_likes WHERE post_id = ? AND user_id = ?')
      .bind(postId, userId)
      .first();

    // 3. 좋아요 토글 로직 (있으면 삭제, 없으면 추가)
    if (exists) {
      await env.D1_DB.prepare('DELETE FROM post_likes WHERE post_id = ? AND user_id = ?')
        .bind(postId, userId)
        .run();
    } else {
      await env.D1_DB.prepare('INSERT INTO post_likes (post_id, user_id) VALUES (?, ?)')
        .bind(postId, userId)
        .run();
    }

    // 4. 업데이트된 게시글의 총 좋아요 수 조회
    const countRow = await env.D1_DB
      .prepare('SELECT COUNT(*) as cnt FROM post_likes WHERE post_id = ?')
      .bind(postId)
      .first();
    const count = countRow?.cnt || 0;

    // 5. 인기글 및 포인트 보상 로직 (좋아요 200개 기준)
    const post = await env.D1_DB
      .prepare('SELECT user_id, popular_reward_paid FROM posts WHERE post_id = ?')
      .bind(postId)
      .first();
    
    let promoted = false;
    // 좋아요가 200개 이상이고, 아직 이 게시글로 보상을 받은 적이 없는 경우
    if (count >= 1 && post && post.popular_reward_paid === 0) {
      // (1) 작성자에게 300포인트 지급
      // (2) 보상 지급 완료 표시(1) 및 카테고리를 'popular'로 변경
      await env.D1_DB.batch([
        env.D1_DB.prepare('UPDATE users SET points = points + 300 WHERE user_id = ?')
          .bind(post.user_id),
        env.D1_DB.prepare("UPDATE posts SET popular_reward_paid = 1, category = 'popular' WHERE post_id = ?")
          .bind(postId)
      ]);
      promoted = true;
    }

    return Response.json({ 
      success: true, 
      data: { 
        liked: !exists, 
        count, 
        promoted,
        message: promoted ? '축하합니다! 인기글 달성으로 300포인트가 지급되었습니다.' : '' 
      } 
    });

  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return Response.json({ 
      success: false, 
      message: '좋아요 처리 중 오류가 발생했습니다.', 
      error: message 
    }, { status: 500 });
  }
}