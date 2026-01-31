function Community(){
  return(
    <div id="community-view" className="community-view hidden">
                <div className="community-layout">
                    {/* <!-- 사이드바 --> */}
                    <div className="community-sidebar">
                        <div className="sidebar-menu">
                            <div className="menu-header">Jamawar Crowne Plaza</div>
                            <div className="menu-item" id="menu-popular">Popular Posts</div>
                            <div className="menu-item" id="menu-tips">Tips & How-To</div>
                            <div className="menu-item active" id="menu-data">Data Sharing</div>
                            <div className="menu-item" id="menu-mypost">My Post</div>
                        </div>
                    </div>

                    {/* <!-- 메인 컨텐츠 --> */}
                    <div className="community-main">
                        <div id="community-feed-view">
                            <div className="community-title-section">
                                <h2>Latest Community</h2>
                                <p>다양한 질문과 정보를 나누며 커뮤니티를 즐겨보세요</p>
                            </div>

                            <div className="community-board-container">
                                <div className="community-feed">
                                    <div className="feed-card">
                                        <div className="feed-header">
                                            <div className="feed-user-info">
                                                <div className="feed-user-avatar"></div>
                                                <span className="feed-user-name">수학 고민러</span>
                                            </div>
                                            <div className="feed-meta">
                                                <span className="like-count">♡ 34</span>
                                                <span className="comment-count">💬 17</span>
                                            </div>
                                        </div>
                                        <div className="feed-content">
                                            <h3>미적분 문제 질문이요!</h3>
                                            <p>치환적분 문제인데 도와주세요</p>
                                        </div>
                                    </div>

                                    <div className="feed-card">
                                        <div className="feed-header">
                                            <div className="feed-user-info">
                                                <div className="feed-user-avatar"></div>
                                                <span className="feed-user-name">공부병아리</span>
                                            </div>
                                            <div className="feed-meta">
                                                <span className="like-count">♡ 10</span>
                                                <span className="comment-count">💬 15</span>
                                            </div>
                                        </div>
                                        <div className="feed-content">
                                            <h3>기말고사 계획 도와주세요</h3>
                                            <p>전교 1등이 기말고사 계획 도와주세요!</p>
                                        </div>
                                    </div>

                                    <div className="feed-card">
                                        <div className="feed-header">
                                            <div className="feed-user-info">
                                                <div className="feed-user-avatar"></div>
                                                <span className="feed-user-name">역사 덕후</span>
                                            </div>
                                            <div className="feed-meta">
                                                <span className="like-count">♡ 24</span>
                                                <span className="comment-count">💬 9</span>
                                            </div>
                                        </div>
                                        <div className="feed-content">
                                            <h3>한국사 정리 노트 공유</h3>
                                            <p>시대별로 정리한 한국사 노트 공유해요~</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="community-board-sidebar">
                                    <button className="btn-new-post">New Post</button>
                                </div>
                            </div>
                        </div>
                        <div id="post-detail-view" className="hidden">
                            <div className="post-detail-board">
                                <div className="pd-header">
                                    <div className="pd-header-top" style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px;">
                                        <h2 className="pd-title" style="margin: 0; font-size: 32px; font-weight: 700; color: #000;">제목</h2>
                                        <button className="close-detail-text-btn" style="background: none; border: none; color: #999; font-size: 24px; cursor: pointer;">×</button>
                                    </div>

                                    <div className="pd-meta-row" style="border: none; padding: 0;">
                                        <div className="pd-user-info">
                                            <div className="pd-avatar"></div>
                                            <div className="pd-user-text">
                                                <span className="pd-username">작성자</span>
                                                <span className="pd-date-view">2025.12.29 12:15 조회수 0</span>
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

                                <div className="pd-divider" style="height: 1px; background: #eee; margin: 30px 0;"></div>

                                <div className="pd-body">
                                    <div className="pd-content">내용</div>
                                </div>

                                <div className="pd-divider" style="height: 1px; background: #eee; margin: 40px 0;"></div>

                                <div className="pd-comments-section">
                                    <div className="comment-input-area" style="border: 2px solid #ddd; border-radius: 16px; padding: 8px 10px 8px 24px; margin-bottom: 40px; display: flex; align-items: center; justify-content: space-between; background-color: #fff; transition: border-color 0.2s;">
                                        <input type="text" placeholder="댓글 추가..." className="comment-input" style="border: none; padding: 12px 0; font-size: 15px; width: 100%; outline: none; background: transparent;" />
                                        <button className="comment-submit-btn" style="background: #176B5F; color: white; padding: 10px 26px; border-radius: 12px; font-weight: 700; flex-shrink: 0; margin-left: 15px; border: none; cursor: pointer; font-size: 14px; box-shadow: 0 4px 10px rgba(23, 107, 95, 0.2);">등록</button>
                                    </div>
                                    <div className="comments-list">
                                        {/* <!-- Comments will be injected here --> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
  );
}
export default Community;