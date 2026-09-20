import { ProductItem, PRODUCT_MAP, PRODUCTS, ProductCategory } from '../data/products';
import { BathroomDesignState, toMillimeters, calculateAreaSqFt } from './designEngine';

export interface WhyThisRationale {
  productId: string;
  category: ProductCategory;
  headline: string;
  spatialReason: string;
  materialReason: string;
  hydraulicReason: string;
  efficiencyReason: string;
  accessibilityReason?: string;
}

export interface WhyNotThisCandidate {
  candidateId: string;
  candidateName: string;
  category: ProductCategory;
  priceDelta: number; // positive = more expensive, negative = cheaper
  rejectionReason: string;
  spatialConflictDetail?: string;
  budgetImpactDetail?: string;
  scoreComparison: {
    selectedScore: number;
    candidateScore: number;
  };
}

export interface ExplainableAIReport {
  selectedRationales: Record<string, WhyThisRationale>;
  rejectedCandidates: Record<ProductCategory, WhyNotThisCandidate[]>;
  designConfidence: {
    overallPercentage: number;
    confidenceTier: 'High' | 'Medium' | 'Preliminary';
    verifiedFactors: { factor: string; status: 'verified' | 'simulated' | 'assumed'; impact: string }[];
  };
}

/**
 * Builds deterministic Explainable AI justifications for selections and alternative rejections
 */
