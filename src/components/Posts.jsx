import { useEffect, useState } from 'react';
import Attendance from './attendanceSection/attendance';
import Challenge from './challengeView/challenge';
import Community from './communityView/community';

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
            <h1>test</h1>
        </>
    );
    return (
        <>
            <div className="header">
                {/* <!-- 로고 이미지 영역 (클릭 시 메인 페이지로 이동) --> */}
                <div className="logo">
                    <img src="img/logo.png" alt="Stufit Logo" />
                </div>
                {/* <!-- 메인 네비게이션 메뉴: 출석체크, 챌린지, 랭킹 등 --> */}
                <div className="nav">
                    <a href="#" id="attendance-link">출석체크</a>
                    <a href="#" id="challenge-link">챌린지</a>
                    <a href="#" id="ranking-link">랭킹</a>
                    <a href="#" id="community-link">커뮤니티</a>
                    <a href="#">상점</a>
                </div>
                {/* <!-- 사용자 인증 영역: 로그인 및 회원가입 링크 --> */}
                <div className="auth">
                    <a href="#" id="login-link">로그인</a> | <a href="#" id="signup-link">회원가입</a>
                </div>
            </div>

            {/* <!-- 전체 페이지를 감싸는 컨테이너 --> */}
            <div className="wrap">
                {/* <!-- 메인 히어로 섹션: 서비스 소개 및 슬로건 표시 --> */}
                <div className="main">
                    <h1>게임처럼 경쟁하고 보상을 얻으며<br />꾸준히 자기개발</h1>
                    <p>학습 커뮤니티에서 공부 이야기를 나누고, 함께 챌린지에<br />도전해 목표를 완주해 보세요.</p>
                </div>
                <Attendance />
                {/* <!-- 챌린지 바로가기 섹션: 챌린지 페이지로 이동하는 배너 --> */}
                <div className="challenge-quicklink">
                    <div className="challenge-quicklink-inner">
                        <div className="stufit-logo">STUFIT</div>
                        <h2 data-text="Join The Challenge Now"></h2>
                        <p>여러가지 챌린지를 만들어 친구들과 경쟁하세요!</p>
                        <button>바로가기</button>
                    </div>
                </div>
                {/* <!-- 개인 랭킹 섹션: 상위 10명의 랭킹 표시 --> */}
                <div className="ranking-quicklink">
                    <h2 className="ranking-quicklink-title">Personal<br />Ranking</h2>
                    <div className="ranking-quicklink-container">
                        <div className="ranking-quicklink-arrow">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                                <polyline points="12 5 19 12 12 19"></polyline>
                            </svg>
                        </div>
                        <div className="ranking-quicklink-list left">
                            <div className="quick-rank-card">
                                <div className="rank-num">1</div>
                                <div className="rank-profile">
                                    <div className="profile-img"></div>
                                    <span className="name">김예선</span>
                                </div>
                                <div className="rank-score">
                                    <span className="label">점수</span>
                                    <span className="value">4,893</span>
                                </div>
                            </div>
                            <div className="quick-rank-card">
                                <div className="rank-num">2</div>
                                <div className="rank-profile">
                                    <div className="profile-img"></div>
                                    <span className="name">유태민</span>
                                </div>
                                <div className="rank-score">
                                    <span className="label">점수</span>
                                    <span className="value">4,201</span>
                                </div>
                            </div>
                            <div className="quick-rank-card">
                                <div className="rank-num">3</div>
                                <div className="rank-profile">
                                    <div className="profile-img"></div>
                                    <span className="name">이정민</span>
                                </div>
                                <div className="rank-score">
                                    <span className="label">점수</span>
                                    <span className="value">3,216</span>
                                </div>
                            </div>
                            <div className="quick-rank-card">
                                <div className="rank-num">4</div>
                                <div className="rank-profile">
                                    <div className="profile-img"></div>
                                    <span className="name">박현서</span>
                                </div>
                                <div className="rank-score">
                                    <span className="label">점수</span>
                                    <span className="value">3,142</span>
                                </div>
                            </div>
                            <div className="quick-rank-card">
                                <div className="rank-num">5</div>
                                <div className="rank-profile">
                                    <div className="profile-img"></div>
                                    <span className="name">유태민</span>
                                </div>
                                <div className="rank-score">
                                    <span className="label">점수</span>
                                    <span className="value">2,873</span>
                                </div>
                            </div>
                        </div>
                        <div className="ranking-quicklink-list right">
                            <div className="quick-rank-card">
                                <div className="rank-num">6</div>
                                <div className="rank-profile">
                                    <div className="profile-img"></div>
                                    <span className="name">김예선</span>
                                </div>
                                <div className="rank-score">
                                    <span className="label">점수</span>
                                    <span className="value">2,423</span>
                                </div>
                            </div>
                            <div className="quick-rank-card">
                                <div className="rank-num">7</div>
                                <div className="rank-profile">
                                    <div className="profile-img"></div>
                                    <span className="name">박현서</span>
                                </div>
                                <div className="rank-score">
                                    <span className="label">점수</span>
                                    <span className="value">2,213</span>
                                </div>
                            </div>
                            <div className="quick-rank-card">
                                <div className="rank-num">8</div>
                                <div className="rank-profile">
                                    <div className="profile-img"></div>
                                    <span className="name">이정민</span>
                                </div>
                                <div className="rank-score">
                                    <span className="label">점수</span>
                                    <span className="value">1,998</span>
                                </div>
                            </div>
                            <div className="quick-rank-card">
                                <div className="rank-num">9</div>
                                <div className="rank-profile">
                                    <div className="profile-img"></div>
                                    <span className="name">유태민</span>
                                </div>
                                <div className="rank-score">
                                    <span className="label">점수</span>
                                    <span className="value">1,873</span>
                                </div>
                            </div>
                            <div className="quick-rank-card">
                                <div className="rank-num">10</div>
                                <div className="rank-profile">
                                    <div className="profile-img"></div>
                                    <span className="name">김예선</span>
                                </div>
                                <div className="rank-score">
                                    <span className="label">점수</span>
                                    <span className="value">1,493</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <!-- 아이템 상점 섹션: 포인트로 구매 가능한 아이템 표시 --> */}
                <div className="shop-quicklink">
                    <div className="shop-header">
                        <h2>Item Shop</h2>
                        <p>포인트를 모아서 여러가지 아이템을 구매하세요!</p>
                    </div>

                    <div className="shop-content">
                        <a href="#" className="shop-more-link">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#222" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <path d="M12 8l4 4-4 4M8 12h8"></path>
                            </svg>
                        </a>
                        {/* <!-- 아이템 슬라이더 컨테이너 (좌우 버튼으로 탐색 가능) --> */}
                        <div className="shop-slider-container">
                            <button className="shop-nav prev">
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#222" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                            </button>

                            <div className="shop-items-wrapper">
                                <div className="shop-item small">
                                    <div className="item-circle" style="background-color: #fce4ec; border: 2px dashed #f48fb1;"></div>
                                </div>
                                <div className="shop-item medium">
                                    <div className="item-circle" style="background-color: #e0f2f1; border: 1px solid #ddd;"></div>
                                </div>
                                <div className="shop-item active">
                                    <div className="item-circle rudolph-frame">
                                        <div className="rudolph-antlers"></div>
                                    </div>
                                    <div className="active-indicator-dot"></div>
                                </div>
                                <div className="shop-item medium">
                                    <div className="item-circle" style="background-color: #fff3e0; border: 1px solid #ddd;"></div>
                                </div>
                                <div className="shop-item small">
                                    <div className="item-circle" style="background-color: #e3f2fd; border: 1px solid #bbdefb;"></div>
                                </div>
                            </div>

                            <button className="shop-nav next">
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#222" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                            </button>
                        </div>

                        <div className="shop-item-info">
                            <div className="shop-badge">프로필 액자</div>
                            <div className="shop-name">귀여운 루돌프 머리띠</div>
                            <div className="shop-price">3,000 P</div>
                        </div>

                        <div className="shop-pagination">
                            <span className="dot"></span>
                            <span className="dot"></span>
                            <span className="dot active"></span>
                            <span className="dot"></span>
                            <span className="dot"></span>
                            <span className="dot"></span>
                            <span className="dot"></span>
                            <span className="dot"></span>
                        </div>
                    </div>
                </div>
                {/* <!-- 최신 커뮤니티 게시글 섹션: 인기글 및 최신 게시물 표시 --> */}
                <div className="community-quicklink">
                    <div className="community-header">
                        <div className="header-titles">
                            <h2>Latest<br />Community</h2>
                            <p>인기 글에 등록되어 포인트를 노리세요!</p>
                        </div>
                    </div>

                    <div className="community-container">
                        <div className="community-nav-row">
                            <a href="#" className="community-more">바로가기 <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg></a>
                        </div>
                        {/* <!-- 커뮤니티 게시글 카드 그리드 (Q&A, TIP, 자료공유 등) --> */}
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
            </div>

            {/* <!-- 로그인 화면 섹션 (초기에는 숨김) --> */}
            <div id="login-view" className="login-view hidden">
                <div className="login-container-view">
                    <div className="input-group">
                        <label for="login-id-view">아이디</label>
                        <input type="text" id="login-id-view" placeholder="아이디를 입력해주세요." />
                    </div>
                    <div className="input-group">
                        <label for="login-pw-view">비밀번호</label>
                        <input type="password" id="login-pw-view" placeholder="비밀번호를 입력해주세요." />
                    </div>
                    <div className="button-group">
                        <button className="login-btn">로그인</button>
                        <button className="signup-btn">회원가입</button>
                    </div>
                    <div className="login-footer-links">
                        <a href="#">아이디 찾기</a>
                        <a href="#">비밀번호 찾기</a>
                    </div>
                </div>
            </div>

            {/* <!-- 회원가입 화면 섹션 --> */}
            <div id="signup-view" className="login-view hidden">
                <div className="login-container-view">
                    <div className="input-group">
                        <label for="signup-id-view">아이디</label>
                        <input type="text" id="signup-id-view" placeholder="아이디를 입력해주세요." />
                    </div>
                    <div className="input-group">
                        <label for="signup-pw-view">비밀번호</label>
                        <input type="password" id="signup-pw-view" placeholder="비밀번호를 입력해주세요." />
                    </div>
                    <div className="input-group">
                        <label for="signup-pw-confirm-view">비밀번호 확인</label>
                        <input type="password" id="signup-pw-confirm-view" placeholder="비밀번호를 다시 입력해주세요." />
                    </div>
                    <div className="button-group">
                        <button className="login-btn">회원가입</button>
                    </div>
                </div>
            </div>

            {/* <!-- 랭킹 화면 섹션 --> */}
            <div id="ranking-view" className="ranking-view hidden">
                <div className="ranking-header-section">
                    {/* <!-- 2등 --> */}
                    <div className="rank-card rank-2">
                        <div className="rank-icon-wrapper">
                            <img src="img/2위.png" alt="2위" className="rank-img" />
                        </div>
                        <div className="rank-user-name">박현서</div>
                        <div className="rank-user-label">점수</div>
                        <div className="rank-user-score">1,998</div>
                    </div>
                    {/* <!-- 1등 --> */}
                    <div className="rank-card rank-1">
                        <div className="rank-icon-wrapper">
                            <img src="img/1위.png" alt="1위" className="rank-img" />
                        </div>
                        <div className="rank-user-name">김예선</div>
                        <div className="rank-user-label">점수</div>
                        <div className="rank-user-score">3,447</div>
                    </div>
                    {/* <!-- 3등 --> */}
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
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        </button>
                    </div>

                    <div className="ranking-grid-list">
                        {/* <!-- 4등 --> */}
                        <div className="ranking-list-item">
                            <div className="r-left"><span className="r-rank">4</span> <span className="r-name">신유빈</span></div>
                            <div className="r-right"><span className="r-label">점수</span> <span className="r-score">985</span></div>
                        </div>
                    </div>
                    {/* <!-- Scrollbar track visual --> */}
                    <div className="custom-scroll-track"></div>
                </div>
            </div>

            {/* <!-- 커뮤니티 화면 섹션 --> */}
            <Community />

            {/* <!-- 푸터 영역: 이용약관, 고객센터, SNS 링크 등 --> */}
            <div className="footer">
                <div className="footer-content">
                    <div className="footer-links">
                        <a href="#">이용약관</a>
                        <a href="#" className="bold">개인정보</a>
                        <a href="#">처리방침</a>
                        <a href="#" className="bold">고객센터</a>
                        <a href="#">문의하기</a>
                        <a href="#">광고 상품 안내</a>
                    </div>
                    <div className="footer-info">
                        근명고등학교: 경기도 안양시 만안구 삼덕로 49 : 평일 9시~18시(<a href="tel:1566-5192">1566-5192</a>)
                    </div>
                </div>
                <div className="footer-social">
                    <a href="#" className="social-icon talk">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="white" stroke="none">
                            <path d="M12 2C6.48 2 2 5.58 2 10c0 2.42 1.45 4.56 3.69 6l-.68 3.5c-.09.43.34.78.74.58l3.6-1.8C10.23 18.25 11.11 18.29 12 18.29c5.52 0 10-3.58 10-8s-4.48-8-10-8z" />
                            <text x="12" y="11.5" font-family="Arial" font-size="6" fill="#666" text-anchor="middle" font-weight="bold">TALK</text>
                        </svg>
                    </a>
                    <a href="#" className="social-icon insta">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                        </svg>
                    </a>
                </div>
            </div>

            {/* <!-- 전체 챌린지 모달: 모든 챌린지 목록 표시 --> */}
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
                </div>m
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