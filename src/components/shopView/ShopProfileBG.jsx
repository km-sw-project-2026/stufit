function ShopProfileBG({ wishlistScope, isWishlisted, isPurchased, toggleWishlist, onPurchase }) {
    const categoryLabel = '프로필 배경';
    const items = [
        { id: 1, name: '파스텔 여름', price: '2,500 P', color: '#fffacd', image: '' },
        { id: 2, name: '신비한 밤하늘', price: '4,000 P', color: '#191970', image: '' },
        { id: 3, name: '벚꽃 봄', price: '3,500 P', color: '#ffb6c1', image: '' },
        { id: 4, name: '단풍 가을', price: '3,000 P', color: '#ff8c00', image: '' },
        { id: 5, name: '소복한 겨울', price: '2,800 P', color: '#e0ffff', image: '' },
        { id: 6, name: '신록 숲', price: '3,200 P', color: '#228b22', image: '' },
    ];

    return (
        <div className="shop-items-grid">
            {items.map((item) => {
                const itemWishlisted = isWishlisted(wishlistScope, item.id);
                const itemPurchased = isPurchased(wishlistScope, item.id);
                const wishlistItem = { ...item, category: categoryLabel };

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
                        <div className="item-category">{categoryLabel}</div>
                        <div className="item-name">{item.name}</div>
                        <div className="item-price">{item.price}</div>
                        <div className="item-actions">
                            <button
                                className={`item-wishlist-btn ${itemWishlisted ? 'wishlisted' : ''}`}
                                onClick={() => toggleWishlist(wishlistScope, wishlistItem)}
                                title="찜하기"
                            >
                                {itemWishlisted ? '♥' : '♡'}
                            </button>
                            <button
                                className={`item-buy-btn ${itemPurchased ? 'purchased' : ''}`}
                                onClick={() => onPurchase(wishlistScope, wishlistItem)}
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

export default ShopProfileBG;
