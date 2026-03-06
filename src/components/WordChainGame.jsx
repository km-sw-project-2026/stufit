import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

/** AI 1:1 끝말잇기 미니게임 */
const START_TURN_SECONDS = 15;
const MIN_TURN_SECONDS = 2;

const getTurnSecondsByWordCount = (count = 0) => {
  const safeCount = Number(count) || 0;
  return Math.max(MIN_TURN_SECONDS, START_TURN_SECONDS - safeCount);
};

// ──────────────────────────────────────────────────────
// 스타일 상수
// ──────────────────────────────────────────────────────
const BG = { background: 'linear-gradient(160deg, #7ec8a0 0%, #a6d8b8 60%, #c2e8cf 100%)' };

const cardStyle = {
  background: 'rgba(255,255,255,0.92)',
  borderRadius: '22px',
  padding: '32px 36px',
  maxWidth: '540px',
  width: '94%',
  boxShadow: '0 8px 32px rgba(0,0,0,0.13)',
  textAlign: 'center',
};

const tealBtn = {
  background: 'linear-gradient(135deg,#1d8c66,#247b7b)',
  border: 'none',
  color: '#fff',
  fontSize: '1rem',
  fontWeight: 700,
  borderRadius: '10px',
  padding: '12px 28px',
  cursor: 'pointer',
};

// ──────────────────────────────────────────────────────

