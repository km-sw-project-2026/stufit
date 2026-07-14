import { useState, useEffect, useCallback } from "react";
import { getTierByScore } from "../../constants/tiers";

function RankingModal({ onClose }) {
  const [rankingList, setRankingList] = useState([]);
  const topRankers = rankingList.slice(0, 3).map((u, idx) => ({
    rank: idx + 1,
    username: u.username,
    score: u.score,
    img: `/img/rank${idx + 1}.png`,
  }));

  // load users from API for the list
  const loadUsers = useCallback(async () => {
    let cancelled = false;
    try {
      const res = await fetch("/api/users");
      const payload = await res.json().catch(() => null);
      if (!res.ok || !payload?.success || !Array.isArray(payload.users)) return;
      const users = payload.users.map((u, i) => ({
        rank: i + 1,
        username: u.username,
        score: Number(u.score) || 0,
      }));
      if (!cancelled) setRankingList(users);
    } catch (e) {
      /* ignore */
    }
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    loadUsers();

    const handler = () => {
      loadUsers();
    };

    window.addEventListener("pointsUpdated", handler);
    return () => window.removeEventListener("pointsUpdated", handler);
  }, [loadUsers]);

  const [searchName, setSearchName] = useState("");

  const filteredList = rankingList.filter((item) =>
    item.username.includes(searchName),
  );
  const bodyList = searchName.trim() ? filteredList : rankingList.slice(3);

  return (
    <div className="ranking-view">
      <div className="ranking-header-section">
        {topRankers.map((ranker) => {
          return (
            <div key={ranker.rank} className={`rank-card rank-${ranker.rank}`}>
              <div className="rank-icon-wrapper">
                <img
                  src={ranker.img}
                  alt={`${ranker.rank}위`}
                  className="rank-img"
                />
              </div>
              <div className="rank-user-name">{ranker.username}</div>
              <div className="rank-user-label">점수</div>
              <div className="rank-user-score">
                {ranker.score.toLocaleString()}
              </div>
            </div>
          );
        })}
      </div>

      <div className="ranking-list-container">
        <div className="ranking-search-bar">
          <input
            type="text"
            placeholder="Your name"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
          <button className="ranking-search-btn">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
        </div>

        <div className="ranking-grid-list">
          {bodyList.map((item) => {
            const tier = getTierByScore(item.score);
            return (
              <div key={item.rank} className="ranking-list-item">
                <div className="r-left">
                  <span className="r-rank">{item.rank}</span>{" "}
                  <span className="r-name">{item.username}</span>
                </div>
                <div className="r-right">
                  <span className="r-label">점수</span>{" "}
                  <span className="r-score">{item.score}</span>
                  {tier && (
                    <img
                      src={tier.image}
                      alt={tier.name}
                      style={{ width: 20, marginLeft: 8 }}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <div className="custom-scroll-track"></div>
      </div>
    </div>
  );
}

export default RankingModal;
