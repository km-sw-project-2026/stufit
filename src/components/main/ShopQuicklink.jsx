import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef, useLayoutEffect } from 'react';

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

  const n = images.length;

  // State: which logical index is centered
  const [centerIndex, setCenterIndex] = useState(0);
  const [isTranslating, setIsTranslating] = useState(false);
  const transitionRef = useRef(null);

  // container sizing
  const containerRef = useRef(null);
  const rowRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(900);

  useLayoutEffect(() => {
    const update = () => {
      if (containerRef.current) {
        const w = containerRef.current.getBoundingClientRect().width || containerRef.current.clientWidth;
        setContainerWidth(w);
      }
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // visual constants
  const TRANS_DUR = 300; // ms
  const VISIBLE = 5;
  const gap = 16;
  const CENTER_SCALE = 1.6;
  const base = Math.max(56, Math.min(160, Math.floor((containerWidth - (VISIBLE - 1) * gap) / VISIBLE)));
  const slot = base + gap;
  const centerOverflow = Math.ceil(((CENTER_SCALE - 1) * base) / 2);
  const sidePadding = Math.max(8, centerOverflow + 8);
  // vertical offset to lower the whole row so items sit visually centered under the header
  const VERTICAL_OFFSET = 110;
  // small horizontal nudging (negative moves left)
  const HORIZONTAL_SHIFT = -70;

  // navigation
  const slideTo = (newCenter) => {
    if (isTranslating) return;
    setIsTranslating(true);
    setCenterIndex(((newCenter % n) + n) % n);
    if (transitionRef.current) clearTimeout(transitionRef.current);
    transitionRef.current = setTimeout(() => setIsTranslating(false), TRANS_DUR + 20);
  };
  const prev = () => slideTo(centerIndex - 1);
  const next = () => slideTo(centerIndex + 1);
  const jumpTo = (logical) => slideTo(logical);

  useEffect(() => {
    return () => {
      if (transitionRef.current) clearTimeout(transitionRef.current);
    };
  }, []);

  const placeholderSvg = `data:image/svg+xml;utf8,${encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="100%" height="100%" fill="#f3f3f3"/><circle cx="50%" cy="50%" r="40" fill="#e6e6e6"/></svg>'
  )}`;

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
          <button type="button" className="shop-nav prev" onClick={prev} aria-label="previous" style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#222" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>

          <div
            ref={containerRef}
            className="shop-items-container"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: 360,
              overflow: 'hidden',
              padding: `0 ${sidePadding}px`,
            }}
          >
            <div
              ref={rowRef}
              className="shop-items-row"
              style={{ position: 'relative', width: '100%', height: '100%' }}
            >
              {[-2, -1, 0, 1, 2].map((off) => {
                const logical = (centerIndex + off + n) % n;
                const src = images[logical];
                const pos = off;
                const x = pos * slot;
                const leftPx = Math.round(containerWidth / 2 - base / 2 + x + HORIZONTAL_SHIFT);
                const absPos = Math.abs(pos);

                let scale = 0.9;
                let zIndex = 1;
                let translateY = 0;
                if (absPos === 0) {
                  scale = CENTER_SCALE;
                  zIndex = 12;
                  translateY = -18;
                } else if (absPos === 1) {
                  scale = 1.18;
                  zIndex = 7;
                } else if (absPos === 2) {
                  scale = 0.98;
                  zIndex = 5;
                }

                return (
                  <div
                    key={`${logical}-${off}`}
                    onClick={() => jumpTo(logical)}
                      style={{
                      width: base,
                      height: base,
                      position: 'absolute',
                      left: `${leftPx}px`,
                      transform: `translateY(${translateY + VERTICAL_OFFSET}px) scale(${scale})`,
                      transition: `transform ${TRANS_DUR}ms cubic-bezier(.22,.9,.28,1), box-shadow ${TRANS_DUR}ms`,
                      transformOrigin: 'center center',
                      borderRadius: '50%',
                      overflow: 'hidden',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      /* boxShadow removed as requested */
                      zIndex,
                      margin: `0 ${Math.round(gap / 2)}px`,
                      background: '#fff',
                      cursor: 'pointer',
                      pointerEvents: 'auto',
                      willChange: 'transform',
                      border: 'none',
                    }}
                  >
                    <img
                      src={src}
                      alt="item"
                      onLoad={(e) => {
                        const imgEl = e.currentTarget;
                        try {
                          const rect = imgEl.getBoundingClientRect();
                          const natural = imgEl.naturalWidth || 1;
                          const factor = rect.width / natural;
                          if (factor > 1.1) {
                            imgEl.style.imageRendering = 'pixelated';
                            imgEl.style.webkitImageRendering = 'pixelated';
                          } else {
                            imgEl.style.imageRendering = 'auto';
                          }
                        } catch (err) {
                          // ignore
                        }
                      }}
                      onError={(e) => {
                        // eslint-disable-next-line no-console
                        console.warn('ShopQuicklink image failed to load, using placeholder', src);
                        e.currentTarget.src = placeholderSvg;
                      }}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', borderRadius: '50%', border: '1px solid rgba(0,0,0,0.06)' }}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          <button type="button" className="shop-nav next" onClick={next} aria-label="next" style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
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
            <button key={i} onClick={() => jumpTo(i)} aria-label={`Go to item ${i + 1}`} style={{ width: 12, height: 12, borderRadius: '50%', border: 'none', background: i === centerIndex ? '#176B5F' : '#ddd', cursor: 'pointer' }} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ShopQuicklink;
