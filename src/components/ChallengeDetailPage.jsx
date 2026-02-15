import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ChallengeDetailView from './ChallengeDetailView';

function ChallengeDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [challenge, setChallenge] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchChallenge = async () => {
            try {
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
                setChallenge(data.data || data);
            } catch (error) {
                console.error('챌린지 로드 실패:', error);
                alert('챌린지를 불러오는 중 오류가 발생했습니다.');
                navigate('/ongoing-challenges');
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
        return null;
    }

    return <ChallengeDetailView challenge={challenge} onClose={handleClose} isPage={true} />;
}

export default ChallengeDetailPage;
