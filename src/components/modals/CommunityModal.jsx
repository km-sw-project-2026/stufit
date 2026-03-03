import { useState } from 'react';

function CommunityModal({ onClose }) {
  const [activeMenu, setActiveMenu] = useState('data');
  const [showDetailView, setShowDetailView] = useState(false);

  const feedData = [
    {
      id: 1,
      username: '수학 고민러',
      title: '미적분 문제 질문이요!',
      desc: '치환적분 문제인데 도와주세요',
      likes: 34,
      comments: 17
    },
    {
      id: 2,
      username: '공부병아리',
      title: '기말고사 계획 도와주세요',
      desc: '전교 1등이 기말고사 계획 도와주세요!',
      likes: 10,
      comments: 15
    },
    {
      id: 3,
      username: '역사 덕후',
      title: '한국사 정리 노트 공유',
      desc: '시대별로 정리한 한국사 노트 공유해요~',
      likes: 24,
      comments: 9
    }
  ];

  return (
    <div className="community-view">
      <div className="community-layout">
        <div className="community-sidebar">
          <div className="sidebar-menu">
            <div className="menu-header">Jamawar Crowne Plaza</div>
            <div className={`menu-item ${activeMenu === 'popular' ? 'active' : ''}`} onClick={() => setActiveMenu('popular')}>Popular Posts</div>
            <div className={`menu-item ${activeMenu === 'tips' ? 'active' : ''}`} onClick={() => setActiveMenu('tips')}>Tips & How-To</div>
            <div className={`menu-item ${activeMenu === 'data' ? 'active' : ''}`} onClick={() => setActiveMenu('data')}>Data Sharing</div>
            <div className={`menu-item ${activeMenu === 'mypost' ? 'active' : ''}`} onClick={() => setActiveMenu('mypost')}>My Post</div>
          </div>
        </div>

        <div className="community-main">
          {!showDetailView && (
            <div id="community-feed-view">
              <div className="community-title-section">
                <h2>Latest Community</h2>
                <p>다양한 질문과 정보를 나누며 커뮤니티를 즐겨보세요</p>
              </div>

              <div className="community-board-container">
                <div className="community-feed">
                  {feedData.map((post) => (
                    <div key={post.id} className="feed-card" onClick={() => setShowDetailView(true)}>
                      <div className="feed-header">
                        <div className="feed-user-info">
                          <div className="feed-user-avatar"></div>
                          <span className="feed-user-name">{post.username}</span>
                        </div>
                        <div className="feed-meta">
                          <span className="like-count">♡ {post.likes}</span>
                          <span className="comment-count">💬 {post.comments}</span>
                        </div>
                      </div>
                      <div className="feed-content">
                        <h3>{post.title}</h3>
                        <p>{post.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="community-board-sidebar">
                  <button className="btn-new-post">New Post</button>
                </div>
              </div>
            </div>
          )}

          {showDetailView && (
            <div id="post-detail-view">
              <div className="post-detail-board">
                <div className="pd-header">
                  <div className="pd-header-top" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                    <h2 className="pd-title" style={{ margin: 0, fontSize: '32px', fontWeight: 700, color: '#000' }}>제목</h2>
                    <button className="close-detail-text-btn" onClick={() => setShowDetailView(false)} style={{ background: 'none', border: 'none', color: '#999', fontSize: '24px', cursor: 'pointer' }}>×</button>
                  </div>

                  <div className="pd-meta-row" style={{ border: 'none', padding: 0 }}>
                    <div className="pd-user-info">
                      <div className="pd-avatar"></div>
                      <div className="pd-user-text">
                        <span className="pd-username">작성자</span>
                        <span className="pd-date-view">2025.12.29 12:15</span>
                      </div>
                    </div>
                    <div className="pd-actions">
                      <button className="pd-btn edit hidden">수정하기</button>
                      <button className="pd-btn delete hidden">삭제하기</button>
                      <div className="pd-stats">
                        <span className="pd-like">♡ 0</span>
                        <span className="pd-comment">💬 0</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pd-divider" style={{ height: '1px', background: '#eee', margin: '30px 0' }}></div>

                <div className="pd-body">
                  <div className="pd-content">내용</div>
                </div>

                <div className="pd-divider" style={{ height: '1px', background: '#eee', margin: '40px 0' }}></div>

                <div className="pd-comments-section">
                  <div className="comment-input-area" style={{ border: '2px solid #ddd', borderRadius: '16px', padding: '8px 10px 8px 24px', marginBottom: '40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fff', transition: 'border-color 0.2s' }}>
                    <input type="text" placeholder="댓글 추가..." className="comment-input" style={{ border: 'none', padding: '12px 0', fontSize: '15px', width: '100%', outline: 'none', background: 'transparent' }} />
                    <button className="comment-submit-btn" style={{ background: '#176B5F', color: 'white', padding: '10px 26px', borderRadius: '12px', fontWeight: 700, flexShrink: 0, marginLeft: '15px', border: 'none', cursor: 'pointer', fontSize: '14px', boxShadow: '0 4px 10px rgba(23, 107, 95, 0.2)' }}>등록</button>
                  </div>
                  <div className="comments-list"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CommunityModal;
