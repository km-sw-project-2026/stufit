import { useState } from 'react';
import ShopAll from './ShopAll';
import ShopProfileFrame from './ShopProfileFrame';
import ShopProfileBG from './ShopProfileBG';
import ShopProfileImage from './ShopProfileImage';
import ShopWishlist from './ShopWishlist';
import ShopSidebar from './ShopSidebar';
import '../shopView/Shop.css';

function Shop() {
    const [activeCategory, setActiveCategory] = useState('all');

    const itemCounts = {
        all: 8,
        frame: 4,
        bg: 6,
        image: 6,
        cart: 5,
    };

    const renderContent = () => {
        switch (activeCategory) {
            case 'all':
                return <ShopAll />;
            case 'frame':
                return <ShopProfileFrame />;
            case 'bg':
                return <ShopProfileBG />;
            case 'image':
                return <ShopProfileImage />;
            case 'cart':
                return <ShopWishlist />;
            default:
                return <ShopAll />;
        }
    };

    return (
        <div className="shop-container">
            {/* 왼쪽 사이드바 */}
            <ShopSidebar activeCategory={activeCategory} setActiveCategory={setActiveCategory} />

            {/* 오른쪽 콘텐츠 */}
            <div className="shop-main">
                <div className="shop-count">
                    <span className="shop-count-number">{itemCounts[activeCategory] ?? 0}</span> 항목이 있어요
                </div>
                {renderContent()}
            </div>
        </div>
    );
}

export default Shop;