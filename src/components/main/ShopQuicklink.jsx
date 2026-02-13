import { useNavigate } from 'react-router-dom';
import { useRef, useState, useEffect } from 'react';

function ShopQuicklink () {
    const navigate = useNavigate();
    // Use Vite's import.meta.glob to reliably collect asset URLs from src/assets/shop-items
        // Use only the user-selected images in the given order; fallback to placeholder if missing
        const desiredFiles = ['bg-teeth.png', 'frame-chicken.png', 'frame-vip.png', 'jellyfish-green.png', 'bg-lemon.png'];
        const modules = import.meta.glob('../../assets/shop-items/*.{png,jpg,jpeg,gif}', { eager: true, as: 'url' });
        const fileMap = Object.fromEntries(Object.entries(modules || {}).map(([k, v]) => [k.split('/').pop(), v]));
        const images = desiredFiles.map(name => fileMap[name] || '/img/Profile2.png');

    const [index, setIndex] = useState(0);
    const wrapperRef = useRef(null);
    const itemRefs = useRef([]);

    useEffect(() => {
        // scroll active item into center when index changes
        const el = itemRefs.current[index];
        if (el && wrapperRef.current) {
            try {
                el.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
            } catch (e) {
                wrapperRef.current.scrollLeft = el.offsetLeft - (wrapperRef.current.clientWidth / 2) + (el.clientWidth / 2);
            }
        }
    }, [index]);

        // Circular navigation
        const prev = () => setIndex(i => (i - 1 + images.length) % images.length);
        const next = () => setIndex(i => (i + 1) % images.length);

    return(
        <div className="shop-quicklink">
            <div className="shop-header">
                <h2>Item Shop</h2>
                <p>포인트를 모아서 여러가지 아이템을 구매하세요!</p>
            </div>

            <div className="shop-content">
                <a href="#" className="shop-more-link" onClick={(e) => { e.preventDefault(); navigate('/shop'); }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#222" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="M12 8l4 4-4 4M8 12h8"></path>
                    </svg>
                </a>

                <div className="shop-slider-container">
                    <button className="shop-nav prev" onClick={prev} aria-label="previous">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#222" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                    </button>

                    <div className="shop-items-wrapper" ref={wrapperRef} style={{ overflowX: 'auto', display: 'flex', gap: 12, scrollSnapType: 'x mandatory' }}>
                        {images.map((src, i) => (
                            <div
                                key={src}
                                className={`shop-item ${i === index ? 'active' : i === index-1 || i === index+1 ? 'medium' : 'small'}`}
                                ref={el => itemRefs.current[i] = el}
                                style={{ flex: '0 0 auto', scrollSnapAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                                <img src={src} alt={`item-${i}`} style={{ width: i === index ? 120 : 80, height: i === index ? 120 : 80, objectFit: 'contain', borderRadius: 12 }} />
                            </div>
                        ))}
                    </div>

                    <button className="shop-nav next" onClick={next} aria-label="next">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#222" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </button>
                </div>

                <div className="shop-item-info">
                    <div className="shop-badge">프로필 액자</div>
                    <div className="shop-name">아이템 미리보기</div>
                    <div className="shop-price">-- P</div>
                </div>

                <div className="shop-pagination" style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 12, flexWrap: 'wrap' }}>
                    {images.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setIndex(i)}
                            className={`dot ${i === index ? 'active' : ''}`}
                            style={{ width: 12, height: 12, borderRadius: '50%', border: 'none', background: i === index ? '#176B5F' : '#ddd', cursor: 'pointer' }}
                            aria-label={`Go to item ${i+1}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};
export default ShopQuicklink;