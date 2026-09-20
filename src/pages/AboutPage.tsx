import React from 'react';
import { Sparkles, Compass, Shield, Award, ArrowLeft } from 'lucide-react';

interface AboutProps {
  onBack?: () => void;
}

export const AboutPage: React.FC<AboutProps> = ({ onBack }) => {
  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-12 animate-fade-in">
      
      {/* Universal Top Back Navigation */}
      {onBack && (
        <div className="flex items-center justify-start -mb-4">
          <button
            type="button"
            onClick={onBack}
            className="px-5 py-2.5 bg-band-2 border border-stone/40 hover:border-accent text-sm font-mono uppercase font-bold tracking-wider text-ink rounded-sm flex items-center gap-2 transition-all shadow-xs group"
          >
            <ArrowLeft size={16} className="text-ink group-hover:text-accent group-hover:-translate-x-0.5 transition-transform" />
            <span>← Back to Overview</span>
          </button>
        </div>
      )}
      
      {/* Editorial Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="text-sm font-mono uppercase tracking-[0.25em] text-accent font-bold">
          Manifesto & Case Study
        </span>
        <h1 className="font-serif text-xl sm:text-2xl lg:text-3xl text-ink font-bold tracking-tight">
          Spatial Intelligence for Architectural Sanctuaries
        </h1>
        <p className="text-stone-dark text-lg sm:text-xl font-medium leading-relaxed">
          KOHLER Spatia represents an avant-garde synthesis of generative spatial modeling and heirloom plumbing craftsmanship.
        </p>
      </div>

      {/* Philosophy Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-8 bg-white border border-stone/30 rounded-sm shadow-editorial space-y-3">
          <div className="w-11 h-11 rounded-full bg-porcelain-warm text-accent flex items-center justify-center font-mono font-bold text-base">
            01
          </div>
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-ink">Original AI Vision</h3>
          <p className="text-sm sm:text-base text-stone-dark font-medium leading-relaxed">
            In strict compliance with ethical creative standards, every product render, surface texture, and finish shader is computationally generated from real Kohler metallurgical color formulas without scraping photography.
          </p>
        </div>

        <div className="p-8 bg-white border border-stone/30 rounded-sm shadow-editorial space-y-3">
          <div className="w-11 h-11 rounded-full bg-porcelain-warm text-accent flex items-center justify-center font-mono font-bold text-base">
            02
          </div>
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-ink">Physical Clash Modeling</h3>
          <p className="text-sm sm:text-base text-stone-dark font-medium leading-relaxed">
            Real spatial planning requires physical constraint auditing. Spatia checks door swings, shower splash cones, ADA toilet clearances, and stud cavity depths before tile demolition begins.
          </p>
        </div>

        <div className="p-8 bg-white border border-stone/30 rounded-sm shadow-editorial space-y-3">
          <div className="w-11 h-11 rounded-full bg-porcelain-warm text-accent flex items-center justify-center font-mono font-bold text-base">
            03
          </div>
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-ink">Contractor-Ready Output</h3>
          <p className="text-sm sm:text-base text-stone-dark font-medium leading-relaxed">
            Beautiful renders are useless without technical accountability. Spatia compiles instantaneous MEP schematics, finish codes, dynamic bar pressure thresholds, and electrical loads in a one-click technical brief.
          </p>
        </div>
      </div>

      {/* Case Study Portfolio Banner */}
      <div className="p-8 bg-ink text-porcelain rounded-sm border border-stone/40 shadow-luxury space-y-4 text-center max-w-3xl mx-auto">
        <span className="text-xs font-mono uppercase tracking-widest text-accent font-bold block">
          Portfolio Exhibition Note
        </span>
        <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
          Conceptual Case Study Exploration
        </h3>
        <p className="text-sm sm:text-base text-stone-light max-w-xl mx-auto leading-relaxed font-medium">
          This digital prototype was engineered exclusively as an advanced spatial intelligence showcase. All references to Kohler nomenclature, finishes, and product typologies serve as a tribute to Kohler's 150-year legacy of bold design.
        </p>
        <div className="text-sm font-mono text-accent font-bold pt-2">
          © 2026 KOHLER Spatia. Concept case study — not affiliated with Kohler Co.
        </div>
      </div>

    </div>
  );
};
