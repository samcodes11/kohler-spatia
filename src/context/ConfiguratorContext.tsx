import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { ProductCategory, ProductItem, PriceTier, PRODUCTS, PRODUCT_MAP } from '../data/products';
import { THEMES, ThemeId } from '../data/themes';
import { ThemeBlend } from '../data/themeBlends';
import {
  BathroomDesignState,
  calculateDesignAssessment,
  DesignAssessment,
  AccessibilityRequirements,
  RenovationScope
} from '../services/designEngine';
import {
  auditConstraints,
  ConstraintAuditResult,
  LayoutResolution,
  applyResolution
} from '../services/constraintEngine';
import {
  generateLayoutAlternatives,
  LayoutAlternative,
  PlacedFixture3D
} from '../services/layoutEngine';
import {
  calculateSustainability,
  SustainabilityDashboardData
} from '../services/sustainabilityEngine';
import {
  generateAIReasoning,
  ExplainableAIReport
} from '../services/aiReasoningService';

export type UnitType = 'ft' | 'cm' | 'm';
export type RoomShapeType = 'rectangular' | 'l-shaped' | 'alcove' | 'angled';
export type BathroomType = 'Master' | 'Guest' | 'Powder Room';
export type PlumbingLayout = 'renovating' | 'new-construction';
export type { ThemeId };
export type BundleTier = 'Essentials' | 'Balanced' | 'Signature';
export type TimeOfDay = 'dawn' | 'midday' | 'sunset' | 'night';
export type UserPriorityFocus = 'calm' | 'ease' | 'impact' | null;

export interface PlacedItem {
  id: string;
  category: ProductCategory;
  x: number; // 2D/3D normalized position (-1 to 1)
  z: number;
  rotation: number;
  isRemoved: boolean;
}

interface ConfiguratorContextType {
  // Navigation / Step
  activeStep: 1 | 2 | 3;
  setActiveStep: (step: 1 | 2 | 3) => void;

  // Step 1: Space & Constraints
  unit: UnitType;
  setUnit: (unit: UnitType) => void;
  width: number;
  setWidth: (val: number) => void;
  length: number;
  setLength: (val: number) => void;
  height: number;
  setHeight: (val: number) => void;
  roomShape: RoomShapeType;
  setRoomShape: (shape: RoomShapeType) => void;
  bathroomType: BathroomType;
  setBathroomType: (type: BathroomType) => void;
  plumbingLayout: PlumbingLayout;
  setPlumbingLayout: (layout: PlumbingLayout) => void;
  budget: number;
  setBudget: (budget: number) => void;
  selectedTheme: ThemeId;
  setSelectedTheme: (themeId: ThemeId) => void;
  selectedBlend: ThemeBlend | null;
  setSelectedBlend: (blend: ThemeBlend | null) => void;
  applyThemeBlend: (blend: ThemeBlend) => void;
  applyCuratedCollection: (
    themeId: ThemeId,
    fixtures: {
      shower: string;
      toilet: string;
      faucet: string;
      lighting: string;
      flooring: string;
      vanity: string;
      'mirror-extras': string[];
    },
    wallFinishId?: string
  ) => void;
  priorityFocus: UserPriorityFocus;
  setPriorityFocus: (focus: UserPriorityFocus) => void;

  // Step 2: Wall Surface Finish
  wallFinish: string;
  setWallFinish: (finishId: string) => void;

  // Accessibility & Renovation Scope
  accessibilityRequirements: AccessibilityRequirements;
  setAccessibilityRequirements: React.Dispatch<React.SetStateAction<AccessibilityRequirements>>;
  toggleAccessibilityReq: (key: keyof AccessibilityRequirements) => void;
  renovationScope: RenovationScope;
  setRenovationScope: React.Dispatch<React.SetStateAction<RenovationScope>>;
  toggleRenovationScope: (key: keyof RenovationScope) => void;

