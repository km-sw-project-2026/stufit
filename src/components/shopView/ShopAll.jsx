function ShopAll({ wishlistScope, isWishlisted, isPurchased, toggleWishlist, onPurchase }) {
    const items = [
        { id: 1, category: '프로필 테두리', name: '귀여운 루돌프 머리띠', price: '3,000 P', color: '#fff', type: 'frame', image: '' },
        { id: 2, category: '프로필 테두리', name: '멋진 왕관', price: '5,000 P', color: '#ffd700', type: 'frame', image: '' },
        { id: 3, category: '프로필 배경', name: '파스텔 여름', price: '2,500 P', color: '#fffacd', type: 'bg', image: '' },
        { id: 4, category: '프로필 배경', name: '신비한 밤하늘', price: '4,000 P', color: '#191970', type: 'bg', image: '' },
        { id: 5, category: '프로필 배경', name: '벚꽃 봄', price: '3,500 P', color: '#ffb6c1', type: 'bg', image: '' },
        { id: 6, category: '프로필 이미지', name: '산타 복장', price: '4,500 P', color: '#ff6347', type: 'image', image: '' },
        { id: 7, category: '프로필 이미지', name: '우주인 복장', price: '5,500 P', color: '#4169e1', type: 'image', image: '' },
        { id: 8, category: '프로필 이미지', name: '왕부구니 기본', price: '1,000 P', color: '#ffcc99', type: 'image', image: '' },
    ];

    return (
        <div className="shop-items-grid">
            {items.map((item) => {
                const itemWishlisted = isWishlisted(wishlistScope, item.id);
                const itemPurchased = isPurchased(wishlistScope, item.id);

                return (
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
                        <div className="item-category">{item.category}</div>
                        <div className="item-name">{item.name}</div>
                        <div className="item-price">{item.price}</div>
                        <div className="item-actions">
                            <button
                                className={`item-wishlist-btn ${itemWishlisted ? 'wishlisted' : ''}`}
                                onClick={() => toggleWishlist(wishlistScope, item)}
                                title="찜하기"
                            >
                                {itemWishlisted ? '♥' : '♡'}
                            </button>
                            <button
                                className={`item-buy-btn ${itemPurchased ? 'purchased' : ''}`}
                                onClick={() => onPurchase(wishlistScope, item)}
                                disabled={itemPurchased}
                            >
                                {itemPurchased ? '구매완료' : '구매하기'}
                            </button>
                        </div>
                    </div>
                    </div>
                );
            })}
        </div>
    );
}

export default ShopAll;
