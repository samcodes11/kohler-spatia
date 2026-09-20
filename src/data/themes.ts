import { ASSET_MAP } from './assets';

export type ThemeId = 
  | 'nature-retreat' 
  | 'minimalist-modern' 
  | 'luxury-escape' 
  | 'coastal-breeze' 
  | 'urban-chic'
  | 'classic-luxury' 
  | 'japanese-zen';

export interface ThemeDefinition {
  id: ThemeId;
  name: string;
  finishes: string;
  tone: string;
  accentColor: string;
  accentHover: string;
  accentSoft: string;
  description: string;
  tagline: string;
  lightingTemp: string;
  wallTexture: string;
  floorTexture: string;
  imageUrl: string;
  previewImage: string;
  recommendedFixtures: {
    shower: string;
    toilet: string;
    faucet: string;
    lighting: string;
    flooring: string;
    vanity: string;
    extras: string[];
  };
}

export const THEMES: Record<string, ThemeDefinition> = {
  // C16-1: Nature Retreat
  'nature-retreat': {
    id: 'nature-retreat',
    name: 'Nature Retreat',
    finishes: 'Brushed Bronze / Tactile Cedar',
    tone: 'Earthy organic tone',
    accentColor: '#4A6B52',
    accentHover: '#3B5542',
    accentSoft: 'rgba(74, 107, 82, 0.15)',
    description: 'Biophilic cedar, lime plaster, and warm stone create a restorative spa sanctuary.',
    tagline: 'Natural sunlight and botanical textures calm the senses.',
    lightingTemp: '3000K Warm Diffused Sunlight',
    wallTexture: 'Fluted Hinoki Cypress & Lime Plaster',
    floorTexture: 'Thermal Flamed Basalt Stone',
    imageUrl: ASSET_MAP.themes['nature-retreat'],
    previewImage: ASSET_MAP.themes['nature-retreat'],
    recommendedFixtures: {
      shower: 'shower-thermostatic',
      toilet: 'toilet-smart',
      faucet: 'faucet-wallmount',
      lighting: 'light-cove',
      flooring: 'floor-woodtile',
      vanity: 'vanity-freestanding',
      extras: ['extra-mirror', 'extra-ventilation']
    }
  },

  // C16-2: Modern Minimalist
  'minimalist-modern': {
    id: 'minimalist-modern',
    name: 'Modern Minimalist',
    finishes: 'Polished Chrome / Vibrant Polished Nickel',
    tone: 'Crisp monochrome silver tone',
    accentColor: '#6E7E91',
    accentHover: '#546375',
    accentSoft: 'rgba(110, 126, 145, 0.15)',
    description: 'Architectural lines, frameless transitions, and pure chrome create effortless visual clarity.',
    tagline: 'Precision-engineered minimalism bathed in shadowless daylight.',
    lightingTemp: '4000K Neutral Crisp Light',
    wallTexture: 'Smooth Porcelain Stucco',
    floorTexture: 'Large-Format Microcement',
    imageUrl: ASSET_MAP.themes['minimalist-modern'],
    previewImage: ASSET_MAP.themes['minimalist-modern'],
    recommendedFixtures: {
      shower: 'shower-digital',
      toilet: 'toilet-wallhung',
      faucet: 'faucet-waterfall',
      lighting: 'light-backlit',
      flooring: 'floor-mattestone',
      vanity: 'vanity-floating',
      extras: ['extra-mirror', 'extra-glass']
    }
  },

  // C16-3: Luxury Escape
  'luxury-escape': {
    id: 'luxury-escape',
    name: 'Luxury Escape',
    finishes: 'Vibrant French Gold / Polished Nero Marquina',
    tone: 'Dramatic bullion gold tone',
    accentColor: '#AE8A4E',
    accentHover: '#96743A',
    accentSoft: 'rgba(174, 138, 78, 0.15)',
    description: 'Bookmatched Calacatta marble and brushed gold hardware craft an opulent private sanctuary.',
    tagline: 'Unapologetic architectural glamour with heirloom French Gold metallurgy.',
    lightingTemp: '2700K Warm Luminescent Amber',
    wallTexture: 'Bookmatched Calacatta & Nero Marquina',
    floorTexture: 'Polished Calacatta Gold Tile',
    imageUrl: ASSET_MAP.themes['luxury-escape'],
    previewImage: ASSET_MAP.themes['luxury-escape'],
    recommendedFixtures: {
      shower: 'shower-thermostatic',
      toilet: 'toilet-smart',
      faucet: 'faucet-bridge',
      lighting: 'light-cove',
      flooring: 'floor-marble',
      vanity: 'vanity-doublebasin',
      extras: ['extra-mirror', 'extra-glass', 'extra-ventilation']
    }
  },

  // C16-4: Coastal Breeze
  'coastal-breeze': {
    id: 'coastal-breeze',
    name: 'Coastal Breeze',
    finishes: 'Vibrant Brushed Nickel / Bleached Oak',
    tone: 'Airy seafoam azure tone',
    accentColor: '#5B8A99',
    accentHover: '#47707E',
    accentSoft: 'rgba(91, 138, 153, 0.15)',
    description: 'Driftwood oak, honed limestone, and seafoam tones capture breezy seaside calm.',
    tagline: 'Effortless coastal lightness with airy maritime fluidity.',
    lightingTemp: '3500K Fresh Morning Daylight',
    wallTexture: 'Glazed Zellige Subway Tile & Limewash',
    floorTexture: 'Honed Seafoam Limestone',
    imageUrl: ASSET_MAP.themes['coastal-breeze'],
    previewImage: ASSET_MAP.themes['coastal-breeze'],
    recommendedFixtures: {
      shower: 'shower-rainpanel',
      toilet: 'toilet-wallhung',
      faucet: 'faucet-singlelever',
      lighting: 'light-downlight',
      flooring: 'floor-mattestone',
      vanity: 'vanity-floating',
      extras: ['extra-mirror', 'extra-glass']
    }
  },

  // C16-5: Urban Chic
  'urban-chic': {
    id: 'urban-chic',
    name: 'Urban Chic',
    finishes: 'Matte Black / Fluted Terracotta',
    tone: 'Warm terracotta & matte black tone',
    accentColor: '#9C5843',
    accentHover: '#814634',
    accentSoft: 'rgba(156, 88, 67, 0.15)',
    description: 'Terracotta fluting, raw microcement, and matte black accents deliver modern loft energy.',
    tagline: 'Tactile earth tones meet a crisp industrial metropolitan silhouette.',
    lightingTemp: '3000K Balanced Editorial Warmth',
    wallTexture: 'Terracotta Fluted Clay & Exposed Microcement',
    floorTexture: 'Warm Terrazzo with Amber Aggregate',
    imageUrl: ASSET_MAP.themes['urban-chic'],
    previewImage: ASSET_MAP.themes['urban-chic'],
    recommendedFixtures: {
      shower: 'shower-digital',
      toilet: 'toilet-wallhung',
      faucet: 'faucet-wallmount',
      lighting: 'light-backlit',
      flooring: 'floor-terrazzo',
      vanity: 'vanity-floating',
      extras: ['extra-mirror', 'extra-ventilation']
    }
  },

  // Legacy mappings for backwards-compatibility
  'classic-luxury': {
    id: 'classic-luxury',
    name: 'Luxury Escape',
    finishes: 'Vibrant French Gold / Vibrant Brushed Bronze',
    tone: 'Warm gold tone',
    accentColor: '#AE8A4E',
    accentHover: '#96743A',
    accentSoft: 'rgba(174, 138, 78, 0.15)',
    description: 'Heritage proportions, bullion gold metals, and bookmatched stone craft timeless grandeur.',
    tagline: 'Unapologetic grandeur with heirloom craftsmanship.',
    lightingTemp: '2700K Warm Luminescent Glow',
    wallTexture: 'Honed Calacatta Marble',
    floorTexture: 'Polished Calacatta Gold Tile',
    imageUrl: ASSET_MAP.themes['luxury-escape'],
    previewImage: ASSET_MAP.themes['luxury-escape'],
    recommendedFixtures: {
      shower: 'shower-thermostatic',
      toilet: 'toilet-smart',
      faucet: 'faucet-bridge',
      lighting: 'light-cove',
      flooring: 'floor-marble',
      vanity: 'vanity-freestanding',
      extras: ['extra-mirror', 'extra-glass', 'extra-ventilation']
    }
  },
  'japanese-zen': {
    id: 'japanese-zen',
    name: 'Nature Retreat',
    finishes: 'Matte Black / Vibrant Titanium',
    tone: 'Dark matte tone',
    accentColor: '#2E343B',
    accentHover: '#1B2024',
    accentSoft: 'rgba(46, 52, 59, 0.2)',
    description: 'Tactile basalt surfaces and smoked titanium create a mindful onsen bathing sanctuary.',
    tagline: 'Wabi-sabi tranquility meets avant-garde spatial quietude.',
    lightingTemp: '3000K Soft Diffused Amber Light',
    wallTexture: 'Charcoal Slatted Cedar & Basalt',
    floorTexture: 'Thermal Flamed Basalt Stone',
    imageUrl: ASSET_MAP.themes['japanese-zen'],
    previewImage: ASSET_MAP.themes['japanese-zen'],
    recommendedFixtures: {
      shower: 'shower-steam',
      toilet: 'toilet-smart',
      faucet: 'faucet-wallmount',
      lighting: 'light-cove',
      flooring: 'floor-mattestone',
      vanity: 'vanity-floating',
      extras: ['extra-mirror', 'extra-ventilation']
    }
  }
};
