import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const TURN_SECONDS = 15;

// ──────────────────────────────────────────────────────
// 스타일 상수
// ──────────────────────────────────────────────────────
const BG = { background: 'linear-gradient(160deg, #7ec8a0 0%, #a6d8b8 60%, #c2e8cf 100%)' };

const cardStyle = {
  background: 'rgba(255,255,255,0.92)',
  borderRadius: '22px',
  padding: '36px 40px',
  maxWidth: '520px',
  width: '92%',
  boxShadow: '0 8px 32px rgba(0,0,0,0.13)',
  textAlign: 'center',
};

const logoText = {
  fontFamily: "'Segoe UI', sans-serif",
  fontSize: '1.5rem',
  fontWeight: 900,
  color: '#1d6b4f',
  letterSpacing: '-0.5px',
  marginBottom: '8px',
};

const titleStyle = {
  fontSize: '2rem',
  fontWeight: 800,
  color: '#1d3d28',
  margin: '6px 0 18px',
};

const subStyle = {
  fontSize: '0.85rem',
  color: '#555',
  marginBottom: '28px',
  lineHeight: 1.6,
};

const bigBtnStyle = (disabled = false) => ({
  display: 'block',
  width: '100%',
  background: disabled ? '#a0c8b0' : 'linear-gradient(135deg,#1d8c66,#247b7b)',
  border: '3px solid #155e45',
  color: '#fff',
  fontSize: '1.7rem',
  fontWeight: 800,
  borderRadius: '16px',
  padding: '22px 0',
  cursor: disabled ? 'not-allowed' : 'pointer',
  transition: 'filter 0.15s',
  marginTop: '8px',
});

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

  // 세션 상태
  const [session, setSession] = useState(null);
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isHost, setIsHost] = useState(false);

  // 게임 플레이 상태
  const [inputWord, setInputWord] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [timeLeft, setTimeLeft] = useState(TURN_SECONDS);
  const [submitting, setSubmitting] = useState(false);
  const [phase, setPhase] = useState('loading'); // 'loading' | 'waiting_session' | 'start' | 'playing' | 'finished' | 'error'

  const timerRef = useRef(null);
  const pollRef = useRef(null);
  const wordsEndRef = useRef(null);

  // 자동 스크롤
  useEffect(() => {
    wordsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [words]);

  // ── 세션 폴링 ──────────────────────────────────────
  const fetchSession = useCallback(async () => {
    try {
      const res = await fetch(`/api/challenges/${challengeId}/minigame`, {
        headers: { 'X-Username': username },
      });
      if (!res.ok) {
        if (res.status === 404) { setPhase('error'); setLoading(false); }
        return;
      }
      const data = await res.json();

      setSession(data.session);
      setWords(Array.isArray(data.words) ? data.words : []);

      if (!data.session) {
        // 세션이 아직 없음 = 방장이 아직 세션을 생성 안 한 상태 → 계속 폴링
        setPhase('waiting_session');
        setLoading(false);
        return;
      }

      const s = data.session;

      if (s.status === 'waiting') setPhase('start');
      else if (s.status === 'active') {
        setPhase('playing');
        const activePlayers = s.active_players || [];
        const currentPlayer = activePlayers[s.current_turn_index % activePlayers.length];
        if (currentPlayer === username) {
          // 내 턴: 타이머 리셋
          resetTimer(s.turn_started_at);
        }
      } else {
        setPhase('finished');
        clearTimers();
      }
      setLoading(false);
    } catch { setLoading(false); }
  }, [challengeId, username]);

  // 호스트 여부 확인
  useEffect(() => {
    if (!challengeId) return;
    (async () => {
      try {
        const res = await fetch(`/api/challenges/${challengeId}`, { headers: { 'X-Username': username } });
        if (!res.ok) return;
        const data = await res.json();
        const challenge = data?.data || data;
        const members = challenge?.members || [];
        const me = members.find((m) => m.username === username);
        setIsHost(me && challenge?.created_by_user_id === me.user_id);
      } catch {}
    })();
  }, [challengeId, username]);

  // 초기 로드 & 폴링
  useEffect(() => {
    fetchSession();
    pollRef.current = setInterval(fetchSession, 2500);
    return () => clearInterval(pollRef.current);
  }, [fetchSession]);

  // ── 타이머 ─────────────────────────────────────────
  const clearTimers = () => {
    clearInterval(timerRef.current);
    clearInterval(pollRef.current);
  };

  const resetTimer = (turnStartedAt) => {
    clearInterval(timerRef.current);
    const start = turnStartedAt ? new Date(turnStartedAt).getTime() : Date.now();
    const update = () => {
      const elapsed = Math.floor((Date.now() - start) / 1000);
      const remaining = Math.max(0, TURN_SECONDS - elapsed);
      setTimeLeft(remaining);
      if (remaining <= 0) {
        clearInterval(timerRef.current);
        handleTimeout();
      }
    };
    update();
    timerRef.current = setInterval(update, 500);
  };

  useEffect(() => () => clearInterval(timerRef.current), []);

  // ── 타임아웃 처리 ──────────────────────────────────
  const handleTimeout = async () => {
    if (!session) return;
    const activePlayers = session.active_players || [];
    const currentPlayer = activePlayers[session.current_turn_index % activePlayers.length];
    if (currentPlayer !== username) return; // 내 차례가 아님

    try {
      await fetch(`/api/challenges/${challengeId}/minigame`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'X-Username': username },
        body: JSON.stringify({ action: 'eliminate', username }),
      });
      await fetchSession();
    } catch {}
  };

  // ── 게임 시작 (방장) ────────────────────────────────
  const handleStart = async () => {
    try {
      const res = await fetch(`/api/challenges/${challengeId}/minigame`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'X-Username': username },
        body: JSON.stringify({ action: 'start' }),
      });
      const data = await res.json();
      if (!res.ok) { alert(data?.message || '시작 실패'); return; }
      await fetchSession();
    } catch { alert('네트워크 오류'); }
  };

  // ── 단어 제출 ──────────────────────────────────────
  const handleSubmitWord = async (e) => {
    e?.preventDefault();
    if (submitting || !inputWord.trim()) return;
    setSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch(`/api/challenges/${challengeId}/minigame`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'X-Username': username },
        body: JSON.stringify({ action: 'word', word: inputWord.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data?.message || '잘못된 단어입니다.');
        setSubmitting(false);
        return;
      }
      setInputWord('');
      clearInterval(timerRef.current);
      await fetchSession();
    } catch {
      setErrorMsg('네트워크 오류');
    } finally {
      setSubmitting(false);
    }
  };

  // ── 렌더링 헬퍼 ────────────────────────────────────
  const activePlayers = session?.active_players || [];
  const totalPlayers = session?.players || [];
  const currentPlayer = activePlayers.length > 0
    ? activePlayers[session.current_turn_index % activePlayers.length]
    : null;
  const isMyTurn = phase === 'playing' && currentPlayer === username;
  const lastWord = session?.last_word || '';
  const winner = session?.winner_username;
  const isEliminated = phase === 'playing' && !activePlayers.includes(username);

  // ── 화면 ───────────────────────────────────────────

  if (loading) {
    return (
      <div style={{ ...BG, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 700 }}>로딩 중...</p>
      </div>
    );
  }

  if (phase === 'waiting_session') {
    return (
      <div style={{ ...BG, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={cardStyle}>
          <p style={logoText}>stu fit · 끝말잇기</p>
          <p style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1d3d28', margin: '12px 0 8px' }}>게임 준비 중...</p>
          <p style={{ fontSize: '0.9rem', color: '#555', marginBottom: '20px' }}>
            방장이 게임을 시작할 때까지 잠시 기다려 주세요.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginBottom: '20px' }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{
                width: '10px', height: '10px', borderRadius: '50%',
                background: '#1d8c66',
                animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
              }} />
            ))}
          </div>
          <style>{`@keyframes bounce { 0%,80%,100%{transform:scale(0)} 40%{transform:scale(1)} }`}</style>
          <button style={{ ...tealBtn, width: '100%', fontSize: '0.9rem' }} onClick={() => navigate(`/challenge/${challengeId}`)}>
            돌아가기
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'error') {
    return (
      <div style={{ ...BG, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={cardStyle}>
          <p style={logoText}>stu fit</p>
          <p style={{ color: '#c0392b', fontWeight: 700 }}>미니게임 세션을 찾을 수 없습니다.</p>
          <button style={{ ...tealBtn, marginTop: '20px' }} onClick={() => navigate(`/challenge/${challengeId}`)}>돌아가기</button>
        </div>
      </div>
    );
  }

  // ─── 시작 대기 화면 ──────────────────────────────
  if (phase === 'start') {
    return (
      <div style={{ ...BG, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 0 }}>
        <div style={cardStyle}>
          <p style={logoText}>mini game</p>
          <button
            style={bigBtnStyle(!isHost)}
            onClick={isHost ? handleStart : undefined}
            disabled={!isHost}
          >
            게임 시작
          </button>
          {!isHost && (
            <p style={{ ...subStyle, marginTop: '14px', marginBottom: 0 }}>
              방장이 게임을 시작할 때까지 기다려 주세요.
            </p>
          )}
          <p style={{ ...subStyle, marginTop: '16px', marginBottom: 0 }}>
            집중력과 손발력을 발휘해 마지막까지 단어를 이어가며&nbsp;
            <strong>최종 승리</strong>를 차지해 보세요.
          </p>

          {/* 참가자 */}
          <div style={{ marginTop: '20px', textAlign: 'left' }}>
            <p style={{ fontWeight: 700, color: '#1d6b4f', marginBottom: '8px' }}>참가자</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {totalPlayers.map((p) => (
                <span
                  key={p}
                  style={{
                    background: p === username ? '#1d8c66' : '#e8f5ef',
                    color: p === username ? '#fff' : '#1d6b4f',
                    borderRadius: '20px',
                    padding: '4px 14px',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                  }}
                >
                  {p}{p === username ? ' (나)' : ''}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── 완료 화면 ───────────────────────────────────
  if (phase === 'finished') {
    const myWin = winner === username;
    return (
      <div style={{ ...BG, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={cardStyle}>
          <p style={logoText}>stu fit</p>
          <p style={{ fontSize: '2.4rem', marginBottom: '6px' }}>{myWin ? '🏆' : '😢'}</p>
          <h2 style={{ ...titleStyle, marginBottom: '4px' }}>
            {myWin ? '최종 승리!' : '게임 종료'}
          </h2>
          <p style={{ fontSize: '1.1rem', color: '#333', marginBottom: '24px' }}>
            {winner
              ? <><strong style={{ color: '#1d8c66' }}>{winner}</strong>님이 끝말잇기 챔피언입니다! 🎉</>
              : '승자를 가리지 못했습니다.'}
          </p>

          {/* 단어 히스토리 */}
          <div style={{ textAlign: 'left', marginBottom: '20px', maxHeight: '180px', overflowY: 'auto' }}>
            <p style={{ fontWeight: 700, color: '#1d6b4f', marginBottom: '8px' }}>단어 히스토리</p>
            {words.map((w, i) => (
              <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '4px', alignItems: 'center' }}>
                <span style={{ background: '#e8f5ef', color: '#1d6b4f', borderRadius: '12px', padding: '2px 10px', fontSize: '0.8rem' }}>{w.username}</span>
                <span style={{ fontWeight: 600, color: '#222' }}>{w.word}</span>
              </div>
            ))}
          </div>

          <button style={{ ...tealBtn, width: '100%' }} onClick={() => navigate(`/challenge/${challengeId}`)}>챌린지로 돌아가기</button>
        </div>
      </div>
    );
  }

  // ─── 게임 진행 화면 ──────────────────────────────
  return (
    <div style={{ ...BG, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ ...cardStyle, maxWidth: '600px' }}>
        <p style={logoText}>stu fit · 끝말잇기</p>

        {/* 생존자 배지 */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', justifyContent: 'center', marginBottom: '14px' }}>
          {totalPlayers.map((p) => {
            const alive = activePlayers.includes(p);
            return (
              <span
                key={p}
                style={{
                  background: alive ? (p === currentPlayer ? '#1d8c66' : '#e8f5ef') : '#ddd',
                  color: alive ? (p === currentPlayer ? '#fff' : '#1d6b4f') : '#999',
                  borderRadius: '20px',
                  padding: '4px 14px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  textDecoration: !alive ? 'line-through' : 'none',
                }}
              >
                {p}{p === username ? ' (나)' : ''}{p === currentPlayer ? ' ✏️' : ''}
              </span>
            );
          })}
        </div>

        {/* 마지막 단어 */}
        <div style={{ background: '#f0faf4', border: '1px solid #b2dfcb', borderRadius: '14px', padding: '14px 18px', marginBottom: '16px' }}>
          {lastWord
            ? <p style={{ margin: 0, fontSize: '1.35rem', fontWeight: 800, color: '#1d3d28' }}>
                {lastWord}
                <span style={{ fontSize: '0.9rem', color: '#888', fontWeight: 400, marginLeft: '10px' }}>
                  ↳ <strong style={{ color: '#1d8c66' }}>{lastWord[lastWord.length - 1]}</strong>(으)로 시작하는 단어
                </span>
              </p>
            : <p style={{ margin: 0, color: '#888' }}>첫 번째 단어를 입력해 주세요!</p>}
        </div>

        {/* 단어 히스토리 스크롤 */}
        <div style={{ maxHeight: '130px', overflowY: 'auto', marginBottom: '14px', textAlign: 'left' }}>
          {words.map((w, i) => (
            <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '4px', alignItems: 'center' }}>
              <span style={{ background: '#e8f5ef', color: '#1d6b4f', borderRadius: '12px', padding: '2px 10px', fontSize: '0.78rem', flexShrink: 0 }}>{w.username}</span>
              <span style={{ fontWeight: 600, color: '#222', fontSize: '0.95rem' }}>{w.word}</span>
            </div>
          ))}
          <div ref={wordsEndRef} />
        </div>

        {/* 내 차례 입력 */}
        {isMyTurn && !isEliminated && (
          <>
            {/* 타이머 */}
            <div style={{ marginBottom: '10px' }}>
              <div style={{ background: '#e8f5ef', borderRadius: '8px', height: '8px', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${(timeLeft / TURN_SECONDS) * 100}%`,
                    background: timeLeft <= 5 ? '#e74c3c' : '#1d8c66',
                    transition: 'width 0.5s linear, background 0.3s',
                  }}
                />
              </div>
              <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: timeLeft <= 5 ? '#e74c3c' : '#555' }}>
                남은 시간: {timeLeft}초
              </p>
            </div>

            <form onSubmit={handleSubmitWord} style={{ display: 'flex', gap: '8px' }}>
              <input
                autoFocus
                value={inputWord}
                onChange={(e) => { setInputWord(e.target.value); setErrorMsg(''); }}
                placeholder={lastWord ? `'${lastWord[lastWord.length - 1]}'(으)로 시작하는 단어` : '단어 입력'}
                style={{
                  flex: 1,
                  padding: '12px 14px',
                  borderRadius: '10px',
                  border: errorMsg ? '2px solid #e74c3c' : '2px solid #b2dfcb',
                  fontSize: '1rem',
                  outline: 'none',
                }}
              />
              <button type="submit" style={tealBtn} disabled={submitting}>
                {submitting ? '...' : '제출'}
              </button>
            </form>
            {errorMsg && <p style={{ color: '#e74c3c', fontSize: '0.85rem', marginTop: '6px' }}>{errorMsg}</p>}
          </>
        )}

        {/* 대기 상태 */}
        {!isMyTurn && !isEliminated && (
          <div style={{ padding: '14px', background: '#f0faf4', borderRadius: '12px', color: '#555', fontSize: '0.9rem' }}>
            <strong style={{ color: '#1d8c66' }}>{currentPlayer}</strong>님의 차례입니다. 기다려 주세요…
          </div>
        )}

        {/* 탈락 */}
        {isEliminated && (
          <div style={{ padding: '14px', background: '#fdf2f2', borderRadius: '12px', color: '#c0392b', fontSize: '0.95rem', fontWeight: 700 }}>
            😢 탈락하셨습니다. 남은 플레이어를 응원해 주세요!
          </div>
        )}
      </div>
    </div>
  );
}
