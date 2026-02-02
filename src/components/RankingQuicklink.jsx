function RankingQuicklink({ onNavigate }) {
  const rankingData = [
    { rank: 1, name: '김예선', score: '4,893' },
    { rank: 2, name: '유태민', score: '4,201' },
    { rank: 3, name: '이정민', score: '3,216' },
    { rank: 4, name: '박현서', score: '3,142' },
    { rank: 5, name: '유태민', score: '2,873' },
    { rank: 6, name: '김예선', score: '2,423' },
    { rank: 7, name: '박현서', score: '2,213' },
    { rank: 8, name: '이정민', score: '1,998' },
    { rank: 9, name: '유태민', score: '1,873' },
    { rank: 10, name: '김예선', score: '1,493' }
  ];

  return (
    <div className="ranking-quicklink">
      <h2 className="ranking-quicklink-title">Personal<br />Ranking</h2>
      <div className="ranking-quicklink-container">
        <div className="ranking-quicklink-arrow">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </div>
        <div className="ranking-quicklink-list left">
          {rankingData.slice(0, 5).map((item) => (
            <div key={item.rank} className="quick-rank-card">
              <div className="rank-num">{item.rank}</div>
              <div className="rank-profile">
                <div className="profile-img"></div>
                <span className="name">{item.name}</span>
              </div>
              <div className="rank-score">
                <span className="label">점수</span>
                <span className="value">{item.score}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="ranking-quicklink-list right">
          {rankingData.slice(5, 10).map((item) => (
            <div key={item.rank} className="quick-rank-card">
              <div className="rank-num">{item.rank}</div>
              <div className="rank-profile">
                <div className="profile-img"></div>
                <span className="name">{item.name}</span>
              </div>
              <div className="rank-score">
                <span className="label">점수</span>
                <span className="value">{item.score}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default RankingQuicklink;
