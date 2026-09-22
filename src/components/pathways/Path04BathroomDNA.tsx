import React, { useState } from 'react';
import { useConfigurator } from '../../context/ConfiguratorContext';
import { Sparkles, Upload, ArrowRight, Check, Image as ImageIcon, RefreshCw } from 'lucide-react';
import { THEMES } from '../../data/themes';

interface Path04Props {
onProceedToConfigurator?: () => void;
}

export const Path04BathroomDNA: React.FC<Path04Props> = ({ onProceedToConfigurator }) => {
const { setSelectedTheme, setBudget, setSingleSelection, setActiveStep } = useConfigurator();

// Curated inspiration presets users can pick or upload
const [selectedImages, setSelectedImages] = useState<number[]>([1, 2, 4]);
const [isAnalyzing, setIsAnalyzing] = useState(false);
const [dnaAnalysis, setDnaAnalysis] = useState<{
commonThread: string;
paletteSummary: string;
extractedMaterials: string[];
recommendedTheme: 'minimalist-modern' | 'classic-luxury' | 'japanese-zen';
confidence: number;
} | null>(null);

const sampleMoods = [
{ id: 1, title: 'Kyoto Hinoki Onsen', tags: 'Basalt, Cedar, Slatted screen', theme: 'japanese-zen', bg: 'bg-[#2B2F34] text-[#C2A379]' },
{ id: 2, title: 'Aman Tokyo Minimalist Suite', tags: 'Matte Titanium, Stone vanity', theme: 'japanese-zen', bg: 'bg-[#1E2226] text-white' },
{ id: 3, title: 'Hôtel Ritz Paris Vanity', tags: 'Calacatta marble, French Gold', theme: 'classic-luxury', bg: 'bg-[#F5F2EB] text-[#AE8A4E]' },
{ id: 4, title: 'Minimalist Milan Loft', tags: 'Polished Chrome, Frameless glass', theme: 'minimalist-modern', bg: 'bg-[#EAECEF] text-[#333]' },
{ id: 5, title: 'Nordic Spa Pavilion', tags: 'Wood tile, Drench shower', theme: 'japanese-zen', bg: 'bg-[#3D444C] text-[#EFECE6]' },
];

const toggleSelectImage = (id: number) => {
setSelectedImages(prev => {
if (prev.includes(id)) {
if (prev.length <= 1) return prev; // Keep at least one
return prev.filter(x => x !== id);
} else {
if (prev.length >= 5) return prev;
return [...prev, id];
}
});
};

const handleExtractDNA = () => {
setIsAnalyzing(true);
setTimeout(() => {
setIsAnalyzing(false);
// Determine dominant theme from selections
const hasClassic = selectedImages.includes(3);
const hasZen = selectedImages.includes(1) || selectedImages.includes(2) || selectedImages.includes(5);

if (hasClassic && !hasZen) {
setDnaAnalysis({
commonThread: "Opulent neoclassical symmetry characterized by luminous bullion metallics, deep warm stone veining, and heirloom proportioning.",
paletteSummary: "Vibrant French Gold (AF) / Honed Calacatta Marble / Warm 2700K Luminescence",
extractedMaterials: ["Calacatta Gold Honed Slab", "Solid Cast French Gold Hardware", "Mouth-blown Reeded Glass"],
recommendedTheme: "classic-luxury",
confidence: 96
});
setSelectedTheme('classic-luxury');
setBudget(550000);
} else if (hasZen) {
setDnaAnalysis({
commonThread: "Quiet mineral wabi-sabi stillness. Organic timber grain juxtaposed against deep volcanic basalt stone and smoked titanium water delivery.",
paletteSummary: "Matte Black (BL) / Flamed Basalt / Hinoki Cypress Cedar Accents",
extractedMaterials: ["Thermal Basalt Stone R11", "Concealed Smoked Titanium Mixers", "Aromatherapy Eucalyptus Steam"],
recommendedTheme: "japanese-zen",
confidence: 98
});
setSelectedTheme('japanese-zen');
setBudget(480000);
setSingleSelection('shower', 'shower-steam');
} else {
setDnaAnalysis({
commonThread: "Specular architectural clarity with flush ceiling planes, monolithic microcement surfaces, and seamless frameless glazing.",
paletteSummary: "Polished Chrome (CP) / Neutral Microcement / 4000K Crisp Light",
extractedMaterials: ["Polished Chrome PVD Plating", "10mm Starphire Glazing", "Recessed Deep-Baffle Downlights"],
recommendedTheme: "minimalist-modern",
confidence: 94
});
setSelectedTheme('minimalist-modern');
setBudget(380000);
}
}, 1800);
};

return (
<div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
{/* Header */}
<div className="text-center space-y-2">
<span className="text-sm font-mono uppercase tracking-[0.2em] text-accent font-bold">
04 — Inspiration Synthesizer
</span>
<h2 className="font-serif text-xl sm:text-2xl lg:text-3xl text-ink font-bold">
AI Bathroom DNA Extraction
</h2>
<p className="text-stone-dark text-base sm:text-lg font-medium max-w-2xl mx-auto leading-relaxed">
Upload 3–5 inspiration images (Pinterest boards, hotel suite photos, architectural clippings). Spatia's computer vision decodes the common stylistic thread, material palette, and spatial rhythm into an instant starter bundle.
</p>
</div>

{/* Image Grid / Dropzone */}
<div className="bg-white border border-stone/20 rounded-sm p-6 sm:p-8 space-y-6 shadow-editorial">
<div className="flex items-center justify-between">
<div className="text-sm font-mono uppercase text-stone-dark font-bold">
Selected Inspiration Set: <span className="text-ink font-bold">{selectedImages.length} / 5</span>
</div>
<span className="text-xs text-stone-dark font-mono font-medium">Click cards to select/deselect</span>
</div>

<div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
{sampleMoods.map(mood => {
const isSelected = selectedImages.includes(mood.id);
return (
<div
key={mood.id}
onClick={() => toggleSelectImage(mood.id)}
className={`cursor-pointer rounded-sm border p-4 flex flex-col justify-between h-44 transition-all duration-300 relative ${mood.bg} ${
isSelected 
? 'border-accent ring-2 ring-accent/30 shadow-md scale-[1.02]' 
: 'border-stone/30 opacity-70 hover:opacity-100'
}`}
>
{isSelected && (
<div className="absolute top-2 right-2 w-5 h-5 bg-accent text-white rounded-full flex items-center justify-center">
<Check size={12} />
</div>
)}
<div>
<ImageIcon size={20} className="mb-2 opacity-80" />
<h4 className="font-serif text-sm font-bold leading-snug">{mood.title}</h4>
</div>
<div className="text-xs font-mono font-medium opacity-90 border-t border-white/20 pt-2">
{mood.tags}
</div>
</div>
);
})}
</div>

{/* Upload Custom Photo Button */}
<div className="border border-dashed border-stone/40 p-4 rounded-sm text-center bg-porcelain/40 hover:bg-porcelain-warm transition-colors cursor-pointer flex items-center justify-center gap-2 text-sm font-mono font-medium text-stone-dark">
<Upload size={16} />
<span>Upload Custom Inspiration File (.jpg, .png, .heic)</span>
</div>
<p className="text-xs text-stone-dark font-medium italic mt-2 text-center">
Prototype note: Custom image upload isn't wired up yet in this demo. Try the pre-loaded inspiration cards above to explore AI style extraction.
</p>

{/* Extract Button */}
<div className="text-center pt-2">
<button
onClick={handleExtractDNA}
disabled={isAnalyzing}
className="px-8 py-4 bg-ink hover:bg-ink-muted text-white text-sm font-mono uppercase tracking-widest font-bold inline-flex items-center gap-2 shadow-md transition-colors disabled:opacity-50"
>
{isAnalyzing ? (
<>
<RefreshCw size={16} className="animate-spin text-accent" />
<span>Deconstructing Architectural DNA...</span>
</>
) : (
<>
<Sparkles size={16} className="text-accent" />
<span>Synthesize Common Design Thread</span>
</>
)}
</button>
</div>
</div>

{/* Analysis Results Display */}
{dnaAnalysis && (
<div className="bg-white border border-accent/40 rounded-sm p-8 shadow-luxury space-y-6 animate-scale-up">
<div className="flex items-center justify-between border-b border-stone/15 pb-4">
<div className="flex items-center gap-2 text-accent font-mono text-sm uppercase tracking-wider font-bold">
<Sparkles size={18} />
<span>Extracted Spatial Genome ({dnaAnalysis.confidence}% Confidence)</span>
</div>
<span className="text-sm font-mono bg-accent/15 text-accent px-3 py-1 rounded uppercase font-bold">
{THEMES[dnaAnalysis.recommendedTheme].name}
</span>
</div>

<div className="space-y-3">
<h3 className="font-serif text-2xl sm:text-3xl text-ink font-bold">
Identified Aesthetic Core
</h3>
<p className="text-base text-stone-dark font-medium leading-relaxed">
{dnaAnalysis.commonThread}
</p>
</div>

<div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
<div className="p-4 bg-porcelain-warm border border-stone/20 rounded-sm space-y-1.5">
<span className="text-xs font-mono uppercase tracking-wider text-stone-dark font-bold">Metallic & Texture Palette</span>
<div className="font-serif text-base font-bold text-ink">{dnaAnalysis.paletteSummary}</div>
</div>
<div className="p-4 bg-porcelain-warm border border-stone/20 rounded-sm space-y-1.5">
<span className="text-xs font-mono uppercase tracking-wider text-stone-dark font-bold">Extracted Material Anchors</span>
<ul className="text-sm font-mono font-medium text-stone-dark list-disc list-inside space-y-0.5">
{dnaAnalysis.extractedMaterials.map((m, i) => (
<li key={i}>{m}</li>
))}
</ul>
</div>
</div>

<div className="pt-4 border-t border-stone/20 flex flex-col sm:flex-row justify-between items-center gap-4">
<span className="text-sm text-stone-dark font-mono font-medium">
Starter bundle mapped to room coordinates.
</span>
<button
onClick={() => {
setActiveStep(2);
if (onProceedToConfigurator) onProceedToConfigurator();
}}
className="w-full sm:w-auto px-8 py-4 bg-ink hover:bg-ink-muted text-white text-sm font-mono uppercase tracking-widest font-bold flex items-center justify-center gap-2 shadow-md transition-colors"
>
<span>Adopt Starting Bundle & Enter 3D View</span>
<ArrowRight size={16} />
</button>
</div>
</div>
)}
</div>
);
};
