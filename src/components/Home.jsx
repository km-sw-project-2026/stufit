import MainPage from './main/MainPage';
import ChallengeQuicklink from './main/ChallengeQuicklink';
import RankingQuicklink from './main/RankingQuicklink';
import ShopQuicklink from './main/ShopQuicklink';
import CommunityQuicklink from './main/CommunityQuicklink';
import Footer from './main/Footer';

const Home = () => {
    return (
        <>
            <MainPage />
            <ChallengeQuicklink />
            <RankingQuicklink />
            <ShopQuicklink />
            <CommunityQuicklink />
            <Footer />
        </>
    );
};
export default Home;