import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ChallengeDetailView from './ChallengeDetailView';

function ChallengeDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [challenge, setChallenge] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchChallenge = async () => {
            try {
                if (!id || Number.isNaN(Number(id))) {
                    setErrorMessage('유효하지 않은 챌린지 경로입니다.');
                    return;
                }

                const username = localStorage.getItem('username');
                const headers = {};
                if (username) headers['X-Username'] = username;

                const response = await fetch(`/api/challenges/${id}`, { headers });
                
                if (!response.ok) {
                    alert('챌린지를 불러올 수 없습니다.');
                    navigate('/ongoing-challenges');
                    return;
                }

                const data = await response.json();
                const resolved = data?.data || data;
                if (!resolved || typeof resolved !== 'object' || !resolved.challenge_id) {
                    setErrorMessage('챌린지 정보를 불러오지 못했습니다.');
                    return;
                }
                setChallenge(resolved);
            } catch (error) {
                console.error('챌린지 로드 실패:', error);
                setErrorMessage('챌린지를 불러오는 중 오류가 발생했습니다.');
            } finally {
                setLoading(false);
            }
        };

        fetchChallenge();
    }, [id, navigate]);

    const handleClose = () => {
        navigate('/ongoing-challenges');
    };

    if (loading) {
        return (
            <div style={{ 
                minHeight: '100vh', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                backgroundColor: '#eeeeee'
            }}>
                <p>로딩 중...</p>
            </div>
        );
    }

    if (!challenge) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#eeeeee' }}>
                <div style={{ textAlign: 'center' }}>
                    <p>{errorMessage || '챌린지 정보를 찾을 수 없습니다.'}</p>
                    <button
                        onClick={() => navigate('/ongoing-challenges')}
                        style={{ marginTop: '12px', padding: '8px 14px', borderRadius: '8px', border: '1px solid #247b7b', background: 'white', color: '#247b7b', cursor: 'pointer' }}
                    >
                        목록으로 돌아가기
                    </button>
                </div>
            </div>
        );
    }

    return <ChallengeDetailView challenge={challenge} onClose={handleClose} isPage={true} />;
}

export default ChallengeDetailPage;
