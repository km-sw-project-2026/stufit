import { useEffect, useState } from 'react';
import ItemDetailModal from './modal/ItemDetailModal';
import { shopItems } from './shopView/shopItems';
import './shopView/Shop.css';

function MyItems() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [isItemDetailOpen, setIsItemDetailOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');

  const [purchasedItemsByKey, setPurchasedItemsByKey] = useState({});

  const [activeItems, setActiveItems] = useState({});

  useEffect(() => {
    const fetchUserItems = async () => {
      const userId = localStorage.getItem('userId');
      const username = localStorage.getItem('username');

      if (!userId) {
        setPurchasedItemsByKey({});
        setActiveItems({});
        return;
      }

      try {
        const response = await fetch(`/api/user/items?userId=${userId}`, {
          headers: { 'X-Username': username || '' },
        });
        const data = await response.json();

        if (!response.ok) {
          console.error('Failed to fetch user items:', data?.message);
          return;
        }

        // purchasedItems는 itemId 배열
        const itemIds = data?.purchasedItems || [];
        const purchasedMap = {};
        
        itemIds.forEach(itemId => {
          const item = shopItems.find(it => it.id === itemId);
          if (item) {
            const key = `${item.type}:${item.id}`;
            purchasedMap[key] = true;
          }
        });

        setPurchasedItemsByKey(purchasedMap);
        setActiveItems(data?.activeItems || {});
      } catch (err) {
        console.error('User items fetch error:', err);
      }
    };

    fetchUserItems();

    // 커스텀 이벤트 리스너 (아이템 구매/적용 시 리프레시)
    window.addEventListener('purchasedItemsUpdated', fetchUserItems);
    window.addEventListener('activeItemsUpdated', fetchUserItems);

    return () => {
      window.removeEventListener('purchasedItemsUpdated', fetchUserItems);
      window.removeEventListener('activeItemsUpdated', fetchUserItems);
    };
  }, []);

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setIsItemDetailOpen(true);
  };

  const ownedItems = Object.keys(purchasedItemsByKey).map((key) => {
    const parts = String(key).split(':');
    const idPart = parts.length > 1 ? parts[1] : parts[0];
    const id = Number(idPart);
    if (Number.isNaN(id)) return null;
    const found = shopItems.find((s) => s.id === id);
    if (!found) return null;
    const using = Boolean(activeItems && activeItems[found.type] === found.id);
    return { ...found, isPurchased: true, isUsing: using, _wishlistKey: key };
  }).filter(Boolean);

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
      <div className="shop-main myitems-main">
        <div className="shop-count">
          <span className="shop-count-number">{filteredItems.length}</span> 항목이 있어요
        </div>
        <div className="count-divider" />

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
              </div>
            </div>
          ))}
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
