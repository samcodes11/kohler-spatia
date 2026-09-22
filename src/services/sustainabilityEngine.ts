import { ProductItem } from '../data/products';
import { BathroomType } from './designEngine';

export interface SustainabilityMetrics {
annualWaterConsumptionLitres: number;
baselineWaterConsumptionLitres: number;
annualWaterSavingsLitres: number;
waterSavingsPercentage: number;
annualHotWaterEnergyKwh: number;
baselineHotWaterEnergyKwh: number;
annualEnergySavingsKwh: number;
annualCarbonOffsetKgCo2: number;
annualUtilitySavingsInr: number;
waterEfficiencyScore: number; // 0-100
energyEfficiencyScore: number; // 0-100
leedPointsContribution: number;
}

export interface ComparisonLineItem {
fixtureCategory: string;
baselineSpec: string;
baselineFlow: string;
baselineAnnualLitres: number;
spatiaSpec: string;
spatiaFlow: string;
spatiaAnnualLitres: number;
savingsPercent: number;
}

export interface ScatterPoint {
id: string;
name: string;
cost: number;
annualLitres: number;
savingsPercent: number;
valueBadge: string;
isCurrent?: boolean;
}

export interface TradeoffBubblePoint {
id: string;
name: string;
cost: number;
luxuryScore: number; // 0-100
waterSavingsPercent: number; // radius indicator
valueBadge: string;
isCurrent?: boolean;
}

export interface SustainabilityDashboardData {
metrics: SustainabilityMetrics;
comparisonTable: ComparisonLineItem[];
graph1ScatterData: ScatterPoint[];
graph2BubbleData: TradeoffBubblePoint[];
}