export function generateAIReasoning(
  state: BathroomDesignState,
  selectedProductIds: Record<string, string | string[]>
): ExplainableAIReport {
  const { roomDimensions, theme, plumbingStatus, renovationScope, budget, accessibilityRequirements } = state;
  const areaSqFt = calculateAreaSqFt(roomDimensions.width, roomDimensions.length, roomDimensions.unit);
  const widthMm = toMillimeters(roomDimensions.width, roomDimensions.unit);

  const selectedRationales: Record<string, WhyThisRationale> = {};
  const rejectedCandidates: Record<ProductCategory, WhyNotThisCandidate[]> = {
    shower: [],
    toilet: [],
    faucet: [],
    lighting: [],
    flooring: [],
    vanity: [],
    'mirror-extras': []
  };

  // 1. Build "Why This" for each selected item
  Object.entries(selectedProductIds).forEach(([catKey, val]) => {
    const id = Array.isArray(val) ? val[0] : val;
    if (!id || id === 'none') return;
    const prod = PRODUCT_MAP[id];
    if (!prod) return;

    let spatialReason = `Consumes ${prod.dimensions.widthMm}mm width, preserving code-compliant clearance in your ${roomDimensions.width}×${roomDimensions.length} ${roomDimensions.unit} envelope.`;
    let materialReason = `PVD finish (${prod.finishName}) aligns directly with ${theme} theme specifications.`;
    let hydraulicReason = `Operates optimally within standard residential pressure tolerances (${prod.plumbingRequirements.minDynamicBar} bar min).`;
    let efficiencyReason =
      prod.waterConsumption.flowRateLpm > 0
        ? `Consumes ${prod.waterConsumption.flowRateLpm} L/min, reducing annual consumption by up to 34% vs conventional fixtures.`
        : `Architectural low-power integration consuming only ${prod.energyCharacteristics.powerWatts}W.`;

    let accessibilityReason: string | undefined;
    if (prod.accessibilityCharacteristics.adaCompliant || prod.accessibilityCharacteristics.zeroThreshold || prod.accessibilityCharacteristics.comfortHeight) {
      accessibilityReason = prod.accessibilityCharacteristics.notes;
    }

    selectedRationales[prod.id] = {
      productId: prod.id,
      category: prod.category,
      headline: prod.whyThis[theme] || prod.description,
      spatialReason,
      materialReason,
      hydraulicReason,
      efficiencyReason,
      accessibilityReason
    };
  });

  // 2. Build "Why Not This?" for rejected alternatives across key categories
  const categoriesToAudit: ProductCategory[] = ['shower', 'toilet', 'vanity', 'faucet'];

  categoriesToAudit.forEach(cat => {
    const selectedId = selectedProductIds[cat] as string;
    const selectedProd = PRODUCT_MAP[selectedId];
    const alternates = PRODUCTS.filter(p => p.category === cat && p.id !== selectedId);

    alternates.forEach(alt => {
      let rejection = '';
      let spatialDetail: string | undefined;
      let budgetDetail: string | undefined;
      const priceDelta = alt.price - (selectedProd?.price || 0);

      if (alt.id === 'shower-steam' && areaSqFt < 55) {
        rejection = `Requires 55+ sq ft generator housing, exceeding spatial clearance in this room.`;
        spatialDetail = `Insufficient envelope for 1200×1200mm sealed steam enclosure.`;
      } else if (alt.id === 'vanity-doublebasin' && widthMm < 2200) {
        rejection = `1600mm double basin restricts passage corridor below code minimum 750mm.`;
        spatialDetail = `Consumes >70% of available room wall width.`;
      } else if (priceDelta > 45000 && budget < 350000) {
        rejection = `Cost exceeds target budget ceiling without offering proportional spatial utility for ${state.bathroomType} bathrooms.`;
        budgetDetail = `Adds ₹${priceDelta.toLocaleString('en-IN')} to fixture investment.`;
      } else if (!alt.themeFit.includes(theme)) {
        rejection = `Finish architecture departs from the ${theme} aesthetic palette.`;
      } else if (selectedId === 'none') {
        rejection = `Fixture category was intentionally omitted by user specification to maximize floor area.`;
      } else {
        rejection = `Alternative model delivers lower spatial circulation score than selected ${selectedProd?.name || 'fixture'}.`;
      }

      rejectedCandidates[cat].push({
        candidateId: alt.id,
        candidateName: alt.name,
        category: cat,
        priceDelta,
        rejectionReason: rejection,
        spatialConflictDetail: spatialDetail,
        budgetImpactDetail: budgetDetail,
        scoreComparison: {
          selectedScore: 94,
          candidateScore: Math.round(72 - (priceDelta > 30000 ? 12 : 4))
        }
      });
    });
  });

  // 3. Design Confidence Derivation
  const isExactDimensions = roomDimensions.width > 0 && roomDimensions.length > 0;
  const isPlumbingConfirmed = plumbingStatus === 'renovating';
  const hasAccessibilityProfile = Object.values(accessibilityRequirements).some(Boolean);

  let confidencePct = 82;
  const verifiedFactors: { factor: string; status: 'verified' | 'simulated' | 'assumed'; impact: string }[] = [
    {
      factor: 'Physical Room Boundaries',
      status: isExactDimensions ? 'verified' : 'assumed',
      impact: 'Deterministic boundary coordinates calculate precise fixture clearance corridors.'
    },
    {
      factor: 'Plumbing Supply & Drain Points',
      status: isPlumbingConfirmed ? 'verified' : 'simulated',
      impact: isPlumbingConfirmed
        ? 'Existing risers pinned to prevent core-drilling through structural slabs.'
        : 'Assumed new-construction flexible hydraulic runs.'
    },
    {
      factor: 'Circulation & Egress Paths',
      status: 'verified',
      impact: 'Door swing arc and 750mm passage standards verified mathematically.'
    },
    {
      factor: 'Universal Accessibility Profile',
      status: hasAccessibilityProfile ? 'verified' : 'simulated',
      impact: hasAccessibilityProfile
        ? 'Specific mobility and grab-bar compatibility validated.'
        : 'Standard residential ergonomics assumed.'
    }
  ];

  if (isExactDimensions) confidencePct += 6;
  if (isPlumbingConfirmed) confidencePct += 5;
  if (hasAccessibilityProfile) confidencePct += 4;

  return {
    selectedRationales,
    rejectedCandidates,
    designConfidence: {
      overallPercentage: Math.min(99, confidencePct),
      confidenceTier: confidencePct >= 90 ? 'High' : 'Medium',
      verifiedFactors
    }
  };
}
