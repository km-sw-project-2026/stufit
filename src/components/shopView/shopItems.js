import seagullImg from '../../assets/shop-items/seagull.png';
import parrotImg from '../../assets/shop-items/parrot.png';
import duckImg from '../../assets/shop-items/duck.png';
import slimeUmbrellaImg from '../../assets/shop-items/umbrella-slime.png';
import jellyfishImg from '../../assets/shop-items/jellyfish-green.png';
import pumpkinImg from '../../assets/shop-items/pumpkin.png';
import ghostImg from '../../assets/shop-items/ghost.png';
import toxicSludgeImg from '../../assets/shop-items/toxic-sludge.gif';
import anglerfishImg from '../../assets/shop-items/anglerfish.png';
import frameVip from '../../assets/shop-items/frame-vip.png';
import frameStrawberry from '../../assets/shop-items/frame-strawberry.png';
import frameLemon from '../../assets/shop-items/frame-lemon.png';
import frameMcHat from '../../assets/shop-items/frame-mchat.png';
import frameMcBurger from '../../assets/shop-items/frame-mcburger.png';
import frameCherryBlossom from '../../assets/shop-items/frame-cherryblossom.png';
import frameSuperstar from '../../assets/shop-items/frame-superstar.png';
import frameAvocado from '../../assets/shop-items/frame-avocado.png';
import frameChicken from '../../assets/shop-items/frame-chicken.png';
import bgCloud from '../../assets/shop-items/bg-cloud.png';
import bgCurtain from '../../assets/shop-items/bg-curtain.png';
import bgLemon from '../../assets/shop-items/bg-lemon.png';
import bgStage from '../../assets/shop-items/bg-stage.png';
import bgRedStar from '../../assets/shop-items/bg-redstar.png';
import bgAvocado from '../../assets/shop-items/bg-avocado.png';
import bgLightGreen from '../../assets/shop-items/bg-lightgreen.png';
import bgThrone from '../../assets/shop-items/bg-throne.png';
import bgTeeth from '../../assets/shop-items/bg-teeth.png';
import bgCrescent from '../../assets/shop-items/bg-crescent.png';
import bgPinkDots from '../../assets/shop-items/bg-pinkdots.png';
import bgTiger from '../../assets/shop-items/bg-tiger.png';
import frameDragon from '../../assets/shop-items/frame-dragon.png';

