function ShopWishlist({ wishlistItems, onRemove, isPurchased, onPurchase }) {

    return (
        <>
            {wishlistItems.length > 0 ? (
                <div className="shop-wishlist-grid">
                    {wishlistItems.map((item) => {
                        const itemPurchased = isPurchased(item._wishlistKey ?? item.id);

                        return (
                        <div key={item._wishlistKey ?? item.id} className="shop-item-card wishlist-card">
                            {item.rare && <div className="rare-badge">레어템</div>}
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
                                        className="item-wishlist-btn wishlisted"
                                        onClick={() => onRemove(item._wishlistKey)}
                                        title="찜"
                                    >
                                        ♥
                                    </button>
                                    <button
                                        className={`item-buy-btn ${itemPurchased ? 'purchased' : ''}`}
                                        onClick={() => onPurchase(null, item)}
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
            ) : (
                <div className="empty-wishlist">
                    <div className="empty-icon">♡</div>
                    <p>아직 찜한 아이템이 없습니다</p>
                </div>
            )}
        </>
    );
}

export default ShopWishlist;
