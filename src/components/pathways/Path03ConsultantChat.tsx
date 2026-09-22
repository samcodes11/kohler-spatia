import React, { useState } from 'react';
import { useConfigurator } from '../../context/ConfiguratorContext';
import { PRODUCTS, PRODUCT_MAP, ProductItem } from '../../data/products';
import { THEMES } from '../../data/themes';
import { Sparkles, Send, ArrowRight, CheckCircle2, RotateCcw } from 'lucide-react';
import { ProductVisual } from '../ui/ProductVisual';

interface Path03Props {
onProceedToConfigurator?: () => void;
}

interface IntakeStep {
question: string;
options: { label: string; detail: string; value: string }[];
}

export const Path03ConsultantChat: React.FC<Path03Props> = ({ onProceedToConfigurator }) => {
const { setSelectedTheme, setBudget, setSingleSelection, setActiveStep } = useConfigurator();

const [stepIndex, setStepIndex] = useState(0);
const [answers, setAnswers] = useState<{
sanctuaryMood?: string;
waterRitual?: string;
finishTone?: string;
budgetComfort?: string;
}>({});
const [recommendationReady, setRecommendationReady] = useState(false);

const steps: IntakeStep[] = [
{
question: "How would you characterize your ideal morning and evening bathroom ritual?",
options: [
{ label: "Invigorating & Architectural", detail: "Fast precision, crisp linear light, high-performance rainfall.", value: "invigorating" },
{ label: "Slow Warm Heritage Immersion", detail: "Deep soaking, warm luminous candlelight, tactile bullion metals.", value: "heritage" },
{ label: "Mindful Contemplation & Silence", detail: "Basalt textures, aromatherapy steam, zero visual clutter.", value: "zen" }
]
},
{
question: "Which water delivery sensation holds the highest personal priority?",
options: [
{ label: "Ceiling-Flush Deluge Rain", detail: "Drenching shoulder-to-shoulder soft droplets mimicking summer monsoon.", value: "rain" },
{ label: "Digital Thermostatic Hydrotherapy", detail: "Dual touchscreen presets with precision degrees and body jet massage.", value: "digital" },
{ label: "Restorative Private Steam Bath", detail: "Enclosed cabin with eucalyptus infusion and warming vapor.", value: "steam" }
]
},
{
question: "What finish aesthetic speaks to your architectural palette?",
options: [
{ label: "Polished Chrome / Vibrant Nickel", detail: "Pure specular silver reflection, mirror-like clarity.", value: "chrome" },
{ label: "Vibrant French Gold / Brushed Bronze", detail: "Radiant warm gold patinas, heirloom stature.", value: "gold" },
{ label: "Matte Black / Vibrant Titanium", detail: "Monolithic charcoal, architectural stealth.", value: "black" }
]
},
{
question: "What investment envelope are you considering for this bathroom sanctuary?",
options: [
{ label: "Essential Elegance (₹1.5L – ₹2.5L)", detail: "High-grade essentials with clean minimalist lines.", value: "200000" },
{ label: "Mid-Luxury Balance (₹3.5L – ₹5.0L)", detail: "Smart commode, exposed thermostatic valves, and backlit optics.", value: "420000" },
{ label: "Signature Architectural (₹6.5L+)", detail: "Steam cabin, French Gold bridge hardware, and Calacatta stone.", value: "700000" }
]
}
];

const handleSelectOption = (value: string) => {
const keys = ['sanctuaryMood', 'waterRitual', 'finishTone', 'budgetComfort'] as const;
const currentKey = keys[stepIndex];
const newAnswers = { ...answers, [currentKey]: value };
setAnswers(newAnswers);

if (stepIndex < steps.length - 1) {
setStepIndex(prev => prev + 1);
} else {
// Formulate recommendation
setRecommendationReady(true);
applyIntakeRecommendations(newAnswers);
}
};

const applyIntakeRecommendations = (finalAnswers: typeof answers) => {
// Determine Theme
if (finalAnswers.finishTone === 'black' || finalAnswers.sanctuaryMood === 'zen') {
setSelectedTheme('japanese-zen');
} else if (finalAnswers.finishTone === 'gold' || finalAnswers.sanctuaryMood === 'heritage') {
setSelectedTheme('classic-luxury');
} else {
setSelectedTheme('minimalist-modern');
}

// Determine Budget
if (finalAnswers.budgetComfort) {
setBudget(parseInt(finalAnswers.budgetComfort, 10));
}

// Determine Shower
if (finalAnswers.waterRitual === 'steam') {
setSingleSelection('shower', 'shower-steam');
} else if (finalAnswers.waterRitual === 'digital') {
setSingleSelection('shower', 'shower-digital');
} else {
setSingleSelection('shower', 'shower-rainpanel');
}
};

const handleRestart = () => {
setStepIndex(0);
setAnswers({});
setRecommendationReady(false);
};

return (
<div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
<div className="text-center space-y-2">
<span className="text-sm font-mono uppercase tracking-[0.2em] text-accent font-bold">
03 — Conversational Intake
</span>
<h2 className="font-serif text-xl sm:text-2xl lg:text-3xl text-ink font-bold">
Consult the AI Spatial Designer
</h2>
<p className="text-stone-dark text-base sm:text-lg font-medium max-w-2xl mx-auto leading-relaxed">
An adaptive architectural consultation. Rather than rigid checkboxes, tell the AI your daily habits, tactile finish preferences, and spatial aspirations.
</p>
</div>

{!recommendationReady ? (
<div className="bg-white border border-stone/20 rounded-sm shadow-editorial p-6 sm:p-8 space-y-6">
{/* Progress Indicator */}
<div className="flex items-center justify-between text-sm font-mono font-bold text-stone-dark border-b border-stone/15 pb-4">
<span>Intake Phase 0{stepIndex + 1} of 0{steps.length}</span>
<span className="text-accent font-bold">{Math.round(((stepIndex + 1) / steps.length) * 100)}% Complete</span>
</div>

{/* Question */}
<div className="space-y-4">
<h3 className="font-serif text-xl sm:text-2xl text-ink font-bold">
{steps[stepIndex].question}
</h3>

{/* Options */}
<div className="grid grid-cols-1 gap-3 pt-2">
{steps[stepIndex].options.map((opt, i) => (
<button
key={i}
onClick={() => handleSelectOption(opt.value)}
className="w-full text-left p-4 sm:p-5 bg-porcelain/40 hover:bg-porcelain-warm border border-stone/20 hover:border-accent rounded-sm transition-all duration-200 group flex items-start justify-between gap-4"
>
<div className="space-y-1">
<div className="font-serif text-base sm:text-lg font-bold text-ink group-hover:text-accent transition-colors">
{opt.label}
</div>
<div className="text-sm text-stone-dark font-medium leading-relaxed">
{opt.detail}
</div>
</div>
<ArrowRight size={18} className="text-ink group-hover:text-accent group-hover:translate-x-1 transition-all shrink-0 mt-1" />
</button>
))}
</div>
</div>
</div>
) : (
/* Recommendation Card */
<div className="bg-white border border-accent/40 rounded-sm shadow-luxury p-8 space-y-6 animate-scale-up">
<div className="flex items-center gap-2 text-accent font-mono text-sm uppercase tracking-wider font-bold">
<Sparkles size={16} />
<span>AI Spatial Diagnostic Complete</span>
</div>

<div className="space-y-2">
<h3 className="font-serif text-2xl sm:text-3xl text-ink font-bold">
Tailored Architecture: {answers.finishTone === 'black' ? 'Japanese Zen Sanctuary' : answers.finishTone === 'gold' ? 'Classic Luxury Pavilion' : 'Minimalist Precision Bath'}
</h3>
<p className="text-base text-stone-dark font-medium leading-relaxed">
Based on your stated desire for <span className="text-ink font-bold">{answers.waterRitual}</span> hydrotherapy, <span className="text-ink font-bold">{answers.finishTone}</span> metallurgy, and your investment target of <span className="text-ink font-bold">₹{parseInt(answers.budgetComfort || '400000').toLocaleString('en-IN')}</span>, the AI Designer has synthesized a foundational suite:
</p>
</div>

{/* Recommended Trio */}
<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
<div className="p-4 bg-porcelain-warm rounded-sm border border-stone/20">
<span className="text-xs font-mono text-stone-dark uppercase font-bold block">Hydro Anchor</span>
<h5 className="font-serif text-base font-bold text-ink mt-1">
{answers.waterRitual === 'steam' ? 'Steam Shower Cabin' : answers.waterRitual === 'digital' ? 'Digital Shower System' : 'Rain Panel'}
</h5>
</div>
<div className="p-4 bg-porcelain-warm rounded-sm border border-stone/20">
<span className="text-xs font-mono text-stone-dark uppercase font-bold block">Hygiene Core</span>
<h5 className="font-serif text-base font-bold text-ink mt-1">
{parseInt(answers.budgetComfort || '0') > 300000 ? 'Smart Commode' : 'Wall-Hung Commode'}
</h5>
</div>
<div className="p-4 bg-porcelain-warm rounded-sm border border-stone/20">
<span className="text-xs font-mono text-stone-dark uppercase font-bold block">Sculptural Focal</span>
<h5 className="font-serif text-base font-bold text-ink mt-1">
{answers.finishTone === 'gold' ? 'Bridge Faucet in French Gold' : answers.finishTone === 'black' ? 'Wall-Mount Mixer in Matte Black' : 'Waterfall Mixer in Chrome'}
</h5>
</div>
</div>

<div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-stone/20">
<button
onClick={handleRestart}
className="text-sm font-mono uppercase font-bold text-ink hover:text-accent flex items-center gap-2"
>
<RotateCcw size={16} />
<span>Retake Intake</span>
</button>

<button
onClick={() => {
setActiveStep(2);
if (onProceedToConfigurator) onProceedToConfigurator();
}}
className="w-full sm:w-auto px-8 py-4 bg-ink hover:bg-ink-muted text-white text-sm font-mono uppercase tracking-widest font-bold flex items-center justify-center gap-2 shadow-md transition-colors"
>
<span>Launch 2D & 3D Spatial Model</span>
<ArrowRight size={16} />
</button>
</div>
</div>
)}
</div>
);
};
