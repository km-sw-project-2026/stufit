function Challenge() {
  return(
    <>
    <div id="challenge-modal" className="modal hidden">
                <div className="modal-content">
                    <div className="ongoing-challenge-link">
                        <a href="#" id="go-to-ongoing-challenges">진행중인 챌린지 보러가기 →</a>
                    </div>
                    <div className="modal-header-top">
                        <div className="header-left">
                            <h2>전체 챌린지</h2>
                            <div className="search-bar">
                                <input type="text" id="all-challenge-code-input" placeholder="Enter code" />
                                <button className="search-icon" id="all-challenge-code-btn">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="11" cy="11" r="8"></circle>
                                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div className="header-right">
                            <button className="create-challenge-btn">챌린지 만들기</button>
                        </div>
                    </div>

                    <div className="challenge-grid">
                        {/* Challenges will be added here */} 
                    </div>
                </div>
            </div>

            {/* 진행중인 챌린지 모달: 사용자가 참여한 챌린지 목록 표시 */} 
            <div id="ongoing-challenge-modal" className="modal hidden">
                <div className="modal-content">
                    <div className="ongoing-challenge-link">
                        <a href="#" id="back-to-all-challenges">챌린지 전체보기 →</a>
                    </div>
                    <div className="modal-header-top">
                        <div className="header-left">
                            <h2>진행중인 챌린지</h2>
                            <div className="search-bar">
                                <input type="text" id="ongoing-challenge-code-input" placeholder="Enter code" />
                                <button className="search-icon" id="ongoing-challenge-code-btn">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="11" cy="11" r="8"></circle>
                                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div className="header-right">
                            <button className="create-challenge-btn">챌린지 만들기</button>
                        </div>
                    </div>

                    <div className="challenge-grid">
                        {/* User created challenges will appear here */} 
                    </div>
                </div>
            </div>

            {/* 챌린지 상세보기 모달: 진행도, 목표, 참여현황 표시 */} 
            <div id="challenge-detail-view" className="modal hidden">
                <div className="detail-view-container">

                    <div className="detail-sidebar">
                        <h2>MEMBER</h2>
                        <div className="member-list">
                            <div className="member-item">
                                <div className="member-avatar">
                                    <img src="img/Profile.png" alt="Profile" />
                                </div>
                                <span className="member-name">김예선</span>
                            </div>
                            <div className="member-item">
                                <div className="member-avatar">
                                    <img src="img/Profile.png" alt="Profile" />
                                </div>
                                <span className="member-name">유태민</span>
                            </div>
                            <div className="member-item">
                                <div className="member-avatar">
                                    <img src="img/Profile.png" alt="Profile" />
                                </div>
                                <span className="member-name">이정민</span>
                            </div>
                            <div className="member-item">
                                <div className="member-avatar">
                                    <img src="img/Profile.png" alt="Profile" />
                                </div>
                                <span className="member-name">박현서</span>
                            </div>
                        </div>
                    </div>


                    <div className="detail-main">
                        <button className="close-detail-btn">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>

                        <div className="detail-card">
                            <h3>챌린지 진행도</h3>
                            <div className="progress-area">
                                <div className="progress-info">
                                    <span className="days-elapsed">0일 경과</span>
                                    <span className="percentage">50%</span>
                                    <span className="days-left">30일 남음</span>
                                </div>
                                <div className="progress-bar-bg">
                                    <div className="progress-bar-fill" style={{ width: '50%' }}></div>
                                </div>
                            </div>
                        </div>


                        <div className="detail-card">
                            <h3>챌린지 목표</h3>
                            <div className="goal-box">아침 6시 기상</div>
                            <button className="submit-btn">제출하기</button>
                        </div>


                        <div className="detail-card status-card">
                            <h3>참여 현황</h3>
                            <div className="status-grid">
                                <div className="status-item">
                                    <div className="status-user">
                                        <div className="status-avatar">
                                            <img src="img/Profile.png" alt="Profile" />
                                        </div>
                                        <span>김예선</span>
                                    </div>
                                    <span className="status-label success">인증 완료</span>
                                </div>
                                <div className="status-item">
                                    <div className="status-user">
                                        <div className="status-avatar">
                                            <img src="img/Profile.png" alt="Profile" />
                                        </div>
                                        <span>이정민</span>
                                    </div>
                                    <span className="status-label danger">미제출</span>
                                </div>
                                <div className="status-item">
                                    <div className="status-user">
                                        <div className="status-avatar">
                                            <img src="img/Profile.png" alt="Profile" />
                                        </div>
                                        <span>이정민</span>
                                    </div>
                                    <span className="status-label danger">미제출</span>
                                </div>

                                <div className="status-item">
                                    <div className="status-user">
                                        <div className="status-avatar">
                                            <img src="img/Profile.png" alt="Profile" />
                                        </div>
                                        <span>유태민</span>
                                    </div>
                                    <span className="status-label success">인증 완료</span>
                                </div>
                                <div className="status-item">
                                    <div className="status-user">
                                        <div className="status-avatar">
                                            <img src="img/Profile.png" alt="Profile" />
                                        </div>
                                        <span>박현서</span>
                                    </div>
                                    <span className="status-label warning">인증 실패</span>
                                </div>
                                <div className="status-item">
                                    <div className="status-user">
                                        <div className="status-avatar">
                                            <img src="img/Profile.png" alt="Profile" />
                                        </div>
                                        <span>박현서</span>
                                    </div>
                                    <span className="status-label warning">인증 실패</span>
                                </div>
                            </div>
                        </div>

                        <div className="detail-actions">
                            <button className="btn-giveup">give up</button>
                            <button className="btn-complete">complete</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* 새로운 챌린지 생성 모달: 이름, 기간, 목표 등 입력 */} 
            <div id="create-challenge-modal" className="popup-modal hidden">
                <div className="popup-overlay"></div>
                <div className="popup-content">
                    <div className="form-group">
                        <label>챌린지 이름</label>
                        <input type="text" id="new-challenge-name" placeholder="예: 기말고사 성적내기" />
                    </div>
                    <div className="form-group">
                        <label>내 이름</label>
                        <input type="text" id="new-challenge-user" placeholder="예: 김예선" />
                    </div>
                    <div className="form-row">
                        <div className="form-group half">
                            <label>기간 (일)</label>
                            <input type="number" id="new-challenge-duration" placeholder="예: 30" />
                        </div>
                        <div className="form-group half">
                            <label>카테고리</label>
                            <div className="select-wrapper">
                                <select id="new-challenge-category" defaultValue="">
                                    <option value="" disabled>예: 공부</option>
                                    <option value="study">공부</option>
                                    <option value="exercise">운동</option>
                                    <option value="daily">일상</option>
                                </select>
                                <div className="select-arrow">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="form-group">
                        <label>목표</label>
                        <input type="text" id="new-challenge-goal" placeholder="예: 아침 6시 기상" />
                    </div>
                    <div className="form-group">
                        <label>코드 입력 (선택)</label>
                        <input type="text" id="new-challenge-code" placeholder="예: KIM" />
                    </div>
                    <button className="start-challenge-btn">챌린지 시작하기</button>
                </div>
            </div>

            {/* 챌린지 수정 모달: 기존 챌린지 정보 수정 */} 
            <div id="edit-challenge-modal" className="popup-modal hidden">
                <div className="popup-overlay"></div>
                <div className="popup-content">
                    <div className="form-group">
                        <label>챌린지 이름</label>
                        <input type="text" id="edit-challenge-name" placeholder="예: 기말고사 성적내기" />
                    </div>
                    <div className="form-group">
                        <label>내 이름</label>
                        <input type="text" id="edit-challenge-user" placeholder="예: 김예선" />
                    </div>
                    <div className="form-row">
                        <div className="form-group half">
                            <label>기간 (일)</label>
                            <input type="number" id="edit-challenge-duration" placeholder="30" />
                        </div>
                        <div className="form-group half">
                            <label>카테고리</label>
                            <div className="select-wrapper">
                                <select id="edit-challenge-category" defaultValue="">
                                    <option value="" disabled>예: 공부</option>
                                    <option value="study">공부</option>
                                    <option value="exercise">운동</option>
                                    <option value="daily">일상</option>
                                </select>
                                <div className="select-arrow">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="form-group">
                        <label>목표</label>
                        <input type="text" id="edit-challenge-goal" placeholder="예: 아침 6시 기상" />
                    </div>
                    <div className="form-group">
                        <label>코드 입력 (선택)</label>
                        <input type="text" id="edit-challenge-code" placeholder="예: KIM" />
                    </div>
                    <button className="update-challenge-btn start-challenge-btn">수정 완료하기</button>
                </div>
            </div>
            
            {/* 챌린지 포기 확인 모달 (1단계): 포기 여부 확인 */} 
            <div id="give-up-modal" className="popup-modal hidden">
                <div className="popup-overlay"></div>
                <div className="popup-content confirm-modal-content">
                    <div className="confirm-text-area">
                        <h3 className="confirm-title">챌린지가 완료되지 않았습니다</h3>
                        <p className="confirm-subtitle">챌린지를 포기하시겠습니까?</p>
                        <p className="confirm-desc">나중에 이어서 불가능 합니다.</p>
                    </div>
                    <div className="confirm-buttons">
                        <button className="confirm-btn cancel">취소</button>
                        <button className="confirm-btn giveup">포기하기</button>
                    </div>
                </div>
            </div>

            {/* 챌린지 최종 포기 확인 모달 (2단계): 명언과 함께 최종 확인 */} 
            <div id="final-give-up-modal" className="popup-modal hidden">
                <div className="popup-overlay"></div>
                <div className="popup-content confirm-modal-content">
                    <div className="confirm-text-area">
                        <h3 className="confirm-title" style={{ wordBreak: 'keep-all', lineHeight: 1.4, marginBottom: '20px' }}>끝까지 가보지 못한다면 '안 되는 이유'를<br />말할 자격이 없다</h3>
                        <p className="confirm-subtitle" style={{ color: 'grey', fontSize: '0.9rem', marginBottom: '30px', fontWeight: 'normal' }}>-챗지피티-</p>
                        <p className="confirm-subtitle" style={{ marginTop: 0 }}>챌린지를 포기하시겠습니까?</p>
                    </div>
                    <div className="confirm-buttons">
                        <button className="confirm-btn cancel">취소</button>
                        <button className="confirm-btn real-giveup">정말 포기하기</button>
                    </div>
                </div>
            </div>

            {/* 커스텀 알림 모달: 일반적인 알림 메시지 표시 */} 
            <div id="custom-alert-modal" className="popup-modal hidden">
                <div className="popup-overlay"></div>
                <div className="popup-content" style={{ width: '400px', textAlign: 'center', padding: '40px' }}>
                    <p id="custom-alert-text" style={{marginBottom: '25px', fontSize: '1.1rem', color: '#333', lineHeight: 1.5, fontWeight: 500}}></p>
                    <button id="custom-alert-close" className="start-challenge-btn" style={{ width: '120px', margin: '0 auto', padding: '12px' }}>확인</button>
                </div>
            </div>

            {/* 챌린지 완료 모달: 최종 점수 입력 및 순위 표시 */} 
            <div id="challenge-over-modal" className="popup-modal hidden">
                <div className="popup-overlay"></div>
                <div className="popup-content challenge-over-content">
                    <h2>Challenge Over</h2>

                    <div id="challenge-over-score-view">
                        <p className="subtitle">최종 점수입력</p>
                        <div className="score-card">
                            <p className="score-input-label">점수 입력하기</p>
                            <input type="number" id="challenge-score-input" placeholder="예: 80" />
                            <button className="confirm-score-btn">제출하기</button>
                        </div>
                    </div>

                    <div id="challenge-over-ranking-view" className="hidden">
                        <p className="subtitle">최종순위</p>
                        <div className="ranking-list">
                            {/* Dynamic Content */} 
                        </div>
                    </div>

                    <div className="close-btn-wrapper position-top-right">
                        <svg className="close-challenge-over-x" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 6L6 18M6 6L18 18" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                </div>
            </div>
    </>
  );
};
export default Challenge;

