import { useEffect, useState } from 'react';
import Footer from './main/footer';
import Header from './main/header';
import Login from './main/login';
import Signup from './main/signup';
import CommunityQuicklink from './main/CommunityQuicklink';
import Mainpage from './main/mainpage';
import Attendance from './attendanceSection/Attendance';
import Challenge from './challengeView/Challenge';
import Community from './communityView/Community';
const Posts = () => {
    const [posts, setPosts] = useState([]);
    useEffect(() => {
        const getPosts = async () => {
            const resp = await fetch('/api/posts');
            const postsResp = await resp.json();
            setPosts(postsResp);
        }
        getPosts();
    }, []);
    return (
        <>
            {/* 헤더 영역 */}
            <Header />

            {/* <!-- 전체 페이지를 감싸는 컨테이너 --> */}
            <div className="wrap">
                {/* <!-- 메인 히어로 섹션: 서비스 소개 및 슬로건 표시 --> */}
                <Mainpage />
                {/* <!-- 출석체크 섹션: 7일 연속 출석 시 포인트 지급 --> */}
                <div className="attendance-section hidden">
                    <div className="attendance-header">
                        <h1>출석체크</h1>
                        <p>7일 연속 출석시 400포인트 지급!</p>
                    </div>
                    <div className="attendance-container">
                        <div className="attendance-board">
                            {/* <!-- 일주일 요일 표시 (일요일부터 토요일까지) --> */}
                            <div className="attendance-days">
                                <span>SUN</span>
                                <span>MON</span>
                                <span>TUE</span>
                                <span>WED</span>
                                <span>THU</span>
                                <span>FRI</span>
                                <span>SAT</span>
                            </div>
                            {/* <!-- 각 요일별 출석체크 카드 (일일 포인트 표시) --> */}
                            <div className="attendance-cards">
                                <div className="att-card">
                                    <span className="label">일일 포인트</span>
                                    <span className="point">100P</span>
                                </div>
                                <div className="att-card">
                                    <span className="label">일일 포인트</span>
                                    <span className="point">120P</span>
                                </div>
                                <div className="att-card">
                                    <span className="label">일일 포인트</span>
                                    <span className="point">140P</span>
                                </div>
                                <div className="att-card">
                                    <span className="label">일일 포인트</span>
                                    <span className="point">160P</span>
                                </div>
                                <div className="att-card">
                                    <span className="label">일일 포인트</span>
                                    <span className="point">180P</span>
                                </div>
                                <div className="att-card">
                                    <span className="label">일일 포인트</span>
                                    <span className="point">200P</span>
                                </div>
                                <div className="att-card">
                                    <span className="label">일일 포인트</span>
                                    <span className="point">220P</span>
                                </div>
                            </div>
                        </div>
                        {/* <!-- 연속 출석 일수 표시 --> */}
                        <div className="attendance-footer">
                            총 연속 출석체크일 수 : <span id="attendance-count">0</span>일
                        </div>
                    </div>
                </div>
                <div className="main">
                    <h1>게임처럼 경쟁하고 보상을 얻으며<br />꾸준히 자기개발</h1>
                    <p>학습 커뮤니티에서 공부 이야기를 나누고, 함께 챌린지에<br />도전해 목표를 완주해 보세요.</p>
                </div>
                <Attendance />
                {/* <!-- 챌린지 바로가기 섹션: 챌린지 페이지로 이동하는 배너 --> */}
                <ChallengeQuicklink />
                {/* <!-- 개인 랭킹 섹션: 상위 10명의 랭킹 표시 --> */}
                <RankingQuicklink />
                {/* <!-- 아이템 상점 섹션: 포인트로 구매 가능한 아이템 표시 --> */}
                <ShopQuicklink />
                <Shop />
                {/* <!-- 최신 커뮤니티 게시글 섹션: 인기글 및 최신 게시물 표시 --> */}
                <CommunityQuicklink />
            </div>
            {/* <!-- 로그인 화면 섹션 (초기에는 숨김) --> */}
            <Login />

            {/* <!-- 회원가입 화면 섹션 --> */}
            <Signup />

            {/* <!-- 랭킹 화면 섹션 --> */}
            <Ranking />

            {/* <!-- 커뮤니티 화면 섹션 --> */}
            <Community />

            {/* <!-- 푸터 영역: 이용약관, 고객센터, SNS 링크 등 --> */}
            <Footer />

            {/* <!-- 전체 챌린지 모달: 모든 챌린지 목록 표시 --> */}
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
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
                        {/* <!-- Challenges will be added here --> */}
                    </div>
                </div>
            </div>

            {/* <!-- 진행중인 챌린지 : 사용자가 참여 중인 챌린지만 표시 --> */}
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
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
                        {/* <!-- User created challenges will appear here --> */}
                    </div>
                </div>
            </div>

            {/* <!-- 챌린지 상세보기 모달: 진행도, 목표, 참여현황 표시 --> */}
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
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
                                    <div className="progress-bar-fill" style="width: 50%;"></div>
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

            {/* <!-- 새로운 챌린지 생성 모달: 이름, 기간, 목표 등 입력 --> */}
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
                                <select id="new-challenge-category">
                                    <option value="" disabled selected>예: 공부</option>
                                    <option value="study">공부</option>
                                    <option value="exercise">운동</option>
                                    <option value="daily">일상</option>
                                </select>
                                <div className="select-arrow">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
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

            {/* <!-- 챌린지 수정 모달: 기존 챌린지 정보 수정 --> */}
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
                                <select id="edit-challenge-category">
                                    <option value="" disabled selected>예: 공부</option>
                                    <option value="study">공부</option>
                                    <option value="exercise">운동</option>
                                    <option value="daily">일상</option>
                                </select>
                                <div className="select-arrow">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
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
            
            {/* <!-- 챌린지 포기 확인 모달 (1단계): 포기 여부 확인 --> */}
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

            {/* <!-- 챌린지 최종 포기 확인 모달 (2단계): 명언과 함께 최종 확인 --> */}
            <div id="final-give-up-modal" className="popup-modal hidden">
                <div className="popup-overlay"></div>
                <div className="popup-content confirm-modal-content">
                    <div className="confirm-text-area">
                        <h3 className="confirm-title" style="word-break: keep-all; line-height: 1.4; margin-bottom: 20px;">끝까지 가보지 못한다면 '안 되는 이유'를<br />말할 자격이 없다</h3>
                        <p className="confirm-subtitle" style="color: grey; font-size: 0.9rem; margin-bottom: 30px; font-weight: normal;">-챗지피티-</p>
                        <p className="confirm-subtitle" style="margin-top: 0;">챌린지를 포기하시겠습니까?</p>
                    </div>
                    <div className="confirm-buttons">
                        <button className="confirm-btn cancel">취소</button>
                        <button className="confirm-btn real-giveup">정말 포기하기</button>
                    </div>
                </div>
            </div>

            {/* <!-- 커스텀 알림 모달: 일반적인 알림 메시지 표시 --> */}
            <div id="custom-alert-modal" className="popup-modal hidden">
                <div className="popup-overlay"></div>
                <div className="popup-content" style="width: 400px; text-align: center; padding: 40px;">
                    <p id="custom-alert-text" style="margin-bottom: 25px; font-size: 1.1rem; color: #333; line-height: 1.5; font-weight: 500;"></p>
                    <button id="custom-alert-close" className="start-challenge-btn" style="width: 120px; margin: 0 auto; padding: 12px;">확인</button>
                </div>
            </div>

            {/* <!-- 챌린지 완료 모달: 최종 점수 입력 및 순위 표시 --> */}
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
                            {/* <!-- Dynamic Content --> */}
                        </div>
                    </div>

                    <div className="close-btn-wrapper position-top-right">
                        <svg className="close-challenge-over-x" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 6L6 18M6 6L18 18" stroke="#333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </div>
                </div>
            </div>
            <Challenge />
            {/* <!-- New Post Modal (Notice Board) --> */}
            <div id="new-post-modal" className="popup-modal hidden">
                <div className="popup-overlay w-full h-full bg-black bg-opacity-50 fixed top-0 left-0 z-50"></div>
                <div className="popup-content notice-board-popup">
                    <h2 className="notice-board-title">notice board</h2>

                    <div className="notice-form-group row">
                        <label>제목</label>
                        <input type="text" className="notice-input" placeholder="예: 제목 작성하기" />
                    </div>

                    <div className="notice-form-group row top-align">
                        <label>내용</label>
                        <textarea className="notice-textarea" placeholder="예: 내용을 입력하세요"></textarea>
                    </div>

                    <button className="notice-submit-btn">글 작성하기</button>
                </div>
            </div>

            <div id="community-reward-modal" className="popup-modal hidden">
                <div className="popup-overlay reward-overlay"></div>
                <div className="popup-content reward-popup">
                    <img src="img/logo.png" alt="Stufit" className="reward-logo-img" />
                    <h2 className="reward-title">커뮤니티 인기글 보상 안내</h2>
                    <p className="reward-desc">
                        인기글에 선정되시면<br />
                        <span className="highlight">300포인트</span>를 지급해드려요!
                    </p>
                    <div className="reward-check-row">
                        <input type="checkbox" id="dont-show-reward" />
                        <label for="dont-show-reward">오늘하루 그만보기</label>
                    </div>
                    <button className="reward-confirm-btn">확인</button>
                </div>
            </div>

            <div id="custom-confirm-modal" className="popup-modal hidden" style="z-index: 20000; display: flex; align-items: center; justify-content: center;">
                <div className="popup-overlay" style="background: rgba(0,0,0,0.4);"></div>
                <div className="popup-content custom-confirm-popup">
                    <p id="custom-confirm-msg" className="confirm-msg">메시지</p>
                    <div className="confirm-btn-row">
                        <button id="custom-confirm-cancel" className="confirm-btn-cancel">취소</button>
                        <button id="custom-confirm-ok" className="confirm-btn-ok">확인</button>
                    </div>
                </div>
            </div>

            <div id="custom-prompt-modal" className="popup-modal hidden" style="z-index: 20010; display: flex; align-items: center; justify-content: center;">
                <div className="popup-overlay" style="background: rgba(0,0,0,0.4);"></div>
                <div className="popup-content custom-prompt-popup">
                    <h3 id="custom-prompt-title" className="prompt-title">입력해주세요</h3>
                    <input type="text" id="custom-prompt-input" className="prompt-input" />
                    <div className="confirm-btn-row">
                        <button id="custom-prompt-cancel" className="confirm-btn-cancel">취소</button>
                        <button id="custom-prompt-ok" className="confirm-btn-ok">확인</button>
                    </div>
                </div>
            </div>
        </>
    );
};
export default Posts;