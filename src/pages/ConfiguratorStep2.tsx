import React, { useState } from 'react';
import { useConfigurator } from '../context/ConfiguratorContext';
import { PRODUCTS, PRODUCT_MAP, ProductCategory, ProductItem } from '../data/products';
import { WALL_FINISHES } from '../data/productVisuals3D';
import { THEMES } from '../data/themes';
import { ASSET_MAP } from '../data/assets';
import { ProductVisual } from '../components/ui/ProductVisual';
import { useCartWishlist } from '../context/CartWishlistContext';
import { 
  Sparkles, 
  AlertTriangle, 
  Clock, 
  Check, 
  ArrowRight, 
  ArrowLeft,
  Heart, 
  ShoppingBag, 
  TrendingDown, 
  ShieldCheck, 
  Info,
  Layers,
  HelpCircle,
  X,
  Compass,
  CheckCircle2
} from 'lucide-react';

interface Step2Props {
  onBack: () => void;
  onNext: () => void;
}

export const ConfiguratorStep2: React.FC<Step2Props> = ({ onBack, onNext }) => {
  const {
    selectedTheme,
    width,
    length,
    unit,
    budget,
    selections,
    setSingleSelection,
    toggleExtraSelection,
    wallFinish,
    setWallFinish,
    aiRecommendedBundle,
    spaceClashWarnings,
    fitScore,
    styleDriftWarnings,
    renovationTimeline,
    applyAiPicks,
    applyCheaperTier,
    manualTotalCost,
    aiBundleTotalCost,
    savingsVsAi,
    layoutAlternatives,
    activeLayoutAlternative,
    applyLayoutAlternative,
    selectedLayout,
    setSelectedLayout,
    constraintAudit,
    applyConstraintResolution,
    aiReasoning,
    designAssessment
  } = useConfigurator();

  const { addToCart, toggleWishlist, isInWishlist } = useCartWishlist();

  const [showLayoutModal, setShowLayoutModal] = useState(false);
  const [activeMainView, setActiveMainView] = useState<'fixtures' | 'reasoning'>('fixtures');
  const [showCheaperModal, setShowCheaperModal] = useState(false);
  const [activeReasoningTab, setActiveReasoningTab] = useState<'why-this' | 'why-not-this' | 'confidence'>('why-this');

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const categories: { key: ProductCategory; label: string; pickType: 'single' | 'multi' }[] = [
    { key: 'shower', label: '1. Shower System', pickType: 'single' },
    { key: 'toilet', label: '2. Sanitation & Commode', pickType: 'single' },
    { key: 'faucet', label: '3. Basin Faucet & Mixers', pickType: 'single' },
    { key: 'lighting', label: '4. Architectural Lighting', pickType: 'single' },
    { key: 'flooring', label: '5. Surface Flooring & Tile', pickType: 'single' },
    { key: 'vanity', label: '6. Vanity & Cabinetry', pickType: 'single' },
    { key: 'mirror-extras', label: '7. Mirror & Acoustic Extras', pickType: 'multi' }
  ];

  const themeDef = THEMES[selectedTheme];
  const crossSellProducts = [
    PRODUCT_MAP[themeDef.recommendedFixtures.faucet],
    PRODUCT_MAP[themeDef.recommendedFixtures.lighting],
    PRODUCT_MAP['extra-mirror']
  ].filter(Boolean) as ProductItem[];

  // Proposed cheaper swaps calculation for the modal
  const proposedCheaperSwaps = React.useMemo(() => {
    const singleCats: ProductCategory[] = ['shower', 'toilet', 'faucet', 'lighting', 'flooring', 'vanity'];
    const swaps: { category: string; current: ProductItem; cheaper: ProductItem; savings: number }[] = [];
    singleCats.forEach(cat => {
      const currentId = selections[cat as keyof typeof selections] as string;
      const currentProd = PRODUCT_MAP[currentId];
      if (!currentProd) return;
      const catProds = PRODUCTS.filter(p => p.category === cat && p.themeFit.includes(selectedTheme));
      const sorted = [...catProds].sort((a, b) => a.price - b.price);
      const cheapest = sorted[0];
      if (cheapest && cheapest.id !== currentId && cheapest.price < currentProd.price) {
        swaps.push({
          category: cat.toUpperCase(),
          current: currentProd,
          cheaper: cheapest,
          savings: currentProd.price - cheapest.price
        });
      }
    });
    return swaps;
  }, [selections, selectedTheme]);

  const totalCheaperSavings = proposedCheaperSwaps.reduce((acc, s) => acc + s.savings, 0);

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-6 animate-fade-in">
      
      {/* Universal Top Back Navigation */}
      <div className="flex items-center justify-between -mb-1">
        <button
          type="button"
          onClick={onBack}
          className="px-3.5 py-1.5 bg-band-2 border border-stone/30 hover:border-accent text-xs font-mono uppercase tracking-wider text-ink rounded-sm flex items-center gap-2 transition-all shadow-xs group"
        >
          <ArrowLeft size={14} className="text-stone group-hover:text-accent group-hover:-translate-x-0.5 transition-transform" />
          <span>← Back to Step 1 (Space & Budget)</span>
        </button>

        {/* View Switcher Tabs: Fixtures vs AI Reasoning */}
        <div className="flex bg-band-2 border border-stone/30 rounded-sm p-1 gap-1 text-xs font-mono uppercase font-bold">
          <button
            type="button"
            onClick={() => setActiveMainView('fixtures')}
            className={`px-3.5 py-1.5 rounded-xs transition-all flex items-center gap-1.5 cursor-pointer ${
              activeMainView === 'fixtures'
                ? 'bg-ink text-porcelain shadow-xs'
                : 'text-stone-dark hover:text-ink'
            }`}
          >
            <Layers size={13} className="text-accent" />
            <span>Fixtures</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveMainView('reasoning')}
            className={`px-3.5 py-1.5 rounded-xs transition-all flex items-center gap-1.5 cursor-pointer ${
              activeMainView === 'reasoning'
                ? 'bg-ink text-porcelain shadow-xs'
                : 'text-stone-dark hover:text-ink'
            }`}
          >
            <HelpCircle size={13} className="text-accent" />
            <span>AI Reasoning Studio</span>
          </button>
        </div>
      </div>

      {/* Editorial Header */}
      <div className="text-center max-w-3xl mx-auto space-y-2">
        <span className="text-xs font-mono uppercase tracking-[0.2em] text-accent font-semibold">
          Step 02 of 03 — Fixture Architecture & Clearance Intelligence
        </span>
        <h1 className="font-serif text-lg sm:text-xl lg:text-2xl text-ink font-bold tracking-tight">
          {activeMainView === 'fixtures' ? 'Select Sanctuary Fixtures' : 'Explainable AI Diagnostic Studio'}
        </h1>
        <p className="text-stone-dark text-xs sm:text-sm leading-relaxed">
          {activeMainView === 'fixtures'
            ? `Curate 7 essential categories in authentic ${themeDef.finishes} finishes. Our spatial optimizer continuously audits clearances, ergonomics, and finish fidelity.`
            : 'Explore deterministic algorithmic rationales, alternative model rejections, and dimensional clearance confidence.'}
        </p>
      </div>

      {/* MAIN VIEW: FIXTURES */}
      {activeMainView === 'fixtures' && (
        <>
          {/* AI Diagnostic Top Bar (Fit Score, Layout Generator, Inspect Reasoning, Show Me Cheaper) */}
          <div className="bg-white border border-stone/20 rounded-sm shadow-editorial p-5 space-y-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-stone/15 pb-4">
              
              {/* Fit Score Badge */}
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full border-2 border-accent/40 bg-accent/10 flex items-center justify-center font-mono font-bold text-sm text-ink">
                  {fitScore}%
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-accent font-semibold">
                    <Sparkles size={13} />
                    <span>AI Confidence / Fit Score</span>
                  </div>
                  <p className="text-[11px] text-stone-dark mt-0.5">
                    Calculated against {width}×{length} {unit} room envelope, plumbing layout, and {themeDef.name} theme.
                  </p>
                </div>
              </div>

              {/* Action Hub: Layout Generator, Inspect Reasoning, Show Me Cheaper */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Generate My Layout Button */}
                <button
                  onClick={() => setShowLayoutModal(true)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-ink hover:bg-ink-muted text-porcelain text-xs font-mono uppercase tracking-wider rounded-sm transition-all shadow-sm font-semibold"
                >
                  <Compass size={13} className="text-accent" />
                  <span>✦ Generate My Layout</span>
                </button>

                {/* Inspect AI Reasoning Tab Button */}
                <button
                  onClick={() => setActiveMainView('reasoning')}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-porcelain-warm border border-stone/30 hover:border-accent text-xs font-mono uppercase tracking-wider text-ink transition-all rounded-sm font-medium"
                >
                  <HelpCircle size={13} className="text-accent" />
                  <span>Inspect AI Reasoning</span>
                </button>

                {/* Show Me Cheaper */}
                <button
                  onClick={() => setShowCheaperModal(true)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 border border-stone/30 hover:border-accent text-xs font-mono uppercase tracking-wider text-stone-dark hover:text-ink hover:bg-porcelain-warm transition-all rounded-sm font-medium"
                  title="Review itemized lower-tier price swaps preserving theme"
                >
                  <TrendingDown size={13} className="text-accent" />
                  <span>Show Me Cheaper</span>
                </button>
              </div>
            </div>

            {/* UNIFIED CONSTRAINT CONFLICT RESOLVER PANEL */}
            {constraintAudit.hasConflicts && (
              <div className="p-4 bg-amber-500/10 border-l-4 border-amber-600 rounded-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-amber-950">
                    <AlertTriangle size={15} className="text-amber-700" />
                    <span>Constraint Conflict Resolver ({constraintAudit.conflicts.length} Active Spatial Clashes)</span>
                  </div>
                  <span className="text-[10px] font-mono uppercase bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded font-bold">
                    Physical Clearance Audit
                  </span>
                </div>

                <div className="space-y-3">
                  {constraintAudit.conflicts.map(conflict => (
                    <div key={conflict.id} className="p-3.5 bg-white/90 border border-amber-300 rounded-sm space-y-2.5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <h4 className="font-serif text-xs sm:text-sm font-semibold text-amber-950">
                          {conflict.title}
                        </h4>
                        {conflict.dimensionOverflowMm && (
                          <span className="text-[10px] font-mono text-red-700 font-semibold bg-red-50 px-2 py-0.5 rounded border border-red-200">
                            Overflow: {conflict.dimensionOverflowMm} mm
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-stone-dark leading-relaxed">
                        {conflict.message}
                      </p>

                      {/* AI Resolution Options */}
                      <div className="space-y-2 pt-2 border-t border-amber-200/60">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-stone-dark block font-semibold">
                          AI Generated Resolutions:
                        </span>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                          {conflict.resolutions.map(res => (
                            <div
                              key={res.id}
                              className="p-2.5 bg-porcelain-warm border border-stone/20 rounded-sm flex flex-col justify-between space-y-2"
                            >
                              <div>
                                <div className="flex items-center justify-between">
                                  <span className="text-[9px] font-mono uppercase text-accent font-bold">
                                    {res.strategy.replace('-', ' ')}
                                  </span>
                                </div>
                                <div className="text-xs font-serif font-semibold text-ink mt-0.5">
                                  {res.title}
                                </div>
                                <p className="text-[11px] text-stone-dark mt-1 leading-snug">
                                  {res.description}
                                </p>
                              </div>
                              <button
                                onClick={() => applyConstraintResolution(res)}
                                className="w-full py-1.5 px-2 bg-ink hover:bg-accent text-porcelain text-[10px] font-mono uppercase tracking-wider font-semibold rounded-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                              >
                                <Check size={11} />
                                <span>Apply AI Resolution</span>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* ✦ PROMINENT C17 LAYOUT ALTERNATIVES SELECTION SECTION ✦ */}
      <div className="bg-white border border-stone/20 rounded-sm shadow-editorial p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone/15 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-accent font-semibold">
              <Compass size={16} />
              <span>AI Spatial Synthesis Engine · C17 Layout Alternatives</span>
            </div>
            <h2 className="font-serif text-2xl font-semibold text-ink mt-1">
              Select Algorithmic Room Layout
            </h2>
            <p className="text-xs text-stone-dark mt-1">
              Drives fixture arrangement across both the 2D floor plan and the real-time 3D isometric dollhouse.
            </p>
          </div>
          <span className="text-xs font-mono uppercase px-3 py-1 bg-band-2 border border-accent/30 text-ink rounded-xs font-bold shrink-0 self-start sm:self-center">
            Active: {selectedLayout === 'linear' ? 'Linear Wet Wall' : selectedLayout === 'l-shaped' ? 'L-Shaped Sanctuary' : 'Parallel Galley'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              id: 'linear' as const,
              altId: 'space-optimized' as const,
              title: 'Option 1: Linear Wet Wall',
              badge: 'Space-Optimized (Single Wall)',
              image: ASSET_MAP.step2.layouts.linear,
              desc: 'Consolidates vanity, water closet, and walk-in shower along a single plumbed wall. Minimizes core drill alterations while preserving a wide central corridor.',
              stats: 'Passage Corridor: 950mm · Circulation: 52%',
              tag: 'Cost-Efficient Rough-in'
            },
            {
              id: 'l-shaped' as const,
              altId: 'luxury-optimized' as const,
              title: 'Option 2: L-Shaped Sanctuary',
              badge: 'Luxury-Optimized (Perpendicular)',
              image: ASSET_MAP.step2.layouts.lShaped,
              desc: 'Wraps vanity and shower across adjoining perpendicular walls. Provides expansive mirror sightlines and an intimate alcove shower feeling for master suites.',
              stats: 'Passage Corridor: 880mm · Circulation: 46%',
              tag: 'Enhanced Focal Depth'
            },
            {
              id: 'parallel' as const,
              altId: 'accessibility-oriented' as const,
              title: 'Option 3: Parallel Galley',
              badge: 'Accessibility-Oriented (Dual-Wall)',
              image: ASSET_MAP.step2.layouts.parallel,
              desc: 'Arranges vanity and sanitary fixtures on opposite walls. Creates a wide 1200mm+ barrier-free thoroughfare with zero-threshold curbless entry.',
              stats: 'Turning Radius: 1524mm (60") · Circulation: 58%',
              tag: 'Universal Barrier-Free'
            },
          ].map(opt => {
            const isCurrent = selectedLayout === opt.id;
            return (
              <div
                key={opt.id}
                onClick={() => {
                  setSelectedLayout(opt.id);
                  applyLayoutAlternative(opt.altId);
                }}
                className={`cursor-pointer rounded-sm border overflow-hidden transition-all duration-300 flex flex-col justify-between group ${
                  isCurrent
                    ? 'border-accent ring-2 ring-accent/40 bg-accent/5 shadow-luxury'
                    : 'border-stone/25 hover:border-stone/40 bg-white hover:shadow-editorial'
                }`}
              >
                {/* Image Header with Badge */}
                <div className="relative h-48 w-full overflow-hidden bg-stone/10">
                  <img
                    src={opt.image}
                    alt={opt.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent pointer-events-none" />
                  <span className="absolute top-2.5 left-2.5 text-xs font-mono uppercase bg-ink/90 text-porcelain px-2.5 py-1 rounded border border-white/20 font-bold backdrop-blur-xs">
                    {opt.badge}
                  </span>
                  {isCurrent && (
                    <div className="absolute top-2.5 right-2.5 bg-accent text-white p-1 rounded-full shadow-md">
                      <Check size={14} />
                    </div>
                  )}
                  <span className="absolute bottom-2.5 left-2.5 text-xs font-mono uppercase text-porcelain font-semibold">
                    {opt.tag}
                  </span>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-serif text-lg font-semibold text-ink group-hover:text-accent transition-colors">
                      {opt.title}
                    </h3>
                    <p className="text-sm text-stone-dark mt-1.5 leading-relaxed font-sans">
                      {opt.desc}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-stone/15 space-y-2">
                    <div className="text-xs font-mono text-stone-dark font-medium">
                      {opt.stats}
                    </div>
                    <button
                      type="button"
                      className={`w-full py-2.5 text-xs font-mono uppercase tracking-wider font-semibold rounded-xs transition-colors flex items-center justify-center gap-1.5 ${
                        isCurrent
                          ? 'bg-accent text-white'
                          : 'bg-porcelain-warm hover:bg-stone/20 text-ink border border-stone/25'
                      }`}
                    >
                      {isCurrent ? <CheckCircle2 size={14} /> : <Compass size={14} />}
                      <span>{isCurrent ? 'Active Layout' : 'Select Layout'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* The 7 Categories Sections */}
      <div className="space-y-12">
        {categories.map((cat) => {
          const catProducts = PRODUCTS.filter(p => p.category === cat.key);
          const isSelected = (prodId: string) => {
            if (cat.pickType === 'multi') {
              return selections['mirror-extras'].includes(prodId);
            }
            return selections[cat.key as keyof typeof selections] === prodId;
          };

          const isAiRecommended = (prodId: string) => {
            if (cat.pickType === 'multi') {
              return (aiRecommendedBundle['mirror-extras'] as string[]).includes(prodId);
            }
            return aiRecommendedBundle[cat.key] === prodId;
          };

          return (
            <div key={cat.key} className="space-y-4">
              
              {/* Category Header */}
              <div className="flex items-baseline justify-between border-b border-stone/20 pb-3">
                <div className="flex items-center gap-3">
                  <h2 className="font-serif text-xl sm:text-2xl text-ink font-semibold">
                    {cat.label}
                  </h2>
                  <span className="text-xs font-mono text-stone-dark uppercase tracking-wider font-medium">
                    ({cat.pickType === 'single' ? 'Pick one' : 'Multi-select'})
                  </span>
                </div>
              </div>

              {/* 4-Column Grid of Product Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* 0. "None / Omit Fixture" Card */}
                {(() => {
                  const isNoneActive = cat.pickType === 'single'
                    ? selections[cat.key as keyof typeof selections] === 'none'
                    : selections['mirror-extras'].length === 0;

                  return (
                    <div
                      onClick={() => {
                        if (cat.pickType === 'single') {
                          setSingleSelection(cat.key as any, 'none');
                        } else {
                          toggleExtraSelection('none');
                        }
                      }}
                      className={`group cursor-pointer bg-porcelain-warm/40 border transition-all duration-300 rounded-sm overflow-hidden flex flex-col justify-between relative min-h-[360px] ${
                        isNoneActive
                          ? 'border-accent ring-2 ring-accent/30 shadow-luxury bg-white'
                          : 'border-dashed border-stone/30 hover:border-stone/50 hover:shadow-editorial'
                      }`}
                    >
                      {isNoneActive && (
                        <div className="absolute top-2.5 right-2.5 z-10 w-6 h-6 bg-accent text-porcelain rounded-full flex items-center justify-center shadow-md">
                          <Check size={14} />
                        </div>
                      )}

                      {/* Visual Area for None */}
                      <div className="h-56 sm:h-64 w-full bg-stone/5 flex flex-col items-center justify-center border-b border-stone/15 text-stone-dark group-hover:text-ink transition-colors">
                        <div className="w-12 h-12 rounded-full border border-dashed border-stone/40 flex items-center justify-center mb-2 text-stone group-hover:border-accent group-hover:text-accent transition-colors">
                          <X size={20} />
                        </div>
                        <span className="text-xs font-mono uppercase tracking-wider text-stone-dark font-medium">Omit Fixture</span>
                      </div>

                      {/* Body for None */}
                      <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                        <div className="space-y-1">
                          <div className="text-xs font-mono uppercase text-stone-dark tracking-wider font-medium">
                            Clearance & Spatial Egress
                          </div>
                          <h3 className="font-serif text-base font-semibold text-ink">
                            None / Omit {cat.label.replace(/^\d+\.\s*/, '')}
                          </h3>
                          <p className="text-sm text-stone-dark leading-relaxed">
                            Exclude this fixture from spatial layout, 3D model, and investment schedule.
                          </p>
                        </div>

                        <div className="pt-3 border-t border-stone/10 flex items-center justify-between font-mono text-sm mt-2">
                          <span className="text-stone-dark">Investment</span>
                          <span className="font-bold text-ink">₹0</span>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {catProducts.map(product => {
                  const active = isSelected(product.id);
                  const recommended = isAiRecommended(product.id);
                  const hasStyleDrift = !product.themeFit.includes(selectedTheme);

                  return (
                    <div
                      key={product.id}
                      onClick={() => {
                        if (cat.pickType === 'single') {
                          setSingleSelection(cat.key as any, product.id);
                        } else {
                          toggleExtraSelection(product.id);
                        }
                      }}
                      className={`group cursor-pointer bg-white border transition-all duration-300 rounded-sm overflow-hidden flex flex-col justify-between relative ${
                        active
                          ? 'border-accent ring-2 ring-accent/30 shadow-luxury'
                          : 'border-stone/20 hover:border-stone/40 hover:shadow-editorial'
                      }`}
                    >
                      {/* Selection Checkmark */}
                      {active && (
                        <div className="absolute top-2.5 right-2.5 z-10 w-5 h-5 bg-accent text-porcelain rounded-full flex items-center justify-center shadow-md">
                          <Check size={12} />
                        </div>
                      )}

                      {/* Style Drift Warning Flag Badge on Image */}
                      {hasStyleDrift && (
                        <div className="absolute top-2.5 left-2.5 z-20 group/drift">
                          <div className="p-1 bg-amber-500 text-white rounded-full shadow-md flex items-center justify-center cursor-help">
                            <AlertTriangle size={12} />
                          </div>
                          {/* Rich Product-Specific Mismatch Tooltip */}
                          <div className="absolute top-7 left-0 z-30 w-60 p-2.5 bg-ink text-porcelain text-xs font-sans rounded-sm shadow-luxury opacity-0 group-hover/drift:opacity-100 transition-opacity pointer-events-none border border-amber-500/40">
                            <div className="font-mono text-[10px] uppercase text-amber-400 font-bold mb-1 flex items-center gap-1">
                              <AlertTriangle size={11} /> Style Drift Warning
                            </div>
                            <p className="leading-snug text-stone-light">
                              <strong className="text-white font-serif">{product.name}</strong> ({product.finishName}) departs from your <strong className="text-accent">{themeDef.name}</strong> palette ({themeDef.finishes}). Consider a {themeDef.name}-fit alternative.
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Product Visual */}
                      <div className="relative">
                        <ProductVisual product={product} size="md" />

                        {/* Heart & Cart action buttons */}
                        <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleWishlist(product.id);
                            }}
                            className="p-1.5 bg-white/95 hover:bg-white text-stone-dark hover:text-red-700 rounded-full shadow-xs transition-colors"
                            aria-label="Wishlist"
                          >
                            <Heart size={14} className={isInWishlist(product.id) ? 'text-red-700 fill-red-700' : ''} />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              addToCart(product.id);
                            }}
                            className="p-1.5 bg-white/95 hover:bg-white text-stone-dark hover:text-ink rounded-full shadow-xs transition-colors"
                            aria-label="Add to cart"
                          >
                            <ShoppingBag size={14} />
                          </button>
                        </div>
                      </div>

                      {/* Card Body - Cleaned up: name + tags + price only */}
                      <div className="p-3.5 space-y-2.5 flex-1 flex flex-col justify-between">
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs font-mono uppercase text-stone-dark font-bold">
                            <span className="flex items-center gap-1.5">
                              <span className={`w-2.5 h-2.5 rounded-full ${
                                product.tier === 'Premium' ? 'bg-amber-900' :
                                product.tier === 'Mid-luxury' ? 'bg-accent' : 'bg-stone-dark'
                              }`} />
                              <span>{product.tier}</span>
                            </span>
                            <span className="text-stone-dark">{product.finishCode}</span>
                          </div>

                          <h3 className="font-serif text-sm sm:text-base font-bold text-ink group-hover:text-accent transition-colors leading-snug">
                            {product.name}
                          </h3>
                        </div>

                        {/* AI "Why This" Explainer */}
                        {recommended && (
                          <div className="pt-2 border-t border-stone/20 mt-1">
                            <div className="p-2 bg-porcelain-warm border-l-2 border-accent rounded-xs space-y-0.5">
                              <div className="flex items-center gap-1 text-[10px] font-mono uppercase text-accent font-bold">
                                <Sparkles size={12} />
                                <span>AI Rationale</span>
                              </div>
                              <p className="text-xs text-ink leading-snug font-sans font-medium">
                                {product.whyThis[selectedTheme] || product.whyThis['minimalist-modern']}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Price footer */}
                        <div className="pt-2.5 border-t border-stone/15 flex items-center justify-between mt-1">
                          <span className="font-mono text-sm sm:text-base font-bold text-ink">
                            {formatPrice(product.price)}
                          </span>
                          <span className="text-xs font-mono uppercase text-ink font-bold tracking-wider">
                            {active ? 'Selected' : 'Select'}
                          </span>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>

              {/* Architectural Wall Surface & Finish Selector (Rendered under category 5: flooring) */}
              {cat.key === 'flooring' && (
                <div className="mt-8 pt-8 border-t border-stone/20 space-y-4">
                  <div className="flex items-baseline justify-between border-b border-stone/20 pb-3">
                    <div className="flex items-center gap-3">
                      <h3 className="font-serif text-xl sm:text-2xl text-ink font-semibold">
                        Architectural Wall Surface & Finish
                      </h3>
                      <span className="text-xs font-mono text-accent uppercase tracking-wider font-semibold">
                        (5 Curated Plaster & Limewash Finishes)
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-stone-dark leading-relaxed font-sans">
                    Define the matte mineral wall finish enveloping your bathroom envelope. Wall finish directly drives procedural 3D wall materials, light reflectance, and room tone.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 pt-1">
                    {WALL_FINISHES.map(wf => {
                      const isWallActive = wallFinish === wf.id;
                      return (
                        <div
                          key={wf.id}
                          onClick={() => setWallFinish(wf.id)}
                          className={`group cursor-pointer bg-white border transition-all duration-300 rounded-sm p-4 flex flex-col justify-between relative ${
                            isWallActive
                              ? 'border-accent ring-2 ring-accent/30 shadow-luxury'
                              : 'border-stone/20 hover:border-stone/40 hover:shadow-editorial'
                          }`}
                        >
                          {isWallActive && (
                            <div className="absolute top-2.5 right-2.5 z-10 w-5 h-5 bg-accent text-porcelain rounded-full flex items-center justify-center shadow-xs">
                              <Check size={12} />
                            </div>
                          )}
                          <div>
                            <div
                              className="w-full h-16 rounded-xs border border-stone/25 shadow-inner mb-3 transition-transform group-hover:scale-[1.02]"
                              style={{ backgroundColor: wf.colorHex }}
                            />
                            <h4 className="font-serif text-sm font-semibold text-ink group-hover:text-accent transition-colors leading-snug">
                              {wf.name}
                            </h4>
                            <p className="text-xs text-stone-dark mt-1 leading-relaxed font-sans">
                              {wf.description}
                            </p>
                          </div>
                          <div className="pt-3 mt-3 border-t border-stone/10 flex items-center justify-between text-xs font-mono">
                            <span className="text-stone-dark">Tone</span>
                            <span className="font-semibold text-ink uppercase">{wf.colorHex}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>
          );
        })}
      </div>

      {/* Cross-Sell Strip */}
      <div className="p-6 bg-porcelain-warm border border-stone/25 rounded-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-accent" />
            <h3 className="font-serif text-lg font-semibold text-ink">
              Frequently Paired Together for {themeDef.name}
            </h3>
          </div>
          <span className="text-xs font-mono text-stone-dark uppercase">Cross-Category Synergy</span>
        </div>
        <p className="text-xs text-stone-dark max-w-2xl leading-relaxed">
          These elements share identical metallurgical substrate and PVD deposition chemistry with your active {themeDef.finishes} suite.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
          {crossSellProducts.map(prod => (
            <div key={prod.id} className="p-3 bg-white border border-stone/20 rounded-sm flex items-center justify-between gap-3">
              <div className="min-w-0">
                <span className="text-[9px] font-mono uppercase text-accent font-semibold block">{prod.category}</span>
                <div className="font-serif text-xs font-semibold text-ink truncate">{prod.name}</div>
                <div className="text-[10px] font-mono text-stone">{formatPrice(prod.price)}</div>
              </div>
              <button
                type="button"
                onClick={() => addToCart(prod.id)}
                className="px-2.5 py-1.5 bg-ink text-porcelain text-[10px] font-mono uppercase tracking-wider hover:bg-accent transition-colors rounded-sm shrink-0"
              >
                Add
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Budget Bar */}
      <div className="bg-ink text-porcelain p-6 sm:p-8 rounded-sm shadow-luxury space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase text-stone-light tracking-wider block">
              Your Manual Selection Total
            </span>
            <div className="font-mono text-2xl font-bold text-porcelain">
              {formatPrice(manualTotalCost)}
            </div>
            <div className="text-[11px] font-mono text-stone-light">
              Budget Target: {formatPrice(budget)}
            </div>
          </div>

          <div className="space-y-1 border-l border-stone/30 pl-0 md:pl-6">
            <span className="text-[10px] font-mono uppercase text-accent tracking-wider block flex items-center gap-1">
              <Sparkles size={12} /> AI Recommended Alternative
            </span>
            <div className="font-mono text-2xl font-bold text-accent">
              {formatPrice(aiBundleTotalCost)}
            </div>
            {savingsVsAi > 0 ? (
              <div className="inline-block mt-1 text-[11px] font-mono text-green-400 bg-green-950/60 px-2 py-0.5 rounded border border-green-700">
                AI suggestion saves {formatPrice(savingsVsAi)} with {fitScore}% match
              </div>
            ) : (
              <div className="inline-block mt-1 text-[11px] font-mono text-stone-light">
                Optimal finish alignment with {fitScore}% fit
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-2 justify-center">
            <button
              onClick={applyAiPicks}
              className="w-full py-2.5 px-4 bg-porcelain/10 hover:bg-porcelain/20 border border-porcelain/25 text-xs font-mono uppercase tracking-widest text-porcelain transition-colors text-center"
            >
              Use AI's Picks Instead
            </button>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="pt-6 border-t border-stone/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            onClick={onBack}
            className="w-full sm:w-auto px-7 py-3.5 border-2 border-stone/40 text-sm font-mono uppercase tracking-widest text-ink font-bold hover:bg-stone/10 transition-colors flex items-center justify-center gap-2.5 rounded-sm cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>Edit Dimensions & Theme</span>
          </button>

          <button
            onClick={onNext}
            className="w-full sm:w-auto px-10 py-4.5 bg-ink hover:bg-accent text-porcelain font-bold text-sm sm:text-base font-mono uppercase tracking-widest flex items-center justify-center gap-3 transition-colors shadow-luxury group rounded-sm cursor-pointer"
          >
            <span>Generate 2D Plan & Interactive 3D Model</span>
            <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform text-accent group-hover:text-porcelain" />
          </button>
        </div>
      </div>

      {/* ✦ MULTI-LAYOUT GENERATOR MODAL */}
      {showLayoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-porcelain border border-stone/30 shadow-luxury rounded-sm p-6 sm:p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex justify-between items-center border-b border-stone/20 pb-4">
              <div>
                <div className="flex items-center gap-2 text-accent font-mono text-xs uppercase tracking-wider font-semibold">
                  <Compass size={16} />
                  <span>AI Auto-Layout Synthesis Engine</span>
                </div>
                <h3 className="font-serif text-2xl font-semibold text-ink mt-0.5">
                  Choose an Algorithmic Room Layout
                </h3>
              </div>
              <button 
                onClick={() => setShowLayoutModal(false)}
                className="p-1.5 text-stone hover:text-ink rounded-sm hover:bg-stone/15 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {layoutAlternatives.map(layout => {
                const isCurrent = activeLayoutAlternative === layout.id;
                const layoutImage = 
                  layout.id === 'space-optimized' ? ASSET_MAP.step2.layouts.linear :
                  layout.id === 'luxury-optimized' ? ASSET_MAP.step2.layouts.lShaped :
                  ASSET_MAP.step2.layouts.parallel;
                const layoutTypeKey = 
                  layout.id === 'space-optimized' ? 'linear' :
                  layout.id === 'luxury-optimized' ? 'l-shaped' : 'parallel';

                return (
                  <div
                    key={layout.id}
                    className={`bg-white border rounded-sm flex flex-col justify-between overflow-hidden space-y-3 transition-all duration-300 ${
                      isCurrent
                        ? 'border-accent ring-2 ring-accent/30 shadow-luxury'
                        : 'border-stone/20 hover:border-stone/40 hover:shadow-editorial'
                    }`}
                  >
                    <div className="h-32 w-full overflow-hidden relative bg-stone/10">
                      <img
                        src={layoutImage}
                        alt={layout.name}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-2 left-2 text-[9px] font-mono uppercase bg-ink/80 text-porcelain px-2 py-0.5 rounded font-bold">
                        {layout.badge}
                      </span>
                      <span className="absolute top-2 right-2 text-xs font-mono font-bold bg-white/90 px-2 py-0.5 rounded text-ink">
                        {layout.spatialScore}% Fit
                      </span>
                    </div>

                    <div className="px-4 pb-4 space-y-3 flex-1 flex flex-col justify-between">
                      <div className="space-y-2">
                        <h4 className="font-serif text-base font-semibold text-ink">
                          {layout.name}
                        </h4>

                        <p className="text-xs text-stone-dark leading-relaxed">
                          {layout.description}
                        </p>

                        <div className="pt-2 border-t border-stone/15 space-y-1 font-mono text-[11px] text-stone-dark">
                          <div className="flex justify-between">
                            <span>Floor Circulation:</span>
                            <strong className="text-ink">{layout.circulationPercentage}%</strong>
                          </div>
                          <div className="flex justify-between">
                            <span>Turning Circle:</span>
                            <strong className="text-ink">{layout.turningCircleMm} mm</strong>
                          </div>
                          <div className="flex justify-between">
                            <span>Passage Corridor:</span>
                            <strong className="text-ink">{layout.passageCorridorMm} mm</strong>
                          </div>
                        </div>

                        <div className="space-y-1 pt-1.5 border-t border-stone/10">
                          {layout.spatialHighlights.map((hl, i) => (
                            <div key={i} className="text-[10px] text-stone-dark flex items-start gap-1.5">
                              <span className="text-accent shrink-0">✓</span>
                              <span>{hl}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          applyLayoutAlternative(layout.id);
                          setSelectedLayout(layoutTypeKey as any);
                          setShowLayoutModal(false);
                        }}
                        className={`w-full py-2.5 text-xs font-mono uppercase tracking-widest font-semibold rounded-sm transition-all flex items-center justify-center gap-2 mt-2 ${
                          isCurrent
                            ? 'bg-accent text-ink'
                            : 'bg-ink hover:bg-ink-muted text-porcelain'
                        }`}
                      >
                        {isCurrent ? <CheckCircle2 size={14} /> : <Compass size={14} />}
                        <span>{isCurrent ? 'Active Configuration' : 'Apply This Layout'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* MAIN VIEW: AI REASONING STUDIO (Same Page View, Not Overlay) */}
      {activeMainView === 'reasoning' && (
        <div className="bg-white border border-stone/20 rounded-sm shadow-editorial p-6 sm:p-8 space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone/15 pb-4">
            <div>
              <div className="flex items-center gap-2 text-accent font-mono text-xs uppercase tracking-wider font-semibold">
                <HelpCircle size={16} />
                <span>Explainable AI Diagnostic Studio</span>
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-semibold text-ink mt-0.5">
                Algorithmic Rationale & Rejection Matrix
              </h3>
              <p className="text-xs text-stone-dark mt-1 font-sans">
                Deterministic explanations for every selected fixture and evaluated alternative.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setActiveMainView('fixtures')}
              className="px-4 py-2 bg-ink hover:bg-accent text-porcelain text-xs font-mono uppercase tracking-wider rounded-sm font-semibold flex items-center gap-2 shadow-xs transition-colors shrink-0"
            >
              <ArrowLeft size={14} />
              <span>← Back to Fixture Selection</span>
            </button>
          </div>

          {/* Reasoning View Sub-Tabs */}
          <div className="flex gap-4 border-b border-stone/20 pb-2 text-xs font-mono uppercase">
            <button
              onClick={() => setActiveReasoningTab('why-this')}
              className={`pb-2 border-b-2 font-bold cursor-pointer transition-colors ${
                activeReasoningTab === 'why-this' ? 'border-accent text-ink' : 'border-transparent text-stone-dark hover:text-ink'
              }`}
            >
              "Why Spatia Chose This"
            </button>
            <button
              onClick={() => setActiveReasoningTab('why-not-this')}
              className={`pb-2 border-b-2 font-bold cursor-pointer transition-colors ${
                activeReasoningTab === 'why-not-this' ? 'border-accent text-ink' : 'border-transparent text-stone-dark hover:text-ink'
              }`}
            >
              "Why Not This?" (Rejected Alternatives)
            </button>
            <button
              onClick={() => setActiveReasoningTab('confidence')}
              className={`pb-2 border-b-2 font-bold cursor-pointer transition-colors ${
                activeReasoningTab === 'confidence' ? 'border-accent text-ink' : 'border-transparent text-stone-dark hover:text-ink'
              }`}
            >
              Design Confidence Matrix
            </button>
          </div>

          {/* Sub-Tab: Why This */}
          {activeReasoningTab === 'why-this' && (
            <div className="space-y-4">
              {Object.values(aiReasoning.selectedRationales).map((rat, i) => (
                <div key={i} className="p-4 bg-porcelain-warm/50 border border-stone/20 rounded-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase text-accent font-bold">
                      {rat.category}
                    </span>
                    <span className="font-serif text-sm font-bold text-ink">
                      {PRODUCT_MAP[rat.productId]?.name}
                    </span>
                  </div>
                  <p className="text-xs text-ink font-serif italic">
                    "{rat.headline}"
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-2 border-t border-stone/15 text-xs font-sans text-stone-dark">
                    <div>📐 <strong>Spatial:</strong> {rat.spatialReason}</div>
                    <div>✨ <strong>Material:</strong> {rat.materialReason}</div>
                    <div>💧 <strong>Hydraulic:</strong> {rat.hydraulicReason}</div>
                    <div>🌿 <strong>Efficiency:</strong> {rat.efficiencyReason}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Sub-Tab: Why Not This */}
          {activeReasoningTab === 'why-not-this' && (
            <div className="space-y-4">
              {(['shower', 'toilet', 'vanity', 'faucet'] as ProductCategory[]).map(cat => (
                <div key={cat} className="space-y-2">
                  <h4 className="font-serif text-xs sm:text-sm font-bold text-ink uppercase border-b border-stone/15 pb-1">
                    {cat} Alternatives Evaluated
                  </h4>
                  <div className="space-y-2">
                    {aiReasoning.rejectedCandidates[cat]?.map(cand => (
                      <div key={cand.candidateId} className="p-3 bg-white border border-stone/20 rounded-sm flex items-start justify-between gap-4">
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-serif text-sm font-semibold text-ink">{cand.candidateName}</span>
                            <span className="text-[10px] font-mono text-stone-dark font-medium">
                              ({cand.priceDelta >= 0 ? `+${formatPrice(cand.priceDelta)}` : `-${formatPrice(Math.abs(cand.priceDelta))}`})
                            </span>
                          </div>
                          <p className="text-xs text-red-900 bg-red-50/70 p-2 rounded-xs border border-red-200 leading-relaxed font-sans">
                            <strong>Rejection Reason:</strong> {cand.rejectionReason}
                          </p>
                        </div>
                        <div className="text-right font-mono text-xs shrink-0">
                          <span className="text-stone-dark">Fit Score: </span>
                          <strong className="text-ink">{cand.scoreComparison.candidateScore}%</strong>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Sub-Tab: Confidence */}
          {activeReasoningTab === 'confidence' && (
            <div className="space-y-5">
              <div className="p-4 bg-band-2 border border-accent/40 rounded-sm flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono uppercase text-accent font-bold">Overall Design Confidence</span>
                  <h4 className="font-serif text-xl sm:text-2xl font-bold text-ink mt-0.5">
                    {aiReasoning.designConfidence.overallPercentage}% — {aiReasoning.designConfidence.confidenceTier} Confidence
                  </h4>
                </div>
                <ShieldCheck size={32} className="text-accent" />
              </div>

              <div className="space-y-2">
                <h4 className="font-mono text-xs uppercase tracking-wider text-stone-dark font-bold">
                  Verified Input Factors:
                </h4>
                {aiReasoning.designConfidence.verifiedFactors.map((vf, i) => (
                  <div key={i} className="p-3 bg-white border border-stone/20 rounded-sm flex items-center justify-between gap-4">
                    <div>
                      <div className="font-serif text-sm font-semibold text-ink">{vf.factor}</div>
                      <p className="text-xs text-stone-dark mt-0.5 font-sans">{vf.impact}</p>
                    </div>
                    <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border font-semibold ${
                      vf.status === 'verified'
                        ? 'bg-green-100 text-green-800 border-green-300'
                        : 'bg-stone-100 text-stone-dark border-stone-300'
                    }`}>
                      {vf.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ✦ ITEMIZED "SHOW ME CHEAPER" OPTIMIZATION MODAL ✦ */}
      {showCheaperModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-porcelain border border-stone/30 shadow-luxury rounded-sm p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-5">
            <div className="flex justify-between items-center border-b border-stone/20 pb-3">
              <div>
                <div className="flex items-center gap-2 text-accent font-mono text-xs uppercase tracking-wider font-semibold">
                  <TrendingDown size={16} />
                  <span>Budget Optimization Studio</span>
                </div>
                <h3 className="font-serif text-xl sm:text-2xl font-semibold text-ink mt-0.5">
                  Proposed Itemized Swaps
                </h3>
              </div>
              <button 
                onClick={() => setShowCheaperModal(false)}
                className="p-1.5 text-stone hover:text-ink rounded-sm hover:bg-stone/15 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Total Savings Summary Header */}
            <div className="p-4 bg-green-50 border border-green-200 rounded-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-green-800 font-bold block">
                  Total Potential Savings
                </span>
                <div className="font-mono text-xl sm:text-2xl font-bold text-green-900">
                  {formatPrice(totalCheaperSavings)}
                </div>
              </div>
              <div className="text-right text-xs font-mono text-green-800 font-medium">
                Preserving <strong className="text-green-950 font-bold">{themeDef.name}</strong> theme fit
              </div>
            </div>

            {/* Itemized Swaps Table */}
            {proposedCheaperSwaps.length > 0 ? (
              <div className="space-y-3">
                <div className="text-xs font-mono uppercase tracking-wider text-stone-dark font-bold">
                  Proposed Swaps ({proposedCheaperSwaps.length} Items):
                </div>
                <div className="divide-y divide-stone/20 border border-stone/25 rounded-sm overflow-hidden bg-white">
                  {proposedCheaperSwaps.map((swap, idx) => (
                    <div key={idx} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                      <div className="space-y-0.5">
                        <span className="font-mono text-[10px] uppercase text-accent font-bold block">
                          {swap.category}
                        </span>
                        <div className="flex items-center gap-1.5 font-serif">
                          <span className="line-through text-stone-dark">{swap.current.name}</span>
                          <span className="text-stone-dark">→</span>
                          <span className="font-bold text-ink">{swap.cheaper.name}</span>
                        </div>
                        <div className="font-mono text-[11px] text-stone-dark">
                          {formatPrice(swap.current.price)} → {formatPrice(swap.cheaper.price)}
                        </div>
                      </div>
                      <span className="font-mono text-xs font-bold text-green-700 bg-green-50 px-2 py-1 rounded border border-green-200 shrink-0 self-start sm:self-center">
                        Save {formatPrice(swap.savings)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-6 bg-white border border-stone/20 rounded-sm text-center text-xs font-mono text-stone-dark">
                Your current selections are already at the most cost-efficient tier for the {themeDef.name} theme.
              </div>
            )}

            {/* Modal Actions */}
            <div className="pt-4 border-t border-stone/20 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setShowCheaperModal(false)}
                className="px-5 py-2.5 border border-stone/30 hover:bg-stone/10 text-ink text-xs font-mono uppercase tracking-wider font-bold rounded-sm transition-colors cursor-pointer"
              >
                Keep Current Selections
              </button>

              {proposedCheaperSwaps.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    applyCheaperTier();
                    setShowCheaperModal(false);
                  }}
                  className="px-6 py-2.5 bg-ink hover:bg-accent text-porcelain text-xs font-mono uppercase tracking-wider font-bold rounded-sm transition-colors shadow-luxury cursor-pointer flex items-center gap-2"
                >
                  <Check size={14} />
                  <span>Apply {proposedCheaperSwaps.length} Swaps ({formatPrice(totalCheaperSavings)} Off)</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
