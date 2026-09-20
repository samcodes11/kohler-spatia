import React, { useState } from 'react';
import { useConfigurator, BundleTier } from '../context/ConfiguratorContext';
import { PRODUCT_MAP, ProductItem } from '../data/products';
import { THEMES } from '../data/themes';
import { FloorPlan2D } from '../components/spatial/FloorPlan2D';
import { RoomScene3D } from '../three/RoomScene3D';
import { generate13PageDesignReportPdf } from '../services/pdfReportService';
import { useAuth } from '../context/AuthContext';
import { 
  FileDown, 
  Bookmark, 
  BookmarkCheck, 
  ArrowLeft, 
  Sparkles, 
  Ruler, 
  Layers, 
  DollarSign,
  CheckCircle2,
  Share2,
  Droplets,
  Zap,
  Activity,
  Check,
  TrendingDown,
  TrendingUp,
  ShieldCheck,
  Droplet,
  BarChart3
} from 'lucide-react';
import { WALL_FINISHES } from '../data/productVisuals3D';

interface ResultProps {
  onBackToConfigurator: () => void;
  onNavigateToDashboard?: () => void;
}

export const ConfiguratorResult: React.FC<ResultProps> = ({ 
  onBackToConfigurator,
  onNavigateToDashboard 
}) => {
  const {
    roomShape,
    width,
    length,
    height,
    unit,
    plumbingLayout,
    bathroomType,
    budget,
    selectedTheme,
    selectedBlend,
    selections,
    activeBundleTab,
    setActiveBundleTab,
    manualTotalCost,
    designAssessment,
    sustainabilityData,
    accessibilityRequirements,
    renovationScope,
    selectedLayout,
    setSelectedLayout,
    wallFinish,
    setWallFinish
  } = useConfigurator();

  const { isAuthenticated, openAuthModal, saveCurrentProject, user } = useAuth();

  const [isSaved, setIsSaved] = useState(false);
  const [activeTabMode, setActiveTabMode] = useState<'3d' | '2d'>('3d');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const themeDef = THEMES[selectedTheme];

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  // Compile selected products list
  const selectedProductList: ProductItem[] = [
    PRODUCT_MAP[selections.shower],
    PRODUCT_MAP[selections.toilet],
    PRODUCT_MAP[selections.faucet],
    PRODUCT_MAP[selections.lighting],
    PRODUCT_MAP[selections.flooring],
    PRODUCT_MAP[selections.vanity],
    ...selections['mirror-extras'].map(id => PRODUCT_MAP[id])
  ].filter(Boolean);

  const handleDownloadFullPdf = async () => {
    setIsGeneratingPdf(true);
    try {
      await generate13PageDesignReportPdf({
        state: {
          roomDimensions: { width, length, height, unit },
          roomShape,
          doorPosition: { wall: 'front', offset: 400, width: 850, swing: 'inward' },
          plumbingStatus: plumbingLayout,
          plumbingLocations: { showerDrain: [400, 400], toiletWaste: [1800, 800], vanitySupply: [1200, 400] },
          bathroomType,
          budget,
          theme: selectedTheme,
          selectedBlend: selectedBlend || undefined,
          userPriorities: { waterConservation: 4, luxuryExperience: 4, plumbingPreservation: 4, accessibility: 3 },
          accessibilityRequirements,
          renovationScope
        },
        selectedFixtureIds: selectedProductList.map(p => p.id),
        totalCost: manualTotalCost,
        projectName: selectedBlend ? `${selectedBlend.title} Sanctuary` : `${themeDef.name} Sanctuary`,
        clientName: user?.name || 'Architectural Patron'
      });
    } catch (err) {
      console.error("Failed to generate PDF report:", err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleSaveToDashboard = () => {
    if (!isAuthenticated) {
      openAuthModal('save');
      return;
    }

    saveCurrentProject({
      name: selectedBlend ? `${selectedBlend.title} — ${roomShape.toUpperCase()}` : `${themeDef.name} — ${roomShape.toUpperCase()}`,
      theme: selectedTheme,
      budget: manualTotalCost,
      totalCost: manualTotalCost,
      roomShape,
      dimensions: { width, length, unit },
      fixtureIds: selectedProductList.map(p => p.id),
      selectedBlendTitle: selectedBlend ? selectedBlend.title : undefined,
      notes: `Curated under ${activeBundleTab} tier. Spatia Design Score: ${designAssessment.scores.overallScore}%.${selectedBlend ? ` Calibrated AI Blend: ${selectedBlend.title}.` : ''}`
    });

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const bundleTabs: { id: BundleTier; label: string; desc: string; priceMultiplier: string }[] = [
    { id: 'Essentials', label: 'Essentials', desc: 'Precision durability, core architectural lines', priceMultiplier: 'Base' },
    { id: 'Balanced', label: 'Balanced', desc: 'Optimal marriage of luxury finishes and smart technology', priceMultiplier: 'Recommended' },
    { id: 'Signature', label: 'Signature', desc: 'Heirloom Calacatta marble, steam hydrotherapy, bridge gold', priceMultiplier: 'Flagship' }
  ];

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-12 animate-fade-in">
      
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b-2 border-stone/20 pb-6">
        <div>
          <button
            onClick={onBackToConfigurator}
            className="px-4.5 py-2.5 bg-band-2 border-2 border-stone/30 hover:border-accent text-xs sm:text-sm font-mono uppercase tracking-wider text-ink rounded-sm inline-flex items-center gap-2 mb-4 transition-all shadow-xs group font-bold cursor-pointer"
          >
            <ArrowLeft size={16} className="text-stone group-hover:text-accent group-hover:-translate-x-0.5 transition-transform" />
            <span>← Back to Step 2 (Fixtures & Clearances)</span>
          </button>
          <h1 className="font-serif text-xl sm:text-2xl lg:text-3xl text-ink font-bold tracking-tight">
            Spatial Model & Architectural Brief
          </h1>
          <p className="text-sm sm:text-base text-stone-dark mt-1.5 font-sans font-medium">
            Curated in <strong className="text-ink">{themeDef.name}</strong> ({themeDef.finishes}) · Room Envelope: <strong className="text-ink">{width}×{length} {unit} ({roomShape})</strong>
          </p>
        </div>

        {/* Export & Save Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleDownloadFullPdf}
            disabled={isGeneratingPdf}
            className="flex items-center gap-2.5 px-6 py-3.5 bg-ink hover:bg-accent text-porcelain text-xs sm:text-sm font-mono uppercase tracking-wider rounded-sm transition-all font-bold shadow-luxury group disabled:opacity-75 disabled:cursor-wait cursor-pointer"
          >
            <FileDown size={17} className={`text-accent transition-transform ${isGeneratingPdf ? 'animate-pulse' : 'group-hover:scale-110'}`} />
            <span>{isGeneratingPdf ? 'Preparing your report…' : 'Download 13-Page Design Report (PDF)'}</span>
          </button>

          <button
            onClick={handleSaveToDashboard}
            className={`flex items-center gap-2 px-6 py-3.5 text-xs sm:text-sm font-mono uppercase tracking-wider rounded-sm transition-all shadow-sm font-bold cursor-pointer ${
              isSaved
                ? 'bg-green-800 text-white'
                : 'bg-porcelain-warm hover:bg-stone/20 text-ink border-2 border-stone/30'
            }`}
          >
            {isSaved ? (
              <>
                <BookmarkCheck size={16} />
                <span>Saved to Dashboard</span>
              </>
            ) : (
              <>
                <Bookmark size={16} />
                <span>Save to Dashboard</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* SPATIA DESIGN SCORECARD (8 Factors) */}
      <div className="bg-white border-2 border-stone/25 rounded-sm shadow-editorial p-6 sm:p-8 space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-stone/20 pb-4">
          <div>
            <span className="text-xs sm:text-sm font-mono uppercase text-accent font-bold tracking-wider flex items-center gap-2">
              <Sparkles size={16} /> Spatia Design Scorecard
            </span>
            <h2 className="font-serif text-lg sm:text-xl font-bold text-ink mt-1">
              Deterministic Spatial & Performance Audit
            </h2>
          </div>
          <div className="flex items-center gap-3 bg-porcelain-warm px-5 py-2.5 rounded-sm border-2 border-stone/20">
            <span className="text-xs sm:text-sm font-mono text-stone-dark uppercase font-bold">Overall Score:</span>
            <span className="font-mono text-3xl font-bold text-accent">
              {designAssessment.scores.overallScore} / 100
            </span>
          </div>
        </div>

        {/* 8 Sub-score Progress Bars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {[
            { label: 'Spatial & Clearance', val: designAssessment.scores.spatialFit },
            { label: 'Budget Allocation', val: designAssessment.scores.budgetFit },
            { label: 'Aesthetic Compatibility', val: designAssessment.scores.styleCompatibility },
            { label: 'Hydraulic Fit', val: designAssessment.scores.plumbingCompatibility },
            { label: 'Water Efficiency', val: designAssessment.scores.waterEfficiency },
            { label: 'Functional Suitability', val: designAssessment.scores.functionalCompatibility },
            { label: 'Universal Accessibility', val: designAssessment.scores.accessibilityCompatibility },
            { label: 'Future Readiness', val: designAssessment.scores.futureReadiness }
          ].map((sc, i) => (
            <div key={i} className="p-3.5 bg-porcelain-warm/90 border border-stone/20 rounded-sm space-y-2">
              <div className="flex justify-between items-center text-xs sm:text-sm font-mono">
                <span className="text-stone-dark font-bold truncate max-w-[140px]">{sc.label}</span>
                <strong className="text-ink font-bold text-sm sm:text-base">{sc.val}%</strong>
              </div>
              <div className="w-full bg-stone/25 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-accent h-full rounded-full transition-all duration-700" 
                  style={{ width: `${sc.val}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Theme Blend Summary Card (Section 30) */}
      {selectedBlend && (
        <div className="bg-white border-2 border-stone/25 rounded-sm p-6 shadow-editorial flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="flex items-center gap-4.5">
            {selectedBlend.hasVisualPreview && selectedBlend.imageUrl ? (
              <div className="w-24 h-24 shrink-0 rounded-xs overflow-hidden border-2 border-stone/20 bg-band-2">
                <img
                  src={selectedBlend.imageUrl}
                  alt={selectedBlend.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            ) : (
              <div className="w-24 h-24 shrink-0 rounded-xs border-2 border-stone/20 bg-accent/15 flex items-center justify-center text-accent">
                <Sparkles size={28} />
              </div>
            )}
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs sm:text-sm font-mono uppercase tracking-widest text-accent font-bold">
                  AI Theme Blend
                </span>
                <span className="text-stone font-bold">·</span>
                <span className="text-xs sm:text-sm font-mono text-stone-dark font-medium">
                  AI-generated visualization — indicative representation
                </span>
              </div>
              <h3 className="font-serif text-2xl font-bold text-ink">
                {selectedBlend.title}
              </h3>
              <p className="font-serif italic text-base text-ink font-medium leading-relaxed">
                "{selectedBlend.oneSentenceDescription}"
              </p>
            </div>
          </div>
          <div className="px-4 py-2 bg-band-2 border border-stone/20 rounded-xs text-xs sm:text-sm font-mono text-ink shrink-0">
            <span className="text-stone-dark uppercase mr-1.5 font-bold">Calibrated Wall Finish:</span>
            <strong className="text-accent uppercase font-bold">{selectedBlend.designDirection.wallFinish}</strong>
          </div>
        </div>
      )}

      {/* 3 Bundle Tier Tabs (Essentials / Balanced / Signature) */}
      <div className="space-y-2.5">
        <span className="text-sm font-mono uppercase tracking-widest text-stone-dark block font-bold">
          Tier Calibration:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {bundleTabs.map(tab => {
            const active = activeBundleTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveBundleTab(tab.id)}
                className={`p-4.5 rounded-sm border-2 text-left transition-all cursor-pointer ${
                  active
                    ? 'border-accent bg-accent/10 ring-2 ring-accent/40 shadow-md'
                    : 'border-stone/25 bg-white hover:border-stone/45'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-serif text-lg font-bold text-ink">{tab.label}</span>
                  <span className="text-xs sm:text-sm font-mono text-accent uppercase font-bold bg-white px-2.5 py-0.5 rounded border border-stone/20">
                    {tab.priceMultiplier}
                  </span>
                </div>
                <p className="text-sm sm:text-base text-stone-dark mt-1.5 leading-relaxed font-sans font-medium">
                  {tab.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Spatial Model with Dark Inspector Panel */}
      <div className="space-y-4">
        {/* Section Header Row */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-8 h-[2px] bg-accent"></span>
              <span className="text-sm font-mono uppercase tracking-[0.2em] text-accent font-bold">
                Spatial Intelligence
              </span>
            </div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-ink">Spatial Model</h2>
          </div>
          <div className="flex items-center gap-3">
            {/* Segmented 2D/3D Toggle */}
            <div className="flex bg-[#2A2420] rounded-sm overflow-hidden">
              <button
                onClick={() => setActiveTabMode('3d')}
                className={`px-4 py-2 text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer ${
                  activeTabMode === '3d'
                    ? 'bg-accent text-white font-bold'
                    : 'text-[#C9BBA9] hover:text-[#FAF4EC] font-bold'
                }`}
              >
                3D View
              </button>
              <button
                onClick={() => setActiveTabMode('2d')}
                className={`px-4 py-2 text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer ${
                  activeTabMode === '2d'
                    ? 'bg-accent text-white font-bold'
                    : 'text-[#C9BBA9] hover:text-[#FAF4EC] font-bold'
                }`}
              >
                2D Plan
              </button>
            </div>
            {/* Download Spec Link */}
            <button
              onClick={handleDownloadFullPdf}
              disabled={isGeneratingPdf}
              className="text-sm font-mono uppercase tracking-wider text-accent hover:text-accent-hover font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <FileDown size={15} />
              <span>Download Spec</span>
            </button>
          </div>
        </div>

        {/* Two-Column: Canvas + Dark Inspector */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-0 border-2 border-stone/25 rounded-sm overflow-hidden shadow-luxury">
          {/* Left: Canvas */}
          <div className="bg-white min-h-[500px]">
            {activeTabMode === '3d' ? <RoomScene3D /> : <FloorPlan2D />}
          </div>

          {/* Right: Dark Inspector Sidebar */}
          <div className="bg-[#2A2420] text-[#FAF4EC] p-6 space-y-6 border-l border-[#4A423B]">
            {/* Top Label */}
            <div className="text-xs font-mono uppercase tracking-[0.25em] text-[#C9BBA9] font-bold">
              Design Logic
            </div>

            {/* Spatia Design Score with SVG Ring */}
            <div className="flex flex-col items-center gap-3 pb-5 border-b border-[#4A423B]">
              <div className="relative w-28 h-28">
                <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                  {/* Background ring */}
                  <circle cx="60" cy="60" r="52" fill="none" stroke="#4A423B" strokeWidth="8" />
                  {/* Score ring */}
                  <circle 
                    cx="60" cy="60" r="52" 
                    fill="none" 
                    stroke="#AE8A4E" 
                    strokeWidth="8" 
                    strokeLinecap="round"
                    strokeDasharray={`${(designAssessment.scores.overallScore / 100) * 2 * Math.PI * 52} ${2 * Math.PI * 52}`}
                    className="transition-all duration-700"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-mono text-3xl font-bold text-[#FAF4EC]">{designAssessment.scores.overallScore}</span>
                  <span className="text-[10px] font-mono text-[#C9BBA9] uppercase tracking-wider">/ 100</span>
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm font-mono font-bold text-[#FAF4EC]">Spatia Design Score</div>
                <div className="text-xs font-mono text-[#C9BBA9] mt-0.5">{designAssessment.confidenceScore}% confidence</div>
              </div>
            </div>

            {/* Layout Selector */}
            <div className="space-y-2.5 pb-5 border-b border-[#4A423B]">
              <div className="text-xs font-mono uppercase tracking-wider text-[#C9BBA9] font-bold">Layout</div>
              <div className="flex gap-2">
                {(['linear', 'l-shaped', 'parallel'] as const).map(layout => (
                  <button
                    key={layout}
                    onClick={() => setSelectedLayout(layout as any)}
                    className={`flex-1 px-2 py-2 text-[11px] font-mono uppercase tracking-wider rounded-sm transition-colors cursor-pointer ${
                      selectedLayout === layout
                        ? 'bg-accent text-white font-bold'
                        : 'bg-[#3A342E] text-[#C9BBA9] hover:text-[#FAF4EC] font-bold border border-[#4A423B]'
                    }`}
                  >
                    {layout === 'l-shaped' ? 'L-Shape' : layout.charAt(0).toUpperCase() + layout.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Wall Finish Dropdown */}
            <div className="space-y-2.5 pb-5 border-b border-[#4A423B]">
              <div className="text-xs font-mono uppercase tracking-wider text-[#C9BBA9] font-bold">Wall Finish</div>
              <select
                value={wallFinish}
                onChange={(e) => setWallFinish(e.target.value)}
                className="w-full bg-[#3A342E] text-[#FAF4EC] border border-[#4A423B] rounded-sm px-3 py-2.5 text-sm font-mono font-medium cursor-pointer focus:outline-none focus:border-accent appearance-none"
              >
                {WALL_FINISHES.map(wf => (
                  <option key={wf.id} value={wf.id}>{wf.name}</option>
                ))}
              </select>
            </div>

            {/* Water & Energy Stats */}
            <div className="space-y-3">
              <div className="text-xs font-mono uppercase tracking-wider text-[#C9BBA9] font-bold">Water & Energy Footprint</div>
              <div className="space-y-2.5">
                <div className="flex items-center justify-between p-3 bg-[#332E29] rounded-sm border border-[#4A423B]">
                  <div className="flex items-center gap-2">
                    <Droplets size={15} className="text-blue-400" />
                    <span className="text-xs font-mono text-[#C9BBA9]">Water Saved</span>
                  </div>
                  <span className="font-mono text-sm font-bold text-[#FAF4EC]">
                    {sustainabilityData.metrics.annualWaterSavingsLitres.toLocaleString('en-IN')} L/yr
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-[#332E29] rounded-sm border border-[#4A423B]">
                  <div className="flex items-center gap-2">
                    <Zap size={15} className="text-amber-400" />
                    <span className="text-xs font-mono text-[#C9BBA9]">Energy Saved</span>
                  </div>
                  <span className="font-mono text-sm font-bold text-[#FAF4EC]">
                    {sustainabilityData.metrics.annualEnergySavingsKwh} kWh/yr
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SUSTAINABILITY DASHBOARD WITH LUXURY SVG CHARTS */}
      <div className="bg-white border border-stone/20 rounded-sm shadow-editorial p-6 sm:p-8 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone/15 pb-4">
          <div>
            <div className="flex items-center gap-2 text-green-700 font-mono text-xs uppercase tracking-wider font-semibold">
              <Droplets size={16} />
              <span>Environmental & Hydro-Efficiency Intelligence</span>
            </div>
            <h3 className="font-serif text-2xl font-semibold text-ink mt-0.5">
              Eco-Footprint & Utility Life-Cycle Analysis
            </h3>
          </div>
          <span className="text-xs font-mono bg-green-50 text-green-800 border border-green-200 px-3 py-1 rounded-sm font-semibold">
            {sustainabilityData.metrics.waterSavingsPercentage}% Water Reduction
          </span>
        </div>

        {/* 4 Green Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'ANNUAL WATER SAVED', val: `${sustainabilityData.metrics.annualWaterSavingsLitres.toLocaleString('en-IN')} L`, sub: `Vs ${sustainabilityData.metrics.baselineWaterConsumptionLitres.toLocaleString('en-IN')} L baseline` },
            { label: 'HOT WATER ENERGY SAVED', val: `${sustainabilityData.metrics.annualEnergySavingsKwh} kWh`, sub: 'Water heating power reduction' },
            { label: 'CO2 CARBON OFFSET', val: `${sustainabilityData.metrics.annualCarbonOffsetKgCo2} kg`, sub: 'Annual grid emissions avoided' },
            { label: 'ANNUAL UTILITY SAVINGS', val: `₹${sustainabilityData.metrics.annualUtilitySavingsInr.toLocaleString('en-IN')}`, sub: 'Combined water & electric tariff' }
          ].map((gm, i) => (
            <div key={i} className="p-4 bg-porcelain-warm border border-stone/20 rounded-sm space-y-1">
              <span className="text-xs font-mono text-stone-dark uppercase tracking-wider block font-semibold">{gm.label}</span>
              <div className="font-mono text-2xl font-bold text-ink">{gm.val}</div>
              <span className="text-xs font-mono text-stone-dark block">{gm.sub}</span>
            </div>
          ))}
        </div>

        {/* 2 Custom Luxury SVG Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
          
          {/* GRAPH 1: Water Efficiency vs. Cost Scatter */}
          <div className="p-5 bg-porcelain-warm/60 border border-stone/20 rounded-sm space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-serif text-base font-semibold text-ink">
                  Graph 1: Water Efficiency vs. Cost
                </h4>
                <p className="text-xs text-stone-dark mt-0.5">
                  Tier benchmarks vs. your curated selection. Lower annual draw = higher conservation.
                </p>
              </div>
              <span className="text-xs font-mono text-accent bg-accent/10 px-2 py-0.5 rounded uppercase font-semibold">
                4-Point Benchmark
              </span>
            </div>

            {/* Custom SVG Scatter */}
            <div className="w-full aspect-[16/9] bg-white border border-stone/15 rounded-sm p-3 relative flex items-center justify-center shadow-xs">
              <svg viewBox="0 0 420 220" className="w-full h-full select-none">
                {/* Background Grid */}
                <line x1="50" y1="35" x2="390" y2="35" stroke="#E2DCD2" strokeWidth="0.8" strokeDasharray="3 3" />
                <line x1="50" y1="85" x2="390" y2="85" stroke="#E2DCD2" strokeWidth="0.8" strokeDasharray="3 3" />
                <line x1="50" y1="135" x2="390" y2="135" stroke="#E2DCD2" strokeWidth="0.8" strokeDasharray="3 3" />
                <line x1="50" y1="185" x2="390" y2="185" stroke="#2A2420" strokeWidth="1.2" />
                <line x1="50" y1="20" x2="50" y2="185" stroke="#2A2420" strokeWidth="1.2" />

                {/* Y-axis Labels */}
                <text x="44" y="38" fill="#8C8474" fontSize="8" textAnchor="end" fontFamily="monospace">10k L</text>
                <text x="44" y="88" fill="#8C8474" fontSize="8" textAnchor="end" fontFamily="monospace">14k L</text>
                <text x="44" y="138" fill="#8C8474" fontSize="8" textAnchor="end" fontFamily="monospace">18k L</text>
                <text x="44" y="188" fill="#8C8474" fontSize="8" textAnchor="end" fontFamily="monospace">22k L</text>

                {/* X-axis Labels */}
                <text x="100" y="202" fill="#8C8474" fontSize="8" textAnchor="middle" fontFamily="monospace">₹1.5L</text>
                <text x="220" y="202" fill="#8C8474" fontSize="8" textAnchor="middle" fontFamily="monospace">₹3.0L</text>
                <text x="350" y="202" fill="#8C8474" fontSize="8" textAnchor="middle" fontFamily="monospace">₹5.0L</text>

                {/* 4 Data Points */}
                {sustainabilityData.graph1ScatterData.map((pt) => {
                  // Map cost (₹100,000 to ₹550,000) to X (75 to 370)
                  const cx = Math.min(370, Math.max(75, 75 + ((pt.cost - 100000) / 450000) * 295));
                  // Map annualLitres (22,000 down to 10,000) to Y (185 up to 35)
                  const cy = Math.min(175, Math.max(35, 185 - ((22000 - pt.annualLitres) / 12000) * 150));

                  const isCurrent = pt.isCurrent;
                  const labelYOffset = isCurrent ? 24 : -12;

                  return (
                    <g key={pt.id} className="transition-all">
                      {/* Pulsing ring for Current Selection */}
                      {isCurrent && (
                        <>
                          <circle cx={cx} cy={cy} r="14" fill="none" stroke="#AE8A4E" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.8">
                            <animate attributeName="r" values="12;16;12" dur="2.5s" repeatCount="indefinite" />
                            <animate attributeName="opacity" values="0.8;0.3;0.8" dur="2.5s" repeatCount="indefinite" />
                          </circle>
                          <line x1={cx} y1={cy + 8} x2={cx} y2={cy + 18} stroke="#AE8A4E" strokeWidth="1" />
                        </>
                      )}

                      {/* Point marker */}
                      <circle
                        cx={cx}
                        cy={cy}
                        r={isCurrent ? 7 : 5.5}
                        fill={isCurrent ? '#AE8A4E' : '#2A2420'}
                        stroke="#FFFFFF"
                        strokeWidth="2"
                        className="shadow-sm"
                      />

                      {/* Pill Badge Container */}
                      <g transform={`translate(${cx}, ${cy + labelYOffset})`}>
                        <rect
                          x="-58"
                          y="-10"
                          width="116"
                          height="18"
                          rx="3"
                          fill={isCurrent ? '#2A2420' : '#F3DFD2'}
                          stroke={isCurrent ? '#AE8A4E' : '#D8D0C3'}
                          strokeWidth="0.8"
                        />
                        <text
                          x="0"
                          y="2"
                          fill={isCurrent ? '#FAEFF1' : '#2A2420'}
                          fontSize="7"
                          textAnchor="middle"
                          fontFamily="monospace"
                          fontWeight={isCurrent ? '700' : '500'}
                        >
                          {pt.name}: {pt.valueBadge.split(' • ')[0]}
                        </text>
                      </g>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* GRAPH 2: Luxury vs Cost vs Water Savings Bubble Chart */}
          <div className="p-5 bg-porcelain-warm/60 border border-stone/20 rounded-sm space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-serif text-base font-semibold text-ink">
                  Graph 2: Luxury / Cost / Eco Bubble Trade-off
                </h4>
                <p className="text-xs text-stone-dark mt-0.5">
                  Y-axis: Luxury Index · X-axis: Investment · Bubble Size: % Water Preserved.
                </p>
              </div>
              <span className="text-[10px] font-mono text-accent bg-accent/10 px-2 py-0.5 rounded uppercase font-semibold">
                Multi-Dimensional
              </span>
            </div>

            {/* Custom SVG Bubble Chart */}
            <div className="w-full aspect-[16/9] bg-white border border-stone/15 rounded-sm p-3 relative flex items-center justify-center shadow-xs">
              <svg viewBox="0 0 420 220" className="w-full h-full select-none">
                {/* Background Grid */}
                <line x1="50" y1="35" x2="390" y2="35" stroke="#E2DCD2" strokeWidth="0.8" strokeDasharray="3 3" />
                <line x1="50" y1="85" x2="390" y2="85" stroke="#E2DCD2" strokeWidth="0.8" strokeDasharray="3 3" />
                <line x1="50" y1="135" x2="390" y2="135" stroke="#E2DCD2" strokeWidth="0.8" strokeDasharray="3 3" />
                <line x1="50" y1="185" x2="390" y2="185" stroke="#2A2420" strokeWidth="1.2" />
                <line x1="50" y1="20" x2="50" y2="185" stroke="#2A2420" strokeWidth="1.2" />

                {/* Y-axis Labels */}
                <text x="44" y="38" fill="#8C8474" fontSize="8" textAnchor="end" fontFamily="monospace">100 Lux</text>
                <text x="44" y="88" fill="#8C8474" fontSize="8" textAnchor="end" fontFamily="monospace">85 Lux</text>
                <text x="44" y="138" fill="#8C8474" fontSize="8" textAnchor="end" fontFamily="monospace">70 Lux</text>

                {/* X-axis Labels */}
                <text x="100" y="202" fill="#8C8474" fontSize="8" textAnchor="middle" fontFamily="monospace">₹1.5L</text>
                <text x="220" y="202" fill="#8C8474" fontSize="8" textAnchor="middle" fontFamily="monospace">₹3.0L</text>
                <text x="350" y="202" fill="#8C8474" fontSize="8" textAnchor="middle" fontFamily="monospace">₹5.0L</text>

                {/* 4 Bubble Data Points */}
                {sustainabilityData.graph2BubbleData.map((b) => {
                  // Map cost to X
                  const cx = Math.min(365, Math.max(80, 80 + ((b.cost - 100000) / 450000) * 285));
                  // Map luxuryScore (60 to 100) to Y (175 up to 35)
                  const cy = Math.min(170, Math.max(35, 175 - ((b.luxuryScore - 60) / 40) * 140));
                  // Bubble radius proportional to water savings (15 to 26 px)
                  const radius = Math.max(14, Math.min(26, 12 + (b.waterSavingsPercent / 100) * 24));
                  const isCurrent = b.isCurrent;

                  return (
                    <g key={b.id} className="transition-all">
                      {/* Bubble halo */}
                      <circle
                        cx={cx}
                        cy={cy}
                        r={radius}
                        fill={isCurrent ? '#AE8A4E' : '#D8D0C3'}
                        fillOpacity={isCurrent ? 0.35 : 0.25}
                        stroke={isCurrent ? '#AE8A4E' : '#8C8474'}
                        strokeWidth={isCurrent ? 2 : 1}
                      />

                      {/* Current pulse indicator */}
                      {isCurrent && (
                        <circle
                          cx={cx}
                          cy={cy}
                          r={radius + 6}
                          fill="none"
                          stroke="#AE8A4E"
                          strokeWidth="1"
                          strokeDasharray="2 2"
                          opacity="0.7"
                        />
                      )}

                      {/* Center pip */}
                      <circle cx={cx} cy={cy} r="2.5" fill="#2A2420" />

                      {/* Clean Badge Callout */}
                      <g transform={`translate(${cx}, ${cy - radius - 10})`}>
                        <rect
                          x="-54"
                          y="-9"
                          width="108"
                          height="16"
                          rx="3"
                          fill={isCurrent ? '#2A2420' : '#FAEFF1'}
                          stroke={isCurrent ? '#AE8A4E' : '#D8D0C3'}
                          strokeWidth="0.8"
                        />
                        <text
                          x="0"
                          y="2"
                          fill={isCurrent ? '#FAEFF1' : '#2A2420'}
                          fontSize="7"
                          textAnchor="middle"
                          fontFamily="monospace"
                          fontWeight={isCurrent ? '700' : '500'}
                        >
                          {b.name} ({b.waterSavingsPercent}% Eco)
                        </text>
                      </g>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

        </div>

        {/* Baseline vs AI Table */}
        <div className="space-y-3 pt-2">
          <h4 className="font-serif text-base font-semibold text-ink">
            Baseline Builder Grade vs. Spatia AI Fixture Schedule
          </h4>
          <div className="divide-y divide-stone/15 border border-stone/20 rounded-sm overflow-hidden text-xs">
            <div className="grid grid-cols-12 bg-porcelain-warm font-mono uppercase text-stone-dark text-xs p-3 font-semibold">
              <div className="col-span-3">Category</div>
              <div className="col-span-4">Builder Baseline</div>
              <div className="col-span-3">Spatia Specification</div>
              <div className="col-span-2 text-right">Savings</div>
            </div>
            {sustainabilityData.comparisonTable.map((row, idx) => (
              <div key={idx} className="grid grid-cols-12 p-3.5 bg-white items-center gap-2">
                <div className="col-span-3 font-serif font-semibold text-ink text-sm">{row.fixtureCategory}</div>
                <div className="col-span-4 text-stone-dark font-mono text-xs">{row.baselineSpec} ({row.baselineFlow})</div>
                <div className="col-span-3 text-ink font-mono text-xs font-semibold">{row.spatiaSpec} ({row.spatiaFlow})</div>
                <div className="col-span-2 text-right font-mono font-bold text-green-700 text-sm">-{row.savingsPercent}%</div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Exact Measurements & Line-Item Cost Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Exact Measurements Specifications */}
        <div className="lg:col-span-1 bg-white border border-stone/20 rounded-sm p-6 space-y-5 shadow-editorial">
          <div className="flex items-center gap-2 border-b border-stone/15 pb-3">
            <Ruler size={17} className="text-accent" />
            <h3 className="font-serif text-lg font-semibold text-ink">
              Exact Spatial Measurements
            </h3>
          </div>

          {/* Room Overall */}
          <div className="p-3.5 bg-porcelain-warm rounded-sm border border-stone/15 space-y-1 text-xs font-mono">
            <div className="text-stone-dark font-medium">Overall Room Envelope</div>
            <div className="text-ink font-bold text-base">
              {width} × {length} × {height} {unit} ({Math.round(width * (unit === 'ft' ? 304.8 : unit === 'm' ? 1000 : 10))} × {Math.round(length * (unit === 'ft' ? 304.8 : unit === 'm' ? 1000 : 10))} × {Math.round(height * (unit === 'ft' ? 304.8 : unit === 'm' ? 1000 : 10))} mm)
            </div>
            <div className="text-xs text-stone-dark">Shape: {roomShape.toUpperCase()} · Height: {Math.round(height * (unit === 'ft' ? 304.8 : unit === 'm' ? 1000 : 10))}mm ({height} {unit})</div>
          </div>

          {/* Individual Fixture Dimensions */}
          <div className="space-y-3 pt-1">
            <span className="text-xs font-mono uppercase tracking-wider text-stone-dark block font-semibold">
              Fixture Physical Bounds (W × D × H mm)
            </span>
            <div className="space-y-2.5">
              {selectedProductList.map(prod => (
                <div key={prod.id} className="flex items-center justify-between text-xs border-b border-stone/10 pb-2">
                  <div>
                    <div className="font-serif font-medium text-ink truncate max-w-[170px] text-sm">{prod.name}</div>
                    <span className="text-xs font-mono text-stone-dark capitalize">{prod.category}</span>
                  </div>
                  <span className="font-mono text-stone-dark font-semibold">
                    {prod.dimensions.widthMm} × {prod.dimensions.depthMm} × {prod.dimensions.heightMm}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Line-Item Cost Breakdown (Spans 2 cols) */}
        <div className="lg:col-span-2 bg-white border border-stone/20 rounded-sm p-6 space-y-5 shadow-editorial flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-stone/15 pb-3">
              <div className="flex items-center gap-2">
                <DollarSign size={18} className="text-accent" />
                <h3 className="font-serif text-lg font-semibold text-ink">
                  Line-Item Fixture Investment Breakdown
                </h3>
              </div>
              <span className="text-xs font-mono text-stone-dark font-medium">
                {selectedProductList.length} Scheduled Items
              </span>
            </div>

            {/* Table of Items */}
            <div className="divide-y divide-stone/15 pt-2">
              {selectedProductList.map(prod => (
                <div key={prod.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-serif text-sm sm:text-base font-semibold text-ink truncate">
                        {prod.name}
                      </h4>
                      <span className="text-xs font-mono uppercase bg-porcelain-warm px-2 py-0.5 rounded text-stone-dark font-semibold">
                        {prod.tier}
                      </span>
                    </div>
                    <div className="text-xs font-mono text-stone-dark truncate mt-0.5">
                      {prod.finishName} ({prod.finishCode})
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="font-mono text-sm sm:text-base font-bold text-ink">
                      {formatPrice(prod.price)}
                    </div>
                    <div className="text-xs font-mono text-stone-dark">
                      Lead time: {prod.leadTimeWeeks} wks
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Totals Summary */}
          <div className="pt-4 border-t border-stone/20 space-y-2 font-mono text-xs">
            <div className="flex justify-between text-stone-dark">
              <span>Gross Fixture Investment</span>
              <span>{formatPrice(manualTotalCost)}</span>
            </div>
            <div className="flex justify-between text-stone-dark">
              <span>Architectural Finish Calibration & Freight</span>
              <span className="text-accent font-semibold">Included</span>
            </div>
            <div className="flex justify-between text-base font-bold text-ink pt-2 border-t border-stone/20">
              <span>Total Estimated Investment</span>
              <span className="text-accent text-lg">{formatPrice(manualTotalCost)}</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
