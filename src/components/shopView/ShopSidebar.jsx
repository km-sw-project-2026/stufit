import React from 'react';

function ShopSidebar({ activeCategory, setActiveCategory }) {
    const categories = [
        { id: 'all', label: '전체' },
        { id: 'frame', label: '프로필 테두리' },
        { id: 'bg', label: '프로필 배경' },
        { id: 'image', label: '프로필 이미지' },
        { id: 'cart', label: '장바구니' },
    ];

    return (
        <div className="shop-sidebar">
            <div className="sidebar-menu">
                <div className="menu-header">SHOP</div>
                {categories.map((category) => (
                    <div
                        key={category.id}
                        className={`menu-item ${activeCategory === category.id ? 'active' : ''}`}
                        onClick={() => setActiveCategory(category.id)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => { if (e.key === 'Enter') setActiveCategory(category.id); }}
                    >
                        <span>{category.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ShopSidebar;