export default function WordChainGame() {
  const { id: challengeId } = useParams();
  const navigate = useNavigate();
  const username = localStorage.getItem('username') || '';

  // ── 상태 ───────────────────────────────────────────
  const [phase, setPhase] = useState('loading');
  // 'loading' | 'lobby' | 'playing' | 'finished'

  const [tiedPlayers, setTiedPlayers] = useState([]);
  const [allResults, setAllResults] = useState([]);
  const [session, setSession] = useState(null);
  const [history, setHistory] = useState([]); // [{speaker:'player'|'ai', word}]
  const [lastWord, setLastWord] = useState('');
  const [score, setScore] = useState(0);
  const [wordsCount, setWordsCount] = useState(0);
  const [result, setResult] = useState(null); // 'win'|'lose'|'timeout'|null

  const [inputWord, setInputWord] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [timeLeft, setTimeLeft] = useState(START_TURN_SECONDS);
  const [turnSeconds, setTurnSeconds] = useState(START_TURN_SECONDS);
  const [submitting, setSubmitting] = useState(false);
  const [aiThinking, setAiThinking] = useState(false);

  const timerRef = useRef(null);
  const turnStartRef = useRef(null);
  const historyEndRef = useRef(null);
  const inputRef = useRef(null);

  // 히스토리 자동 스크롤
  useEffect(() => {
    historyEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  // ── 메타 로드 ──────────────────────────────────────
  const loadMeta = useCallback(async () => {
    try {
      const res = await fetch(`/api/challenges/${challengeId}/minigame`, {
        headers: { 'X-Username': encodeURIComponent(username) },
      });
      if (!res.ok) { setPhase('lobby'); return; }
      const data = await res.json();
      const tied = Array.isArray(data.tiedPlayers) ? data.tiedPlayers : [];
      setTiedPlayers(tied);
      setAllResults(Array.isArray(data.allResults) ? data.allResults : []);

      if (data.session) {
        const s = data.session;
        setSession(s);
        setHistory(Array.isArray(s.history) ? s.history : []);
        setLastWord(s.last_word || '');
        setScore(s.score || 0);
        setWordsCount(s.words_count || 0);
        if (s.status === 'finished') {
          setResult(s.result);
          setPhase('finished');
        } else {
          setPhase('playing');
          startTimer(s.words_count || 0);
        }
      } else {
        setPhase('lobby');
      }
    } catch {
      setPhase('lobby');
    }
  }, [challengeId, username]);

  useEffect(() => { loadMeta(); }, [loadMeta]);

  // ── 타이머 ─────────────────────────────────────────
  const stopTimer = () => clearInterval(timerRef.current);

  const startTimer = (wordsCountForTurn = wordsCount, remainingOverride = null) => {
    stopTimer();
    const limit = getTurnSecondsByWordCount(wordsCountForTurn);
    const startingLeft = typeof remainingOverride === 'number'
      ? Math.max(0, Math.min(limit, Math.floor(remainingOverride)))
      : limit;
    setTurnSeconds(limit);
    setTimeLeft(startingLeft);
    turnStartRef.current = Date.now();
    const tick = () => {
      const elapsed = Math.floor((Date.now() - turnStartRef.current) / 1000);
      const left = Math.max(0, startingLeft - elapsed);
      setTimeLeft(left);
      if (left <= 0) { stopTimer(); handleTimeout(); }
    };
    tick();
    timerRef.current = setInterval(tick, 300);
  };

  useEffect(() => () => stopTimer(), []);

  // ── 타임아웃 ────────────────────────────────────────
  const handleTimeout = async () => {
    stopTimer();
    try {
      const res = await fetch(`/api/challenges/${challengeId}/minigame`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'X-Username': encodeURIComponent(username) },
        body: JSON.stringify({ action: 'timeout' }),
      });
      await res.json();
    } catch {}
    // 완료 화면으로 전환 (allResults 재조회)
    await refreshResults('timeout');
  };

  // ── allResults 갱신 후 finished 화면 전환 ──────────
  const refreshResults = async (forceResult = null) => {
    try {
      const res = await fetch(`/api/challenges/${challengeId}/minigame`, {
        headers: { 'X-Username': encodeURIComponent(username) },
      });
      if (res.ok) {
        const data = await res.json();
        setAllResults(Array.isArray(data.allResults) ? data.allResults : []);
        if (data.session) {
          setScore(data.session.score || 0);
          setWordsCount(data.session.words_count || 0);
          if (forceResult) setResult(forceResult);
          else setResult(data.session.result || forceResult);
        } else if (forceResult) {
          setResult(forceResult);
        }
      }
    } catch {}
    setPhase('finished');
  };

  // ── 게임 시작 ──────────────────────────────────────
  const handleStartGame = async () => {
    setPhase('loading');
    try {
      const res = await fetch(`/api/challenges/${challengeId}/minigame`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Username': encodeURIComponent(username) },
        body: JSON.stringify({ action: 'start_game' }),
      });
      const data = await res.json();
      if (!res.ok) { alert(data?.message || '시작 실패'); setPhase('lobby'); return; }
      const s = data.session;
      setSession(s);
      setHistory([]);
      setLastWord('');
      setScore(0);
      setWordsCount(0);
      setResult(null);
      setInputWord('');
      setErrorMsg('');
      setPhase('playing');
      startTimer(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    } catch { alert('네트워크 오류'); setPhase('lobby'); }
  };

  // ── 단어 제출 ──────────────────────────────────────
  const handleSubmit = async (e) => {
    e?.preventDefault();
    const word = inputWord.trim();
    if (submitting || !word) return;
    const remainingAtSubmit = timeLeft;
    const submittedAt = Date.now();
    setSubmitting(true);
    setErrorMsg('');
    stopTimer();

    const getResumeLeft = () => {
      const networkElapsed = Math.floor((Date.now() - submittedAt) / 1000);
      return Math.max(0, remainingAtSubmit - networkElapsed);
    };

    try {
      setAiThinking(true);
      const res = await fetch(`/api/challenges/${challengeId}/minigame`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'X-Username': encodeURIComponent(username) },
        body: JSON.stringify({ action: 'word', word }),
      });
      const data = await res.json();
      setAiThinking(false);

      if (!res.ok) {
        setErrorMsg(data?.message || '잘못된 단어입니다.');
        const resumeLeft = getResumeLeft();
        if (resumeLeft <= 0) {
          await handleTimeout();
          return;
        }
        setSubmitting(false);
        startTimer(wordsCount, resumeLeft);
        return;
      }

      // 업데이트
      const newHistory = Array.isArray(data.history) ? data.history : [];
      setHistory(newHistory);
      setLastWord(data.aiWord || data.playerWord || '');
      setScore(data.score || 0);
      setWordsCount(data.wordsCount || 0);
      setInputWord('');

      if (data.gameOver) {
        stopTimer();
        await refreshResults(data.result);
      } else {
        startTimer(data.wordsCount || 0);
        setTimeout(() => inputRef.current?.focus(), 50);
      }
    } catch {
      setAiThinking(false);
      setErrorMsg('네트워크 오류');
      const resumeLeft = getResumeLeft();
      if (resumeLeft <= 0) {
        await handleTimeout();
        return;
      }
      startTimer(wordsCount, resumeLeft);
    } finally {
      setSubmitting(false);
    }
  };

  // ──────────────────────────────────────────────────────
  // 화면 렌더링
  // ──────────────────────────────────────────────────────

  // ─── 로딩 ────────────────────────────────────────────
  if (phase === 'loading') {
    return (
      <div style={{ ...BG, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={cardStyle}>
          <img src="/img/logo.png" alt="stufit" style={{ height: '40px', marginBottom: '16px' }} />
          <p style={{ color: '#1d6b4f', fontWeight: 700, fontSize: '1.05rem' }}>로딩 중...</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '12px' }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{
                width: '10px', height: '10px', borderRadius: '50%',
                background: '#1d8c66',
                animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
              }} />
            ))}
          </div>
          <style>{`@keyframes bounce{0%,80%,100%{transform:scale(0)}40%{transform:scale(1)}}`}</style>
        </div>
      </div>
    );
  }

  // ─── 로비 ────────────────────────────────────────────
  if (phase === 'lobby') {
    const isTied = tiedPlayers.includes(username);
    return (
      <div style={{ ...BG, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px 0' }}>
        <div style={{ ...cardStyle, textAlign: 'left' }}>
          <div style={{ textAlign: 'center', marginBottom: '12px' }}>
            <img src="/img/logo.png" alt="stufit" style={{ height: '40px', marginBottom: '6px' }} />
            <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: '#1d3d28' }}>AI 끝말잇기 미니게임</h2>
            <p style={{ margin: '6px 0 0', fontSize: '0.88rem', color: '#555' }}>
              동점이 발생했습니다! AI와 1:1 끝말잇기로 최종 순위를 결정합니다.
            </p>
          </div>

          {/* 동점자 목록 */}
          <div style={{ background: '#f0faf4', borderRadius: '12px', padding: '12px 16px', marginBottom: '16px' }}>
            <p style={{ margin: '0 0 8px', fontWeight: 700, color: '#1d6b4f', fontSize: '0.88rem' }}>참가 대상자</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {tiedPlayers.map((p) => (
                <span key={p} style={{
                  background: p === username ? '#1d8c66' : '#e8f5ef',
                  color: p === username ? '#fff' : '#1d6b4f',
                  borderRadius: '20px', padding: '4px 14px',
                  fontSize: '0.85rem', fontWeight: 600,
                }}>
                  {p}{p === username ? ' (나)' : ''}
                </span>
              ))}
            </div>
          </div>

          {/* 규칙 */}
          <div style={{ background: '#fffef0', border: '1px solid #e5d87a', borderRadius: '12px', padding: '12px 16px', marginBottom: '16px', fontSize: '0.85rem', color: '#444', lineHeight: 1.8 }}>
            <p style={{ margin: '0 0 4px', fontWeight: 700, color: '#7a6b00' }}>📋 게임 규칙</p>
            <ul style={{ margin: 0, paddingLeft: '18px' }}>
              <li>이전 단어의 마지막 글자로 시작하는 단어를 입력하세요.</li>
              <li>제한 시간: <strong>{START_TURN_SECONDS}초 → 최소 {MIN_TURN_SECONDS}초</strong> (턴마다 점점 감소) — 초과 시 자동 패배</li>
              <li><strong>한국어 위키백과 표제어</strong>가 아닌 단어 / 이미 사용한 단어는 인정되지 않습니다.</li>
              <li>AI가 응답하지 못하면 <strong>한방단어</strong> — 즉시 승리!</li>
            </ul>
          </div>

          {/* 채점 기준 */}
          <div style={{ background: '#f0faf4', borderRadius: '12px', padding: '12px 16px', marginBottom: '20px', fontSize: '0.83rem', color: '#444' }}>
            <p style={{ margin: '0 0 6px', fontWeight: 700, color: '#1d6b4f' }}>🏅 채점 기준</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 12px' }}>
              <span>단어 1개 제출</span><span style={{ fontWeight: 600, color: '#1d8c66' }}>+10점</span>
              <span>5초 이내 입력</span><span style={{ fontWeight: 600, color: '#1d8c66' }}>+7점</span>
              <span>10초 이내 입력</span><span style={{ fontWeight: 600, color: '#1d8c66' }}>+3점</span>
              <span>4글자 이상 단어</span><span style={{ fontWeight: 600, color: '#1d8c66' }}>+(글자수-3)×3점</span>
              <span>AI 한방단어 (승리)</span><span style={{ fontWeight: 600, color: '#1d8c66' }}>+50점</span>
            </div>
            <p style={{ margin: '8px 0 0', color: '#888', fontSize: '0.78rem' }}>
              * 시간이 초과되면 현재 점수로 마감됩니다. 점수가 높을수록 최종 순위가 높아집니다.
            </p>
          </div>

          {isTied ? (
            <button
              onClick={handleStartGame}
              style={{
                ...tealBtn,
                width: '100%',
                fontSize: '1.1rem',
                padding: '14px 0',
                borderRadius: '12px',
              }}
            >
              게임 시작하기
            </button>
          ) : (
            <div style={{ background: '#f5f5f5', borderRadius: '12px', padding: '14px', textAlign: 'center', color: '#888', fontSize: '0.9rem' }}>
              동점 참가 대상자가 아닙니다.<br />게임을 관전 중입니다.
            </div>
          )}

          <button
            onClick={() => navigate(`/challenge/${challengeId}`)}
            style={{ marginTop: '12px', background: 'none', border: '1px solid #bbb', color: '#666', borderRadius: '8px', padding: '10px', width: '100%', cursor: 'pointer', fontSize: '0.88rem' }}
          >
            돌아가기
          </button>
        </div>
      </div>
    );
  }

  // ─── 게임 진행 ───────────────────────────────────────
  if (phase === 'playing') {
    const requiredChar = lastWord ? lastWord[lastWord.length - 1] : null;
    const timerPct = turnSeconds > 0 ? (timeLeft / turnSeconds) * 100 : 0;
    const timerColor = timeLeft <= 5 ? '#e74c3c' : timeLeft <= 10 ? '#e67e22' : '#1d8c66';

    return (
      <div style={{ ...BG, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px 0' }}>
        <div style={{ ...cardStyle, maxWidth: '560px' }}>
          {/* 헤더 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <img src="/img/logo.png" alt="stufit" style={{ height: '32px' }} />
            <div style={{ display: 'flex', gap: '16px', fontSize: '0.88rem', fontWeight: 700, color: '#1d6b4f' }}>
              <span>점수: <span style={{ color: '#1d8c66', fontSize: '1rem' }}>{score}</span></span>
              <span>단어: <span style={{ color: '#1d8c66', fontSize: '1rem' }}>{wordsCount}</span>개</span>
            </div>
          </div>

          {/* 타이머 바 */}
          <div style={{ marginBottom: '12px' }}>
            <div style={{ background: '#e0ede7', borderRadius: '99px', height: '10px', overflow: 'hidden' }}>
              <div style={{
                height: '100%', width: `${timerPct}%`,
                background: timerColor,
                transition: 'width 0.3s linear, background 0.3s',
                borderRadius: '99px',
              }} />
            </div>
            <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: timerColor, fontWeight: timerPct <= 33 ? 700 : 400, textAlign: 'right' }}>
              {timeLeft}초 / {turnSeconds}초
            </p>
          </div>

          {/* 마지막 단어 (AI가 낸 단어 / 필수 시작 글자) */}
          <div style={{
            background: '#f0faf4', border: '1.5px solid #b2dfcb', borderRadius: '14px',
            padding: '12px 16px', marginBottom: '12px', minHeight: '52px',
            display: 'flex', alignItems: 'center', gap: '10px',
          }}>
            {lastWord ? (
              <>
                <span style={{ background: '#e8f5ef', color: '#1d6b4f', borderRadius: '8px', padding: '3px 10px', fontSize: '0.78rem', fontWeight: 600, flexShrink: 0 }}>AI</span>
                <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#1d3d28', flex: 1, textAlign: 'left' }}>
                  {lastWord.slice(0, -1)}
                  <span style={{ color: '#1d8c66', textDecoration: 'underline' }}>{lastWord[lastWord.length - 1]}</span>
                </span>
                <span style={{ fontSize: '0.82rem', color: '#777', flexShrink: 0 }}>
                  ↳ <strong style={{ color: '#1d8c66' }}>'{requiredChar}'</strong>(으)로 시작
                </span>
              </>
            ) : (
              <span style={{ color: '#aaa', fontSize: '0.95rem' }}>첫 단어를 입력해 주세요!</span>
            )}
          </div>

          {/* 히스토리 */}
          <div style={{ maxHeight: '150px', overflowY: 'auto', marginBottom: '14px', textAlign: 'left', padding: '0 2px' }}>
            {history.length === 0 && (
              <p style={{ color: '#bbb', fontSize: '0.85rem', textAlign: 'center', margin: '8px 0' }}>아직 기록이 없습니다.</p>
            )}
            {history.map((h, i) => (
              <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '5px', alignItems: 'center' }}>
                <span style={{
                  background: h.speaker === 'player' ? '#1d8c66' : '#e8f5ef',
                  color: h.speaker === 'player' ? '#fff' : '#1d6b4f',
                  borderRadius: '12px', padding: '2px 10px',
                  fontSize: '0.75rem', fontWeight: 600, flexShrink: 0,
                }}>
                  {h.speaker === 'player' ? '나' : 'AI'}
                </span>
                <span style={{ fontWeight: 600, color: '#222', fontSize: '0.95rem' }}>{h.word}</span>
              </div>
            ))}
            <div ref={historyEndRef} />
          </div>

          {/* 입력 폼 */}
          {aiThinking ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '14px', background: '#f0faf4', borderRadius: '12px', color: '#1d6b4f', fontSize: '0.95rem', fontWeight: 600 }}>
              <span>AI 생각 중</span>
              <div style={{ display: 'flex', gap: '4px' }}>
                {[0, 1, 2].map((i) => (
                  <div key={i} style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#1d8c66', animation: `bounce 1s ease-in-out ${i * 0.2}s infinite` }} />
                ))}
              </div>
              <style>{`@keyframes bounce{0%,80%,100%{transform:scale(0)}40%{transform:scale(1)}}`}</style>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px' }}>
              <input
                ref={inputRef}
                autoFocus
                value={inputWord}
                onChange={(e) => { setInputWord(e.target.value); setErrorMsg(''); }}
                placeholder={requiredChar ? `'${requiredChar}'(으)로 시작하는 단어` : '첫 단어 입력'}
                style={{
                  flex: 1, padding: '12px 14px', borderRadius: '10px',
                  border: errorMsg ? '2px solid #e74c3c' : '2px solid #b2dfcb',
                  fontSize: '1rem', outline: 'none',
                }}
                disabled={submitting}
              />
              <button type="submit" style={{ ...tealBtn, opacity: submitting ? 0.6 : 1 }} disabled={submitting}>
                {submitting ? '...' : '제출'}
              </button>
            </form>
          )}
          {errorMsg && (
            <p style={{ color: '#e74c3c', fontSize: '0.85rem', marginTop: '6px', textAlign: 'left' }}>{errorMsg}</p>
          )}
        </div>
      </div>
    );
  }

  // ─── 완료 ────────────────────────────────────────────
  const resultTitle = result === 'win' ? 'AI 격파! 승리!' : result === 'timeout' ? '시간 초과' : '게임 종료';
  const resultMsg = result === 'win'
    ? 'AI가 답하지 못했습니다. 한방단어 완성! +50점 획득!'
    : result === 'timeout'
    ? '제한 시간을 초과했습니다. 현재 점수로 마감됩니다.'
    : 'AI가 승리했습니다.';

  return (
    <div style={{ ...BG, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px 0' }}>
      <div style={{ ...cardStyle, textAlign: 'left' }}>
        {/* 결과 헤더 */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <img src="/img/logo.png" alt="stufit" style={{ height: '64px', marginBottom: '10px' }} />
          <h2 style={{ margin: '0 0 6px', fontSize: '1.5rem', fontWeight: 800, color: '#1d3d28' }}>{resultTitle}</h2>
          <p style={{ margin: 0, fontSize: '0.88rem', color: '#555' }}>{resultMsg}</p>
        </div>

        {/* 내 점수 */}
        <div style={{ background: '#f0faf4', borderRadius: '12px', padding: '14px 18px', marginBottom: '16px', display: 'flex', justifyContent: 'space-around' }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ margin: '0 0 4px', fontSize: '0.78rem', color: '#888' }}>최종 점수</p>
            <p style={{ margin: 0, fontSize: '1.6rem', fontWeight: 800, color: '#1d8c66' }}>{score}</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ margin: '0 0 4px', fontSize: '0.78rem', color: '#888' }}>총 단어 수</p>
            <p style={{ margin: 0, fontSize: '1.6rem', fontWeight: 800, color: '#1d8c66' }}>{wordsCount}</p>
          </div>
        </div>

        {/* 내 단어 히스토리 */}
        {history.length > 0 && (
          <div style={{ marginBottom: '16px' }}>
            <p style={{ margin: '0 0 8px', fontWeight: 700, color: '#1d6b4f', fontSize: '0.88rem' }}>내 게임 기록</p>
            <div style={{ maxHeight: '130px', overflowY: 'auto', padding: '2px' }}>
              {history.map((h, i) => (
                <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '5px', alignItems: 'center' }}>
                  <span style={{
                    background: h.speaker === 'player' ? '#1d8c66' : '#e8f5ef',
                    color: h.speaker === 'player' ? '#fff' : '#1d6b4f',
                    borderRadius: '12px', padding: '2px 10px',
                    fontSize: '0.75rem', fontWeight: 600, flexShrink: 0,
                  }}>
                    {h.speaker === 'player' ? '나' : 'AI'}
                  </span>
                  <span style={{ fontWeight: 600, color: '#222', fontSize: '0.9rem' }}>{h.word}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 동점자 비교표 */}
        {allResults.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <p style={{ margin: '0 0 8px', fontWeight: 700, color: '#1d6b4f', fontSize: '0.88rem' }}>동점자 결과 비교</p>
            <div style={{ borderRadius: '10px', overflow: 'hidden', border: '1px solid #c8e6d4' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ background: '#1d8c66', color: '#fff' }}>
                    <th style={{ padding: '8px 12px', textAlign: 'left' }}>순위</th>
                    <th style={{ padding: '8px 12px', textAlign: 'left' }}>플레이어</th>
                    <th style={{ padding: '8px 12px', textAlign: 'right' }}>점수</th>
                    <th style={{ padding: '8px 12px', textAlign: 'right' }}>단어 수</th>
                    <th style={{ padding: '8px 12px', textAlign: 'center' }}>결과</th>
                  </tr>
                </thead>
                <tbody>
                  {allResults.map((r, i) => (
                    <tr key={i} style={{ background: r.player_username === username ? '#edfaf4' : i % 2 === 0 ? '#fff' : '#f9fffe' }}>
                      <td style={{ padding: '8px 12px', fontWeight: 700, color: i === 0 ? '#1d8c66' : '#555' }}>
                        {i + 1}위
                      </td>
                      <td style={{ padding: '8px 12px', fontWeight: r.player_username === username ? 700 : 400 }}>
                        {r.player_username}{r.player_username === username ? ' (나)' : ''}
                      </td>
                      <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 700, color: '#1d6b4f' }}>{r.score}</td>
                      <td style={{ padding: '8px 12px', textAlign: 'right', color: '#555' }}>{r.words_count}</td>
                      <td style={{ padding: '8px 12px', textAlign: 'center' }}>
                        {r.result === 'win' ? '승리' : r.result === 'timeout' ? '시간초과' : '패배'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {allResults.length < tiedPlayers.length && (
              <p style={{ margin: '6px 0 0', fontSize: '0.78rem', color: '#aaa', textAlign: 'right' }}>
                아직 게임 중인 참가자가 있습니다.
              </p>
            )}
          </div>
        )}

        <button style={{ ...tealBtn, width: '100%', fontSize: '1rem', padding: '13px 0', borderRadius: '12px' }}
          onClick={() => navigate('/ongoing-challenges')}>
          챌린지로 돌아가기
        </button>
      </div>
    </div>
  );
}