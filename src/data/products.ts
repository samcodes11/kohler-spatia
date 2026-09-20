import { IMAGE_MAP } from './imageMap';
import { getApprovedProductImage } from './assets';
import { ThemeId } from './themes';
import { ProductVisual3D, PRODUCT_VISUALS_3D } from './productVisuals3D';

export type ProductCategory = 
  | 'shower' 
  | 'toilet' 
  | 'faucet' 
  | 'lighting' 
  | 'flooring' 
  | 'vanity' 
  | 'mirror-extras';

export type PriceTier = 'Essential' | 'Mid-luxury' | 'Premium';

export type InstallationComplexity = 'Low' | 'Moderate' | 'High';

export interface ProductClearance {
  frontMm: number;
  sideLeftMm: number;
  sideRightMm: number;
  overheadMm?: number;
}

export interface PlumbingRequirements {
  minDynamicBar: number;
  drainDiameterMm: number;
  supplyLineSizeInch: string;
  wastePosition: 'wall' | 'floor' | 'ceiling';
  electricalLoadWatts?: number;
}

export interface AccessibilityCharacteristics {
  adaCompliant: boolean;
  zeroThreshold: boolean;
  leverOperated: boolean;
  grabBarCompatible: boolean;
  comfortHeight: boolean;
  notes: string;
}

export interface ProductItem {
  id: string;
  productId: string;
  name: string;
  category: ProductCategory;
  tier: PriceTier;
  price: number;
  width: number;
  depth: number;
  height: number;
  dimensions: {
    widthMm: number;
    depthMm: number;
    heightMm: number;
  };
  requiredClearance: ProductClearance;
  spaceFootprint: {
    minRoomAreaSqFt: number;
    minWidthMm: number;
    clearanceFrontMm: number;
  };
  styleTags: string[];
  finishOptions: string[];
  themeFit: (ThemeId | string)[];
  finishName: string;
  finishCode: string;
  finishColor: string;
  waterConsumption: {
    flowRateLpm: number;
    annualEstimatedLitres: number;
  };
  energyCharacteristics: {
    powerWatts: number;
    annualKwhEstimate: number;
  };
  smartFeatures: string[];
  plumbingRequirements: PlumbingRequirements;
  installationComplexity: InstallationComplexity;
  accessibilityCharacteristics: AccessibilityCharacteristics;
  leadTimeWeeks: number;
  imageUrl: string;
  searchQuery: string;
  whyThis: Record<string, string>;
  description: string;
  features: string[];
  crossSellIds: string[];
  visual3D?: ProductVisual3D;
}

