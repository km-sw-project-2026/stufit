import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

function ShopQuicklink () {
    const navigate = useNavigate();

    // Collect available images from assets folder and pick up to 5
    const modules = import.meta.glob('../../assets/shop-items/*.{png,jpg,jpeg,gif}', { eager: true, as: 'url' }) || {};
    const allImages = Object.values(modules);
    const images = allImages.slice(0, 5);
    while (images.length < 5) images.push('/img/Profile2.png');

    // Debug: report what images were found (non-sensitive)
    useEffect(() => {
        try {
            console.debug('ShopQuicklink images:', images);
        } catch (e) {}
    }, [images]);

    const [index, setIndex] = useState(0);

    // Keyboard navigation
    useEffect(() => {
        const onKey = (e) => {
            if (e.key === 'ArrowLeft') setIndex(i => (i - 1 + images.length) % images.length);
            if (e.key === 'ArrowRight') setIndex(i => (i + 1) % images.length);
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [images.length]);

    const prev = () => setIndex(i => (i - 1 + images.length) % images.length);
    const next = () => setIndex(i => (i + 1) % images.length);

    return (
        <div className="shop-quicklink">
            <div className="shop-header">
                <h2>Item Shop</h2>
                <p>포인트를 모아서 여러가지 아이템을 구매하세요!</p>
            </div>

            <div className="shop-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <a href="#" className="shop-more-link" onClick={(e) => { e.preventDefault(); navigate('/shop'); }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#222" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="M12 8l4 4-4 4M8 12h8"></path>
                    </svg>
                </a>

                <div className="shop-slider-container" style={{ display: 'flex', alignItems: 'center', gap: 24, marginTop: 12 }}>
                    <button type="button" className="shop-nav prev" onClick={prev} aria-label="previous" style={{ background: 'transparent', border: 'none', cursor: 'pointer', position: 'relative', zIndex: 20 }}>
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#222" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                    </button>

                    <div className="shop-items-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '700px', height: '260px', overflow: 'hidden', position: 'relative' }}>
                        {images.map((src, i) => {
                            const pos = ((i - index) + images.length) % images.length; // position relative to center
                            // determine size based on distance to center (center, near, far)
                            let size = 80;
                            let zIndex = 1;
                            let opacity = 0.6;
                            if (i === index) { size = 220; zIndex = 3; opacity = 1; }
                            else if (pos === 1 || pos === images.length - 1) { size = 130; zIndex = 2; opacity = 0.9; }

                            return (
                                <div key={i} onClick={() => setIndex(i)} style={{
                                    width: size,
                                    height: size,
                                    borderRadius: '50%',
                                    overflow: 'hidden',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 300ms ease',
                                    transform: 'translateY(0)',
                                    boxShadow: i === index ? '0 10px 30px rgba(0,0,0,0.15)' : 'none',
                                    zIndex,
                                    opacity,
                                    margin: '0 8px',
                                    background: '#fff'
                                }}>
                                    <img src={src} alt={`item-${i}`} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} onError={(e)=>{ e.currentTarget.src = '/img/Profile2.png'; }} />
                                </div>
                            );
                        })}
                    </div>

                    <button type="button" className="shop-nav next" onClick={next} aria-label="next" style={{ background: 'transparent', border: 'none', cursor: 'pointer', position: 'relative', zIndex: 20 }}>
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#222" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </button>
                </div>

                <div className="shop-item-info" style={{ textAlign: 'center', marginTop: 16 }}>
                    <div className="shop-badge">프로필 액자</div>
                    <div className="shop-name">아이템 미리보기</div>
                </div>

                <div className="shop-pagination" style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 12 }}>
                    {images.map((_, i) => (
                        <button key={i} onClick={() => setIndex(i)} aria-label={`Go to item ${i+1}`} style={{
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            border: 'none',
                            background: i === index ? '#176B5F' : '#ddd',
                            cursor: 'pointer'
                        }} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ShopQuicklink;