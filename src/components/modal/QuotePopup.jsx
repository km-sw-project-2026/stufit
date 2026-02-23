import { useState } from 'react';

const quotes = [
    "지금 포기하는 건 게으른게 아니라, 스스로를 포기한거다.",
    "노력하지 않은 미래를 후회하는 게 제일 추하다.",
    "경쟁자는 나와 어제의 나일뿐이다.",
    "양심을 버린 순간부터 너는 이미 변명 속에서 산다.",
    "재능이 없어서가 아니라, 끝까지 하지 않아서 평범한 것이다.",
    "아무것도 하지 않으면서 바라는 건 꿈이 아니라 욕심이다.",
    "변명은 노력보다 쉽고, 후회는 변명보다 오래 간다.",
    "당신이 안 하는 동안, 누군가는 이미 당신을 추월했다.",
    "할 수 있었는데 안 한 선택들이 결국 당신의 한계를 만든다.",
    "힘들다는 이유로 멈추는 순간, 당신의 목표도 당신을 포기한다."
];

function QuotePopup({ isOpen, onClose }) {
    const [randomQuote] = useState(() => {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        return quotes[randomIndex];
    });

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000
        }} onClick={onClose}>
            <div style={{
                backgroundColor: 'white',
                borderRadius: '20px',
                padding: '40px 30px',
                maxWidth: '400px',
                textAlign: 'center',
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
            }} onClick={(e) => e.stopPropagation()}>
                <p style={{
                    fontSize: '1.2rem',
                    fontWeight: '600',
                    lineHeight: '1.6',
                    color: '#333',
                    marginBottom: '30px',
                    marginTop: '20px'
                }}>
                    {randomQuote}
                </p>
                <button onClick={onClose} style={{
                    backgroundColor: '#247b7b',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '12px 40px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s'
                }} onMouseEnter={(e) => e.target.style.backgroundColor = '#1f6157'} onMouseLeave={(e) => e.target.style.backgroundColor = '#247b7b'}>
                    확인
                </button>
            </div>
        </div>
    );
}

export default QuotePopup;
