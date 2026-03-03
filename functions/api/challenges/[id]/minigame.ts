/** ============================================================
 * AI 끝말잇기 미니게임 - 각 동점자가 AI 와 1:1 대결
 * 더 오래 버티고 높은 점수를 낸 사람이 챌린지 최종 승자
 * ============================================================ */

// ─── 한국어 단어 목록 ─────────────────────────────────────────
const WORD_LIST: string[] = [
  '가구','가방','가수','가요','가을','가족','가지','가위','가게','각도','감기','감사','감자',
  '강물','강아지','강의','개미','개나리','거울','거리','건물','건강','게임','겨울','결과',
  '결혼','경기','경찰','고양이','고구마','고래','고추','공부','공원','공기','공주','과일',
  '과자','교실','교사','교통','구름','구두','국어','국물','귤','기차','기억','기분','기회',
  '김치','까치','꿀벌','귀신','관심','교복','구경','금메달','기타','기린','기적','기둥',
  '그림','글씨','글자','급식','나라','나무','날씨','남자','내일','노래','눈물','눈사람',
  '나비','낙타','냉장고','너구리','낙엽','노을','노력','논문','넥타이','농구','농부','놀이터',
  '다리','달빛','대학','도서관','돼지','동생','두부','다람쥐','달팽이','담배','대나무',
  '독수리','도마뱀','도전','도움','도로','도시','달력','단풍','단어','대화','도끼','동화',
  '동물','두꺼비','드라마','디저트','라디오','라면','러시아','로봇','리본','리듬','라켓',
  '마음','마을','막내','맥주','머리','모기','목소리','무지개','문화','물고기','미소',
  '마트','만두','망고','매미','모래','모자','목욕','미래','민들레','만족','마스크','만화',
  '메아리','멜론','명함','모험','목표','무릎','미역','바다','바람','박수','발걸음','방법',
  '배꼽','버스','병원','보람','부모','분위기','바나나','반지','배추','백조','병아리',
  '복숭아','부채','분필','봄날','비행기','빨래','빵집','보석','보물','부엌','분수','비밀',
  '발레','사과','사람','사랑','사진','산책','서울','선물','소나기','소풍','수박','수영',
  '숙제','시간','신발','사탕','상어','새벽','생선','선풍기','소금','소시지','수건',
  '스키','시험','신호','심장','사막','산호','샌드위치','서랍','설탕','성격','세탁기',
  '소설','수첩','순간','숲속','시골','시내','식물','실수','아기','아침','안경','얼굴',
  '여름','여행','역사','연필','영화','오후','우산','유치원','음악','의자','이름','이사',
  '아파트','악기','안개','알람','앵무새','야채','약국','어린이','어머니','얼음','에어컨',
  '여우','연꽃','연기','연락','열매','염소','오리','오징어','옥수수','올빼미','용기',
  '우체국','우표','원숭이','은행','음료','의사','이불','이슬','인형','잎사귀',
  '아이스크림','야구','양말','양파','어항','여권','운동','운동화','원피스','유리','유행',
  '은하수','이야기','자동차','자전거','저녁','전화','점심','정원','주방','지구','지하철',
  '진심','자두','장갑','장난감','재미','재채기','전기','조개','주스','지식','지팡이',
  '직업','진달래','질문','자연','잔디','잠자리','저울','전등','전설','정보','정류장',
  '조각','조심','종이','주변','주황','지갑','지도','지방','지평선','진통','짜장면',
  '차례','창문','책상','친구','채소','천사','철새','청소','초콜릿','추억','치마','치즈',
  '침대','참외','창고','책방','청춘','취미','컴퓨터','키보드','카메라','코끼리','크레파스',
  '키위','카드','카페','캐릭터','커피','코알라','크림','클래식','토마토','통화','타자기',
  '태양','택시','터널','토끼','태풍','토론','통장','파도','편지','포도','파란색','파리',
  '팔찌','펭귄','풀꽃','피아노','피자','파전','판타지','팬더','포인트','표시','풍선',
  '핀','핑크','하늘','학교','행복','형제','호수','화분','하마','한국','한글','할머니',
  '해바라기','향기','호랑이','호박','홍차','화살','황소','후추','흰색','학생','한복',
  '해답','해물','햄버거','허리','현관','호기심','화가','화면','환경','활동','회사',
  '회의','흥미',
];

/** 첫 글자 인덱스 */
const WORD_INDEX = new Map<string, string[]>();
for (const w of WORD_LIST) {
  const ch = w[0];
  if (!WORD_INDEX.has(ch)) WORD_INDEX.set(ch, []);
  WORD_INDEX.get(ch)!.push(w);
}

/** AI 응답 단어 선택 */
function pickAIWord(startChar: string, usedWords: Set<string>): string | null {
  const pool = (WORD_INDEX.get(startChar) || []).filter(w => !usedWords.has(w));
  if (pool.length === 0) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}

/** 끝말잇기 연결 검사 */
function chainOk(prev: string, next: string): boolean {
  if (!prev) return true;
  return next[0] === prev[prev.length - 1];
}

