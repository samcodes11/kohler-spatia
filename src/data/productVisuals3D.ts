export type MetalFinish = 'matte-black' | 'brushed-nickel' | 'brass' | 'chrome';

export interface ProductVisual3D {
  colorHex: string;
  metalFinish?: MetalFinish;
  geometryVariant?: string;
  secondaryColorHex?: string;
  roughness?: number;
  metalness?: number;
  hardwareColorHex?: string;
  countertopColorHex?: string;
}

export interface WallFinishOption {
  id: string;
  name: string;
  colorHex: string;
  colorInt: number;
  roughness: number;
  description: string;
  trimColorInt: number;
}

export const WALL_FINISHES: WallFinishOption[] = [
  {
    id: 'warm-putty',
    name: 'Muted Putty Plaster',
    colorHex: '#DDD6CE',
    colorInt: 0xDDD6CE,
    roughness: 0.88,
    description: 'Warm architectural plaster with subtle mineral depth and matte finish.',
    trimColorInt: 0x8C8478
  },
  {
    id: 'limestone-greige',
    name: 'Soft Limewash Greige',
    colorHex: '#E6E1D8',
    colorInt: 0xE6E1D8,
    roughness: 0.82,
    description: 'Chalky tactile limewash with gentle organic undertones.',
    trimColorInt: 0x9E978C
  },
  {
    id: 'slate-graphite',
    name: 'Architectural Slate Graphite',
    colorHex: '#353A40',
    colorInt: 0x353A40,
    roughness: 0.85,
    description: 'Deep carbonized mineral plaster for dramatic high-contrast spaces.',
    trimColorInt: 0x22262B
  },
  {
    id: 'pure-alabaster',
    name: 'Clean Architectural Alabaster',
    colorHex: '#F4F3EE',
    colorInt: 0xF4F3EE,
    roughness: 0.70,
    description: 'Crisp, luminous fine-grain gypsum wall treatment with gentle light bounce.',
    trimColorInt: 0xC8C4BC
  },
  {
    id: 'sage-limewash',
    name: 'Organic Earth Sage',
    colorHex: '#CCD3CA',
    colorInt: 0xCCD3CA,
    roughness: 0.85,
    description: 'Biophilic muted eucalyptus tone inspired by Japanese spa retreats.',
    trimColorInt: 0x8A9287
  }
];

export const WALL_FINISH_MAP: Record<string, WallFinishOption> = WALL_FINISHES.reduce((acc, wf) => {
  acc[wf.id] = wf;
  return acc;
}, {} as Record<string, WallFinishOption>);

