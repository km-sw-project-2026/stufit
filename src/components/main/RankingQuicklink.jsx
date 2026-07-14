import { useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";

function RankingQuicklink() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);

  const fetchTop = useCallback(async () => {
    try {
      const res = await fetch("/api/users");
      const payload = await res.json().catch(() => null);
      if (!res.ok || !payload?.success || !Array.isArray(payload.users)) return;
      setUsers(
        payload.users.slice(0, 10).map((u, i) => ({
          rank: i + 1,
          username: u.username,
          score: Number(u.score) || 0,
        })),
      );
    } catch (e) {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    fetchTop();
    const handler = () => fetchTop();
    window.addEventListener("pointsUpdated", handler);
    return () => window.removeEventListener("pointsUpdated", handler);
  }, [fetchTop]);

  const handleArrowClick = () => {
    navigate("/ranking");
  };

  return (
    <div className="ranking-quicklink">
      <h2 className="ranking-quicklink-title">
        Personal
        <br />
        Ranking
      </h2>
      <div className="ranking-quicklink-container">
        <div
          className="ranking-quicklink-arrow"
          onClick={handleArrowClick}
          style={{ cursor: "pointer" }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </div>
        <div className="ranking-quicklink-list left">
          {users.slice(0, 5).map((user) => (
            <div key={user.rank} className="quick-rank-card">
              <div className="rank-num">{user.rank}</div>
              <div className="rank-profile">
                <div className="profile-img"></div>
                <span className="name">{user.username}</span>
              </div>
              <div className="rank-score">
                <span className="label">점수</span>
                <span className="value">{user.score.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="ranking-quicklink-list right">
          {users.slice(5, 10).map((user) => (
            <div key={user.rank} className="quick-rank-card">
              <div className="rank-num">{user.rank}</div>
              <div className="rank-profile">
                <div className="profile-img"></div>
                <span className="name">{user.username}</span>
              </div>
              <div className="rank-score">
                <span className="label">점수</span>
                <span className="value">{user.score.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export default RankingQuicklink;
