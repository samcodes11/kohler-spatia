import { ThemeId } from './themes';
import { ASSET_MAP } from './assets';

export type SubThemeId = 
  | 'nature-retreat'
  | 'minimalist-modern'
  | 'luxury-escape'
  | 'coastal-breeze'
  | 'urban-chic';

export interface CollectionHotspot {
  id: string;
  x: number; // percentage from left (0 - 100)
  y: number; // percentage from top (0 - 100)
  productId: string;
  label: string;
}

export interface CuratedCollection {
  id: SubThemeId;
  name: string;
  parentTheme: string;
  parentThemeId: string;
  tagline: string;
  finishes: string;
  materialStory: string;
  lightingTemp: string;
  wallTexture: string;
  wallFinishId: string;
  heroImage: string;
  curatedProductIds: string[];
  recommendedFixtures: {
    shower: string;
    toilet: string;
    faucet: string;
    lighting: string;
    flooring: string;
    vanity: string;
    'mirror-extras': string[];
  };
  hotspots: CollectionHotspot[];
}

/**
 * Curated Collections for Browse Collections Lookbook.
 * Strictly adheres to max-1 product overlap across any two collections.
 */
export const CURATED_COLLECTIONS: Record<SubThemeId, CuratedCollection> = {
  // 1. Nature Retreat (Parent: Japanese Zen)
  'nature-retreat': {
    id: 'nature-retreat',
    name: 'Nature Retreat',
    parentTheme: 'Nature Retreat',
    parentThemeId: 'nature-retreat',
    tagline: 'Biophilic Hinoki & Basalt Sanctuary',
    finishes: 'Brushed Bronze · Tactile Cedar · Basalt',
    materialStory: 'Organic Hinoki cypress woodgrain, flamed thermal basalt stone, and warm brushed bronze fixtures invite calm sensory restoration.',
    lightingTemp: '3000K Warm Diffused Sunlight',
    wallTexture: 'Fluted Hinoki Cypress & Lime Plaster',
    wallFinishId: 'sage-limewash',
    heroImage: ASSET_MAP.themes['nature-retreat'],
    curatedProductIds: [
      'shower-rainpanel',
      'toilet-floormounted',
      'faucet-wallmount',
      'light-vanitytask',
      'floor-woodtile',
      'vanity-freestanding',
      'extra-glass'
    ],
    recommendedFixtures: {
      shower: 'shower-rainpanel',
      toilet: 'toilet-floormounted',
      faucet: 'faucet-wallmount',
      lighting: 'light-vanitytask',
      flooring: 'floor-woodtile',
      vanity: 'vanity-freestanding',
      'mirror-extras': ['extra-glass']
    },
    hotspots: [
      { id: 'nr-shower', x: 74, y: 35, productId: 'shower-rainpanel', label: 'Ceiling Rainhead Panel' },
      { id: 'nr-vanity', x: 32, y: 62, productId: 'vanity-freestanding', label: 'Console Vanity' },
      { id: 'nr-faucet', x: 34, y: 50, productId: 'faucet-wallmount', label: 'Concealed Basin Mixer' },
      { id: 'nr-floor', x: 55, y: 84, productId: 'floor-woodtile', label: 'Smoked Oak Flooring' }
    ]
  },

  // 2. Modern Minimalist (Parent: Minimalist Modern)
  'minimalist-modern': {
    id: 'minimalist-modern',
    name: 'Modern Minimalist',
    parentTheme: 'Minimalist Modern',
    parentThemeId: 'minimalist-modern',
    tagline: 'Pure Monolithic Precision',
    finishes: 'Polished Chrome · Vibrant Titanium · Microcement',
    materialStory: 'Restrained planar geometry, architectural stucco, shadowless glass, and chrome precision deliver effortless monolithic calm.',
    lightingTemp: '4000K Neutral Crisp Light',
    wallTexture: 'Smooth Porcelain Stucco',
    wallFinishId: 'pure-alabaster',
    heroImage: ASSET_MAP.themes['minimalist-modern'],
    curatedProductIds: [
      'shower-digital',
      'toilet-wallhung',
      'faucet-waterfall',
      'light-backlit',
      'floor-mattestone',
      'vanity-floating',
      'extra-glass'
    ],
    recommendedFixtures: {
      shower: 'shower-digital',
      toilet: 'toilet-wallhung',
      faucet: 'faucet-waterfall',
      lighting: 'light-backlit',
      flooring: 'floor-mattestone',
      vanity: 'vanity-floating',
      'mirror-extras': ['extra-glass']
    },
    hotspots: [
      { id: 'mm-shower', x: 72, y: 32, productId: 'shower-digital', label: 'Digital Thermostatic Shower' },
      { id: 'mm-faucet', x: 28, y: 52, productId: 'faucet-waterfall', label: 'Waterfall Basin Mixer' },
      { id: 'mm-vanity', x: 30, y: 65, productId: 'vanity-floating', label: 'Floating Vanity' },
      { id: 'mm-toilet', x: 86, y: 68, productId: 'toilet-wallhung', label: 'Wall-Hung Commode' }
    ]
  },

  // 3. Luxury Escape (Parent: Classic Luxury)
  'luxury-escape': {
    id: 'luxury-escape',
    name: 'Luxury Escape',
    parentTheme: 'Luxury Escape',
    parentThemeId: 'luxury-escape',
    tagline: 'Heirloom French Gold & Calacatta Marble',
    finishes: 'Vibrant French Gold · Honed Calacatta · Nero Marquina',
    materialStory: 'Opulent bookmatched Italian Calacatta marble, bullion gold metallurgy, and twin vanity suites create an unapologetic private palace.',
    lightingTemp: '2700K Warm Luminescent Amber',
    wallTexture: 'Bookmatched Calacatta & Nero Marquina',
    wallFinishId: 'pure-alabaster',
    heroImage: ASSET_MAP.themes['luxury-escape'],
    curatedProductIds: [
      'shower-thermostatic',
      'toilet-smart',
      'faucet-bridge',
      'light-cove',
      'floor-marble',
      'vanity-freestanding',
      'extra-mirror'
    ],
    recommendedFixtures: {
      shower: 'shower-thermostatic',
      toilet: 'toilet-smart',
      faucet: 'faucet-bridge',
      lighting: 'light-cove',
      flooring: 'floor-marble',
      vanity: 'vanity-freestanding',
      'mirror-extras': ['extra-mirror']
    },
    hotspots: [
      { id: 'le-shower', x: 70, y: 36, productId: 'shower-thermostatic', label: 'Thermostatic Gold Shower' },
      { id: 'le-faucet', x: 34, y: 52, productId: 'faucet-bridge', label: 'Bridge Lavatory Faucet' },
      { id: 'le-mirror', x: 35, y: 26, productId: 'extra-mirror', label: 'Smart Brass Mirror' },
      { id: 'le-floor', x: 50, y: 82, productId: 'floor-marble', label: 'Calacatta Honed Slab' }
    ]
  },

  // 4. Coastal Breeze (Parent: Minimalist Modern)
  'coastal-breeze': {
    id: 'coastal-breeze',
    name: 'Coastal Breeze',
    parentTheme: 'Minimalist Modern',
    parentThemeId: 'minimalist-modern',
    tagline: 'Airy Seaside Driftwood & Limewash',
    finishes: 'Brushed Nickel · Bleached Oak · Terrazzo',
    materialStory: 'Breezy driftwood oak, glazed zellige reflections, and soft nickel details evoke the sunlit serenity of Mediterranean coastal villas.',
    lightingTemp: '3500K Fresh Morning Daylight',
    wallTexture: 'Glazed Zellige Subway Tile & Limewash',
    wallFinishId: 'limestone-greige',
    heroImage: ASSET_MAP.themes['coastal-breeze'],
    curatedProductIds: [
      'shower-rainpanel',
      'toilet-onepiece',
      'faucet-singlelever',
      'light-downlight',
      'floor-terrazzo',
      'vanity-floating',
      'extra-mirror'
    ],
    recommendedFixtures: {
      shower: 'shower-rainpanel',
      toilet: 'toilet-onepiece',
      faucet: 'faucet-singlelever',
      lighting: 'light-downlight',
      flooring: 'floor-terrazzo',
      vanity: 'vanity-floating',
      'mirror-extras': ['extra-mirror']
    },
    hotspots: [
      { id: 'cb-shower', x: 68, y: 34, productId: 'shower-rainpanel', label: 'Flush Rainhead Panel' },
      { id: 'cb-faucet', x: 30, y: 54, productId: 'faucet-singlelever', label: 'Single-Lever Monobloc' },
      { id: 'cb-vanity', x: 32, y: 64, productId: 'vanity-floating', label: 'Bleached Oak Floating Vanity' },
      { id: 'cb-toilet', x: 82, y: 65, productId: 'toilet-onepiece', label: 'One-Piece Nickel Toilet' }
    ]
  },

  // 5. Urban Chic (Parent: Japanese Zen)
  'urban-chic': {
    id: 'urban-chic',
    name: 'Urban Chic',
    parentTheme: 'Urban Chic',
    parentThemeId: 'urban-chic',
    tagline: 'Industrial Matte Black & Fluted Terracotta',
    finishes: 'Matte Black · Raw Terrazzo · Fluted Clay',
    materialStory: 'Tactile terracotta fluting, exposed aggregate concrete, knurled matte black brassware, and private steam wellness bring loft vitality.',
    lightingTemp: '3000K Balanced Editorial Warmth',
    wallTexture: 'Terracotta Fluted Clay & Exposed Microcement',
    wallFinishId: 'slate-graphite',
    heroImage: ASSET_MAP.themes['urban-chic'],
    curatedProductIds: [
      'shower-steam',
      'toilet-wallhung',
      'faucet-wallmount',
      'light-cove',
      'floor-terrazzo',
      'vanity-doublebasin',
      'extra-ventilation'
    ],
    recommendedFixtures: {
      shower: 'shower-steam',
      toilet: 'toilet-wallhung',
      faucet: 'faucet-wallmount',
      lighting: 'light-cove',
      flooring: 'floor-terrazzo',
      vanity: 'vanity-doublebasin',
      'mirror-extras': ['extra-ventilation']
    },
    hotspots: [
      { id: 'uc-shower', x: 75, y: 38, productId: 'shower-steam', label: 'Modular Steam Generator Suite' },
      { id: 'uc-faucet', x: 32, y: 52, productId: 'faucet-wallmount', label: 'Matte Black Wall Mixer' },
      { id: 'uc-vanity', x: 34, y: 66, productId: 'vanity-doublebasin', label: 'Corian Double Vanity' },
      { id: 'uc-floor', x: 50, y: 85, productId: 'floor-terrazzo', label: 'Ash Terrazzo Pavers' }
    ]
  }
};

export const ORDERED_COLLECTION_IDS: SubThemeId[] = [
  'nature-retreat',
  'minimalist-modern',
  'luxury-escape',
  'coastal-breeze',
  'urban-chic'
];
