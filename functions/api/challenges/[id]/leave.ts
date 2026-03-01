export default async function handler(
  request: Request,
  { env, params, userId }: { env: any; params: { id: string }; userId: number }
) {
  try {
    if (request.method !== 'DELETE') {
      return new Response(JSON.stringify({ success: false, message: 'Method not allowed' }), {
        status: 405,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!env?.D1_DB) {
      return new Response(JSON.stringify({ success: false, message: 'DB not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!userId) {
      return new Response(JSON.stringify({ success: false, message: '로그인이 필요합니다.' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const challengeId = Number(params.id);
    if (Number.isNaN(challengeId)) {
      return new Response(JSON.stringify({ success: false, message: 'Invalid challenge id' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const challengePragma = await env.D1_DB.prepare("PRAGMA table_info('challenges')").all();
    const hasIsStartedCol = (challengePragma.results || []).some((c: any) => c.name === 'is_started');

    const challenge = await env.D1_DB
      .prepare(
        hasIsStartedCol
          ? 'SELECT challenge_id, created_by_user_id, max_members, is_started FROM challenges WHERE challenge_id = ?'
          : 'SELECT challenge_id, created_by_user_id, max_members FROM challenges WHERE challenge_id = ?'
      )
      .bind(challengeId)
      .first();

    if (!challenge) {
      return new Response(JSON.stringify({ success: false, message: 'Challenge not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const membership = await env.D1_DB
      .prepare('SELECT 1 FROM challenge_members WHERE challenge_id = ? AND user_id = ?')
      .bind(challengeId, userId)
      .first();

    if (!membership) {
      return new Response(JSON.stringify({ success: false, message: '참여 중인 챌린지가 아닙니다.' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const pointLogInfo = await env.D1_DB.prepare("PRAGMA table_info('point_logs')").all();
    const pointLogColumns = Array.isArray(pointLogInfo?.results) ? pointLogInfo.results : [];
    const pointLogColumn = pointLogColumns.some((col: any) => col.name === 'point')
      ? 'point'
      : pointLogColumns.some((col: any) => col.name === 'points')
        ? 'points'
        : null;

    const isOwner = Number((challenge as any).created_by_user_id) === Number(userId);
    let deletedChallenge = false;

    if (isOwner) {
      const nextOwner = await env.D1_DB
        .prepare('SELECT user_id FROM challenge_members WHERE challenge_id = ? AND user_id != ? ORDER BY joined_at ASC LIMIT 1')
        .bind(challengeId, userId)
        .first();

      if (nextOwner?.user_id) {
        await env.D1_DB
          .prepare('UPDATE challenges SET created_by_user_id = ? WHERE challenge_id = ?')
          .bind(nextOwner.user_id, challengeId)
          .run();

        await env.D1_DB
          .prepare('DELETE FROM challenge_members WHERE challenge_id = ? AND user_id = ?')
          .bind(challengeId, userId)
          .run();
      } else {
        await env.D1_DB.prepare('DELETE FROM challenge_results WHERE challenge_id = ?').bind(challengeId).run();
        await env.D1_DB.prepare('DELETE FROM challenge_daily_progress WHERE challenge_id = ?').bind(challengeId).run();
        await env.D1_DB.prepare('DELETE FROM challenge_members WHERE challenge_id = ?').bind(challengeId).run();
        await env.D1_DB.prepare(`CREATE TABLE IF NOT EXISTS challenge_bets (
          challenge_id INTEGER PRIMARY KEY,
          bet_points INTEGER NOT NULL
        )`).run();
        await env.D1_DB.prepare('DELETE FROM challenge_bets WHERE challenge_id = ?').bind(challengeId).run();
        await env.D1_DB.prepare(`CREATE TABLE IF NOT EXISTS challenge_started_flags (
          challenge_id INTEGER PRIMARY KEY,
          started_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        )`).run();
        await env.D1_DB.prepare('DELETE FROM challenge_started_flags WHERE challenge_id = ?').bind(challengeId).run();
        await env.D1_DB.prepare('DELETE FROM challenges WHERE challenge_id = ?').bind(challengeId).run();
        deletedChallenge = true;
      }
    } else {
      await env.D1_DB
        .prepare('DELETE FROM challenge_members WHERE challenge_id = ? AND user_id = ?')
        .bind(challengeId, userId)
        .run();
    }

    // 기존 정책 유지: 챌린지 나가기 시 100 포인트 차감 (삭제로 챌린지가 사라져도 사용자 패널티는 적용)
    await env.D1_DB
      .prepare("INSERT OR IGNORE INTO user_profiles (user_id, score, points) VALUES (?, 0, 0)")
      .bind(userId)
      .run();

    const currentProfile = await env.D1_DB
      .prepare('SELECT points FROM user_profiles WHERE user_id = ?')
      .bind(userId)
      .first();
    const currentPoints = Number((currentProfile as any)?.points || 0);
    const nextPoints = Math.max(0, currentPoints - 100);

    await env.D1_DB
      .prepare('UPDATE user_profiles SET points = ? WHERE user_id = ?')
      .bind(nextPoints, userId)
      .run();

    if (pointLogColumn) {
      await env.D1_DB
        .prepare(`INSERT INTO point_logs (user_id, ${pointLogColumn}, reason, created_at) VALUES (?, ?, ?, ?)`)
        .bind(userId, -100, isOwner ? '챌린지 중도 포기 (방장)' : '챌린지 포기', new Date().toISOString())
        .run();
    }

    const updatedProfile = await env.D1_DB
      .prepare('SELECT points, score FROM user_profiles WHERE user_id = ?')
      .bind(userId)
      .first();

    if (deletedChallenge) {
      return new Response(
        JSON.stringify({
          success: true,
          message: '챌린지가 삭제되었습니다.',
          deleted: true,
          challenge: null,
          members: [],
          points: updatedProfile?.points || 0,
          score: updatedProfile?.score || 0
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const pragma = await env.D1_DB.prepare("PRAGMA table_info('challenge_members')").all();
    const hasStatus = (pragma.results || []).some((c: any) => c.name === 'status');
    let members;
    if (hasStatus) {
      members = await env.D1_DB
        .prepare('SELECT u.user_id, u.username, cm.status FROM challenge_members cm JOIN users u ON cm.user_id = u.user_id WHERE cm.challenge_id = ?')
        .bind(challengeId)
        .all();
    } else {
      members = await env.D1_DB
        .prepare('SELECT u.user_id, u.username FROM challenge_members cm JOIN users u ON cm.user_id = u.user_id WHERE cm.challenge_id = ?')
        .bind(challengeId)
        .all();
      members.results = (members.results || []).map((r: any) => ({ ...r, status: 'not_submitted' }));
    }

    const updatedChallenge = await env.D1_DB
      .prepare('SELECT * FROM challenges WHERE challenge_id = ?')
      .bind(challengeId)
      .first();

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Successfully left challenge',
        deleted: false,
        members: members.results || [],
        challenge: updatedChallenge,
        points: updatedProfile?.points || 0,
        score: updatedProfile?.score || 0
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Server error',
        error: err instanceof Error ? err.message : String(err)
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
