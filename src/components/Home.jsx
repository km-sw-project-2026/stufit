import MainPage from './main/Mainpage';
import ChallengeQuicklink from './main/ChallengeQuicklink';
import RankingQuicklink from './main/RankingQuicklink';
import CommunityQuicklink from './main/CommunityQuicklink';
import Footer from './main/Footer';
import ShopQuicklink from './main/ShopQuicklink';

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