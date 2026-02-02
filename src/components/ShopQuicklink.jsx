import { useState } from 'react';

function ShopQuicklink() {
  const [currentSlide, setCurrentSlide] = useState(2);

  const items = [
    { id: 1, color: '#fce4ec', borderStyle: '2px dashed #f48fb1', size: 'small' },
    { id: 2, color: '#e0f2f1', borderStyle: '1px solid #ddd', size: 'medium' },
    { id: 3, color: '#fff', borderStyle: 'none', size: 'active', isRudolph: true },
    { id: 4, color: '#fff3e0', borderStyle: '1px solid #ddd', size: 'medium' },
    { id: 5, color: '#e3f2fd', borderStyle: '1px solid #bbdefb', size: 'small' }
  ];

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev === items.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="shop-quicklink">
      <div className="shop-header">
        <h2>Item Shop</h2>
        <p>포인트를 모아서 여러가지 아이템을 구매하세요!</p>
      </div>

      <div className="shop-content">
        <a href="#" className="shop-more-link">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#222" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M12 8l4 4-4 4M8 12h8"></path>
          </svg>
        </a>

        <div className="shop-slider-container">
          <button className="shop-nav prev" onClick={handlePrev}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#222" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>

          <div className="shop-items-wrapper">
            {items.map((item) => (
              <div key={item.id} className={`shop-item ${item.size}`}>
                <div className={`item-circle${item.isRudolph ? ' rudolph-frame' : ''}`} style={{ backgroundColor: item.color, border: item.borderStyle }}>
                  {item.isRudolph && <div className="rudolph-antlers"></div>}
                </div>
                {item.size === 'active' && <div className="active-indicator-dot"></div>}
              </div>
            ))}
          </div>

          <button className="shop-nav next" onClick={handleNext}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#222" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>
        </div>

        <div className="shop-item-info">
          <div className="shop-badge">프로필 액자</div>
          <div className="shop-name">귀여운 루돌프 머리띠</div>
          <div className="shop-price">3,000 P</div>
        </div>

        <div className="shop-pagination">
          {items.map((_, idx) => (
            <span key={idx} className={`dot ${idx === currentSlide ? 'active' : ''}`}></span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ShopQuicklink;
