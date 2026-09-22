import { ProductItem, PRODUCT_MAP, ProductCategory } from '../data/products';
import { BathroomDesignState, toMillimeters, calculateAreaSqFt } from './designEngine';

export type ClashType =
| 'wall-overflow'
| 'door-overlap'
| 'passage-narrow'
| 'fixture-collision'
| 'pressure-deficit';

export type ClashSeverity = 'critical' | 'warning' | 'advisory';

export interface LayoutResolution {
id: string;
strategy: 'preserve-luxury' | 'preserve-space' | 'preserve-budget';
title: string;
description: string;
tradeOff: string;
replacementSelections: Partial<Record<ProductCategory, string>>;
}

export interface ConstraintConflict {
id: string;
type: ClashType;
severity: ClashSeverity;
title: string;
message: string;
dimensionOverflowMm?: number;
involvedFixtures: string[];
resolutions: LayoutResolution[];
}

export interface ConstraintAuditResult {
hasConflicts: boolean;
criticalCount: number;
conflicts: ConstraintConflict[];
minimumPassageWidthMm: number;
circulationClearanceScore: number; // 0-100
}

/**
* Audits room constraints and fixture selections for physical, hydraulic, and door clearances
*/
export function auditConstraints(
state: BathroomDesignState,
selectedProductIds: Record<string, string | string[]>
): ConstraintAuditResult {
const { roomDimensions, roomShape, doorPosition, plumbingStatus, renovationScope } = state;
const widthMm = toMillimeters(roomDimensions.width, roomDimensions.unit);
const lengthMm = toMillimeters(roomDimensions.length, roomDimensions.unit);
const areaSqFt = calculateAreaSqFt(roomDimensions.width, roomDimensions.length, roomDimensions.unit);

const conflicts: ConstraintConflict[] = [];

const vanityId = selectedProductIds.vanity as string;
const showerId = selectedProductIds.shower as string;
const toiletId = selectedProductIds.toilet as string;

const vanity = PRODUCT_MAP[vanityId];
const shower = PRODUCT_MAP[showerId];
const toilet = PRODUCT_MAP[toiletId];

const doorSwingMm = doorPosition?.width || 850;

// 1. Check Vanity Wall Overflow & Door Swing Intersection
if (vanity) {
// In small rooms (width < 2100mm / 7ft), double basin or large freestanding vanity causes clash
const availableWallMm = widthMm - (shower ? shower.dimensions.widthMm : 900);

if (vanity.dimensions.widthMm > availableWallMm) {
const overflow = vanity.dimensions.widthMm - availableWallMm;
conflicts.push({
id: 'clash-vanity-overflow',
type: 'wall-overflow',
severity: 'critical',
title: 'Vanity Wall Width Overflow',
message: `${vanity.name} (${vanity.dimensions.widthMm}mm) exceeds available wall run (${availableWallMm}mm) by ${overflow}mm when shared with shower boundary.`,
dimensionOverflowMm: overflow,
involvedFixtures: [vanity.id, shower ? shower.id : ''],
resolutions: [
{
id: 'res-vanity-space',
strategy: 'preserve-space',
title: 'Preserve Circulation — Downscale to Floating Vanity (900mm)',
description: 'Switch to Floating Minimalist Vanity. Restores 450mm clear egress clearance.',
tradeOff: 'Single basin configuration, but maintains unobstructed circulation corridor.',
replacementSelections: { vanity: 'vanity-floating' }
},
{
id: 'res-vanity-luxury',
strategy: 'preserve-luxury',
title: 'Preserve Luxury — Freestanding Heritage Vanity (1100mm)',
description: 'Keep luxury furniture aesthetic while trimming 500mm from double basin footprint.',
tradeOff: 'Retains premium wood/marble craft while fitting wall boundary with 100mm clearance.',
replacementSelections: { vanity: 'vanity-freestanding' }
},
{
id: 'res-vanity-budget',
strategy: 'preserve-budget',
title: 'Preserve Budget — Compact Pedestal / Floating Unit',
description: 'Select streamlined floating console reducing both footprint and fixture capital.',
tradeOff: 'Reduced under-counter storage drawers.',
replacementSelections: { vanity: 'vanity-floating' }
}
]
});
}

// Door swing collision check
// If door swings inward from front wall and room is compact (< 2400mm / 8ft)
if (doorPosition?.swing === 'inward' && lengthMm < 2400 && vanity.dimensions.depthMm > 500) {
const remainingClearanceMm = lengthMm - (doorSwingMm + vanity.dimensions.depthMm + (toilet?.dimensions.depthMm || 600));
if (remainingClearanceMm < 300) {
conflicts.push({
id: 'clash-door-vanity-swing',
type: 'door-overlap',
severity: 'warning',
title: 'Door Swing Corridor Overlap',
message: `Inward door swing arc (850mm radius) intersects with vanity counter edge by ${Math.abs(remainingClearanceMm)}mm.`,
dimensionOverflowMm: Math.abs(remainingClearanceMm),
involvedFixtures: [vanity.id],
resolutions: [
{
id: 'res-door-reorient',
strategy: 'preserve-space',
title: 'Preserve Space — Specify Shallow-Depth Floating Vanity',
description: 'Install 480mm slimline floating basin console to clear 850mm door arc.',
tradeOff: 'Slightly shallower basin bowl depth.',
replacementSelections: { vanity: 'vanity-floating' }
},
{
id: 'res-door-pocket',
strategy: 'preserve-luxury',
title: 'Preserve Luxury — Specify Architectural Outward/Pocket Door',
description: 'Maintain grand vanity proportions by converting door specification to outward swing or concealed pocket door.',
tradeOff: 'Requires wall pocket rough-in during architectural framing.',
replacementSelections: {}
}
]
});
}
}
}

// 2. Check Steam Shower Cabin Footprint vs Room Area
if (shower && shower.id === 'shower-steam') {
if (areaSqFt < 55) {
const overflowSqFt = Math.round(55 - areaSqFt);
conflicts.push({
id: 'clash-steam-area',
type: 'passage-narrow',
severity: 'critical',
title: 'Steam Cabin Volumetric Incompatibility',
message: `Steam Shower Cabin requires 55+ sq ft for generator ventilation and service access. Current room is only ${Math.round(areaSqFt)} sq ft (${overflowSqFt} sq ft deficit).`,
involvedFixtures: [shower.id],
resolutions: [
{
id: 'res-shower-space',
strategy: 'preserve-space',
title: 'Preserve Space — Flush Ceiling Rain Panel (Zero Footprint)',
description: 'Recess rain head into ceiling framing. Eliminates bulky enclosure walls entirely.',
tradeOff: 'Replaces steam vapor with immersive cascade rain curtain.',
replacementSelections: { shower: 'shower-rainpanel' }
},
{
id: 'res-shower-luxury',
strategy: 'preserve-luxury',
title: 'Preserve Luxury — Thermostatic Rain + Hydro Jet Column',
description: 'Retain hydrotherapy massage jets in a slim vertical architectural column requiring zero generator clearance.',
tradeOff: 'No enclosed steam humidity, but instant dual-thermostatic temperature response.',
replacementSelections: { shower: 'shower-thermostatic' }
}
]
});
}
}

// 3. Check Minimum Passage Corridors (750mm code minimum)
const vanityDepth = vanity ? vanity.dimensions.depthMm : 0;
const toiletDepth = toilet ? toilet.dimensions.depthMm : 0;
const estimatedPassageWidthMm = (vanity && toilet)
? Math.max(600, widthMm - (vanityDepth + toiletDepth))
: widthMm;

if (vanity && toilet && estimatedPassageWidthMm < 750 && widthMm < 2000) {
const deficit = 750 - estimatedPassageWidthMm;
conflicts.push({
id: 'clash-passage-corridor',
type: 'passage-narrow',
severity: 'critical',
title: 'Passage Corridor Below 750mm Standard',
message: `Opposing fixtures restrict walking passage to ${estimatedPassageWidthMm}mm (${deficit}mm below code minimum).`,
dimensionOverflowMm: deficit,
involvedFixtures: [vanity.id, toilet.id],
resolutions: [
{
id: 'res-passage-inwall',
strategy: 'preserve-space',
title: 'Preserve Space — In-Wall Concealed Tank Toilet (540mm depth)',
description: 'Recess cistern into 2x6 wall stud cavity. Reclaims 160mm of walking corridor.',
tradeOff: 'Requires concealed in-wall carrier installation.',
replacementSelections: { toilet: 'toilet-wallhung' }
},
{
id: 'res-passage-floating-vanity',
strategy: 'preserve-luxury',
title: 'Preserve Luxury — Floating Vanity with Cantilevered Toe Kick',
description: 'Elevated floating vanity gives visual and physical floor clearance.',
tradeOff: 'Eliminates floor-standing storage plinth.',
replacementSelections: { vanity: 'vanity-floating' }
}
]
});
}

// 4. Check Plumbing Hydraulic Pressure Requirements
if (plumbingStatus === 'renovating' && !renovationScope.plumbingCanMove) {
if (shower && shower.plumbingRequirements.minDynamicBar >= 3.0) {
conflicts.push({
id: 'clash-hydraulic-pressure',
type: 'pressure-deficit',
severity: 'advisory',
title: 'High-Demand Hydraulic Flow Requirement',
message: `${shower.name} requires 3.0+ dynamic bar pressure. Standard un-boosted gravity plumbing may underperform.`,
involvedFixtures: [shower.id],
resolutions: [
{
id: 'res-pressure-eco',
strategy: 'preserve-budget',
title: 'Preserve Hydraulic Baseline — Precision Rain Panel (1.8–2.0 bar)',
description: 'Operates with Katalyst air-induction technology for powerful droplets at lower pressure.',
tradeOff: 'Standard luxury flow without requiring inline booster pump.',
replacementSelections: { shower: 'shower-rainpanel' }
}
]
});
}
}

const criticalCount = conflicts.filter(c => c.severity === 'critical').length;
let circulationClearanceScore = 95 - conflicts.length * 15;
circulationClearanceScore = Math.min(100, Math.max(35, circulationClearanceScore));

return {
hasConflicts: conflicts.length > 0,
criticalCount,
conflicts,
minimumPassageWidthMm: estimatedPassageWidthMm,
circulationClearanceScore
};
}

/**
* Applies an AI resolution to fix the clash in selections
*/
export function applyResolution(
resolution: LayoutResolution,
currentSelections: Record<string, string | string[]>
): Record<string, string | string[]> {
return {
...currentSelections,
...resolution.replacementSelections
};
}
