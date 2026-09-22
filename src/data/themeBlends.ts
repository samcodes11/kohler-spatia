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
  // 1. Japanese Zen × Minimalist Modern
  {
    id: 'nature-retreat__minimalist-modern',
    themeIds: ['nature-retreat', 'minimalist-modern'],
    title: 'Japanese Zen × Minimalist Modern',
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

  // 2. Japanese Zen × Classic Luxury
  {
    id: 'nature-retreat__luxury-escape',
    themeIds: ['nature-retreat', 'luxury-escape'],
    title: 'Japanese Zen × Classic Luxury',
    imageUrl: ASSET_MAP.themeBlends['nature-retreat__luxury-escape'],
    hasVisualPreview: true,
    conceptNote: 'Dramatic private jungle estate, stone architecture, deep greens, dark materials, moss, sculptural bathing environment and immersive luxury.',
    oneSentenceDescription: 'Organic textures meet dramatic luxury for a private, immersive retreat.',
    designDirection: {
      primaryTheme: 'luxury-escape',
      wallFinish: 'warm-putty',
      palette: 'Deep forest greens, tactile flamed basalt, and rich bullion gold accents',
      materialDirection: 'Submerged natural stone, bookmatched marble, and handcrafted gold brassware',
      lightingTemp: '2700K Warm Luminescent Amber',
      fixtureCharacter: 'Sculptural brassware and integrated stone wellness controls',
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

  // 3. Japanese Zen × Coastal Breeze
  {
    id: 'nature-retreat__coastal-breeze',
    themeIds: ['nature-retreat', 'coastal-breeze'],
    title: 'Japanese Zen × Coastal Breeze',
    imageUrl: ASSET_MAP.themeBlends['nature-retreat__coastal-breeze'],
    hasVisualPreview: true,
    conceptNote: 'Sunlit spa pavilion, translucent linen curtains, bleached Hinoki wood, seafoam plaster, and relaxed coastal greenery.',
    oneSentenceDescription: 'Airy seafoam plaster and bleached Hinoki wood bring breezy maritime calm to Zen hydrotherapy.',
    designDirection: {
      primaryTheme: 'coastal-breeze',
      wallFinish: 'limestone-greige',
      palette: 'Pale seafoam green, sand beige, and bleached cedar',
      materialDirection: 'Glazed zellige tiles with brushed nickel and natural timber',
      lightingTemp: '3200K Soft Sunlit Morning',
      fixtureCharacter: 'Soft-curved organic spouts and tactile timber cabinetry',
      recommendedFixtures: {
        shower: 'shower-rainpanel',
        toilet: 'toilet-wallhung',
        vanity: 'vanity-floating',
        faucet: 'faucet-singlelever',
        lighting: 'light-downlight',
        flooring: 'floor-woodtile'
      }
    }
  },

  // 4. Japanese Zen × Urban Chic
  {
    id: 'nature-retreat__urban-chic',
    themeIds: ['nature-retreat', 'urban-chic'],
    title: 'Japanese Zen × Urban Chic',
    imageUrl: ASSET_MAP.themeBlends['nature-retreat__urban-chic'],
    hasVisualPreview: true,
    conceptNote: 'Subterranean luxury loft spa, charred Shou Sugi Ban timber walls, terracotta fluting, matte black industrial fixtures, and mood lighting.',
    oneSentenceDescription: 'Charred timber and fluted clay merge industrial loft edge with serene Japanese spa quietude.',
    designDirection: {
      primaryTheme: 'japanese-zen',
      wallFinish: 'slate-graphite',
      palette: 'Charcoal graphite, warm terracotta, and knurled matte black',
      materialDirection: 'Fluted clay tile, exposed aggregate concrete, and smoked metal',
      lightingTemp: '3000K Editorial Low-Glow Warmth',
      fixtureCharacter: 'Knurled matte black valves and concealed architectural drainage',
      recommendedFixtures: {
        shower: 'shower-steam',
        toilet: 'toilet-wallhung',
        vanity: 'vanity-doublebasin',
        faucet: 'faucet-wallmount',
        lighting: 'light-cove',
        flooring: 'floor-terrazzo'
      }
    }
  },

  // 5. Minimalist Modern × Classic Luxury
  {
    id: 'minimalist-modern__luxury-escape',
    themeIds: ['minimalist-modern', 'luxury-escape'],
    title: 'Minimalist Modern × Classic Luxury',
    imageUrl: ASSET_MAP.themeBlends['minimalist-modern__luxury-escape'],
    hasVisualPreview: true,
    conceptNote: 'Sharp geometric pavilion, floor-to-ceiling Calacatta slab, brushed gold linear trims, frameless glass, and tailored opulence.',
    oneSentenceDescription: 'Ultra-clean geometric glass and microcement elevated by French Gold and Calacatta marble.',
    designDirection: {
      primaryTheme: 'luxury-escape',
      wallFinish: 'pure-alabaster',
      palette: 'Crisp alabaster white, polished Calacatta gold, and brushed French gold',
      materialDirection: 'Bookmatched marble slabs framed by razor-thin chrome and gold profiles',
      lightingTemp: '3000K Pure Luminescent Glow',
      fixtureCharacter: 'Planar waterfall outlets in warm gold PVD finish',
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

  // 6. Minimalist Modern × Coastal Breeze
  {
    id: 'minimalist-modern__coastal-breeze',
    themeIds: ['minimalist-modern', 'coastal-breeze'],
    title: 'Minimalist Modern × Coastal Breeze',
    imageUrl: ASSET_MAP.themeBlends['minimalist-modern__coastal-breeze'],
    hasVisualPreview: true,
    conceptNote: 'Breezy minimalist oceanfront suite, large-format limestone floor, floating vanity, brushed nickel, and shadowless lighting.',
    oneSentenceDescription: 'Monochrome spatial clarity softened by coastal limestone and brushed nickel.',
    designDirection: {
      primaryTheme: 'minimalist-modern',
      wallFinish: 'pure-alabaster',
      palette: 'Soft seafoam white, cool greige, and brushed nickel',
      materialDirection: 'Large format porcelain tiles and frameless glass enclosures',
      lightingTemp: '3800K Crisp Coastal Daylight',
      fixtureCharacter: 'Ultra-slim monobloc mixers and concealed shower valves',
      recommendedFixtures: {
        shower: 'shower-digital',
        toilet: 'toilet-wallhung',
        vanity: 'vanity-floating',
        faucet: 'faucet-singlelever',
        lighting: 'light-backlit',
        flooring: 'floor-mattestone'
      }
    }
  },

  // 7. Minimalist Modern × Urban Chic
  {
    id: 'minimalist-modern__urban-chic',
    themeIds: ['minimalist-modern', 'urban-chic'],
    title: 'Minimalist Modern × Urban Chic',
    imageUrl: ASSET_MAP.themeBlends['minimalist-modern__urban-chic'],
    hasVisualPreview: true,
    conceptNote: 'Architectural gallery loft, polished microcement floor, terracotta feature wall, matte black accent trim, and linear cove lighting.',
    oneSentenceDescription: 'Crisp architectural lines meet warm terracotta clay and industrial matte black accents.',
    designDirection: {
      primaryTheme: 'minimalist-modern',
      wallFinish: 'slate-graphite',
      palette: 'Raw concrete grey, warm rust terracotta, and matte black',
      materialDirection: 'Microcement walls paired with terracotta fluting and steel accents',
      lightingTemp: '3500K Architectural Neutral',
      fixtureCharacter: 'Minimalist wall-mounted spouts with knurled industrial details',
      recommendedFixtures: {
        shower: 'shower-digital',
        toilet: 'toilet-wallhung',
        vanity: 'vanity-floating',
        faucet: 'faucet-wallmount',
        lighting: 'light-backlit',
        flooring: 'floor-terrazzo'
      }
    }
  },

  // 8. Classic Luxury × Coastal Breeze
  {
    id: 'luxury-escape__coastal-breeze',
    themeIds: ['luxury-escape', 'coastal-breeze'],
    title: 'Classic Luxury × Coastal Breeze',
    imageUrl: ASSET_MAP.themeBlends['luxury-escape__coastal-breeze'],
    hasVisualPreview: true,
    conceptNote: 'Mediterranean coastal villa, honed seafoam limestone, brushed French Gold fixtures, driftwood oak vanity, and warm ambient sunlight.',
    oneSentenceDescription: 'Mediterranean resort opulence blending French Gold metallics with breezy coastal timber.',
    designDirection: {
      primaryTheme: 'luxury-escape',
      wallFinish: 'limestone-greige',
      palette: 'Warm seafoam, bleached oak, and bullion gold',
      materialDirection: 'Honed limestone paving paired with gold hardware and driftwood cabinetry',
      lightingTemp: '3000K Soft Golden Hour Light',
      fixtureCharacter: 'Heritage bridge faucets with refined coastal proportioning',
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

  // 9. Classic Luxury × Urban Chic
  {
    id: 'luxury-escape__urban-chic',
    themeIds: ['luxury-escape', 'urban-chic'],
    title: 'Classic Luxury × Urban Chic',
    imageUrl: ASSET_MAP.themeBlends['luxury-escape__urban-chic'],
    hasVisualPreview: true,
    conceptNote: 'Metropolitan penthouse spa, Nero Marquina marble walls, fluted terracotta accents, brushed brass hardware, and dramatic pendant lighting.',
    oneSentenceDescription: 'Dramatic Nero Marquina marble meets tactile terracotta and knurled brass in a penthouse loft.',
    designDirection: {
      primaryTheme: 'luxury-escape',
      wallFinish: 'slate-graphite',
      palette: 'Nero Marquina black, amber terracotta, and brushed brass',
      materialDirection: 'Polished black marble paired with fluted clay and rich brassware',
      lightingTemp: '2700K Low Ambient Amber',
      fixtureCharacter: 'Substantial brass fixtures with industrial tactile knurling',
      recommendedFixtures: {
        shower: 'shower-thermostatic',
        toilet: 'toilet-smart',
        vanity: 'vanity-doublebasin',
        faucet: 'faucet-bridge',
        lighting: 'light-cove',
        flooring: 'floor-terrazzo'
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
    conceptNote: 'Sun-drenched urban loft, light terrazzo pavers, terracotta fluting, brushed nickel hardware, and open airy sightlines.',
    oneSentenceDescription: 'Sun-drenched terrazzo and brushed nickel combine breezy coastal lightness with loft vitality.',
    designDirection: {
      primaryTheme: 'coastal-breeze',
      wallFinish: 'limestone-greige',
      palette: 'Airy seafoam, warm terracotta, and brushed nickel',
      materialDirection: 'Terrazzo paving with glazed subway tiles and nickel hardware',
      lightingTemp: '3400K Bright Balanced Natural',
      fixtureCharacter: 'Clean monobloc fixtures with subtle tactile texture',
      recommendedFixtures: {
        shower: 'shower-rainpanel',
        toilet: 'toilet-wallhung',
        vanity: 'vanity-floating',
        faucet: 'faucet-singlelever',
        lighting: 'light-downlight',
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
