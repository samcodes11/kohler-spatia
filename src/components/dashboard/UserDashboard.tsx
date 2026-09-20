import React, { useState } from 'react';
import { useAuth, SavedProject, DesignVersionSnapshot } from '../../context/AuthContext';
import { useConfigurator } from '../../context/ConfiguratorContext';
import { PRODUCT_MAP } from '../../data/products';
import { THEMES } from '../../data/themes';
import { 
  Bookmark, 
  Trash2, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Calendar, 
  Clock, 
  AlertCircle,
  Wrench,
  Droplets,
  LogOut,
  History,
  GitCompare,
  X,
  CheckCircle2,
  ArrowLeft
} from 'lucide-react';

interface DashboardProps {
  onLaunchProject: () => void;
  onBack?: () => void;
}

export const UserDashboard: React.FC<DashboardProps> = ({ onLaunchProject, onBack }) => {
  const { user, logout, savedProjects, deleteSavedProject, versionHistory, compareVersions } = useAuth();
  const { 
    setSelectedTheme, 
    setWidth, 
    setLength, 
    setRoomShape, 
    setBudget, 
    setActiveStep 
  } = useConfigurator();

  const [activeTab, setActiveTab] = useState<'projects' | 'history' | 'care'>('projects');
  const [compareModal, setCompareModal] = useState<{ v1Id: string; v2Id: string } | null>(null);

  const handleResume = (project: SavedProject) => {
    setSelectedTheme(project.theme as any);
    setWidth(project.dimensions.width);
    setLength(project.dimensions.length);
    setRoomShape(project.roomShape as any);
    setBudget(project.budget);
    setActiveStep(3);
    onLaunchProject();
  };

  const handleResumeVersion = (ver: DesignVersionSnapshot) => {
    setSelectedTheme(ver.theme as any);
    setWidth(ver.dimensions.width);
    setLength(ver.dimensions.length);
    setRoomShape(ver.roomShape as any);
    setBudget(ver.totalCost);
    setActiveStep(3);
    onLaunchProject();
  };

  // AI Care Assistant Maintenance Recommendations
  const careProtocols = [
    {
      title: 'French Gold & Brushed Bronze PVD Metallurgy',
      frequency: 'Every 2 Weeks',
      action: 'Buff surfaces exclusively with microfibre cloth soaked in warm water and pH-neutral soap. Never apply ammonia or chlorine bleach.',
      icon: Sparkles
    },
    {
      title: 'Ceiling Rain Panel Sprayface De-Calcification',
      frequency: 'Monthly',
      action: 'Wipe the flexible silicone MasterClean nozzles with your thumb under active warm flow to instantly dislodge mineral scale.',
      icon: Droplets
    },
    {
      title: 'Smart Commode UV Wand Electrolytic Sanitation',
      frequency: 'Every 90 Days',
      action: 'Replace the active-carbon deodorizing cartridge and run automated 3-minute UV wand self-sterilization cycle.',
      icon: ShieldCheck
    },
    {
      title: 'Thermostatic Ceramic Cartridge Flushing',
      frequency: 'Annual',
      action: 'Exercise high-temperature and low-temperature limit stops to lubricate ceramic disc faces against regional water hardness.',
      icon: Wrench
    }
  ];

  const comparisonResult = compareModal ? compareVersions(compareModal.v1Id, compareModal.v2Id) : null;

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8 animate-fade-in">
      
      {/* Universal Top Back Button */}
      {onBack && (
        <div className="flex items-center justify-start -mb-2">
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

      {/* User Header Profile */}
      <div className="bg-white border-2 border-stone/25 rounded-sm p-6 sm:p-8 shadow-editorial flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4.5">
          <div className="w-16 h-16 rounded-full bg-ink text-porcelain font-serif text-2xl flex items-center justify-center font-bold border-2 border-accent shadow-md">
            {(user?.username || user?.name || 'A').charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="font-serif text-xl sm:text-2xl font-bold text-ink">
                @{user?.username || user?.name || 'Architectural Patron'}
              </h1>
              <span className="text-xs font-mono uppercase bg-accent/20 text-accent font-bold px-2.5 py-1 rounded">
                Verified Architect
              </span>
            </div>
            <p className="text-sm font-mono text-stone-dark font-medium mt-1">{user?.email}</p>
            <p className="text-xs sm:text-sm text-stone-dark mt-1 font-medium">Member since {user?.joinedDate || 'August 2026'}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={logout}
            className="flex items-center gap-2 px-5 py-2.5 border-2 border-stone/30 hover:border-red-600 text-stone-dark hover:text-red-700 text-xs sm:text-sm font-mono uppercase tracking-wider font-bold rounded-sm transition-colors cursor-pointer"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Dashboard Sub-navigation Tabs */}
      <div className="border-b-2 border-stone/20 flex gap-8">
        <button
          onClick={() => setActiveTab('projects')}
          className={`pb-3.5 text-sm font-mono uppercase tracking-wider transition-colors border-b-2 cursor-pointer ${
            activeTab === 'projects'
              ? 'border-accent text-ink font-bold'
              : 'border-transparent text-stone-dark hover:text-ink font-semibold'
          }`}
        >
          Saved Sanctuaries ({savedProjects.length})
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`pb-3.5 text-sm font-mono uppercase tracking-wider flex items-center gap-2 transition-colors border-b-2 cursor-pointer ${
            activeTab === 'history'
              ? 'border-accent text-ink font-bold'
              : 'border-transparent text-stone-dark hover:text-ink font-semibold'
          }`}
        >
          <History size={16} />
          <span>Version History ({versionHistory.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('care')}
          className={`pb-3.5 text-sm font-mono uppercase tracking-wider flex items-center gap-2 transition-colors border-b-2 cursor-pointer ${
            activeTab === 'care'
              ? 'border-accent text-ink font-bold'
              : 'border-transparent text-stone-dark hover:text-ink font-semibold'
          }`}
        >
          <span>AI Care Assistant</span>
          <span className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse"></span>
        </button>
      </div>

      {/* Tab: Saved Projects */}
      {activeTab === 'projects' && (
        <div className="space-y-6">
          {savedProjects.length === 0 ? (
            <div className="bg-white border-2 border-stone/25 rounded-sm p-12 text-center space-y-4">
              <Bookmark size={36} className="text-stone mx-auto" />
              <h3 className="font-serif text-2xl font-bold text-ink">No Saved Sanctuaries Yet</h3>
              <p className="text-sm sm:text-base text-stone-dark max-w-sm mx-auto leading-relaxed font-medium">
                Configure a bathroom in 2D and 3D, and save the full specification brief to review later.
              </p>
              <button
                onClick={() => { setActiveStep(1); onLaunchProject(); }}
                className="px-8 py-3.5 bg-ink hover:bg-accent text-porcelain text-xs sm:text-sm font-mono uppercase tracking-widest font-bold transition-colors rounded-sm cursor-pointer shadow-md"
              >
                Start New Design
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {savedProjects.map(proj => (
                <div 
                  key={proj.id}
                  className="bg-white border-2 border-stone/25 hover:border-accent rounded-sm p-6 sm:p-7 shadow-editorial flex flex-col justify-between space-y-4 transition-all duration-300"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between text-xs sm:text-sm font-mono text-stone-dark font-bold">
                      <span className="uppercase tracking-wider">{proj.createdAt}</span>
                      <span className="text-accent uppercase">{THEMES[proj.theme]?.name || proj.theme}</span>
                    </div>

                    <h3 className="font-serif text-2xl font-bold text-ink">
                      {proj.name}
                    </h3>

                    <div className="text-sm font-mono text-stone-dark font-semibold">
                      Dimensions: {proj.dimensions.width}×{proj.dimensions.length} {proj.dimensions.unit} ({proj.roomShape})
                    </div>

                    {proj.notes && (
                      <p className="text-sm text-stone-dark italic font-sans pt-1 font-medium">
                        "{proj.notes}"
                      </p>
                    )}

                    <div className="text-base sm:text-lg font-mono font-bold text-ink pt-2">
                      Investment: ₹{proj.totalCost.toLocaleString('en-IN')}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-stone/20">
                    <button
                      onClick={() => deleteSavedProject(proj.id)}
                      className="p-2 text-stone hover:text-red-700 transition-colors cursor-pointer"
                      title="Delete saved project"
                    >
                      <Trash2 size={18} />
                    </button>

                    <button
                      onClick={() => handleResume(proj)}
                      className="px-6 py-3 bg-ink hover:bg-accent text-porcelain text-xs sm:text-sm font-mono uppercase tracking-widest font-bold rounded-sm flex items-center gap-2.5 transition-colors cursor-pointer shadow-sm"
                    >
                      <span>Resume Spatial View</span>
                      <ArrowRight size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Version History */}
      {activeTab === 'history' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-xs text-stone-dark">
              Every design revision is snapshot with complete dimension, fixture, cost, and Spatia score states.
            </p>
            {versionHistory.length >= 2 && (
              <button
                onClick={() => setCompareModal({ v1Id: versionHistory[1].id, v2Id: versionHistory[0].id })}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-porcelain-warm border border-stone/30 hover:border-accent text-xs font-mono uppercase text-ink rounded-sm transition-colors"
              >
                <GitCompare size={13} className="text-accent" />
                <span>Compare Latest Two</span>
              </button>
            )}
          </div>

          <div className="space-y-3">
            {versionHistory.map(ver => (
              <div
                key={ver.id}
                className="p-5 bg-white border border-stone/20 rounded-sm shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase bg-accent/15 text-accent font-bold px-2 py-0.5 rounded">
                      Version {ver.versionNumber}
                    </span>
                    <span className="text-xs font-mono text-stone">{ver.timestamp}</span>
                  </div>
                  <h4 className="font-serif text-lg font-semibold text-ink">
                    {ver.name}
                  </h4>
                  <div className="text-xs font-mono text-stone-dark">
                    Envelope: {ver.dimensions.width}×{ver.dimensions.length} {ver.dimensions.unit} ({ver.roomShape}) · Theme: {THEMES[ver.theme]?.name || ver.theme}
                  </div>
                  {ver.notes && (
                    <p className="text-xs text-stone-dark italic pt-0.5 font-sans">
                      "{ver.notes}"
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right font-mono">
                    <div className="text-xs text-stone-dark uppercase text-[10px]">Investment</div>
                    <div className="text-base font-bold text-ink">₹{ver.totalCost.toLocaleString('en-IN')}</div>
                    <div className="text-[10px] text-accent font-semibold">Score: {ver.designScore}%</div>
                  </div>

                  <button
                    onClick={() => handleResumeVersion(ver)}
                    className="px-4 py-2 bg-ink hover:bg-accent text-porcelain text-xs font-mono uppercase tracking-wider rounded-sm transition-colors flex items-center gap-1.5 shrink-0"
                  >
                    <span>Load</span>
                    <ArrowRight size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: AI Care Assistant */}
      {activeTab === 'care' && (
        <div className="bg-white border border-stone/20 rounded-sm p-6 sm:p-8 space-y-6 shadow-editorial">
          <div className="flex items-center gap-2 text-accent font-mono text-xs uppercase tracking-wider font-semibold">
            <Sparkles size={16} />
            <span>AI Care Assistant — Finish Longevity Engine</span>
          </div>

          <div className="space-y-2">
            <h3 className="font-serif text-2xl text-ink font-semibold">
              Tailored Fixture & Surface Maintenance Schedule
            </h3>
            <p className="text-xs sm:text-sm text-stone-dark max-w-2xl leading-relaxed">
              Kohler Physical Vapor Deposition (PVD) finishes resist tarnishing and scratching twice as effectively as standard electroplating. Follow these AI maintenance cadences to preserve heirloom luster indefinitely.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {careProtocols.map((care, i) => {
              const Icon = care.icon;
              return (
                <div key={i} className="p-5 bg-porcelain-warm border border-stone/15 rounded-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-ink font-serif font-semibold text-base">
                      <Icon size={17} className="text-accent" />
                      <span>{care.title}</span>
                    </div>
                    <span className="text-[10px] font-mono uppercase bg-white px-2 py-0.5 rounded border border-stone/20 text-stone-dark">
                      {care.frequency}
                    </span>
                  </div>
                  <p className="text-xs text-stone-dark leading-relaxed font-sans">
                    {care.action}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Compare Versions Modal */}
      {compareModal && comparisonResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-porcelain border border-stone/30 shadow-luxury rounded-sm p-6 sm:p-8 max-w-2xl w-full space-y-5">
            <div className="flex justify-between items-center border-b border-stone/20 pb-3">
              <div className="flex items-center gap-2">
                <GitCompare size={16} className="text-accent" />
                <h3 className="font-serif text-xl font-semibold text-ink">
                  Design Version Comparison
                </h3>
              </div>
              <button onClick={() => setCompareModal(null)} className="p-1 text-stone hover:text-ink">
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs font-mono">
              {/* Version 1 */}
              <div className="p-4 bg-white border border-stone/20 rounded-sm space-y-2">
                <span className="text-[10px] uppercase text-stone font-semibold">Version {comparisonResult.v1.versionNumber}</span>
                <h4 className="font-serif text-sm font-semibold text-ink">{comparisonResult.v1.name}</h4>
                <div>Cost: ₹{comparisonResult.v1.totalCost.toLocaleString('en-IN')}</div>
                <div>Score: {comparisonResult.v1.designScore}%</div>
                <div className="text-stone text-[11px] pt-1">Theme: {comparisonResult.v1.theme}</div>
              </div>

              {/* Version 2 */}
              <div className="p-4 bg-white border border-accent/40 rounded-sm space-y-2">
                <span className="text-[10px] uppercase text-accent font-semibold">Version {comparisonResult.v2.versionNumber}</span>
                <h4 className="font-serif text-sm font-semibold text-ink">{comparisonResult.v2.name}</h4>
                <div>Cost: ₹{comparisonResult.v2.totalCost.toLocaleString('en-IN')}</div>
                <div>Score: {comparisonResult.v2.designScore}%</div>
                <div className="text-stone text-[11px] pt-1">Theme: {comparisonResult.v2.theme}</div>
              </div>
            </div>

            {/* Deltas */}
            <div className="p-3 bg-porcelain-warm rounded-sm border border-stone/20 flex items-center justify-around text-xs font-mono">
              <div>
                <span className="text-stone-dark block text-[10px]">Cost Difference:</span>
                <strong className={comparisonResult.costDelta <= 0 ? 'text-green-700' : 'text-amber-800'}>
                  {comparisonResult.costDelta <= 0 ? '-' : '+'}₹{Math.abs(comparisonResult.costDelta).toLocaleString('en-IN')}
                </strong>
              </div>
              <div>
                <span className="text-stone-dark block text-[10px]">Score Difference:</span>
                <strong className="text-accent">
                  {comparisonResult.scoreDelta >= 0 ? `+${comparisonResult.scoreDelta}` : comparisonResult.scoreDelta} pts
                </strong>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
