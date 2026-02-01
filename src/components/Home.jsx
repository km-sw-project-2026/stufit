import CommunityRewardModal from './modal/CommunityRewardModal';
import CreateChallengeModal from './modal/CreateChallengeModal';
import FinalGiveUpModal from './modal/FinalGiveUpModal';
import GiveUpModal from './modal/GiveUpModal';
import ChallengeDetailView from './modal/ChallengeDetailView';
import EditChallengeModal from './modal/EditChallengeModal';
import CustomAlertModal from './modal/CustomAlertModal';
import ChallengeOverModal from './modal/ChallengeOverModal';
import NewPostModal from './modal/NewPostModal';
import CustomPromptModal from './modal/CustomPromptModal';
import Header from './main/Header';

const Home = () => {
    return (
        <>
            <Header />

            {/* todo https://github.com/google-gemini/gemini-cli 를 사용하여 react 문법으로 수정 */}
            {/* <!-- 챌린지 상세보기 모달: 진행도, 목표, 참여현황 표시 --> */}
            <ChallengeDetailView />

            {/* <!-- 새로운 챌린지 생성 모달: 이름, 기간, 목표 등 입력 --> */}
            <CreateChallengeModal />

            {/* <!-- 챌린지 수정 모달: 기존 챌린지 정보 수정 --> */}
            <EditChallengeModal />

            {/* <!-- 챌린지 포기 확인 모달 (1단계): 포기 여부 확인 --> */}
            <GiveUpModal />

            {/* <!-- 챌린지 최종 포기 확인 모달 (2단계): 명언과 함께 최종 확인 --> */}
            <FinalGiveUpModal />

            {/* <!-- 커스텀 알림 모달: 일반적인 알림 메시지 표시 --> */}
            <CustomAlertModal />

            {/* <!-- 챌린지 완료 모달: 최종 점수 입력 및 순위 표시 --> */}
            <ChallengeOverModal />

            {/* <!-- New Post Modal (Notice Board) --> */}
            <NewPostModal />

            {/* <!-- 커스텀 confirm/prompt 모달 --> */}
            <CommunityRewardModal />

            <CustomPromptModal />
        </>
    );
};
export default Home;