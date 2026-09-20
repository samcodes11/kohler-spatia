import React, { useState } from 'react';
import { useConfigurator } from '../../context/ConfiguratorContext';
import { Droplet, Zap, Leaf, Sparkles, ArrowRight, BarChart3, TrendingDown } from 'lucide-react';
import { PRODUCTS, PRODUCT_MAP } from '../../data/products';

// Fallback in case PRODUCT_MAP isn't completely mapped as a dictionary in all environments
const getProduct = (id: string) => (PRODUCT_MAP && PRODUCT_MAP[id]) || PRODUCTS.find(p => p.id === id) || PRODUCTS[0];

interface Path06Props {
  onProceedToConfigurator?: () => void;
}

export const Path06EcoFootprint: React.FC<Path06Props> = ({ onProceedToConfigurator }) => {
  const { setSingleSelection, setActiveStep } = useConfigurator();

  // Habit inputs
  const [householdSize, setHouseholdSize] = useState<number>(4);
  const [showerMinutes, setShowerMinutes] = useState<number>(10);
  const [waterHeaterType, setWaterHeaterType] = useState<'heatpump' | 'solar' | 'instant-electric' | 'gas'>('instant-electric');
  const [optimized, setOptimized] = useState<boolean>(false);

  // Get efficiency multipliers and costs based on heater type
  const getHeaterStats = (type: string) => {
    switch (type) {
      case 'instant-electric': return { eff: 0.95, installCost: 8000, energyCost: 9.5 };
      case 'heatpump': return { eff: 3.2, installCost: 45000, energyCost: 2.8 };
      case 'solar': return { eff: 1, installCost: 65000, energyCost: 0.5 };
      case 'gas': return { eff: 0.85, installCost: 25000, energyCost: 5.5 };
      default: return { eff: 1, installCost: 8000, energyCost: 9.5 };
    }
  };

  const stats = getHeaterStats(waterHeaterType);

  // Dynamic recommendations based on heater type
  const recommendedShowerId = ['solar', 'heatpump'].includes(waterHeaterType) ? 'shower-thermostatic' : 'shower-digital';
  const recommendedToiletId = 'toilet-wallhung';
  const recommendedFaucetId = 'faucet-singlelever';

  const recommendedShower = getProduct(recommendedShowerId);
  const recommendedToilet = getProduct(recommendedToiletId);
  const recommendedFaucet = getProduct(recommendedFaucetId);

  const ecoFlow = recommendedShower.waterConsumption?.flowRateLpm || 12;

  // Calculations
  // Standard shower: 22 L/min
  const annualStandardLitres = householdSize * 365 * showerMinutes * 22;
  const annualEcoLitres = householdSize * 365 * showerMinutes * ecoFlow;
  const litresSaved = annualStandardLitres - annualEcoLitres;

  // Energy: roughly 0.038 kWh thermal energy required per litre of hot water
  const kwhSaved = Math.round(litresSaved * 0.038);
  const rupeesSavedAnnual = Math.round(kwhSaved * stats.energyCost);

  // Benchmark Calculation
  const bathroomDailyPerPerson = Math.round(annualEcoLitres / 365 / householdSize);
  const benchmarkPercentage = Math.round((bathroomDailyPerPerson / 135) * 100);

  // Payback Calculation
  const showerPremium = recommendedShower.price - 12000;
  const toiletPremium = recommendedToilet.price - 18000;
  const faucetPremium = recommendedFaucet.price - 6000;
  const ecoPremium = showerPremium + toiletPremium + faucetPremium;
  const infrastructureCost = stats.installCost + ecoPremium;
  const paybackYears = rupeesSavedAnnual > 0 ? (infrastructureCost / rupeesSavedAnnual).toFixed(1) : '∞';

  const handleApplyEcoSuite = () => {
    setOptimized(true);
    setSingleSelection('shower', recommendedShowerId);
    setSingleSelection('toilet', recommendedToiletId);
    setSingleSelection('faucet', recommendedFaucetId);
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-2 max-w-3xl mx-auto">
        <span className="text-sm font-mono uppercase tracking-[0.2em] text-accent font-bold">
          06 — Ecological Spatial Intelligence
        </span>
        <h2 className="font-serif text-xl sm:text-2xl lg:text-3xl text-ink font-bold">
          AI Water & Energy Footprint Designer
        </h2>
        <p className="text-stone-dark text-base sm:text-lg font-medium leading-relaxed">
          Luxury hydrotherapy and ecological stewardship co-optimized. Our fluid dynamics engine maximizes droplet drench volume while curbing water volume and boiler kilowatt draw.
        </p>
      </div>

      {/* Input Form & Live Calculations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white border border-stone/20 rounded-sm p-6 sm:p-8 space-y-6 shadow-editorial">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Household Size */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-mono">
                <span className="text-stone-dark font-bold uppercase">Household Size:</span>
                <span className="text-ink font-bold">{householdSize} Residents</span>
              </div>
              <input
                type="range"
                min={1}
                max={8}
                value={householdSize}
                onChange={e => setHouseholdSize(parseInt(e.target.value))}
                className="w-full accent-accent h-1 bg-stone/25 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs font-mono font-semibold text-stone-dark">
                <span>1</span>
                <span>4</span>
                <span>8+</span>
              </div>
            </div>

            {/* Average Shower Duration */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-mono">
                <span className="text-stone-dark font-bold uppercase">Daily Shower Duration:</span>
                <span className="text-ink font-bold">{showerMinutes} Minutes</span>
              </div>
              <input
                type="range"
                min={4}
                max={25}
                value={showerMinutes}
                onChange={e => setShowerMinutes(parseInt(e.target.value))}
                className="w-full accent-accent h-1 bg-stone/25 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs font-mono font-semibold text-stone-dark">
                <span>4 min</span>
                <span>10 min</span>
                <span>25 min</span>
              </div>
            </div>
          </div>

          {/* Water Heater System */}
          <div className="space-y-2 pt-2">
            <label className="text-sm font-mono uppercase tracking-wider text-stone-dark font-bold block">
              Water Heating Infrastructure:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { id: 'instant-electric', label: 'Instant Electric Geyser' },
                { id: 'heatpump', label: 'Hybrid Heat Pump' },
                { id: 'solar', label: 'Solar Thermal Array' },
                { id: 'gas', label: 'Piped Gas Boiler' }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => {
                    setWaterHeaterType(item.id as any);
                    setOptimized(false);
                  }}
                  className={`p-3.5 text-xs sm:text-sm font-mono font-bold rounded-sm border transition-all text-center ${
                    waterHeaterType === item.id
                      ? 'border-accent bg-accent/10 text-ink font-bold'
                      : 'border-stone/25 text-stone-dark hover:border-stone/40'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Optimize Action Button */}
          <button
            onClick={handleApplyEcoSuite}
            className="w-full py-4 bg-ink hover:bg-ink-muted text-white text-sm font-mono uppercase tracking-widest font-bold flex items-center justify-center gap-2 shadow-md transition-colors mt-6"
          >
            <Sparkles size={16} className="text-accent" />
            <span>Synthesize Co-Optimized Luxury Eco-Suite</span>
          </button>
        </div>

        {/* Dashboard Results Right Column */}
        <div className="space-y-6">
          {/* Live Calculation Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 bg-porcelain-warm border border-stone/15 rounded-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
                <Droplet size={24} />
              </div>
              <div>
                <span className="text-xs font-mono uppercase text-stone-dark font-bold block">Annual Water Saved</span>
                <span className="font-mono text-xl font-bold text-ink">
                  {litresSaved.toLocaleString('en-IN')} L
                </span>
              </div>
            </div>

            <div className="p-5 bg-porcelain-warm border border-stone/15 rounded-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                <Zap size={24} />
              </div>
              <div>
                <span className="text-xs font-mono uppercase text-stone-dark font-bold block">Thermal Energy Conserved</span>
                <span className="font-mono text-xl font-bold text-ink">
                  {kwhSaved.toLocaleString('en-IN')} kWh
                </span>
              </div>
            </div>
          </div>

          <div className="p-5 bg-porcelain-warm border border-stone/15 rounded-sm flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                <Leaf size={24} />
              </div>
              <div>
                <span className="text-xs font-mono uppercase text-stone-dark font-bold block">Estimated Annual Utility Saving</span>
                <span className="font-mono text-2xl font-bold text-ink">
                  ₹{rupeesSavedAnnual.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
            <div className="text-right hidden sm:block">
              <span className="text-xs font-mono uppercase text-stone-dark font-bold block">Heater Efficiency</span>
              <span className="font-mono font-bold text-ink">{stats.eff === 1 ? 'Free Heat (Solar)' : `x${stats.eff}`}</span>
            </div>
          </div>

          {/* Benchmark Card */}
          <div className="bg-white border border-stone/20 rounded-sm p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-stone-dark font-mono text-sm uppercase font-bold">
                <BarChart3 size={18} />
                <span>Urban India Benchmark (135 L/person/day)</span>
              </div>
              <span className="font-mono font-bold text-ink">{bathroomDailyPerPerson} L/day</span>
            </div>
            
            <div className="w-full h-3 bg-stone/20 rounded-full overflow-hidden">
              <div 
                className={`h-full ${benchmarkPercentage > 100 ? 'bg-red-400' : 'bg-emerald-400'} transition-all`}
                style={{ width: `${Math.min(benchmarkPercentage, 100)}%` }}
              />
            </div>
            
            <div className="flex justify-between text-xs font-mono font-bold text-stone-dark">
              <span>0 L</span>
              <span>Your usage: {benchmarkPercentage}% of benchmark</span>
              <span>135+ L</span>
            </div>
            
            <p className="text-[11px] leading-tight text-stone-dark/80 italic pt-2">
              * Commonly cited urban India domestic consumption planning benchmark (135 L/person/day) — not a single definitive government statistic.
            </p>
          </div>
        </div>
      </div>

      {/* Optimized Output Card */}
      {optimized && (
        <div className="bg-white border-2 border-accent/40 rounded-sm p-6 sm:p-8 shadow-luxury space-y-8 animate-scale-up mt-8">
          <div className="flex items-center gap-2 text-accent font-mono text-sm uppercase tracking-wider font-bold">
            <Leaf size={18} />
            <span>Co-Optimized Hydraulic Specification Active</span>
          </div>

          <div className="space-y-3">
            <h3 className="font-serif text-2xl sm:text-3xl text-ink font-bold">
              Dynamic Specification Tailored to {waterHeaterType.replace('-', ' ')}
            </h3>
            <p className="text-base text-stone-dark font-medium leading-relaxed max-w-4xl">
              By aligning fixtures with your selected {waterHeaterType.replace('-', ' ')} heating infrastructure, 
              Kohler Spatia curates optimal water delivery while curbing kilowatt draw. 
              {['solar', 'heatpump'].includes(waterHeaterType) 
                ? ' Thermostatic columns work best with stored hot water systems, delivering heirloom tactile control.'
                : ' Digital showers pair flawlessly with instant or gas systems, optimizing flow dynamically for rapid heating.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-5 bg-porcelain-warm rounded-sm border border-stone/20 flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono uppercase text-accent font-bold">Shower Engine</span>
                <div className="font-serif text-lg font-bold text-ink mt-2">{recommendedShower.name}</div>
              </div>
              <div className="text-xs font-mono font-medium text-stone-dark mt-4 border-t border-stone/20 pt-3">
                {recommendedShower.waterConsumption?.flowRateLpm || ecoFlow} L/min • ₹{recommendedShower.price.toLocaleString('en-IN')}
              </div>
            </div>
            
            <div className="p-5 bg-porcelain-warm rounded-sm border border-stone/20 flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono uppercase text-accent font-bold">Sanitary Dual Flush</span>
                <div className="font-serif text-lg font-bold text-ink mt-2">{recommendedToilet.name}</div>
              </div>
              <div className="text-xs font-mono font-medium text-stone-dark mt-4 border-t border-stone/20 pt-3">
                {recommendedToilet.waterConsumption?.flowRateLpm || 4.0} L/flush • ₹{recommendedToilet.price.toLocaleString('en-IN')}
              </div>
            </div>
            
            <div className="p-5 bg-porcelain-warm rounded-sm border border-stone/20 flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono uppercase text-accent font-bold">Laminar Faucet</span>
                <div className="font-serif text-lg font-bold text-ink mt-2">{recommendedFaucet.name}</div>
              </div>
              <div className="text-xs font-mono font-medium text-stone-dark mt-4 border-t border-stone/20 pt-3">
                {recommendedFaucet.waterConsumption?.flowRateLpm || 5.0} L/min • ₹{recommendedFaucet.price.toLocaleString('en-IN')}
              </div>
            </div>
          </div>

          {/* Payback Calculation Card */}
          <div className="mt-8 p-6 bg-stone-light/10 border border-accent/20 rounded-sm flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="space-y-3 flex-1">
              <div className="flex items-center gap-2">
                <TrendingDown size={20} className="text-accent" />
                <h4 className="font-serif text-xl font-bold text-ink">Investment Return</h4>
              </div>
              <p className="text-sm text-stone-dark font-medium leading-relaxed">
                Infrastructure Cost: <span className="text-ink font-bold">₹{infrastructureCost.toLocaleString('en-IN')}</span> <br className="hidden sm:block" />
                <span className="text-xs opacity-80">(₹{stats.installCost.toLocaleString('en-IN')} Heater Install + ₹{ecoPremium.toLocaleString('en-IN')} Eco-Fixture Premium over Builder-Grade)</span>
              </p>
              <p className="text-sm text-stone-dark font-medium">
                Annual Utility Savings: <span className="text-emerald-700 font-bold">₹{rupeesSavedAnnual.toLocaleString('en-IN')}</span>
              </p>
            </div>
            <div className="bg-white px-8 py-5 border border-stone/20 shadow-sm text-center min-w-[240px]">
              <div className="text-sm font-mono uppercase text-stone-dark font-bold mb-2">Payback Period</div>
              <div className="text-3xl font-serif font-bold text-accent">{paybackYears} Years</div>
              <div className="text-xs font-medium text-stone-dark mt-2">Your eco-investment pays for itself in {paybackYears} years</div>
            </div>
          </div>

          <div className="pt-6 border-t border-stone/20 flex flex-col sm:flex-row justify-between items-center gap-4">
            <span className="text-sm text-stone-dark font-mono font-medium">
              Eco-specification configured in project state.
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
