import seagullImg from '../../assets/shop-items/seagull.png';
import parrotImg from '../../assets/shop-items/parrot.png';
import duckImg from '../../assets/shop-items/duck.png';
import slimeUmbrellaImg from '../../assets/shop-items/umbrella-slime.png';
import jellyfishImg from '../../assets/shop-items/jellyfish-green.png';
import pumpkinImg from '../../assets/shop-items/pumpkin.png';
import ghostImg from '../../assets/shop-items/ghost.png';
import toxicSludgeImg from '../../assets/shop-items/toxic-sludge.gif';

function ShopProfileImage({ wishlistScope, isWishlisted, isPurchased, toggleWishlist, onPurchase }) {
    const categoryLabel = '프로필 이미지';
    const items = [
        { id: 1, name: '갈매기', price: '4,500 P', color: '#ff6347', image: seagullImg },
        { id: 2, name: '앵무새', price: '5,500 P', color: '#4169e1', image: parrotImg },
        { id: 3, name: '오리', price: '5,000 P', color: '#9370db', image: duckImg },
        { id: 4, name: '우산 슬라임', price: '4,800 P', color: '#8b4513', image: slimeUmbrellaImg },
        { id: 5, name: '해파리(초록)', price: '6,000 P', color: '#fff0f5', image: jellyfishImg },
        { id: 6, name: '펌킨', price: '5,200 P', color: '#8b0000', image: pumpkinImg },
        { id: 7, name: '유령', price: '3,800 P', color: '#f2f2f2', image: ghostImg },
        { id: 8, name: '유독성 슬러지', price: '4,100 P', color: '#a7d46f', image: toxicSludgeImg },
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

export default ShopProfileImage;
