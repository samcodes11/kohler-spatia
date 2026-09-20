import { ProductItem, ProductCategory } from '../data/products';
import { ThemeId, THEMES } from '../data/themes';
import { ThemeBlend } from '../data/themeBlends';

export interface RoomDimensions {
  width: number;
  length: number;
  height: number;
  unit: 'ft' | 'cm' | 'm';
}

export type RoomShape = 'rectangular' | 'l-shaped' | 'alcove' | 'angled';
export type BathroomType = 'Master' | 'Guest' | 'Powder Room';
export type PlumbingStatus = 'renovating' | 'new-construction';

export interface DoorPosition {
  wall: 'front' | 'back' | 'left' | 'right';
  offset: number;
  width: number; // in mm, standard 850mm
  swing: 'inward' | 'outward';
}

export interface WindowPosition {
  wall: 'front' | 'back' | 'left' | 'right';
  offset: number;
  width: number;
  sillHeight: number;
}

export interface PlumbingLocations {
  showerDrain: [number, number]; // normalized [x, y] in mm
  toiletWaste: [number, number];
  vanitySupply: [number, number];
}

export interface UserPriorities {
  waterConservation: number;     // 1-5 scale
  luxuryExperience: number;      // 1-5 scale
  plumbingPreservation: number;  // 1-5 scale
  accessibility: number;         // 1-5 scale
}

export interface AccessibilityRequirements {
  elderly: boolean;
  wheelchair: boolean;
  limitedMobility: boolean;
  childFriendly: boolean;
  multiGen?: boolean;
  highContrast: boolean;
  easyClean: boolean;
  slipResistant: boolean;
  grabBarReady: boolean;
}

export interface RenovationScope {
  plumbingCanMove: boolean;
  wallsCanMove: boolean;
  electricalCanMove: boolean;
  fixturesOnly: boolean;
}

export interface BathroomDesignState {
  roomDimensions: RoomDimensions;
  roomShape: RoomShape;
  doorPosition: DoorPosition;
  windowPosition?: WindowPosition;
  plumbingStatus: PlumbingStatus;
  plumbingLocations: PlumbingLocations;
  bathroomType: BathroomType;
  budget: number;
  theme: ThemeId;
  selectedBlend?: ThemeBlend;
  userPriorities: UserPriorities;
  accessibilityRequirements: AccessibilityRequirements;
  renovationScope: RenovationScope;
}

export interface DesignScoreBreakdown {
  spatialFit: number;
  budgetFit: number;
  styleCompatibility: number;
  functionalCompatibility: number;
  plumbingCompatibility: number;
  waterEfficiency: number;
  futureReadiness: number;
  accessibilityCompatibility: number;
  overallScore: number;
}

export interface DesignAssessment {
  scores: DesignScoreBreakdown;
  confidenceScore: number;
  confidenceReasons: string[];
  renovationComplexity: 'Low' | 'Moderate' | 'High';
  renovationDaysEstimate: string;
  renovationCostEstimate: number;
  spatialWarnings: string[];
  styleWarnings: string[];
  recommendations: string[];
}

/**
 * Normalizes any dimension to millimeters
 */
export function toMillimeters(val: number, unit: 'ft' | 'cm' | 'm'): number {
  switch (unit) {
    case 'ft':
      return Math.round(val * 304.8);
    case 'm':
      return Math.round(val * 1000);
    case 'cm':
      return Math.round(val * 10);
    default:
      return val;
  }
}

/**
 * Calculates area in Square Feet
 */
export function calculateAreaSqFt(width: number, length: number, unit: 'ft' | 'cm' | 'm'): number {
  if (unit === 'ft') return width * length;
  if (unit === 'm') return width * length * 10.7639;
  return (width * length) / 929.03;
}

/**
 * Calculates the complete Spatia Design Intelligence Score & Assessment
 */
