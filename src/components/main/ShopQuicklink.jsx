import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

// Explicit imports to ensure assets load reliably in dev and CI
import bgTeeth from '../../assets/shop-items/bg-teeth.png';
import frameChicken from '../../assets/shop-items/frame-chicken.png';
import frameVip from '../../assets/shop-items/frame-vip.png';
import jellyfishGreen from '../../assets/shop-items/jellyfish-green.png';
import bgLemon from '../../assets/shop-items/bg-lemon.png';

function ShopQuicklink() {
  const navigate = useNavigate();
  const images = [bgTeeth, frameChicken, frameVip, jellyfishGreen, bgLemon];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') setIndex((i) => (i - 1 + images.length) % images.length);
      if (e.key === 'ArrowRight') setIndex((i) => (i + 1) % images.length);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [images.length]);

  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);
  const next = () => setIndex((i) => (i + 1) % images.length);

  return (
    <div className="shop-quicklink" style={{ padding: '40px 0' }}>
      <div className="shop-header" style={{ textAlign: 'center', marginBottom: 12 }}>
        <h2 style={{ margin: 0 }}>Item Shop</h2>
        <p style={{ margin: 0, color: '#666' }}>포인트를 모아서 여러가지 아이템을 구매하세요!</p>
      </div>

      <div className="shop-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <a
          href="#"
          className="shop-more-link"
          onClick={(e) => {
            e.preventDefault();
            navigate('/shop');
          }}
          style={{ position: 'absolute', right: 40, top: 40 }}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#222" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M12 8l4 4-4 4M8 12h8"></path>
          </svg>
        </a>

        <div className="shop-slider-container" style={{ display: 'flex', alignItems: 'center', gap: 24, marginTop: 12, width: '100%', justifyContent: 'center' }}>
          <button
            type="button"
            className="shop-nav prev"
            onClick={prev}
            aria-label="previous"
            style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
          >
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#222" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>

          <div className="shop-items-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 760, height: 260, overflow: 'hidden' }}>
            {images.map((src, i) => {
              const pos = ((i - index) + images.length) % images.length; // relative position
              let size = 80;
              let zIndex = 1;
              let opacity = 0.5;
              if (i === index) {
                size = 220;
                zIndex = 4;
                opacity = 1;
              } else if (pos === 1 || pos === images.length - 1) {
                size = 130;
                zIndex = 3;
                opacity = 0.95;
              }

              return (
                <div
                  key={i}
                  onClick={() => setIndex(i)}
                  style={{
                    width: size,
                    height: size,
                    borderRadius: '50%',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 300ms ease',
                    boxShadow: i === index ? '0 10px 30px rgba(0,0,0,0.15)' : 'none',
                    zIndex,
                    opacity,
                    margin: '0 12px',
                    background: '#fff',
                    position: 'relative',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundImage: `url(${src})`,
                    cursor: 'pointer'
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 6,
                      left: 6,
                      right: 6,
                      textAlign: 'center',
                      fontSize: 11,
                      color: '#333',
                      background: 'rgba(255,255,255,0.7)',
                      padding: '2px 4px',
                      borderRadius: 6,
                    }}
                  >
                    {String(src).split('/').pop()}
                  </div>
                </div>
              );
            })}
          </div>

          <button
            type="button"
            className="shop-nav next"
            onClick={next}
            aria-label="next"
            style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
          >
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#222" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>

        <div className="shop-item-info" style={{ textAlign: 'center', marginTop: 16 }}>
          <div className="shop-badge">프로필 액자</div>
          <div className="shop-name">아이템 미리보기</div>
        </div>

        <div className="shop-pagination" style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 12 }}>
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Go to item ${i + 1}`}
              style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                border: 'none',
                background: i === index ? '#176B5F' : '#ddd',
                cursor: 'pointer',
              }}
            />
          ))}
        </div>

        <div style={{ marginTop: 12, fontSize: 12, color: '#666' }}>
          <div>Debug: images count = {images.length}</div>
          <div style={{ maxWidth: 760, overflow: 'auto', whiteSpace: 'nowrap' }}>{images.map((s, i) => (
            <span key={i} style={{ display: 'inline-block', marginRight: 8 }}>{String(s).split('/').pop()}</span>
          ))}</div>
        </div>
      </div>
    </div>
  );
}

export default ShopQuicklink;
