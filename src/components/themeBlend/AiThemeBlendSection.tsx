import React, { useState } from 'react';
import { ArrowRight, Sparkles, RefreshCw, AlertCircle } from 'lucide-react';
import { useConfigurator } from '../../context/ConfiguratorContext';
import { ASSET_MAP } from '../../data/assets';
import { ThemeId } from '../../data/themes';
import { getThemeBlend, ThemeBlend } from '../../data/themeBlends';

interface AiThemeBlendSectionProps {
  onStartDesigning: () => void;
}

export const AiThemeBlendSection: React.FC<AiThemeBlendSectionProps> = ({ onStartDesigning }) => {
  const { applyThemeBlend } = useConfigurator();

  // Selection state: array of up to 2 theme IDs
  const [selectedThemeIds, setSelectedThemeIds] = useState<ThemeId[]>([]);
  const [selectionWarning, setSelectionWarning] = useState<string | null>(null);

  // Workflow states
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeBlend, setActiveBlend] = useState<ThemeBlend | null>(null);
  const [imageLoadError, setImageLoadError] = useState(false);

  // 5 Canonical C16 Theme Worlds matching exact approved homepage swatches
  const themeSwatches = [
    {
      id: 'nature-retreat' as ThemeId,
      name: 'Nature Retreat',
      tagline: 'Biophilic Spa Sanctuary',
      finishes: 'Brushed Bronze · Fluted Hinoki · Basalt',
      image: ASSET_MAP.themes['nature-retreat'],
      accentColor: '#4A6B52',
      tone: 'Restorative organic warmth and calm'
    },
    {
      id: 'minimalist-modern' as ThemeId,
      name: 'Modern Minimalist',
      tagline: 'Pure Monolithic Clarity',
      finishes: 'Polished Chrome · Stucco · Microcement',
      image: ASSET_MAP.themes['minimalist-modern'],
      accentColor: '#6E7E91',
      tone: 'Monochrome precision and crisp light'
    },
    {
      id: 'luxury-escape' as ThemeId,
      name: 'Luxury Escape',
      tagline: 'Heirloom French Gold',
      finishes: 'Vibrant French Gold · Calacatta · Marquina',
      image: ASSET_MAP.themes['luxury-escape'],
      accentColor: '#AE8A4E',
      tone: 'Opulent Calacatta and warm amber glow'
    },
    {
      id: 'coastal-breeze' as ThemeId,
      name: 'Coastal Breeze',
      tagline: 'Airy Seaside Fluidity',
      finishes: 'Brushed Nickel · Bleached Oak · Zellige',
      image: ASSET_MAP.themes['coastal-breeze'],
      accentColor: '#5B8A99',
      tone: 'Breezy driftwood and seafoam lightness'
    },
    {
      id: 'urban-chic' as ThemeId,
      name: 'Urban Chic',
      tagline: 'Loft Terracotta & Steel',
      finishes: 'Matte Black · Fluted Clay · Raw Terrazzo',
      image: ASSET_MAP.themes['urban-chic'],
      accentColor: '#9C5843',
      tone: 'Tactile earthiness and industrial silhouette'
    }
  ];

  // Handle card click / keyboard toggle
  const handleToggleTheme = (themeId: ThemeId) => {
    setSelectionWarning(null);

    // If already selected, deselect it
    if (selectedThemeIds.includes(themeId)) {
      setSelectedThemeIds(prev => prev.filter(id => id !== themeId));
      return;
    }

    // If 2 already selected, do not silently replace; show warning banner
    if (selectedThemeIds.length >= 2) {
      setSelectionWarning("Choose one of your selected styles to replace it.");
      return;
    }

    // Select theme
    setSelectedThemeIds(prev => [...prev, themeId]);
  };

  // Generate blend
  const handleCreateBlend = () => {
    if (selectedThemeIds.length !== 2) return;
    setIsGenerating(true);
    setImageLoadError(false);

    // Subtle luxury transition (700ms)
    setTimeout(() => {
      const blend = getThemeBlend(selectedThemeIds[0], selectedThemeIds[1]);
      setActiveBlend(blend);
      setIsGenerating(false);
    }, 700);
  };

  // Reset to selection state in-place
  const handleTryAnotherBlend = () => {
    setActiveBlend(null);
    setImageLoadError(false);
    setSelectionWarning(null);
  };

  // Apply blend and proceed into configurator
  const handleUseThisDesign = () => {
    if (!activeBlend) return;
    applyThemeBlend(activeBlend);
    onStartDesigning();
  };

  return (
    <section 
      aria-label="Atmospheric Finish Calibration"
      className="relative bg-[#2A2420] py-14 sm:py-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* SECTION HEADER: Approved Exact Copy */}
        <div className="border-b border-[#4A423B] pb-4 flex flex-col md:flex-row md:items-baseline justify-between gap-3">
          <div>
            <div className="w-9 h-9 rounded-sm border border-[#4A423B] bg-[#332E29] flex items-center justify-center text-accent mb-2.5">
              <Sparkles size={16} />
            </div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-8 h-[2px] bg-accent" aria-hidden="true"></span>
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-accent font-bold">
                Tactile Materiality
              </span>
            </div>
            <h2 className="font-serif text-lg sm:text-xl lg:text-2xl font-bold text-[#FAF4EC]">
              When one direction isn't quite enough.
            </h2>
            <p className="font-serif italic text-sm sm:text-base text-[#FAF4EC] font-semibold mt-0.5">
              Two styles. One new world.
            </p>
          </div>
          <p className="text-xs sm:text-sm font-mono font-medium text-[#C9BBA9] max-w-md md:text-right leading-relaxed">
            Pick any two themes you love, and Spatia will blend them into a completely new design made for you.
          </p>
        </div>

        {/* SELECTION LIMIT NOTIFICATION */}
        {selectionWarning && (
          <div 
            role="alert"
            className="p-4 bg-accent/20 border-2 border-accent/50 rounded-sm text-sm font-mono text-[#FAF4EC] font-semibold flex items-center justify-between animate-fade-in"
          >
            <div className="flex items-center gap-2.5">
              <AlertCircle size={18} className="text-accent shrink-0" />
              <span>{selectionWarning}</span>
            </div>
            <button 
              onClick={() => setSelectionWarning(null)}
              className="text-xs uppercase font-bold text-accent hover:underline ml-4 cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* LOADING STATE: Minimal Luxury Processing */}
        {isGenerating && (
          <div className="bg-[#332E29] border border-[#4A423B] rounded-sm p-12 sm:p-16 text-center space-y-4 shadow-editorial animate-fade-in">
            <div className="w-14 h-14 mx-auto rounded-full bg-accent/15 flex items-center justify-center text-accent">
              <Sparkles size={26} className="animate-spin" style={{ animationDuration: '3s' }} />
            </div>
            <div className="space-y-1.5">
              <span className="text-xs font-mono uppercase tracking-widest text-accent font-bold block">
                Creating Your Blend
              </span>
              <p className="font-serif text-lg sm:text-xl text-[#FAF4EC] font-bold">
                "Bringing your two styles together..."
              </p>
            </div>
          </div>
        )}

        {/* BLEND RESULT VIEW (When Blend is Generated) */}
        {!isGenerating && activeBlend && (
          <div className="bg-[#332E29] border border-[#4A423B] rounded-sm overflow-hidden shadow-luxury animate-fade-in space-y-6 p-6 sm:p-8">
            {/* Hero Visual Presentation (Strictly On-Demand, Text Never Inside Image) */}
            <div className="space-y-2">
              {activeBlend.hasVisualPreview && !imageLoadError && activeBlend.imageUrl ? (
                <div className="aspect-[16/9] sm:aspect-[21/9] w-full relative overflow-hidden rounded-sm bg-band-2 border border-[#4A423B]">
                  <img
                    src={activeBlend.imageUrl}
                    alt={activeBlend.title}
                    loading="lazy"
                    decoding="async"
                    onError={() => setImageLoadError(true)}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-3 right-3 px-3 py-1.5 bg-ink/85 backdrop-blur-xs text-porcelain text-xs font-mono uppercase tracking-wider font-semibold rounded-xs">
                    AI-generated visualization — indicative representation
                  </div>
                </div>
              ) : !activeBlend.hasVisualPreview ? (
                /* State 1: Pair has no locked URL yet (Crafting State - Not an Error) */
                <div className="aspect-[16/9] sm:aspect-[21/9] w-full rounded-sm bg-porcelain-warm border border-[#4A423B] p-8 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                    <Sparkles size={26} />
                  </div>
                  <div className="space-y-1.5 max-w-lg">
                    <span className="text-xs font-mono uppercase tracking-widest text-accent font-bold block">
                      Curated Direction Ready
                    </span>
                    <p className="font-serif text-xl sm:text-2xl text-[#FAF4EC] font-bold">
                      This blend's visual preview is still being crafted — continue with the design direction below.
                    </p>
                    <p className="text-sm text-[#C9BBA9] font-mono font-medium">
                      All material palettes, fixture character, and spatial rules are calibrated.
                    </p>
                  </div>
                </div>
              ) : (
                /* State 2: URL exists but failed to load at runtime (Actual Network Error) */
                <div className="aspect-[16/9] sm:aspect-[21/9] w-full rounded-sm bg-stone/5 border border-[#4A423B] p-8 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-stone/20 flex items-center justify-center text-[#C9BBA9]">
                    <AlertCircle size={26} />
                  </div>
                  <div className="space-y-1.5 max-w-md">
                    <p className="font-serif text-xl text-[#FAF4EC] font-bold">
                      Your blend is ready, but its visual preview couldn't be loaded.
                    </p>
                    <p className="text-sm text-[#C9BBA9] font-mono font-medium">
                      Check network connectivity or continue directly with this calibrated design.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    <button
                      onClick={() => setImageLoadError(false)}
                      className="px-5 py-2.5 border-2 border-[#4A423B] text-[#FAF4EC] hover:bg-stone/10 font-mono text-sm uppercase tracking-wider font-bold rounded-xs flex items-center gap-2 cursor-pointer"
                    >
                      <RefreshCw size={14} /> Try Again
                    </button>
                    <button
                      onClick={handleUseThisDesign}
                      className="px-6 py-2.5 bg-ink text-porcelain hover:bg-accent font-mono text-sm uppercase tracking-wider font-bold rounded-xs cursor-pointer shadow-md"
                    >
                      Continue With This Design
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Typography & Design Direction (Rendered strictly as clean HTML/UI text) */}
            <div className="border-t border-[#4A423B] pt-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2.5 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono uppercase tracking-[0.25em] text-accent font-bold">
                    Theme Blend
                  </span>
                  <span className="text-[#FAF4EC] font-bold">·</span>
                  <span className="text-xs font-mono text-[#FAF4EC] uppercase font-bold">
                    Calibrated Synthesis
                  </span>
                </div>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#FAF4EC]">
                  {activeBlend.title}
                </h3>
                <p className="font-serif italic text-base sm:text-lg text-[#FAF4EC] font-medium leading-relaxed">
                  "{activeBlend.oneSentenceDescription}"
                </p>
              </div>

              {/* Action Buttons: Dominant Primary CTA and In-Place Secondary */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 shrink-0">
                <button
                  onClick={handleTryAnotherBlend}
                  className="px-8 py-4 border-2 border-[#4A423B] text-[#FAF4EC] hover:bg-stone/10 font-mono text-sm tracking-widest uppercase font-bold rounded-sm transition-colors cursor-pointer text-center"
                >
                  Try Another Blend
                </button>
                <button
                  onClick={handleUseThisDesign}
                  className="px-9 py-4 bg-ink text-porcelain hover:bg-accent font-mono text-sm tracking-widest uppercase font-bold rounded-sm transition-all shadow-luxury hover:shadow-2xl cursor-pointer flex items-center justify-center gap-2.5"
                >
                  <span>Use This Design</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 5 CANONICAL C16 THEME CARDS (Exact Approved Markup & Styling) */}
        {!activeBlend && !isGenerating && (
          <div className="space-y-6">
            <div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4.5"
              role="group"
              aria-label="Select two styles to blend"
            >
              {themeSwatches.map((swatch) => {
                const selectionIndex = selectedThemeIds.indexOf(swatch.id);
                const isSelected = selectionIndex !== -1;

                return (
                  <div
                    key={swatch.id}
                    role="button"
                    tabIndex={0}
                    aria-pressed={isSelected}
                    aria-label={`${swatch.name} style, ${isSelected ? `selected as number ${selectionIndex + 1}` : 'not selected'}`}
                    onClick={() => handleToggleTheme(swatch.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleToggleTheme(swatch.id);
                      }
                    }}
                    className={`group cursor-pointer bg-[#332E29] border-2 rounded-sm overflow-hidden motion-safe:transition-all motion-safe:duration-300 flex flex-col justify-between focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent ${
                      isSelected
                        ? 'border-accent ring-2 ring-accent/40 shadow-luxury scale-[1.02]'
                        : 'border-[#4A423B] hover:border-[#5A524B] hover:shadow-lg'
                    }`}
                  >
                    <div className="aspect-[3/4] w-full relative overflow-hidden bg-band-2">
                      <img
                        src={swatch.image}
                        alt={swatch.name}
                        className="w-full h-full object-cover group-hover:scale-105 motion-safe:transition-transform motion-safe:duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent pointer-events-none"></div>

                      {/* Numeric Selection Badge (1 or 2) */}
                      {isSelected && (
                        <div 
                          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-accent text-white font-mono font-bold text-sm flex items-center justify-center shadow-lg select-none"
                          aria-hidden="true"
                        >
                          {selectionIndex + 1}
                        </div>
                      )}

                      <div className="absolute bottom-2.5 left-2.5 right-2.5 text-porcelain pointer-events-none">
                        <span 
                          className="inline-block w-2.5 h-2.5 rounded-full border border-white mb-1 shadow-xs" 
                          style={{ backgroundColor: swatch.accentColor }} 
                        />
                        <h3 className="font-serif text-sm sm:text-base font-bold leading-tight drop-shadow-md">{swatch.name}</h3>
                      </div>
                    </div>

                    <div className="p-3 space-y-1.5">
                      <div className="font-serif text-xs sm:text-sm font-bold text-accent leading-snug">
                        {swatch.tagline}
                      </div>
                      <p className="text-[11px] sm:text-xs font-semibold text-[#C9BBA9] leading-snug line-clamp-2">
                        {swatch.finishes}
                      </p>
                      <div className="pt-2 text-xs font-mono border-t border-[#4A423B] flex items-center justify-between font-bold">
                        <span className={isSelected ? 'text-accent font-bold' : 'text-[#FAF4EC] font-bold'}>
                          {isSelected ? `Selected #${selectionIndex + 1}` : 'Select Style'}
                        </span>
                        <ArrowRight size={13} className="group-hover:translate-x-1 motion-safe:transition-transform text-[#FAF4EC] group-hover:text-accent" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CTA BAR: Disabled until exactly two themes are selected */}
            <div className="p-4 sm:p-5 bg-[#3A342E] border-2 border-[#4A423B] rounded-sm flex flex-col sm:flex-row items-center justify-between gap-3 shadow-editorial">
              <div className="text-xs sm:text-sm font-mono font-medium text-[#C9BBA9]">
                {selectedThemeIds.length === 0 && (
                  <span>Select any two styles to calibrate your custom atmospheric blend.</span>
                )}
                {selectedThemeIds.length === 1 && (
                  <span>1 of 2 selected: <strong className="text-[#FAF4EC] font-bold">{themeSwatches.find(s => s.id === selectedThemeIds[0])?.name}</strong>. Pick 1 more style.</span>
                )}
                {selectedThemeIds.length === 2 && (
                  <span className="text-accent font-bold">
                    Ready to blend: {themeSwatches.find(s => s.id === selectedThemeIds[0])?.name} × {themeSwatches.find(s => s.id === selectedThemeIds[1])?.name}
                  </span>
                )}
              </div>

              <button
                onClick={handleCreateBlend}
                disabled={selectedThemeIds.length !== 2}
                className={`px-6 py-2.5 font-mono text-xs sm:text-sm tracking-wider uppercase font-bold rounded-sm transition-all flex items-center gap-2 cursor-pointer ${
                  selectedThemeIds.length === 2
                    ? 'bg-ink text-porcelain hover:bg-accent shadow-luxury hover:shadow-2xl'
                    : 'bg-[#4A423B] text-[#8C8474] cursor-not-allowed opacity-60'
                }`}
              >
                <span>Create My Blend</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
