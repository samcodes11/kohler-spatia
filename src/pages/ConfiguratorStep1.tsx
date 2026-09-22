import React, { useState } from 'react';
import { useConfigurator, UnitType, BathroomType, PlumbingLayout, RoomShapeType, ThemeId, UserPriorityFocus } from '../context/ConfiguratorContext';
import { THEMES } from '../data/themes';
import { ASSET_MAP } from '../data/assets';
import { 
  Upload, 
  ArrowRight, 
  ArrowLeft,
  Check, 
  Maximize2, 
  Layers, 
  Sliders, 
  FileText,
  AlertCircle,
  Ruler,
  ShieldCheck,
  Leaf,
  Sparkles
} from 'lucide-react';

interface Step1Props {
  onNext: () => void;
  onBack?: () => void;
}

export const ConfiguratorStep1: React.FC<Step1Props> = ({ onNext, onBack }) => {
  const {
    unit, setUnit,
    width, setWidth,
    length, setLength,
    height, setHeight,
    roomShape, setRoomShape,
    bathroomType, setBathroomType,
    plumbingLayout, setPlumbingLayout,
    budget, setBudget,
    projectTimelineDays, setProjectTimelineDays,
    selectedTheme, setSelectedTheme,
    selectedBlend,
    priorityFocus, setPriorityFocus,
    accessibilityRequirements, toggleAccessibilityReq,
    renovationScope, toggleRenovationScope,
    designAssessment
  } = useConfigurator();

  // Conversion helper for display
  const convertUnit = (val: number, from: UnitType, to: UnitType) => {
    if (from === to) return val;
    let inFeet = val;
    if (from === 'm') inFeet = val * 3.28084;
    if (from === 'cm') inFeet = val / 30.48;

    if (to === 'ft') return Math.round(inFeet * 10) / 10;
    if (to === 'm') return Math.round((inFeet / 3.28084) * 10) / 10;
    if (to === 'cm') return Math.round(inFeet * 30.48);
    return val;
  };

  // Live dynamic area calculation (W x L) in both m² and sq ft
  const calculateArea = () => {
    let widthMeters = width;
    let lengthMeters = length;
    if (unit === 'ft') {
      widthMeters = width * 0.3048;
      lengthMeters = length * 0.3048;
    } else if (unit === 'cm') {
      widthMeters = width / 100;
      lengthMeters = length / 100;
    }
    const sqM = Math.max(0.1, widthMeters * lengthMeters);
    const sqFt = sqM * 10.7639;
    return {
      sqM: Math.round(sqM * 10) / 10,
      sqFt: Math.round(sqFt * 10) / 10
    };
  };
  const area = calculateArea();

  const handleUnitToggle = (newUnit: UnitType) => {
    if (newUnit === unit) return;
    setWidth(convertUnit(width, unit, newUnit));
    setLength(convertUnit(length, unit, newUnit));
    setHeight(convertUnit(height, unit, newUnit));
    setUnit(newUnit);
  };

  const formatBudget = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-12 animate-fade-in">
      
      {/* Top Universal Back Navigation */}
      {onBack && (
        <div className="flex items-center justify-start -mb-4">
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2 bg-band-2 border border-stone/30 hover:border-accent text-xs font-mono uppercase tracking-wider text-ink rounded-sm flex items-center gap-2 transition-all shadow-xs group"
          >
            <ArrowLeft size={15} className="text-stone group-hover:text-accent group-hover:-translate-x-0.5 transition-transform" />
            <span>← Back to Overview</span>
          </button>
        </div>
      )}

      {/* Editorial Step Header with B1 Side Banner visual */}
      <div className="relative overflow-hidden rounded-sm border-2 border-stone/30 bg-ink text-porcelain shadow-luxury">
        <div className="grid grid-cols-1 md:grid-cols-12 min-h-[180px]">
          <div className="md:col-span-8 p-8 sm:p-10 flex flex-col justify-center space-y-3.5 z-10">
            <span className="text-sm font-mono uppercase tracking-[0.2em] text-accent font-bold">
              Step 01 of 03 — Spatial Boundaries & Material Soul
            </span>
            <h1 className="font-serif text-xl sm:text-2xl lg:text-3xl text-porcelain font-bold tracking-tight">
              Space, Budget & <span className="italic font-semibold text-brass-light">Theme Foundation</span>
            </h1>
            <div className="h-[3px] w-20 bg-accent my-1" />
            <p className="text-porcelain/90 text-base sm:text-lg max-w-xl font-sans font-medium leading-relaxed">
              Define physical room boundaries, hydraulic constraints, and aesthetic finish identity. Every parameter dynamically informs clash detection, plumbing offsets, and real-time 3D geometry.
            </p>
          </div>
          <div className="md:col-span-4 relative h-48 md:h-auto overflow-hidden">
            <img
              src={ASSET_MAP.step1.banner}
              alt="Spatia Spatial Planning"
              className="w-full h-full object-cover opacity-85 filter contrast-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/40 to-transparent md:block hidden pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent md:hidden block pointer-events-none" />
            <span className="absolute bottom-3 right-3 text-xs sm:text-sm font-mono uppercase tracking-widest text-porcelain font-bold bg-ink/90 px-3 py-1.5 rounded border border-white/30 shadow-xs">
              Spatial Archetype
            </span>
          </div>
        </div>
      </div>

      {/* "What Matters Most?" Priority Focus Selector */}
      <div className="space-y-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-8 h-[2px] bg-accent" aria-hidden="true"></span>
            <span className="text-sm font-mono uppercase tracking-[0.2em] text-accent font-bold">
              Design Intent
            </span>
          </div>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-ink">
            What Matters Most?
          </h2>
          <p className="text-sm sm:text-base text-stone-dark font-medium mt-1">
            Set your primary design intent — this shapes how Spatia weighs every recommendation.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {([
            {
              id: 'calm' as UserPriorityFocus,
              num: '01',
              icon: Leaf,
              title: 'Calm',
              subtitle: 'Wellness & serenity',
              desc: 'Prioritize water efficiency, biophilic materials, and acoustic comfort.'
            },
            {
              id: 'ease' as UserPriorityFocus,
              num: '02',
              icon: Sliders,
              title: 'Ease',
              subtitle: 'Effortless living',
              desc: 'Prioritize low-maintenance fixtures, existing plumbing preservation, and simple installation.'
            },
            {
              id: 'impact' as UserPriorityFocus,
              num: '03',
              icon: Sparkles,
              title: 'Impact',
              subtitle: 'Design statement',
              desc: 'Prioritize luxury finishes, smart technology, and visual drama.'
            }
          ] as const).map((card) => {
            const Icon = card.icon;
            const isSelected = priorityFocus === card.id;
            return (
              <div
                key={card.id}
                onClick={() => setPriorityFocus(isSelected ? null : card.id)}
                className={`group cursor-pointer rounded-sm border-2 p-5 sm:p-6 transition-all duration-200 relative ${
                  isSelected
                    ? 'border-accent ring-2 ring-accent/40 bg-accent/5 shadow-md'
                    : 'border-stone/25 bg-white hover:border-stone/50 hover:shadow-editorial'
                }`}
              >
                {/* Numbered Badge */}
                <div className={`absolute top-3 right-3 w-7 h-7 rounded-full font-mono text-xs font-bold flex items-center justify-center ${
                  isSelected ? 'bg-accent text-white shadow-sm' : 'bg-band-2 text-stone-dark border border-stone/25'
                }`}>
                  {card.num}
                </div>

                <div className="space-y-3">
                  <div className={`w-10 h-10 rounded-sm flex items-center justify-center ${
                    isSelected ? 'bg-accent/20 text-accent' : 'bg-band-2 text-stone-dark'
                  }`}>
                    <Icon size={20} />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg sm:text-xl font-bold text-ink">{card.title}</h3>
                    <span className="text-sm font-mono text-accent font-bold uppercase tracking-wider">{card.subtitle}</span>
                  </div>
                  <p className="text-sm text-stone-dark font-medium leading-relaxed">{card.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Configuration Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column: Room Geometry & Dimensions */}
        <div className="bg-white border-2 border-stone/25 rounded-sm p-6 sm:p-8 space-y-6 shadow-editorial">
          <div className="flex items-center justify-between border-b border-stone/20 pb-4">
            <h3 className="font-serif text-2xl font-bold text-ink">Room Dimensions</h3>
            {/* Unit Toggle */}
            <div className="flex border-2 border-stone/30 rounded-sm overflow-hidden text-sm font-mono font-bold">
              {(['ft', 'cm', 'm'] as UnitType[]).map(u => (
                <button
                  key={u}
                  type="button"
                  onClick={() => handleUnitToggle(u)}
                  className={`px-3.5 py-1.5 transition-colors uppercase ${
                    unit === u 
                      ? 'bg-ink text-porcelain font-bold' 
                      : 'bg-band-2 text-stone-dark hover:bg-stone/20'
                  }`}
                >
                  {u}
                </button>
              ))}
            </div>
          </div>

          {/* Dimension Sliders with Numerical Direct Inputs */}
          <div className="space-y-5">
            {/* Width */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm font-mono">
                <span className="text-stone-dark uppercase font-bold">Room Width:</span>
                <span className="font-bold text-ink text-base">{width} {unit}</span>
              </div>
              <input
                type="range"
                min={unit === 'ft' ? 4 : unit === 'm' ? 1.2 : 120}
                max={unit === 'ft' ? 30 : unit === 'm' ? 9.0 : 900}
                step={unit === 'm' ? 0.1 : 1}
                value={width}
                onChange={e => setWidth(parseFloat(e.target.value))}
                className="w-full accent-accent cursor-pointer h-2.5 bg-stone/20 rounded-lg"
              />
              <div className="flex justify-between text-xs sm:text-sm font-mono text-stone-dark font-medium">
                <span>{unit === 'ft' ? '4 ft' : unit === 'm' ? '1.2 m' : '120 cm'}</span>
                <span>{unit === 'ft' ? '30 ft' : unit === 'm' ? '9.0 m' : '900 cm'}</span>
              </div>
            </div>

            {/* Length */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm font-mono">
                <span className="text-stone-dark uppercase font-bold">Room Length:</span>
                <span className="font-bold text-ink text-base">{length} {unit}</span>
              </div>
              <input
                type="range"
                min={unit === 'ft' ? 4 : unit === 'm' ? 1.2 : 120}
                max={unit === 'ft' ? 30 : unit === 'm' ? 9.0 : 900}
                step={unit === 'm' ? 0.1 : 1}
                value={length}
                onChange={e => setLength(parseFloat(e.target.value))}
                className="w-full accent-accent cursor-pointer h-2.5 bg-stone/20 rounded-lg"
              />
              <div className="flex justify-between text-xs sm:text-sm font-mono text-stone-dark font-medium">
                <span>{unit === 'ft' ? '4 ft' : unit === 'm' ? '1.2 m' : '120 cm'}</span>
                <span>{unit === 'ft' ? '30 ft' : unit === 'm' ? '9.0 m' : '900 cm'}</span>
              </div>
            </div>

            {/* Ceiling Height */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm font-mono">
                <span className="text-stone-dark uppercase font-bold">Ceiling Height:</span>
                <span className="font-bold text-ink text-base">{height} {unit}</span>
              </div>
              <input
                type="range"
                min={unit === 'ft' ? 7 : unit === 'm' ? 2.1 : 210}
                max={unit === 'ft' ? 15 : unit === 'm' ? 4.5 : 450}
                step={unit === 'm' ? 0.1 : 1}
                value={height}
                onChange={e => setHeight(parseFloat(e.target.value))}
                className="w-full accent-accent cursor-pointer h-2.5 bg-stone/20 rounded-lg"
              />
              <div className="flex justify-between text-xs sm:text-sm font-mono text-stone-dark font-medium">
                <span>{unit === 'ft' ? '7 ft' : unit === 'm' ? '2.1 m' : '210 cm'}</span>
                <span>{unit === 'ft' ? '15 ft' : unit === 'm' ? '4.5 m' : '450 cm'}</span>
              </div>
            </div>
          </div>

          {/* Dynamic Live Area Calculation Banner (W x L) */}
          <div className="bg-band-2 border-2 border-accent/40 rounded-sm p-4 flex items-center justify-between text-sm font-mono">
            <div className="flex items-center gap-2.5 text-ink">
              <Ruler size={18} className="text-accent shrink-0" />
              <span className="font-bold uppercase tracking-wider">Computed Floor Area:</span>
              <span className="bg-white/95 px-3 py-1 rounded border border-stone/30 font-bold text-ink text-base shadow-xs">
                {area.sqM} m² / {area.sqFt} sq ft
              </span>
            </div>
            <span className="text-xs sm:text-sm text-accent font-bold uppercase tracking-widest hidden sm:inline">
              {area.sqFt < 45 ? 'Powder / Compact' : area.sqFt < 90 ? 'Standard 3-Piece' : area.sqFt < 140 ? 'Master Suite' : 'Grand Luxury Spa'}
            </span>
          </div>

          {/* Room Shape Selection */}
          <div className="space-y-2.5 pt-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-mono uppercase tracking-wider text-stone-dark block font-bold">
                Room Architectural Footprint:
              </label>
              <span className="text-sm font-mono text-accent capitalize font-bold">{roomShape}</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { id: 'rectangular', label: 'Rectangular', icon: 'M 5,5 H 35 V 35 H 5 Z' },
                { id: 'l-shaped', label: 'L-Shaped', icon: 'M 5,5 H 35 V 20 H 20 V 35 H 5 Z' },
                { id: 'alcove', label: 'Alcove / Niche', icon: 'M 5,5 H 35 V 35 H 25 V 25 H 15 V 35 H 5 Z' },
                { id: 'angled', label: 'Angled Wall', icon: 'M 5,5 H 35 V 25 L 25,35 H 5 Z' },
              ].map(shape => (
                <button
                  key={shape.id}
                  type="button"
                  onClick={() => setRoomShape(shape.id as RoomShapeType)}
                  className={`p-3 border rounded-sm flex flex-col items-center gap-2 transition-all ${
                    roomShape === shape.id
                      ? 'border-accent bg-accent/10 text-ink'
                      : 'border-stone/25 hover:border-stone/40 text-stone-dark'
                  }`}
                >
                  <svg viewBox="0 0 40 40" className="w-6 h-6 stroke-current fill-none stroke-[2]">
                    <path d={shape.icon} />
                  </svg>
                  <span className="text-xs font-mono uppercase tracking-wider text-center font-medium">{shape.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Blueprint / Photo Upload - Honest Roadmap Notice */}
          <div className="pt-2 border-t border-stone/15 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-stone-dark font-medium">
                Blueprint / Photo Upload
              </span>
              <span className="text-xs font-mono text-stone-dark bg-band-2 px-2.5 py-0.5 rounded border border-stone/20 font-medium">
                Future Roadmap
              </span>
            </div>
            <div className="border border-stone/20 p-3.5 rounded-sm bg-band-2/60 flex items-start gap-3 text-xs">
              <Upload size={16} className="text-stone-dark shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-mono text-ink text-xs font-medium leading-normal">
                  Photo upload is part of our future roadmap — for this prototype, describe your space in words instead.
                </p>
                <p className="text-xs text-stone-dark leading-normal">
                  Use the architectural footprint selectors above (Rectangular, L-Shaped, Alcove, Angled Wall) to define geometry.
                </p>
              </div>
            </div>
          </div>

          {/* Bathroom Classification with B2 Images (Master, Guest, Powder Room) */}
          <div className="space-y-3 pt-3 border-t-2 border-stone/20">
            <div className="flex items-center justify-between">
              <label className="text-sm font-mono uppercase tracking-wider text-stone-dark block font-bold">
                Bathroom Classification:
              </label>
              <span className="text-sm font-mono text-accent font-bold">{bathroomType}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {[
                {
                  type: 'Master' as BathroomType,
                  img: ASSET_MAP.step1.bathroomTypes.master,
                  subtitle: '4-5 Fixture Suite',
                  detail: 'Vanity, soaking tub, wet shower & smart bidet'
                },
                {
                  type: 'Guest' as BathroomType,
                  img: ASSET_MAP.step1.bathroomTypes.guest,
                  subtitle: '3-Piece Full Bath',
                  detail: 'Vanity, alcove shower/bath & low-flow toilet'
                },
                {
                  type: 'Powder Room' as BathroomType,
                  img: ASSET_MAP.step1.bathroomTypes.powderRoom,
                  subtitle: '2-Piece Suite',
                  detail: 'Sculptural basin vanity & toilet in compact footprint'
                },
              ].map(item => {
                const isSelected = bathroomType === item.type;
                return (
                  <div
                    key={item.type}
                    onClick={() => setBathroomType(item.type)}
                    className={`cursor-pointer rounded-sm border-2 overflow-hidden transition-all duration-200 flex flex-col ${
                      isSelected
                        ? 'border-accent ring-2 ring-accent/40 bg-accent/5 shadow-md'
                        : 'border-stone/25 hover:border-stone/50 bg-white'
                    }`}
                  >
                    <div className="h-28 w-full overflow-hidden relative bg-stone/10">
                      <img
                        src={item.img}
                        alt={item.type}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                      {isSelected && (
                        <div className="absolute top-2 right-2 bg-accent text-white p-1 rounded-full shadow-md">
                          <Check size={14} />
                        </div>
                      )}
                    </div>
                    <div className="p-3.5 flex-1 flex flex-col justify-between space-y-1">
                      <div>
                        <div className="font-serif text-base sm:text-lg font-bold text-ink">{item.type}</div>
                        <div className="text-xs sm:text-sm font-mono text-accent font-bold mt-0.5">{item.subtitle}</div>
                      </div>
                      <p className="text-xs sm:text-sm text-stone-dark mt-1 font-medium leading-snug">{item.detail}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Plumbing Constraints */}
          <div className="space-y-2.5 pt-3 border-t-2 border-stone/20">
            <label className="text-sm font-mono uppercase tracking-wider text-stone-dark block font-bold">
              Existing Plumbing Infrastructure:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm font-mono">
              <button
                type="button"
                onClick={() => setPlumbingLayout('renovating')}
                className={`p-4 rounded-sm border-2 text-left transition-all cursor-pointer ${
                  plumbingLayout === 'renovating'
                    ? 'border-accent bg-accent/10 text-ink font-bold ring-1 ring-accent/30'
                    : 'border-stone/25 text-stone-dark hover:border-stone/40'
                }`}
              >
                <div className="font-bold text-ink text-base">Yes — Renovating</div>
                <div className="text-xs sm:text-sm text-stone-dark mt-1 font-sans font-medium">Pins existing drain & supply risers</div>
              </button>
              <button
                type="button"
                onClick={() => setPlumbingLayout('new-construction')}
                className={`p-4 rounded-sm border-2 text-left transition-all cursor-pointer ${
                  plumbingLayout === 'new-construction'
                    ? 'border-accent bg-accent/10 text-ink font-bold ring-1 ring-accent/30'
                    : 'border-stone/25 text-stone-dark hover:border-stone/40'
                }`}
              >
                <div className="font-bold text-ink text-base">No — New Construction</div>
                <div className="text-xs sm:text-sm text-stone-dark mt-1 font-sans font-medium">Flexible zero-constraint layout</div>
              </button>
            </div>
          </div>

          {/* Renovation Scope Detail & Complexity Score */}
          {plumbingLayout === 'renovating' && (
            <div className="p-5 bg-porcelain-warm border-2 border-stone/25 rounded-sm space-y-3.5 pt-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-mono uppercase font-bold text-ink">Renovation Scope Controls</span>
                <span className={`text-xs font-mono font-bold uppercase px-3 py-1 rounded border-2 ${
                  designAssessment.renovationComplexity === 'High' ? 'bg-red-100 text-red-900 border-red-300' :
                  designAssessment.renovationComplexity === 'Moderate' ? 'bg-amber-100 text-amber-900 border-amber-300' :
                  'bg-green-100 text-green-900 border-green-300'
                }`}>
                  {designAssessment.renovationComplexity} Complexity
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2.5 text-xs sm:text-sm font-mono">
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={renovationScope.plumbingCanMove}
                    onChange={() => toggleRenovationScope('plumbingCanMove')}
                    className="accent-accent w-4 h-4"
                  />
                  <span className="font-semibold text-ink">Can re-route drain/lines</span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={renovationScope.wallsCanMove}
                    onChange={() => toggleRenovationScope('wallsCanMove')}
                    className="accent-accent w-4 h-4"
                  />
                  <span className="font-semibold text-ink">Can adjust non-load walls</span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={renovationScope.electricalCanMove}
                    onChange={() => toggleRenovationScope('electricalCanMove')}
                    className="accent-accent w-4 h-4"
                  />
                  <span className="font-semibold text-ink">Can re-channel conduits</span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={renovationScope.fixturesOnly}
                    onChange={() => toggleRenovationScope('fixturesOnly')}
                    className="accent-accent w-4 h-4"
                  />
                  <span className="font-semibold text-ink">Fixtures only (No core drill)</span>
                </label>
              </div>
              <div className="text-xs sm:text-sm font-mono text-stone-dark flex items-center justify-between pt-2 border-t border-stone/20">
                <span>Est. Duration: <strong className="text-ink font-bold">{designAssessment.renovationDaysEstimate}</strong></span>
                <span>Labor Rough-in: <strong className="text-ink font-bold">₹{designAssessment.renovationCostEstimate.toLocaleString('en-IN')}</strong></span>
              </div>
            </div>
          )}

          {/* Design for Accessibility - 8 Universal Design Items */}
          <div className="space-y-3 pt-3 border-t-2 border-stone/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-accent" />
                <label className="text-sm font-mono uppercase tracking-wider text-stone-dark block font-bold">
                  Design for Accessibility
                </label>
              </div>
              <span className="text-xs sm:text-sm font-mono text-ink font-bold">Universal Ergonomics</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs sm:text-sm font-mono">
              {[
                { key: 'elderly', label: 'Elderly Support', desc: 'Grab-bar ready blocking & comfort height' },
                { key: 'wheelchair', label: 'Wheelchair Radius', desc: '60" clear turning circumference' },
                { key: 'limitedMobility', label: 'Limited Mobility', desc: 'Zero-threshold curbless entry' },
                { key: 'childFriendly', label: 'Child Friendly', desc: 'Scald guard & step-height vanity' },
                { key: 'multiGen', label: 'Multi-Generational', desc: 'Dual user height ergonomic zoning' },
                { key: 'highContrast', label: 'High Contrast', desc: 'Luminance cues on floor edges' },
                { key: 'easyClean', label: 'Easy Clean Surfaces', desc: 'Seamless antimicrobial wall surrounds' },
                { key: 'slipResistant', label: 'Slip Resistant Flooring', desc: 'R10/DCOF ≥ 0.42 textured tile' },
              ].map(item => {
                const isChecked = accessibilityRequirements[item.key as keyof typeof accessibilityRequirements];
                return (
                  <label
                    key={item.key}
                    className={`p-3 rounded-sm border-2 cursor-pointer flex flex-col justify-between transition-all select-none ${
                      isChecked
                        ? 'border-accent bg-accent/10 text-ink font-bold ring-1 ring-accent/30 shadow-xs'
                        : 'border-stone/25 text-stone-dark hover:border-stone/45 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleAccessibilityReq(item.key as any)}
                        className="accent-accent w-4 h-4 shrink-0"
                      />
                      <span className="text-sm sm:text-base font-bold text-ink">{item.label}</span>
                    </div>
                    <span className="text-xs sm:text-sm text-stone-dark mt-1.5 pl-6 font-medium leading-snug">{item.desc}</span>
                  </label>
                );
              })}
            </div>
            <p className="text-xs sm:text-sm text-stone-dark font-mono font-medium italic">
              * Accessibility-oriented planning principles — informs fixture clearances and universal thresholds.
            </p>
          </div>
        </div>

        {/* Right Column: Budget Slider & Theme Selection */}
        <div className="space-y-6">
          
          {/* Budget Slider Box */}
          <div className="bg-white border-2 border-stone/25 rounded-sm p-6 sm:p-8 space-y-4 shadow-editorial">
            <div className="flex items-center justify-between border-b border-stone/20 pb-4">
              <h3 className="font-serif text-2xl font-bold text-ink">Target Budget</h3>
              <span className="font-mono text-2xl sm:text-3xl font-bold text-accent">
                {formatBudget(budget)}
              </span>
            </div>

            <div className="space-y-3.5 pt-2">
              <input
                type="range"
                min={60000}
                max={800000}
                step={10000}
                value={budget}
                onChange={e => setBudget(parseInt(e.target.value))}
                className="w-full accent-accent h-2.5 bg-stone/25 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs sm:text-sm font-mono text-stone-dark font-bold">
                <span>₹60,000</span>
                <span>₹4,00,000</span>
                <span>₹8,00,000+</span>
              </div>
            </div>

            <p className="text-sm text-stone-dark leading-relaxed font-medium">
              Real-time budget tracking compares your manual fixture picks against AI-optimized bundles, warning whenever selections drift beyond threshold.
            </p>
          </div>

          {/* Project Completion Timeline Box */}
          <div className="bg-white border-2 border-stone/25 rounded-sm p-6 sm:p-8 space-y-4 shadow-editorial">
            <div className="flex items-center justify-between border-b border-stone/20 pb-4">
              <div>
                <h3 className="font-serif text-2xl font-bold text-ink">Project Completion Timeline</h3>
                <p className="text-sm text-stone-dark font-medium mt-1">
                  Target lead time for fixture procurement & site execution.
                </p>
              </div>
              <span className="font-mono text-2xl sm:text-3xl font-bold text-accent">
                {projectTimelineDays}d
              </span>
            </div>

            <div className="space-y-3.5 pt-2">
              <input
                type="range"
                min={3}
                max={100}
                step={1}
                value={projectTimelineDays}
                onChange={e => setProjectTimelineDays(parseInt(e.target.value))}
                className="w-full accent-accent h-2.5 bg-stone/25 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs sm:text-sm font-mono text-stone-dark font-bold">
                <span>3d (Express)</span>
                <span>15d</span>
                <span>30d (Standard)</span>
                <span>60d</span>
                <span>100d (Bespoke)</span>
              </div>
            </div>

            <p className="text-sm text-stone-dark leading-relaxed font-medium">
              {projectTimelineDays <= 21
                ? 'Express timeline (<21 days): AI prioritizes in-stock fixtures and rapid dispatch logistics.'
                : projectTimelineDays >= 60
                ? 'Bespoke timeline (60+ days): Enables custom hand-crafted metallics and made-to-order finishes.'
                : 'Standard timeline (22-59 days): Optimal balance for full architectural suite delivery.'}
            </p>
          </div>

          {/* Theme Selection Box (5 Theme Worlds) */}
          <div className="bg-white border-2 border-stone/25 rounded-sm p-6 sm:p-8 space-y-4 shadow-editorial">
            <div className="border-b border-stone/20 pb-4 flex items-center justify-between">
              <div>
                <h3 className="font-serif text-2xl font-bold text-ink">Finish Atmosphere & Theme</h3>
                <p className="text-sm text-stone-dark font-medium mt-1">
                  Dynamically adapts the app accent, lighting temperature, and 3D materials.
                </p>
              </div>
              <span className="text-xs sm:text-sm font-mono uppercase tracking-widest text-accent font-bold hidden sm:inline">
                5 Worlds
              </span>
            </div>

            {/* Active AI Theme Blend Notice */}
            {selectedBlend && (
              <div className="p-4 bg-accent/15 border-2 border-accent/40 rounded-sm flex items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs sm:text-sm font-mono uppercase tracking-widest text-accent font-bold">
                      Active AI Theme Blend
                    </span>
                  </div>
                  <div className="font-serif font-bold text-ink text-lg">
                    {selectedBlend.title}
                  </div>
                  <p className="text-xs sm:text-sm text-ink italic font-medium">
                    "{selectedBlend.oneSentenceDescription}"
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onBack?.()}
                  className="px-3.5 py-2 text-xs sm:text-sm font-mono uppercase tracking-wider text-accent border-2 border-accent hover:bg-accent hover:text-white rounded-xs transition-colors shrink-0 cursor-pointer font-bold"
                >
                  Change Blend
                </button>
              </div>
            )}

            <div className="space-y-3 pt-2">
              {(['minimalist-modern', 'classic-luxury', 'japanese-zen', 'coastal-breeze', 'urban-chic'] as ThemeId[]).map(themeId => {
                const theme = THEMES[themeId];
                if (!theme) return null;
                const isSelected = selectedTheme === theme.id;
                return (
                  <div
                    key={theme.id}
                    onClick={() => setSelectedTheme(theme.id as ThemeId)}
                    className={`p-4 border-2 rounded-sm cursor-pointer transition-all duration-300 flex items-center gap-4 relative ${
                      isSelected
                        ? 'border-accent bg-accent/10 ring-2 ring-accent/40 shadow-md'
                        : 'border-stone/25 hover:border-stone/50 bg-white'
                    }`}
                  >
                    <div className="w-20 h-20 sm:w-22 sm:h-22 shrink-0 rounded-xs overflow-hidden border border-stone/25 relative bg-stone/10">
                      <img
                        src={theme.previewImage}
                        alt={theme.name}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                      <span 
                        className="absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-white shadow-xs" 
                        style={{ backgroundColor: theme.accentColor }} 
                        title={`Accent: ${theme.accentColor}`}
                      />
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="font-serif text-lg sm:text-xl font-bold text-ink truncate">
                          {theme.name}
                        </h4>
                        {isSelected && (
                          <span className="px-3 py-1 text-xs font-mono uppercase tracking-wider bg-accent text-white font-bold rounded-xs shrink-0 flex items-center gap-1 shadow-xs">
                            <Check size={13} /> Active
                          </span>
                        )}
                      </div>
                      <div className="text-xs sm:text-sm font-mono text-accent font-bold truncate">
                        {theme.finishes} ({theme.tone})
                      </div>
                      <p className="text-sm text-stone-dark line-clamp-2 leading-relaxed font-medium">
                        {theme.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

      {/* Bottom CTA to Step 2 */}
      <div className="pt-6 border-t-2 border-stone/20 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm font-mono text-stone-dark font-medium">
          Room footprint: <span className="text-ink font-bold">{width}×{length} {unit} ({roomShape})</span> · Budget: <span className="text-ink font-bold">{formatBudget(budget)}</span>
        </div>
        <button
          onClick={onNext}
          className="w-full sm:w-auto px-10 py-4.5 bg-ink hover:bg-accent text-porcelain text-sm sm:text-base font-mono uppercase tracking-widest font-bold flex items-center justify-center gap-3 shadow-luxury transition-all duration-200 group rounded-sm cursor-pointer"
        >
          <span>Proceed to Fixture Selection</span>
          <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform" />
        </button>
      </div>

    </div>
  );
};