/**
* Calculates deterministic water, energy, and environmental impact metrics
*/
export function calculateSustainability(
selectedProducts: ProductItem[],
bathroomType: BathroomType = 'Master'
): SustainabilityDashboardData {
// Occupancy multiplier
const occupants = bathroomType === 'Master' ? 2.5 : bathroomType === 'Guest' ? 1.2 : 0.8;
const daysPerYear = 365;

// Usage assumptions per person per day:
// - 1 shower of 8 minutes
// - 4 toilet flushes
// - 5 faucet handwash/teeth cycles of 45 seconds (0.75 mins)

const shower = selectedProducts.find(p => p.category === 'shower');
const toilet = selectedProducts.find(p => p.category === 'toilet');
const faucet = selectedProducts.find(p => p.category === 'faucet');

// Baseline standard builder specifications:
const baselineShowerFlowLpm = 18.0;
const baselineToiletFlushLitres = 6.0;
const baselineFaucetFlowLpm = 8.0;

// Selected Spatia specifications (0 if omitted):
const spatiaShowerFlowLpm = shower ? shower.waterConsumption.flowRateLpm : 0;
const spatiaToiletFlushLitres = toilet ? (toilet.id === 'toilet-smart' ? 3.8 : toilet.id === 'toilet-wallhung' ? 4.2 : 4.8) : 0;
const spatiaFaucetFlowLpm = faucet ? faucet.waterConsumption.flowRateLpm : 0;

// Annual Water Calculations (0 if fixture omitted)
// Shower
const baselineShowerAnnual = shower ? Math.round(occupants * 1 * 8 * baselineShowerFlowLpm * daysPerYear) : 0;
const spatiaShowerAnnual = shower ? Math.round(occupants * 1 * 8 * spatiaShowerFlowLpm * daysPerYear) : 0;

// Toilet
const baselineToiletAnnual = toilet ? Math.round(occupants * 4 * baselineToiletFlushLitres * daysPerYear) : 0;
const spatiaToiletAnnual = toilet ? Math.round(occupants * 4 * spatiaToiletFlushLitres * daysPerYear) : 0;

// Faucet
const baselineFaucetAnnual = faucet ? Math.round(occupants * 5 * 0.75 * baselineFaucetFlowLpm * daysPerYear) : 0;
const spatiaFaucetAnnual = faucet ? Math.round(occupants * 5 * 0.75 * spatiaFaucetFlowLpm * daysPerYear) : 0;

const baselineTotalLitres = baselineShowerAnnual + baselineToiletAnnual + baselineFaucetAnnual;
const spatiaTotalLitres = spatiaShowerAnnual + spatiaToiletAnnual + spatiaFaucetAnnual;
const annualWaterSavingsLitres = Math.max(0, baselineTotalLitres - spatiaTotalLitres);
const waterSavingsPercentage = baselineTotalLitres > 0 
? Math.round((annualWaterSavingsLitres / baselineTotalLitres) * 100)
: 0;

// Energy to heat shower & faucet water (approx 70% of bathroom water is heated by 25°C ΔT)
// Specific heat of water: 4.184 kJ/kg/°C = 0.001162 kWh per litre per °C
const kwhPerLitreHeated = 0.001162 * 25; // ~0.029 kWh per heated litre
const baselineHotWaterLitres = (baselineShowerAnnual + baselineFaucetAnnual) * 0.75;
const spatiaHotWaterLitres = (spatiaShowerAnnual + spatiaFaucetAnnual) * 0.75;

const baselineHotWaterEnergyKwh = Math.round(baselineHotWaterLitres * kwhPerLitreHeated);
const annualHotWaterEnergyKwh = Math.round(spatiaHotWaterLitres * kwhPerLitreHeated);
const annualEnergySavingsKwh = Math.max(0, baselineHotWaterEnergyKwh - annualHotWaterEnergyKwh);

// Carbon emissions factor: ~0.82 kg CO2 per kWh in municipal grid
const annualCarbonOffsetKgCo2 = Math.round(annualEnergySavingsKwh * 0.82);

// Utility tariff estimate: ₹0.06 per litre water + ₹8.5 per kWh electric
const annualUtilitySavingsInr = Math.round(
annualWaterSavingsLitres * 0.06 + annualEnergySavingsKwh * 8.5
);

const waterEfficiencyScore = Math.min(99, Math.max(50, 60 + Math.round(waterSavingsPercentage * 0.9)));
const energyEfficiencyScore = Math.min(98, Math.max(50, 65 + Math.round((annualEnergySavingsKwh / 900) * 30)));
const leedPointsContribution = waterSavingsPercentage >= 40 ? 5 : waterSavingsPercentage >= 30 ? 4 : 3;

// Comparison Table
const comparisonTable: ComparisonLineItem[] = [
{
fixtureCategory: 'Shower System',
baselineSpec: shower ? 'Builder Grade Showerhead' : 'None (Omitted)',
baselineFlow: shower ? '18.0 L/min' : '0 L/min',
baselineAnnualLitres: baselineShowerAnnual,
spatiaSpec: shower ? shower.name : 'None (Omitted)',
spatiaFlow: `${spatiaShowerFlowLpm} L/min`,
spatiaAnnualLitres: spatiaShowerAnnual,
savingsPercent: baselineShowerAnnual > 0 ? Math.round(((baselineShowerAnnual - spatiaShowerAnnual) / baselineShowerAnnual) * 100) : 0
},
{
fixtureCategory: 'Sanitation Commode',
baselineSpec: toilet ? 'Conventional Gravity Cistern' : 'None (Omitted)',
baselineFlow: toilet ? '6.0 L / flush' : '0 L/flush',
baselineAnnualLitres: baselineToiletAnnual,
spatiaSpec: toilet ? toilet.name : 'None (Omitted)',
spatiaFlow: `${spatiaToiletFlushLitres} L / flush`,
spatiaAnnualLitres: spatiaToiletAnnual,
savingsPercent: baselineToiletAnnual > 0 ? Math.round(((baselineToiletAnnual - spatiaToiletAnnual) / baselineToiletAnnual) * 100) : 0
},
{
fixtureCategory: 'Basin Faucet',
baselineSpec: faucet ? 'Standard Dual Handle Aerator' : 'None (Omitted)',
baselineFlow: faucet ? '8.0 L/min' : '0 L/min',
baselineAnnualLitres: baselineFaucetAnnual,
spatiaSpec: faucet ? faucet.name : 'None (Omitted)',
spatiaFlow: `${spatiaFaucetFlowLpm} L/min`,
spatiaAnnualLitres: spatiaFaucetAnnual,
savingsPercent: baselineFaucetAnnual > 0 ? Math.round(((baselineFaucetAnnual - spatiaFaucetAnnual) / baselineFaucetAnnual) * 100) : 0
}
];

// Total cost of current selections
const currentTotalCost = selectedProducts.reduce((sum, p) => sum + p.price, 0);

// Graph 1: Water vs Cost (Exactly 4 points: Essentials, Balanced, Signature, Current)
const graph1ScatterData: ScatterPoint[] = [
{
id: 'tier-essentials',
name: 'Essentials Tier',
cost: 142000,
annualLitres: 18400,
savingsPercent: 26,
valueBadge: '18,400 L/yr • ₹1,42,000',
isCurrent: false
},
{
id: 'tier-balanced',
name: 'Balanced Tier',
cost: 268000,
annualLitres: 13900,
savingsPercent: 44,
valueBadge: '13,900 L/yr • ₹2,68,000',
isCurrent: false
},
{
id: 'tier-signature',
name: 'Signature Tier',
cost: 485000,
annualLitres: 11200,
savingsPercent: 55,
valueBadge: '11,200 L/yr • ₹4,85,000',
isCurrent: false
},
{
id: 'tier-current',
name: 'Your Selection',
cost: currentTotalCost,
annualLitres: spatiaTotalLitres,
savingsPercent: waterSavingsPercentage,
valueBadge: `${spatiaTotalLitres.toLocaleString('en-IN')} L/yr • ₹${currentTotalCost.toLocaleString('en-IN')}`,
isCurrent: true
}
];

// Graph 2: Luxury vs Cost vs Eco (Exactly 4 bubbles: Essentials, Balanced, Signature, Current)
const premiumCount = selectedProducts.filter(p => p.tier === 'Premium').length;
const currentLuxuryScore = Math.min(99, Math.max(68, 70 + premiumCount * 5));

const graph2BubbleData: TradeoffBubblePoint[] = [
{
id: 'bubble-essentials',
name: 'Essentials Tier',
cost: 142000,
luxuryScore: 72,
waterSavingsPercent: 26,
valueBadge: '72/100 Lux • ₹1,42,000',
isCurrent: false
},
{
id: 'bubble-balanced',
name: 'Balanced Tier',
cost: 268000,
luxuryScore: 86,
waterSavingsPercent: 44,
valueBadge: '86/100 Lux • ₹2,68,000',
isCurrent: false
},
{
id: 'bubble-signature',
name: 'Signature Tier',
cost: 485000,
luxuryScore: 98,
waterSavingsPercent: 55,
valueBadge: '98/100 Lux • ₹4,85,000',
isCurrent: false
},
{
id: 'bubble-current',
name: 'Your Selection',
cost: currentTotalCost,
luxuryScore: currentLuxuryScore,
waterSavingsPercent: waterSavingsPercentage,
valueBadge: `${currentLuxuryScore}/100 Lux • ₹${currentTotalCost.toLocaleString('en-IN')}`,
isCurrent: true
}
];

return {
metrics: {
annualWaterConsumptionLitres: spatiaTotalLitres,
baselineWaterConsumptionLitres: baselineTotalLitres,
annualWaterSavingsLitres,
waterSavingsPercentage,
annualHotWaterEnergyKwh,
baselineHotWaterEnergyKwh,
annualEnergySavingsKwh,
annualCarbonOffsetKgCo2,
annualUtilitySavingsInr,
waterEfficiencyScore,
energyEfficiencyScore,
leedPointsContribution
},
comparisonTable,
graph1ScatterData,
graph2BubbleData
};
}
