import { useEffect, useState } from 'react';
import GiveUpModal from './modal/GiveUpModal';
import FinalGiveUpModal from './modal/FinalGiveUpModal';
import CommunityRewardModal from './modal/CommunityRewardModal';
import Footer from './main/Footer';
import Header from './main/Header';
import Login from './main/login';
import Signup from './main/Signup';
import CommunityQuicklink from './main/CommunityQuicklink';
import Mainpage from './main/mainpage';
import Attendance from './attendanceSection/Attendance';
import Challenge from './challengeView/Challenge';
import Community from './communityView/Community';
import Shop from './shopView/Shop';
import Ranking from './rankingView/Ranking';
import ShopQuicklink from './main/ShopQuicklink';
import RankingQuicklink from './main/RankingQuicklink';
import CustomAlertModal from './modal/CustomAlertModal';
import ChallengeOverModal from './modal/ChallengeOverModal';
import CreateChallengeModal from './modal/CreateChallengeModal';
import ChallengeDetailView from './modal/ChallengeDetailView';
import EditChallengeModal from './modal/EditChallengeModal';
import NewPostModal from './modal/NewPostModal';
import CustomPromptModal from './modal/CustomPromptModal';
import CustomConfirmModal from './modal/CustomConfirmModal';
import ChallengeQuicklink from './main/ChallengeQuicklink';

const Posts = () => {
    const [posts, setPosts] = useState([]);
    useEffect(() => {
        const getPosts = async () => {
            try {
                const resp = await fetch('/api/posts');
                if (!resp.ok) {
                    console.error('Failed to fetch posts', resp.status);
                    setPosts([]);
                    return;
                }
                const postsResp = await resp.json();
                setPosts(postsResp);
            } catch (err) {
                console.error('Error fetching posts', err);
                setPosts([]);
            }
        }
        getPosts();
    }, []);
    return (
        <>
            <Header />

            {/* 전체 페이지를 감싸는 컨테이너 */}
            <div className="wrap">
                {/* 메인 히어로 섹션: 서비스 소개 및 슬로건 표시 */}
                <Mainpage />
                {/* 출석체크 섹션: 7일 연속 출석 시 포인트 지급 */}
                <div className="attendance-section hidden">
                    <div className="attendance-header">
                        <h1>출석체크</h1>
                        <p>7일 연속 출석시 400포인트 지급!</p>
                    </div>
                    <div className="attendance-container">
                        <div className="attendance-board">
                            {/* 일주일 요일 표시 (일요일부터 토요일까지) */}
                            <div className="attendance-days">
                                <span>SUN</span>
                                <span>MON</span>
                                <span>TUE</span>
                                <span>WED</span>
                                <span>THU</span>
                                <span>FRI</span>
                                <span>SAT</span>
                            </div>
                            {/* 각 요일별 출석체크 카드 (일일 포인트 표시) */}
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
                        {/* 연속 출석 일수 표시 */}
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
                {/* 챌린지 바로가기 섹션: 챌린지 페이지로 이동하는 배너 */}
                <ChallengeQuicklink />
                {/* 개인 랭킹 섹션: 상위 10명의 랭킹 표시 */}
                <RankingQuicklink />
                {/* 아이템 상점 섹션: 포인트로 구매 가능한 아이템 표시 */}
                <ShopQuicklink />
                <Shop />
                {/* 최신 커뮤니티 게시글 섹션: 인기글 및 최신 게시물 표시 */}
                <CommunityQuicklink />
            </div>
            {/* 로그인 화면 섹션 (초기에는 숨김) */}
            <Login />

            {/* 회원가입 화면 섹션 */}
            <Signup />

            {/* 랭킹 화면 섹션 */}
            <Ranking />

            {/* 커뮤니티 화면 섹션 */}
            <Community />

            {/* 푸터 영역: 이용약관, 고객센터, SNS 링크 등 */}
            <Footer />

            {/* 전체 챌린지 뷰: 모든 챌린지 목록 표시 */}
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

            {/* 진행중인 챌린지 뷰: 사용자가 참여 중인 챌린지만 표시 */}
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
            <ChallengeDetailView/>

            {/* 새로운 챌린지 생성 모달: 이름, 기간, 목표 등 입력 */}
            <CreateChallengeModal/>
            {/* 챌린지 수정 모달: 기존 챌린지 정보 수정 */}
            <EditChallengeModal/>
            
            {/* 챌린지 포기 확인 모달 (1단계): 포기 여부 확인 */}
            <GiveUpModal/>

            {/* 챌린지 최종 포기 확인 모달 (2단계): 명언과 함께 최종 확인 */}
           <FinalGiveUpModal/>

            {/* 커스텀 알림 모달: 일반적인 알림 메시지 표시 */}
            <CustomAlertModal/>

            {/* 챌린지 완료 모달: 최종 점수 입력 및 순위 표시 */}
            <ChallengeOverModal/>
            <Challenge />
            {/* New Post Modal (Notice Board) */}
            <NewPostModal/>

            {/* 커스텀 confirm/prompt 모달 */}
            <CommunityRewardModal/>

            <CustomPromptModal/>
            <CustomConfirmModal/>
        </>
    );
};
export default Posts;
