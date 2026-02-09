function ShopCart() {
    const cartItems = [
        { id: 1, category: '프로필 액자', name: '귀여운 루돌프 머리띠', price: '3,000 P', color: '#fff', type: 'frame' },
        { id: 2, category: '프로필 액자', name: '멋진 왕관', price: '5,000 P', color: '#ffd700', type: 'frame' },
        { id: 3, category: '프로필 배경', name: '신비한 밤하늘', price: '4,000 P', color: '#191970', type: 'bg' },
        { id: 4, category: '프로필 이미지', name: '산타 복장', price: '4,500 P', color: '#ff6347', type: 'image' },
        { id: 5, category: '프로필 이미지', name: '우주인 복장', price: '5,500 P', color: '#4169e1', type: 'image' },
    ];

    const handleRemoveFromCart = (id) => {
        console.log(`Item ${id} removed from cart`);
    };

    const handleCheckout = () => {
        console.log('Proceed to checkout');
    };

    return (
        <div className="shop-cart-container">
            {cartItems.length > 0 ? (
                <>
                    <div className="cart-items-list">
                        {cartItems.map((item) => (
                            <div key={item.id} className="cart-item">
                                <div className={`cart-item-icon ${item.type === 'frame' ? 'profile-frame-small' : ''}`} style={{ backgroundColor: item.color }}>
                                    {item.type === 'frame' && <div className="profile-border-small"></div>}
                                </div>
                                <div className="cart-item-info">
                                    <div className="cart-item-category">{item.category}</div>
                                    <div className="cart-item-name">{item.name}</div>
                                    <div className="cart-item-price">{item.price}</div>
                                </div>
                                <button 
                                    className="cart-item-remove"
                                    onClick={() => handleRemoveFromCart(item.id)}
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className="cart-summary">
                        <div className="cart-total">
                            <span>총 예상 가격:</span>
                            <span className="total-price">19,500 P</span>
                        </div>
                        <button className="checkout-btn" onClick={handleCheckout}>
                            구매하기
                        </button>
                    </div>
                </>
            ) : (
                <div className="empty-cart">
                    <div className="empty-icon">🛒</div>
                    <p>아직 찜한 아이템이 없습니다</p>
                </div>
            )}
        </div>
    );
}

export default ShopCart;
