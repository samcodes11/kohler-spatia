import { ThemeId } from './themes';
import { ASSET_MAP } from './assets';

export interface ThemeBlendDesignDirection {
  primaryTheme: ThemeId;
  wallFinish: string;
  palette: string;
  materialDirection: string;
  lightingTemp: string;
  fixtureCharacter: string;
  recommendedFixtures: {
    shower: string;
    toilet: string;
    vanity: string;
    faucet: string;
    lighting: string;
    flooring: string;
  };
}

export interface ThemeBlend {
  id: string; // e.g. "nature-retreat__luxury-escape"
  themeIds: [ThemeId, ThemeId];
  title: string; // e.g. "Nature Retreat × Luxury Escape"
  imageUrl?: string;
  hasVisualPreview: boolean;
  conceptNote: string;
  oneSentenceDescription: string;
  designDirection: ThemeBlendDesignDirection;
}

/**
 * The 5 canonical C16 themes used for deterministic ordering
 */
export const C16_THEME_IDS: ThemeId[] = [
  'nature-retreat',
  'minimalist-modern',
  'luxury-escape',
  'coastal-breeze',
  'urban-chic'
];

/**
 * Normalizes alias IDs to canonical theme IDs
 */
export function normalizeThemeId(themeId: string): ThemeId {
  if (themeId === 'modern-minimalist') return 'minimalist-modern';
  if (themeId === 'classic-luxury') return 'luxury-escape';
  if (themeId === 'japanese-zen') return 'nature-retreat';
  return themeId as ThemeId;
}

/**
 * Generates an order-invariant, normalized blend ID for any pair of themes
 */
export function getBlendId(themeA: string, themeB: string): string {
  const normA = normalizeThemeId(themeA);
  const normB = normalizeThemeId(themeB);

  const idxA = C16_THEME_IDS.indexOf(normA);
  const idxB = C16_THEME_IDS.indexOf(normB);

  // Fallback to alphabetical if index not found
  if (idxA === -1 || idxB === -1) {
    return [normA, normB].sort().join('__');
  }

  return idxA <= idxB ? `${normA}__${normB}` : `${normB}__${normA}`;
}

