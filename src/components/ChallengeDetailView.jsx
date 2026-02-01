import { useState } from "react";
import GiveUpModal from "./modal/GiveUpModal";
import FinalGiveUpModal from "./modal/FinalGiveUpModal";

function ChallengeDetailView() {
    const [modalOpen, setModalOpen] = useState(false);
    const [finalModalOpen, setFinalModalOpen] = useState(false);
    
    const giveupHandler = () => setModalOpen(true);

    return (
        <>
            <div id="challenge-detail-view" className="modal">
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
                            <button className="btn-giveup" onClick={giveupHandler}>give up</button>
                            <button className="btn-complete">complete</button>
                        </div>
                    </div>
                </div>
            </div>

            {modalOpen && <GiveUpModal setModalOpen={setModalOpen} setFinalModalOpen={setFinalModalOpen} />}
            {finalModalOpen && <FinalGiveUpModal setModalOpen={setFinalModalOpen} />}
        </>
    );
};
export default ChallengeDetailView;