export const shopItems = [
    { id: 1, category: '프로필 테두리', name: '너는 못 사는 VIP 테두리', price: '999,999 P', color: '#fff', type: 'frame', image: frameVip, scale: 1.12, myPageScale: 2.8 },
    { id: 2, category: '프로필 테두리', name: '딸기 테두리', price: '3,000 P', color: '#fff', type: 'frame', image: frameStrawberry, scale: 1.06, myPageScale: 2.75 },
    { id: 3, category: '프로필 테두리', name: '레몬 테두리', price: '4,000 P', color: '#fff', type: 'frame', image: frameLemon, scale: 1.06, myPageScale: 2.65 },
    { id: 4, category: '프로필 테두리', name: '맥도날드 모자 테두리', price: '5,000 P', color: '#fff', type: 'frame', image: frameMcHat, scale: 1.1, myPageScale: 2.75 },
    { id: 5, category: '프로필 테두리', name: '맥도날드 햄버거 테두리', price: '5,000 P', color: '#fff', type: 'frame', image: frameMcBurger, scale: 1.1, myPageScale: 2.75 },
    { id: 6, category: '프로필 테두리', name: '벚꽃 테두리', price: '3,000 P', color: '#fff', type: 'frame', image: frameCherryBlossom, scale: 1.06, myPageScale: 2.65 },
    { id: 7, category: '프로필 테두리', name: '슈퍼스타 테두리', price: '300,000 P', color: '#fff', type: 'frame', image: frameSuperstar, scale: 1.15, myPageScale: 2.88 },
    { id: 8, category: '프로필 테두리', name: '아보카도 테두리', price: '3,000 P', color: '#fff', type: 'frame', image: frameAvocado, scale: 1.06, myPageScale: 2.65 },
    { id: 9, category: '프로필 테두리', name: '치킨 오돌뼈로 태어난 테두리', price: '10,000 P', color: '#fff', type: 'frame', image: frameChicken, scale: 1.07, myPageScale: 2.68 },
    { id: 10, category: '프로필 배경', name: '구름 배경', price: '3,000 P', color: '#fff', type: 'bg', image: bgCloud },
    { id: 11, category: '프로필 배경', name: '라이트블루 커튼 배경', price: '3,000 P', color: '#fff', type: 'bg', image: bgCurtain },
    { id: 12, category: '프로필 배경', name: '레몬 배경', price: '3,000 P', color: '#fff', type: 'bg', image: bgLemon },
    { id: 13, category: '프로필 배경', name: '무대 배경', price: '300,000 P', color: '#fff', type: 'bg', image: bgStage },
    { id: 14, category: '프로필 배경', name: '빨간별 배경', price: '3,000 P', color: '#fff', type: 'bg', image: bgRedStar },
    { id: 15, category: '프로필 배경', name: '아보카도 배경', price: '3,000 P', color: '#fff', type: 'bg', image: bgAvocado },
    { id: 16, category: '프로필 배경', name: '연두 배경', price: '3,000 P', color: '#fff', type: 'bg', image: bgLightGreen },
    { id: 17, category: '프로필 배경', name: '왕좌 배경', price: '999,999 P', color: '#fff', type: 'bg', image: bgThrone },
    { id: 18, category: '프로필 배경', name: '이빨 배경', price: '10,150 P', color: '#fff', type: 'bg', image: bgTeeth, rare: true },
    { id: 19, category: '프로필 배경', name: '초승달 배경', price: '3,000 P', color: '#fff', type: 'bg', image: bgCrescent },
    { id: 20, category: '프로필 배경', name: '핑크 점박이 배경', price: '3,000 P', color: '#fff', type: 'bg', image: bgPinkDots },
    { id: 21, category: '프로필 배경', name: '호랑이 배경', price: '999,999 P', color: '#fff', type: 'bg', image: bgTiger },
    { id: 22, category: '프로필 이미지', name: '갈매기', price: '3,000 P', color: '#ff6347', type: 'image', image: seagullImg },
    { id: 23, category: '프로필 이미지', name: '앵무새', price: '3,000 P', color: '#4169e1', type: 'image', image: parrotImg },
    { id: 24, category: '프로필 이미지', name: '오리', price: '3,000 P', color: '#9370db', type: 'image', image: duckImg },
    { id: 25, category: '프로필 이미지', name: '우산 슬라임', price: '5,000 P', color: '#8b4513', type: 'image', image: slimeUmbrellaImg },
    { id: 26, category: '프로필 이미지', name: '해파리', price: '3,000 P', color: '#fff0f5', type: 'image', image: jellyfishImg },
    { id: 27, category: '프로필 이미지', name: '펌킨', price: '4,000 P', color: '#8b0000', type: 'image', image: pumpkinImg },
    { id: 28, category: '프로필 이미지', name: '유령', price: '3,000 P', color: '#f2f2f2', type: 'image', image: ghostImg },
    { id: 29, category: '프로필 이미지', name: '유독성 슬러지', price: '10,150 P', color: '#a7d46f', type: 'image', image: toxicSludgeImg, rare: true },
    { id: 30, category: '프로필 이미지', name: '아귀', price: '3,000 P', color: '#a7d46f', type: 'image', image: anglerfishImg },
    { id: 31, category: '프로필 테두리', name: '드래곤 테두리', price: '999,999 P', color: '#fff', type: 'frame', image: frameDragon, scale: 1.14, myPageScale: 2.85 },
];

export const frameItems = shopItems.filter((item) => item.type === 'frame');
export const bgItems = shopItems.filter((item) => item.type === 'bg');
export const imageItems = shopItems.filter((item) => item.type === 'image');
