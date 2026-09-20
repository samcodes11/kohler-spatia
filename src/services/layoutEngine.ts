import { ProductCategory } from '../data/products';
import { BathroomDesignState, toMillimeters, calculateAreaSqFt } from './designEngine';

export interface PlacedFixture3D {
  id: string;
  category: ProductCategory;
  x: number; // normalized position from center (-1 to 1)
  z: number;
  rotation: number; // in radians
  isRemoved: boolean;
}

export interface LayoutAlternative {
  id: 'space-optimized' | 'luxury-optimized' | 'accessibility-oriented';
  name: string;
  badge: string;
  tagline: string;
  description: string;
  circulationPercentage: number;
  turningCircleMm: number;
  passageCorridorMm: number;
  spatialScore: number;
  recommendedFixtures: {
    shower: string;
    toilet: string;
    vanity: string;
    faucet: string;
    lighting: string;
    flooring: string;
    'mirror-extras': string[];
  };
  placedItems: PlacedFixture3D[];
  spatialHighlights: string[];
}

/**
 * Generates 3 distinct AI layout alternatives tailored to the user's room envelope and priorities
 */
export function generateLayoutAlternatives(state: BathroomDesignState): LayoutAlternative[] {
  const { roomDimensions, theme, roomShape, bathroomType } = state;
  const widthMm = toMillimeters(roomDimensions.width, roomDimensions.unit);
  const lengthMm = toMillimeters(roomDimensions.length, roomDimensions.unit);
  const areaSqFt = calculateAreaSqFt(roomDimensions.width, roomDimensions.length, roomDimensions.unit);

  const isCompact = areaSqFt < 55;

  // 1. Layout A: Space-Optimized
  const spaceOptimized: LayoutAlternative = {
    id: 'space-optimized',
    name: 'Layout A — Space-Optimized',
    badge: 'Max Floor Circulation',
    tagline: 'Streamlined wall-hung architecture with maximized open corridor',
    description:
      'Reclaims 28% additional visual and physical floor area using in-wall carrier systems, cantilevered floating cabinetry, and a flush zero-footprint ceiling shower.',
    circulationPercentage: isCompact ? 62 : 68,
    turningCircleMm: Math.min(1350, Math.round(widthMm * 0.48)),
    passageCorridorMm: Math.max(850, Math.round(widthMm - 1100)),
    spatialScore: 96,
    recommendedFixtures: {
      shower: 'shower-rainpanel',
      toilet: 'toilet-wallhung',
      vanity: 'vanity-floating',
      faucet: 'faucet-singlelever',
      lighting: 'light-downlight',
      flooring: theme === 'japanese-zen' ? 'floor-mattestone' : 'floor-terrazzo',
      'mirror-extras': ['extra-mirror', 'extra-ventilation']
    },
    placedItems: [
      { id: 'shower', category: 'shower', x: -0.65, z: -0.65, rotation: 0, isRemoved: false },
      { id: 'vanity', category: 'vanity', x: 0.55, z: -0.65, rotation: Math.PI, isRemoved: false },
      { id: 'faucet', category: 'faucet', x: 0.55, z: -0.6, rotation: Math.PI, isRemoved: false },
      { id: 'mirror', category: 'mirror-extras', x: 0.55, z: -0.7, rotation: Math.PI, isRemoved: false },
      { id: 'toilet', category: 'toilet', x: 0.65, z: 0.45, rotation: -Math.PI / 2, isRemoved: false }
    ],
    spatialHighlights: [
      'In-wall toilet cistern reclaims 160mm of walking passage.',
      'Flush-mount rain panel eliminates glass enclosure clutter in compact footprints.',
      'Floating vanity allows seamless floor tile continuity from wall to wall.'
    ]
  };

  // 2. Layout B: Luxury-Optimized
  const luxuryOptimized: LayoutAlternative = {
    id: 'luxury-optimized',
    name: 'Layout B — Luxury-Optimized',
    badge: 'Statement Sanctuaries',
    tagline: 'Grand focal sightlines, freestanding furniture, and hydrotherapy zoning',
    description:
      'Organized around architectural focal points: direct entry sightline to an illuminated vanity mirror, accompanied by multi-zone shower hydrotherapy and heirloom finishes.',
    circulationPercentage: isCompact ? 52 : 58,
    turningCircleMm: Math.min(1250, Math.round(widthMm * 0.42)),
    passageCorridorMm: Math.max(780, Math.round(widthMm - 1250)),
    spatialScore: 92,
    recommendedFixtures: {
      shower: areaSqFt > 55 ? 'shower-steam' : 'shower-thermostatic',
      toilet: 'toilet-smart',
      vanity: areaSqFt > 70 ? 'vanity-doublebasin' : 'vanity-freestanding',
      faucet: theme === 'classic-luxury' ? 'faucet-bridge' : 'faucet-waterfall',
      lighting: 'light-cove',
      flooring: theme === 'classic-luxury' ? 'floor-marble' : 'floor-woodtile',
      'mirror-extras': ['extra-mirror', 'extra-glass', 'extra-ventilation']
    },
    placedItems: [
      { id: 'shower', category: 'shower', x: -0.55, z: -0.55, rotation: 0, isRemoved: false },
      { id: 'vanity', category: 'vanity', x: 0.5, z: -0.65, rotation: Math.PI, isRemoved: false },
      { id: 'faucet', category: 'faucet', x: 0.5, z: -0.6, rotation: Math.PI, isRemoved: false },
      { id: 'mirror', category: 'mirror-extras', x: 0.5, z: -0.7, rotation: Math.PI, isRemoved: false },
      { id: 'toilet', category: 'toilet', x: 0.6, z: 0.55, rotation: -Math.PI / 2, isRemoved: false }
    ],
    spatialHighlights: [
      'Freestanding furniture piece serves as the visual anchor upon room entry.',
      'Dedicated glass enclosure isolates the wellness hydrotherapy zone.',
      'Concealed perimeter LED cove lighting accentuates architectural stone texture.'
    ]
  };

  // 3. Layout C: Accessibility-Oriented
  const accessibilityOriented: LayoutAlternative = {
    id: 'accessibility-oriented',
    name: 'Layout C — Accessibility-Oriented',
    badge: 'Universal Design',
    tagline: 'Zero-threshold roll-in entry, 1200mm turning circle, and comfort transfer zones',
    description:
      'Designed in accordance with Universal Design principles. Eliminates trip hazards with curb-free shower drainage, installs comfort-height seating, and guarantees unobstructed wheelchair transfer paths.',
    circulationPercentage: isCompact ? 65 : 72,
    turningCircleMm: Math.min(1500, Math.round(widthMm * 0.52)),
    passageCorridorMm: Math.max(920, Math.round(widthMm - 1000)),
    spatialScore: 97,
    recommendedFixtures: {
      shower: 'shower-thermostatic', // zero threshold + easy thermostatic lever
      toilet: 'toilet-smart',       // comfort height + automated hands-free lid
      vanity: 'vanity-floating',    // open toe kick and clearance below
      faucet: 'faucet-singlelever', // effortless single-lever paddle control
      lighting: 'light-backlit',    // high CRI anti-glare task illumination
      flooring: 'floor-mattestone', // R11 anti-slip textured surface
      'mirror-extras': ['extra-mirror', 'extra-ventilation']
    },
    placedItems: [
      { id: 'shower', category: 'shower', x: -0.7, z: -0.6, rotation: 0, isRemoved: false },
      { id: 'vanity', category: 'vanity', x: 0.55, z: -0.65, rotation: Math.PI, isRemoved: false },
      { id: 'faucet', category: 'faucet', x: 0.55, z: -0.6, rotation: Math.PI, isRemoved: false },
      { id: 'mirror', category: 'mirror-extras', x: 0.55, z: -0.7, rotation: Math.PI, isRemoved: false },
      { id: 'toilet', category: 'toilet', x: 0.65, z: 0.35, rotation: -Math.PI / 2, isRemoved: false }
    ],
    spatialHighlights: [
      'Continuous R11 slip-resistant porcelain tiles carry seamlessly into zero-threshold shower drain.',
      'Comfort-height toilet (440mm rim) minimizes knee strain during sit-to-stand transitions.',
      'Floating basin profile provides knee clearance for seated ergonomic grooming.'
    ]
  };

  return [spaceOptimized, luxuryOptimized, accessibilityOriented];
}
