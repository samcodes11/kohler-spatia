import React, { useState } from 'react';
import { useConfigurator } from '../../context/ConfiguratorContext';
import { ShieldAlert, Sparkles, ArrowRight, HeartHandshake, Baby, PersonStanding } from 'lucide-react';
import { PRODUCT_MAP } from '../../data/products';

interface Path05Props {
  onProceedToConfigurator?: () => void;
}

const HORIZON_YEARS = [0, 5, 10, 20];

export const Path05LifeStagePlanner: React.FC<Path05Props> = ({ onProceedToConfigurator }) => {
  const { setSingleSelection, setActiveStep } = useConfigurator();

  const [currentUsers, setCurrentUsers] = useState<string[]>(['couple']);
  const [horizonIndex, setHorizonIndex] = useState<number>(2); // 10 years default
  const [anticipateAgingParents, setAnticipateAgingParents] = useState<boolean>(true);
  const [anticipateChildren, setAnticipateChildren] = useState<boolean>(false);
  const [planGenerated, setPlanGenerated] = useState<boolean>(false);

  const horizonYears = HORIZON_YEARS[horizonIndex];

  const toggleUser = (val: string) => {
    setCurrentUsers(prev => 
      prev.includes(val) ? prev.filter(x => x !== val) : [...prev, val]
    );
  };

  const handleGenerateHorizonPlan = () => {
    setPlanGenerated(true);
    
    // Vary fixture selections based on checkboxes and horizon
    if (anticipateAgingParents || currentUsers.includes('multigen')) {
      setSingleSelection('toilet', horizonYears >= 20 ? 'toilet-wallhung' : 'toilet-smart');
    }
    
    if (anticipateChildren || currentUsers.includes('children')) {
      setSingleSelection('shower', 'shower-thermostatic');
      setSingleSelection('flooring', 'floor-woodtile');
    } else if (horizonYears >= 10 || anticipateAgingParents) {
      setSingleSelection('flooring', 'floor-mattestone');
    }

    if (horizonYears >= 20) {
      setSingleSelection('lighting', 'light-cove');
    }
  };

  const formatPrice = (price: number) => `₹${price.toLocaleString('en-IN')}`;

  const smartCommode = PRODUCT_MAP['toilet-smart'];
  const wallHungCommode = PRODUCT_MAP['toilet-wallhung'];
  const thermostaticShower = PRODUCT_MAP['shower-thermostatic'];
  const matteStone = PRODUCT_MAP['floor-mattestone'];
  const woodTile = PRODUCT_MAP['floor-woodtile'];
  const coveLight = PRODUCT_MAP['light-cove'];

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-2">
        <span className="text-sm font-mono uppercase tracking-[0.2em] text-accent font-bold">
          05 — Horizon Planning
        </span>
        <h2 className="font-serif text-xl sm:text-2xl lg:text-3xl text-ink font-bold">
          AI Life-Stage Designer
        </h2>
        <p className="text-stone-dark text-base sm:text-lg font-medium max-w-2xl mx-auto leading-relaxed font-sans">
          Bathrooms undergo high lifecycle friction when occupant mobility or family structure evolves. Our spatial AI audits future transition costs before demolition begins.
        </p>
      </div>

      {/* Interactive Form */}
      <div className="bg-white border border-stone/20 rounded-sm p-6 sm:p-8 space-y-8 shadow-editorial w-full">
        {/* Current Occupants */}
        <div className="space-y-3">
          <label className="text-sm font-mono uppercase tracking-wider text-stone-dark font-bold block">
            Who uses the bathroom primarily today?
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: 'single', label: 'Single Adult' },
              { id: 'couple', label: 'Couple / Partners' },
              { id: 'children', label: 'Young Children' },
              { id: 'multigen', label: 'Multi-Generational' }
            ].map(user => (
              <button
                key={user.id}
                onClick={() => toggleUser(user.id)}
                className={`p-3.5 text-xs sm:text-sm font-mono font-bold rounded-sm border transition-all ${
                  currentUsers.includes(user.id)
                    ? 'border-accent bg-accent/10 text-ink font-bold'
                    : 'border-stone/25 text-stone-dark hover:border-stone/40'
                }`}
              >
                {user.label}
              </button>
            ))}
          </div>
        </div>

        {/* Future Evolution Checkboxes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <label 
            onClick={() => setAnticipateAgingParents(!anticipateAgingParents)}
            className="flex items-start gap-3 p-4 border border-stone/20 rounded-sm cursor-pointer hover:bg-porcelain/30 transition-colors"
          >
            <input
              type="checkbox"
              checked={anticipateAgingParents}
              onChange={() => {}}
              className="mt-1 accent-accent"
            />
            <div>
              <div className="font-serif text-base font-bold text-ink">Aging in Place / Elderly Visitors</div>
              <div className="text-sm text-stone-dark font-medium leading-relaxed mt-0.5 font-sans">
                Anticipating visiting parents or future mobility requirements over the decade.
              </div>
            </div>
          </label>

          <label 
            onClick={() => setAnticipateChildren(!anticipateChildren)}
            className="flex items-start gap-3 p-4 border border-stone/20 rounded-sm cursor-pointer hover:bg-porcelain/30 transition-colors"
          >
            <input
              type="checkbox"
              checked={anticipateChildren}
              onChange={() => {}}
              className="mt-1 accent-accent"
            />
            <div>
              <div className="font-serif text-base font-bold text-ink">Young Children / Expanding Family</div>
              <div className="text-sm text-stone-dark font-medium leading-relaxed mt-0.5 font-sans">
                Requires splash tolerance, intuitive anti-scald thermostatic limits, and zero pinch-points.
              </div>
            </div>
          </label>
        </div>

        {/* 4-Anchor Snapping Timeline */}
        <div className="space-y-4 pt-6 border-t border-stone/20">
          <div className="flex justify-between items-center text-sm font-mono">
            <span className="text-stone-dark font-bold uppercase">Planning Horizon:</span>
            <span className="text-ink font-bold">{horizonYears === 0 ? 'Today' : `${horizonYears} Years`}</span>
          </div>

          <div className="px-1">
            <input
              type="range"
              min={0}
              max={3}
              step={1}
              value={horizonIndex}
              onChange={e => setHorizonIndex(parseInt(e.target.value))}
              className="w-full accent-accent h-2 bg-stone/25 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs font-mono font-semibold text-stone-dark mt-2">
              <span>Today</span>
              <span>5 Yrs</span>
              <span>10 Yrs</span>
              <span>20 Yrs</span>
            </div>
          </div>

          {/* Presets */}
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => setHorizonIndex(1)}
              className="flex items-center gap-2 px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider rounded-sm border border-stone/25 text-stone-dark hover:border-accent hover:text-accent transition-colors"
            >
              <Baby size={14} /> Growing Family
            </button>
            <button
              onClick={() => setHorizonIndex(3)}
              className="flex items-center gap-2 px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider rounded-sm border border-stone/25 text-stone-dark hover:border-accent hover:text-accent transition-colors"
            >
              <PersonStanding size={14} /> Aging in Place
            </button>
          </div>

          {/* Dynamic explanation panel */}
          <div className="bg-porcelain-warm p-5 rounded-sm border border-stone/15 mt-4">
            {horizonIndex === 0 && (
              <div className="space-y-3 animate-fade-in">
                <h4 className="font-serif text-lg font-bold text-ink">Modern Standard Setup</h4>
                <ul className="list-disc pl-5 space-y-2 text-sm text-stone-dark font-medium font-sans">
                  <li>Standard fixture heights and manual mixer controls.</li>
                  <li>No specialized lifecycle adaptations required currently.</li>
                  <li>Maximized budget efficiency for immediate needs.</li>
                </ul>
              </div>
            )}
            {horizonIndex === 1 && (
              <div className="space-y-3 animate-fade-in">
                <h4 className="font-serif text-lg font-bold text-ink">5-Year: Growing Family Phase</h4>
                <ul className="list-disc pl-5 space-y-2 text-sm text-stone-dark font-medium font-sans">
                  <li>Integrated anti-scald thermostatic shower controls ({thermostaticShower.name}).</li>
                  <li>Splash-proof high-friction flooring finishes.</li>
                  <li>Elimination of sharp pinch-points in vanity design.</li>
                </ul>
                <div className="mt-3 inline-block bg-white px-3 py-2 text-xs font-mono font-bold text-accent border border-accent/20 rounded-sm">
                  Installing {thermostaticShower.name} now saves ₹25,000 vs retrofitting in 5 years
                </div>
              </div>
            )}
            {horizonIndex === 2 && (
              <div className="space-y-3 animate-fade-in">
                <h4 className="font-serif text-lg font-bold text-ink">10-Year: Active Aging Prep</h4>
                <ul className="list-disc pl-5 space-y-2 text-sm text-stone-dark font-medium font-sans">
                  <li>Comfort-height commode ({smartCommode.name}) reduces joint strain.</li>
                  <li>Zero-threshold shower entry with flush linear drain.</li>
                  <li>In-wall blocking installed for future grab-bar additions.</li>
                </ul>
                <div className="mt-3 inline-block bg-white px-3 py-2 text-xs font-mono font-bold text-accent border border-accent/20 rounded-sm">
                  Installing {smartCommode.name} now saves ₹85,000 vs retrofitting in 10 years
                </div>
              </div>
            )}
            {horizonIndex === 3 && (
              <div className="space-y-3 animate-fade-in">
                <h4 className="font-serif text-lg font-bold text-ink">20-Year: Full Accessibility</h4>
                <ul className="list-disc pl-5 space-y-2 text-sm text-stone-dark font-medium font-sans">
                  <li>Fully ADA-compliant wall-hung commode ({wallHungCommode.name}).</li>
                  <li>Complete barrier-free architectural layout for mobility aids.</li>
                  <li>Low-level ambient lighting ({coveLight.name}) for nighttime safety.</li>
                </ul>
                <div className="mt-3 inline-block bg-white px-3 py-2 text-xs font-mono font-bold text-accent border border-accent/20 rounded-sm">
                  Installing {wallHungCommode.name} now saves ₹1,20,000 vs retrofitting in 20 years
                </div>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={handleGenerateHorizonPlan}
          className="w-full py-4 bg-ink hover:bg-ink-muted text-white text-sm font-mono uppercase tracking-widest font-bold flex items-center justify-center gap-2 shadow-md transition-colors"
        >
          <Sparkles size={16} className="text-accent" />
          <span>Audit Life-Stage Trade-Offs & Synthesize</span>
        </button>
      </div>

      {/* Life Stage Trade-off Analysis */}
      {planGenerated && (
        <div className="bg-white border border-accent/40 rounded-sm p-8 shadow-luxury space-y-6 animate-scale-up">
          <div className="flex items-center gap-2 text-accent font-mono text-sm uppercase tracking-wider font-bold">
            <HeartHandshake size={18} />
            <span>AI Life-Stage Trade-Off Analysis</span>
          </div>

          <div className="space-y-4">
            <h3 className="font-serif text-2xl sm:text-3xl text-ink font-bold">
              Future-Proofed Specification Matrix
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Critical Lifecycle Trade-Off */}
              {(anticipateAgingParents || currentUsers.includes('multigen')) && (
                <div className="p-5 bg-amber-500/10 border-l-4 border-amber-600 rounded-sm space-y-3">
                  <div className="flex items-center gap-2 text-amber-900 font-bold font-mono uppercase tracking-wide text-sm">
                    <ShieldAlert size={18} />
                    <span>Critical Lifecycle Trade-Off</span>
                  </div>
                  <ul className="list-disc pl-5 space-y-1.5 text-sm text-ink font-medium font-sans">
                    <li>Upgrading from standard to comfort-height later requires re-tiling and in-wall plumbing overhaul.</li>
                    <li>Substitutes <strong>{smartCommode.name} ({formatPrice(smartCommode.price)})</strong> at an ADA-compliant 420mm comfort rim elevation today.</li>
                    <li>Prevents an estimated ₹85,000 future retrofit demolition cost.</li>
                  </ul>
                </div>
              )}

              {/* Zero-Threshold Barrier-Free Walk-In */}
              {(anticipateAgingParents || horizonYears >= 10) && (
                <div className="p-5 bg-porcelain-warm border border-stone/20 rounded-sm space-y-3">
                  <div className="font-mono text-accent font-bold uppercase tracking-wide text-sm">
                    Zero-Threshold Barrier-Free Walk-In
                  </div>
                  <ul className="list-disc pl-5 space-y-1.5 text-sm text-stone-dark font-medium font-sans">
                    <li>Elevated shower curbs become dangerous trip hazards in later years.</li>
                    <li>Specifies a flush linear drain with <strong>{matteStone.name} ({formatPrice(matteStone.price)})</strong> featuring an R11 wet slip rating.</li>
                    <li>Guarantees elegant minimalist aesthetics now, with seamless accessibility forever.</li>
                  </ul>
                </div>
              )}

              {/* Digital Thermostatic Safety Limiters */}
              {(anticipateChildren || currentUsers.includes('children')) && (
                <div className="p-5 bg-porcelain-warm border border-stone/20 rounded-sm space-y-3">
                  <div className="font-mono text-accent font-bold uppercase tracking-wide text-sm">
                    Digital Thermostatic Safety Limiters
                  </div>
                  <ul className="list-disc pl-5 space-y-1.5 text-sm text-stone-dark font-medium font-sans">
                    <li>Replaces conventional manual mixers with the <strong>{thermostaticShower.name} ({formatPrice(thermostaticShower.price)})</strong>.</li>
                    <li>Limits maximum outlet water to 40°C automatically.</li>
                    <li>Protects sensitive skin of young children from sudden temperature spikes.</li>
                  </ul>
                </div>
              )}

              {/* Splash-Zone Resilience */}
              {anticipateChildren && (
                <div className="p-5 bg-porcelain-warm border border-stone/20 rounded-sm space-y-3">
                  <div className="font-mono text-accent font-bold uppercase tracking-wide text-sm">
                    Splash-Zone Resilience
                  </div>
                  <ul className="list-disc pl-5 space-y-1.5 text-sm text-stone-dark font-medium font-sans">
                    <li>Children create significant water accumulation outside the designated shower zone.</li>
                    <li>Employs <strong>{woodTile.name} ({formatPrice(woodTile.price)})</strong> for high-friction durability.</li>
                    <li>Prevents moisture damage to sub-floors and skirting during heavy splash events.</li>
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div className="pt-6 border-t border-stone/20 flex flex-col sm:flex-row justify-between items-center gap-4">
            <span className="text-sm text-stone-dark font-mono font-medium">
              Future-proof fixtures applied to active project.
            </span>
            <button
              onClick={() => {
                setActiveStep(2);
                if (onProceedToConfigurator) onProceedToConfigurator();
              }}
              className="w-full sm:w-auto px-8 py-4 bg-ink hover:bg-ink-muted text-white text-sm font-mono uppercase tracking-widest font-bold flex items-center justify-center gap-2 shadow-md transition-colors"
            >
              <span>Verify in 3D Configurator</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
