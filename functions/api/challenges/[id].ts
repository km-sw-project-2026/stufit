type HandlerContext = {
  env: any;
  userId: number;
};

export default async function handler(request: Request, { env, userId }: HandlerContext) {
  try {
    const id = Number(new URL(request.url).pathname.split('/')[3]);
    if (Number.isNaN(id)) return new Response('Invalid challengeId', { status: 400 });

    const challenge = await env.D1_DB.prepare('SELECT * FROM challenges WHERE challenge_id = ?').bind(id).first();
    if (!challenge) return Response.json({ success: false, message: '챌린지 없음' }, { status: 404 });

    let member = null;
    if (typeof userId === 'number') {
      member = await env.D1_DB.prepare('SELECT * FROM challenge_members WHERE challenge_id = ? AND user_id = ?').bind(id, userId).first();
    }

    if (request.method === 'GET') {
      // fetch members who joined this challenge (handle older DBs without status column)
      let members;
      try {
        const pragma = await env.D1_DB.prepare("PRAGMA table_info('challenge_members')").all();
        const hasStatus = (pragma.results || []).some((c: any) => c.name === 'status');

        if (hasStatus) {
          members = await env.D1_DB
            .prepare('SELECT u.user_id, u.username, cm.status FROM challenge_members cm JOIN users u ON cm.user_id = u.user_id WHERE cm.challenge_id = ?')
            .bind(id)
            .all();
          console.log(`[Challenge Detail] Loaded ${members.results?.length || 0} members with status for challenge ${id}`);
        } else {
          console.warn(`[Challenge Detail] status column missing for challenge ${id}`);
          members = await env.D1_DB
            .prepare('SELECT u.user_id, u.username FROM challenge_members cm JOIN users u ON cm.user_id = u.user_id WHERE cm.challenge_id = ?')
            .bind(id)
            .all();
          members.results = (members.results || []).map((r: any) => ({ ...r, status: 'not_submitted' }));
        }
      } catch (e) {
        // fallback: try simple select without status
        members = await env.D1_DB
          .prepare('SELECT u.user_id, u.username FROM challenge_members cm JOIN users u ON cm.user_id = u.user_id WHERE cm.challenge_id = ?')
          .bind(id)
          .all();
        members.results = (members.results || []).map((r: any) => ({ ...r, status: 'not_submitted' }));
      }

      // compute duration to help clients display correct total days
      try {
        const msPerDay = 24 * 60 * 60 * 1000;
        if (challenge.end_date && challenge.created_at) {
          const s = new Date(challenge.created_at);
          const e = new Date(challenge.end_date);
          const sd = Date.UTC(s.getFullYear(), s.getMonth(), s.getDate());
          const ed = Date.UTC(e.getFullYear(), e.getMonth(), e.getDate());
          const diffExclusive = Math.floor((ed - sd) / msPerDay);
          (challenge as any).duration = diffExclusive + 1;
        }
      } catch (e) {
        // ignore
      }

      return Response.json({ success: true, data: { ...challenge, isJoined: !!member, members: members.results || [] }, message: '챌린지 상세 조회' });
    }

    if (request.method === 'DELETE') {
      if (challenge.created_by_user_id !== userId) return Response.json({ success: false, message: '권한 없음' }, { status: 403 });

      await env.D1_DB.prepare('DELETE FROM challenges WHERE challenge_id = ?').bind(id).run();
      await env.D1_DB.prepare('DELETE FROM challenge_members WHERE challenge_id = ?').bind(id).run();

      return Response.json({ success: true, data: { challengeId: id }, message: '챌린지 삭제 완료' });
    }

    return new Response('Method not allowed', { status: 405 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return Response.json({ success: false, message: 'DB 오류 발생', error: message }, { status: 500 });
  }
}
