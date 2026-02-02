import { useState } from 'react';

function RankingModal({ onClose }) {
  const topRankers = [
    { rank: 2, name: '박현서', score: 1998, img: 'img/2위.png' },
    { rank: 1, name: '김예선', score: 3447, img: 'img/1위.png' },
    { rank: 3, name: '유태민', score: 1358, img: 'img/3위.png' }
  ];

  const rankingList = Array.from({ length: 47 }, (_, i) => ({
    rank: i + 4,
    name: ['신유빈', '송헌', '최백령', '박상진', '김민성', '정자연', '김예선', '유태민', '박현서', '이정민'][i % 10],
    score: 1000 - (i * 15)
  }));

  const [searchName, setSearchName] = useState('');

  const filteredList = rankingList.filter(item => item.name.includes(searchName));

  return (
    <div className="ranking-view">
      <div className="ranking-header-section">
        {topRankers.map((ranker) => (
          <div key={ranker.rank} className={`rank-card rank-${ranker.rank}`}>
            <div className="rank-icon-wrapper">
              <img src={ranker.img} alt={`${ranker.rank}위`} className="rank-img" />
            </div>
            <div className="rank-user-name">{ranker.name}</div>
            <div className="rank-user-label">점수</div>
            <div className="rank-user-score">{ranker.score.toLocaleString()}</div>
          </div>
        ))}
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
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </button>
        </div>

        <div className="ranking-grid-list">
          {filteredList.map((item) => (
            <div key={item.rank} className="ranking-list-item">
              <div className="r-left"><span className="r-rank">{item.rank}</span> <span className="r-name">{item.name}</span></div>
              <div className="r-right"><span className="r-label">점수</span> <span className="r-score">{item.score}</span></div>
            </div>
          ))}
        </div>
        <div className="custom-scroll-track"></div>
      </div>
    </div>
  );
}

export default RankingModal;
