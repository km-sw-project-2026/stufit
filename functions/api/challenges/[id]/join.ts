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

    const challenge = await env.D1_DB
      .prepare('SELECT challenge_id, max_members, deleted_at FROM challenges WHERE challenge_id = ?')
      .bind(id)
      .first();

    if (!challenge || (challenge as any).deleted_at) {
      return Response.json({ success: false, message: '존재하지 않는 챌린지입니다.' }, { status: 404 });
    }

    const maxMembers = Number((challenge as any).max_members || 0);
    if (!maxMembers || maxMembers < 1) {
      return Response.json({ success: false, message: '챌린지 정원 정보가 올바르지 않습니다.' }, { status: 400 });
    }

    const hasIsStartedColumn = (() => {
      // keep as a lazy promise for reuse below
      let cache: Promise<boolean> | null = null;
      return () => {
        if (!cache) {
          cache = env.D1_DB
            .prepare("PRAGMA table_info('challenges')")
            .all()
            .then((r: any) => (r.results || []).some((c: any) => c.name === 'is_started'));
        }
        return cache;
      };
    })();

    // 이미 참가했는지 확인
    const exists = await env.D1_DB
      .prepare('SELECT 1 FROM challenge_members WHERE challenge_id = ? AND user_id = ?')
      .bind(id, userId)
      .first();

    if (exists) {
      // 반환시 현재 멤버 목록도 함께 반환
        // members 쿼리: 일부 DB에는 cm.status 컬럼이 없을 수 있어 PRAGMA로 확인
        const cols = await env.D1_DB.prepare("PRAGMA table_info('challenge_members')").all();
        const hasStatus = Array.isArray(cols.results) && cols.results.some((c: any) => c.name === 'status');
        const membersQuery = hasStatus
          ? 'SELECT u.user_id, u.username, cm.status FROM challenge_members cm JOIN users u ON cm.user_id = u.user_id WHERE cm.challenge_id = ?'
          : 'SELECT u.user_id, u.username FROM challenge_members cm JOIN users u ON cm.user_id = u.user_id WHERE cm.challenge_id = ?';
        const members = await env.D1_DB.prepare(membersQuery).bind(id).all();
      return Response.json({ success: true, message: '이미 참가중입니다.', members: members.results || [] });
    }

    const memberCountBefore = await env.D1_DB
      .prepare('SELECT COUNT(*) AS count FROM challenge_members WHERE challenge_id = ?')
      .bind(id)
      .first();
    const currentMembers = Number((memberCountBefore as any)?.count || 0);

    if (currentMembers >= maxMembers) {
      return Response.json({ success: false, message: '정원이 가득 차 참가할 수 없습니다.' }, { status: 409 });
    }

    // 참가자 추가
    await env.D1_DB
      .prepare("INSERT INTO challenge_members (challenge_id, user_id, joined_at) VALUES (?, ?, datetime('now'))")
      .bind(id, userId)
      .run();

    const memberCountAfter = await env.D1_DB
      .prepare('SELECT COUNT(*) AS count FROM challenge_members WHERE challenge_id = ?')
      .bind(id)
      .first();
    const joinedMembers = Number((memberCountAfter as any)?.count || 0);

    if (await hasIsStartedColumn()) {
      if (joinedMembers >= maxMembers) {
        await env.D1_DB
          .prepare('UPDATE challenges SET is_started = 1 WHERE challenge_id = ?')
          .bind(id)
          .run();
      }
    }

    // 멤버 목록 조회 (status 컬럼 유무에 따라 쿼리 조정)
    const cols2 = await env.D1_DB.prepare("PRAGMA table_info('challenge_members')").all();
    const hasStatus2 = Array.isArray(cols2.results) && cols2.results.some((c: any) => c.name === 'status');
    const membersQuery2 = hasStatus2
      ? 'SELECT u.user_id, u.username, cm.status FROM challenge_members cm JOIN users u ON cm.user_id = u.user_id WHERE cm.challenge_id = ?'
      : 'SELECT u.user_id, u.username FROM challenge_members cm JOIN users u ON cm.user_id = u.user_id WHERE cm.challenge_id = ?';
    const members = await env.D1_DB.prepare(membersQuery2).bind(id).all();

    const startedNow = joinedMembers >= maxMembers;
    return Response.json({
      success: true,
      message: startedNow ? '참가 완료! 정원이 채워져 챌린지가 시작되었습니다.' : '참가 완료',
      members: members.results || [],
      started: startedNow,
      memberCount: joinedMembers,
      maxMembers
    }, { status: 201 });
  } catch (err: any) {
    const message = err instanceof Error ? err.message : String(err);
    return Response.json({ success: false, message: '참가 처리 실패', error: message }, { status: 500 });
  }
}