export const PRODUCTS: ProductItem[] = [
  // ===================== SHOWER (4) =====================
  {
    id: 'shower-digital',
    productId: 'shower-digital',
    name: 'Digital Thermostatic Multipoint Shower System',
    category: 'shower',
    tier: 'Premium',
    price: 125000,
    width: 900,
    depth: 900,
    height: 2200,
    dimensions: { widthMm: 900, depthMm: 900, heightMm: 2200 },
    requiredClearance: { frontMm: 900, sideLeftMm: 150, sideRightMm: 150, overheadMm: 200 },
    spaceFootprint: { minRoomAreaSqFt: 45, minWidthMm: 900, clearanceFrontMm: 800 },
    styleTags: ['digital', 'smart-home', 'minimalist', 'high-tech', 'chrome', 'titanium'],
    finishOptions: ['Polished Chrome', 'Vibrant Titanium', 'Matte Black'],
    themeFit: ['minimalist-modern', 'japanese-zen'],
    finishName: 'Polished Chrome / Vibrant Titanium',
    finishCode: 'CP / TT',
    finishColor: '#D3D8DE',
    waterConsumption: { flowRateLpm: 12.0, annualEstimatedLitres: 17520 },
    energyCharacteristics: { powerWatts: 45, annualKwhEstimate: 16.4 },
    smartFeatures: ['Capacitive glass thermostatic controller', 'Dual temperature presets', 'Bluetooth pairing', 'Warm-up mode'],
    plumbingRequirements: {
      minDynamicBar: 3.0,
      drainDiameterMm: 90,
      supplyLineSizeInch: '3/4"',
      wastePosition: 'floor',
      electricalLoadWatts: 45
    },
    installationComplexity: 'High',
    accessibilityCharacteristics: {
      adaCompliant: true,
      zeroThreshold: true,
      leverOperated: false,
      grabBarCompatible: true,
      comfortHeight: true,
      notes: 'Push-button digital controls eliminate physical gripping strain entirely.'
    },
    leadTimeWeeks: 2,
    imageUrl: getApprovedProductImage('shower-digital') || IMAGE_MAP['shower-digital'],
    searchQuery: 'digital smart shower system bathroom',
    whyThis: {
      'minimalist-modern': 'Glass touchscreen balances water flow with flush architectural elegance.',
      'japanese-zen': 'Programmable mist sequences recreate restorative forest onsen rituals.',
      'classic-luxury': 'High-flow multi-outlet diverter delivers opulent rain coverage.'
    },
    description: 'Capacitive glass touchscreen balances water temperature and sequence with digital precision.',
    features: ['Precision digital thermostatic valve', 'Dual programmable temperature presets', 'Zero-drift ceramic disc cartridge', 'Integrated Bluetooth pairing'],
    crossSellIds: ['faucet-waterfall', 'light-backlit', 'extra-glass']
  },
  {
    id: 'shower-rainpanel',
    productId: 'shower-rainpanel',
    name: 'Flush Ceiling-Mount Rainhead Panel',
    category: 'shower',
    tier: 'Mid-luxury',
    price: 58000,
    width: 600,
    depth: 600,
    height: 60,
    dimensions: { widthMm: 600, depthMm: 600, heightMm: 60 },
    requiredClearance: { frontMm: 800, sideLeftMm: 200, sideRightMm: 200, overheadMm: 0 },
    spaceFootprint: { minRoomAreaSqFt: 35, minWidthMm: 800, clearanceFrontMm: 700 },
    styleTags: ['ceiling-flush', 'minimalist', 'architectural', 'drench', 'chrome'],
    finishOptions: ['Polished Chrome', 'Vibrant Polished Nickel'],
    themeFit: ['minimalist-modern'],
    finishName: 'Polished Chrome',
    finishCode: 'CP',
    finishColor: '#E2E6EA',
    waterConsumption: { flowRateLpm: 14.0, annualEstimatedLitres: 20440 },
    energyCharacteristics: { powerWatts: 0, annualKwhEstimate: 0 },
    smartFeatures: ['MasterClean anti-calcification sprayface'],
    plumbingRequirements: {
      minDynamicBar: 2.5,
      drainDiameterMm: 90,
      supplyLineSizeInch: '1/2"',
      wastePosition: 'ceiling'
    },
    installationComplexity: 'Moderate',
    accessibilityCharacteristics: {
      adaCompliant: true,
      zeroThreshold: true,
      leverOperated: false,
      grabBarCompatible: true,
      comfortHeight: false,
      notes: 'Ceiling flush installation leaves shower floor fully clear and obstruction-free.'
    },
    leadTimeWeeks: 1,
    imageUrl: getApprovedProductImage('shower-rainpanel') || IMAGE_MAP['shower-rainpanel'],
    searchQuery: 'rain shower head ceiling mount bathroom',
    whyThis: {
      'minimalist-modern': 'Flush ceiling profile creates an uninterrupted overhead plane.',
      'japanese-zen': 'Gravitational water canopy mimics natural mountain rainfall.',
      'classic-luxury': 'Wide rain dispersal delivers complete shoulder-to-shoulder warmth.'
    },
    description: 'Ceiling-flush architectural rainhead delivers immersive, air-infused droplet coverage.',
    features: ['Flush ceiling architectural profile', 'Anti-calcification silicone spray nozzles', 'Air-induction full canopy droplet flow'],
    crossSellIds: ['faucet-singlelever', 'light-downlight', 'extra-glass']
  },
  {
    id: 'shower-thermostatic',
    productId: 'shower-thermostatic',
    name: 'Thermostatic Dual-Function Exposed Shower Column',
    category: 'shower',
    tier: 'Mid-luxury',
    price: 78000,
    width: 750,
    depth: 450,
    height: 1200,
    dimensions: { widthMm: 750, depthMm: 450, heightMm: 1200 },
    requiredClearance: { frontMm: 850, sideLeftMm: 200, sideRightMm: 200, overheadMm: 100 },
    spaceFootprint: { minRoomAreaSqFt: 38, minWidthMm: 850, clearanceFrontMm: 750 },
    styleTags: ['exposed-pipe', 'french-gold', 'thermostatic', 'luxury', 'dual-outlet'],
    finishOptions: ['Vibrant French Gold', 'Vibrant Brushed Bronze', 'Polished Chrome'],
    themeFit: ['classic-luxury', 'japanese-zen'],
    finishName: 'Vibrant French Gold',
    finishCode: 'AF',
    finishColor: '#C49E5A',
    waterConsumption: { flowRateLpm: 11.5, annualEstimatedLitres: 16790 },
    energyCharacteristics: { powerWatts: 0, annualKwhEstimate: 0 },
    smartFeatures: ['Thermostatic safety stop at 38°C', 'CoolTouch anti-scald body'],
    plumbingRequirements: {
      minDynamicBar: 2.0,
      drainDiameterMm: 90,
      supplyLineSizeInch: '1/2"',
      wastePosition: 'wall'
    },
    installationComplexity: 'Moderate',
    accessibilityCharacteristics: {
      adaCompliant: true,
      zeroThreshold: true,
      leverOperated: true,
      grabBarCompatible: true,
      comfortHeight: true,
      notes: 'Cool-touch valve body prevents accidental contact scalding.'
    },
    leadTimeWeeks: 2,
    imageUrl: getApprovedProductImage('shower-thermostatic') || IMAGE_MAP['shower-thermostatic'],
    searchQuery: 'exposed thermostatic brass shower system luxury',
    whyThis: {
      'classic-luxury': 'Sculpted French Gold column anchors the bath with heirloom warmth.',
      'japanese-zen': 'Tactile manual thermostatic control provides intuitive warmth adjustments.',
      'minimalist-modern': 'Architectural exposed geometry provides rich visual rhythm.'
    },
    description: 'Exposed thermostatic column combines an overhead rain shower with targeted hand-sprays.',
    features: ['Thermostatic scalding safety limiter', 'Dual overhead and hand-shower heads', 'CoolTouch anti-scald valve body'],
    crossSellIds: ['faucet-bridge', 'floor-marble', 'vanity-freestanding']
  },
  {
    id: 'shower-steam',
    productId: 'shower-steam',
    name: 'Modular Steam Generator & Enclosure Suite',
    category: 'shower',
    tier: 'Premium',
    price: 185000,
    width: 1200,
    depth: 1000,
    height: 2200,
    dimensions: { widthMm: 1200, depthMm: 1000, heightMm: 2200 },
    requiredClearance: { frontMm: 1000, sideLeftMm: 200, sideRightMm: 200, overheadMm: 300 },
    spaceFootprint: { minRoomAreaSqFt: 55, minWidthMm: 1200, clearanceFrontMm: 900 },
    styleTags: ['steam-room', 'wellness', 'spa', 'aromatherapy', 'enclosure'],
    finishOptions: ['Matte Black Enclosure / Clear Glass', 'Brushed Bronze / Frosted Glass'],
    themeFit: ['japanese-zen', 'classic-luxury'],
    finishName: 'Matte Black / Starphire Low-Iron Glass',
    finishCode: 'BL / CL',
    finishColor: '#1A1D20',
    waterConsumption: { flowRateLpm: 6.0, annualEstimatedLitres: 8760 },
    energyCharacteristics: { powerWatts: 4500, annualKwhEstimate: 210.0 },
    smartFeatures: ['Fast-response steam within 60 seconds', 'Aromatherapy oil well', 'Automated auto-flush purge'],
    plumbingRequirements: {
      minDynamicBar: 2.5,
      drainDiameterMm: 90,
      supplyLineSizeInch: '1/2"',
      wastePosition: 'floor',
      electricalLoadWatts: 4500
    },
    installationComplexity: 'High',
    accessibilityCharacteristics: {
      adaCompliant: true,
      zeroThreshold: true,
      leverOperated: false,
      grabBarCompatible: true,
      comfortHeight: true,
      notes: 'Zero-threshold floor pan ensures smooth, barrier-free wheelchair accessibility.'
    },
    leadTimeWeeks: 3,
    imageUrl: getApprovedProductImage('shower-steam') || IMAGE_MAP['shower-steam'],
    searchQuery: 'steam shower cabin enclosure luxury bathroom',
    whyThis: {
      'japanese-zen': 'Turns daily bathing into an authentic therapeutic onsen steam ritual.',
      'classic-luxury': 'Ultimate personal spa retreat integrated seamlessly into master suite.',
      'minimalist-modern': 'Crisp frameless glass enclosure keeps room sightlines open.'
    },
    description: 'Fast-response steam generator turns the shower into an immersive wellness sanctuary.',
    features: ['Fast-start steam within 60 seconds', 'Essential oil aromatherapy reservoir', 'Automated maintenance purge cycle'],
    crossSellIds: ['floor-mattestone', 'light-cove', 'extra-glass']
  },

  // ===================== TOILET (4) =====================
  {
    id: 'toilet-wallhung',
    productId: 'toilet-wallhung',
    name: 'Wall-Hung Elongated Toilet',
    category: 'toilet',
    tier: 'Mid-luxury',
    price: 48000,
    width: 380,
    depth: 540,
    height: 360,
    dimensions: { widthMm: 380, depthMm: 540, heightMm: 360 },
    requiredClearance: { frontMm: 700, sideLeftMm: 200, sideRightMm: 200 },
    spaceFootprint: { minRoomAreaSqFt: 25, minWidthMm: 750, clearanceFrontMm: 600 },
    styleTags: ['wall-hung', 'cantilevered', 'minimalist', 'hygiene', 'porcelain'],
    finishOptions: ['Porcelain White / Chrome Plate', 'Porcelain White / Matte Black Plate'],
    themeFit: ['minimalist-modern', 'japanese-zen'],
    finishName: 'Porcelain White / Matte Chrome Plate',
    finishCode: '0 / CP',
    finishColor: '#F3F4F6',
    waterConsumption: { flowRateLpm: 4.0, annualEstimatedLitres: 5840 },
    energyCharacteristics: { powerWatts: 0, annualKwhEstimate: 0 },
    smartFeatures: ['Dual pneumatic eco-flush 3L/4.5L', 'Rimless hygienic vortex bowl'],
    plumbingRequirements: {
      minDynamicBar: 1.5,
      drainDiameterMm: 110,
      supplyLineSizeInch: '1/2"',
      wastePosition: 'wall'
    },
    installationComplexity: 'Moderate',
    accessibilityCharacteristics: {
      adaCompliant: true,
      zeroThreshold: false,
      leverOperated: false,
      grabBarCompatible: true,
      comfortHeight: true,
      notes: 'In-wall carrier enables installation at customizable ergonomic comfort heights.'
    },
    leadTimeWeeks: 1,
    imageUrl: getApprovedProductImage('toilet-wallhung') || IMAGE_MAP['toilet-wallhung'],
    searchQuery: 'wall hung toilet modern bathroom minimalist',
    whyThis: {
      'minimalist-modern': 'Cantilevered bowl frees floor area for rapid sanitization and clean sightlines.',
      'japanese-zen': 'Concealed tank keeps wall geometry serene and uncluttered.',
      'classic-luxury': 'In-wall cistern preserves pristine wall trim finishes.'
    },
    description: 'Suspended bowl with concealed in-wall tank frees floor space for effortless sanitization.',
    features: ['Rimless hygienic vortex bowl', 'Dual pneumatic 3L/4.5L actuator', 'Soft-close quick-release seat', 'Concealed in-wall tank carrier'],
    crossSellIds: ['vanity-floating', 'faucet-waterfall', 'light-downlight']
  },
  {
    id: 'toilet-smart',
    productId: 'toilet-smart',
    name: 'Integrated Smart Bidet Toilet',
    category: 'toilet',
    tier: 'Premium',
    price: 110000,
    width: 420,
    depth: 680,
    height: 520,
    dimensions: { widthMm: 420, depthMm: 680, heightMm: 520 },
    requiredClearance: { frontMm: 750, sideLeftMm: 220, sideRightMm: 220 },
    spaceFootprint: { minRoomAreaSqFt: 35, minWidthMm: 800, clearanceFrontMm: 700 },
    styleTags: ['smart-toilet', 'bidet', 'japanese-tech', 'heated-seat', 'luxury'],
    finishOptions: ['Porcelain White / Vibrant Titanium Trim', 'Porcelain White / Matte Black Trim'],
    themeFit: ['japanese-zen', 'classic-luxury', 'minimalist-modern'],
    finishName: 'Porcelain White / Vibrant Titanium Trim',
    finishCode: '0 / TT',
    finishColor: '#E8ECF1',
    waterConsumption: { flowRateLpm: 3.8, annualEstimatedLitres: 5548 },
    energyCharacteristics: { powerWatts: 850, annualKwhEstimate: 95.0 },
    smartFeatures: ['Auto open/close radar lid', 'UV self-cleaning bidet wand', 'Warm-air dryer', 'LED path light', 'Carbon deodorizer'],
    plumbingRequirements: {
      minDynamicBar: 2.0,
      drainDiameterMm: 110,
      supplyLineSizeInch: '1/2"',
      wastePosition: 'floor',
      electricalLoadWatts: 850
    },
    installationComplexity: 'High',
    accessibilityCharacteristics: {
      adaCompliant: true,
      zeroThreshold: false,
      leverOperated: false,
      grabBarCompatible: true,
      comfortHeight: true,
      notes: 'Hands-free radar lid and wireless remote eliminate physical bending strain.'
    },
    leadTimeWeeks: 2,
    imageUrl: getApprovedProductImage('toilet-smart') || IMAGE_MAP['toilet-smart'],
    searchQuery: 'smart toilet bidet luxury bathroom white',
    whyThis: {
      'japanese-zen': 'Motion lid, heated bidet wand, and warm air dryer bring Tokyo luxury home.',
      'classic-luxury': 'Hands-free comfort and pampering warm-water cleansing.',
      'minimalist-modern': 'Sleek monolithic one-piece silhouette with ambient LED path light.'
    },
    description: 'Intelligent bidet toilet features automated radar lid, heated seat, and warm-air drying.',
    features: ['Radar motion hands-free lid', 'Self-sanitizing electrolytic UV wand', 'Heated seat with warmth presets', 'Active carbon odor deodorizer'],
    crossSellIds: ['vanity-doublebasin', 'shower-digital', 'extra-mirror']
  },
  {
    id: 'toilet-floormounted',
    productId: 'toilet-floormounted',
    name: 'Floor-Mounted Close-Coupled Toilet',
    category: 'toilet',
    tier: 'Essential',
    price: 22000,
    width: 400,
    depth: 700,
    height: 780,
    dimensions: { widthMm: 400, depthMm: 700, heightMm: 780 },
    requiredClearance: { frontMm: 650, sideLeftMm: 180, sideRightMm: 180 },
    spaceFootprint: { minRoomAreaSqFt: 25, minWidthMm: 750, clearanceFrontMm: 600 },
    styleTags: ['two-piece', 'standard', 'practical', 'reliable', 'porcelain'],
    finishOptions: ['Porcelain White / Chrome Lever'],
    themeFit: ['minimalist-modern'],
    finishName: 'Porcelain White / Chrome Lever',
    finishCode: '0 / CP',
    finishColor: '#FAF9F6',
    waterConsumption: { flowRateLpm: 4.5, annualEstimatedLitres: 6570 },
    energyCharacteristics: { powerWatts: 0, annualKwhEstimate: 0 },
    smartFeatures: ['Class Five bulk flush engine'],
    plumbingRequirements: {
      minDynamicBar: 1.0,
      drainDiameterMm: 100,
      supplyLineSizeInch: '1/2"',
      wastePosition: 'floor'
    },
    installationComplexity: 'Low',
    accessibilityCharacteristics: {
      adaCompliant: false,
      zeroThreshold: false,
      leverOperated: true,
      grabBarCompatible: true,
      comfortHeight: false,
      notes: 'Standard floor-mount rough-in installs cleanly with zero drywall alteration.'
    },
    leadTimeWeeks: 1,
    imageUrl: getApprovedProductImage('toilet-floormounted') || IMAGE_MAP['toilet-floormounted'],
    searchQuery: 'modern ceramic white floor mounted toilet',
    whyThis: {
      'minimalist-modern': 'Durable vitreous china engineered for high-traffic guest suites.',
      'classic-luxury': 'Standard rough-in installation with zero drywall restructuring required.',
      'japanese-zen': 'Straightforward utility with minimal maintenance requirements.'
    },
    description: 'Durable vitreous china two-piece toilet delivers dependable, high-velocity bulk waste flushing.',
    features: ['High-velocity bulk flush engine', 'Stain-resistant glazed vitreous china', 'Comfort-contoured elongated seat', 'Standard 12-inch floor rough-in'],
    crossSellIds: ['vanity-floating', 'faucet-singlelever', 'light-downlight']
  },
  {
    id: 'toilet-onepiece',
    productId: 'toilet-onepiece',
    name: 'One-Piece Compact Elongated Toilet',
    category: 'toilet',
    tier: 'Essential',
    price: 26000,
    width: 410,
    depth: 720,
    height: 740,
    dimensions: { widthMm: 410, depthMm: 720, heightMm: 740 },
    requiredClearance: { frontMm: 700, sideLeftMm: 200, sideRightMm: 200 },
    spaceFootprint: { minRoomAreaSqFt: 28, minWidthMm: 760, clearanceFrontMm: 650 },
    styleTags: ['one-piece', 'seamless', 'compact', 'easy-clean', 'porcelain'],
    finishOptions: ['Porcelain White / Polished Nickel Lever'],
    themeFit: ['classic-luxury', 'minimalist-modern'],
    finishName: 'Porcelain White / Polished Nickel Lever',
    finishCode: '0 / SN',
    finishColor: '#F5F5F3',
    waterConsumption: { flowRateLpm: 4.2, annualEstimatedLitres: 6132 },
    energyCharacteristics: { powerWatts: 0, annualKwhEstimate: 0 },
    smartFeatures: ['Siphon jet silent flush'],
    plumbingRequirements: {
      minDynamicBar: 1.2,
      drainDiameterMm: 100,
      supplyLineSizeInch: '1/2"',
      wastePosition: 'floor'
    },
    installationComplexity: 'Low',
    accessibilityCharacteristics: {
      adaCompliant: false,
      zeroThreshold: false,
      leverOperated: true,
      grabBarCompatible: true,
      comfortHeight: false,
      notes: 'Monolithic crevice-free unibody streamlines everyday cleaning.'
    },
    leadTimeWeeks: 1,
    imageUrl: getApprovedProductImage('toilet-onepiece') || IMAGE_MAP['toilet-onepiece'],
    searchQuery: 'one piece white porcelain commode toilet',
    whyThis: {
      'classic-luxury': 'Seamless unibody eliminates tank crevices for effortless wipe-down cleaning.',
      'minimalist-modern': 'Compact elongated bowl fits snug alcoves without feeling cramped.',
      'japanese-zen': 'Quiet siphon jet flushing preserves quiet bathroom tranquility.'
    },
    description: 'Seamless monolithic porcelain body eliminates tank crevices for quick, effortless cleaning.',
    features: ['Seamless crevice-free unibody', 'Whisper-quiet siphon jet flushing', 'Compact elongated space-saving bowl', 'Vitreous china stain shield'],
    crossSellIds: ['vanity-floating', 'faucet-singlelever', 'light-downlight']
  },

  // ===================== FAUCET (4) =====================
  {
    id: 'faucet-waterfall',
    productId: 'faucet-waterfall',
    name: 'Deck-Mount Waterfall Basin Mixer',
    category: 'faucet',
    tier: 'Mid-luxury',
    price: 24000,
    width: 60,
    depth: 180,
    height: 220,
    dimensions: { widthMm: 60, depthMm: 180, heightMm: 220 },
    requiredClearance: { frontMm: 300, sideLeftMm: 150, sideRightMm: 150 },
    spaceFootprint: { minRoomAreaSqFt: 15, minWidthMm: 500, clearanceFrontMm: 300 },
    styleTags: ['waterfall', 'open-trough', 'laminar', 'sensory', 'chrome'],
    finishOptions: ['Polished Chrome', 'Vibrant Titanium'],
    themeFit: ['minimalist-modern', 'japanese-zen'],
    finishName: 'Polished Chrome / Vibrant Titanium',
    finishCode: 'CP / TT',
    finishColor: '#B0B7BF',
    waterConsumption: { flowRateLpm: 5.5, annualEstimatedLitres: 4015 },
    energyCharacteristics: { powerWatts: 0, annualKwhEstimate: 0 },
    smartFeatures: ['Anti-splash laminar chute'],
    plumbingRequirements: {
      minDynamicBar: 1.5,
      drainDiameterMm: 32,
      supplyLineSizeInch: '1/2"',
      wastePosition: 'wall'
    },
    installationComplexity: 'Low',
    accessibilityCharacteristics: {
      adaCompliant: true,
      zeroThreshold: false,
      leverOperated: true,
      grabBarCompatible: false,
      comfortHeight: false,
      notes: 'Ergonomic joystick permits effortless single-handed or forearm operation.'
    },
    leadTimeWeeks: 1,
    imageUrl: getApprovedProductImage('faucet-waterfall') || IMAGE_MAP['faucet-waterfall'],
    searchQuery: 'waterfall bathroom sink faucet chrome',
    whyThis: {
      'minimalist-modern': 'Open trough spout creates an architectural laminar water ribbon.',
      'japanese-zen': 'Cascading stream evokes peaceful woodland water features.',
      'classic-luxury': 'Geometric focal point on rich stone countertops.'
    },
    description: 'Open-trough spout creates an architectural laminar water ribbon with zero splashing.',
    features: ['Architectural open trough spout', 'Splash-free laminar flow regulator', 'Ultra-durable ceramic disc cartridges'],
    crossSellIds: ['vanity-floating', 'shower-digital', 'light-backlit']
  },
  {
    id: 'faucet-singlelever',
    productId: 'faucet-singlelever',
    name: 'Single-Lever Monobloc Basin Mixer',
    category: 'faucet',
    tier: 'Essential',
    price: 9500,
    width: 50,
    depth: 150,
    height: 180,
    dimensions: { widthMm: 50, depthMm: 150, heightMm: 180 },
    requiredClearance: { frontMm: 250, sideLeftMm: 120, sideRightMm: 120 },
    spaceFootprint: { minRoomAreaSqFt: 15, minWidthMm: 450, clearanceFrontMm: 250 },
    styleTags: ['single-handle', 'monobloc', 'aerated', 'eco-friendly', 'chrome'],
    finishOptions: ['Polished Chrome', 'Brushed Nickel'],
    themeFit: ['minimalist-modern'],
    finishName: 'Polished Chrome',
    finishCode: 'CP',
    finishColor: '#CBD2D9',
    waterConsumption: { flowRateLpm: 5.0, annualEstimatedLitres: 3650 },
    energyCharacteristics: { powerWatts: 0, annualKwhEstimate: 0 },
    smartFeatures: ['Eco-air aerator saves 30% water'],
    plumbingRequirements: {
      minDynamicBar: 1.0,
      drainDiameterMm: 32,
      supplyLineSizeInch: '1/2"',
      wastePosition: 'wall'
    },
    installationComplexity: 'Low',
    accessibilityCharacteristics: {
      adaCompliant: true,
      zeroThreshold: false,
      leverOperated: true,
      grabBarCompatible: false,
      comfortHeight: false,
      notes: 'Smooth single lever complies with ADA low-operating-force requirements.'
    },
    leadTimeWeeks: 1,
    imageUrl: getApprovedProductImage('faucet-singlelever') || IMAGE_MAP['faucet-singlelever'],
    searchQuery: 'chrome single lever basin mixer tap',
    whyThis: {
      'minimalist-modern': 'Ergonomic single-handle control with rapid temperature adjustment.',
      'classic-luxury': 'Reliable everyday workhorse for powder rooms and suites.',
      'japanese-zen': 'Compact footprint keeping vanity surface clutter-free.'
    },
    description: 'Clean cylindrical monobloc mixer provides precise single-handed temperature and flow control.',
    features: ['Solid brass cast construction', 'Ultra-glide ceramic disc valve', 'Aerated stream saving 30% water'],
    crossSellIds: ['toilet-floormounted', 'light-downlight', 'vanity-floating']
  },
  {
    id: 'faucet-wallmount',
    productId: 'faucet-wallmount',
    name: 'Concealed Wall-Mounted Basin Mixer',
    category: 'faucet',
    tier: 'Mid-luxury',
    price: 28000,
    width: 210,
    depth: 220,
    height: 110,
    dimensions: { widthMm: 210, depthMm: 220, heightMm: 110 },
    requiredClearance: { frontMm: 350, sideLeftMm: 150, sideRightMm: 150 },
    spaceFootprint: { minRoomAreaSqFt: 20, minWidthMm: 600, clearanceFrontMm: 400 },
    styleTags: ['wall-mount', 'concealed', 'matte-black', 'minimalist', 'zen'],
    finishOptions: ['Matte Black', 'Vibrant Titanium'],
    themeFit: ['japanese-zen', 'minimalist-modern'],
    finishName: 'Matte Black',
    finishCode: 'BL',
    finishColor: '#23272B',
    waterConsumption: { flowRateLpm: 5.5, annualEstimatedLitres: 4015 },
    energyCharacteristics: { powerWatts: 0, annualKwhEstimate: 0 },
    smartFeatures: ['In-wall concealed valve', 'Anti-fingerprint PVD coating'],
    plumbingRequirements: {
      minDynamicBar: 1.5,
      drainDiameterMm: 32,
      supplyLineSizeInch: '1/2"',
      wastePosition: 'wall'
    },
    installationComplexity: 'Moderate',
    accessibilityCharacteristics: {
      adaCompliant: true,
      zeroThreshold: false,
      leverOperated: true,
      grabBarCompatible: false,
      comfortHeight: false,
      notes: 'Wall-mount placement frees countertop deck space for seated wheelchair users.'
    },
    leadTimeWeeks: 2,
    imageUrl: getApprovedProductImage('faucet-wallmount') || IMAGE_MAP['faucet-wallmount'],
    searchQuery: 'matte black wall mounted bathroom faucet',
    whyThis: {
      'japanese-zen': 'Frees the countertop entirely, letting natural stone sinks stand unencumbered.',
      'minimalist-modern': 'Eliminates faucet base grime for spotless counter maintenance.',
      'classic-luxury': 'Bespoke architectural statement paired with stone backsplashes.'
    },
    description: 'In-wall concealed mixer keeps vanity surfaces pristine, unobstructed, and easy to clean.',
    features: ['Concealed in-wall rough-in valve', 'Extended spout for vessel sinks', 'Velvety scratch-resistant PVD coating'],
    crossSellIds: ['vanity-floating', 'shower-steam', 'extra-mirror']
  },
  {
    id: 'faucet-bridge',
    productId: 'faucet-bridge',
    name: 'Architectural Two-Hole Bridge Lavatory Faucet',
    category: 'faucet',
    tier: 'Premium',
    price: 42000,
    width: 280,
    depth: 240,
    height: 310,
    dimensions: { widthMm: 280, depthMm: 240, heightMm: 310 },
    requiredClearance: { frontMm: 350, sideLeftMm: 200, sideRightMm: 200 },
    spaceFootprint: { minRoomAreaSqFt: 30, minWidthMm: 700, clearanceFrontMm: 350 },
    styleTags: ['bridge', 'french-gold', 'heritage', 'cross-handles', 'heirloom'],
    finishOptions: ['Vibrant French Gold', 'Vibrant Brushed Bronze'],
    themeFit: ['classic-luxury'],
    finishName: 'Vibrant French Gold',
    finishCode: 'AF',
    finishColor: '#C49E5A',
    waterConsumption: { flowRateLpm: 6.0, annualEstimatedLitres: 4380 },
    energyCharacteristics: { powerWatts: 0, annualKwhEstimate: 0 },
    smartFeatures: ['360° swivel spout', 'Heirloom forged brass unibody'],
    plumbingRequirements: {
      minDynamicBar: 1.5,
      drainDiameterMm: 32,
      supplyLineSizeInch: '1/2"',
      wastePosition: 'wall'
    },
    installationComplexity: 'Moderate',
    accessibilityCharacteristics: {
      adaCompliant: false,
      zeroThreshold: false,
      leverOperated: false,
      grabBarCompatible: false,
      comfortHeight: false,
      notes: 'Sculpted cross handles provide distinct tactile hot and cold adjustment.'
    },
    leadTimeWeeks: 2,
    imageUrl: getApprovedProductImage('faucet-bridge') || IMAGE_MAP['faucet-bridge'],
    searchQuery: 'french gold bridge bathroom faucet luxury',
    whyThis: {
      'classic-luxury': 'Quintessential heritage bridge silhouette rendered in rich radiant French Gold.',
      'minimalist-modern': 'Provocative historic counterpoint in an otherwise sharp architectural room.',
      'japanese-zen': 'Sculptural metallic anchor reminiscent of classical metal craft.'
    },
    description: 'Heirloom bridge silhouette with 360-degree swivel gooseneck spout in radiant French Gold.',
    features: ['Heirloom two-hole bridge architecture', '360° swivel gooseneck spout', 'Hand-polished French Gold finish', 'Quarter-turn ceramic disc valves'],
    crossSellIds: ['vanity-freestanding', 'shower-thermostatic', 'floor-marble']
  },

  // ===================== LIGHTING (4) =====================
  {
    id: 'light-downlight',
    productId: 'light-downlight',
    name: 'IP65 Architectural Recessed Downlight',
    category: 'lighting',
    tier: 'Essential',
    price: 6000,
    width: 95,
    depth: 95,
    height: 85,
    dimensions: { widthMm: 95, depthMm: 95, heightMm: 85 },
    requiredClearance: { frontMm: 0, sideLeftMm: 200, sideRightMm: 200, overheadMm: 120 },
    spaceFootprint: { minRoomAreaSqFt: 10, minWidthMm: 500, clearanceFrontMm: 0 },
    styleTags: ['recessed', 'glare-free', 'ip65', 'minimalist', 'architectural'],
    finishOptions: ['Matte White Trim', 'Matte Black Trim'],
    themeFit: ['minimalist-modern'],
    finishName: 'Matte White Trim / Warm 3000K',
    finishCode: 'MW',
    finishColor: '#EBEAE5',
    waterConsumption: { flowRateLpm: 0, annualEstimatedLitres: 0 },
    energyCharacteristics: { powerWatts: 12, annualKwhEstimate: 17.5 },
    smartFeatures: ['IP65 waterproof wet location certified', 'CRI 97 museum color grade'],
    plumbingRequirements: {
      minDynamicBar: 0,
      drainDiameterMm: 0,
      supplyLineSizeInch: 'None',
      wastePosition: 'ceiling',
      electricalLoadWatts: 12
    },
    installationComplexity: 'Low',
    accessibilityCharacteristics: {
      adaCompliant: true,
      zeroThreshold: false,
      leverOperated: false,
      grabBarCompatible: false,
      comfortHeight: false,
      notes: 'Deep baffle honeycomb lens eliminates harsh direct glare for low-vision residents.'
    },
    leadTimeWeeks: 1,
    imageUrl: getApprovedProductImage('light-downlight') || IMAGE_MAP['light-downlight'],
    searchQuery: 'recessed ceiling spotlight warm bathroom lighting',
    whyThis: {
      'minimalist-modern': 'Discreet deep-baffle spot casts uniform, glare-free ambient ceiling wash.',
      'japanese-zen': 'Low-glare downlight preserves serene meditative shadow play.',
      'classic-luxury': 'Even ceiling illumination highlighting perimeter stone trim.'
    },
    description: 'Waterproof deep-baffle recessed spotlight delivers uniform, glare-free ambient ceiling wash.',
    features: ['IP65 wet-location shower rating', 'Deep anti-glare honeycomb lens', 'CRI 97 museum-grade color rendering'],
    crossSellIds: ['extra-ventilation', 'faucet-singlelever', 'toilet-wallhung']
  },
  {
    id: 'light-backlit',
    productId: 'light-backlit',
    name: 'Indirect Perimeter Backlit Mirror Luminaire',
    category: 'lighting',
    tier: 'Mid-luxury',
    price: 18000,
    width: 800,
    depth: 45,
    height: 900,
    dimensions: { widthMm: 800, depthMm: 45, heightMm: 900 },
    requiredClearance: { frontMm: 500, sideLeftMm: 100, sideRightMm: 100 },
    spaceFootprint: { minRoomAreaSqFt: 25, minWidthMm: 800, clearanceFrontMm: 500 },
    styleTags: ['halo-glow', 'task-lighting', 'defogger', 'touch-sensor', 'contemporary'],
    finishOptions: ['Neutral 4000K', 'Warm 3000K'],
    themeFit: ['minimalist-modern', 'japanese-zen'],
    finishName: 'Diffused Acrylic / 4000K Neutral',
    finishCode: 'DF',
    finishColor: '#F0F4F8',
    waterConsumption: { flowRateLpm: 0, annualEstimatedLitres: 0 },
    energyCharacteristics: { powerWatts: 36, annualKwhEstimate: 39.4 },
    smartFeatures: ['Dual channel forward task & halo lighting', 'Built-in demister heating pad'],
    plumbingRequirements: {
      minDynamicBar: 0,
      drainDiameterMm: 0,
      supplyLineSizeInch: 'None',
      wastePosition: 'wall',
      electricalLoadWatts: 36
    },
    installationComplexity: 'Low',
    accessibilityCharacteristics: {
      adaCompliant: true,
      zeroThreshold: false,
      leverOperated: false,
      grabBarCompatible: false,
      comfortHeight: false,
      notes: 'Frontal shadow-free facial lighting improves visibility for all grooming routines.'
    },
    leadTimeWeeks: 1,
    imageUrl: getApprovedProductImage('light-backlit') || IMAGE_MAP['light-backlit'],
    searchQuery: 'backlit led bathroom mirror warm glow',
    whyThis: {
      'minimalist-modern': 'Floating halo glow provides shadow-free facial illumination for effortless grooming.',
      'japanese-zen': 'Soft atmospheric luminescence reflecting off cedar or stone walls.',
      'classic-luxury': 'Modern high-tech functionality disguised within an ultra-thin frame.'
    },
    description: 'Perimeter optical silicone diffuser provides shadow-free facial grooming and a halo wall wash.',
    features: ['Dual-channel task and halo lighting', 'Capacitive touch dimming memory', 'Integrated heated defogger pad'],
    crossSellIds: ['vanity-floating', 'faucet-waterfall', 'extra-mirror']
  },
  {
    id: 'light-cove',
    productId: 'light-cove',
    name: 'High-CRI Architectural Concealed Cove System',
    category: 'lighting',
    tier: 'Mid-luxury',
    price: 15000,
    width: 2400,
    depth: 20,
    height: 15,
    dimensions: { widthMm: 2400, depthMm: 20, heightMm: 15 },
    requiredClearance: { frontMm: 0, sideLeftMm: 0, sideRightMm: 0 },
    spaceFootprint: { minRoomAreaSqFt: 30, minWidthMm: 1200, clearanceFrontMm: 0 },
    styleTags: ['indirect', 'cove', 'warm-amber', 'cob-led', 'meditation'],
    finishOptions: ['Warm Amber 2700K', 'Neutral 3500K'],
    themeFit: ['japanese-zen', 'classic-luxury'],
    finishName: 'Concealed LED Channel / 2700K Warm',
    finishCode: 'LED',
    finishColor: '#FFE5B4',
    waterConsumption: { flowRateLpm: 0, annualEstimatedLitres: 0 },
    energyCharacteristics: { powerWatts: 48, annualKwhEstimate: 52.5 },
    smartFeatures: ['Dot-free seamless continuous phosphor extrusion', '0-10V architectural dimming'],
    plumbingRequirements: {
      minDynamicBar: 0,
      drainDiameterMm: 0,
      supplyLineSizeInch: 'None',
      wastePosition: 'ceiling',
      electricalLoadWatts: 48
    },
    installationComplexity: 'Moderate',
    accessibilityCharacteristics: {
      adaCompliant: true,
      zeroThreshold: false,
      leverOperated: false,
      grabBarCompatible: false,
      comfortHeight: false,
      notes: 'Gentle indirect cove glow provides calm night navigation without glare.'
    },
    leadTimeWeeks: 1,
    imageUrl: getApprovedProductImage('light-cove') || IMAGE_MAP['light-cove'],
    searchQuery: 'cove lighting indirect ceiling warm led bathroom',
    whyThis: {
      'japanese-zen': 'Hidden indirect amber wash along drops creates a soothing meditative sanctuary.',
      'classic-luxury': 'Accentuates crown moldings and ceiling coves with soft buttery gold radiance.',
      'minimalist-modern': 'Dematerializes wall joints for an airy, floating pavilion feel.'
    },
    description: 'Seamless continuous LED channel creates calm, indirect sunset amber illumination for soaking rituals.',
    features: ['Dot-free continuous phosphor ribbon', 'Warm 2700K relaxing light temperature', 'Architectural 0-10V dimming compatibility'],
    crossSellIds: ['shower-steam', 'toilet-smart', 'floor-mattestone']
  },
  {
    id: 'light-vanitytask',
    productId: 'light-vanitytask',
    name: 'Dual Linear Sconce Vanity Task Light',
    category: 'lighting',
    tier: 'Essential',
    price: 7500,
    width: 120,
    depth: 140,
    height: 350,
    dimensions: { widthMm: 120, depthMm: 140, heightMm: 350 },
    requiredClearance: { frontMm: 300, sideLeftMm: 100, sideRightMm: 100 },
    spaceFootprint: { minRoomAreaSqFt: 20, minWidthMm: 600, clearanceFrontMm: 400 },
    styleTags: ['sconce', 'reeded-glass', 'brushed-bronze', 'warm-glow', 'heritage'],
    finishOptions: ['Vibrant Brushed Bronze', 'Vibrant French Gold'],
    themeFit: ['classic-luxury', 'minimalist-modern'],
    finishName: 'Vibrant Brushed Bronze',
    finishCode: 'BMB',
    finishColor: '#9C7A4A',
    waterConsumption: { flowRateLpm: 0, annualEstimatedLitres: 0 },
    energyCharacteristics: { powerWatts: 15, annualKwhEstimate: 16.4 },
    smartFeatures: ['Damp-rated bathroom escutcheon'],
    plumbingRequirements: {
      minDynamicBar: 0,
      drainDiameterMm: 0,
      supplyLineSizeInch: 'None',
      wastePosition: 'wall',
      electricalLoadWatts: 15
    },
    installationComplexity: 'Low',
    accessibilityCharacteristics: {
      adaCompliant: true,
      zeroThreshold: false,
      leverOperated: false,
      grabBarCompatible: false,
      comfortHeight: false,
      notes: 'Side-mounted eye-level fixtures eliminate unflattering overhead facial shadows.'
    },
    leadTimeWeeks: 1,
    imageUrl: getApprovedProductImage('light-vanitytask') || IMAGE_MAP['light-vanitytask'],
    searchQuery: 'modern brass wall sconce reeded glass bathroom',
    whyThis: {
      'classic-luxury': 'Vertical fluted glass sconces flanking the mirror bring regal warmth to face level.',
      'minimalist-modern': 'Linear metal bar with opal glass creates clean architectural symmetry.',
      'japanese-zen': 'Warm lantern-inspired eye-level glow comforting the senses.'
    },
    description: 'Vertical wall sconce with mouth-blown fluted glass delivers warm, flattering eye-level illumination.',
    features: ['Mouth-blown reeded glass shade', 'Flattering eye-level illumination', 'Damp-rated solid brass mounting escutcheon'],
    crossSellIds: ['vanity-freestanding', 'faucet-bridge', 'extra-mirror']
  },

  // ===================== FLOORING (4) =====================
  {
    id: 'floor-marble',
    productId: 'floor-marble',
    name: 'Calacatta Honed Large-Format Porcelain Tile',
    category: 'flooring',
    tier: 'Premium',
    price: 52000,
    width: 1200,
    depth: 1200,
    height: 12,
    dimensions: { widthMm: 1200, depthMm: 1200, heightMm: 12 },
    requiredClearance: { frontMm: 0, sideLeftMm: 0, sideRightMm: 0 },
    spaceFootprint: { minRoomAreaSqFt: 30, minWidthMm: 1000, clearanceFrontMm: 0 },
    styleTags: ['calacatta-gold', 'large-format', 'porcelain-slab', 'luxury', 'bookmatched'],
    finishOptions: ['Calacatta Gold Honed', 'Statuario White Polished'],
    themeFit: ['classic-luxury'],
    finishName: 'Calacatta Gold Honed Slab',
    finishCode: 'CAL',
    finishColor: '#EBE7DF',
    waterConsumption: { flowRateLpm: 0, annualEstimatedLitres: 0 },
    energyCharacteristics: { powerWatts: 0, annualKwhEstimate: 0 },
    smartFeatures: ['R10 slip-resistant honed finish', 'Zero porosity stain barrier'],
    plumbingRequirements: {
      minDynamicBar: 0,
      drainDiameterMm: 0,
      supplyLineSizeInch: 'None',
      wastePosition: 'floor'
    },
    installationComplexity: 'High',
    accessibilityCharacteristics: {
      adaCompliant: true,
      zeroThreshold: true,
      leverOperated: false,
      grabBarCompatible: false,
      comfortHeight: false,
      notes: 'Honed micro-textured face offers dependable R10 slip resistance when wet.'
    },
    leadTimeWeeks: 2,
    imageUrl: getApprovedProductImage('floor-marble') || IMAGE_MAP['floor-marble'],
    searchQuery: 'calacatta gold marble bathroom floor tile large slab',
    whyThis: {
      'classic-luxury': 'Signature bookmatched gold and taupe veining creates bespoke architectural prestige.',
      'minimalist-modern': 'Grand-format slabs eliminate grout lines for an expansive monolithic floor.',
      'japanese-zen': 'Honed silky touch under bare feet creates serene tactile connection.'
    },
    description: 'Grand-format porcelain slabs capture dramatic Italian Calacatta veining with zero water absorption.',
    features: ['Slip-resistant R10 honed architectural surface', 'Zero-porosity stain-proof porcelain slab', 'Rectified laser-cut edges for 1mm grout lines'],
    crossSellIds: ['vanity-freestanding', 'faucet-bridge', 'shower-thermostatic']
  },
  {
    id: 'floor-mattestone',
    productId: 'floor-mattestone',
    name: 'Basalt Flamed Vitrified Floor Surface',
    category: 'flooring',
    tier: 'Mid-luxury',
    price: 34000,
    width: 800,
    depth: 800,
    height: 10,
    dimensions: { widthMm: 800, depthMm: 800, heightMm: 10 },
    requiredClearance: { frontMm: 0, sideLeftMm: 0, sideRightMm: 0 },
    spaceFootprint: { minRoomAreaSqFt: 25, minWidthMm: 800, clearanceFrontMm: 0 },
    styleTags: ['basalt', 'volcanic', 'matte-charcoal', 'r11-wet-grip', 'zen'],
    finishOptions: ['Thermal Basalt Charcoal', 'Smoked Slate Grey'],
    themeFit: ['japanese-zen', 'minimalist-modern'],
    finishName: 'Thermal Basalt Charcoal',
    finishCode: 'BST',
    finishColor: '#474B4E',
    waterConsumption: { flowRateLpm: 0, annualEstimatedLitres: 0 },
    energyCharacteristics: { powerWatts: 0, annualKwhEstimate: 0 },
    smartFeatures: ['R11 maximum wet-area anti-slip grip', 'Radiant underfloor heating optimized'],
    plumbingRequirements: {
      minDynamicBar: 0,
      drainDiameterMm: 0,
      supplyLineSizeInch: 'None',
      wastePosition: 'floor'
    },
    installationComplexity: 'Moderate',
    accessibilityCharacteristics: {
      adaCompliant: true,
      zeroThreshold: true,
      leverOperated: false,
      grabBarCompatible: false,
      comfortHeight: false,
      notes: 'Maximum R11 wet traction provides superior safety for mobility-impaired residents.'
    },
    leadTimeWeeks: 1,
    imageUrl: getApprovedProductImage('floor-mattestone') || IMAGE_MAP['floor-mattestone'],
    searchQuery: 'dark grey basalt stone tile modern bathroom floor',
    whyThis: {
      'japanese-zen': 'Deep volcanic stone texture anchors the bathroom in grounded geological serenity.',
      'minimalist-modern': 'High-contrast matte charcoal backdrop highlights chrome and porcelain fixtures.',
      'classic-luxury': 'Subtle textured mineral depth without unwanted reflective glare.'
    },
    description: 'Volcanic basalt stone tile delivers high-traction wet grip and earthy architectural depth.',
    features: ['R11 wet-area maximum anti-slip grip', 'Dense full-body vitrified stone composition', 'Optimized for radiant underfloor heating'],
    crossSellIds: ['shower-steam', 'faucet-wallmount', 'toilet-wallhung']
  },
  {
    id: 'floor-woodtile',
    productId: 'floor-woodtile',
    name: 'Textured Smoked Oak Porcelain Plank',
    category: 'flooring',
    tier: 'Mid-luxury',
    price: 30000,
    width: 200,
    depth: 1200,
    height: 9,
    dimensions: { widthMm: 200, depthMm: 1200, heightMm: 9 },
    requiredClearance: { frontMm: 0, sideLeftMm: 0, sideRightMm: 0 },
    spaceFootprint: { minRoomAreaSqFt: 25, minWidthMm: 800, clearanceFrontMm: 0 },
    styleTags: ['wood-plank', 'hinoki', 'biophilic', 'warm-oak', 'waterproof'],
    finishOptions: ['Hinoki Natural Cypress', 'Smoked European Oak'],
    themeFit: ['japanese-zen', 'minimalist-modern'],
    finishName: 'Hinoki Cypress Natural Grain',
    finishCode: 'HNK',
    finishColor: '#C4A47C',
    waterConsumption: { flowRateLpm: 0, annualEstimatedLitres: 0 },
    energyCharacteristics: { powerWatts: 0, annualKwhEstimate: 0 },
    smartFeatures: ['3D synchronized embossed grain', 'Zero rot ceramic matrix'],
    plumbingRequirements: {
      minDynamicBar: 0,
      drainDiameterMm: 0,
      supplyLineSizeInch: 'None',
      wastePosition: 'floor'
    },
    installationComplexity: 'Moderate',
    accessibilityCharacteristics: {
      adaCompliant: true,
      zeroThreshold: true,
      leverOperated: false,
      grabBarCompatible: false,
      comfortHeight: false,
      notes: 'Delivers warm biophilic visual texture with complete waterproof ceramic integrity.'
    },
    leadTimeWeeks: 1,
    imageUrl: getApprovedProductImage('floor-woodtile') || IMAGE_MAP['floor-woodtile'],
    searchQuery: 'wood look porcelain floor tiles spa bathroom',
    whyThis: {
      'japanese-zen': 'Evokes the fragrant warmth of timber onsen baths with waterproof ceramic durability.',
      'minimalist-modern': 'Injects organic softness and biophilic balance into crisp neutral schemes.',
      'classic-luxury': 'Herringbone or straight plank layouts adding artisanal craft charm.'
    },
    description: 'Synchronized embossed porcelain planks bring natural timber warmth without rot or moisture warping.',
    features: ['Synchronized 3D tactile woodgrain embossing', '100% waterproof vitrified ceramic durability', 'Zero termite or humidity degradation'],
    crossSellIds: ['vanity-floating', 'shower-digital', 'light-cove']
  },
  {
    id: 'floor-terrazzo',
    productId: 'floor-terrazzo',
    name: 'Architectural Agglomerate Terrazzo Paver',
    category: 'flooring',
    tier: 'Essential',
    price: 19000,
    width: 600,
    depth: 600,
    height: 9,
    dimensions: { widthMm: 600, depthMm: 600, heightMm: 9 },
    requiredClearance: { frontMm: 0, sideLeftMm: 0, sideRightMm: 0 },
    spaceFootprint: { minRoomAreaSqFt: 20, minWidthMm: 600, clearanceFrontMm: 0 },
    styleTags: ['terrazzo', 'aggregate', 'mid-century', 'ash-stone', 'durable'],
    finishOptions: ['Porcelain Aggregate Ash', 'Carrara Aggregate Bianco'],
    themeFit: ['minimalist-modern'],
    finishName: 'Porcelain Aggregate Ash',
    finishCode: 'TRZ',
    finishColor: '#D8D4CC',
    waterConsumption: { flowRateLpm: 0, annualEstimatedLitres: 0 },
    energyCharacteristics: { powerWatts: 0, annualKwhEstimate: 0 },
    smartFeatures: ['Recycled stone aggregate matrix', 'Stain-resistant protective seal'],
    plumbingRequirements: {
      minDynamicBar: 0,
      drainDiameterMm: 0,
      supplyLineSizeInch: 'None',
      wastePosition: 'floor'
    },
    installationComplexity: 'Low',
    accessibilityCharacteristics: {
      adaCompliant: true,
      zeroThreshold: true,
      leverOperated: false,
      grabBarCompatible: false,
      comfortHeight: false,
      notes: 'Matte composite aggregate camouflages water spots and maintains steady barefoot traction.'
    },
    leadTimeWeeks: 1,
    imageUrl: getApprovedProductImage('floor-terrazzo') || IMAGE_MAP['floor-terrazzo'],
    searchQuery: 'modern terrazzo floor tiles bathroom interior',
    whyThis: {
      'minimalist-modern': 'Mid-century architectural aggregate adds subtle texture while concealing water drops.',
      'japanese-zen': 'Earthy pebble aggregate evokes serene Zen garden pathways.',
      'classic-luxury': 'Venetian heritage floor motif complementing brushed brass fixtures.'
    },
    description: 'Contemporary terrazzo composite pairs marble aggregate with an easy-clean matte vitrified finish.',
    features: ['Durable scratch and stain resistance', 'Low-maintenance matte protective surface', 'Eco-certified recycled stone aggregate'],
    crossSellIds: ['faucet-singlelever', 'toilet-floormounted', 'extra-mirror']
  },

  // ===================== VANITY (3) =====================
  {
    id: 'vanity-floating',
    productId: 'vanity-floating',
    name: 'Wall-Mounted Floating Vanity with Integrated Basin',
    category: 'vanity',
    tier: 'Mid-luxury',
    price: 38000,
    width: 1000,
    depth: 500,
    height: 480,
    dimensions: { widthMm: 1000, depthMm: 500, heightMm: 480 },
    requiredClearance: { frontMm: 800, sideLeftMm: 150, sideRightMm: 150 },
    spaceFootprint: { minRoomAreaSqFt: 30, minWidthMm: 1000, clearanceFrontMm: 750 },
    styleTags: ['floating', 'wall-mounted', 'quartz-top', 'smoked-oak', 'space-saving'],
    finishOptions: ['Smoked Oak / Engineered Quartz Top', 'Matte White / Carrara Top'],
    themeFit: ['minimalist-modern', 'japanese-zen'],
    finishName: 'Smoked Oak / Engineered Quartz Top',
    finishCode: 'SOK',
    finishColor: '#5C5449',
    waterConsumption: { flowRateLpm: 0, annualEstimatedLitres: 0 },
    energyCharacteristics: { powerWatts: 0, annualKwhEstimate: 0 },
    smartFeatures: ['Push-to-open Blum soft-close glides', 'Moisture-sealed marine plywood'],
    plumbingRequirements: {
      minDynamicBar: 1.0,
      drainDiameterMm: 40,
      supplyLineSizeInch: '1/2"',
      wastePosition: 'wall'
    },
    installationComplexity: 'Moderate',
    accessibilityCharacteristics: {
      adaCompliant: true,
      zeroThreshold: false,
      leverOperated: false,
      grabBarCompatible: false,
      comfortHeight: true,
      notes: 'Open floor clearance below accommodates seated wheelchair accessibility.'
    },
    leadTimeWeeks: 2,
    imageUrl: getApprovedProductImage('vanity-floating') || IMAGE_MAP['vanity-floating'],
    searchQuery: 'modern wall hung floating bathroom vanity wood quartz',
    whyThis: {
      'minimalist-modern': 'Wall-hung suspension keeps sightlines open and expands visual room volume.',
      'japanese-zen': 'Quiet horizontal linear rhythm with push-to-open soft-close drawers.',
      'classic-luxury': 'Sleek undermount basin with generous counter work surface.'
    },
    description: 'Wall-hung dual-drawer vanity with integrated quartz countertop frees floor sightlines.',
    features: ['Heavy-duty concealed wall brackets', 'Push-to-open soft-close drawers', 'Water-resistant marine substrate core'],
    crossSellIds: ['faucet-waterfall', 'extra-mirror', 'toilet-wallhung']
  },
  {
    id: 'vanity-freestanding',
    productId: 'vanity-freestanding',
    name: 'Floor-Standing Console Vanity Unit',
    category: 'vanity',
    tier: 'Premium',
    price: 56000,
    width: 1200,
    depth: 550,
    height: 850,
    dimensions: { widthMm: 1200, depthMm: 550, heightMm: 850 },
    requiredClearance: { frontMm: 900, sideLeftMm: 200, sideRightMm: 200 },
    spaceFootprint: { minRoomAreaSqFt: 45, minWidthMm: 1200, clearanceFrontMm: 850 },
    styleTags: ['freestanding', 'furniture-style', 'french-gold', 'carrara', 'charcoal'],
    finishOptions: ['Lacquer Charcoal / Gold Ferrules', 'French Cream / Bronze Ferrules'],
    themeFit: ['classic-luxury'],
    finishName: 'Lacquer Charcoal / French Gold Ferrules',
    finishCode: 'LCG',
    finishColor: '#2B3036',
    waterConsumption: { flowRateLpm: 0, annualEstimatedLitres: 0 },
    energyCharacteristics: { powerWatts: 0, annualKwhEstimate: 0 },
    smartFeatures: ['Dovetail drawer construction', 'Knurled solid brass hardware'],
    plumbingRequirements: {
      minDynamicBar: 1.0,
      drainDiameterMm: 40,
      supplyLineSizeInch: '1/2"',
      wastePosition: 'floor'
    },
    installationComplexity: 'Moderate',
    accessibilityCharacteristics: {
      adaCompliant: false,
      zeroThreshold: false,
      leverOperated: false,
      grabBarCompatible: false,
      comfortHeight: true,
      notes: 'Generous furniture-grade counter depth provides stable support and grooming space.'
    },
    leadTimeWeeks: 2,
    imageUrl: getApprovedProductImage('vanity-freestanding') || IMAGE_MAP['vanity-freestanding'],
    searchQuery: 'freestanding luxury bathroom vanity marble top gold hardware',
    whyThis: {
      'classic-luxury': 'Substantial furniture-grade statement piece featuring tapered legs with solid brass feet.',
      'minimalist-modern': 'Handsome contrast against pale marble walls.',
      'japanese-zen': 'Deep cabinetry provides generous concealed toiletry storage.'
    },
    description: 'Heirloom furniture-style vanity unit with solid marble counter and French Gold accents.',
    features: ['Solid marble top with backsplash', 'Multi-coat hand-finished lacquer cabinetry', 'Solid brass tapered legs and pulls'],
    crossSellIds: ['faucet-bridge', 'floor-marble', 'light-vanitytask']
  },
  {
    id: 'vanity-doublebasin',
    productId: 'vanity-doublebasin',
    name: 'Dual-Basin Master Suite Executive Vanity',
    category: 'vanity',
    tier: 'Premium',
    price: 72000,
    width: 1600,
    depth: 520,
    height: 500,
    dimensions: { widthMm: 1600, depthMm: 520, heightMm: 500 },
    requiredClearance: { frontMm: 950, sideLeftMm: 250, sideRightMm: 250 },
    spaceFootprint: { minRoomAreaSqFt: 60, minWidthMm: 1600, clearanceFrontMm: 900 },
    styleTags: ['double-basin', 'corian', 'his-and-hers', 'master-suite', 'expansive'],
    finishOptions: ['Matte White Corian / Titanium Trim'],
    themeFit: ['minimalist-modern', 'classic-luxury'],
    finishName: 'Matte White Corian / Titanium Trim',
    finishCode: 'COR',
    finishColor: '#EDECE7',
    waterConsumption: { flowRateLpm: 0, annualEstimatedLitres: 0 },
    energyCharacteristics: { powerWatts: 0, annualKwhEstimate: 0 },
    smartFeatures: ['Seamless molded twin solid-surface bowls', 'Quadruple dovetail soft-close organizers'],
    plumbingRequirements: {
      minDynamicBar: 1.5,
      drainDiameterMm: 40,
      supplyLineSizeInch: '1/2"',
      wastePosition: 'wall'
    },
    installationComplexity: 'High',
    accessibilityCharacteristics: {
      adaCompliant: true,
      zeroThreshold: false,
      leverOperated: false,
      grabBarCompatible: false,
      comfortHeight: true,
      notes: 'Twin wash zones resolve multi-user morning rush conflicts effortlessly.'
    },
    leadTimeWeeks: 3,
    imageUrl: getApprovedProductImage('vanity-doublebasin') || IMAGE_MAP['vanity-doublebasin'],
    searchQuery: 'modern double sink bathroom vanity floating white',
    whyThis: {
      'minimalist-modern': 'Expansive double-trough layout resolves morning rush with architectural poise.',
      'classic-luxury': 'His-and-hers executive master retreat standard.',
      'japanese-zen': 'Monolithic solid surface casting with zero visible seams.'
    },
    description: 'Expansive 1600mm dual-basin vanity crafted from seamless solid surface with quadruple storage.',
    features: ['Seamless dual molded basins', 'Quadruple soft-close organizers', 'Non-porous stain-resistant solid surface'],
    crossSellIds: ['shower-digital', 'toilet-smart', 'extra-mirror']
  },

  // ===================== MIRROR & EXTRAS (3 - multi-select) =====================
  {
    id: 'extra-mirror',
    productId: 'extra-mirror',
    name: 'Dimmable Anti-Fog Smart Vanity Mirror',
    category: 'mirror-extras',
    tier: 'Mid-luxury',
    price: 12000,
    width: 900,
    depth: 35,
    height: 900,
    dimensions: { widthMm: 900, depthMm: 35, heightMm: 900 },
    requiredClearance: { frontMm: 500, sideLeftMm: 100, sideRightMm: 100 },
    spaceFootprint: { minRoomAreaSqFt: 15, minWidthMm: 800, clearanceFrontMm: 500 },
    styleTags: ['backlit-mirror', 'halo', 'demister', 'copper-free', 'contemporary'],
    finishOptions: ['Frameless Polished Edge', 'Brushed Brass Rim'],
    themeFit: ['minimalist-modern', 'classic-luxury', 'japanese-zen'],
    finishName: 'Frameless Polished Edge / Brass Trim',
    finishCode: 'FM',
    finishColor: '#DCE2E6',
    waterConsumption: { flowRateLpm: 0, annualEstimatedLitres: 0 },
    energyCharacteristics: { powerWatts: 24, annualKwhEstimate: 26.2 },
    smartFeatures: ['Capacitive stepless touch dimmer', 'Defogger thermal membrane'],
    plumbingRequirements: {
      minDynamicBar: 0,
      drainDiameterMm: 0,
      supplyLineSizeInch: 'None',
      wastePosition: 'wall',
      electricalLoadWatts: 24
    },
    installationComplexity: 'Low',
    accessibilityCharacteristics: {
      adaCompliant: true,
      zeroThreshold: false,
      leverOperated: false,
      grabBarCompatible: false,
      comfortHeight: false,
      notes: 'Illuminated touch sensor switch is easily located and activated in low light.'
    },
    leadTimeWeeks: 1,
    imageUrl: getApprovedProductImage('extra-mirror') || IMAGE_MAP['extra-mirror'],
    searchQuery: 'round led backlit mirror bathroom modern',
    whyThis: {
      'minimalist-modern': 'Frameless optical mirror delivers front grooming clarity and warm halo ambient light.',
      'classic-luxury': 'Warm gold edge backlighting adds rich depth to marble walls.',
      'japanese-zen': 'Curved pill form softens rectilinear tile geometry.'
    },
    description: 'Copper-free silver mirror features circumferential LED halo, touch dimming, and heated defogger.',
    features: ['Rapid anti-fog heated membrane', 'Touch switch with stepless dimming', 'Copper-free anti-corrosion silver coating'],
    crossSellIds: ['vanity-floating', 'faucet-waterfall', 'light-backlit']
  },
  {
    id: 'extra-glass',
    productId: 'extra-glass',
    name: '10mm Toughened Frameless Glass Wet-Room Partition',
    category: 'mirror-extras',
    tier: 'Mid-luxury',
    price: 32000,
    width: 1000,
    depth: 10,
    height: 2100,
    dimensions: { widthMm: 1000, depthMm: 10, heightMm: 2100 },
    requiredClearance: { frontMm: 700, sideLeftMm: 100, sideRightMm: 100 },
    spaceFootprint: { minRoomAreaSqFt: 30, minWidthMm: 1000, clearanceFrontMm: 700 },
    styleTags: ['frameless-glass', 'starphire', 'cleancoat', 'walk-in', 'open-plan'],
    finishOptions: ['Low-Iron Clear / Chrome Clamps', 'Low-Iron Clear / Gold Clamps', 'Smoked Glass / Black Clamps'],
    themeFit: ['minimalist-modern', 'classic-luxury', 'japanese-zen'],
    finishName: 'Ultra-Clear Low-Iron 10mm Glass / Chrome Brackets',
    finishCode: 'GLS',
    finishColor: '#E6EFF4',
    waterConsumption: { flowRateLpm: 0, annualEstimatedLitres: 0 },
    energyCharacteristics: { powerWatts: 0, annualKwhEstimate: 0 },
    smartFeatures: ['CleanCoat hydrophobic nanotech coating'],
    plumbingRequirements: {
      minDynamicBar: 0,
      drainDiameterMm: 0,
      supplyLineSizeInch: 'None',
      wastePosition: 'floor'
    },
    installationComplexity: 'Moderate',
    accessibilityCharacteristics: {
      adaCompliant: true,
      zeroThreshold: true,
      leverOperated: false,
      grabBarCompatible: false,
      comfortHeight: false,
      notes: 'Enables zero-threshold walk-in entry with no tripping tracks.'
    },
    leadTimeWeeks: 1,
    imageUrl: getApprovedProductImage('extra-glass') || IMAGE_MAP['extra-glass'],
    searchQuery: 'frameless glass walk in shower screen partition',
    whyThis: {
      'minimalist-modern': 'Virtually invisible divider contains water spray while preserving unbroken sightlines.',
      'japanese-zen': 'Preserves open light flow between wet and dry zones.',
      'classic-luxury': 'Paired with gold channel clamps for quiet, understated elegance.'
    },
    description: 'Ultra-clear low-iron safety glass partition with hydrophobic CleanCoat repels water stains.',
    features: ['Starphire low-iron ultra-clear glass', 'Hydrophobic CleanCoat stain barrier', 'Minimalist solid brass wall clamps'],
    crossSellIds: ['shower-digital', 'shower-rainpanel', 'shower-thermostatic']
  },
  {
    id: 'extra-ventilation',
    productId: 'extra-ventilation',
    name: 'Ultra-Quiet In-Ceiling Continuous Extraction Fan',
    category: 'mirror-extras',
    tier: 'Essential',
    price: 5500,
    width: 250,
    depth: 250,
    height: 180,
    dimensions: { widthMm: 250, depthMm: 250, heightMm: 180 },
    requiredClearance: { frontMm: 0, sideLeftMm: 150, sideRightMm: 150, overheadMm: 200 },
    spaceFootprint: { minRoomAreaSqFt: 15, minWidthMm: 400, clearanceFrontMm: 0 },
    styleTags: ['quiet-exhaust', 'humidity-sensor', 'flush-grille', 'mold-prevention'],
    finishOptions: ['Matte White Paintable Grille', 'Matte Black Grille'],
    themeFit: ['minimalist-modern', 'classic-luxury', 'japanese-zen'],
    finishName: 'Matte White Architectural Flush Grille',
    finishCode: 'VNT',
    finishColor: '#FFFFFF',
    waterConsumption: { flowRateLpm: 0, annualEstimatedLitres: 0 },
    energyCharacteristics: { powerWatts: 18, annualKwhEstimate: 19.7 },
    smartFeatures: ['Auto humidity sensor auto-triggers on steam', 'Ultra-quiet 0.8 sones'],
    plumbingRequirements: {
      minDynamicBar: 0,
      drainDiameterMm: 100,
      supplyLineSizeInch: 'None',
      wastePosition: 'ceiling',
      electricalLoadWatts: 18
    },
    installationComplexity: 'Moderate',
    accessibilityCharacteristics: {
      adaCompliant: true,
      zeroThreshold: false,
      leverOperated: false,
      grabBarCompatible: false,
      comfortHeight: false,
      notes: 'Auto humidity sensor activates automatically without requiring manual switch operation.'
    },
    leadTimeWeeks: 1,
    imageUrl: getApprovedProductImage('extra-ventilation') || IMAGE_MAP['extra-ventilation'],
    searchQuery: 'flush ceiling bathroom exhaust fan grille white',
    whyThis: {
      'minimalist-modern': 'Flush ceiling unit operates at a whisper-quiet 0.8 sones.',
      'japanese-zen': 'Maintains fresh, mold-free air without visual disruption.',
      'classic-luxury': 'Shields delicate finishes and wallpapers from humidity damage.'
    },
    description: 'Whisper-quiet exhaust fan with automatic humidity sensor and flush paintable ceiling grille.',
    features: ['Whisper-quiet 0.8 Sone acoustic motor', 'Auto-sensing steam humidity sensor', 'Paintable flush magnetic drywall grille'],
    crossSellIds: ['shower-steam', 'light-downlight', 'toilet-wallhung']
  }
];

// Assign verified static assets and data-driven 3D visual attributes
PRODUCTS.forEach(p => {
  const verified = IMAGE_MAP[p.id] || getApprovedProductImage(p.id);
  if (verified) {
    p.imageUrl = verified;
  }
  p.visual3D = PRODUCT_VISUALS_3D[p.id] || {
    colorHex: '#D8D4CE',
    metalFinish: 'matte-black',
    geometryVariant: 'standard',
    roughness: 0.5,
    metalness: 0.5
  };
});

export const PRODUCT_MAP: Record<string, ProductItem> = PRODUCTS.reduce((acc, p) => {
  acc[p.id] = p;
  return acc;
}, {} as Record<string, ProductItem>);
