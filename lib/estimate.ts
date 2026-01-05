import rulesData from "@/data/rules.v1.json";

export type Currency = "EUR" | "MAD";
export type ImportMode = "voyageur" | "envoi";
export type Packaging = "opened" | "sealed" | "unknown";
export type PersonalUse = "yes" | "no" | "unsure";

export type PhoneInput = {
  price: number;
  currency: Currency;
  packaging: Packaging;
  personalUse: PersonalUse;
};

export type EstimateInput = {
  importMode: ImportMode;
  phones: PhoneInput[];
};

export type RiskLevel = "LOW" | "MEDIUM" | "HIGH";

export type TaxEstimate = {
  declaredValue: number;
  minTax: number;
  maxTax: number;
  lowRate: number;
  highRate: number;
};

export type EstimateBreakdown = {
  totals: {
    qty: number;
    totalValue: number;
    maxPrice: number;
    sealedCount: number;
    openedCount: number;
    personalYesCount: number;
    personalNoCount: number;
    personalUnsureCount: number;
  };
  risk: {
    score: number;
    level: RiskLevel;
    verdict: string;
    reasons: string[];
  };
  tax: TaxEstimate | null;
};

type ScoreBucket = {
  lt: number;
  score: number;
};

type Rules = {
  exchangeRateEurToMad: number;
  effectiveRateLow: number;
  effectiveRateHigh: number;
  risk: {
    qtyScore: { one: number; two: number; threePlus: number };
    maxPriceBuckets: ScoreBucket[];
    totalValueBuckets: ScoreBucket[];
    priceWeights: { maxPrice: number; totalValue: number };
    packagingScores: {
      noSealedOpened: number;
      oneSealed: number;
      twoPlusSealed: number;
      allOpened: number;
      default: number;
    };
    personalUseScores: {
      anyNo: number;
      allYes: number;
      someYesRestUnsure: number;
      allUnsure: number;
    };
    overrides: {
      minForThreePlus: number;
      singleOpenedPersonalMax: number;
      twoSealedMin: number;
      twoPersonalLowMax: number;
    };
    labelThresholds: {
      lowMax: number;
      mediumMax: number;
    };
  };
  notes: string[];
};

const rules = rulesData as Rules;

const roundTo = (value: number, digits = 2) => {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
};

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

const bucketScore = (value: number, buckets: ScoreBucket[]) => {
  for (const bucket of buckets) {
    if (value < bucket.lt) return bucket.score;
  }
  return buckets.length ? buckets[buckets.length - 1].score : 0;
};

const toMad = (price: number, currency: Currency) =>
  currency === "EUR" ? price * rules.exchangeRateEurToMad : price;

const riskLabel = (score: number) => {
  if (score <= rules.risk.labelThresholds.lowMax) {
    return {
      level: "LOW" as const,
      verdict: "Peu probable d'être taxé (usage personnel)."
    };
  }
  if (score <= rules.risk.labelThresholds.mediumMax) {
    return {
      level: "MEDIUM" as const,
      verdict: "Peut être taxé selon l'inspection."
    };
  }
  return {
    level: "HIGH" as const,
    verdict: "Probablement taxé ou traité comme non personnel."
  };
};

const estimateTaxRange = (totalValue: number): TaxEstimate => {
  const lowRate = rules.effectiveRateLow;
  const highRate = rules.effectiveRateHigh;
  return {
    declaredValue: roundTo(totalValue, 2),
    minTax: Math.round(totalValue * lowRate),
    maxTax: Math.round(totalValue * highRate),
    lowRate,
    highRate
  };
};

const buildReasons = (input: {
  qty: number;
  totalValue: number;
  maxPrice: number;
  sealedCount: number;
  openedCount: number;
  personalYesCount: number;
  personalNoCount: number;
}) => {
  const reasons: string[] = [];
  const isTwoPhonesPersonal =
    input.qty === 2 &&
    input.personalNoCount === 0 &&
    input.personalYesCount >= 1 &&
    input.sealedCount === 0 &&
    input.openedCount >= 1;

  if (isTwoPhonesPersonal) {
    reasons.push(
      "Deux téléphones déclarés pour usage personnel (perso + travail)."
    );
  } else if (input.qty >= 3) {
    reasons.push(
      "Vous transportez 3 téléphones ou plus, souvent perçu comme non personnel."
    );
  } else if (input.qty === 2) {
    reasons.push(
      "Deux téléphones peuvent déclencher des questions au contrôle."
    );
  }

  if (!isTwoPhonesPersonal) {
    if (input.sealedCount >= 2) {
      reasons.push(
        "Plusieurs téléphones sont scellés, ce qui ressemble à de la revente."
      );
    } else if (input.sealedCount === 1) {
      reasons.push(
        "Un téléphone scellé peut augmenter la suspicion de revente."
      );
    }

    if (input.personalNoCount >= 1) {
      reasons.push("Au moins un téléphone est déclaré comme non personnel.");
    }

    if (input.maxPrice > 8000) {
      reasons.push(
        "Au moins un téléphone a une valeur élevée, ce qui augmente le contrôle."
      );
    }

    if (input.totalValue > 15000) {
      reasons.push(
        "La valeur totale est élevée, ce qui augmente la probabilité de taxation."
      );
    }
  }

  return reasons.slice(0, 5);
};