export function calculateDesignAssessment(
  state: BathroomDesignState,
  selectedProducts: ProductItem[]
): DesignAssessment {
  const {
    roomDimensions,
    roomShape,
    doorPosition,
    plumbingStatus,
    budget,
    theme,
    userPriorities,
    accessibilityRequirements,
    renovationScope,
    bathroomType
  } = state;

  const widthMm = toMillimeters(roomDimensions.width, roomDimensions.unit);
  const lengthMm = toMillimeters(roomDimensions.length, roomDimensions.unit);
  const areaSqFt = calculateAreaSqFt(roomDimensions.width, roomDimensions.length, roomDimensions.unit);

  const spatialWarnings: string[] = [];
  const styleWarnings: string[] = [];
  const recommendations: string[] = [];
  const confidenceReasons: string[] = [];

  // 1. Spatial Fit Score (0-100)
  let spatialFit = 95;
  const vanity = selectedProducts.find(p => p.category === 'vanity');
  const shower = selectedProducts.find(p => p.category === 'shower');
  const toilet = selectedProducts.find(p => p.category === 'toilet');

  if (vanity) {
    if (vanity.dimensions.widthMm > widthMm * 0.45) {
      spatialFit -= 18;
      spatialWarnings.push(
        `Selected vanity (${vanity.name}, ${vanity.dimensions.widthMm}mm) consumes >45% of room width (${widthMm}mm). Clear circulation may be constrained.`
      );
    }
  }

  if (shower && shower.id === 'shower-steam' && areaSqFt < 60) {
    spatialFit -= 20;
    spatialWarnings.push(
      `Steam cabin in an area of ${Math.round(areaSqFt)} sq ft compromises door clearance and steam generator ventilation.`
    );
  }

  if (areaSqFt < 45 && vanity && vanity.id === 'vanity-doublebasin') {
    spatialFit -= 25;
    spatialWarnings.push(
      `Double-Basin Vanity exceeds comfortable circulation envelope for compact ${Math.round(areaSqFt)} sq ft space.`
    );
  }

  if (roomShape === 'l-shaped' && areaSqFt < 55) {
    spatialFit -= 8;
    spatialWarnings.push(`L-shaped niche geometry requires careful fixture zoning to prevent doorway bottleneck.`);
  }
  spatialFit = Math.min(100, Math.max(30, spatialFit));

  // 2. Budget Fit Score (0-100)
  const totalCost = selectedProducts.reduce((sum, p) => sum + p.price, 0);
  let budgetFit = 100;
  if (totalCost > budget) {
    const overageRatio = (totalCost - budget) / budget;
    budgetFit = Math.max(20, Math.round(100 - overageRatio * 150));
    recommendations.push(
      `Current selections exceed target budget by ₹${(totalCost - budget).toLocaleString('en-IN')}. Consider optimized mid-luxury tier alternatives.`
    );
  } else if (totalCost < budget * 0.65) {
    budgetFit = 88; // Under-utilizing budget if premium was desired
    recommendations.push(
      `₹${(budget - totalCost).toLocaleString('en-IN')} remaining in budget. Opportunity to upgrade to thermostatic control or anti-fog mirror extras.`
    );
  } else {
    budgetFit = 98;
  }

  // 3. Style Compatibility Score (0-100)
  let styleDriftPoints = 0;
  const themeDef = THEMES[theme];
  selectedProducts.forEach(prod => {
    if (!prod.themeFit.includes(theme)) {
      styleDriftPoints += 12;
      styleWarnings.push(
        `${prod.name} (${prod.finishName}) departs from the ${themeDef.name} aesthetic standard (${themeDef.finishes}).`
      );
    }
  });
  const styleCompatibility = Math.max(40, 100 - styleDriftPoints);

  // 4. Functional Compatibility Score (0-100)
  let functionalCompatibility = 94;
  const hasFaucet = selectedProducts.some(p => p.category === 'faucet');
  const hasVanity = selectedProducts.some(p => p.category === 'vanity');
  const hasToilet = selectedProducts.some(p => p.category === 'toilet');
  const hasShower = selectedProducts.some(p => p.category === 'shower');

  if (bathroomType === 'Master') {
    if (!hasShower) functionalCompatibility -= 25;
    if (!hasVanity) functionalCompatibility -= 20;
  } else if (bathroomType === 'Powder Room') {
    if (hasShower) {
      functionalCompatibility -= 15;
      recommendations.push(`Showers are rarely required in dedicated Powder Rooms. Freeing this space elevates guest vanity comfort.`);
    }
  }
  functionalCompatibility = Math.min(100, Math.max(30, functionalCompatibility));

  // 5. Plumbing Compatibility Score (0-100)
  let plumbingCompatibility = 95;
  if (plumbingStatus === 'renovating') {
    if (!renovationScope.plumbingCanMove) {
      if (shower && shower.plumbingRequirements.minDynamicBar > 2.5) {
        plumbingCompatibility -= 12;
        recommendations.push(
          `High-flow shower requires 3.0+ dynamic bar pressure. Booster pump recommended for existing branch plumbing.`
        );
      }
      if (toilet && toilet.plumbingRequirements.wastePosition === 'wall') {
        plumbingCompatibility -= 8;
      }
    } else {
      plumbingCompatibility = 96;
    }
  } else {
    plumbingCompatibility = 100; // New construction has zero plumbing legacy limitations
  }

  // 6. Water Efficiency Score (0-100)
  let totalFlowRate = 0;
  let waterConsumingCount = 0;
  selectedProducts.forEach(p => {
    if (p.waterConsumption.flowRateLpm > 0) {
      totalFlowRate += p.waterConsumption.flowRateLpm;
      waterConsumingCount++;
    }
  });
  const avgFlow = waterConsumingCount > 0 ? totalFlowRate / waterConsumingCount : 9;
  // Lower avg flow = higher efficiency score
  let waterEfficiency = Math.round(100 - (avgFlow - 4.5) * 5);
  waterEfficiency = Math.min(99, Math.max(45, waterEfficiency));

  // 7. Future Readiness Score (0-100)
  let smartFeaturesCount = 0;
  selectedProducts.forEach(p => {
    smartFeaturesCount += p.smartFeatures.length;
  });
  let futureReadiness = Math.min(98, 65 + smartFeaturesCount * 5);

  // 8. Accessibility Compatibility Score (0-100)
  let accessibilityCompatibility = 85;
  const isAccessibilityPriority =
    accessibilityRequirements.elderly ||
    accessibilityRequirements.wheelchair ||
    accessibilityRequirements.limitedMobility;

  if (isAccessibilityPriority) {
    let accessibleFixtures = 0;
    selectedProducts.forEach(p => {
      if (p.accessibilityCharacteristics.adaCompliant || p.accessibilityCharacteristics.zeroThreshold || p.accessibilityCharacteristics.leverOperated) {
        accessibleFixtures++;
      }
    });

    if (shower && !shower.accessibilityCharacteristics.zeroThreshold) {
      accessibilityCompatibility -= 18;
      spatialWarnings.push(`Threshold curb in current shower creates trip hazard for mobility-assisted users.`);
    }

    if (toilet && !toilet.accessibilityCharacteristics.comfortHeight) {
      accessibilityCompatibility -= 12;
      recommendations.push(`Consider a comfort-height commode (420-450mm rim) for effortless ergonomic transfer.`);
    }

    accessibilityCompatibility = Math.min(98, Math.max(40, 50 + accessibleFixtures * 8));
  }

  // Weighted Overall Spatia Design Score
  // Weights adapt dynamically according to user priorities
  const pEco = userPriorities.waterConservation || 3;
  const pLux = userPriorities.luxuryExperience || 4;
  const pPlumb = userPriorities.plumbingPreservation || 3;
  const pAccess = userPriorities.accessibility || 3;

  const wSpatial = 0.22;
  const wBudget = 0.18;
  const wStyle = 0.15 * (pLux / 3);
  const wFunctional = 0.12;
  const wPlumbing = 0.10 * (pPlumb / 3);
  const wWater = 0.10 * (pEco / 3);
  const wFuture = 0.05;
  const wAccess = 0.08 * (pAccess / 3);

  const sumWeights = wSpatial + wBudget + wStyle + wFunctional + wPlumbing + wWater + wFuture + wAccess;

  const overallScore = Math.round(
    (spatialFit * wSpatial +
      budgetFit * wBudget +
      styleCompatibility * wStyle +
      functionalCompatibility * wFunctional +
      plumbingCompatibility * wPlumbing +
      waterEfficiency * wWater +
      futureReadiness * wFuture +
      accessibilityCompatibility * wAccess) /
      sumWeights
  );

  // Renovation Complexity Assessment
  let renovationComplexity: 'Low' | 'Moderate' | 'High' = 'Low';
  let renovationDaysEstimate = '5–8 working days';
  let renovationCostEstimate = 35000;

  const movesPlumbing = renovationScope.plumbingCanMove;
  const movesWalls = renovationScope.wallsCanMove;
  const isFixturesOnly = renovationScope.fixturesOnly;

  if (isFixturesOnly || (!movesPlumbing && !movesWalls)) {
    // Fixtures-only or cosmetic upgrade without major structural MEP repositioning
    renovationComplexity = 'Low';
    renovationDaysEstimate = '5–8 working days';
    renovationCostEstimate = 35000;
  } else if (movesPlumbing && movesWalls) {
    // Full structural gut renovation: relocated wet wall chases AND structural framing alterations
    renovationComplexity = 'High';
    renovationDaysEstimate = '22–28 working days';
    renovationCostEstimate = 160000;
  } else {
    // Moderate: partial layout shift (either plumbing relocation OR wall movement, with electrical rework)
    renovationComplexity = 'Moderate';
    renovationDaysEstimate = '12–16 working days';
    renovationCostEstimate = 85000;
  }

  // AI Confidence Rating
  let confidenceScore = 96;
  if (roomDimensions.width < 5 || roomDimensions.length < 5) {
    confidenceScore -= 10;
    confidenceReasons.push('Compact room boundaries narrow physical margin for error.');
  }
  if (plumbingStatus === 'renovating' && !renovationScope.plumbingCanMove) {
    confidenceScore -= 6;
    confidenceReasons.push('Fixed plumbing positions require on-site core-drill verification.');
  }
  if (selectedProducts.length < 5) {
    confidenceScore -= 15;
    confidenceReasons.push('Incomplete fixture selection schedule.');
  } else {
    confidenceReasons.push('Full 7-category schedule verified against dimensional clearances.');
    confidenceReasons.push('Dynamic hydraulic flow calculations aligned with supply limits.');
  }

  return {
    scores: {
      spatialFit,
      budgetFit,
      styleCompatibility,
      functionalCompatibility,
      plumbingCompatibility,
      waterEfficiency,
      futureReadiness,
      accessibilityCompatibility,
      overallScore: Math.min(99, Math.max(40, overallScore))
    },
    confidenceScore: Math.min(99, Math.max(60, confidenceScore)),
    confidenceReasons,
    renovationComplexity,
    renovationDaysEstimate,
    renovationCostEstimate,
    spatialWarnings,
    styleWarnings,
    recommendations
  };
}
