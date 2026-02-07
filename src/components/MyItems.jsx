import { useState } from 'react';
import ItemDetailModal from './modal/ItemDetailModal';
import './shopView/Shop.css';

function MyItems() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [isItemDetailOpen, setIsItemDetailOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');

  // 보유한 아이템 샘플 데이터
  const ownedItems = [
    { id: 1, category: '프로필 테두리', name: '행복한 버거 테두리', price: '3,000 P', color: '#fff4e6', type: 'frame', image: '', isUsing: true, isPurchased: true },
    { id: 2, category: '프로필 이미지', name: '반짝 하얀 이빨', price: '2,000 P', color: '#f0f8ff', type: 'image', image: '', isUsing: false, isPurchased: true },
    { id: 3, category: '프로필 배경', name: '밤하늘', price: '2,500 P', color: '#1a1a2e', type: 'bg', image: '', isUsing: false, isPurchased: true },
    { id: 4, category: '프로필 테두리', name: '달달한 아이스콘 테두리', price: '4,000 P', color: '#ffeaa7', type: 'frame', image: '', isUsing: false, isPurchased: true },
    { id: 5, category: '프로필 테두리', name: '딸기사탕 달콤테두리', price: '3,500 P', color: '#ffe0e6', type: 'frame', image: '', isUsing: false, isPurchased: true },
    { id: 6, category: '프로필 테두리', name: '멋진 캡짱', price: '4,500 P', color: '#2c3e50', type: 'frame', image: '', isUsing: false, isPurchased: true },
    { id: 7, category: '프로필 배경', name: '민트색 멋', price: '3,000 P', color: '#b8e6d5', type: 'bg', image: '', isUsing: false, isPurchased: true },
  ];

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setIsItemDetailOpen(true);
  };

  const getFilteredItems = () => {
    if (activeCategory === 'all') return ownedItems;
    return ownedItems.filter(item => item.type === activeCategory);
  };

  const filteredItems = getFilteredItems();

  const categories = [
    { id: 'all', label: '전체' },
    { id: 'frame', label: '프로필 테두리' },
    { id: 'bg', label: '프로필 배경' },
    { id: 'image', label: '프로필 이미지' },
  ];

  return (
    <div className="shop-container">
      {/* 왼쪽 사이드바 */}
      <div className="shop-sidebar">
        <div className="sidebar-menu">
          <div className="menu-header">My Item</div>
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

      {/* 오른쪽 콘텐츠 */}
      <div className="shop-main">
        <div className="shop-count">
          <span className="shop-count-number">{filteredItems.length}</span> 항목이 있어요
        </div>

        <div className="shop-items-grid">
          {filteredItems.map((item) => (
            <div 
              key={item.id} 
              className="shop-item-card"
              onClick={() => handleItemClick(item)}
            >
              {item.isUsing && (
                <div className="item-using-badge">사용중</div>
              )}
              <div 
                className="item-image"
                style={{ backgroundColor: item.color }}
              >
                {item.image && (
                  <img className="item-image-img" src={item.image} alt={item.name} />
                )}
              </div>
              <div className="item-details">
                <div className="item-category">{item.category}</div>
                <div className="item-name">{item.name}</div>
                <div className="item-price">{item.price}</div>
              </div>
            </div>
          ))}
        </div>

        {/* 페이지네이션 */}
        <div className="pagination">
          <button className="pagination-btn">&lt;</button>
          <button className="pagination-btn active">1</button>
          <button className="pagination-btn">&gt;</button>
        </div>
      </div>

      <ItemDetailModal 
        isOpen={isItemDetailOpen}
        onClose={() => setIsItemDetailOpen(false)}
        item={selectedItem}
      />
    </div>
  );
}

export default MyItems;
