import { ASSET_MAP } from './assets';

export type ThemeId = 
  | 'minimalist-modern' 
  | 'classic-luxury' 
  | 'japanese-zen'
  | 'nature-retreat'
  | 'luxury-escape' 
  | 'coastal-breeze' 
  | 'urban-chic';

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

export const CANONICAL_THEME_IDS: ThemeId[] = [
  'minimalist-modern',
  'classic-luxury',
  'japanese-zen'
];

export const THEMES: Record<string, ThemeDefinition> = {
  // 1. Minimalist Modern
  'minimalist-modern': {
    id: 'minimalist-modern',
    name: 'Minimalist Modern',
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

  // 2. Classic Luxury
  'classic-luxury': {
    id: 'classic-luxury',
    name: 'Classic Luxury',
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
      vanity: 'vanity-freestanding',
      extras: ['extra-mirror', 'extra-glass', 'extra-ventilation']
    }
  },

  // 3. Japanese Zen
  'japanese-zen': {
    id: 'japanese-zen',
    name: 'Japanese Zen',
    finishes: 'Brushed Bronze / Tactile Cedar / Basalt',
    tone: 'Earthy organic dark basalt tone',
    accentColor: '#4A6B52',
    accentHover: '#3B5542',
    accentSoft: 'rgba(74, 107, 82, 0.15)',
    description: 'Biophilic cedar, flamed basalt stone, and muted brass create a restorative spa sanctuary.',
    tagline: 'Natural sunlight, tactile cedar, and stone textures calm the senses.',
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

  // Legacy mappings & aliases for backwards-compatibility
  'luxury-escape': {
    id: 'luxury-escape',
    name: 'Classic Luxury',
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
      vanity: 'vanity-freestanding',
      extras: ['extra-mirror', 'extra-glass', 'extra-ventilation']
    }
  },
  'nature-retreat': {
    id: 'nature-retreat',
    name: 'Japanese Zen',
    finishes: 'Brushed Bronze / Tactile Cedar / Basalt',
    tone: 'Earthy organic dark basalt tone',
    accentColor: '#4A6B52',
    accentHover: '#3B5542',
    accentSoft: 'rgba(74, 107, 82, 0.15)',
    description: 'Biophilic cedar, flamed basalt stone, and muted brass create a restorative spa sanctuary.',
    tagline: 'Natural sunlight, tactile cedar, and stone textures calm the senses.',
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
  'coastal-breeze': {
    id: 'coastal-breeze',
    name: 'Minimalist Modern',
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
  'urban-chic': {
    id: 'urban-chic',
    name: 'Minimalist Modern',
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
  }
};
