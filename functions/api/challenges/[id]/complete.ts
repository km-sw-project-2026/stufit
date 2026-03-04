declare interface D1Database {
  prepare(query: string): any;
}

interface Env {
  D1_DB: D1Database;
}

type PagesFunction<T = any> = (context: { params: { id: string }, env: T }) => Promise<Response>;

async function ensureMiniGameTables(db: any) {
  await db.prepare(`
    CREATE TABLE IF NOT EXISTS minigame_meta (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      challenge_id INTEGER NOT NULL UNIQUE,
      tied_players TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `).run();

  await db.prepare(`
    CREATE TABLE IF NOT EXISTS minigame_ai_sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      challenge_id INTEGER NOT NULL,
      player_username TEXT NOT NULL,
      score INTEGER NOT NULL DEFAULT 0,
      words_count INTEGER NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'active',
      last_word TEXT NOT NULL DEFAULT '',
      history TEXT NOT NULL DEFAULT '[]',
      result TEXT,
      turn_started_at TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      finished_at TEXT,
      UNIQUE(challenge_id, player_username)
    )
  `).run();
}

async function getMiniGameState(db: any, challengeId: number) {
  await ensureMiniGameTables(db);

  const meta = await db
    .prepare('SELECT tied_players FROM minigame_meta WHERE challenge_id = ?')
    .bind(challengeId)
    .first();

  const tiedPlayers = meta ? JSON.parse((meta as any).tied_players || '[]') : [];
  const players = Array.isArray(tiedPlayers) ? tiedPlayers.filter((p: any) => typeof p === 'string' && p.trim()) : [];

  if (players.length < 2) {
    return { hasTie: false, allDone: true, remainingPlayers: [] as string[] };
  }

  const placeholders = players.map(() => '?').join(',');
  const rows = await db
    .prepare(`SELECT player_username, status FROM minigame_ai_sessions WHERE challenge_id = ? AND player_username IN (${placeholders})`)
    .bind(challengeId, ...players)
    .all();

  const finished = new Set(
    (Array.isArray(rows?.results) ? rows.results : [])
      .filter((r: any) => String(r?.status) === 'finished')
      .map((r: any) => String(r?.player_username))
  );

  const remainingPlayers = players.filter((name: string) => !finished.has(name));
  return {
    hasTie: true,
    allDone: remainingPlayers.length === 0,
    remainingPlayers,
  };
}

export const onRequestPatch: PagesFunction<Env> = async ({ params, env }) => {
  const challengeId = Number(params.id);
  
  // 유효성 검사
  if (!challengeId || Number.isNaN(challengeId)) {
    return Response.json({ success: false, message: "Invalid challenge ID" }, { status: 400 });
  }
  
  try {
    const miniGameState = await getMiniGameState(env.D1_DB, challengeId);

    if (miniGameState.hasTie && !miniGameState.allDone) {
      return Response.json({
        success: true,
        pendingMinigame: true,
        remainingPlayers: miniGameState.remainingPlayers,
        message: '공동 1등 미니게임이 진행 중입니다. 전원 완료 후 최종 종료됩니다.'
      });
    }

    await env.D1_DB.prepare("UPDATE challenges SET deleted_at = CURRENT_TIMESTAMP WHERE challenge_id = ?")
      .bind(challengeId)
      .run();

    return Response.json({ success: true, message: "챌린지가 종료 처리되었습니다." });
  } catch (e) {
    console.error('Complete error:', e);
    return new Response("챌린지 종료 처리 실패", { status: 500 });
  }
};