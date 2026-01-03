import rulesData from "@/data/rules.v1.json";

export type Currency = "EUR" | "MAD";
export type Condition = "neuf" | "occasion";
export type ImportMode = "voyageur" | "envoi";

export type EstimateInput = {
  price: number;
  currency: Currency;
  condition: Condition;
  importMode: ImportMode;
  quantity: number;
};

export type EstimateRange = {
  low: number;
  high: number;
};

export type EstimateBreakdown = {
  customsValue: number;
  duty: EstimateRange;
  vat: EstimateRange;
  fixedFees: EstimateRange;
  total: EstimateRange;
};

type Rules = {
  exchangeRateEurToMad: number;
  vatRate: number;
  dutyRateLow: number;
  dutyRateHigh: number;
  fixedFeesLow?: number;
  fixedFeesHigh?: number;
  conditionMultipliers?: Record<Condition, number>;
  notes: string[];
};

const rules = rulesData as Rules;

const roundTo = (value: number, digits = 2) => {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
};

export const getRules = () => rules;

export const estimateCosts = (input: EstimateInput): EstimateBreakdown => {
  const priceInMad =
    input.currency === "EUR"
      ? input.price * rules.exchangeRateEurToMad
      : input.price;

  const baseValue = priceInMad * input.quantity;
  const conditionMultiplier = rules.conditionMultipliers?.[input.condition] ?? 1;
  const customsValue = roundTo(baseValue * conditionMultiplier);

  const feesLow = input.importMode === "envoi" ? rules.fixedFeesLow ?? 0 : 0;
  const feesHigh = input.importMode === "envoi" ? rules.fixedFeesHigh ?? 0 : 0;

  const dutyLow = roundTo(customsValue * rules.dutyRateLow);
  const dutyHigh = roundTo(customsValue * rules.dutyRateHigh);

  const vatLow = roundTo((customsValue + dutyLow + feesLow) * rules.vatRate);
  const vatHigh = roundTo((customsValue + dutyHigh + feesHigh) * rules.vatRate);

  const totalLow = roundTo(dutyLow + vatLow + feesLow);
  const totalHigh = roundTo(dutyHigh + vatHigh + feesHigh);

  return {
    customsValue,
    duty: { low: dutyLow, high: dutyHigh },
    vat: { low: vatLow, high: vatHigh },
    fixedFees: { low: feesLow, high: feesHigh },
    total: { low: totalLow, high: totalHigh }
  };
};
