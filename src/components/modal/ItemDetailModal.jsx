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
            
            <div className="item-detail-description">
              <p>{item.description || '멋진 아이템으로 나만의 프로필을 꾸며보세요!'}</p>
            </div>

            <div className="item-detail-actions">
              {item.isPurchased ? (
                <>
                  <button 
                    className={`item-detail-use-btn ${item.isUsing ? 'using' : ''}`}
                    onClick={() => {
                      // 사용/해제 로직
                      alert(item.isUsing ? '아이템 사용을 해제했습니다.' : '아이템을 적용했습니다.');
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
