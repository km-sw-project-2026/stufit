function ChallengeDetailModal({ onClose, challenge }) {
  // challenge props가 없으면 기본값 사용
  const title = challenge?.title || "챌린지";
  const description = challenge?.description || "";
  const goal = challenge?.goal || "";
  const endDate = challenge?.end_date || "";
  const maxMembers = challenge?.max_members || 1;
  const category = challenge?.category || "";

  // 카테고리 한글 변환
  const getCategoryName = (cat) => {
    const categoryMap = {
      STUDY: "공부",
      EXERCISE: "운동",
      DAILY: "일상",
    };
    return categoryMap[cat] || cat;
  };

  // 날짜 포맷팅
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
  };

  const getTotalDays = () => {
    if (!challenge?.end_date || !challenge?.created_at) return 30;

    try {
      const startDate = new Date(challenge.created_at);
      const endDate = new Date(challenge.end_date);
      const diffTime = endDate - startDate;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      return diffDays > 0 ? diffDays : 30;
    } catch (error) {
      console.error("[getTotalDays] 날짜 계산 오류:", error);
      return 30;
    }
  };

  const [members, setMembers] = React.useState([]);
  const [progressPercent, setProgressPercent] = React.useState(0);
  const [elapsedDays, setElapsedDays] = React.useState(0);
  const [remainingDays, setRemainingDays] = React.useState(0);
  const [submittedToday, setSubmittedToday] = React.useState(false);
  const [submitLoading, setSubmitLoading] = React.useState(false);

  const loadProgress = async () => {
    const username = localStorage.getItem("username");
    if (!username || !challenge?.challenge_id) {
      setProgressPercent(0);
      setSubmittedToday(false);
      return;
    }

    try {
      const response = await fetch(
        `/api/challenges/${challenge.challenge_id}/progress`,
        {
          headers: { "X-Username": username },
        },
      );

      if (!response.ok) return;

      const result = await response.json();
      const rows = Array.isArray(result?.data) ? result.data : [];
      const userRows = rows.filter((row) => row.username === username);
      const count = userRows.length;
      const today = new Date().toISOString().slice(0, 10);

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

      const hasToday = userRows.some((row) => row.date === today);
      setSubmittedToday(hasToday);
    } catch (error) {
      console.error("진행도 조회 오류:", error);
    }
  };

  const handleSubmitProgress = async () => {
    if (submitLoading || submittedToday) {
      if (submittedToday) alert("오늘은 이미 제출했습니다.");
      return;
    }

    setSubmitLoading(true);
    const username = localStorage.getItem("username");

    try {
      const response = await fetch(
        `/api/challenges/${challenge.challenge_id}/verify`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Username": username,
          },
          body: JSON.stringify({}),
        },
      );

      if (response.ok) {
        setSubmittedToday(true);
        await loadProgress();
        setSubmittedToday(true);
        alert("제출이 완료되었습니다!");
      } else {
        const error = await response.json();
        alert(error.message || "제출 실패");
      }
    } catch (error) {
      console.error("제출 오류:", error);
      alert("제출 중 오류가 발생했습니다.");
    } finally {
      setSubmitLoading(false);
    }
  };

  React.useEffect(() => {
    const load = async () => {
      if (!challenge?.challenge_id) return;
      try {
        const username = localStorage.getItem("username");
        const headers = {};
        if (username) headers["X-Username"] = username;
        const res = await fetch(`/api/challenges/${challenge.challenge_id}`, {
          headers,
        });
        if (!res.ok) return;
        const payload = await res.json();
        const data = payload?.data || {};
        setMembers(Array.isArray(data.members) ? data.members : []);
      } catch (e) {
        console.error("멤버 목록 로드 실패:", e);
      }
    };
    load();
    loadProgress();
    // polling
    let mounted = true;
    let intervalId = 0;

    const fetchMembers = async () => {
      try {
        const username = localStorage.getItem("username");
        const headers = {};
        if (username) headers["X-Username"] = username;
        const res = await fetch(
          `/api/challenges/${challenge.challenge_id}/members`,
          { headers },
        );
        if (!res.ok) return;
        const payload = await res.json();
        const list = payload?.members || [];
        if (mounted) setMembers(list);
      } catch (e) {
        console.error("멤버 목록 로드 실패:", e);
      }
    };

    fetchMembers();
    intervalId = window.setInterval(fetchMembers, 3000);

    const handler = (e) => {
      try {
        if (e?.detail?.challengeId === challenge?.challenge_id) {
          const list = Array.isArray(e.detail.members) ? e.detail.members : [];
          setMembers(list);
        }
      } catch (err) {}
    };
    window.addEventListener("challenge-joined", handler);

    return () => {
      mounted = false;
      window.removeEventListener("challenge-joined", handler);
      clearInterval(intervalId);
    };
  }, [challenge]);

  const statusItems = [
    { name: "김예선", status: "success", label: "인증 완료" },
    { name: "이정민", status: "danger", label: "미제출" },
    { name: "이정민", status: "danger", label: "미제출" },
    { name: "유태민", status: "success", label: "인증 완료" },
    { name: "박현서", status: "warning", label: "인증 실패" },
    { name: "박현서", status: "warning", label: "인증 실패" },
  ];

  return (
    <div className="modal">
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
                      <span
                        className={`member-status ${m.status || "not_submitted"}`}
                      >
                        {m.status === "submitted"
                          ? "제출"
                          : m.status === "checked"
                            ? "인증"
                            : "미제출"}
                      </span>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>

        <div className="detail-main">
          <button className="close-detail-btn" onClick={onClose}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          <div className="detail-card">
            <h3>챌린지 정보</h3>
            <div style={{ marginBottom: "15px" }}>
              <p>
                <strong>제목:</strong> {title}
              </p>
              <p>
                <strong>설명:</strong> {description}
              </p>
              <p>
                <strong>카테고리:</strong> {getCategoryName(category)}
              </p>
              <p>
                <strong>종료일:</strong> {formatDate(endDate)}
              </p>
              <p>
                <strong>최대 인원:</strong> {maxMembers}명
              </p>
            </div>
          </div>

          <div className="detail-card">
            <h3>챌린지 진행도</h3>
            <div className="progress-area">
              <div className="progress-info">
                <span className="days-elapsed">{elapsedDays}일 경과</span>
                <span className="percentage">
                  {Math.round(progressPercent)}%
                </span>
                <span className="days-left">{remainingDays}일 남음</span>
              </div>
              <div className="progress-bar-bg">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="detail-card">
            <h3>챌린지 목표</h3>
            <div className="goal-box">{goal}</div>
            <button
              className="submit-btn"
              onClick={handleSubmitProgress}
              disabled={submitLoading || submittedToday}
            >
              {submittedToday ? "제출이 완료되었습니다" : "제출하기"}
            </button>
          </div>

          <div className="detail-card status-card">
            <h3>참여 현황</h3>
            <div className="status-grid">
              {statusItems.map((item, idx) => (
                <div key={idx} className="status-item">
                  <div className="status-user">
                    <div className="status-avatar">
                      <img src="/img/Profile.png" alt="Profile" />
                    </div>
                    <span>{item.name}</span>
                  </div>
                  <span className={`status-label ${item.status}`}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="detail-actions">
            <button className="btn-giveup">give up</button>
            <button
              className="btn-complete"
              onClick={() => {
                console.log("Challenge completed");
                // ChallengeOverModal을 호출하지 않도록 수정
              }}
            >
              complete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChallengeDetailModal;
