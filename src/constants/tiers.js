export const TIER_GUIDE = [
  {
    name: "Bronze",
    minScore: 0,
    image: "/img/Bronze.png",
    progressColor: "#A97142",
  },
  {
    name: "Silver",
    minScore: 400,
    image: "/img/Silver.png",
    progressColor: "#8B949E",
  },
  {
    name: "Gold",
    minScore: 1000,
    image: "/img/Gold.png",
    progressColor: "#D4AF37",
  },
  {
    name: "Platinum",
    minScore: 1600,
    image: "/img/Platinum.png",
    progressColor: "#4FB1C6",
  },
  {
    name: "Emerald",
    minScore: 2400,
    image: "/img/Emerald.png",
    progressColor: "#2FA66A",
  },
  {
    name: "Diamond",
    minScore: 3200,
    image: "/img/Diamond.png",
    progressColor: "#3C84FF",
  },
  {
    name: "Master",
    minScore: 6000,
    image: "/img/Master.png",
    progressColor: "#7E57C2",
  },
  {
    name: "Challenger",
    minScore: 12000,
    image: "/img/Challenger.png",
    progressColor: "#E53935",
  },
];

const normalizeScore = (score) => {
  const numeric = Number(score);
  if (Number.isNaN(numeric)) return 0;
  return Math.max(0, numeric);
};

export const getTierByScore = (score) => {
  const normalizedScore = normalizeScore(score);

  for (let index = TIER_GUIDE.length - 1; index >= 0; index -= 1) {
    const tier = TIER_GUIDE[index];
    if (normalizedScore >= tier.minScore) {
      return { ...tier, index };
    }
  }

  return { ...TIER_GUIDE[0], index: 0 };
};

export const getTierProgress = (score) => {
  const normalizedScore = normalizeScore(score);
  const currentTier = getTierByScore(normalizedScore);
  const nextTier = TIER_GUIDE[currentTier.index + 1] || null;

  if (!nextTier) {
    return {
      currentTier,
      nextTier: null,
      progressPercent: 100,
      remainingScore: 0,
    };
  }

  const tierRange = nextTier.minScore - currentTier.minScore;
  const progressedScore = normalizedScore - currentTier.minScore;
  const rawProgress = tierRange <= 0 ? 1 : progressedScore / tierRange;
  const progressPercent = Math.round(
    Math.min(1, Math.max(0, rawProgress)) * 100,
  );

  return {
    currentTier,
    nextTier,
    progressPercent,
    remainingScore: Math.max(0, nextTier.minScore - normalizedScore),
  };
};