export const THEME_BLENDS: ThemeBlend[] = [
  // 1. Nature Retreat × Modern Minimalist
  {
    id: 'nature-retreat__minimalist-modern',
    themeIds: ['nature-retreat', 'minimalist-modern'],
    title: 'Nature Retreat × Modern Minimalist',
    imageUrl: ASSET_MAP.themeBlends['nature-retreat__minimalist-modern'],
    hasVisualPreview: true,
    conceptNote: 'Monolithic concrete architecture, central skylight, vertical garden, sage accents, pale oak, extremely clean geometry and restrained Zen minimalism.',
    oneSentenceDescription: 'Monolithic concrete and pale oak meet biophilic Zen greenery in a light-washed architectural sanctuary.',
    designDirection: {
      primaryTheme: 'minimalist-modern',
      wallFinish: 'sage-limewash',
      palette: 'Restrained sage, monolithic concrete grey, and bleached white oak',
      materialDirection: 'Honed microcement surfaces paired with fluted cypress and shadowless glass',
      lightingTemp: '3500K Diffused Architectural Daylight',
      fixtureCharacter: 'Frameless geometry, recessed wall spouts, and planar monolithic vessels',
      recommendedFixtures: {
        shower: 'shower-rainpanel',
        toilet: 'toilet-wallhung',
        vanity: 'vanity-floating',
        faucet: 'faucet-waterfall',
        lighting: 'light-cove',
        flooring: 'floor-mattestone'
      }
    }
  },

  // 2. Nature Retreat × Luxury Escape
  {
    id: 'nature-retreat__luxury-escape',
    themeIds: ['nature-retreat', 'luxury-escape'],
    title: 'Nature Retreat × Luxury Escape',
    imageUrl: ASSET_MAP.themeBlends['nature-retreat__luxury-escape'],
    hasVisualPreview: true,
    conceptNote: 'Dramatic private jungle estate, stone architecture, deep greens, dark materials, moss, sculptural bathing environment and immersive luxury.',
    oneSentenceDescription: 'Organic textures meet dramatic luxury for a private, immersive retreat.',
    designDirection: {
      primaryTheme: 'luxury-escape',
      wallFinish: 'warm-putty',
      palette: 'Deep botanical emerald, bookmatched Calacatta, and heirloom French Gold',
      materialDirection: 'Living moss-textured stone walls, honed basalt slabs, and bullion brass hardware',
      lightingTemp: '2700K Warm Luminescent Amber',
      fixtureCharacter: 'Sculptural soaking silhouettes and tactile brushed bronze levers',
      recommendedFixtures: {
        shower: 'shower-thermostatic',
        toilet: 'toilet-smart',
        vanity: 'vanity-doublebasin',
        faucet: 'faucet-bridge',
        lighting: 'light-cove',
        flooring: 'floor-marble'
      }
    }
  },

  // 3. Nature Retreat × Coastal Breeze
  {
    id: 'nature-retreat__coastal-breeze',
    themeIds: ['nature-retreat', 'coastal-breeze'],
    title: 'Nature Retreat × Coastal Breeze',
    imageUrl: ASSET_MAP.themeBlends['nature-retreat__coastal-breeze'],
    hasVisualPreview: true,
    conceptNote: 'Open-air tropical/coastal pavilion with natural architecture, pale limestone, seafoam/aqua, light oak, plants, reflecting water, arched openings and bright natural daylight.',
    oneSentenceDescription: 'Open-air pavilion architecture with pale limestone and breezy aqua waters calms the senses.',
    designDirection: {
      primaryTheme: 'coastal-breeze',
      wallFinish: 'limewash-greige',
      palette: 'Soft seafoam, pale limestone, washed linen, and brushed nickel',
      materialDirection: 'Honed travertine floor, glazed zellige subway tile, and drift oak cabinetry',
      lightingTemp: '3500K Fresh Morning Daylight',
      fixtureCharacter: 'Curved arch motifs, open-air shower drainage, and fluid single-lever brassware',
      recommendedFixtures: {
        shower: 'shower-rainpanel',
        toilet: 'toilet-wallhung',
        vanity: 'vanity-floating',
        faucet: 'faucet-singlelever',
        lighting: 'light-downlight',
        flooring: 'floor-mattestone'
      }
    }
  },

  // 4. Nature Retreat × Urban Chic (Preserved with graceful preview fallback state)
  {
    id: 'nature-retreat__urban-chic',
    themeIds: ['nature-retreat', 'urban-chic'],
    title: 'Nature Retreat × Urban Chic',
    imageUrl: undefined,
    hasVisualPreview: false,
    conceptNote: 'Warm terracotta fluting, raw cedar textures, exposed concrete, and industrial matte black silhouettes.',
    oneSentenceDescription: 'Warm terracotta fluting and tactile cedar earthiness ground a crisp metropolitan silhouette.',
    designDirection: {
      primaryTheme: 'urban-chic',
      wallFinish: 'warm-putty',
      palette: 'Warm terracotta clay, charcoal basalt, cedar woodgrain, and matte black',
      materialDirection: 'Fluted architectural terracotta tile, cast concrete basins, and blackened steel',
      lightingTemp: '3000K Editorial Amber Glow',
      fixtureCharacter: 'Industrial knurled handles, matte black wall mounts, and raw tactile surfaces',
      recommendedFixtures: {
        shower: 'shower-digital',
        toilet: 'toilet-wallhung',
        vanity: 'vanity-freestanding',
        faucet: 'faucet-wallmount',
        lighting: 'light-backlit',
        flooring: 'floor-terrazzo'
      }
    }
  },

  // 5. Modern Minimalist × Luxury Escape
  {
    id: 'minimalist-modern__luxury-escape',
    themeIds: ['minimalist-modern', 'luxury-escape'],
    title: 'Modern Minimalist × Luxury Escape',
    imageUrl: ASSET_MAP.themeBlends['minimalist-modern__luxury-escape'],
    hasVisualPreview: true,
    conceptNote: 'Ultra-modern luxury bathroom, ivory and graphite palette, smoked glass, architectural symmetry, floating platforms, dramatic linear lighting and gallery-like geometry.',
    oneSentenceDescription: 'Architectural symmetry, smoked glass, and floating ivory platforms elevate minimalism to grand luxury.',
    designDirection: {
      primaryTheme: 'luxury-escape',
      wallFinish: 'pure-alabaster',
      palette: 'Polished ivory alabaster, graphite Nero Marquina, and French Gold accent lines',
      materialDirection: 'Bookmatched porcelain slabs, floor-to-ceiling smoked acoustic glass, and mirror brass trims',
      lightingTemp: '3000K Perimeter Concealed Linear Cove',
      fixtureCharacter: 'Monolithic floating consoles, integrated smart bidets, and concealed thermostatic valves',
      recommendedFixtures: {
        shower: 'shower-thermostatic',
        toilet: 'toilet-smart',
        vanity: 'vanity-floating',
        faucet: 'faucet-waterfall',
        lighting: 'light-backlit',
        flooring: 'floor-marble'
      }
    }
  },

  // 6. Modern Minimalist × Coastal Breeze (Preserved with graceful preview fallback state)
  {
    id: 'minimalist-modern__coastal-breeze',
    themeIds: ['minimalist-modern', 'coastal-breeze'],
    title: 'Modern Minimalist × Coastal Breeze',
    imageUrl: undefined,
    hasVisualPreview: false,
    conceptNote: 'Restrained Nordic lines, pale natural light, and serene maritime clarity.',
    oneSentenceDescription: 'Restrained Nordic geometry and pale natural light frame refreshing maritime clarity.',
    designDirection: {
      primaryTheme: 'minimalist-modern',
      wallFinish: 'limewash-greige',
      palette: 'Pale bleached birch, ocean grey, brushed stainless steel, and soft white',
      materialDirection: 'Smooth microcement, sandblasted glass partitions, and honed limestone floors',
      lightingTemp: '4000K Crisp Coastal Daylight',
      fixtureCharacter: 'Ultra-slim vanity profiles, concealed drains, and single-lever chrome mixers',
      recommendedFixtures: {
        shower: 'shower-rainpanel',
        toilet: 'toilet-wallhung',
        vanity: 'vanity-floating',
        faucet: 'faucet-singlelever',
        lighting: 'light-downlight',
        flooring: 'floor-mattestone'
      }
    }
  },

  // 7. Modern Minimalist × Urban Chic
  {
    id: 'minimalist-modern__urban-chic',
    themeIds: ['minimalist-modern', 'urban-chic'],
    title: 'Modern Minimalist × Urban Chic',
    imageUrl: ASSET_MAP.themeBlends['minimalist-modern__urban-chic'],
    hasVisualPreview: true,
    conceptNote: 'Contemporary Manhattan penthouse, concrete, charcoal terrazzo, walnut, steel-framed windows, dark city skyline, sculptural black tub and metropolitan architecture.',
    oneSentenceDescription: 'Sculptural black fixtures, charcoal terrazzo, and walnut accents define an uncompromising metropolitan silhouette.',
    designDirection: {
      primaryTheme: 'urban-chic',
      wallFinish: 'slate-graphite',
      palette: 'Metropolitan charcoal, raw board-formed concrete, warm American walnut, and matte black',
      materialDirection: 'Large-format terrazzo tiles with dark aggregate, blackened steel framing, and rift walnut cabinetry',
      lightingTemp: '3000K Editorial Linear Warmth',
      fixtureCharacter: 'Angular matte black mixers, wall-hung carrier bowls, and dark frameless glass screens',
      recommendedFixtures: {
        shower: 'shower-digital',
        toilet: 'toilet-wallhung',
        vanity: 'vanity-floating',
        faucet: 'faucet-wallmount',
        lighting: 'light-backlit',
        flooring: 'floor-concrete'
      }
    }
  },

  // 8. Luxury Escape × Coastal Breeze
  {
    id: 'luxury-escape__coastal-breeze',
    themeIds: ['luxury-escape', 'coastal-breeze'],
    title: 'Luxury Escape × Coastal Breeze',
    imageUrl: ASSET_MAP.themeBlends['luxury-escape__coastal-breeze'],
    hasVisualPreview: true,
    conceptNote: 'Sun-washed Mediterranean villa, arched architecture, terracotta, blue ceramic details, cream plaster, sea view and warm afternoon light.',
    oneSentenceDescription: 'Sun-washed Mediterranean arches, cream plaster, and ceramic accents bring effortless Riviera luxury to life.',
    designDirection: {
      primaryTheme: 'luxury-escape',
      wallFinish: 'pure-alabaster',
      palette: 'Warm ivory plaster, Mediterranean cobalt ceramic, terracotta accents, and brushed French Gold',
      materialDirection: 'Handmade terracotta pavers, glazed majolica tiles, and honed marble counters',
      lightingTemp: '3000K Golden Riviera Sunburst',
      fixtureCharacter: 'Sweeping arched mirrors, twin vessel basins, and classical gold bridge fittings',
      recommendedFixtures: {
        shower: 'shower-thermostatic',
        toilet: 'toilet-smart',
        vanity: 'vanity-doublebasin',
        faucet: 'faucet-bridge',
        lighting: 'light-downlight',
        flooring: 'floor-marble'
      }
    }
  },

  // 9. Luxury Escape × Urban Chic
  {
    id: 'luxury-escape__urban-chic',
    themeIds: ['luxury-escape', 'urban-chic'],
    title: 'Luxury Escape × Urban Chic',
    imageUrl: ASSET_MAP.themeBlends['luxury-escape__urban-chic'],
    hasVisualPreview: true,
    conceptNote: 'Art Deco penthouse, emerald marble, burgundy, black, antique gold, symmetrical geometry, fluted surfaces and theatrical lighting.',
    oneSentenceDescription: 'Theatrical emerald marble and fluted antique gold ignite bold Art Deco metropolitan drama.',
    designDirection: {
      primaryTheme: 'luxury-escape',
      wallFinish: 'slate-graphite',
      palette: 'Deep Verde Guatemala emerald marble, blackened titanium, and antique brushed gold',
      materialDirection: 'Polished bookmatched green marble, fluted walnut vanities, and gold inlay mouldings',
      lightingTemp: '2700K Theatrical Amber Luminescence',
      fixtureCharacter: 'Heavy faceted escutcheons, stepped architectural pedestals, and antique gold showers',
      recommendedFixtures: {
        shower: 'shower-thermostatic',
        toilet: 'toilet-smart',
        vanity: 'vanity-freestanding',
        faucet: 'faucet-bridge',
        lighting: 'light-cove',
        flooring: 'floor-marble'
      }
    }
  },

  // 10. Coastal Breeze × Urban Chic
  {
    id: 'coastal-breeze__urban-chic',
    themeIds: ['coastal-breeze', 'urban-chic'],
    title: 'Coastal Breeze × Urban Chic',
    imageUrl: ASSET_MAP.themeBlends['coastal-breeze__urban-chic'],
    hasVisualPreview: true,
    conceptNote: 'Futuristic coastal-city penthouse with curved glass, cobalt blue, white, chrome, waterfront skyline and vivid twilight illumination.',
    oneSentenceDescription: 'Futuristic curved glass, cobalt reflections, and twilight waterfront panoramas define coastal metropolitan luxury.',
    designDirection: {
      primaryTheme: 'coastal-breeze',
      wallFinish: 'limewash-greige',
      palette: 'Deep cobalt twilight, brushed stainless steel, crisp white lacquer, and oceanic cyan',
      materialDirection: 'Curved structural glass dividers, honed grey terrazzo, and brushed chrome hardware',
      lightingTemp: '3500K Twilight Horizon Luminescence',
      fixtureCharacter: 'Aerodynamic cylindrical mixers, rainhead ceiling panels, and rimless wall-hung pans',
      recommendedFixtures: {
        shower: 'shower-rainpanel',
        toilet: 'toilet-wallhung',
        vanity: 'vanity-floating',
        faucet: 'faucet-singlelever',
        lighting: 'light-backlit',
        flooring: 'floor-terrazzo'
      }
    }
  }
];

export const THEME_BLEND_MAP: Record<string, ThemeBlend> = THEME_BLENDS.reduce((acc, b) => {
  acc[b.id] = b;
  return acc;
}, {} as Record<string, ThemeBlend>);

/**
 * Returns the theme blend for any two selected themes (order-invariant)
 */
export function getThemeBlend(themeA: string, themeB: string): ThemeBlend | null {
  const blendId = getBlendId(themeA, themeB);
  return THEME_BLEND_MAP[blendId] || null;
}
