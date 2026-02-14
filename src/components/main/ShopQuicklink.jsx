import { useNavigate } from 'react-router-dom';

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
                        {/* 아이템 슬라이더 컨테이너 (좌우 버튼으로 탐색 가능) */}
                        <div className="shop-slider-container">
                            <button className="shop-nav prev">
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#222" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                            </button>

                            <div className="shop-items-wrapper">
                                <div className="shop-item small">
                                    <div className="item-circle" style={{backgroundColor: '#fce4ec', border: '2px dashed #f48fb1'}}></div>
                                </div>
                                <div className="shop-item medium">
                                    <div className="item-circle" style={{backgroundColor: '#e0f2f1', border: '1px solid #ddd'}}></div>
                                </div>
                                <div className="shop-item active">
                                    <div className="item-circle rudolph-frame">
                                        <div className="rudolph-antlers"></div>
                                    </div>
                                    <div className="active-indicator-dot"></div>
                                </div>
                                <div className="shop-item medium">
                                    <div className="item-circle" style={{backgroundColor: '#fff3e0', border: '1px solid #ddd'}}></div>
                                </div>
                                <div className="shop-item small">
                                    <div className="item-circle" style={{backgroundColor: '#e3f2fd', border: '1px solid #bbdefb'}}></div>
                                </div>
                            </div>

                            <button className="shop-nav next">
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#222" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
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
    );
};
export default ShopQuicklink;