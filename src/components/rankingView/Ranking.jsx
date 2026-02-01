function Ranking() {
    return (

        <div id="ranking-view" className="ranking-view">
            <div className="ranking-header-section">
                {/* {/* 2등 */}
                <div className="rank-card rank-2">
                    <div className="rank-icon-wrapper">
                        <img src="img/2위.png" alt="2위" className="rank-img" />
                    </div>
                    <div className="rank-user-name">박현서</div>
                    <div className="rank-user-label">점수</div>
                    <div className="rank-user-score">1,998</div>
                </div>
                {/* {/* 1등 */}
                <div className="rank-card rank-1">
                    <div className="rank-icon-wrapper">
                        <img src="img/1위.png" alt="1위" className="rank-img" />
                    </div>
                    <div className="rank-user-name">김예선</div>
                    <div className="rank-user-label">점수</div>
                    <div className="rank-user-score">3,447</div>
                </div>
                {/* {/* 3등 */}
                <div className="rank-card rank-3">
                    <div className="rank-icon-wrapper">
                        <img src="img/3위.png" alt="3위" className="rank-img" />
                    </div>
                    <div className="rank-user-name">유태민</div>
                    <div className="rank-user-label">점수</div>
                    <div className="rank-user-score">1,358</div>
                </div>
            </div>

            <div className="ranking-list-container">
                <div className="ranking-search-bar">
                    <input type="text" placeholder="Your name" />
                    <button className="ranking-search-btn">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    </button>
                </div>

                <div className="ranking-grid-list">
                    {/* {/* 4등 */}
                    <div className="ranking-list-item">
                        <div className="r-left"><span className="r-rank">4</span> <span className="r-name">신유빈</span></div>
                        <div className="r-right"><span className="r-label">점수</span> <span className="r-score">985</span></div>
                    </div>
                </div>
                {/* {/* Scrollbar track visual */}
                <div className="custom-scroll-track"></div>
            </div>
        </div>
    );
};
export default Ranking;