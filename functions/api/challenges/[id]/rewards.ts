declare interface D1Database {
  prepare(query: string): any;
}

interface Env {
  D1_DB: D1Database;
}

type PagesFunction<T = any> = (context: { request: Request; params: { id: string }; env: T; userId?: number }) => Promise<Response>;

const safeLower = (value: any) => (typeof value === 'string' ? value.toLowerCase() : '');

const resolveMode = (challenge: any) => {
  const mode = safeLower(challenge?.mode);
  if (mode) return mode;

  if (challenge?.category === 'DAILY') return 'daily';
  return 'main';
};

const resolveType = (challenge: any) => {
  const type = safeLower(challenge?.type);
  if (type) return type;

  if (challenge?.category === 'STUDY') return 'study';
  if (challenge?.category === 'EXERCISE') return 'exercise';
  if (challenge?.category === 'DAILY') return 'daily';
  return '';
};

const resolveTotalDays = (challenge: any) => {
  const rawDuration = Number(challenge?.duration);
  if (!Number.isNaN(rawDuration) && rawDuration > 0) return rawDuration;

  if (challenge?.end_date) {
    try {
      const startRaw = challenge?.created_at || challenge?.start_date || null;
      if (startRaw) {
        const start = new Date(startRaw);
        const end = new Date(challenge.end_date);
        const msPerDay = 24 * 60 * 60 * 1000;
        const sd = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate());
        const ed = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());
        const diffInclusive = Math.floor((ed - sd) / msPerDay) + 1;
        if (diffInclusive >= 1) return diffInclusive;
      }
    } catch (err) {
      console.warn('[rewards] totalDays error:', err);
    }
  }

  const categoryDays: Record<string, number> = {
    DAILY: 30,
    SHORT: 20
  };

  return categoryDays[challenge?.category] || 30;
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env, params, userId }) => {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ message: 'Method Not Allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  if (!env?.D1_DB) {
    return new Response(JSON.stringify({ message: '서버 설정 오류입니다.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  if (!userId) {
    return new Response(JSON.stringify({ message: '로그인이 필요합니다.' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const challengeId = Number(params?.id);
  if (!challengeId || Number.isNaN(challengeId)) {
    return new Response(JSON.stringify({ message: '유효하지 않은 챌린지입니다.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  let body: any = {};
  try {
    body = await request.json();
  } catch (err) {
    return new Response(JSON.stringify({ message: '요청 본문이 유효하지 않습니다.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const action = body?.action === 'giveup' ? 'giveup' : 'complete';

  const challenge = await env.D1_DB
    .prepare('SELECT challenge_id, created_by_user_id, category, type, mode, created_at, start_date, end_date, duration FROM challenges WHERE challenge_id = ?')
    .bind(challengeId)
    .first();

  if (!challenge) {
    return new Response(JSON.stringify({ message: '챌린지를 찾을 수 없습니다.' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const isMember = await env.D1_DB
    .prepare('SELECT 1 FROM challenge_members WHERE challenge_id = ? AND user_id = ?')
    .bind(challengeId, userId)
    .first();

  if (!isMember) {
    return new Response(JSON.stringify({ message: '참여자만 보상을 받을 수 있습니다.' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const mode = resolveMode(challenge);
  const type = resolveType(challenge);
  let pointLogColumn: 'point' | 'points' | null = null;

  try {
    const pointLogInfo = await env.D1_DB.prepare("PRAGMA table_info('point_logs')").all();
    const columns = Array.isArray(pointLogInfo?.results) ? pointLogInfo.results : [];
    if (columns.some((col: any) => col.name === 'point')) pointLogColumn = 'point';
    else if (columns.some((col: any) => col.name === 'points')) pointLogColumn = 'points';
  } catch (err) {
    console.warn('[rewards] point_logs check failed:', err);
  }

  if (action === 'giveup') {
    const reason = `challenge_reward:${challengeId}:giveup`;
    const already = pointLogColumn
      ? await env.D1_DB
        .prepare('SELECT 1 FROM point_logs WHERE user_id = ? AND reason = ?')
        .bind(userId, reason)
        .first()
      : null;

    if (already) {
      return new Response(JSON.stringify({ success: true, applied: [], ranking: [], type, mode }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const now = new Date().toISOString();
    await env.D1_DB
      .prepare('INSERT OR IGNORE INTO user_profiles (user_id, tier, score, points) VALUES (?, ?, ?, ?)')
      .bind(userId, 'bronze', 0, 0)
      .run();

    const profile = await env.D1_DB
      .prepare('SELECT points FROM user_profiles WHERE user_id = ?')
      .bind(userId)
      .first();

    const currentPoints = Number(profile?.points) || 0;
    const nextPoints = Math.max(0, currentPoints - 100);

    await env.D1_DB
      .prepare('UPDATE user_profiles SET points = ? WHERE user_id = ?')
      .bind(nextPoints, userId)
      .run();

    if (pointLogColumn) {
      try {
        await env.D1_DB
          .prepare(`INSERT INTO point_logs (user_id, ${pointLogColumn}, reason, created_at) VALUES (?, ?, ?, ?)`) 
          .bind(userId, -100, reason, now)
          .run();
      } catch (pointLogErr: any) {
        console.warn('POINT LOG INSERT SKIPPED:', pointLogErr?.message || String(pointLogErr));
      }
    }

    return new Response(
      JSON.stringify({ success: true, applied: [{ userId, points: -100 }], ranking: [], type, mode }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }

  if (Number(challenge.created_by_user_id) !== userId) {
    return new Response(JSON.stringify({ message: '방장만 완료 처리가 가능합니다.' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  let members;
  try {
    members = await env.D1_DB
      .prepare('SELECT u.user_id, u.username FROM challenge_members cm JOIN users u ON cm.user_id = u.user_id WHERE cm.challenge_id = ?')
      .bind(challengeId)
      .all();
  } catch (err) {
    console.warn('[rewards] members query failed:', err);
    return new Response(JSON.stringify({ message: '챌린지 멤버 조회에 실패했습니다.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const memberList = Array.isArray(members?.results) ? members.results : [];
  if (memberList.length === 0) {
    return new Response(
      JSON.stringify({ success: true, applied: [], ranking: [], type, mode }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }

  let progress;
  try {
    progress = await env.D1_DB
      .prepare('SELECT user_id, COUNT(*) as count FROM challenge_daily_progress WHERE challenge_id = ? GROUP BY user_id')
      .bind(challengeId)
      .all();
  } catch (err) {
    console.warn('[rewards] progress query failed:', err);
    progress = { results: [] };
  }

  const counts = new Map<number, number>();
  (progress?.results || []).forEach((row: any) => {
    counts.set(Number(row.user_id), Number(row.count) || 0);
  });

  const totalDays = resolveTotalDays(challenge);
  const base = memberList.map((member: any) => {
    const count = counts.get(Number(member.user_id)) || 0;
    const ratio = totalDays > 0 ? Math.min(count / totalDays, 1) : 0;
    return {
      userId: Number(member.user_id),
      name: member.username,
      count,
      ratio
    };
  });

  base.sort((a, b) => {
    if (b.ratio !== a.ratio) return b.ratio - a.ratio;
    return String(a.name).localeCompare(String(b.name));
  });

  const otherCount = Math.max(base.length - 1, 0);
  const ranking = base.map((item, idx) => {
    let points = 0;

    if (mode === 'practice') {
      points = 0;
    } else if (idx === 0) {
      points = 500;
    } else {
      const otherIndex = idx - 1;
      const tierRatio = otherCount > 0 ? otherIndex / otherCount : 0;
      if (tierRatio < 0.3) points = 400;
      else if (tierRatio < 0.7) points = 300;
      else points = -200;
    }

    return {
      rank: idx + 1,
      name: item.name,
      userId: item.userId,
      points,
      score: Math.round(item.ratio * 100),
      ratio: item.ratio,
      count: item.count,
      totalDays
    };
  });

  if (mode === 'practice') {
    return new Response(
      JSON.stringify({ success: true, applied: [], ranking, type, mode }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const applied: Array<{ userId: number; points: number }> = [];
  const errors: string[] = [];
  const now = new Date().toISOString();
  let transactionStarted = false;

  try {
    await env.D1_DB.prepare('BEGIN').run();
    transactionStarted = true;
  } catch (err) {
    console.warn('[rewards] transaction begin failed:', err);
  }

  try {
    for (const entry of ranking) {
      if (!entry.userId || entry.points === 0) continue;

      try {
        const reason = `challenge_reward:${challengeId}:${action}:${mode}`;
        const already = pointLogColumn
          ? await env.D1_DB
            .prepare('SELECT 1 FROM point_logs WHERE user_id = ? AND reason = ?')
            .bind(entry.userId, reason)
            .first()
          : null;

        if (already) continue;

        await env.D1_DB
          .prepare('INSERT OR IGNORE INTO user_profiles (user_id, tier, score, points) VALUES (?, ?, ?, ?)')
          .bind(entry.userId, 'bronze', 0, 0)
          .run();

        const profile = await env.D1_DB
          .prepare('SELECT points FROM user_profiles WHERE user_id = ?')
          .bind(entry.userId)
          .first();

        const currentPoints = Number(profile?.points) || 0;
        const nextPoints = Math.max(0, currentPoints + entry.points);

        await env.D1_DB
          .prepare('UPDATE user_profiles SET points = ? WHERE user_id = ?')
          .bind(nextPoints, entry.userId)
          .run();

        if (pointLogColumn) {
          try {
            await env.D1_DB
              .prepare(`INSERT INTO point_logs (user_id, ${pointLogColumn}, reason, created_at) VALUES (?, ?, ?, ?)`) 
              .bind(entry.userId, entry.points, reason, now)
              .run();
          } catch (pointLogErr: any) {
            console.warn('POINT LOG INSERT SKIPPED:', pointLogErr?.message || String(pointLogErr));
          }
        }

        applied.push({ userId: entry.userId, points: entry.points });
      } catch (entryErr: any) {
        const message = entryErr?.message || String(entryErr);
        console.warn('[rewards] entry update failed:', entry.userId, message);
        errors.push(message);
      }
    }

    if (transactionStarted) {
      await env.D1_DB.prepare('COMMIT').run();
    }
  } catch (err) {
    if (transactionStarted) {
      try {
        await env.D1_DB.prepare('ROLLBACK').run();
      } catch (rollbackErr) {
        console.warn('[rewards] rollback failed:', rollbackErr);
      }
    }
    return new Response(JSON.stringify({ message: '보상 처리 중 오류가 발생했습니다.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  return new Response(
    JSON.stringify({ success: true, applied, ranking, type, mode, errors }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
};