export const getRules = () => rules;

export const estimateCosts = (input: EstimateInput): EstimateBreakdown => {
  const qty = input.phones.length;
  const pricesInMad = input.phones.map((phone) =>
    toMad(phone.price, phone.currency)
  );
  const totalValue = roundTo(
    pricesInMad.reduce((sum, price) => sum + price, 0),
    2
  );
  const maxPrice = pricesInMad.length ? Math.max(...pricesInMad) : 0;

  const sealedCount = input.phones.filter(
    (phone) => phone.packaging === "sealed"
  ).length;
  const openedCount = input.phones.filter(
    (phone) => phone.packaging === "opened"
  ).length;
  const personalYesCount = input.phones.filter(
    (phone) => phone.personalUse === "yes"
  ).length;
  const personalNoCount = input.phones.filter(
    (phone) => phone.personalUse === "no"
  ).length;
  const personalUnsureCount = input.phones.filter(
    (phone) => phone.personalUse === "unsure"
  ).length;

  let qtyScore = rules.risk.qtyScore.threePlus;
  if (qty === 1) qtyScore = rules.risk.qtyScore.one;
  if (qty === 2) qtyScore = rules.risk.qtyScore.two;

  const maxPriceScore = bucketScore(maxPrice, rules.risk.maxPriceBuckets);
  const totalValueScore = bucketScore(totalValue, rules.risk.totalValueBuckets);
  const priceScore = Math.round(
    rules.risk.priceWeights.maxPrice * maxPriceScore +
      rules.risk.priceWeights.totalValue * totalValueScore
  );

  let packagingScore = rules.risk.packagingScores.default;
  if (sealedCount === 0 && openedCount > 0) {
    packagingScore = rules.risk.packagingScores.noSealedOpened;
  }
  if (sealedCount === 1) packagingScore = rules.risk.packagingScores.oneSealed;
  if (sealedCount >= 2)
    packagingScore = rules.risk.packagingScores.twoPlusSealed;
  if (openedCount === qty) packagingScore = rules.risk.packagingScores.allOpened;

  let personalUseScore = rules.risk.personalUseScores.allUnsure;
  if (personalNoCount >= 1) {
    personalUseScore = rules.risk.personalUseScores.anyNo;
  } else if (personalYesCount === qty) {
    personalUseScore = rules.risk.personalUseScores.allYes;
  } else if (personalYesCount >= 1 && personalUnsureCount >= 1) {
    personalUseScore = rules.risk.personalUseScores.someYesRestUnsure;
  }

  let score = qtyScore + priceScore + packagingScore + personalUseScore;
  const isTwoPhonesPersonal =
    qty === 2 &&
    personalNoCount === 0 &&
    personalYesCount >= 1 &&
    sealedCount === 0 &&
    openedCount >= 1;

  if (qty >= 3) {
    score = Math.max(score, rules.risk.overrides.minForThreePlus);
  }
  if (
    qty === 1 &&
    input.phones[0]?.packaging === "opened" &&
    input.phones[0]?.personalUse === "yes"
  ) {
    score = Math.min(score, rules.risk.overrides.singleOpenedPersonalMax);
  }
  if (qty === 2 && sealedCount === 2) {
    score = Math.max(score, rules.risk.overrides.twoSealedMin);
  }
  if (isTwoPhonesPersonal) {
    score = Math.min(score, rules.risk.overrides.twoPersonalLowMax);
  }

  const clampedScore = clamp(score, 0, 100);
  const label = riskLabel(clampedScore);
  const reasons = buildReasons({
    qty,
    totalValue,
    maxPrice,
    sealedCount,
    openedCount,
    personalYesCount,
    personalNoCount
  });

  const canEstimateTax =
    input.importMode === "voyageur" &&
    clampedScore > rules.risk.labelThresholds.lowMax;

  return {
    totals: {
      qty,
      totalValue,
      maxPrice,
      sealedCount,
      openedCount,
      personalYesCount,
      personalNoCount,
      personalUnsureCount
    },
    risk: {
      score: clampedScore,
      level: label.level,
      verdict: label.verdict,
      reasons
    },
    tax: canEstimateTax ? estimateTaxRange(totalValue) : null
  };
};
