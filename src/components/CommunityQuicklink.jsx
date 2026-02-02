function CommunityQuicklink({ onNavigate }) {
  const communityCards = [
    {
      id: 1,
      tag: 'Q&A',
      title: '미적분 문제 질문이요!',
      desc: '치환적분 문제인데 도와주세요',
      username: '수학 고민러',
      comments: 13,
      likes: 12
    },
    {
      id: 2,
      tag: 'TIP',
      title: '기말고사 계획 도와주세요',
      desc: '전교 1등이 기말고사 계획 도와주세요!',
      username: '공부천재',
      comments: 24,
      likes: 9
    },
    {
      id: 3,
      tag: '자료공유',
      title: '한국사 정리 노트 공유',
      desc: '시대별로 정리한 한국사 노트 공유해요~',
      username: '역사 덕후',
      comments: 0,
      likes: 0
    }
  ];

  return (
    <div className="community-quicklink">
      <div className="community-header">
        <div className="header-titles">
          <h2>Latest<br />Community</h2>
          <p>인기 글에 등록되어 포인트를 노리세요!</p>
        </div>
      </div>

      <div className="community-container">
        <div className="community-nav-row">
          <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('community'); }} className="community-more">
            바로가기 <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </a>
        </div>

        <div className="community-cards-wrapper">
          {communityCards.map((card) => (
            <div key={card.id} className="comm-card">
              <div className="comm-tag-row">
                <span className="comm-tag">{card.tag}</span>
              </div>
              <h3 className="comm-title">{card.title}</h3>
              <p className="comm-desc">{card.desc}</p>

              <div className="comm-footer">
                <div className="comm-user">
                  <div className="comm-profile-icon"></div>
                  <span className="comm-username">{card.username}</span>
                </div>
                <div className="comm-stats">
                  {card.comments > 0 && (
                    <div className="stat-item">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="#ccc" stroke="none"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                      <span>{card.comments}</span>
                    </div>
                  )}
                  {card.likes > 0 && (
                    <div className="stat-item">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="#ccc" stroke="none"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                      <span>{card.likes}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CommunityQuicklink;
