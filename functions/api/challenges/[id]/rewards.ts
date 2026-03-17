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

const resolveRankReward = (index: number, total: number) => {
  if (total <= 1) return { points: 0, score: 0 };
  if (index === 0) return { points: 150, score: 150 };

  if (total === 2) return { points: 100, score: 100 };
  if (total === 3) return index === 1 ? { points: 100, score: 100 } : { points: 50, score: 50 };

  const restCount = total - 1;
  const topPercent = Math.ceil(restCount * 0.3) || 1;
  const bottomPercent = Math.ceil(restCount * 0.3) || 1;
  const middlePercent = Math.max(0, restCount - topPercent - bottomPercent);
  const otherIndex = index - 1;

  if (otherIndex < topPercent) return { points: 100, score: 100 };
  if (otherIndex < topPercent + middlePercent) return { points: 50, score: 50 };
  return { points: 30, score: 30 };
};

const jsonRes = (data: any, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });

export const onRequestPost: PagesFunction<Env> = async ({ request, env, params, userId }) => {
  // 모든 처리를 하나의 try/catch로 감싸 D1이 예상치 못한 예외를 던져도
  // 항상 JSON 응답이 반환되도록 합니다.
  try {
  if (request.method !== 'POST') {
    return jsonRes({ message: 'Method Not Allowed' }, 405);
  }

  if (!env?.D1_DB) {
    return jsonRes({ message: '서버 설정 오류입니다.' }, 500);
  }

  if (!userId) {
    return jsonRes({ message: '로그인이 필요합니다.' }, 401);
  }

  const challengeId = Number(params?.id);
  if (!challengeId || Number.isNaN(challengeId)) {
    return jsonRes({ message: '유효하지 않은 챌린지입니다.' }, 400);
  }

  let body: any = {};
  try {
    body = await request.json();
  } catch (err) {
    return jsonRes({ message: '요청 본문이 유효하지 않습니다.' }, 400);
  }

  const submitScore = body?.score !== undefined ? Number(body.score) : null;
  const action = body?.action === 'giveup' ? 'giveup' : 'complete';

  // ── 챌린지 조회 (SELECT * 로 컬럼 존재 여부에 무관하게 조회) ──────────
  let challenge: any = null;
  try {
    challenge = await env.D1_DB
      .prepare('SELECT * FROM challenges WHERE challenge_id = ?')
      .bind(challengeId)
      .first();
  } catch (err: any) {
    console.error('[rewards] challenge query failed:', err?.message || err);
    return jsonRes({ message: '챌린지 조회 중 오류가 발생했습니다.', error: String(err?.message || err) }, 500);
  }

  if (!challenge) {
    return jsonRes({ message: '챌린지를 찾을 수 없습니다.' }, 404);
  }

  // ── 멤버 여부 확인 ────────────────────────────────
  let isMember: any = null;
  try {
    isMember = await env.D1_DB
      .prepare('SELECT 1 FROM challenge_members WHERE challenge_id = ? AND user_id = ?')
      .bind(challengeId, userId)
      .first();
  } catch (err: any) {
    console.error('[rewards] isMember query failed:', err?.message || err);
    return jsonRes({ message: '멤버 확인 중 오류가 발생했습니다.', error: String(err?.message || err) }, 500);
  }

  if (!isMember) {
    return jsonRes({ message: '참여자만 보상을 받을 수 있습니다.' }, 403);
  }

  const mode = resolveMode(challenge);
  const type = resolveType(challenge);
  let pointLogColumn: 'point' | 'points' | null = null;
  let hasScoreColumn = false;

  try {
    const pointLogInfo = await env.D1_DB.prepare("PRAGMA table_info('point_logs')").all();
    const columns = Array.isArray(pointLogInfo?.results) ? pointLogInfo.results : [];
    if (columns.some((col: any) => col.name === 'point')) pointLogColumn = 'point';
    else if (columns.some((col: any) => col.name === 'points')) pointLogColumn = 'points';
  } catch (err) {
    console.warn('[rewards] point_logs check failed:', err);
  }

  try {
    const profileInfo = await env.D1_DB.prepare("PRAGMA table_info('user_profiles')").all();
    const columns = Array.isArray(profileInfo?.results) ? profileInfo.results : [];
    hasScoreColumn = columns.some((col: any) => col.name === 'score');
  } catch (err) {
    console.warn('[rewards] user_profiles check failed:', err);
    hasScoreColumn = false;
  }

  if (action === 'giveup') {
    // memberList 확인
    let memberList: any[] = [];
    try {
      const members = await env.D1_DB
        .prepare('SELECT u.user_id, u.username FROM challenge_members cm JOIN users u ON cm.user_id = u.user_id WHERE cm.challenge_id = ?')
        .bind(challengeId)
        .all();
      memberList = Array.isArray(members?.results) ? members.results : [];
    } catch (err) {
      console.warn('[rewards] giveup members query failed:', err);
    }

    // 1명만 참여하면 포인트 지급 안 함
    if (memberList.length <= 1) {
      return new Response(
        JSON.stringify({ success: true, applied: [], ranking: [], type, mode }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

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
    
    // 먼저 프로필이 없으면 생성
    await env.D1_DB
      .prepare('INSERT OR IGNORE INTO user_profiles (user_id) VALUES (?)')
      .bind(userId)
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

  let members;
  try {
    members = await env.D1_DB
      .prepare('SELECT u.user_id, u.username FROM challenge_members cm JOIN users u ON cm.user_id = u.user_id WHERE cm.challenge_id = ?')
      .bind(challengeId)
      .all();
  } catch (err: any) {
    console.warn('[rewards] members query failed:', err?.message || err);
    return jsonRes({ message: '챌린지 멤버 조회에 실패했습니다.', error: String(err?.message || err) }, 500);
  }

    const memberList = Array.isArray(members?.results) ? members.results : [];
    if (memberList.length === 0) {
      return new Response(
        JSON.stringify({ success: true, applied: [], ranking: [], type, mode }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 혼자 하는 챌린지는 보상 없음 (악용 방지)
    if (memberList.length <= 1) {
      return new Response(
        JSON.stringify({ success: true, applied: [], ranking: [], type, mode, message: '혼자 참여한 챌린지는 보상을 받을 수 없습니다.' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 전원 제출 전에는 결과/정산을 공개하지 않습니다.
    try {
      const memberStatusRows = await env.D1_DB
        .prepare(`
          SELECT u.username
          FROM challenge_members cm
          JOIN users u ON u.user_id = cm.user_id
          WHERE cm.challenge_id = ?
            AND COALESCE(cm.status, 'not_submitted') <> 'submitted'
        `)
        .bind(challengeId)
        .all();

      const pendingMembers = Array.isArray(memberStatusRows?.results) ? memberStatusRows.results : [];
      if (pendingMembers.length > 0) {
        return new Response(
          JSON.stringify({
            success: true,
            pendingSubmission: true,
            pendingCount: pendingMembers.length,
            pendingMembers: pendingMembers.map((m: any) => String(m.username || '')),
            applied: [],
            ranking: [],
            type,
            mode,
            message: '모든 참여자가 제출을 완료해야 결과를 확인할 수 있습니다.'
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      }
    } catch (submissionCheckErr) {
      // 구버전 스키마(상태 컬럼 없음)에서는 제출 게이트를 건너뜁니다.
      console.warn('[rewards] submission gate skipped:', submissionCheckErr);
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

    // 일반 모드: ratio로 정렬 (높을수록 1등) - study 모드는 아래 블록에서 별도 처리
    if (type !== 'study') {
      base.sort((a: any, b: any) => {
        if (b.ratio !== a.ratio) return b.ratio - a.ratio;
        return String(a.name).localeCompare(String(b.name));
      });
    }

    // 1명 참여 시 보상 없음 (점수, 포인트 모두 지급 안 함)
    let ranking: any[] = [];
    let hasTie = false;

    // Study 모드: 전원 점수 제출 완료 후 정렬
    if (type === 'study') {
      if (submitScore !== null && !Number.isNaN(Number(submitScore))) {
        try {
          await env.D1_DB
            .prepare(`
              INSERT INTO challenge_results (user_id, challenge_id, score)
              VALUES (?, ?, ?)
              ON CONFLICT(user_id, challenge_id) DO UPDATE SET score = excluded.score
            `)
            .bind(userId, challengeId, Number(submitScore))
            .run();
        } catch (scoreUpsertErr) {
          console.warn('[rewards] study score upsert failed:', scoreUpsertErr);
        }
      }

      const placeholders = memberList.map(() => '?').join(',');
      const scoreRowsRaw = placeholders
        ? await env.D1_DB
          .prepare(`
            SELECT user_id, score
            FROM challenge_results
            WHERE challenge_id = ?
              AND user_id IN (${placeholders})
          `)
          .bind(challengeId, ...memberList.map((m: any) => Number(m.user_id)))
          .all()
        : { results: [] };

      const scoreRows = Array.isArray(scoreRowsRaw?.results) ? scoreRowsRaw.results : [];
      const scoreMap = new Map<number, number>();
      scoreRows.forEach((row: any) => scoreMap.set(Number(row.user_id), Number(row.score) || 0));

      const pendingMembers = memberList.filter((m: any) => !scoreMap.has(Number(m.user_id)));
      if (pendingMembers.length > 0) {
        return new Response(
          JSON.stringify({
            success: true,
            pendingSubmission: true,
            pendingCount: pendingMembers.length,
            pendingMembers: pendingMembers.map((m: any) => String(m.username || '')),
            applied: [],
            ranking: [],
            type,
            mode,
            message: '전원이 점수를 제출해야 최종 결과가 공개됩니다.'
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      }

      ranking = base.map((item) => ({
        ...item,
        score: Number(scoreMap.get(item.userId) || 0)
      }));

      ranking.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return String(a.name).localeCompare(String(b.name));
      });

      ranking = ranking.map((item, idx) => {
        const reward = resolveRankReward(idx, ranking.length);
        return {
          rank: idx + 1,
          name: item.name,
          userId: item.userId,
          points: reward.points,
          score: reward.score,
          ratio: item.ratio,
          count: item.count,
          totalDays,
          submittedScore: item.score
        };
      });

      const topSubmittedScore = Number(ranking[0]?.submittedScore || 0);
      hasTie = topSubmittedScore > 0 && ranking.filter((r) => Number(r.submittedScore || 0) === topSubmittedScore).length >= 2;
    } else if (base.length > 1) {
      ranking = base.map((item, idx) => {
        const reward = mode === 'practice' ? { points: 0, score: 0 } : resolveRankReward(idx, base.length);

        return {
          rank: idx + 1,
          name: item.name,
          userId: item.userId,
          points: reward.points,
          score: reward.score,
          ratio: item.ratio,
          count: item.count,
          totalDays
        };
      });

      const topRatio = Number(ranking[0]?.ratio || 0);
      hasTie = topRatio > 0 && ranking.filter((r) => Number(r.ratio || 0) === topRatio).length >= 2;
    }

    let hasBet = false;
    if (ranking.length > 0) {
      if (pointLogColumn) {
        try {
          const betLogs = await env.D1_DB
            .prepare(`SELECT COUNT(*) AS cnt FROM point_logs WHERE reason LIKE ? AND ${pointLogColumn} < 0`)
            .bind(`challenge_bet:${challengeId}:%`)
            .first();
          hasBet = Number((betLogs as any)?.cnt || 0) > 0;
        } catch (err) {
          console.warn('[rewards] bet detect from logs failed:', err);
        }
      }

      if (!hasBet) {
        const perUserBet = Number((challenge as any)?.bet_points || 0);
        if (perUserBet > 0) {
          hasBet = true;
        }
      }

      if (!hasBet) {
        ranking = ranking.map((entry) => ({
          ...entry,
          score: 0
        }));
      }
    }

    if (mode === 'practice') {
      return new Response(
        JSON.stringify({ success: true, applied: [], ranking, type, mode }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const applied: Array<{ userId: number; points: number; score?: number }> = [];
    const errors: string[] = [];
    const now = new Date().toISOString();
    const reason = `challenge_reward:${challengeId}:${action}:${mode}`;

    // D1은 prepare().run() 방식으로 BEGIN/COMMIT을 지원하지 않으므로
    // 개별 쿼리로 처리합니다. already 체크로 중복 지급을 방지합니다.
    for (const entry of ranking) {
      if (!entry.userId) continue;

      try {
        // 중복 지급 방지
        const already = pointLogColumn
          ? await env.D1_DB
            .prepare('SELECT 1 FROM point_logs WHERE user_id = ? AND reason = ?')
            .bind(entry.userId, reason)
            .first()
          : null;

        if (already) {
          console.log(`[rewards] skip duplicate: userId=${entry.userId} reason=${reason}`);
          continue;
        }

        // 프로필 없으면 생성
        await env.D1_DB
          .prepare('INSERT OR IGNORE INTO user_profiles (user_id) VALUES (?)')
          .bind(entry.userId)
          .run();

        const profile = await env.D1_DB
          .prepare('SELECT points FROM user_profiles WHERE user_id = ?')
          .bind(entry.userId)
          .first();

        const currentPoints = Number((profile as any)?.points) || 0;
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
            console.warn('[rewards] point_log insert skipped:', pointLogErr?.message || String(pointLogErr));
          }
        }

        // score 컬럼이 user_profiles에 있으면 업데이트
        if (hasBet && hasScoreColumn && entry.score > 0) {
          try {
            await env.D1_DB
              .prepare('UPDATE user_profiles SET score = COALESCE(score, 0) + ? WHERE user_id = ?')
              .bind(entry.score, entry.userId)
              .run();
          } catch (scoreErr: any) {
            console.warn('[rewards] score update skipped:', scoreErr?.message || String(scoreErr));
          }
        }

        applied.push({ userId: entry.userId, points: entry.points, score: entry.score });
      } catch (entryErr: any) {
        const errMsg = entryErr?.message || String(entryErr);
        console.warn('[rewards] entry update failed:', entry.userId, errMsg);
        errors.push(errMsg);
      }
    }

    return new Response(
      JSON.stringify({ success: true, applied, ranking, type, mode, hasTie, errors }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    const message = err?.message || String(err);
    console.error('[rewards] fatal error:', message);
    return new Response(JSON.stringify({ message: '보상 처리 중 오류가 발생했습니다.', error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
