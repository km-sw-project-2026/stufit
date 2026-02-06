import { useState } from 'react';

function ShopProfileFrame() {
    const items = [
        { id: 1, name: '귀여운 루돌프 머리띠', price: '3,000 P', color: '#fff', image: '' },
        { id: 2, name: '멋진 왕관', price: '5,000 P', color: '#ffd700', image: '' },
        { id: 3, name: '반짝이는 별 액자', price: '4,500 P', color: '#fffacd', image: '' },
        { id: 4, name: '우아한 화이트 액자', price: '3,500 P', color: '#f0f8ff', image: '' },
        { id: 5, name: '클래식 브론즈 테두리', price: '3,800 P', color: '#d2b48c', image: '' },
        { id: 6, name: '모던 블랙 테두리', price: '4,200 P', color: '#2f2f2f', image: '' },
        { id: 7, name: '로즈 골드 테두리', price: '4,800 P', color: '#d8a7a7', image: '' },
    ];

    const [wishlisted, setWishlisted] = useState({});

    const toggleWishlist = (id) => {
        setWishlisted((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    return (
        <div className="shop-items-grid">
            {items.map((item) => (
                <div key={item.id} className="shop-item-card">
                    <div
                        className={`item-image ${item.image ? 'has-image' : ''}`}
                        style={{ backgroundColor: item.color }}
                    >
                        {item.image ? (
                            <img className="item-image-img" src={item.image} alt={item.name} />
                        ) : null}
                    </div>
                    <div className="item-details">
                        <div className="item-category">프로필 테두리</div>
                        <div className="item-name">{item.name}</div>
                        <div className="item-price">{item.price}</div>
                        <div className="item-actions">
                            <button
                                className={`item-wishlist-btn ${wishlisted[item.id] ? 'wishlisted' : ''}`}
                                onClick={() => toggleWishlist(item.id)}
                                title="찜하기"
                            >
                                {wishlisted[item.id] ? '♥' : '♡'}
                            </button>
                            <button className="item-buy-btn">구매하기</button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default ShopProfileFrame;
