import { useState } from 'react';

function OngoingChallengeModal({ onClose }) {
  const [searchCode, setSearchCode] = useState('');
  const joinByCode = async (codeParam) => {
    const code = (codeParam || searchCode || '').trim();
    if (!code) return alert('코드를 입력해주세요.');
    const username = localStorage.getItem('username');
    if (!username) {
      if (confirm('로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?')) window.location.href = '/login';
      return;
    }
    try {
      const headersForGet = {};
      const headerUser = localStorage.getItem('username');
      if (headerUser) headersForGet['X-Username'] = encodeURIComponent(headerUser);
      const res = await fetch(`/api/challenges?code=${encodeURIComponent(code)}`, { headers: headersForGet });
      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        return alert(e?.message || '챌린지를 찾을 수 없습니다.');
      }
      const payload = await res.json();
      const challenge = payload.challenge;
      if (!challenge) return alert('챌린지를 불러오지 못했습니다.');
      const headers = { 'Content-Type': 'application/json', 'X-Username': encodeURIComponent(username) };
      const joinRes = await fetch(`/api/challenges/${challenge.challenge_id}/join`, { method: 'POST', headers });
      const joinPayload = await joinRes.json().catch(() => ({}));
      if (!joinRes.ok) return alert(joinPayload?.message || '참가에 실패했습니다.');
      alert('참가되었습니다! 페이지를 새로고침합니다.');
      if (onClose) onClose();
      window.location.reload();
    } catch (err) {
      console.error('code join error', err);
      alert('참가 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="ongoing-challenge-link">
          <a href="#">챌린지 전체보기 →</a>
        </div>
        <div className="modal-header-top">
          <div className="header-left">
            <h2>진행중인 챌린지</h2>
            <div className="search-bar">
              <input
                type="text"
                placeholder="Enter code"
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') joinByCode(); }}
              />
              <button className="search-icon" onClick={() => joinByCode()}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </button>
            </div>
          </div>
          <div className="header-right">
            <button className="create-challenge-btn">챌린지 만들기</button>
          </div>
        </div>

        <div className="challenge-grid">
          {/* User created challenges will appear here */}
        </div>
      </div>
    </div>
  );
}

export default OngoingChallengeModal;