export const PRODUCT_VISUALS_3D: Record<string, ProductVisual3D> = {
  // ===================== SHOWERS =====================
  'shower-digital': {
    colorHex: '#26292E',
    metalFinish: 'matte-black',
    geometryVariant: 'frameless-glass',
    roughness: 0.35,
    metalness: 0.7,
    hardwareColorHex: '#1A1A1A'
  },
  'shower-thermostatic': {
    colorHex: '#1E1F22',
    metalFinish: 'matte-black',
    geometryVariant: 'black-framed-glass',
    roughness: 0.45,
    metalness: 0.6,
    hardwareColorHex: '#1A1A1A'
  },
  'shower-rainpanel': {
    colorHex: '#D4AF37',
    metalFinish: 'brass',
    geometryVariant: 'frameless-glass',
    roughness: 0.25,
    metalness: 0.9,
    hardwareColorHex: '#AE8A4E'
  },
  'shower-steam': {
    colorHex: '#4A5568',
    metalFinish: 'chrome',
    geometryVariant: 'full-enclosure',
    roughness: 0.15,
    metalness: 0.95,
    hardwareColorHex: '#C0CBD4'
  },

  // ===================== TOILETS =====================
  'toilet-smart': {
    colorHex: '#FFFFFF',
    metalFinish: 'matte-black',
    geometryVariant: 'smart-curved',
    roughness: 0.18,
    metalness: 0.04,
    secondaryColorHex: '#4AA8FF'
  },
  'toilet-wallhung': {
    colorHex: '#F8F9FA',
    metalFinish: 'matte-black',
    geometryVariant: 'wall-hung',
    roughness: 0.18,
    metalness: 0.04,
    secondaryColorHex: '#1A1A1A'
  },
  'toilet-floormounted': {
    colorHex: '#F1F2F4',
    metalFinish: 'brushed-nickel',
    geometryVariant: 'two-piece',
    roughness: 0.20,
    metalness: 0.04,
    secondaryColorHex: '#8EA5AD'
  },
  'toilet-intelligent': {
    colorHex: '#ECEFF1',
    metalFinish: 'chrome',
    geometryVariant: 'intelligent-angular',
    roughness: 0.15,
    metalness: 0.06,
    secondaryColorHex: '#38BDF8'
  },

  // ===================== VANITIES =====================
  'vanity-floating': {
    colorHex: '#A47551',
    metalFinish: 'matte-black',
    geometryVariant: 'floating',
    roughness: 0.62,
    metalness: 0.02,
    countertopColorHex: '#F7F5F0',
    hardwareColorHex: '#1A1A1A'
  },
  'vanity-freestanding': {
    colorHex: '#4A3525',
    metalFinish: 'brass',
    geometryVariant: 'freestanding',
    roughness: 0.58,
    metalness: 0.02,
    countertopColorHex: '#FAF8F4',
    hardwareColorHex: '#AE8A4E'
  },
  'vanity-doublebasin': {
    colorHex: '#8C7355',
    metalFinish: 'matte-black',
    geometryVariant: 'double-basin',
    roughness: 0.65,
    metalness: 0.02,
    countertopColorHex: '#FFFFFF',
    hardwareColorHex: '#1A1A1A'
  },
  'vanity-compact': {
    colorHex: '#2D3748',
    metalFinish: 'matte-black',
    geometryVariant: 'compact-console',
    roughness: 0.70,
    metalness: 0.05,
    countertopColorHex: '#F1F5F9',
    hardwareColorHex: '#1A1A1A'
  },

  // ===================== FAUCETS =====================
  'faucet-waterfall': {
    colorHex: '#1A1A1A',
    metalFinish: 'matte-black',
    geometryVariant: 'waterfall-flat',
    roughness: 0.55,
    metalness: 0.45
  },
  'faucet-bridge': {
    colorHex: '#AE8A4E',
    metalFinish: 'brass',
    geometryVariant: 'bridge-gooseneck',
    roughness: 0.22,
    metalness: 0.90
  },
  'faucet-wallmount': {
    colorHex: '#1A1A1A',
    metalFinish: 'matte-black',
    geometryVariant: 'wall-mount-minimal',
    roughness: 0.50,
    metalness: 0.50
  },
  'faucet-singlelever': {
    colorHex: '#717882',
    metalFinish: 'brushed-nickel',
    geometryVariant: 'single-lever-monobloc',
    roughness: 0.28,
    metalness: 0.85
  },

  // ===================== LIGHTING =====================
  'light-cove': {
    colorHex: '#FFE8B8',
    geometryVariant: 'recessed-cove',
    roughness: 0.3,
    metalness: 0.1,
    secondaryColorHex: '#FCE8C3'
  },
  'light-backlit': {
    colorHex: '#FFF5E4',
    geometryVariant: 'backlit-halo',
    roughness: 0.2,
    metalness: 0.2,
    secondaryColorHex: '#FFFAF0'
  },
  'light-downlight': {
    colorHex: '#FFFFFF',
    metalFinish: 'matte-black',
    geometryVariant: 'downlight-flush',
    roughness: 0.4,
    metalness: 0.3,
    secondaryColorHex: '#1A1A1A'
  },
  'light-pendant': {
    colorHex: '#AE8A4E',
    metalFinish: 'brass',
    geometryVariant: 'pendant-linear',
    roughness: 0.2,
    metalness: 0.9,
    secondaryColorHex: '#FFF3D6'
  },

  // ===================== FLOORING =====================
  'floor-marble': {
    colorHex: '#EFECE6',
    secondaryColorHex: '#D8D3C8',
    geometryVariant: 'large-format-tile',
    roughness: 0.40,
    metalness: 0.05
  },
  'floor-woodtile': {
    colorHex: '#B59A7A',
    secondaryColorHex: '#9C8162',
    geometryVariant: 'wood-plank',
    roughness: 0.65,
    metalness: 0.02
  },
  'floor-mattestone': {
    colorHex: '#353940',
    secondaryColorHex: '#25282E',
    geometryVariant: 'textured-basalt',
    roughness: 0.75,
    metalness: 0.06
  },
  'floor-porcelain': {
    colorHex: '#DFDCD5',
    secondaryColorHex: '#CBC7BF',
    geometryVariant: 'microcement-seamless',
    roughness: 0.48,
    metalness: 0.03
  },

  // ===================== MIRROR & EXTRAS =====================
  'extra-mirror': {
    colorHex: '#EAF2F8',
    geometryVariant: 'mirror-rectangle',
    roughness: 0.05,
    metalness: 0.95
  },
  'extra-glass': {
    colorHex: '#F4F8FA',
    metalFinish: 'matte-black',
    geometryVariant: 'glass-shelf',
    roughness: 0.08,
    metalness: 0.1
  },
  'extra-ventilation': {
    colorHex: '#3A3E45',
    geometryVariant: 'vent-discrete',
    roughness: 0.8,
    metalness: 0.2
  },
  'extra-radiator': {
    colorHex: '#1A1A1A',
    metalFinish: 'matte-black',
    geometryVariant: 'towel-warmer-ladder',
    roughness: 0.5,
    metalness: 0.5
  },
  'extra-towelrack': {
    colorHex: '#AE8A4E',
    metalFinish: 'brass',
    geometryVariant: 'towel-rack-bar',
    roughness: 0.25,
    metalness: 0.88
  }
};
