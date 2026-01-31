import { useEffect, useState } from 'react';
import GiveUpModal from './modal/GiveUpModal';
import FinalGiveUpModal from './modal/FinalGiveUpModal';
import CommunityRewardModal from './modal/CommunityRewardModal';

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

            {/* <!-- 푸터 영역: 이용약관, 고객센터, SNS 링크 등 --> */}
            <Footer/>

            {/* <!-- 전체 챌린지 뷰: 모든 챌린지 목록 표시 --> */}
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

            {/* <!-- 진행중인 챌린지 뷰: 사용자가 참여 중인 챌린지만 표시 --> */}
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
            <ChallengeDetailView/>

            {/* <!-- 새로운 챌린지 생성 모달: 이름, 기간, 목표 등 입력 --> */}
            <CreateChallengeModal/>
            {/* <!-- 챌린지 수정 모달: 기존 챌린지 정보 수정 --> */}
            <EditChallengeModal/>
            
            {/* <!-- 챌린지 포기 확인 모달 (1단계): 포기 여부 확인 --> */}
            <GiveUpModal/>

            {/* <!-- 챌린지 최종 포기 확인 모달 (2단계): 명언과 함께 최종 확인 --> */}
           <FinalGiveUpModal/>

            {/* <!-- 커스텀 알림 모달: 일반적인 알림 메시지 표시 --> */}
            <CustomAlertModal/>

            {/* <!-- 챌린지 완료 모달: 최종 점수 입력 및 순위 표시 --> */}
            <ChallengeOverModal/>

            {/* <!-- New Post Modal (Notice Board) --> */}
            <NewPostModal/>

            {/* <!-- 커스텀 confirm/prompt 모달 --> */}
            <CommunityRewardModal/>

            <CommunityRewardModal/>

           <CustomPromptModal/>
        </>
    );
};
export default Posts;