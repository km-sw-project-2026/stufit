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
                    onClick={async () => {
                      const userId = localStorage.getItem('userId');
                      const username = localStorage.getItem('username');

                      if (!userId) {
                        alert('로그인이 필요합니다.');
                        return;
                      }

                      try {
                        const isRemoving = item.isUsing;
                        const response = await fetch('/api/user/items', {
                          method: 'PUT',
                          headers: {
                            'Content-Type': 'application/json',
                            'X-Username': username || '',
                          },
                          body: JSON.stringify({
                            userId: Number(userId),
                            itemType: item.type,
                            itemId: isRemoving ? null : item.id,
                          }),
                        });

                        const data = await response.json();

                        if (!response.ok) {
                          alert(data?.message || '아이템 적용에 실패했습니다.');
                          return;
                        }

                        alert(isRemoving ? '아이템 사용을 해제했습니다.' : '아이템을 적용했습니다.');
                        
                        // 이벤트 발생으로 다른 컴포넌트에 알림
                        window.dispatchEvent(new CustomEvent('activeItemsUpdated'));
                      } catch (err) {
                        console.error('아이템 적용 실패:', err);
                        alert('아이템 적용 중 오류가 발생했습니다.');
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
