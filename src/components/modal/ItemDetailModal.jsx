import { useState } from 'react';

function ItemDetailModal({ isOpen, onClose, item }) {
  if (!isOpen || !item) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="item-detail-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>×</button>
        
        <div className="item-detail-content">
          <div className="item-detail-image-section">
            <div 
              className="item-detail-image"
              style={{ backgroundColor: item.color }}
            >
              {item.image && (
                <img src={item.image} alt={item.name} />
              )}
            </div>
            {item.isUsing && (
              <div className="item-using-badge">사용중</div>
            )}
          </div>

          <div className="item-detail-info">
            <span className="item-detail-category">{item.category}</span>
            <h2 className="item-detail-name">{item.name}</h2>
            <p className="item-detail-price">{item.price}</p>

            <div className="item-detail-actions">
              {item.isPurchased ? (
                <>
                  <button 
                    className={`item-detail-use-btn ${item.isUsing ? 'using' : ''}`}
                    onClick={() => {
                      // 적용 상태 토글: localStorage.activeItems에 타입별로 id를 저장
                      try {
                        const stored = localStorage.getItem('activeItems');
                        let active = {};
                        if (stored) {
                          active = JSON.parse(stored) || {};
                        }

                        if (active[item.type] === item.id) {
                          // 이미 적용중이면 해제
                          delete active[item.type];
                          alert('아이템 사용을 해제했습니다.');
                        } else {
                          active[item.type] = item.id;
                          alert('아이템을 적용했습니다.');
                        }

                        localStorage.setItem('activeItems', JSON.stringify(active));
                        try {
                          window.dispatchEvent(new CustomEvent('activeItemsUpdated', { detail: { type: item.type, id: active[item.type] ?? null } }));
                        } catch (e) {
                          // ignore
                        }
                      } catch (err) {
                        console.error('activeItems 토글 실패:', err);
                      }

                      onClose();
                    }}
                  >
                    {item.isUsing ? '사용 해제' : '사용하기'}
                  </button>
                </>
              ) : (
                <button 
                  className="item-detail-buy-btn"
                  onClick={() => {
                    alert('구매 기능은 준비 중입니다.');
                    onClose();
                  }}
                >
                  구매하기
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ItemDetailModal;
