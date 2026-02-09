function Footer() {
  return (
    <div className="footer">
      <div className="footer-content">
        <div className="footer-links">
          <a href="#">이용약관</a>
          <a href="#" className="bold">개인정보</a>
          <a href="#">처리방침</a>
          <a href="#" className="bold">고객센터</a>
          <a href="#">문의하기</a>
          <a href="#">광고 상품 안내</a>
        </div>
        <div className="footer-info">
          근명고등학교: 경기도 안양시 만안구 삼덕로 49 : 평일 9시~18시(<a href="tel:1566-5192">1566-5192</a>)
        </div>
      </div>
      <div className="footer-social">
        <a href="#" className="social-icon talk">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="white" stroke="none">
            <path d="M12 2C6.48 2 2 5.58 2 10c0 2.42 1.45 4.56 3.69 6l-.68 3.5c-.09.43.34.78.74.58l3.6-1.8C10.23 18.25 11.11 18.29 12 18.29c5.52 0 10-3.58 10-8s-4.48-8-10-8z"/>
            <text x="12" y="11.5" fontFamily="Arial" fontSize="6" fill="#666" textAnchor="middle" fontWeight="bold">TALK</text>
          </svg>
        </a>
        <a href="#" className="social-icon insta">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
          </svg>
        </a>
      </div>
    </div>
  );
}

export default Footer;
