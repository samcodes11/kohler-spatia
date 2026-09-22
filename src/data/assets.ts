/**
 * Spatia — Centralized Approved Asset Map
 * Master inventory of approved Cloudinary CDN photography and architectural assets.
 * Section 75 Approved Image Inventory.
 */

export const ASSET_MAP = {
  // Section 5 & 6 & 7: Homepage Assets
  homepage: {
    hero: 'https://res.cloudinary.com/uthcccj5/image/upload/f_auto,q_auto/ChatGPT_Image_Sep_17_2026_08_29_55_PM', // A1
    waysToBegin: {
      designYourBathroom: 'https://res.cloudinary.com/uthcccj5/image/upload/f_auto,q_auto/ChatGPT_Image_Sep_17_2026_08_39_31_PM', // A2
      browseCollections: 'https://res.cloudinary.com/uthcccj5/image/upload/f_auto,q_auto/ChatGPT_Image_Sep_17_2026_10_35_08_PM', // A3
      consultAiDesigner: 'https://res.cloudinary.com/uthcccj5/image/upload/f_auto,q_auto/ChatGPT_Image_Sep_17_2026_10_39_00_PM', // A4
      aiBathroomDna: 'https://res.cloudinary.com/uthcccj5/image/upload/f_auto,q_auto/ChatGPT_Image_Sep_17_2026_10_40_45_PM', // A5
      aiLifeStagePlanner: 'https://res.cloudinary.com/uthcccj5/image/upload/f_auto,q_auto/ChatGPT_Image_Sep_17_2026_10_42_36_PM', // A6
      waterEnergyFootprint: 'https://res.cloudinary.com/uthcccj5/image/upload/f_auto,q_auto/ChatGPT_Image_Sep_17_2026_10_45_08_PM', // A7
    },
    finishWorlds: {
      minimalistModern: 'https://res.cloudinary.com/uthcccj5/image/upload/v1789665682/ChatGPT_Image_Sep_17_2026_10_48_21_PM.png', // A8 (3:4)
      classicLuxury: 'https://res.cloudinary.com/uthcccj5/image/upload/v1789665830/ChatGPT_Image_Sep_17_2026_10_53_15_PM.png', // A9 (3:4)
      japaneseZen: 'https://res.cloudinary.com/uthcccj5/image/upload/v1789666018/ChatGPT_Image_Sep_17_2026_10_56_39_PM.png', // A10 (3:4)
    }
  },

  // Section 9 & 10: Step 1 Configurator Assets
  step1: {
    banner: 'https://res.cloudinary.com/uthcccj5/image/upload/v1789666131/ChatGPT_Image_Sep_17_2026_10_58_36_PM.png', // B1 (3:4)
    bathroomTypes: {
      master: 'https://res.cloudinary.com/uthcccj5/image/upload/v1789666758/ChatGPT_Image_Sep_17_2026_11_08_48_PM.png', // B2 Master (1:1)
      guest: 'https://res.cloudinary.com/uthcccj5/image/upload/v1789666892/ChatGPT_Image_Sep_17_2026_11_11_12_PM.png', // B2 Guest (1:1)
      powderRoom: 'https://res.cloudinary.com/uthcccj5/image/upload/v1789666987/ChatGPT_Image_Sep_17_2026_11_12_54_PM.png', // B2 Powder Room (1:1)
    }
  },

  // Section 12: Showers (Exactly four options)
  showers: {
    'shower-thermostatic': 'https://res.cloudinary.com/uthcccj5/image/upload/v1789667232/ChatGPT_Image_Sep_17_2026_11_16_52_PM.png', // C1
    'shower-digital': 'https://res.cloudinary.com/uthcccj5/image/upload/v1789667714/ChatGPT_Image_Sep_17_2026_11_24_57_PM.png', // C2
    'shower-steam': 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=700&auto=format&fit=crop&q=80', // C3 fallback (curated unbranded)
    'shower-rainpanel': 'https://res.cloudinary.com/uthcccj5/image/upload/v1789668166/ChatGPT_Image_Sep_17_2026_11_32_27_PM.png', // C4
  },

  // Section 13: Toilets (Three categories + aliases for complete catalog coverage)
  toilets: {
    'toilet-smart': 'https://res.cloudinary.com/uthcccj5/image/upload/v1789668478/ChatGPT_Image_Sep_17_2026_11_37_43_PM.png', // C5 Intelligent Smart Toilet
    'toilet-wallhung': 'https://res.cloudinary.com/uthcccj5/image/upload/v1789668623/ChatGPT_Image_Sep_17_2026_11_40_10_PM.png', // C6 Wall-Hung Carrier Toilet
    'toilet-floormounted': 'https://res.cloudinary.com/uthcccj5/image/upload/v1789668731/ChatGPT_Image_Sep_17_2026_11_41_58_PM.png', // C7 Floor-Mounted Close-Coupled
    'toilet-onepiece': 'https://res.cloudinary.com/uthcccj5/image/upload/v1789668731/ChatGPT_Image_Sep_17_2026_11_41_58_PM.png', // C7 One-Piece Compact
    'toilet-compact': 'https://res.cloudinary.com/uthcccj5/image/upload/v1789668623/ChatGPT_Image_Sep_17_2026_11_40_10_PM.png', // C6 alias
    'toilet-dualflush': 'https://res.cloudinary.com/uthcccj5/image/upload/v1789668623/ChatGPT_Image_Sep_17_2026_11_40_10_PM.png', // C6 alias
    'toilet-standard': 'https://res.cloudinary.com/uthcccj5/image/upload/v1789668731/ChatGPT_Image_Sep_17_2026_11_41_58_PM.png', // C7 alias
  },

  // Section 14: Vanities (Exactly THREE options)
  vanities: {
    'vanity-floating': 'https://res.cloudinary.com/uthcccj5/image/upload/v1789668901/ChatGPT_Image_Sep_17_2026_11_44_46_PM.png', // C8
    'vanity-freestanding': 'https://res.cloudinary.com/uthcccj5/image/upload/v1789669128/ChatGPT_Image_Sep_17_2026_11_48_28_PM.png', // C9
    'vanity-doublebasin': 'https://res.cloudinary.com/uthcccj5/image/upload/v1789669238/ChatGPT_Image_Sep_17_2026_11_50_14_PM.png', // C10
  },

  // Section 15: Faucets (Exactly THREE options)
  faucets: {
    'faucet-waterfall': 'https://res.cloudinary.com/uthcccj5/image/upload/v1789673940/ChatGPT_Image_Sep_18_2026_01_08_27_AM.png', // C11
    'faucet-singlelever': 'https://res.cloudinary.com/uthcccj5/image/upload/v1789699050/ChatGPT_Image_Sep_18_2026_08_07_12_AM.png', // C12
    'faucet-wallmount': 'https://res.cloudinary.com/uthcccj5/image/upload/v1789699403/ChatGPT_Image_Sep_18_2026_08_13_04_AM.png', // C13
    'faucet-bridge': 'https://res.cloudinary.com/uthcccj5/image/upload/v1789673940/ChatGPT_Image_Sep_18_2026_01_08_27_AM.png', // C11
  },

  // Section 16: Lighting (THREE options under C14 + aliases)
  lighting: {
    'light-downlight': 'https://res.cloudinary.com/uthcccj5/image/upload/v1789699838/ChatGPT_Image_Sep_18_2026_08_20_20_AM.png', // C14-1 IP65 Architectural Downlight
    'light-backlit': 'https://res.cloudinary.com/uthcccj5/image/upload/v1789699881/ChatGPT_Image_Sep_18_2026_08_21_07_AM.png', // C14-2 Indirect Perimeter Backlit
    'light-cove': 'https://res.cloudinary.com/uthcccj5/image/upload/v1789699934/ChatGPT_Image_Sep_18_2026_08_21_48_AM.png', // C14-3 High-CRI Architectural Concealed Cove
    'light-vanitytask': 'https://res.cloudinary.com/uthcccj5/image/upload/v1789699881/ChatGPT_Image_Sep_18_2026_08_21_07_AM.png', // C14-2 Dual Linear Task Light
    'light-mirror': 'https://res.cloudinary.com/uthcccj5/image/upload/v1789699881/ChatGPT_Image_Sep_18_2026_08_21_07_AM.png', // C14-2 alias
    'light-ambient': 'https://res.cloudinary.com/uthcccj5/image/upload/v1789699934/ChatGPT_Image_Sep_18_2026_08_21_48_AM.png', // C14-3 alias
  },

  // Mirror & Extras (Approved Assets)
  extras: {
    'extra-mirror': 'https://res.cloudinary.com/uthcccj5/image/upload/v1789699881/ChatGPT_Image_Sep_18_2026_08_21_07_AM.png', // C14-2
    'extra-glass': 'https://res.cloudinary.com/uthcccj5/image/upload/v1789668166/ChatGPT_Image_Sep_17_2026_11_32_27_PM.png', // C4 Frameless Enclosure
    'extra-ventilation': 'https://res.cloudinary.com/uthcccj5/image/upload/v1789699838/ChatGPT_Image_Sep_18_2026_08_20_20_AM.png', // C14-1 Concealed In-Ceiling Unit
  },

  // Section 17: Flooring / Materials (C15 - 5 options)
  materials: {
    'floor-marble': 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&auto=format&fit=crop&q=80', // C15-1 Calacatta Gold
    'floor-mattestone': 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=500&auto=format&fit=crop&q=80', // C15-2 Matte Basalt
    'floor-woodtile': 'https://images.unsplash.com/photo-1584622781867-1c70e303bc3a?w=500&auto=format&fit=crop&q=80', // C15-3 Smoked Oak
    'floor-terrazzo': 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=500&auto=format&fit=crop&q=80', // C15-4 Architectural Terrazzo
    'floor-concrete': 'https://images.unsplash.com/photo-1595846519845-68e298c2edd8?w=500&auto=format&fit=crop&q=80', // C15-5 Honed Microcement
  },

  // Section 18: Themes / Design Worlds (C16 - Exactly FIVE themes)
  themes: {
    'nature-retreat': 'https://res.cloudinary.com/uthcccj5/image/upload/v1789702465/ChatGPT_Image_Sep_18_2026_09_03_45_AM.png', // C16-1
    'minimalist-modern': 'https://res.cloudinary.com/uthcccj5/image/upload/v1789702369/ChatGPT_Image_Sep_18_2026_09_02_28_AM.png', // C16-2
    'luxury-escape': 'https://res.cloudinary.com/uthcccj5/image/upload/v1789702574/ChatGPT_Image_Sep_18_2026_09_05_47_AM.png', // C16-3
    'coastal-breeze': 'https://res.cloudinary.com/uthcccj5/image/upload/v1789702629/ChatGPT_Image_Sep_18_2026_09_06_55_AM.png', // C16-4
    'urban-chic': 'https://res.cloudinary.com/uthcccj5/image/upload/v1789702727/ChatGPT_Image_Sep_18_2026_09_08_36_AM.png', // C16-5
    'classic-luxury': 'https://res.cloudinary.com/uthcccj5/image/upload/v1789702574/ChatGPT_Image_Sep_18_2026_09_05_47_AM.png', // Alias to Luxury Escape
    'japanese-zen': 'https://res.cloudinary.com/uthcccj5/image/upload/v1789702465/ChatGPT_Image_Sep_18_2026_09_03_45_AM.png', // Alias to Nature Retreat
  },

  // Section 19: AI Theme Blend / Atmospheric Finish Calibration Locked Assets
  themeBlends: {
    'nature-retreat__coastal-breeze': 'https://res.cloudinary.com/uthcccj5/image/upload/v1789801713/ChatGPT_Image_Sep_19_2026_12_38_18_PM.png',
    'nature-retreat__minimalist-modern': 'https://res.cloudinary.com/uthcccj5/image/upload/v1789801760/ChatGPT_Image_Sep_19_2026_12_39_06_PM.png',
    'nature-retreat__luxury-escape': 'https://res.cloudinary.com/uthcccj5/image/upload/v1789801889/ChatGPT_Image_Sep_19_2026_12_41_13_PM.png',
    'nature-retreat__urban-chic': 'https://res.cloudinary.com/uthcccj5/image/upload/v1789802020/ChatGPT_Image_Sep_19_2026_12_43_29_PM.png',
    'minimalist-modern__luxury-escape': 'https://res.cloudinary.com/uthcccj5/image/upload/v1789801966/ChatGPT_Image_Sep_19_2026_12_42_14_PM.png',
    'minimalist-modern__coastal-breeze': 'https://res.cloudinary.com/uthcccj5/image/upload/v1789702629/ChatGPT_Image_Sep_18_2026_09_06_55_AM.png',
    'minimalist-modern__urban-chic': 'https://res.cloudinary.com/uthcccj5/image/upload/v1789802137/ChatGPT_Image_Sep_19_2026_12_45_25_PM.png',
    'luxury-escape__coastal-breeze': 'https://res.cloudinary.com/uthcccj5/image/upload/v1789802201/ChatGPT_Image_Sep_19_2026_12_46_24_PM.png',
    'luxury-escape__urban-chic': 'https://res.cloudinary.com/uthcccj5/image/upload/v1789802330/ChatGPT_Image_Sep_19_2026_12_48_29_PM.png',
    'coastal-breeze__urban-chic': 'https://res.cloudinary.com/uthcccj5/image/upload/v1789802478/ChatGPT_Image_Sep_19_2026_12_51_06_PM.png',
    'reserve-unmapped': 'https://res.cloudinary.com/uthcccj5/image/upload/v1789802020/ChatGPT_Image_Sep_19_2026_12_43_29_PM.png',
  },

  // Section 20: Layout Alternatives (C17 - 3 Options for 3m x 2m)
  layouts: {
    'linear': 'https://res.cloudinary.com/uthcccj5/image/upload/v1789706276/ChatGPT_Image_Sep_18_2026_10_07_33_AM.png', // C17-1 Option 1 — Linear Layout
    'l-shaped': 'https://res.cloudinary.com/uthcccj5/image/upload/v1789706300/ChatGPT_Image_Sep_18_2026_10_07_55_AM.png', // C17-2 Option 2 — L-Shaped Layout
    'parallel': 'https://res.cloudinary.com/uthcccj5/image/upload/v1789706311/ChatGPT_Image_Sep_18_2026_10_08_14_AM.png', // C17-3 Option 3 — Parallel Layout
    'space-optimized': 'https://res.cloudinary.com/uthcccj5/image/upload/v1789706276/ChatGPT_Image_Sep_18_2026_10_07_33_AM.png',
    'luxury-optimized': 'https://res.cloudinary.com/uthcccj5/image/upload/v1789706300/ChatGPT_Image_Sep_18_2026_10_07_55_AM.png',
    'accessibility-oriented': 'https://res.cloudinary.com/uthcccj5/image/upload/v1789706311/ChatGPT_Image_Sep_18_2026_10_08_14_AM.png',
  },
  step2: {
    layouts: {
      linear: 'https://res.cloudinary.com/uthcccj5/image/upload/v1789706276/ChatGPT_Image_Sep_18_2026_10_07_33_AM.png',
      lShaped: 'https://res.cloudinary.com/uthcccj5/image/upload/v1789706300/ChatGPT_Image_Sep_18_2026_10_07_55_AM.png',
      parallel: 'https://res.cloudinary.com/uthcccj5/image/upload/v1789706311/ChatGPT_Image_Sep_18_2026_10_08_14_AM.png',
    }
  }
};

/**
 * Returns approved product image if available, else null
 */
export function getApprovedProductImage(productId: string): string | null {
  const map: Record<string, string> = {
    ...ASSET_MAP.showers,
    ...ASSET_MAP.toilets,
    ...ASSET_MAP.vanities,
    ...ASSET_MAP.faucets,
    ...ASSET_MAP.lighting,
    ...ASSET_MAP.extras,
    ...ASSET_MAP.materials
  };
  return map[productId] || null;
}
