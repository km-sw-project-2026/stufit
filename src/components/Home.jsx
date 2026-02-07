import MainPage from './main/Mainpage';
import ChallengeQuicklink from './main/ChallengeQuicklink';
import RankingQuicklink from './main/RankingQuicklink';
import ShopQuicklink from './main/ShopQuicklink';
import CommunityQuicklink from './main/CommunityQuicklink';
import Footer from './main/Footer';

const Home = () => {
    return (
        <>
            <Mainpage />
            <ChallengeQuicklink />
            <RankingQuicklink />
            <ShopQuicklink />
            <CommunityQuicklink />
            <Footer />
        </>
    );
};
export default Home;