import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useConfigurator } from '../context/ConfiguratorContext';
import { THEMES } from '../data/themes';
import { ASSET_MAP } from '../data/assets';
import { IMAGE_MAP } from '../data/imageMap';
import { 
Sparkles, 
ArrowRight, 
ArrowLeft, 
Compass, 
BookOpen, 
MessageSquareText, 
Dna, 
HeartHandshake, 
Droplet,
Layers,
CheckCircle2,
Clock,
Check,
FileText
} from 'lucide-react';
import { Path02CollectionsLookbook } from '../components/pathways/Path02CollectionsLookbook';
import { Path03ConsultantChat } from '../components/pathways/Path03ConsultantChat';
import { Path04BathroomDNA } from '../components/pathways/Path04BathroomDNA';
import { Path05LifeStagePlanner } from '../components/pathways/Path05LifeStagePlanner';
import { Path06EcoFootprint } from '../components/pathways/Path06EcoFootprint';
import { AiThemeBlendSection } from '../components/themeBlend/AiThemeBlendSection';

interface HomePageProps {
onStartDesigning: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onStartDesigning }) => {
const { user, isAuthenticated, savedProjects } = useAuth();
const { selectedTheme, setSelectedTheme, setActiveStep } = useConfigurator();

// Active pathway modal/view or null
const [activePathway, setActivePathway] = useState<number | null>(null);

// Six Ways to Begin Pathways with Section 75 Approved Cloudinary Assets
const pathways = [
{
num: '01',
title: 'Design Your Bathroom',
tagline: 'Spatial Configurator',
desc: 'Input dimensions, choose finishes, and generate 2D plans with 3D isometric scenes.',
actionLabel: 'Launch Configurator',
icon: Compass,
featured: true,
imageUrl: ASSET_MAP.homepage.waysToBegin.designYourBathroom,
onClick: () => {
setActiveStep(1);
onStartDesigning();
}
},
{
num: '02',
title: 'Browse Collections',
tagline: 'Architectural Lookbooks',
desc: 'Explore finish narratives across curated architectural aesthetics with direct catalog access.',
actionLabel: 'Explore Lookbook',
icon: BookOpen,
featured: false,
imageUrl: ASSET_MAP.homepage.waysToBegin.browseCollections,
onClick: () => setActivePathway(2)
},
{
num: '03',
title: 'Consult the AI Designer',
tagline: 'Spatial Intake Assistant',
desc: 'Engage with our contextual spatial intake assistant for personalized fixture recommendations.',
actionLabel: 'Consult AI',
icon: MessageSquareText,
featured: false,
imageUrl: ASSET_MAP.homepage.waysToBegin.consultAiDesigner,
onClick: () => setActivePathway(3)
},
{
num: '04',
title: 'AI Bathroom DNA',
tagline: 'Style Synthesizer',
desc: 'Upload inspiration imagery to decode your personal aesthetic into a starter bundle.',
actionLabel: 'Extract Style DNA',
icon: Dna,
featured: false,
imageUrl: ASSET_MAP.homepage.waysToBegin.aiBathroomDna,
onClick: () => setActivePathway(4)
},
{
num: '05',
title: 'AI Life-Stage Designer',
tagline: 'Accessibility Audit',
desc: 'Audit multigenerational accessibility and evaluate future-proof bathroom ergonomics.',
actionLabel: 'Audit 10-Year Plan',
icon: HeartHandshake,
featured: false,
imageUrl: ASSET_MAP.homepage.waysToBegin.aiLifeStagePlanner,
onClick: () => setActivePathway(5)
},
{
num: '06',
title: 'AI Water & Energy Footprint',
tagline: 'Ecological Luxury',
desc: 'Calculate water and energy metrics against regional baselines for sustainable luxury.',
actionLabel: 'Analyze Eco Footprint',
icon: Droplet,
featured: false,
imageUrl: ASSET_MAP.homepage.waysToBegin.waterEnergyFootprint,
onClick: () => setActivePathway(6)
}
];

return (
<div className="space-y-28 lg:space-y-36 animate-fade-in pb-20">

{/* Editorial Hero Section (Asymmetric 2-Column Spread with 55-60% Image Width) */}
<section className="relative overflow-hidden py-16 lg:py-24 px-4 sm:px-6 lg:px-8 border-b border-stone/20 bg-band-1">
{/* Subtle Architectural Grid Overlay */}
<div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(174,138,78,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(174,138,78,0.06)_1px,transparent_1px)] [background-size:4rem_4rem] pointer-events-none"></div>

<div className="max-w-7xl mx-auto relative z-10">
<div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center" style={{ gridTemplateColumns: 'minmax(380px, .9fr) 1.1fr' }}>

{/* Left Copy Column */}
<div className="space-y-7">
{/* Eyebrow */}
<div className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-white/95 backdrop-blur-sm border border-stone/30 text-sm font-mono uppercase tracking-[0.25em] text-ink font-bold shadow-xs">
<span className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse" />
<span>Spatial Intelligence</span>
{isAuthenticated && user && (
<span className="text-stone-dark font-medium border-l-2 border-stone/30 pl-2.5">{user.name}</span>
)}
</div>

{/* Large Display Headline */}
<h1 
className="font-serif font-bold text-ink"
style={{ fontSize: 'clamp(28px, 4vw, 52px)', letterSpacing: '-.03em', lineHeight: '1.05' }}
>
The Architecture of{' '}
<span className="italic font-semibold text-accent">Sanctuary</span>.
</h1>

{/* Brass Accent Rule */}
<div className="w-24 h-[3px] bg-accent"></div>

{/* Supporting Paragraph */}
<p className="text-lg text-ink font-medium max-w-xl font-sans leading-relaxed">
Transform dimensional blueprints into sensory hydrotherapy environments with real-time clearance intelligence, isometric dollhouse drafting, and signature signature metallurgy.
</p>

{/* Dual CTA Buttons */}
<div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
<button
onClick={() => { setActiveStep(1); onStartDesigning(); }}
className="px-9 py-4 bg-ink text-porcelain hover:bg-accent text-sm font-mono uppercase tracking-widest font-bold flex items-center justify-center gap-3 shadow-luxury transition-all duration-200 group rounded-sm cursor-pointer"
>
<span>Start Designing</span>
<ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform text-accent group-hover:text-porcelain" />
</button>
<button
onClick={() => setActivePathway(2)}
className="px-9 py-4 border-2 border-ink hover:bg-ink/5 text-ink text-sm font-mono uppercase tracking-widest font-bold flex items-center justify-center gap-2 transition-all duration-200 rounded-sm cursor-pointer"
>
<span>Browse Collections</span>
</button>
</div>

{/* Bottom Feature Row with Icons */}
<div className="pt-4 flex flex-wrap items-center gap-6 border-t border-stone/20">
<div className="flex items-center gap-2 text-sm font-mono text-ink font-bold">
<Layers size={16} className="text-accent" />
<span>25 Fixtures</span>
</div>
<div className="flex items-center gap-2 text-sm font-mono text-ink font-bold">
<Compass size={16} className="text-accent" />
<span>Isometric 3D</span>
</div>
<div className="flex items-center gap-2 text-sm font-mono text-ink font-bold">
<FileText size={16} className="text-accent" />
<span>13-Page Report</span>
</div>
</div>
</div>

{/* Right Image Column */}
<div className="relative">
<div className="relative border-2 border-stone/30 shadow-luxury rounded-sm overflow-hidden bg-white min-h-[480px] lg:min-h-[580px] lg:h-[75vh]">
{/* Full-bleed Hero Visual */}
<div className="relative w-full h-full overflow-hidden">
<img
src={IMAGE_MAP['hero-home'] || ASSET_MAP.homepage.hero}
alt="Luxury architectural bathroom sanctuary"
className="w-full h-full object-cover object-center transform hover:scale-102 transition-transform duration-700"
loading="eager"
/>
<div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent"></div>

{/* Floating Issue Badge */}
<div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-sm border border-stone/30 text-xs sm:text-sm font-mono uppercase tracking-widest text-ink font-bold shadow-sm">
SPATIA · 2026 EDITION
</div>

{/* Rotated Vertical Text on Right Edge */}
<span 
className="absolute top-1/2 right-4 -translate-y-1/2 text-[10px] font-mono uppercase tracking-[0.35em] text-white/60 font-bold"
style={{ writingMode: 'vertical-rl' }}
>
S P A T I A · 2 0 2 6
</span>

{/* Caption on Image */}
<div className="absolute bottom-6 left-6 right-6 text-porcelain">
<span className="text-xs sm:text-sm font-mono uppercase tracking-widest text-accent block font-bold mb-1 drop-shadow-sm">
Featured Architectural Sanctuary
</span>
<div className="font-serif text-xl sm:text-2xl font-bold leading-tight drop-shadow-md">
Curated Calacatta & French Gold Suite
</div>
</div>
</div>
</div>
</div>

</div>
</div>
</section>

{/* THREE FINISH WORLDS — 3-Column Tall Portrait (3:4) Architectural Finish Portals */}
<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
<div className="border-b border-stone/25 pb-5 flex items-baseline justify-between">
<div>
<div className="flex items-center gap-2 mb-1.5">
<span className="w-8 h-[2px] bg-accent"></span>
<span className="text-sm font-mono uppercase tracking-[0.2em] text-accent font-bold">
Architectural Narratives
</span>
</div>
<h2 className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold text-ink">
Three Finish Worlds
</h2>
</div>
<span className="text-base font-mono text-ink font-semibold hidden sm:inline">
Curated material palettes engineered for timeless spatial harmony
</span>
</div>

<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
{[
{
id: 'minimalist-modern',
name: 'Minimalist Modern',
finishes: 'Brushed Nickel & Matte Basalt',
desc: 'Crisp planar geometry, concealed drain assemblies, and serene monochromatic stillness.',
image: IMAGE_MAP['theme-minimalist-modern'] || ASSET_MAP.homepage.finishWorlds.minimalistModern,
number: '01'
},
{
id: 'classic-luxury',
name: 'Classic Luxury',
finishes: 'Vibrant French Gold & Calacatta Marble',
desc: 'Opulent fluted appointments, sculpted cross handles, and heritage architectural grandeur.',
image: IMAGE_MAP['theme-luxury-escape'] || ASSET_MAP.homepage.finishWorlds.classicLuxury,
number: '02'
},
{
id: 'japanese-zen',
name: 'Japanese Zen',
finishes: 'Matte Black & Smoked Hinoki Oak',
desc: 'Biophilic timber tactility, submerged soaking proportions, and calming ritual hydrotherapy.',
image: IMAGE_MAP['theme-nature-retreat'] || ASSET_MAP.homepage.finishWorlds.japaneseZen,
number: '03'
}
].map((world) => (
<div
key={world.id}
onClick={() => {
setSelectedTheme(world.id as any);
setActiveStep(1);
onStartDesigning();
}}
className="group cursor-pointer flex flex-col justify-between transition-all duration-300"
>
{/* Tall Portrait 3:4 Image Container */}
<div className="aspect-[3/4] w-full overflow-hidden rounded-sm relative border-2 border-stone/25 shadow-editorial group-hover:shadow-luxury transition-all bg-stone/10">
<img
src={world.image}
alt={world.name}
className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
loading="lazy"
/>
<div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />

{/* Number Badge */}
<div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3.5 py-1.5 rounded-sm border border-stone/30 text-xs sm:text-sm font-mono font-bold text-ink shadow-xs">
WORLD {world.number}
</div>

{/* Bottom In-Image Finishes Eyebrow */}
<div className="absolute bottom-4 left-4 right-4 text-porcelain">
<span className="text-sm font-mono uppercase tracking-widest text-accent block font-bold drop-shadow-sm">
{world.finishes}
</span>
</div>
</div>

{/* Left-Aligned Caption */}
<div className="pt-5 space-y-2.5">
<h3 className="font-serif text-lg sm:text-xl font-bold text-ink group-hover:text-accent transition-colors">
{world.name}
</h3>
<p className="text-base text-stone-dark leading-relaxed font-sans font-medium">
{world.desc}
</p>
<div className="pt-2 flex items-center gap-2 text-sm font-mono uppercase tracking-wider text-ink group-hover:text-accent font-bold transition-colors">
<span>Enter Finish World</span>
<ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform" />
</div>
</div>
</div>
))}
</div>
</section>

{/* Returning Logged-In User Dashboard Quick Strip */}
{isAuthenticated && savedProjects.length > 0 && (
<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
<div className="p-6 bg-white border-2 border-accent/40 rounded-sm shadow-editorial flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
<div className="flex items-center gap-4">
<div className="w-12 h-12 rounded-full bg-accent/20 text-accent flex items-center justify-center shrink-0">
<Clock size={24} />
</div>
<div>
<span className="text-xs sm:text-sm font-mono uppercase tracking-wider text-accent font-bold block">
AI-Personalized Workspace
</span>
<h3 className="font-serif text-xl font-bold text-ink">
Resume Your Saved Project: "{savedProjects[0].name}"
</h3>
</div>
</div>

<button
onClick={() => {
setActiveStep(3);
onStartDesigning();
}}
className="px-7 py-3.5 bg-ink hover:bg-accent text-porcelain text-xs sm:text-sm font-mono uppercase tracking-widest font-bold rounded-sm flex items-center gap-2.5 transition-colors shrink-0 shadow-md cursor-pointer"
>
<span>Resume Configuration</span>
<ArrowRight size={16} />
</button>
</div>
</section>
)}

{/* ATMOSPHERIC FINISH CALIBRATION: AI THEME BLEND DISCOVERY EXPERIENCE */}
<AiThemeBlendSection onStartDesigning={onStartDesigning} />

{/* "Six Ways to Begin" — Numbered Pathway Cards (01–06 with Real Imagery) */}
<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
<div className="border-b border-stone/25 pb-5 flex items-baseline justify-between">
<div>
<div className="flex items-center gap-2 mb-1.5">
<span className="w-8 h-[2px] bg-accent"></span>
<span className="text-sm font-mono uppercase tracking-[0.2em] text-accent font-bold">
Architecture of Exploration
</span>
</div>
<h2 className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold text-ink">
Six Ways to Begin
</h2>
</div>
<span className="text-base font-mono text-ink font-semibold hidden sm:inline">
Curated entry points for architects & homeowners
</span>
</div>

{/* 6 Rich Visual Pathway Cards */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
{pathways.map((path) => {
const Icon = path.icon;
return (
<div
key={path.num}
onClick={path.onClick}
className={`group cursor-pointer bg-white border-2 rounded-sm overflow-hidden flex flex-col justify-between transition-all duration-300 ${
path.featured
? 'border-accent ring-2 ring-accent/30 shadow-luxury hover:border-accent hover:shadow-2xl'
: 'border-stone/25 hover:border-stone/50 hover:shadow-editorial'
}`}
>
{/* Image Header */}
<div className="aspect-square w-full relative overflow-hidden bg-band-1">
<img
src={path.imageUrl}
alt={path.title}
className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
loading="lazy"
/>
<div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent"></div>

{/* Card Number Badge */}
<div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-3.5 py-1.5 rounded-sm border border-stone/30 font-mono text-xs sm:text-sm font-bold text-ink shadow-xs">
Pathway {path.num}
</div>

{/* Icon Circle */}
<div className="absolute bottom-3 right-3 w-11 h-11 rounded-full bg-white text-ink flex items-center justify-center shadow-md group-hover:bg-ink group-hover:text-porcelain transition-colors">
<Icon size={20} />
</div>
</div>

{/* Card Body */}
<div className="p-6 flex-1 flex flex-col justify-between space-y-4">
<div className="space-y-2">
<span className="text-xs sm:text-sm font-mono uppercase tracking-wider text-accent font-bold block">
{path.tagline}
</span>
<h3 className="font-serif text-lg sm:text-xl font-bold text-ink group-hover:text-accent transition-colors">
{path.title}
</h3>
<p className="text-base text-stone-dark leading-relaxed font-sans font-medium">
{path.desc}
</p>
</div>

{/* Card CTA Footer */}
<div className="pt-4 border-t border-stone/20 flex items-center justify-between">
<span className="text-sm sm:text-base font-mono uppercase tracking-wider font-bold text-ink group-hover:text-accent transition-colors">
{path.actionLabel}
</span>
<ArrowRight size={18} className="text-stone-dark group-hover:text-accent group-hover:translate-x-1.5 transition-all" />
</div>
</div>
</div>
);
})}
</div>
</section>

{/* Pathway Modal Overlay if user clicks 02–06 */}
{activePathway !== null && (
<div className="fixed inset-0 z-50 overflow-y-auto bg-porcelain/95 backdrop-blur-md animate-fade-in p-4 sm:p-6 lg:p-8">
<div className="max-w-7xl mx-auto relative bg-porcelain">
{/* Top Close Bar with Universal Back Button */}
<div className="flex items-center justify-between border-b border-stone/20 pb-4 mb-6">
<button
onClick={() => setActivePathway(null)}
className="px-4 py-2 bg-band-2 border border-stone/30 hover:border-accent text-xs font-mono uppercase tracking-wider text-ink rounded-sm flex items-center gap-2 transition-all shadow-xs"
>
<ArrowLeft size={16} />
<span>← Back to Overview</span>
</button>
<div className="text-xs font-mono text-stone-dark uppercase">
Pathway 0{activePathway} Active
</div>
</div>

{/* Dynamic Pathway Component */}
{activePathway === 2 && (
<Path02CollectionsLookbook onStartConfiguring={() => { setActivePathway(null); onStartDesigning(); }} />
)}
{activePathway === 3 && (
<Path03ConsultantChat onProceedToConfigurator={() => { setActivePathway(null); onStartDesigning(); }} />
)}
{activePathway === 4 && (
<Path04BathroomDNA onProceedToConfigurator={() => { setActivePathway(null); onStartDesigning(); }} />
)}
{activePathway === 5 && (
<Path05LifeStagePlanner onProceedToConfigurator={() => { setActivePathway(null); onStartDesigning(); }} />
)}
{activePathway === 6 && (
<Path06EcoFootprint onProceedToConfigurator={() => { setActivePathway(null); onStartDesigning(); }} />
)}
</div>
</div>
)}

</div>
);
};
