import { useEffect, useState } from 'react';
import ItemDetailModal from './modal/ItemDetailModal';
import { shopItems } from './shopView/shopItems';
import './shopView/Shop.css';

function MyItems() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [isItemDetailOpen, setIsItemDetailOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');

  const [purchasedItemsByKey, setPurchasedItemsByKey] = useState(() => {
    const stored = localStorage.getItem('purchasedItems');
    if (!stored) return {};

    try {
      const parsed = JSON.parse(stored);
      return parsed && typeof parsed === 'object' ? parsed : {};
    } catch {
      return {};
    }
  });

  const [activeItems, setActiveItems] = useState(() => {
    try {
      const stored = localStorage.getItem('activeItems');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === 'purchasedItems') {
        try {
          const parsed = JSON.parse(e.newValue || '{}');
          setPurchasedItemsByKey(parsed && typeof parsed === 'object' ? parsed : {});
        } catch {
          setPurchasedItemsByKey({});
        }
      }
    };

    window.addEventListener('storage', onStorage);
    const onActiveStorage = (e) => {
      if (e.key === 'activeItems') {
        try {
          const parsed = JSON.parse(e.newValue || '{}');
          setActiveItems(parsed && typeof parsed === 'object' ? parsed : {});
        } catch {
          setActiveItems({});
        }
      }
    };
    window.addEventListener('storage', onActiveStorage);
    const handleActiveEvent = (ev) => {
      const next = ev?.detail || {};
      try {
        const stored = JSON.parse(localStorage.getItem('activeItems') || '{}');
        setActiveItems(stored && typeof stored === 'object' ? stored : {});
      } catch {
        setActiveItems({});
      }
    };
    window.addEventListener('activeItemsUpdated', handleActiveEvent);
    return () => window.removeEventListener('storage', onStorage);
    // cleanup additional listeners
    window.removeEventListener('storage', onActiveStorage);
    window.removeEventListener('activeItemsUpdated', handleActiveEvent);
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
