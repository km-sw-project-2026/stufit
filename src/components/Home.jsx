import MainPage from './main/Mainpage';
import ChallengeQuicklink from './main/ChallengeQuicklink';
import RankingQuicklink from './main/RankingQuicklink';
import CommunityQuicklink from './main/CommunityQuicklink';
import Footer from './main/Footer';

const Home = () => {
    return (
        <>
            <MainPage />
            <ChallengeQuicklink />
            <RankingQuicklink />
            <CommunityQuicklink />
            <Footer />
        </>
    );
};
export default Home;