import { useState, useEffect } from "react";
import GiveUpModal from "./modal/GiveUpModal";
import HostGiveUpModal from "./modal/HostGiveUpModal";
import FinalGiveUpModal from "./modal/FinalGiveUpModal";
import CustomAlertModal from "./modal/CustomAlertModal";
import ChallengeOverModal from "./modals/ChallengeOverModal";

// 주간 제출 현황 컴포넌트
function WeeklySubmissionStatus({ challengeId, refreshKey }) {
    const [weekData, setWeekData] = useState([]);
    const [username, setUsername] = useState('');

    const daysOfWeek = ['월', '화', '수', '목', '금', '토', '일'];

    useEffect(() => {
        const user = localStorage.getItem('username');
        setUsername(user || '');
        loadWeeklyData();
    }, [challengeId, refreshKey]);

    const loadWeeklyData = async () => {
        try {
            const user = localStorage.getItem('username');
            if (!user || !challengeId) return;

            const response = await fetch(`/api/challenges/${challengeId}/progress`, {
                headers: { 'X-Username': user }
            });

            if (!response.ok) return;

            const result = await response.json();
            const rows = Array.isArray(result?.data) ? result.data : [];
            const userRows = rows.filter(row => row.username === user);

            // 한국 시간(Asia/Seoul) 기준 최근 7일 계산
            const formatter = new Intl.DateTimeFormat('en-CA', {
                timeZone: 'Asia/Seoul',
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
            });
            
            const pad = (n) => String(n).padStart(2, '0');
            // Seoul 기준 현재 날짜를 먼저 구합니다
            const todayStr = formatter.format(new Date());
            const [year, month, day] = todayStr.split('-').map(Number);
            
            const last7Days = [];
            
            // 순수 숫자 기반으로 각 날짜를 계산합니다
            for (let i = 6; i >= 0; i--) {
                let calcDay = day - i;
                let calcMonth = month;
                let calcYear = year;
                
                // 월 초 처리
                if (calcDay <= 0) {
                    calcMonth--;
                    if (calcMonth <= 0) {
                        calcMonth = 12;
                        calcYear--;
                    }
                    // 이전 달의 마지막 날짜 계산
                    const daysInMonth = new Date(calcYear, calcMonth, 0).getDate();
                    calcDay += daysInMonth;
                }
                
                const dateStr = `${calcYear}-${pad(calcMonth)}-${pad(calcDay)}`;
                const hasSubmitted = userRows.some(row => row.date === dateStr);
                console.log('[loadWeeklyData] dateStr:', dateStr, 'hasSubmitted:', hasSubmitted, 'userRows:', userRows.map(r => r.date));
                last7Days.push({ dateStr, hasSubmitted });
            }

            setWeekData(last7Days);
        } catch (error) {
            console.error('주간 데이터 로드 실패:', error);
        }
    };

    return (
        <div style={{
            border: '1px solid #70c1b3',
            borderRadius: '15px',
            padding: '12px 15px',
            backgroundColor: '#f9fffe'
        }}>
            {/* 사용자 정보 */}
            <div style={{
                marginBottom: '10px',
                paddingBottom: '8px',
                borderBottom: '1px solid #ddd'
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}>
                    <img 
                        src="/img/Profile.png" 
                        alt="Profile" 
                        style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            objectFit: 'cover'
                        }}
                    />
                    <span style={{
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        color: '#333'
                    }}>
                        {username}
                    </span>
                </div>
            </div>

            {/* 주간 제출 현황 */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                gap: '4px'
            }}>
                {weekData.map((day, idx) => (
                    <div key={idx} style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '4px',
                        flex: 1
                    }}>
                        {/* 요일 표시 */}
                        <div style={{
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            color: '#666',
                            height: '14px',
                            display: 'flex',
                            alignItems: 'center'
                        }}>
                            {daysOfWeek[idx]}
                        </div>

                        {/* 제출 상태 원형 버튼 */}
                        <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            border: '2px solid',
                            borderColor: day.hasSubmitted ? '#70c1b3' : '#ddd',
                            backgroundColor: day.hasSubmitted ? '#70c1b3' : 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'default',
                            transition: 'all 0.2s ease'
                        }}>
                            {day.hasSubmitted && (
                                <span style={{
                                    color: 'white',
                                    fontSize: '0.9rem',
                                    fontWeight: 'bold'
                                }}>
                                    ✓
                                </span>
                            )}
                        </div>

                        {/* 날짜 */}
                        <div style={{
                            fontSize: '0.65rem',
                            color: '#999',
                            height: '12px'
                        }}>
                            {day.dateStr.split('-')[2]}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function ChallengeDetailView({ challenge: initialChallenge, onClose, isPage = false }) {
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
    const [refreshKey, setRefreshKey] = useState(0);
    const [ongoingAlertOpen, setOngoingAlertOpen] = useState(false);
    const [isChallengeOverOpen, setIsChallengeOverOpen] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [rankingData, setRankingData] = useState([]);
    const [studyScore, setStudyScore] = useState(null);
    const [members, setMembers] = useState([]);
    const [finalAction, setFinalAction] = useState('leave');
    const [leaveAlertMessage, setLeaveAlertMessage] = useState('챌린지를 완전히 포기했습니다.');

    // props로 받은 challenge가 변경되면 state 업데이트
    useEffect(() => {
        setChallenge(initialChallenge);
    }, [initialChallenge]);

    useEffect(() => {
        setIsChallengeOverOpen(false);
        setRankingData([]);
    }, [challenge?.challenge_id]);

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

        // Prefer an explicit `duration` property if present (some clients store it locally)
        if (typeof challenge?.duration !== 'undefined' && challenge?.duration !== null) {
            const d = Number(challenge.duration);
            if (!Number.isNaN(d) && d > 0) return d;
        }

        // If we have both a start (created_at/start_date) and end_date, compute day difference.
        // created_at은 UTC로 저장되므로 UTC 기준으로 파싱
        if (challenge?.end_date) {
            try {
                const startRaw = challenge.created_at || challenge.start_date || null;
                if (startRaw) {
                    const startStr = String(startRaw).replace(' ', 'T');
                    const startUTC = startStr.endsWith('Z') ? startStr : startStr + 'Z';
                    const start = new Date(startUTC);
                    const end = new Date(challenge.end_date);
                    const msPerDay = 24 * 60 * 60 * 1000;
                    const sd = Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate());
                    const ed = Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate());
                    const diffInclusive = Math.floor((ed - sd) / msPerDay) + 1;
                    if (diffInclusive >= 1) return diffInclusive;
                }
            } catch (err) {
                console.error('getTotalDays 계산 오류', err);
            }
        }

        // Fallback to category defaults
        const categoryDays = {
            DAILY: 30,
            SHORT: 20
        };

        return categoryDays[challenge?.category] || 30;

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

    const getChallengeType = () => {
        const rawType = challenge?.type;
        if (rawType) return String(rawType).toLowerCase();

        const category = challenge?.category;
        if (category === 'STUDY') return 'study';
        if (category === 'EXERCISE') return 'exercise';
        if (category === 'DAILY') return 'daily';
        return '';
    };

    const getChallengeMode = () => {
        const rawMode = challenge?.mode;
        if (rawMode) return String(rawMode).toLowerCase();

        const category = challenge?.category;
        if (category === 'DAILY') return 'daily';
        return 'main';
    };

    const loadWeeklyData = async () => {
        try {
            const user = localStorage.getItem('username');
            if (!user || !challenge?.challenge_id) return;

            const response = await fetch(`/api/challenges/${challenge.challenge_id}/progress`, {
                headers: { 'X-Username': user }
            });

            if (!response.ok) return;

            const result = await response.json();
            const rows = Array.isArray(result?.data) ? result.data : [];
            const userRows = rows.filter(row => row.username === user);

            console.log('[loadWeeklyData] 주간 데이터 로드:', userRows.map(r => r.date));
        } catch (error) {
            console.error('[loadWeeklyData] 오류:', error);
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
            
            // 한국 시간(Asia/Seoul) 기준으로 오늘 날짜 계산
            const formatter = new Intl.DateTimeFormat('en-CA', {
                timeZone: 'Asia/Seoul',
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
            });
            const today = formatter.format(new Date());
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

                // 위에서 선언한 formatter를 사용
                const todayLocal = formatter.format(new Date());
                const hasToday = userRows.some(row => row.date === todayLocal);
                console.log('[loadProgress] hasToday:', hasToday, '각 row의 date:', userRows.map(r => r.date));
                setSubmittedToday(hasToday);
        } catch (error) {
            console.error('진행도 조회 오류:', error);
        }
    };

    const buildRankingData = (rows) => {
        const totalDays = getTotalDays();
        
        // rows에서 각 사용자의 진행도 계산
        const countsByUser = new Map();
        rows.forEach((row) => {
            if (!row?.username) return;
            countsByUser.set(row.username, (countsByUser.get(row.username) || 0) + 1);
        });

        // members와 진행도를 합쳐서 순위 계산
        const base = members.map((member) => {
            const count = countsByUser.get(member.username) || 0;
            const ratio = totalDays > 0 ? Math.min(count / totalDays, 1) : 0;
            return {
                userId: member.user_id,
                name: member.username,
                count,
                ratio
            };
        });

        // 비율 기준으로 정렬
        const sorted = base.sort((a, b) => {
            if (b.ratio !== a.ratio) return b.ratio - a.ratio;
            return a.name.localeCompare(b.name);
        });

        const mode = getChallengeMode();

        // 1명 참여 시 보상 없음
        if (sorted.length <= 1) {
            return [];
        }

        // 모든 사용자에 대해 순위와 보상 계산
        const result = sorted.map((item, idx) => {
            let points = 0;
            let score = 0;

            if (mode === 'practice') {
                // 연습 모드: 보상 없음
                points = 0;
                score = 0;
            } else if (idx === 0) {
                // 1등: 포인트 150 고정, 점수 150 고정
                points = 150;
                score = 150;
            } else if (sorted.length === 2) {
                // 2명: 2등 -30 포인트, 100점수 (고정)
                points = -30;
                score = 100;
            } else if (sorted.length === 3) {
                // 3명: 2등 +100, 3등 -30 포인트 / 2등 100점수, 3등 50점수 (고정)
                points = idx === 1 ? 100 : -30;
                score = idx === 1 ? 100 : 50;
            } else {
                // 4명 이상: 상/중/하 분배
                const restCount = sorted.length - 1;
                const topPercent = Math.ceil(restCount * 0.3) || 1;
                const bottomPercent = Math.ceil(restCount * 0.3) || 1;
                const middlePercent = restCount - topPercent - bottomPercent;
                const otherIndex = idx - 1;

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

        console.log('[buildRankingData] result:', result);
        return result;
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
            setFinalAction('leave');
            setHostModalOpen(true);
        } else {
            setFinalAction('leave');
            setModalOpen(true);
        }
    };

    const isChallengeStarted =
        Number(challenge?.is_started || 0) === 1 ||
        Number(challenge?.member_count || 0) >= Number(challenge?.max_members || 0) ||
        members.length >= Number(challenge?.max_members || 0);

    const handleSubmitProgress = async () => {
        console.log('[handleSubmitProgress] 시작, submittedToday:', submittedToday);
        console.log('[handleSubmitProgress] members:', members.length, 'maxMembers:', challenge?.max_members);
        
        if (submitLoading) {
            console.log('[handleSubmitProgress] 이미 제출 중');
            return;
        }

        if (submittedToday) {
            console.log('[handleSubmitProgress] 이미 오늘 제출함');
            alert('오늘은 이미 제출했습니다.');
            return;
        }

        // 인원 충족 여부 체크
        if (!isChallengeStarted) {
            console.log('[handleSubmitProgress] 인원 미충족');
            alert(`인원을 모두 모아야 합니다. (현재 ${members.length}명 / 필요 ${challenge?.max_members}명)`);
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
            // 클라이언트에서 한국 시간 기준 오늘 날짜 계산
            const formatter = new Intl.DateTimeFormat('en-CA', {
                timeZone: 'Asia/Seoul',
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
            });
            const todayInSeoul = formatter.format(new Date());
            console.log('[handleSubmitProgress] API 호출 시작, todayInSeoul:', todayInSeoul);
            
            const response = await fetch(`/api/challenges/${challenge.challenge_id}/verify`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Username': username
                },
                body: JSON.stringify({ date: todayInSeoul })
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
            setRefreshKey(prev => prev + 1); // WeeklySubmissionStatus 리로드
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
    const handleLeaveSuccess = (actionType = 'leave') => {
        // 멤버 목록 즉시 갱신
        fetchMembers();
        setFinalModalOpen(false);
        setHostModalOpen(false);
        setModalOpen(false);
        setLeaveAlertMessage(actionType === 'delete' ? '챌린지가 삭제되었습니다.' : '챌린지를 완전히 포기했습니다.');
        setAlertOpen(true);
        // 제출 상태 초기화: 챌린지를 나가면 로컬 제출 상태는 제거
        try {
            setSubmittedToday(false);
            setProgressPercent(0);
            setElapsedDays(0);
            setRemainingDays(getTotalDays());
            setRefreshKey(prev => prev + 1);
        } catch (e) { console.warn('leave local clear failed', e); }
        // 자세히보기도 닫기
        setTimeout(() => {
            if (onClose) onClose();
        }, 1500);
    };

    // 완료하기 버튼 핸들러
    const handleComplete = () => {
        console.log('[handleComplete] click', { remainingDays, challengeId: challenge?.challenge_id });
        // 챌린지가 아직 진행 중인지 확인
        if (remainingDays > 0) {
            setOngoingAlertOpen(true);
            return;
        }
        // 성공 메시지 먼저 표시
        setShowSuccessPopup(true);
    };

    const handleSuccessConfirm = () => {
        setShowSuccessPopup(false);
        setIsChallengeOverOpen(true);
        finalizeChallenge();
    };

    const finalizeChallenge = async () => {
        if (!challenge?.challenge_id) return;

        const syncPointsFromServer = async () => {
            const username = localStorage.getItem('username');
            const userId = Number(localStorage.getItem('userId'));
            if (!userId || Number.isNaN(userId)) return;

            try {
                const headers = {};
                if (username) headers['X-Username'] = username;

                const response = await fetch(`/api/user/stats?userId=${userId}&t=${Date.now()}`, {
                    headers
                });
                if (!response.ok) return;

                const data = await response.json();
                const nextPoints = Number(data?.points);
                const nextScore = Number(data?.score);
                
                if (!Number.isNaN(nextPoints)) {
                    localStorage.setItem('points', String(nextPoints));
                }
                if (!Number.isNaN(nextScore)) {
                    localStorage.setItem('score', String(nextScore));
                }

                window.dispatchEvent(new CustomEvent('pointsUpdated', { 
                    detail: { points: nextPoints, score: nextScore } 
                }));
            } catch (error) {
                console.warn('[syncPointsFromServer] failed:', error);
            }
        };

        try {
            const username = localStorage.getItem('username');
            const headers = {};
            if (username) headers['X-Username'] = username;

            await fetch(`/api/challenges/${challenge.challenge_id}/complete`, {
                method: 'PATCH',
                headers
            });
        } catch (error) {
            console.warn('[finalizeChallenge] complete failed:', error);
        }

        try {
            const username = localStorage.getItem('username');
            const headers = { 'Content-Type': 'application/json' };
            if (username) headers['X-Username'] = username;

            const rewardsBody = { action: 'complete' };
            if (getChallengeType() === 'study' && studyScore !== null) {
                rewardsBody.score = studyScore;
            }
            const rewardsResponse = await fetch(`/api/challenges/${challenge.challenge_id}/rewards`, {
                method: 'POST',
                headers,
                body: JSON.stringify(rewardsBody)
            });

            if (rewardsResponse.ok) {
                const payload = await rewardsResponse.json();
                console.log('[finalizeChallenge] rewards success:', payload);
                if (Array.isArray(payload?.ranking)) {
                    console.log('[finalizeChallenge] ranking data:', payload.ranking);
                    setRankingData(payload.ranking);
                    await syncPointsFromServer();
                    return;
                }
            } else {
                console.warn('[finalizeChallenge] rewards failed:', rewardsResponse.status);
            }
        } catch (error) {
            console.error('[finalizeChallenge] rewards error:', error);
        }

        try {
            const username = localStorage.getItem('username');
            const headers = {};
            if (username) headers['X-Username'] = username;

            const response = await fetch(`/api/challenges/${challenge.challenge_id}/progress`, {
                headers
            });
            if (!response.ok) {
                console.warn('[finalizeChallenge] progress fetch failed:', response.status);
                setRankingData([]);
                return;
            }

            const result = await response.json();
            const rows = Array.isArray(result?.data) ? result.data : [];
            const rankings = buildRankingData(rows);
            console.log('[finalizeChallenge] fallback ranking data:', rankings);
            setRankingData(rankings);
            await syncPointsFromServer();
        } catch (error) {
            console.error('[finalizeChallenge] error:', error);
        }
        try {
            window.dispatchEvent(new CustomEvent('challengeCompleted', { detail: { delta: 1 } }));
            console.log('[finalizeChallenge] ✅ challengeCompleted 이벤트 발생!');
        } catch (e) {
            console.warn('[finalizeChallenge] challengeCompleted dispatch failed', e);
        }
    };

    const handleSubmitStudyScore = async (score) => {
        console.log('[handleSubmitStudyScore] score:', score);
        const userId = Number(localStorage.getItem('userId'));
        if (!userId || Number.isNaN(userId)) {
            alert('로그인이 필요합니다.');
            return false;
        }

        // 점수를 state에 저장
        setStudyScore(score);
        return true;
    };

    // Props 기본값 설정
    const title = challenge?.title || '챌린지';
    const goal = challenge?.goal || '아침 6시 기상';
    const category = challenge?.category || '';

    // 챌린지 멤버 목록 로드 함수 (초기 전체 상세 조회)
    const fetchMembers = async () => {
        if (!challenge?.challenge_id) return;
        try {
            const username = localStorage.getItem('username');
            const headers = {};
            if (username) headers['X-Username'] = username;
            // fetch full challenge detail once (includes members + isJoined)
            const res = await fetch(`/api/challenges/${challenge.challenge_id}`, { headers });
            if (res.status === 404) {
                console.warn('[fetchMembers] challenge not found (404):', challenge.challenge_id);
                setMembers([]);
                return;
            }
            if (!res.ok) {
                console.warn('[fetchMembers] non-ok response', res.status);
                return;
            }
            const payload = await res.json();
            
            // challenge 정보 업데이트
            if (payload?.data) {
                console.log('[fetchMembers] challenge max_members:', payload.data.max_members);
                setChallenge(payload.data);
            }
            
            const list = (payload?.data && payload.data.members) ? payload.data.members : (payload?.members || []);
            // If members list empty but server marks user as joined, show current user as member
            if ((list.length === 0) && payload?.data?.isJoined && username) {
                list.push({ user_id: null, username, status: 'not_submitted' });
            }
            console.log('[fetchMembers] members count:', list.length, 'payload:', payload);
            setMembers(list || []);
        } catch (e) {
            console.error('멤버 목록 로드 실패:', e);
        }
    };

    // Polling helper: only fetch members list (lighter) on interval
    const pollMembers = async () => {
        if (!challenge?.challenge_id) return;
        try {
            const username = localStorage.getItem('username');
            const headers = {};
            if (username) headers['X-Username'] = username;
            // 전체 챌린지 정보를 가져옴 (members 포함)
            const res = await fetch(`/api/challenges/${challenge.challenge_id}`, { headers });
            if (!res.ok) return;
            const payload = await res.json();
            
            // challenge 정보 업데이트
            if (payload?.data) {
                setChallenge(payload.data);
            }
            
            const list = (payload?.data && payload.data.members) ? payload.data.members : (payload?.members || []);
            setMembers(list || []);
        } catch (e) {
            console.error('pollMembers 실패:', e);
        }
    };

    // 챌린지 멤버 목록 로드
    useEffect(() => {
        if (!challenge?.challenge_id) return;

        let intervalId = 0;

        // initial full detail fetch
        fetchMembers();

        // lightweight members polling every 3s
        intervalId = window.setInterval(pollMembers, 3000);

        const handler = (e) => {
            try {
                console.debug('challenge-joined event received:', e?.detail);
                if (e?.detail?.challengeId === challenge?.challenge_id) {
                    if (Array.isArray(e.detail.members)) {
                        console.debug('challenge-joined: updating members from event', e.detail.members);
                        setMembers(e.detail.members);
                        // If the current user just joined, clear submittedToday to ensure submit button is enabled
                        try {
                            const username = localStorage.getItem('username');
                            if (username && e.detail.members.some(m => m.username === username)) {
                                setSubmittedToday(false);
                                setRefreshKey(prev => prev + 1);
                            }
                        } catch (err) { console.warn('clear submitted on joined failed', err); }
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
                        // If our member status changed (re-joined), ensure submittedToday reflects server state
                        try {
                            const username = localStorage.getItem('username');
                            if (username) {
                                const myRec = e.detail.members.find(m => m.username === username);
                                if (myRec && myRec.status !== 'submitted') {
                                    setSubmittedToday(false);
                                }
                            }
                        } catch (err) { console.warn('sync submitted on update failed', err); }
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
            <div id="challenge-detail-view" className={isPage ? "" : "modal"}>
                <div
                    className="detail-view-container"
                    style={
                        isPage
                            ? { maxWidth: '1920px', margin: '0 auto', padding: '12px 8px 12px 0', width: '100vw', boxSizing: 'border-box' }
                            : {}
                    }
                >
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
                                disabled={submittedToday || submitLoading || !isChallengeStarted}
                                style={{ marginTop: '-4px' }}
                            >
                                {!isChallengeStarted 
                                    ? `인원 대기 중... (${members.length}/${challenge?.max_members})`
                                    : submittedToday 
                                    ? '제출이 완료되었습니다' 
                                    : submitLoading 
                                    ? '제출 중...' 
                                    : '제출하기'}
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
                                    <h3 className="detail-title-left">참여 현황</h3>
                                    <WeeklySubmissionStatus challengeId={challenge?.challenge_id} refreshKey={refreshKey} />
                                </>
                            )}
                        </div>

                                        <div className="detail-actions" style={{ marginTop: '6px' }}>
                                            <button className="btn-giveup" onClick={giveupHandler}>give up</button>
                                            <button className="btn-complete" onClick={handleComplete}>complete</button>
                                        </div>
                    </div>
                </div>
            </div>

            {modalOpen && <GiveUpModal setModalOpen={setModalOpen} setFinalModalOpen={setFinalModalOpen} />}
            {hostModalOpen && <HostGiveUpModal setModalOpen={setHostModalOpen} setFinalModalOpen={setFinalModalOpen} setFinalAction={setFinalAction} challenge={challenge} onLeave={handleLeaveSuccess} />}
            {finalModalOpen && (
                <FinalGiveUpModal
                    setModalOpen={setFinalModalOpen}
                    challengeId={challenge?.challenge_id}
                    action={finalAction}
                    onLeave={handleLeaveSuccess}
                />
            )}
            {alertOpen && (
                <CustomAlertModal
                    message={leaveAlertMessage}
                    onClose={() => {
                        setAlertOpen(false);
                        if (onClose) {
                            onClose();
                        }
                    }}
                />
            )}
            {ongoingAlertOpen && (
                <CustomAlertModal
                    message="아직 챌린지가 진행 중입니다!"
                    onClose={() => setOngoingAlertOpen(false)}
                />
            )}
            {showSuccessPopup && (
                <CustomAlertModal
                    message="챌린지에 성공하셨습니다! 🎉"
                    onClose={handleSuccessConfirm}
                />
            )}
            <ChallengeOverModal
                isOpen={isChallengeOverOpen}
                onClose={() => {
                    console.log('[ChallengeOverModal] close click');
                    setIsChallengeOverOpen(false);
                    // 완료 후 상세 페이지도 닫기
                    if (onClose) {
                        setTimeout(() => {
                            onClose();
                        }, 300);
                    }
                }}
                showScoreInput={getChallengeType() === 'study'}
                onSubmitScore={handleSubmitStudyScore}
                rankingData={rankingData}
            />
        </>
    );
};
export default ChallengeDetailView;