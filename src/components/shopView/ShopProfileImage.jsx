import { useState } from 'react';

function ShopProfileImage() {
    const items = [
        { id: 1, name: '산타 복장', price: '4,500 P', color: '#ff6347', image: '' },
        { id: 2, name: '우주인 복장', price: '5,500 P', color: '#4169e1', image: '' },
        { id: 3, name: '마법사 복장', price: '5,000 P', color: '#9370db', image: '' },
        { id: 4, name: '초코렛 군인 복장', price: '4,800 P', color: '#8b4513', image: '' },
        { id: 5, name: '천사 복장', price: '6,000 P', color: '#fff0f5', image: '' },
        { id: 6, name: '악마 복장', price: '5,200 P', color: '#8b0000', image: '' },
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
                        <div className="item-category">프로필 이미지</div>
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

export default ShopProfileImage;