  // Step 2: Fixture Selections
  selections: {
    shower: string;
    toilet: string;
    faucet: string;
    lighting: string;
    flooring: string;
    vanity: string;
    'mirror-extras': string[];
  };
  setSingleSelection: (cat: 'shower' | 'toilet' | 'faucet' | 'lighting' | 'flooring' | 'vanity', id: string) => void;
  toggleExtraSelection: (id: string) => void;

  // Step 2 AI Intelligence
  aiRecommendedBundle: Record<ProductCategory, string | string[]>;
  spaceClashWarnings: string[];
  fitScore: number;
  styleDriftWarnings: { category: string; productName: string; message: string }[];
  renovationTimeline: { days: string; phases: { name: string; days: string }[] };
  applyAiPicks: () => void;
  applyCheaperTier: () => void;

  // Layout Alternatives (Auto-Layout - Linear, L-Shaped, Parallel)
  selectedLayout: 'linear' | 'l-shaped' | 'parallel';
  setSelectedLayout: (layout: 'linear' | 'l-shaped' | 'parallel') => void;
  activeLayoutAlternative: 'space-optimized' | 'luxury-optimized' | 'accessibility-oriented';
  setActiveLayoutAlternative: (id: 'space-optimized' | 'luxury-optimized' | 'accessibility-oriented') => void;
  layoutAlternatives: LayoutAlternative[];
  applyLayoutAlternative: (id: 'space-optimized' | 'luxury-optimized' | 'accessibility-oriented') => void;

  // Constraint Conflict Resolver
  constraintAudit: ConstraintAuditResult;
  applyConstraintResolution: (resolution: LayoutResolution) => void;

  // Design Assessment & Scoring
  designAssessment: DesignAssessment;

  // Sustainability Data
  sustainabilityData: SustainabilityDashboardData;

  // Explainable AI Reasoning
  aiReasoning: ExplainableAIReport;

  // Budget calculations
  manualTotalCost: number;
  aiBundleTotalCost: number;
  savingsVsAi: number;

  // Step 3: Result View
  activeBundleTab: BundleTier;
  setActiveBundleTab: (tab: BundleTier) => void;
  timeOfDay: TimeOfDay;
  setTimeOfDay: (tod: TimeOfDay) => void;
  placedItems: PlacedItem[];
  removePlacedItem: (id: string) => void;
  restorePlacedItem: (id: string) => void;
  replacePlacedItem: (category: ProductCategory, newProductId: string) => void;
  updateItemCoords: (id: string, x: number, z: number) => void;
  photorealRenderUrl: string | null;
  setPhotorealRenderUrl: (url: string | null) => void;
  isGeneratingRender: boolean;
  generatePhotorealHeroRender: () => void;
}

const ConfiguratorContext = createContext<ConfiguratorContextType | undefined>(undefined);

