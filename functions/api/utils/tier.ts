const TIER_THRESHOLDS = [
  { tier: "bronze", minScore: 0 },
  { tier: "silver", minScore: 200 },
  { tier: "gold", minScore: 500 },
  { tier: "platinum", minScore: 800 },
  { tier: "emerald", minScore: 1200 },
  { tier: "diamond", minScore: 1600 },
  { tier: "master", minScore: 3000 },
  { tier: "challenger", minScore: 6000 },
];

export const resolveTierFromScore = (score: number) => {
  const normalizedScore = Number.isFinite(score)
    ? Math.max(0, Math.floor(score))
    : 0;

  for (let index = TIER_THRESHOLDS.length - 1; index >= 0; index -= 1) {
    const threshold = TIER_THRESHOLDS[index];
    if (normalizedScore >= threshold.minScore) {
      return threshold.tier;
    }
  }

  return "bronze";
};
