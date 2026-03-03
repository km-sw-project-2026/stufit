type HandlerContext = {
  env: any;
  userId: number;
  params: { id: string };
};

type PagesFunction<T = any> = (context: {
  request: Request;
  params: { id: string };
  env: T;
  userId?: number;
}) => Promise<Response>;

const json = (data: any, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

/** 끝말잇기: 단어 첫 글자가 이전 단어 마지막 글자와 동일한지 체크 */
function isValidChain(prevWord: string, nextWord: string): boolean {
  if (!prevWord || !nextWord) return true;
  const lastChar = prevWord[prevWord.length - 1];
  return nextWord[0] === lastChar;
}

/** 세션 테이블 초기화 */
async function ensureTables(db: any) {
  await db
    .prepare(
      `CREATE TABLE IF NOT EXISTS minigame_sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        challenge_id INTEGER NOT NULL,
        players TEXT NOT NULL,
        active_players TEXT NOT NULL,
        winner_username TEXT,
        status TEXT NOT NULL DEFAULT 'waiting',
        current_turn_index INTEGER NOT NULL DEFAULT 0,
        last_word TEXT NOT NULL DEFAULT '',
        turn_started_at TEXT,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      )`
    )
    .run();

  await db
    .prepare(
      `CREATE TABLE IF NOT EXISTS minigame_words (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id INTEGER NOT NULL,
        username TEXT NOT NULL,
        word TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      )`
    )
    .run();
}

/** GET /api/challenges/:id/minigame - 현재 세션 조회 */
export const onRequestGet: PagesFunction = async ({ request, params, env, userId }) => {
  if (!env?.D1_DB) return json({ message: '서버 설정 오류' }, 500);
  const challengeId = Number(params?.id);
  if (!challengeId) return json({ message: '유효하지 않은 챌린지' }, 400);

  try {
    await ensureTables(env.D1_DB);

    const session = await env.D1_DB
      .prepare(
        `SELECT * FROM minigame_sessions WHERE challenge_id = ? ORDER BY id DESC LIMIT 1`
      )
      .bind(challengeId)
      .first();

    if (!session) return json({ session: null });

    const words = await env.D1_DB
      .prepare(`SELECT username, word, created_at FROM minigame_words WHERE session_id = ? ORDER BY id ASC`)
      .bind((session as any).id)
      .all();

    return json({
      session: {
        ...(session as any),
        players: JSON.parse((session as any).players || '[]'),
        active_players: JSON.parse((session as any).active_players || '[]'),
      },
      words: Array.isArray(words?.results) ? words.results : [],
    });
  } catch (err: any) {
    return json({ message: '세션 조회 실패', error: err?.message }, 500);
  }
};

/** POST /api/challenges/:id/minigame - 새 세션 생성 (방장만 가능) */
export const onRequestPost: PagesFunction = async ({ request, params, env, userId }) => {
  if (!env?.D1_DB) return json({ message: '서버 설정 오류' }, 500);
  if (!userId) return json({ message: '로그인이 필요합니다.' }, 401);

  const challengeId = Number(params?.id);
  if (!challengeId) return json({ message: '유효하지 않은 챌린지' }, 400);

  try {
    await ensureTables(env.D1_DB);

    // 방장인지 확인
    const challenge = await env.D1_DB
      .prepare('SELECT created_by_user_id FROM challenges WHERE challenge_id = ?')
      .bind(challengeId)
      .first();

    if (!challenge || Number((challenge as any).created_by_user_id) !== userId) {
      return json({ message: '방장만 미니게임을 시작할 수 있습니다.' }, 403);
    }

    // Body에서 players 목록 읽기
    let body: any = {};
    try { body = await request.json(); } catch {}

    const players: string[] = Array.isArray(body?.players) ? body.players : [];
    if (players.length < 2) {
      return json({ message: '동점자가 2명 이상이어야 합니다.' }, 400);
    }

    // 기존 active 세션 종료
    await env.D1_DB
      .prepare(`UPDATE minigame_sessions SET status = 'cancelled' WHERE challenge_id = ? AND status IN ('waiting','active')`)
      .bind(challengeId)
      .run();

    const now = new Date().toISOString();
    const playersJson = JSON.stringify(players);

    const result = await env.D1_DB
      .prepare(
        `INSERT INTO minigame_sessions (challenge_id, players, active_players, status, current_turn_index, last_word, turn_started_at, created_at)
         VALUES (?, ?, ?, 'waiting', 0, '', ?, ?)`
      )
      .bind(challengeId, playersJson, playersJson, now, now)
      .run();

    const sessionId = (result as any)?.meta?.last_row_id || (result as any)?.lastRowId;

    return json({ success: true, sessionId, players });
  } catch (err: any) {
    return json({ message: '세션 생성 실패', error: err?.message }, 500);
  }
};

/** PATCH /api/challenges/:id/minigame - 단어 제출 / 게임 시작 / 탈락 처리 */
export const onRequestPatch: PagesFunction = async ({ request, params, env, userId }) => {
  if (!env?.D1_DB) return json({ message: '서버 설정 오류' }, 500);
  if (!userId) return json({ message: '로그인이 필요합니다.' }, 401);

  const challengeId = Number(params?.id);
  if (!challengeId) return json({ message: '유효하지 않은 챌린지' }, 400);

  let body: any = {};
  try { body = await request.json(); } catch {}

  const action = body?.action; // 'start' | 'word' | 'eliminate'

  try {
    await ensureTables(env.D1_DB);

    const session = await env.D1_DB
      .prepare(`SELECT * FROM minigame_sessions WHERE challenge_id = ? ORDER BY id DESC LIMIT 1`)
      .bind(challengeId)
      .first();

    if (!session) return json({ message: '진행 중인 세션이 없습니다.' }, 404);

    const sessionId = (session as any).id;
    const activePlayers: string[] = JSON.parse((session as any).active_players || '[]');
    const currentTurnIndex = Number((session as any).current_turn_index || 0);
    const lastWord = String((session as any).last_word || '');
    const status = (session as any).status;

    // --- 게임 시작 ---
    if (action === 'start') {
      if (status !== 'waiting') return json({ message: '이미 시작된 게임입니다.' }, 400);

      // 방장인지 확인
      const challenge = await env.D1_DB
        .prepare('SELECT created_by_user_id FROM challenges WHERE challenge_id = ?')
        .bind(challengeId)
        .first();
      if (!challenge || Number((challenge as any).created_by_user_id) !== userId) {
        return json({ message: '방장만 게임을 시작할 수 있습니다.' }, 403);
      }

      const now = new Date().toISOString();
      await env.D1_DB
        .prepare(`UPDATE minigame_sessions SET status = 'active', turn_started_at = ? WHERE id = ?`)
        .bind(now, sessionId)
        .run();

      return json({ success: true, currentTurn: activePlayers[0], activePlayers });
    }

    // --- 단어 제출 ---
    if (action === 'word') {
      if (status !== 'active') return json({ message: '게임이 진행 중이 아닙니다.' }, 400);

      const word: string = String(body?.word || '').trim();
      if (!word) return json({ message: '단어를 입력해 주세요.' }, 400);
      if (word.length < 2) return json({ message: '2글자 이상 단어를 입력해 주세요.' }, 400);

      // 현재 턴 사용자 확인
      const currentPlayer = activePlayers[currentTurnIndex % activePlayers.length];
      const username = await env.D1_DB
        .prepare('SELECT username FROM users WHERE user_id = ?')
        .bind(userId)
        .first();
      const currentUsername = (username as any)?.username || '';

      if (currentPlayer !== currentUsername) {
        return json({ message: '현재 당신의 차례가 아닙니다.' }, 403);
      }

      // 끝말잇기 유효성 체크
      if (lastWord && !isValidChain(lastWord, word)) {
        return json({ message: `"${lastWord}"의 마지막 글자(${lastWord[lastWord.length - 1]})로 시작해야 합니다.`, valid: false }, 400);
      }

      // 이미 사용된 단어 체크
      const usedWord = await env.D1_DB
        .prepare(`SELECT 1 FROM minigame_words WHERE session_id = ? AND word = ?`)
        .bind(sessionId, word)
        .first();
      if (usedWord) {
        return json({ message: '이미 사용된 단어입니다.', valid: false }, 400);
      }

      // 단어 저장
      const now = new Date().toISOString();
      await env.D1_DB
        .prepare(`INSERT INTO minigame_words (session_id, username, word, created_at) VALUES (?, ?, ?, ?)`)
        .bind(sessionId, currentUsername, word, now)
        .run();

      const nextTurnIndex = (currentTurnIndex + 1) % activePlayers.length;
      const nextPlayer = activePlayers[nextTurnIndex];

      await env.D1_DB
        .prepare(`UPDATE minigame_sessions SET current_turn_index = ?, last_word = ?, turn_started_at = ? WHERE id = ?`)
        .bind(nextTurnIndex, word, now, sessionId)
        .run();

      return json({
        success: true,
        word,
        nextTurn: nextPlayer,
        activePlayers,
        currentTurnIndex: nextTurnIndex,
      });
    }

    // --- 시간 초과 탈락 처리 ---
    if (action === 'eliminate') {
      if (status !== 'active') return json({ message: '게임이 진행 중이 아닙니다.' }, 400);

      const eliminateUsername: string = String(body?.username || '').trim();
      if (!eliminateUsername) return json({ message: 'username 필요' }, 400);

      const newActivePlayers = activePlayers.filter((p) => p !== eliminateUsername);
      const now = new Date().toISOString();

      // 1명 남으면 승자 결정
      if (newActivePlayers.length <= 1) {
        const winner = newActivePlayers[0] || null;
        await env.D1_DB
          .prepare(`UPDATE minigame_sessions SET status = 'finished', active_players = ?, winner_username = ?, turn_started_at = ? WHERE id = ?`)
          .bind(JSON.stringify(newActivePlayers), winner, now, sessionId)
          .run();

        return json({ success: true, finished: true, winner, activePlayers: newActivePlayers });
      }

      // 다음 턴 계산
      const nextTurnIndex = currentTurnIndex % newActivePlayers.length;

      await env.D1_DB
        .prepare(`UPDATE minigame_sessions SET active_players = ?, current_turn_index = ?, turn_started_at = ? WHERE id = ?`)
        .bind(JSON.stringify(newActivePlayers), nextTurnIndex, now, sessionId)
        .run();

      return json({
        success: true,
        eliminated: eliminateUsername,
        activePlayers: newActivePlayers,
        nextTurn: newActivePlayers[nextTurnIndex],
        finished: false,
      });
    }

    return json({ message: '알 수 없는 action입니다.' }, 400);
  } catch (err: any) {
    return json({ message: '처리 중 오류', error: err?.message }, 500);
  }
};
