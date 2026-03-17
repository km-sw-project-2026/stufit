type HandlerContext = {
  env: any;
  userId: number;
};

export default async function handler(request: Request, { env, userId }: HandlerContext) {
  try {
    const id = Number(new URL(request.url).pathname.split('/')[3]);
    if (Number.isNaN(id)) return new Response('Invalid challengeId', { status: 400 });

    const hasColumn = async (tableName: string, columnName: string) => {
      const pragma = await env.D1_DB.prepare(`PRAGMA table_info('${tableName}')`).all();
      return (pragma.results || []).some((c: any) => c.name === columnName);
    };

    await env.D1_DB.prepare(`CREATE TABLE IF NOT EXISTS challenge_started_flags (
      challenge_id INTEGER PRIMARY KEY,
      started_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`).run();

    const hasIsStarted = await hasColumn('challenges', 'is_started');

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

      const memberCount = Array.isArray(members?.results) ? members.results.length : 0;
      const maxMembers = Number((challenge as any)?.max_members || 0);
      const startedFlag = await env.D1_DB
        .prepare('SELECT 1 FROM challenge_started_flags WHERE challenge_id = ?')
        .bind(id)
        .first();
      const computedStarted = hasIsStarted
        ? Number((challenge as any)?.is_started || 0) === 1 || memberCount >= maxMembers
        : Boolean(startedFlag) || memberCount >= maxMembers;

      // compute duration: created_at을 UTC로 파싱하여 timezone 오차 방지
      try {
        const msPerDay = 24 * 60 * 60 * 1000;
        if (challenge.end_date && challenge.created_at) {
          // SQLite datetime('now') 형식 "YYYY-MM-DD HH:MM:SS" → UTC로 명시 파싱
          const createdAtStr = String(challenge.created_at).replace(' ', 'T');
          const createdAtUTC = createdAtStr.endsWith('Z') ? createdAtStr : createdAtStr + 'Z';
          const s = new Date(createdAtUTC);
          const e = new Date(challenge.end_date);
          const sd = Date.UTC(s.getUTCFullYear(), s.getUTCMonth(), s.getUTCDate());
          const ed = Date.UTC(e.getUTCFullYear(), e.getUTCMonth(), e.getUTCDate());
          const diffExclusive = Math.floor((ed - sd) / msPerDay);
          (challenge as any).duration = diffExclusive + 1;
        }
      } catch (e) {
        // ignore
      }

      return Response.json({
        success: true,
        data: {
          ...challenge,
          is_started: computedStarted ? 1 : 0,
          member_count: memberCount,
          isJoined: !!member,
          members: members.results || []
        },
        message: '챌린지 상세 조회'
      });
    }

    if (request.method === 'DELETE') {
      if (challenge.created_by_user_id !== userId) return Response.json({ success: false, message: '권한 없음' }, { status: 403 });

      // 시작 전 삭제 시 모든 멤버에게 bet_points 환급
      const isStartedNow = hasIsStarted
        ? Number((challenge as any).is_started || 0) === 1
        : Boolean(await env.D1_DB.prepare('SELECT 1 FROM challenge_started_flags WHERE challenge_id = ?').bind(id).first());

      if (!isStartedNow) {
        const hasBetCol = await hasColumn('challenges', 'bet_points');
        let betPoints = hasBetCol ? Number((challenge as any).bet_points || 0) : 0;
        if (!hasBetCol) {
          try {
            await env.D1_DB.prepare(`CREATE TABLE IF NOT EXISTS challenge_bets (challenge_id INTEGER PRIMARY KEY, bet_points INTEGER NOT NULL)`).run();
            const betRow = await env.D1_DB.prepare('SELECT bet_points FROM challenge_bets WHERE challenge_id = ?').bind(id).first();
            betPoints = Number((betRow as any)?.bet_points || 0);
          } catch (e) { /* ignore */ }
        }

        if (betPoints > 0) {
          const allMembers = await env.D1_DB
            .prepare('SELECT user_id FROM challenge_members WHERE challenge_id = ?')
            .bind(id)
            .all();

          const pointLogInfo = await env.D1_DB.prepare("PRAGMA table_info('point_logs')").all();
          const pointLogCols = Array.isArray(pointLogInfo?.results) ? pointLogInfo.results : [];
          const pointLogCol = pointLogCols.some((c: any) => c.name === 'point') ? 'point'
            : pointLogCols.some((c: any) => c.name === 'points') ? 'points' : null;

          for (const row of (allMembers.results || [])) {
            const memberId = (row as any).user_id;
            await env.D1_DB.prepare("INSERT OR IGNORE INTO user_profiles (user_id, score, points) VALUES (?, 0, 0)").bind(memberId).run();
            // point_logs에 points 차감 기록이 있으면 points로 환급, 아니면 score로 환급
            const wasPointLog = pointLogCol
              ? await env.D1_DB
                  .prepare(`SELECT 1 FROM point_logs WHERE user_id = ? AND reason LIKE ? AND ${pointLogCol} < 0 LIMIT 1`)
                  .bind(memberId, `challenge_bet:${id}:%`)
                  .first()
              : null;
            if (wasPointLog && pointLogCol) {
              await env.D1_DB.prepare('UPDATE user_profiles SET score = score + ? WHERE user_id = ?').bind(betPoints, memberId).run();
              await env.D1_DB
                .prepare(`INSERT INTO point_logs (user_id, ${pointLogCol}, reason, created_at) VALUES (?, ?, ?, ?)`)
                .bind(memberId, betPoints, `challenge_bet:${id}:refund`, new Date().toISOString())
                .run();
            } else {
              await env.D1_DB.prepare('UPDATE user_profiles SET score = score + ? WHERE user_id = ?').bind(betPoints, memberId).run();
            }
          }
        }
      } else {
        // 시작 후 삭제 시: 참가자들의 score에서 배팅한 점수만큼 차감
        const hasBetCol = await hasColumn('challenges', 'bet_points');
        let betPoints = hasBetCol ? Number((challenge as any).bet_points || 0) : 0;
        if (!hasBetCol) {
          try {
            await env.D1_DB.prepare(`CREATE TABLE IF NOT EXISTS challenge_bets (challenge_id INTEGER PRIMARY KEY, bet_points INTEGER NOT NULL)`).run();
            const betRow = await env.D1_DB.prepare('SELECT bet_points FROM challenge_bets WHERE challenge_id = ?').bind(id).first();
            betPoints = Number((betRow as any)?.bet_points || 0);
          } catch (e) { /* ignore */ }
        }

        if (betPoints > 0) {
          const allMembers = await env.D1_DB
            .prepare('SELECT user_id FROM challenge_members WHERE challenge_id = ?')
            .bind(id)
            .all();

          const pointLogInfo = await env.D1_DB.prepare("PRAGMA table_info('point_logs')").all();
          const pointLogCols = Array.isArray(pointLogInfo?.results) ? pointLogInfo.results : [];
          const pointLogCol = pointLogCols.some((c: any) => c.name === 'point') ? 'point'
            : pointLogCols.some((c: any) => c.name === 'points') ? 'points' : null;

          for (const row of (allMembers.results || [])) {
            const memberId = (row as any).user_id;
            await env.D1_DB.prepare("INSERT OR IGNORE INTO user_profiles (user_id, score, points) VALUES (?, 0, 0)").bind(memberId).run();
            const currentProfile = await env.D1_DB.prepare('SELECT score FROM user_profiles WHERE user_id = ?').bind(memberId).first();
            const currentScore = Number((currentProfile as any)?.score || 0);
            const nextScore = Math.max(0, currentScore - betPoints);
            await env.D1_DB.prepare('UPDATE user_profiles SET score = ? WHERE user_id = ?').bind(nextScore, memberId).run();

            if (pointLogCol) {
              await env.D1_DB
                .prepare(`INSERT INTO point_logs (user_id, ${pointLogCol}, reason, created_at) VALUES (?, ?, ?, ?)`)
                .bind(memberId, -betPoints, `challenge_bet:${id}:deleted`, new Date().toISOString())
                .run();
            }
          }
        }
      }

      await env.D1_DB.prepare('DELETE FROM challenge_results WHERE challenge_id = ?').bind(id).run();
      await env.D1_DB.prepare('DELETE FROM challenge_daily_progress WHERE challenge_id = ?').bind(id).run();
      await env.D1_DB.prepare('DELETE FROM challenge_members WHERE challenge_id = ?').bind(id).run();
      await env.D1_DB.prepare('DELETE FROM challenge_started_flags WHERE challenge_id = ?').bind(id).run();
      await env.D1_DB.prepare(`CREATE TABLE IF NOT EXISTS challenge_bets (
        challenge_id INTEGER PRIMARY KEY,
        bet_points INTEGER NOT NULL
      )`).run();
      await env.D1_DB.prepare('DELETE FROM challenge_bets WHERE challenge_id = ?').bind(id).run();
      await env.D1_DB.prepare('DELETE FROM challenges WHERE challenge_id = ?').bind(id).run();

      return Response.json({ success: true, data: { challengeId: id }, message: '챌린지 삭제 완료' });
    }

    return new Response('Method not allowed', { status: 405 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return Response.json({ success: false, message: 'DB 오류 발생', error: message }, { status: 500 });
  }
}
