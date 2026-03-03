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

  const submitScore = body?.score !== undefined ? Number(body.score) : null;

  const action = body?.action === 'giveup' ? 'giveup' : 'complete';

  let hasBetPointsColumn = false;
  try {
    const challengeInfo = await env.D1_DB.prepare("PRAGMA table_info('challenges')").all();
    const columns = Array.isArray(challengeInfo?.results) ? challengeInfo.results : [];
    hasBetPointsColumn = columns.some((col: any) => col.name === 'bet_points');
  } catch (err) {
    console.warn('[rewards] challenges schema check failed:', err);
  }

  const challenge = await env.D1_DB
    .prepare(
      hasBetPointsColumn
        ? 'SELECT challenge_id, created_by_user_id, category, type, mode, created_at, start_date, end_date, duration, bet_points FROM challenges WHERE challenge_id = ?'
        : 'SELECT challenge_id, created_by_user_id, category, type, mode, created_at, start_date, end_date, duration FROM challenges WHERE challenge_id = ?'
    )
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

  if (Number(challenge.created_by_user_id) !== userId) {
    return new Response(JSON.stringify({ message: '방장만 완료 처리가 가능합니다.' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
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

    // 혼자 하는 챌린지는 보상 없음 (악용 방지)
    if (memberList.length <= 1) {
      return new Response(
        JSON.stringify({ success: true, applied: [], ranking: [], type, mode, message: '혼자 참여한 챌린지는 보상을 받을 수 없습니다.' }),
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

    // Study 모드: 입력한 점수로 정렬 (높을수록 1등)
    if (type === 'study' && submitScore !== null) {
      // 점수 기반 정렬 (placeholder, 실제 점수는 base에 추가해야 함)
      // 현재는 ratio로 정렬하지만, 점수 입력이 있다면 그 점수에 따라 순위 결정
    } else {
      // 일반 모드: ratio로 정렬 (높을수록 1등)
      base.sort((a, b) => {
        if (b.ratio !== a.ratio) return b.ratio - a.ratio;
        return String(a.name).localeCompare(String(b.name));
      });
    }

    // 1명 참여 시 보상 없음 (점수, 포인트 모두 지급 안 함)
    let ranking: any[] = [];
    
    // Study 모드: scores 수집 및 정렬
    if (type === 'study') {
      // scores는 body에서 받은 score 값들 (현재는 제출자 1명만)
      if (submitScore !== null) {
        // Study 모드에서는 모든 멤버의 점수를 받아야 함
        // 일단 현재 구조에서는 제출자의 점수만 있으므로, 다른 멤버는 기본값
        ranking = base.map((item, idx) => {
          // 최종 점수는 submitScore (1등), 나머지는 0
          const isSelf = item.userId === userId;
          const memberScore = isSelf ? submitScore : 0;
          
          // 재정렬이 필요하므로 점수로 정렬된 순서로 재배치
          return {
            ...item,
            score: memberScore
          };
        });
        
        // 점수로 내림차순 정렬 (높을수록 1등)
        ranking.sort((a, b) => b.score - a.score);
        
        // 정렬 후 rank와 points 계산
        ranking = ranking.map((item, idx) => {
          let points = 0;
          let score = item.score;
          
          if (idx === 0) {
            points = 150;
          } else if (ranking.length === 2) {
            points = -30;
          } else if (ranking.length === 3) {
            points = idx === 1 ? 100 : -30;
          } else {
            const restCount = ranking.length - 1;
            const topPercent = Math.ceil(restCount * 0.3) || 1;
            const bottomPercent = Math.ceil(restCount * 0.3) || 1;
            const middlePercent = restCount - topPercent - bottomPercent;
            const otherIndex = idx - 1;
            
            if (otherIndex < topPercent) {
              points = 100;
            } else if (otherIndex < topPercent + middlePercent) {
              points = 50;
            } else {
              points = -30;
            }
          }
          
          return {
            rank: idx + 1,
            name: item.name,
            userId: item.userId,
            points,
            score,
            ratio: item.ratio,
            count: item.count,
            totalDays
          };
        });
      }
    } else if (base.length > 1) {
      const otherCount = Math.max(base.length - 1, 0);
      ranking = base.map((item, idx) => {
        let points = 0;
        let score = 0;

        if (mode === 'practice') {
          // 연습 모드는 보상 없음
          points = 0;
          score = 0;
        } else if (idx === 0) {
          // 1등: 항상 +150점, +150포인트
          points = 150;
          score = 150;
        } else if (base.length === 2) {
          // 2명 참여: 2등 -30 포인트, 100점수 (고정)
          points = -30;
          score = 100;
        } else if (base.length === 3) {
          // 3명 참여: 2등 +100, 3등 -30 포인트 / 2등 100점, 3등 50점 (고정)
          points = idx === 1 ? 100 : -30;
          score = idx === 1 ? 100 : 50;
        } else {
          // 4명 이상: 1등 제외 인원을 상/중/하로 분배
          const restCount = otherCount; // 1등 제외
          const topPercent = Math.ceil(restCount * 0.3) || 1; // 최소 1명
          const bottomPercent = Math.ceil(restCount * 0.3) || 1; // 최소 1명
          const middlePercent = restCount - topPercent - bottomPercent;

          const otherIndex = idx - 1; // 1등을 제외한 순서 (0부터 시작)

          if (otherIndex < topPercent) {
            // 상위 30%: +100 포인트, 100점수
            points = 100;
            score = 100;
          } else if (otherIndex < topPercent + middlePercent) {
            // 중위 40%: +50 포인트, 50점수
            points = 50;
            score = 50;
          } else {
            // 하위 30%: -30 포인트, 0점수
            points = -30;
            score = 0;
          }
        }

        return {
          rank: idx + 1,
          name: item.name,
          userId: item.userId,
          points,
          score,
          ratio: item.ratio,
          count: item.count,
          totalDays
        };
      });
    }

    let betPool = 0;
    if (ranking.length > 0) {
      if (pointLogColumn) {
        try {
          const pool = await env.D1_DB
            .prepare(`SELECT SUM(CASE WHEN ${pointLogColumn} < 0 THEN -${pointLogColumn} ELSE 0 END) AS total FROM point_logs WHERE reason LIKE ?`)
            .bind(`challenge_bet:${challengeId}:%`)
            .first();
          betPool = Number((pool as any)?.total || 0);
        } catch (err) {
          console.warn('[rewards] bet pool from logs failed:', err);
        }
      }

      if (betPool <= 0 && hasBetPointsColumn) {
        const perUserBet = Number((challenge as any)?.bet_points || 0);
        if (perUserBet > 0) {
          betPool = perUserBet * memberList.length;
        }
      }

      if (betPool <= 0 && !hasBetPointsColumn) {
        try {
          await env.D1_DB.prepare(`CREATE TABLE IF NOT EXISTS challenge_bets (
            challenge_id INTEGER PRIMARY KEY,
            bet_points INTEGER NOT NULL
          )`).run();
          const betRow = await env.D1_DB
            .prepare('SELECT bet_points FROM challenge_bets WHERE challenge_id = ?')
            .bind(challengeId)
            .first();
          const perUserBet = Number((betRow as any)?.bet_points || 0);
          if (perUserBet > 0) {
            betPool = perUserBet * memberList.length;
          }
        } catch (err) {
          console.warn('[rewards] challenge_bets fallback failed:', err);
        }
      }

      if (betPool > 0) {
        ranking = ranking.map((entry, idx) => ({
          ...entry,
          points: idx === 0 ? betPool : 0
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
        if (hasScoreColumn && entry.score > 0) {
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
      JSON.stringify({ success: true, applied, ranking, type, mode, errors }),
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
