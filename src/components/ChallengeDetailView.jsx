import { useState, useEffect } from "react";
import GiveUpModal from "./modal/GiveUpModal";
import HostGiveUpModal from "./modal/HostGiveUpModal";
import FinalGiveUpModal from "./modal/FinalGiveUpModal";
import CustomAlertModal from "./modal/CustomAlertModal";

function ChallengeDetailView({ challenge: initialChallenge, onClose }) {
    const [challenge, setChallenge] = useState(initialChallenge);
    const [modalOpen, setModalOpen] = useState(false);
    const [hostModalOpen, setHostModalOpen] = useState(false);
    const [finalModalOpen, setFinalModalOpen] = useState(false);
    const [alertOpen, setAlertOpen] = useState(false);
    const [timerSeconds, setTimerSeconds] = useState(0);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [progressPercent, setProgressPercent] = useState(0);
    const [submittedToday, setSubmittedToday] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [elapsedDays, setElapsedDays] = useState(0);
    const [remainingDays, setRemainingDays] = useState(0);

    // props로 받은 challenge가 변경되면 state 업데이트
    useEffect(() => {
        setChallenge(initialChallenge);
    }, [initialChallenge]);

    useEffect(() => {
        document.body.classList.add('modal-open');
        return () => document.body.classList.remove('modal-open');
    }, []);

    // 타이머 초기화
    useEffect(() => {
        if (challenge?.timer_hours || challenge?.timer_minutes) {
            const totalSeconds = (challenge.timer_hours || 0) * 3600 + (challenge.timer_minutes || 0) * 60;
            setTimerSeconds(totalSeconds);
        }
    }, [challenge]);

    // 타이머 시작/종료
    useEffect(() => {
        let interval;
        if (isTimerRunning && timerSeconds > 0) {
            interval = setInterval(() => {
                setTimerSeconds(prev => Math.max(0, prev - 1));
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isTimerRunning, timerSeconds]);

    const getTotalDays = () => {
        if (!challenge?.end_date || !challenge?.created_at) return 30;
        
        try {
            const startDate = new Date(challenge.created_at);
            const endDate = new Date(challenge.end_date);
            const diffTime = endDate - startDate;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            return diffDays > 0 ? diffDays : 30;
        } catch (error) {
            console.error('[getTotalDays] 날짜 계산 오류:', error);
            return 30;
        }
    };

    const loadProgress = async () => {
        const username = localStorage.getItem('username');
        if (!username || !challenge?.challenge_id) {
            setProgressPercent(0);
            setSubmittedToday(false);
            return;
        }

        try {
            const response = await fetch(`/api/challenges/${challenge.challenge_id}/progress`, {
                headers: { 'X-Username': username }
            });

            if (!response.ok) {
                return;
            }

            const result = await response.json();
            console.log('[loadProgress] API 응답:', result);
            const rows = Array.isArray(result?.data) ? result.data : [];
            const userRows = rows.filter(row => row.username === username);
            const count = userRows.length;
            const today = new Date().toISOString().slice(0, 10);
            console.log('[loadProgress] today:', today);
            console.log('[loadProgress] userRows:', userRows);
            
                const totalDays = getTotalDays();
                const total = totalDays || 0;
                const elapsed = Math.min(count, total);

                if (total <= 0) {
                    setProgressPercent(0);
                    setElapsedDays(0);
                    setRemainingDays(0);
                } else {
                    setProgressPercent(Math.min((elapsed / total) * 100, 100));
                    setElapsedDays(elapsed);
                    setRemainingDays(Math.max(total - elapsed, 0));
                }

                const hasToday = userRows.some(row => row.date === today);
                console.log('[loadProgress] hasToday:', hasToday, '각 row의 date:', userRows.map(r => r.date));
                setSubmittedToday(hasToday);
        } catch (error) {
            console.error('진행도 조회 오류:', error);
        }
    };

    // 진행도 로드 (오늘 제출 여부 포함)
    useEffect(() => {
        loadProgress();
    }, [challenge]);

    const giveupHandler = () => {
        const username = localStorage.getItem('username');
        if (!username) {
            setModalOpen(true);
            return;
        }

        // 현재 사용자가 방장인지 확인
        const currentUser = members.find(m => m.username === username);
        const isHost = currentUser && challenge?.created_by_user_id === currentUser.user_id;

        if (isHost) {
            setHostModalOpen(true);
        } else {
            setModalOpen(true);
        }
    };

    const handleSubmitProgress = async () => {
        console.log('[handleSubmitProgress] 시작, submittedToday:', submittedToday);
        
        if (submitLoading) {
            console.log('[handleSubmitProgress] 이미 제출 중');
            return;
        }

        if (submittedToday) {
            console.log('[handleSubmitProgress] 이미 오늘 제출함');
            alert('오늘은 이미 제출했습니다.');
            return;
        }

        const username = localStorage.getItem('username');
        console.log('[handleSubmitProgress] username:', username);
        
        if (!username || !challenge?.challenge_id) {
            console.log('[handleSubmitProgress] 로그인 정보 없음');
            alert('로그인이 필요합니다.');
            return;
        }

        setSubmitLoading(true);
        console.log('[handleSubmitProgress] 제출 중 상태로 변경');
        
        try {
            console.log('[handleSubmitProgress] API 호출 시작');
            const response = await fetch(`/api/challenges/${challenge.challenge_id}/verify`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Username': username
                }
            });

            const result = await response.json();
            console.log('[handleSubmitProgress] API 응답:', response.status, result);

            if (!response.ok) {
                console.log('[handleSubmitProgress] API 실패');
                alert(result?.message || '제출에 실패했습니다.');
                return;
            }

            console.log('[handleSubmitProgress] 제출 성공! setSubmittedToday(true) 호출');
            
            await loadProgress();
            await fetchMembers(); // 멤버 상태 즉시 갱신
            
            // loadProgress()가 상태를 덮어쓸 수 있으므로 다시 설정
            setSubmittedToday(true);
            
            console.log('[handleSubmitProgress] 진행도 및 멤버 갱신 완료');
        } catch (error) {
            console.error('[handleSubmitProgress] 오류:', error);
            alert('제출 중 오류가 발생했습니다.');
        } finally {
            setSubmitLoading(false);
            console.log('[handleSubmitProgress] 제출 중 상태 해제, submittedToday:', submittedToday);
        }
    };

    // 챌린지 나가기 성공 시 호출
    const handleLeaveSuccess = () => {
        // 멤버 목록 즉시 갱신
        fetchMembers();
        setFinalModalOpen(false);
        setAlertOpen(true);
    };

    // Props 기본값 설정
    const title = challenge?.title || '챌린지';
    const goal = challenge?.goal || '아침 6시 기상';
    const category = challenge?.category || '';

    const [members, setMembers] = useState([]);

    // 챌린지 멤버 목록 로드 함수
    const fetchMembers = async () => {
        if (!challenge?.challenge_id) return;
        
        try {
            const username = localStorage.getItem('username');
            const headers = {};
            if (username) headers['X-Username'] = username;

            // Prefer fetching challenge detail which includes members + isJoined
            const res = await fetch(`/api/challenges/${challenge.challenge_id}`, { headers });
            console.log('[fetchMembers] response status:', res.status);
            if (!res.ok) {
                console.warn('loadMembers: non-ok response', res.status);
                return;
            }
            const payload = await res.json();
            console.log('[fetchMembers] payload:', payload);
            const list = (payload?.data && payload.data.members) ? payload.data.members : (payload?.members || []);
            console.log('[fetchMembers] members list:', list);

            // If members list empty but server marks user as joined, show current user as member
            if ((list.length === 0) && payload?.data?.isJoined && username) {
              list.push({ user_id: null, username, status: 'not_submitted' });
            }

            setMembers(list || []);
        } catch (e) {
            console.error('멤버 목록 로드 실패:', e);
        }
    };

    // 챌린지 멤버 목록 로드
    useEffect(() => {
        if (!challenge?.challenge_id) return;

        let intervalId = 0;

        // initial fetch
        fetchMembers();

        // poll every 3s
        intervalId = window.setInterval(fetchMembers, 3000);

        const handler = (e) => {
            try {
                console.debug('challenge-joined event received:', e?.detail);
                if (e?.detail?.challengeId === challenge?.challenge_id) {
                    if (Array.isArray(e.detail.members)) {
                        console.debug('challenge-joined: updating members from event', e.detail.members);
                        setMembers(e.detail.members);
                    } else {
                        console.debug('challenge-joined: members not in event, reloading from server');
                        // if members not provided, reload from server
                        fetchMembers();
                    }
                }
            } catch (err) { console.error('challenge-joined handler error', err); }
        };
        
        const updateHandler = (e) => {
            try {
                console.debug('challenge-updated event received:', e?.detail);
                if (e?.detail?.challengeId === challenge?.challenge_id) {
                    if (e.detail.challenge) {
                        console.debug('challenge-updated: updating challenge', e.detail.challenge);
                        setChallenge(e.detail.challenge);
                    }
                    if (Array.isArray(e.detail.members)) {
                        console.debug('challenge-updated: updating members', e.detail.members);
                        setMembers(e.detail.members);
                    }
                }
            } catch (err) { console.error('challenge-updated handler error', err); }
        };
        
        window.addEventListener('challenge-joined', handler);
        window.addEventListener('challenge-updated', updateHandler);

        return () => {
            window.removeEventListener('challenge-joined', handler);
            window.removeEventListener('challenge-updated', updateHandler);
            clearInterval(intervalId);
        };
    }, [challenge]);

    // 카테고리 한글 변환
    const getCategoryName = (cat) => {
        const categoryMap = {
            'STUDY': '공부',
            'EXERCISE': '운동',
            'DAILY': '일상'
        };
        return categoryMap[cat] || cat;
    };

    // 날짜 포맷팅
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
    };

    // 타이머 포맷팅 (HH:MM:SS)
    const formatTimer = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    return (
        <>
            <div id="challenge-detail-view" className="modal">
                <div className="detail-view-container">
                    <div className="detail-sidebar">
                        <h2>MEMBER</h2>
                        <div className="member-list">
                            {members.length === 0 ? (
                                <div className="member-item empty">참여자가 없습니다.</div>
                            ) : (
                                members
                                    .sort((a, b) => {
                                        // 방장을 맨 위로
                                        const aIsHost = challenge?.created_by_user_id === a.user_id;
                                        const bIsHost = challenge?.created_by_user_id === b.user_id;
                                        if (aIsHost && !bIsHost) return -1;
                                        if (!aIsHost && bIsHost) return 1;
                                        return 0;
                                    })
                                    .map((m) => (
                                    <div key={m.user_id} className="member-item">
                                        <div className="member-avatar">
                                            <img src="/img/Profile.png" alt="Profile" />
                                        </div>
                                        <div className="member-info">
                                            <div className="member-name-row">
                                                <span className="member-name">{m.username}</span>
                                                {challenge?.created_by_user_id === m.user_id && (
                                                    <span className="host-badge">방장</span>
                                                )}
                                            </div>
                                            <span className={`member-status ${m.status || 'not_submitted'}`}>
                                                {m.status === 'submitted' ? '제출' : m.status === 'checked' ? '인증' : '미제출'}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>


                    <div className="detail-main">
                        <button className="close-detail-btn" onClick={onClose}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>

                        <div className="detail-card">
                            <h3 className="detail-title-left">챌린지 진행도</h3>
                            <div className="progress-area">
                                <div className="progress-info">
                                    <span className="days-elapsed">{elapsedDays}일 경과</span>
                                    <span className="percentage">{Math.round(progressPercent)}%</span>
                                    <span className="days-left">{remainingDays}일 남음</span>
                                </div>
                                <div className="progress-bar-bg">
                                    <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }}></div>
                                </div>
                            </div>
                        </div>


                        <div className="detail-card">
                            <h3 className="detail-title-left">챌린지 목표</h3>
                            <div className="goal-box">{goal}</div>
                            <button
                                className="submit-btn"
                                onClick={handleSubmitProgress}
                                disabled={submittedToday || submitLoading}
                            >
                                {submittedToday ? '제출이 완료되었습니다' : submitLoading ? '제출 중...' : '제출하기'}
                            </button>
                        </div>


                        <div className="detail-card status-card">
                            {(category === 'STUDY' || category === 'EXERCISE') ? (
                                <>
                                    <h3 className="detail-title-left">타이머</h3>
                                    <div className="timer-display">
                                        <div className="timer-time">{formatTimer(timerSeconds)}</div>
                                        <div className="timer-controls">
                                            <button 
                                                className="timer-btn"
                                                onClick={() => setIsTimerRunning(!isTimerRunning)}
                                            >
                                                {isTimerRunning ? '⏸ 일시정지' : '▶ 시작'}
                                            </button>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <h3>참여 현황</h3>
                                    <div className="status-grid">
                                        <div className="status-item">
                                            <div className="status-user">
                                                <div className="status-avatar">
                                                    <img src="img/Profile.png" alt="Profile" />
                                                </div>
                                                <span>김예선</span>
                                            </div>
                                            <span className="status-label success">인증 완료</span>
                                        </div>
                                        <div className="status-item">
                                            <div className="status-user">
                                                <div className="status-avatar">
                                                    <img src="img/Profile.png" alt="Profile" />
                                                </div>
                                                <span>이정민</span>
                                            </div>
                                            <span className="status-label danger">미제출</span>
                                        </div>
                                        <div className="status-item">
                                            <div className="status-user">
                                                <div className="status-avatar">
                                                    <img src="img/Profile.png" alt="Profile" />
                                                </div>
                                                <span>이정민</span>
                                            </div>
                                            <span className="status-label danger">미제출</span>
                                        </div>

                                        <div className="status-item">
                                            <div className="status-user">
                                                <div className="status-avatar">
                                                    <img src="img/Profile.png" alt="Profile" />
                                                </div>
                                                <span>유태민</span>
                                            </div>
                                            <span className="status-label success">인증 완료</span>
                                        </div>
                                        <div className="status-item">
                                            <div className="status-user">
                                                <div className="status-avatar">
                                                    <img src="img/Profile.png" alt="Profile" />
                                                </div>
                                                <span>박현서</span>
                                            </div>
                                            <span className="status-label warning">인증 실패</span>
                                        </div>
                                        <div className="status-item">
                                            <div className="status-user">
                                                <div className="status-avatar">
                                                    <img src="img/Profile.png" alt="Profile" />
                                                </div>
                                                <span>박현서</span>
                                            </div>
                                            <span className="status-label warning">인증 실패</span>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="detail-actions">
                            <button className="btn-giveup" onClick={giveupHandler}>give up</button>
                            <button className="btn-complete">complete</button>
                        </div>
                    </div>
                </div>
            </div>

            {modalOpen && <GiveUpModal setModalOpen={setModalOpen} setFinalModalOpen={setFinalModalOpen} />}
            {hostModalOpen && <HostGiveUpModal setModalOpen={setHostModalOpen} setFinalModalOpen={setFinalModalOpen} challenge={challenge} onLeave={handleLeaveSuccess} />}
            {finalModalOpen && (
                <FinalGiveUpModal
                    setModalOpen={setFinalModalOpen}
                    challengeId={challenge?.challenge_id}
                    onLeave={handleLeaveSuccess}
                />
            )}
            {alertOpen && (
                <CustomAlertModal
                    message="챌린지를 완전히 포기했습니다."
                    onClose={() => {
                        setAlertOpen(false);
                        if (onClose) {
                            onClose();
                        }
                    }}
                />
            )}
        </>
    );
};
export default ChallengeDetailView;