export const ConfiguratorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation
  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1);

  // Step 1 parameters
  const [unit, setUnit] = useState<UnitType>('ft');
  const [width, setWidth] = useState<number>(10);
  const [length, setLength] = useState<number>(12);
  const [height, setHeight] = useState<number>(9); // Default ~2.74m
  const [roomShape, setRoomShape] = useState<RoomShapeType>('rectangular');
  const [bathroomType, setBathroomType] = useState<BathroomType>('Master');
  const [plumbingLayout, setPlumbingLayout] = useState<PlumbingLayout>('renovating');
  const [budget, setBudget] = useState<number>(450000);
  const [selectedTheme, setSelectedTheme] = useState<ThemeId>('luxury-escape');
  const [priorityFocus, setPriorityFocus] = useState<UserPriorityFocus>(null);
  const [wallFinish, setWallFinish] = useState<string>('warm-putty');
  const [selectedBlend, setSelectedBlend] = useState<ThemeBlend | null>(null);

  const applyThemeBlend = (blend: ThemeBlend) => {
    setSelectedBlend(blend);
    if (blend.designDirection?.primaryTheme) {
      setSelectedTheme(blend.designDirection.primaryTheme);
    }
    if (blend.designDirection?.wallFinish) {
      setWallFinish(blend.designDirection.wallFinish);
    }
    if (blend.designDirection?.recommendedFixtures) {
      const rec = blend.designDirection.recommendedFixtures;
      setSelections(prev => ({
        ...prev,
        shower: rec.shower || prev.shower,
        toilet: rec.toilet || prev.toilet,
        vanity: rec.vanity || prev.vanity,
        faucet: rec.faucet || prev.faucet,
        lighting: rec.lighting || prev.lighting,
        flooring: rec.flooring || prev.flooring
      }));
    }
  };

  const applyCuratedCollection = (
    themeId: ThemeId,
    fixtures: {
      shower: string;
      toilet: string;
      faucet: string;
      lighting: string;
      flooring: string;
      vanity: string;
      'mirror-extras': string[];
    },
    wallFinishId?: string
  ) => {
    setSelectedTheme(themeId);
    setSelectedBlend(null);
    if (wallFinishId) {
      setWallFinish(wallFinishId);
    }
    setSelections({
      shower: fixtures.shower,
      toilet: fixtures.toilet,
      faucet: fixtures.faucet,
      lighting: fixtures.lighting,
      flooring: fixtures.flooring,
      vanity: fixtures.vanity,
      'mirror-extras': fixtures['mirror-extras'] && fixtures['mirror-extras'].length > 0 ? fixtures['mirror-extras'] : ['extra-mirror']
    });
  };

  // Accessibility Requirements (Section 51)
  const [accessibilityRequirements, setAccessibilityRequirements] = useState<AccessibilityRequirements>({
    elderly: false,
    wheelchair: false,
    limitedMobility: false,
    childFriendly: false,
    multiGen: false,
    highContrast: false,
    easyClean: false,
    slipResistant: false,
    grabBarReady: false
  });

  const toggleAccessibilityReq = (key: keyof AccessibilityRequirements) => {
    setAccessibilityRequirements(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Layout Alternative (Linear, L-Shaped, Parallel - Section 20 & 21)
  const [selectedLayout, setSelectedLayoutState] = useState<'linear' | 'l-shaped' | 'parallel'>('linear');

  // Renovation Scope
  const [renovationScope, setRenovationScope] = useState<RenovationScope>({
    plumbingCanMove: false,
    wallsCanMove: false,
    electricalCanMove: true,
    fixturesOnly: false
  });

  const toggleRenovationScope = (key: keyof RenovationScope) => {
    setRenovationScope(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Dynamic Theme Shell Accent synchronization
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', selectedTheme);
    const theme = THEMES[selectedTheme];
    if (theme) {
      document.documentElement.style.setProperty('--color-accent', theme.accentColor);
      document.documentElement.style.setProperty('--color-accent-hover', theme.accentHover);
      document.documentElement.style.setProperty('--color-accent-soft', theme.accentSoft);
    }
  }, [selectedTheme]);

  // Step 2 selections
  const [selections, setSelections] = useState({
    shower: 'shower-thermostatic',
    toilet: 'toilet-smart',
    faucet: 'faucet-bridge',
    lighting: 'light-cove',
    flooring: 'floor-marble',
    vanity: 'vanity-freestanding',
    'mirror-extras': ['extra-mirror', 'extra-glass']
  });

  const setSingleSelection = (
    cat: 'shower' | 'toilet' | 'faucet' | 'lighting' | 'flooring' | 'vanity', 
    id: string
  ) => {
    setSelections(prev => ({ ...prev, [cat]: id }));
  };

  const toggleExtraSelection = (id: string) => {
    setSelections(prev => {
      if (id === 'none') {
        return { ...prev, 'mirror-extras': [] };
      }
      const current = prev['mirror-extras'];
      const updated = current.includes(id)
        ? current.filter(x => x !== id)
        : [...current, id];
      return { ...prev, 'mirror-extras': updated };
    });
  };

  // Active Layout Alternative State
  const [activeLayoutAlternative, setActiveLayoutAlternative] = useState<
    'space-optimized' | 'luxury-optimized' | 'accessibility-oriented'
  >('luxury-optimized');

  // Assembled Central Bathroom Design State
  const currentDesignState: BathroomDesignState = useMemo(() => {
    return {
      roomDimensions: { width, length, height, unit },
      roomShape,
      doorPosition: { wall: 'front', offset: 400, width: 850, swing: 'inward' },
      plumbingStatus: plumbingLayout,
      plumbingLocations: { showerDrain: [400, 400], toiletWaste: [1800, 800], vanitySupply: [1200, 400] },
      bathroomType,
      budget,
      theme: selectedTheme,
      selectedBlend: selectedBlend || undefined,
      userPriorities: {
        waterConservation: priorityFocus === 'calm' ? 5 : priorityFocus === 'impact' ? 3 : 4,
        luxuryExperience: priorityFocus === 'impact' ? 5 : priorityFocus === 'ease' ? 3 : 4,
        plumbingPreservation: priorityFocus === 'ease' ? 5 : plumbingLayout === 'renovating' ? 5 : 2,
        accessibility: priorityFocus === 'calm' ? 4 : Object.values(accessibilityRequirements).some(Boolean) ? 5 : 3
      },
      accessibilityRequirements,
      renovationScope
    };
  }, [width, length, height, unit, roomShape, plumbingLayout, bathroomType, budget, selectedTheme, selectedBlend, accessibilityRequirements, renovationScope, priorityFocus]);

  // Selected Products List
  const selectedProductList: ProductItem[] = useMemo(() => {
    return [
      PRODUCT_MAP[selections.shower],
      PRODUCT_MAP[selections.toilet],
      PRODUCT_MAP[selections.faucet],
      PRODUCT_MAP[selections.lighting],
      PRODUCT_MAP[selections.flooring],
      PRODUCT_MAP[selections.vanity],
      ...selections['mirror-extras'].map(id => PRODUCT_MAP[id])
    ].filter(Boolean);
  }, [selections]);

  // 1. Layout Engine: Generate 3 Alternatives
  const layoutAlternatives = useMemo(() => {
    return generateLayoutAlternatives(currentDesignState);
  }, [currentDesignState]);

  // 2. Constraint Engine: Clash Detection Audit
  const constraintAudit = useMemo(() => {
    return auditConstraints(currentDesignState, selections);
  }, [currentDesignState, selections]);

  // Apply a constraint resolution
  const applyConstraintResolution = (resolution: LayoutResolution) => {
    const updated = applyResolution(resolution, selections);
    setSelections(updated as any);
  };

  // Apply Layout Alternative
  const applyLayoutAlternative = (layoutId: 'space-optimized' | 'luxury-optimized' | 'accessibility-oriented') => {
    setActiveLayoutAlternative(layoutId);
    const chosen = layoutAlternatives.find(l => l.id === layoutId);
    if (chosen) {
      setActiveLayoutAlternative(layoutId);
      if (layoutId === 'space-optimized') setSelectedLayoutState('linear');
      else if (layoutId === 'luxury-optimized') setSelectedLayoutState('l-shaped');
      else if (layoutId === 'accessibility-oriented') setSelectedLayoutState('parallel');

      setSelections(prev => ({
        ...prev,
        shower: chosen.recommendedFixtures.shower,
        toilet: chosen.recommendedFixtures.toilet,
        vanity: chosen.recommendedFixtures.vanity,
        faucet: chosen.recommendedFixtures.faucet,
        lighting: chosen.recommendedFixtures.lighting,
        flooring: chosen.recommendedFixtures.flooring,
        'mirror-extras': chosen.recommendedFixtures['mirror-extras']
      }));
    }
  };

  const setSelectedLayout = (layout: 'linear' | 'l-shaped' | 'parallel') => {
    setSelectedLayoutState(layout);
    if (layout === 'linear') setActiveLayoutAlternative('space-optimized');
    else if (layout === 'l-shaped') setActiveLayoutAlternative('luxury-optimized');
    else if (layout === 'parallel') setActiveLayoutAlternative('accessibility-oriented');
  };

  // 3. Central Design Intelligence Assessment
  const designAssessment = useMemo(() => {
    return calculateDesignAssessment(currentDesignState, selectedProductList);
  }, [currentDesignState, selectedProductList]);

  // 4. Sustainability Engine
  const sustainabilityData = useMemo(() => {
    return calculateSustainability(selectedProductList, bathroomType);
  }, [selectedProductList, bathroomType]);

  // 5. Explainable AI Reasoning Report
  const aiReasoning = useMemo(() => {
    return generateAIReasoning(currentDesignState, selections);
  }, [currentDesignState, selections]);

  // AI Recommended Bundle based on current theme and budget
  const aiRecommendedBundle = useMemo(() => {
    const showerId = budget < 300000 
      ? (selectedTheme === 'minimalist-modern' ? 'shower-rainpanel' : 'shower-thermostatic')
      : (selectedTheme === 'japanese-zen' ? 'shower-steam' : 'shower-digital');

    const toiletId = budget < 250000 ? 'toilet-wallhung' : 'toilet-smart';
    const faucetId = selectedTheme === 'classic-luxury' ? 'faucet-bridge' : (selectedTheme === 'japanese-zen' ? 'faucet-wallmount' : 'faucet-waterfall');
    const lightingId = selectedTheme === 'classic-luxury' ? 'light-cove' : (selectedTheme === 'minimalist-modern' ? 'light-backlit' : 'light-cove');
    const flooringId = selectedTheme === 'classic-luxury' ? 'floor-marble' : (selectedTheme === 'japanese-zen' ? 'floor-mattestone' : 'floor-woodtile');
    const vanityId = (width * length < 70) ? 'vanity-floating' : (selectedTheme === 'classic-luxury' ? 'vanity-freestanding' : 'vanity-doublebasin');

    return {
      shower: showerId,
      toilet: toiletId,
      faucet: faucetId,
      lighting: lightingId,
      flooring: flooringId,
      vanity: vanityId,
      'mirror-extras': ['extra-mirror', 'extra-glass', 'extra-ventilation']
    };
  }, [selectedTheme, budget, width, length]);

  // Backward-compatible space clash warnings
  const spaceClashWarnings = useMemo(() => {
    return constraintAudit.conflicts.map(c => `${c.title}: ${c.message}`);
  }, [constraintAudit]);

  // Backward-compatible style drift warnings
  const styleDriftWarnings = useMemo(() => {
    return designAssessment.styleWarnings.map(msg => ({
      category: 'STYLE',
      productName: 'Fixture',
      message: msg
    }));
  }, [designAssessment]);

  // Backward-compatible fit score
  const fitScore = designAssessment.scores.overallScore;

  // Renovation Timeline
  const renovationTimeline = useMemo(() => {
    return {
      days: designAssessment.renovationDaysEstimate,
      phases: [
        { name: 'Demolition & Rough-In', days: plumbingLayout === 'renovating' ? '3–4 days' : '1–2 days' },
        { name: 'Waterproofing & Inspection', days: '2 days' },
        { name: 'Electrical & Conduits', days: '2 days' },
        { name: 'Tiling & Grouting', days: '4–5 days' },
        { name: 'Fixture Mount & Commissioning', days: '2–3 days' }
      ]
    };
  }, [designAssessment, plumbingLayout]);

  // Totals
  const manualTotalCost = useMemo(() => {
    return selectedProductList.reduce((sum, p) => sum + p.price, 0);
  }, [selectedProductList]);

  const aiBundleTotalCost = useMemo(() => {
    let sum = 0;
    sum += PRODUCT_MAP[aiRecommendedBundle.shower as string]?.price || 0;
    sum += PRODUCT_MAP[aiRecommendedBundle.toilet as string]?.price || 0;
    sum += PRODUCT_MAP[aiRecommendedBundle.faucet as string]?.price || 0;
    sum += PRODUCT_MAP[aiRecommendedBundle.lighting as string]?.price || 0;
    sum += PRODUCT_MAP[aiRecommendedBundle.flooring as string]?.price || 0;
    sum += PRODUCT_MAP[aiRecommendedBundle.vanity as string]?.price || 0;
    (aiRecommendedBundle['mirror-extras'] as string[]).forEach(id => {
      sum += PRODUCT_MAP[id]?.price || 0;
    });
    return sum;
  }, [aiRecommendedBundle]);

  const savingsVsAi = manualTotalCost - aiBundleTotalCost;

  // Swap to AI picks
  const applyAiPicks = () => {
    setSelections({
      shower: aiRecommendedBundle.shower as string,
      toilet: aiRecommendedBundle.toilet as string,
      faucet: aiRecommendedBundle.faucet as string,
      lighting: aiRecommendedBundle.lighting as string,
      flooring: aiRecommendedBundle.flooring as string,
      vanity: aiRecommendedBundle.vanity as string,
      'mirror-extras': [...(aiRecommendedBundle['mirror-extras'] as string[])]
    });
  };

  // "Show Me Cheaper" toggle
  const applyCheaperTier = () => {
    setSelections(prev => {
      const findCheaper = (cat: ProductCategory, currentId: string) => {
        const catProds = PRODUCTS.filter(p => p.category === cat && p.themeFit.includes(selectedTheme));
        const sorted = [...catProds].sort((a, b) => a.price - b.price);
        return sorted[0]?.id || currentId;
      };

      return {
        shower: findCheaper('shower', prev.shower),
        toilet: findCheaper('toilet', prev.toilet),
        faucet: findCheaper('faucet', prev.faucet),
        lighting: findCheaper('lighting', prev.lighting),
        flooring: findCheaper('flooring', prev.flooring),
        vanity: findCheaper('vanity', prev.vanity),
        'mirror-extras': ['extra-mirror']
      };
    });
  };

  // Step 3 Result state
  const [activeBundleTab, setActiveBundleTabState] = useState<BundleTier>('Balanced');
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('midday');
  const [photorealRenderUrl, setPhotorealRenderUrl] = useState<string | null>(null);
  const [isGeneratingRender, setIsGeneratingRender] = useState(false);

  const setActiveBundleTab = (tier: BundleTier) => {
    setActiveBundleTabState(tier);
    
    // Target price tier: Essentials => 'Essential', Balanced => 'Mid-luxury', Signature => 'Premium'
    const targetTier: PriceTier = tier === 'Essentials' ? 'Essential' : tier === 'Signature' ? 'Premium' : 'Mid-luxury';
    
    setSelections(prev => {
      const pickTierProduct = (cat: ProductCategory, currentId: string) => {
        const catProds = PRODUCTS.filter(p => p.category === cat);
        const themeMatch = catProds.filter(p => p.themeFit.includes(selectedTheme));
        const pool = themeMatch.length > 0 ? themeMatch : catProds;
        
        // Exact tier match first
        const exactTier = pool.filter(p => p.tier === targetTier);
        if (exactTier.length > 0) return exactTier[0].id;

        // Fallback sorted by price
        const sorted = [...pool].sort((a, b) => a.price - b.price);
        if (tier === 'Essentials') return sorted[0]?.id || currentId;
        if (tier === 'Signature') return sorted[sorted.length - 1]?.id || currentId;
        // Balanced (median)
        const midIdx = Math.floor(sorted.length / 2);
        return sorted[midIdx]?.id || currentId;
      };

      return {
        shower: pickTierProduct('shower', prev.shower),
        toilet: pickTierProduct('toilet', prev.toilet),
        faucet: pickTierProduct('faucet', prev.faucet),
        lighting: pickTierProduct('lighting', prev.lighting),
        flooring: pickTierProduct('flooring', prev.flooring),
        vanity: pickTierProduct('vanity', prev.vanity),
        'mirror-extras': tier === 'Signature' ? ['extra-glass', 'extra-mirror'] : ['extra-mirror']
      };
    });
  };

  // Placed items in 3D scene
  const [placedItems, setPlacedItems] = useState<PlacedItem[]>([
    { id: 'shower', category: 'shower', x: -0.6, z: -0.6, rotation: 0, isRemoved: false },
    { id: 'vanity', category: 'vanity', x: 0.5, z: -0.65, rotation: Math.PI, isRemoved: false },
    { id: 'faucet', category: 'faucet', x: 0.5, z: -0.6, rotation: Math.PI, isRemoved: false },
    { id: 'mirror', category: 'mirror-extras', x: 0.5, z: -0.7, rotation: Math.PI, isRemoved: false },
    { id: 'toilet', category: 'toilet', x: 0.6, z: 0.5, rotation: -Math.PI / 2, isRemoved: false }
  ]);

  const removePlacedItem = (id: string) => {
    setPlacedItems(prev => prev.map(item => item.id === id ? { ...item, isRemoved: true } : item));
  };

  const restorePlacedItem = (id: string) => {
    setPlacedItems(prev => prev.map(item => item.id === id ? { ...item, isRemoved: false } : item));
  };

  const replacePlacedItem = (category: ProductCategory, newProductId: string) => {
    if (category === 'mirror-extras') {
      toggleExtraSelection(newProductId);
    } else {
      setSingleSelection(category as any, newProductId);
    }
  };

  const updateItemCoords = (id: string, x: number, z: number) => {
    setPlacedItems(prev => prev.map(item => item.id === id ? { ...item, x, z } : item));
  };

  const generatePhotorealHeroRender = () => {
    setIsGeneratingRender(true);
    setTimeout(() => {
      setIsGeneratingRender(false);
      setPhotorealRenderUrl('ready');
    }, 2800);
  };

  return (
    <ConfiguratorContext.Provider
      value={{
        activeStep,
        setActiveStep,
        unit,
        setUnit,
        width,
        setWidth,
        length,
        setLength,
        height,
        setHeight,
        roomShape,
        setRoomShape,
        bathroomType,
        setBathroomType,
        plumbingLayout,
        setPlumbingLayout,
        budget,
        setBudget,
        selectedTheme,
        setSelectedTheme,
        selectedBlend,
        setSelectedBlend,
        applyThemeBlend,
        applyCuratedCollection,
        priorityFocus,
        setPriorityFocus,
        wallFinish,
        setWallFinish,
        accessibilityRequirements,
        setAccessibilityRequirements,
        toggleAccessibilityReq,
        renovationScope,
        setRenovationScope,
        toggleRenovationScope,
        selections,
        setSingleSelection,
        toggleExtraSelection,
        aiRecommendedBundle,
        spaceClashWarnings,
        fitScore,
        styleDriftWarnings,
        renovationTimeline,
        applyAiPicks,
        applyCheaperTier,
        selectedLayout,
        setSelectedLayout,
        activeLayoutAlternative,
        setActiveLayoutAlternative,
        layoutAlternatives,
        applyLayoutAlternative,
        constraintAudit,
        applyConstraintResolution,
        designAssessment,
        sustainabilityData,
        aiReasoning,
        manualTotalCost,
        aiBundleTotalCost,
        savingsVsAi,
        activeBundleTab,
        setActiveBundleTab,
        timeOfDay,
        setTimeOfDay,
        placedItems,
        removePlacedItem,
        restorePlacedItem,
        replacePlacedItem,
        updateItemCoords,
        photorealRenderUrl,
        setPhotorealRenderUrl,
        isGeneratingRender,
        generatePhotorealHeroRender
      }}
    >
      {children}
    </ConfiguratorContext.Provider>
  );
};

export const useConfigurator = () => {
  const context = useContext(ConfiguratorContext);
  if (!context) throw new Error('useConfigurator must be used within a ConfiguratorProvider');
  return context;
};
