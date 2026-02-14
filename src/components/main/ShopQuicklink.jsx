import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

// Explicit imports to ensure assets load reliably in dev and CI
import bgTeeth from '../../assets/shop-items/bg-teeth.png';
import frameChicken from '../../assets/shop-items/frame-chicken.png';
import frameVip from '../../assets/shop-items/frame-vip.png';
import jellyfishGreen from '../../assets/shop-items/jellyfish-green.png';
import bgLemon from '../../assets/shop-items/bg-lemon.png';
import bgAvocado from '../../assets/shop-items/bg-avocado.png';
import frameCherry from '../../assets/shop-items/frame-cherryblossom.png';
import frameLemon from '../../assets/shop-items/frame-lemon.png';
import ghost from '../../assets/shop-items/ghost.png';
import parrot from '../../assets/shop-items/parrot.png';
import duck from '../../assets/shop-items/duck.png';
import bgPink from '../../assets/shop-items/bg-pinkdots.png';
import pumpkin from '../../assets/shop-items/pumpkin.png';

function ShopQuicklink() {
  const navigate = useNavigate();
  const images = [
    bgTeeth,
    frameChicken,
    frameVip,
    jellyfishGreen,
    bgLemon,
    bgAvocado,
    frameCherry,
    frameLemon,
    ghost,
    parrot,
    duck,
    bgPink,
    pumpkin,
  ];

  const [index, setIndex] = useState(() => Math.floor(images.length / 2));
  const [scaleActive, setScaleActive] = useState(true);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') jumpTo((index - 1 + images.length) % images.length);
      if (e.key === 'ArrowRight') jumpTo((index + 1) % images.length);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [images.length]);

  // navigation that temporarily disables immediate scaling so center enlarges after arrival
  const jumpTo = (newIndex) => {
    setScaleActive(false);
    setIndex(newIndex);
    // small delay so items 'arrive' then scale
    window.setTimeout(() => setScaleActive(true), 140);
  };

  const prev = () => jumpTo((index - 1 + images.length) % images.length);
  const next = () => jumpTo((index + 1) % images.length);

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

          <div className="shop-items-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 700, height: 240, overflow: 'hidden' }}>
            {images.map((src, i) => {
              const n = images.length;
              let pos = ((i - index) + n) % n; // circular relative position (0..n-1)
              if (pos > n / 2) pos -= n; // convert to negative side for left
              const absPos = Math.abs(pos);

              const base = 100;
              let scale = 0.65;
              let zIndex = 1;
              let opacity = 0;
              let display = 'block';

              if (absPos === 0) {
                scale = scaleActive ? 1.5 : 1.0;
                zIndex = 6;
                opacity = 1;
              } else if (absPos === 1) {
                scale = 1.05;
                zIndex = 4;
                opacity = 0.95;
              } else if (absPos === 2) {
                scale = 0.9;
                zIndex = 3;
                opacity = 0.6;
              } else if (absPos <= 3) {
                scale = 0.75;
                zIndex = 2;
                opacity = 0.35;
              } else {
                // hide distant items so they don't clutter view
                display = 'none';
              }

              return (
                <div
                  key={i}
                  onClick={() => jumpTo(i)}
                  style={{
                    display,
                    width: base,
                    height: base,
                    flex: `0 0 ${base}px`,
                    borderRadius: '50%',
                    overflow: 'hidden',
                    display: display === 'none' ? 'none' : 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: `${absPos === 0 ? 'transform 300ms ease, box-shadow 300ms ease, opacity 300ms ease' : 'transform 0ms, opacity 200ms'}`,
                    transform: `scale(${scale})`,
                    transformOrigin: 'center center',
                    boxShadow: absPos === 0 ? '0 10px 30px rgba(0,0,0,0.12)' : 'none',
                    zIndex,
                    opacity,
                    margin: '0 10px',
                    background: '#fff',
                    position: 'relative',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundImage: `url(${src})`,
                    cursor: 'pointer',
                    willChange: 'transform'
                  }}
                />
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
              onClick={() => jumpTo(i)}
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

        {/* debug info removed for production UI */}
      </div>
    </div>
  );
}

export default ShopQuicklink;