/** 사전 검사 */
function inDict(word: string): boolean {
  return WORD_LIST.includes(word);
}

/** 점수 계산 */
function calcScore(word: string, elapsedSec: number): number {
  let pts = 10;
  if (elapsedSec <= 5) pts += 7;
  else if (elapsedSec <= 10) pts += 3;
  if (word.length > 3) pts += (word.length - 3) * 3;
  return pts;
}

const json = (data: any, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

type PagesFunction = (ctx: {
  request: Request;
  params: { id: string };
  env: any;
  userId?: number;
}) => Promise<Response>;

/** 테이블 초기화 */
async function ensureTables(db: any) {
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

// ─── GET: 동점 메타 + 내 게임 세션 조회 ──────────────────────
export const onRequestGet: PagesFunction = async ({ request, params, env }) => {
  if (!env?.D1_DB) return json({ message: '서버 설정 오류' }, 500);
  const challengeId = Number(params?.id);
  if (!challengeId) return json({ message: '유효하지 않은 챌린지' }, 400);

  const rawUn = request.headers.get('X-Username');
  const username = rawUn ? decodeURIComponent(rawUn) : null;

  try {
    await ensureTables(env.D1_DB);

    const meta = await env.D1_DB
      .prepare('SELECT tied_players FROM minigame_meta WHERE challenge_id = ?')
      .bind(challengeId).first();
    const tiedPlayers: string[] = meta ? JSON.parse((meta as any).tied_players || '[]') : [];

    let session = null;
    if (username) {
      const row = await env.D1_DB
        .prepare('SELECT * FROM minigame_ai_sessions WHERE challenge_id = ? AND player_username = ?')
        .bind(challengeId, username).first();
      if (row) session = { ...(row as any), history: JSON.parse((row as any).history || '[]') };
    }

    const allResults = await env.D1_DB
      .prepare(`SELECT player_username, score, words_count, result, finished_at
                FROM minigame_ai_sessions
                WHERE challenge_id = ? AND status = 'finished'
                ORDER BY score DESC`)
      .bind(challengeId).all();

    return json({
      tiedPlayers,
      session,
      allResults: Array.isArray(allResults?.results) ? allResults.results : [],
    });
  } catch (err: any) {
    return json({ message: '조회 실패', error: err?.message }, 500);
  }
};

// ─── POST: 동점 메타 저장(init/방장) 또는 개인 AI 게임 시작 ──
export const onRequestPost: PagesFunction = async ({ request, params, env, userId }) => {
  if (!env?.D1_DB) return json({ message: '서버 설정 오류' }, 500);
  const challengeId = Number(params?.id);
  if (!challengeId) return json({ message: '유효하지 않은 챌린지' }, 400);

  const rawUn = request.headers.get('X-Username');
  const username = rawUn ? decodeURIComponent(rawUn) : null;

  let body: any = {};
  try { body = await request.json(); } catch {}

  await ensureTables(env.D1_DB);

  // ── action: init → 동점자 메타 저장 (방장만) ─────────────
  if (body?.action === 'init') {
    if (!userId) return json({ message: '로그인이 필요합니다.' }, 401);
    const challenge = await env.D1_DB
      .prepare('SELECT created_by_user_id FROM challenges WHERE challenge_id = ?')
      .bind(challengeId).first();
    if (!challenge || Number((challenge as any).created_by_user_id) !== userId) {
      return json({ message: '방장만 미니게임을 초기화할 수 있습니다.' }, 403);
    }
    const players: string[] = Array.isArray(body?.players) ? body.players : [];
    if (players.length < 2) return json({ message: '동점자 2명 이상 필요' }, 400);
    await env.D1_DB
      .prepare(`INSERT INTO minigame_meta (challenge_id, tied_players)
                VALUES (?, ?)
                ON CONFLICT(challenge_id) DO UPDATE SET tied_players = excluded.tied_players`)
      .bind(challengeId, JSON.stringify(players)).run();
    return json({ success: true, players });
  }

  // ── action: start_game → 개인 AI 게임 세션 시작 ──────────
  if (body?.action === 'start_game') {
    if (!username) return json({ message: '로그인이 필요합니다.' }, 401);
    const existing = await env.D1_DB
      .prepare('SELECT * FROM minigame_ai_sessions WHERE challenge_id = ? AND player_username = ?')
      .bind(challengeId, username).first();
    if (existing) {
      return json({ success: true, session: { ...(existing as any), history: JSON.parse((existing as any).history || '[]') } });
    }
    const now = new Date().toISOString();
    await env.D1_DB
      .prepare(`INSERT INTO minigame_ai_sessions
                  (challenge_id, player_username, score, words_count, status, last_word, history, turn_started_at, created_at)
                VALUES (?, ?, 0, 0, 'active', '', '[]', ?, ?)`)
      .bind(challengeId, username, now, now).run();
    const session = await env.D1_DB
      .prepare('SELECT * FROM minigame_ai_sessions WHERE challenge_id = ? AND player_username = ?')
      .bind(challengeId, username).first();
    return json({ success: true, session: { ...(session as any), history: [] } });
  }

  return json({ message: '알 수 없는 action' }, 400);
};

// ─── PATCH: 단어 제출 처리 ────────────────────────────────────
export const onRequestPatch: PagesFunction = async ({ request, params, env }) => {
  if (!env?.D1_DB) return json({ message: '서버 설정 오류' }, 500);
  const challengeId = Number(params?.id);
  if (!challengeId) return json({ message: '유효하지 않은 챌린지' }, 400);

  const rawUn = request.headers.get('X-Username');
  const username = rawUn ? decodeURIComponent(rawUn) : null;
  if (!username) return json({ message: '로그인이 필요합니다.' }, 401);

  let body: any = {};
  try { body = await request.json(); } catch {}

  await ensureTables(env.D1_DB);

  const session = await env.D1_DB
    .prepare('SELECT * FROM minigame_ai_sessions WHERE challenge_id = ? AND player_username = ?')
    .bind(challengeId, username).first();
  if (!session) return json({ message: '게임 세션이 없습니다. 먼저 게임을 시작해 주세요.' }, 404);
  if ((session as any).status !== 'active') return json({ message: '이미 종료된 게임입니다.' }, 400);

  const lastWord: string = (session as any).last_word || '';
  const history: Array<{speaker: string; word: string}> = JSON.parse((session as any).history || '[]');
  const usedWords = new Set(history.map((h: any) => h.word));
  const turnStartedAt: string = (session as any).turn_started_at || new Date().toISOString();
  const elapsedSec = Math.floor((Date.now() - new Date(turnStartedAt).getTime()) / 1000);

  // ── action: timeout ────────────────────────────────────────
  if (body?.action === 'timeout') {
    const now = new Date().toISOString();
    await env.D1_DB
      .prepare(`UPDATE minigame_ai_sessions SET status='finished', result='timeout', finished_at=? WHERE challenge_id=? AND player_username=?`)
      .bind(now, challengeId, username).run();
    return json({ success: true, gameOver: true, result: 'timeout', score: (session as any).score });
  }

  // ── action: word ────────────────────────────────────────────
  if (body?.action !== 'word') return json({ message: '알 수 없는 action' }, 400);

  const word: string = String(body?.word || '').trim();
  if (!word) return json({ message: '단어를 입력해 주세요.' }, 400);
  if (word.length < 2) return json({ message: '2글자 이상 입력해 주세요.' }, 400);

  // 1. 끝말잇기 연결 검사
  if (lastWord && !chainOk(lastWord, word)) {
    return json({
      message: `"${lastWord[lastWord.length - 1]}"(으)로 시작하는 단어를 입력해 주세요.`,
      valid: false,
    }, 400);
  }

  // 2. 사전 검사
  if (!inDict(word)) {
    return json({ message: `"${word}"은(는) 등록되지 않은 단어입니다.`, valid: false }, 400);
  }

  // 3. 중복 검사
  if (usedWords.has(word)) {
    return json({ message: `"${word}"은(는) 이미 사용된 단어입니다.`, valid: false }, 400);
  }

  // 4. 점수 계산
  const earned = calcScore(word, elapsedSec);
  const newScore: number = Number((session as any).score) + earned;
  const newCount: number = Number((session as any).words_count) + 1;

  usedWords.add(word);
  history.push({ speaker: 'player', word });

  // 5. AI 응답 (응답 불가 = 한방단어 → 플레이어 WIN +50)
  const startChar = word[word.length - 1];
  const aiWord = pickAIWord(startChar, usedWords);
  const now = new Date().toISOString();

  if (!aiWord) {
    const winScore = newScore + 50;
    await env.D1_DB
      .prepare(`UPDATE minigame_ai_sessions
                SET score=?, words_count=?, history=?, last_word=?, status='finished', result='win', finished_at=?
                WHERE challenge_id=? AND player_username=?`)
      .bind(winScore, newCount, JSON.stringify(history), word, now, challengeId, username).run();
    return json({ success: true, valid: true, playerWord: word, earned,
      aiWord: null, gameOver: true, result: 'win', reason: 'hanBang', score: winScore, wordsCount: newCount });
  }

  // AI 히스토리 추가
  usedWords.add(aiWord);
  history.push({ speaker: 'ai', word: aiWord });

  // 6. 다음 턴 가능 여부 확인
  const nextStartChar = aiWord[aiWord.length - 1];
  const canContinue = (WORD_INDEX.get(nextStartChar) || []).some(w => !usedWords.has(w));

  await env.D1_DB
    .prepare(`UPDATE minigame_ai_sessions
              SET score=?, words_count=?, history=?, last_word=?, turn_started_at=?
              WHERE challenge_id=? AND player_username=?`)
    .bind(newScore, newCount, JSON.stringify(history), aiWord, now, challengeId, username).run();

  return json({
    success: true, valid: true, playerWord: word, earned, aiWord,
    aiWordChar: aiWord[aiWord.length - 1], canContinue, gameOver: false,
    score: newScore, wordsCount: newCount, history,
  });
};
