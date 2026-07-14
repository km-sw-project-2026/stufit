function ShopWangbuGuni() {
  const items = [
    {
      id: 1,
      name: "왕부구니 기본",
      price: "1,000 P",
      color: "#ffcc99",
      icon: "🐠",
    },
    {
      id: 2,
      name: "왕부구니 색상: 초록",
      price: "1,500 P",
      color: "#90ee90",
      icon: "🐠",
    },
    {
      id: 3,
      name: "왕부구니 색상: 파랑",
      price: "1,500 P",
      color: "#87ceeb",
      icon: "🐠",
    },
    {
      id: 4,
      name: "왕부구니 색상: 빨강",
      price: "1,500 P",
      color: "#ff6b6b",
      icon: "🐠",
    },
    {
      id: 5,
      name: "왕부구니 색상: 보라",
      price: "2,000 P",
      color: "#da70d6",
      icon: "🐠",
    },
    {
      id: 6,
      name: "왕부구니 색상: 검정",
      price: "2,500 P",
      color: "#2f4f4f",
      icon: "🐠",
    },
    {
      id: 7,
      name: "반짝이는 왕부구니",
      price: "3,000 P",
      color: "#ffd700",
      icon: "✨🐠",
    },
    {
      id: 8,
      name: "무지개 왕부구니",
      price: "4,000 P",
      color: "#ff69b4",
      icon: "🌈🐠",
    },
  ];

  return (
    <div className="shop-items-grid">
      {items.map((item) => (
        <div key={item.id} className="shop-item-card">
          <div className="item-image" style={{ backgroundColor: item.color }}>
            <span>{item.icon}</span>
          </div>
          <div className="item-details">
            <div className="item-category">왕부구니</div>
            <div className="item-name">{item.name}</div>
            <div className="item-price">{item.price}</div>
            <button className="item-buy-btn">구매하기</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ShopWangbuGuni;
