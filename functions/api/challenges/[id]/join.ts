export default async function onRequestPost(request: Request, { env, params, userId }: any) {
  try {
    if (!env?.D1_DB) {
      return Response.json({ success: false, message: '데이터베이스 연결 오류' }, { status: 500 });
    }

    if (!userId) {
      return Response.json({ success: false, message: '로그인이 필요합니다.' }, { status: 401 });
    }

    const id = Number(params.id);
    if (Number.isNaN(id)) return Response.json({ success: false, message: 'Invalid challenge id' }, { status: 400 });

    // 이미 참가했는지 확인
    const exists = await env.D1_DB
      .prepare('SELECT 1 FROM challenge_members WHERE challenge_id = ? AND user_id = ?')
      .bind(id, userId)
      .first();

    if (exists) {
      // 반환시 현재 멤버 목록도 함께 반환
        const members = await env.D1_DB
          .prepare('SELECT u.user_id, u.username, cm.status FROM challenge_members cm JOIN users u ON cm.user_id = u.user_id WHERE cm.challenge_id = ?')
        .bind(id)
        .all();
      return Response.json({ success: true, message: '이미 참가중입니다.', members: members.results || [] });
    }

    // 참가자 추가
    await env.D1_DB
      .prepare("INSERT INTO challenge_members (challenge_id, user_id, joined_at) VALUES (?, ?, datetime('now'))")
      .bind(id, userId)
      .run();

      const members = await env.D1_DB
        .prepare('SELECT u.user_id, u.username, cm.status FROM challenge_members cm JOIN users u ON cm.user_id = u.user_id WHERE cm.challenge_id = ?')
      .bind(id)
      .all();

    return Response.json({ success: true, message: '참가 완료', members: members.results || [] }, { status: 201 });
  } catch (err: any) {
    const message = err instanceof Error ? err.message : String(err);
    return Response.json({ success: false, message: '참가 처리 실패', error: message }, { status: 500 });
  }
}
