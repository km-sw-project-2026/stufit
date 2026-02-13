import { useNavigate } from 'react-router-dom';
import { useRef, useState, useEffect } from 'react';

function ShopQuicklink () {
    const navigate = useNavigate();
    // list of asset file names in src/assets/shop-items
    const assetFiles = [
        'anglerfish.png','bg-avocado.png','bg-cloud.png','bg-crescent.png','bg-curtain.png','bg-lemon.png','bg-lightgreen.png','bg-pinkdots.png','bg-redstar.png','bg-stage.png','bg-teeth.png','bg-throne.png','bg-tiger.png','duck.png','frame-avocado.png','frame-cherryblossom.png','frame-chicken.png','frame-dragon.png','frame-lemon.png','frame-mcburger.png','frame-mchat.png','frame-strawberry.png','frame-superstar.png','frame-vip.png','ghost.png','jellyfish-green.png','parrot.png','pumpkin.png','seagull.png','toxic-sludge.gif','umbrella-slime.png'
    ];

    // Limit number of items shown in the quicklink to avoid horizontal scrolling overload
    const maxItems = 8; // change this number to show more/less items
    const images = assetFiles.slice(0, maxItems).map(name => new URL(`../../assets/shop-items/${name}`, import.meta.url).href);

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

    const prev = () => setIndex(i => Math.max(0, i - 1));
    const next = () => setIndex(i => Math.min(images.length - 1, i + 1));

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