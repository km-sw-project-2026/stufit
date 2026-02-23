import { Link } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';

function  CommunityQuicklink() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPopularPosts = async () => {
            try {
                const username = localStorage.getItem('username');
                const headers = {};
                if (username) {
                    headers['X-Username'] = username;
                }

                const response = await fetch('/api/posts', { headers });
                if (!response.ok) {
                    setPosts([]);
                    return;
                }

                const payload = await response.json().catch(() => null);
                const list = Array.isArray(payload?.data) ? payload.data : [];
                setPosts(list);
            } catch (error) {
                console.error('인기글 불러오기 실패:', error);
                setPosts([]);
            }
        };

        fetchPopularPosts();
    }, []);

    const topPosts = useMemo(() => {
        return [...posts]
            .sort((a, b) => (Number(b?.like_count) || 0) - (Number(a?.like_count) || 0))
            .slice(0, 3);
    }, [posts]);

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
                    <Link to="/community" className="community-more">바로가기 <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg></Link>
                </div>
                {/* 커뮤니티 게시글 카드 그리드 (Q&A, TIP, 자료공유 등) */}
                <div className="community-cards-wrapper">
                    {topPosts.map((post) => (
                        <div className="comm-card" key={post.post_id || post.id}>
                            <div className="comm-tag-row">
                                <span className="comm-tag">{post.category || '커뮤니티'}</span>
                            </div>
                            <h3 className="comm-title">{post.title || '제목 없음'}</h3>
                            <p className="comm-desc">{post.content || '내용이 없습니다.'}</p>

                            <div className="comm-footer">
                                <div className="comm-user">
                                    <div className="comm-profile-icon"></div>
                                    <span className="comm-username">{post.username || '익명'}</span>
                                </div>
                                <div className="comm-stats">
                                    <div className="stat-item">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="#ccc" stroke="none"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                                        <span>{Number(post.comment_count) || 0}</span>
                                    </div>
                                    <div className="stat-item">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="#ccc" stroke="none"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                                        <span>{Number(post.like_count) || 0}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
export default CommunityQuicklink;