function  CommunityQuicklink() {
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
                    <a href="#" className="community-more">바로가기 <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg></a>
                </div>
                {/* 커뮤니티 게시글 카드 그리드 (Q&A, TIP, 자료공유 등) */}
                <div className="community-cards-wrapper">
                    <div className="comm-card">
                        <div className="comm-tag-row">
                            <span className="comm-tag">Q&A</span>
                        </div>
                        <h3 className="comm-title">미적분 문제 질문이요!</h3>
                        <p className="comm-desc">치환적분 문제인데 도와주세요</p>

                        <div className="comm-footer">
                            <div className="comm-user">
                                <div className="comm-profile-icon"></div>
                                <span className="comm-username">수학 고민러</span>
                            </div>
                            <div className="comm-stats">
                                <div className="stat-item">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#ccc" stroke="none"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                                    <span>13</span>
                                </div>
                                <div className="stat-item">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#ccc" stroke="none"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                                    <span>12</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="comm-card">
                        <div className="comm-tag-row">
                            <span className="comm-tag">TIP</span>
                        </div>
                        <h3 className="comm-title">기말고사 계획 도와주세요</h3>
                        <p className="comm-desc">전교 1등이 기말고사 계획 도와주세요!</p>

                        <div className="comm-footer">
                            <div className="comm-user">
                                <div className="comm-profile-icon"></div>
                                <span className="comm-username">공부천재</span>
                            </div>
                            <div className="comm-stats">
                                <div className="stat-item">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#ccc" stroke="none"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                                    <span>24</span>
                                </div>
                                <div className="stat-item">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#ccc" stroke="none"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                                    <span>9</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="comm-card">
                        <div className="comm-tag-row">
                            <span className="comm-tag">자료공유</span>
                        </div>
                        <h3 className="comm-title">한국사 정리 노트 공유</h3>
                        <p className="comm-desc">시대별로 정리한 한국사 노트 공유해요~</p>

                        <div className="comm-footer">
                            <div className="comm-user">
                                <div className="comm-profile-icon"></div>
                                <span className="comm-username">역사 덕후</span>
                            </div>
                            <div className="comm-stats">
                                <div className="stat-item">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#ccc" stroke="none"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default CommunityQuicklink;