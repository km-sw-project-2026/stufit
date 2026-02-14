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

  const [scaleActive, setScaleActive] = useState(true);
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(700);
  const n = images.length;
  const displayImages = [...images, ...images, ...images];
  const [virtualIndex, setVirtualIndex] = useState(n + Math.floor(n / 2));
  const virtualRef = useRef(virtualIndex);
  const [activeVirtual, setActiveVirtual] = useState(virtualIndex);
  const logicalIndex = ((virtualIndex % n) + n) % n;
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const [mountedFlag, setMountedFlag] = useState(false);
  const [showOutlines, setShowOutlines] = useState(false);
  const rowRef = useRef(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const placeholderSvg = `data:image/svg+xml;utf8,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="100%" height="100%" fill="#f3f3f3"/><circle cx="50%" cy="50%" r="40" fill="#e6e6e6"/></svg>')}`;

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

  const TRANS_DUR = 240;

  // move virtual index by delta (keyboard)
  const moveBy = (delta) => {
    setIsTranslating(true);
    setVirtualIndex((prev) => prev + delta);
    // safety: ensure translating flag cleared after TRANS_DUR+200
    window.setTimeout(() => setIsTranslating(false), TRANS_DUR + 200);
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') moveBy(-1);
      if (e.key === 'ArrowRight') moveBy(1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // reduced transition duration for snappier feel

  // navigation to a logical index (click/pagination)
  const jumpTo = (logical) => {
    setIsTranslating(true);
    setVirtualIndex(n + (logical % n));
    window.setTimeout(() => setIsTranslating(false), TRANS_DUR + 200);
  };

  const prev = () => moveBy(-1);
  const next = () => moveBy(1);

  // when virtualIndex moves beyond middle copy, reset without transition to keep infinite illusion
  useEffect(() => {
    virtualRef.current = virtualIndex;
    if (virtualIndex >= 2 * n) {
      const t = setTimeout(() => {
        setTransitionEnabled(false);
        setVirtualIndex((v) => v - n);
        requestAnimationFrame(() => requestAnimationFrame(() => setTransitionEnabled(true)));
      }, TRANS_DUR);
      return () => clearTimeout(t);
    }
    if (virtualIndex < n) {
      const t = setTimeout(() => {
        setTransitionEnabled(false);
        setVirtualIndex((v) => v + n);
        requestAnimationFrame(() => requestAnimationFrame(() => setTransitionEnabled(true)));
      }, TRANS_DUR);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [virtualIndex, n]);

  // listen for translate transition end to enable center scaling
  useEffect(() => {
    const el = rowRef.current;
    if (!el) return undefined;
    const onEnd = (e) => {
      if (e.propertyName === 'transform') {
        setIsTranslating(false);
        // after translate finishes, mark this virtual index as active so center-scale applies
        setActiveVirtual(virtualRef.current);
      }
    };
    el.addEventListener('transitionend', onEnd);
    return () => el.removeEventListener('transitionend', onEnd);
  }, [rowRef]);

  return (
    <div className="shop-quicklink" style={{ padding: '40px 0' }}>
      <div className="shop-header" style={{ textAlign: 'center', marginBottom: 12 }}>
        <h2 style={{ margin: 0 }}>Item Shop</h2>
        <p style={{ margin: 0, color: '#666' }}>포인트를 모아서 여러가지 아이템을 구매하세요!</p>
      </div>

      <div className="shop-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* debug removed for production */}
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

          <div ref={containerRef} className="shop-items-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: 260, overflow: 'hidden' }}>
            {
              (() => {
                const containerWidthLocal = containerWidth || 900;
                const VISIBLE = 5; // show five items fully
                const gapTotal = 32; // total horizontal gap per slot (left+right)
                const slot = Math.round(containerWidthLocal / VISIBLE);
                const base = Math.max(80, slot - gapTotal);
                const gapHalf = Math.round((slot - base) / 2);
                const translateX = Math.round(containerWidthLocal / 2 - (virtualIndex * slot + base / 2));

                return (
                  <div
                      ref={rowRef}
                      className="shop-items-row"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        transition: transitionEnabled ? `transform ${TRANS_DUR}ms ease` : 'none',
                        transform: `translateX(${translateX}px)`,
                        willChange: 'transform'
                      }}
                    >
                    {displayImages.map((src, i) => {
                      const posCurrent = i - virtualIndex; // position during translate
                      const absPosCurrent = Math.abs(posCurrent);
                      const posActive = i - activeVirtual; // position after translate
                      const absPosActive = Math.abs(posActive);

                      let scale = 0.75;
                      let zIndex = 1;
                      let opacity = 1;
                      let pointerEvents = 'auto';

                      if (isTranslating) {
                        // while translating, show positions relative to the moving index
                        if (absPosCurrent === 0) {
                          scale = 1.0;
                          zIndex = 6;
                          opacity = 1;
                        } else if (absPosCurrent === 1) {
                          scale = 1.05;
                          zIndex = 5;
                          opacity = 1;
                        } else if (absPosCurrent === 2) {
                          scale = 0.9;
                          zIndex = 4;
                          opacity = 1;
                        } else {
                          scale = 0.75;
                          zIndex = 1;
                          opacity = 0.9;
                          pointerEvents = 'none';
                        }
                      } else {
                        // after translate finishes, base scaling on active index so center enlarges
                        if (absPosActive === 0) {
                          scale = 1.6;
                          zIndex = 6;
                          opacity = 1;
                        } else if (absPosActive === 1) {
                          scale = 1.05;
                          zIndex = 5;
                          opacity = 1;
                        } else if (absPosActive === 2) {
                          scale = 0.9;
                          zIndex = 4;
                          opacity = 1;
                        } else {
                          scale = 0.75;
                          zIndex = 1;
                          opacity = 0.9;
                          pointerEvents = 'none';
                        }
                      }

                      return (
                        <div
                          key={`${i}-${String(src)}`}
                          onClick={() => jumpTo(i % n)}
                          style={{
                            width: base,
                            height: base,
                            flex: `0 0 ${base}px`,
                            borderRadius: '50%',
                            overflow: 'hidden',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: `transform ${TRANS_DUR}ms cubic-bezier(.2,.9,.27,1), box-shadow ${TRANS_DUR}ms`,
                            transform: `scale(${scale})`,
                            transformOrigin: 'center center',
                            boxShadow: absPos === 0 ? '0 18px 40px rgba(0,0,0,0.18)' : 'none',
                            zIndex,
                            opacity,
                            margin: `0 ${gapHalf}px`,
                            background: '#fff',
                            position: 'relative',
                            cursor: pointerEvents === 'none' ? 'default' : 'pointer',
                            pointerEvents,
                            willChange: 'transform',
                            border: 'none'
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
                                // If image is being upscaled significantly, use pixelated rendering for pixel-art
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
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              display: 'block',
                              borderRadius: '50%',
                              border: '1px solid rgba(0,0,0,0.06)'
                            }}
                          />
                          {showOutlines && (
                            <div style={{ position: 'absolute', left: 4, top: 4, fontSize: 10, background: 'rgba(255,255,255,0.8)', padding: '2px 4px', borderRadius: 4 }}>
                              {`${i % n}:${pos}`}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })()
            }
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
                background: i === logicalIndex ? '#176B5F' : '#ddd',
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
