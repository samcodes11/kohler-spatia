import React, { useState } from 'react';
import { Sparkles, Send, CheckCircle2, ArrowRight, MessageSquare, AlertCircle, RefreshCw, ArrowLeft } from 'lucide-react';

interface AiEnquiryTriageProps {
onBack?: () => void;
}

export const AiEnquiryTriage: React.FC<AiEnquiryTriageProps> = ({ onBack }) => {
const [enquiryText, setEnquiryText] = useState('');
const [clientName, setClientName] = useState('');
const [clientEmail, setClientEmail] = useState('');
const [isProcessing, setIsProcessing] = useState(false);
const [triageResult, setTriageResult] = useState<{
category: 'Installation & Rough-In' | 'Warranty & Care' | 'Product Specification' | 'Bespoke Spatial Architecture';
ticketId: string;
priority: 'Standard' | 'Elevated' | 'Priority Architect Dispatch';
autoDraftResponse: string;
routedDepartment: string;
} | null>(null);

const handleSubmit = (e: React.FormEvent) => {
e.preventDefault();
if (!enquiryText.trim()) return;

setIsProcessing(true);
setTimeout(() => {
setIsProcessing(false);
const text = enquiryText.toLowerCase();

let category: typeof triageResult extends null ? never : any = 'Product Specification';
let priority: any = 'Standard';
let routedDepartment = ' Technical Engineering Support';
let draft = '';

if (text.includes('leak') || text.includes('defect') || text.includes('scratch') || text.includes('warranty') || text.includes('peel') || text.includes('broken')) {
category = 'Warranty & Care';
priority = 'Priority Architect Dispatch';
routedDepartment = 'White-Glove Quality Assurance & Warranty Desk';
draft = `Dear ${clientName || 'Valued Patron'}, thank you for contacting Spatia Quality Support. Under signature 10-Year Limited Warranty on PVD finishes and ceramic valves, your installation is fully protected. Our technical field team in your regional metropolitan area has been notified to arrange an on-site inspection or express component replacement.`;
} else if (text.includes('plumb') || text.includes('rough-in') || text.includes('pipe') || text.includes('install') || text.includes('pressure') || text.includes('bar') || text.includes('wall cavity')) {
category = 'Installation & Rough-In';
priority = 'Elevated';
routedDepartment = 'Hydraulic Field Operations & Master Plumber Advisory';
draft = `Hello ${clientName || 'Partner'}, regarding your installation inquiry: concealed wall-hung frames require a minimum 140mm stud cavity depth and 4.0 bar dynamic pressure for optimal flush performance. A dedicated MEP installation schematic has been queued for dispatch to your registered contractor.`;
} else if (text.includes('custom') || text.includes('villa') || text.includes('penthouse') || text.includes('architect') || text.includes('layout') || text.includes('dna')) {
category = 'Bespoke Spatial Architecture';
priority = 'Priority Architect Dispatch';
routedDepartment = 'Spatia Advanced Design Studio Bangalore';
draft = `Dear ${clientName || 'Architect'}, thank you for introducing your luxury residence project. Our senior spatial intelligence fellows specialize in customized non-orthogonal room layouts and material matching. We have reserved a private virtual session at the Experience Centre.`;
} else {
category = 'Product Specification';
priority = 'Standard';
routedDepartment = 'Product Catalog & Metallurgy Inquiries';
draft = `Dear ${clientName || 'Patron'}, thank you for your query regarding Spatia specifications. All fixtures in our catalog utilize lead-free solid brass forgings and physical vapor deposition finishes exceeding industry ASTM B117 salt spray standards by 400 hours. A technical cut sheet has been generated for your review.`;
}

setTriageResult({
category,
ticketId: `KS-TRIAGE-${Math.floor(100000 + Math.random() * 900000)}`,
priority,
autoDraftResponse: draft,
routedDepartment
});
}, 1500);
};

const handleReset = () => {
setEnquiryText('');
setTriageResult(null);
};

return (
<div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-10 animate-fade-in">

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

{/* Header */}
<div className="text-center space-y-3">
<div className="inline-flex items-center gap-2 text-sm font-mono uppercase tracking-[0.2em] text-accent font-bold">
<Sparkles size={16} />
<span>Ask Enquiries — AI Triage & Direct Routing</span>
</div>
<h1 className="font-serif text-xl sm:text-2xl lg:text-3xl text-ink font-bold tracking-tight">
Intelligent Client & Trade Concierge
</h1>
<p className="text-stone-dark text-base sm:text-lg font-medium max-w-2xl mx-auto leading-relaxed">
Skip generic web forms and ticket queues. Spatia's natural language classifier reads your inquiry, identifies hydraulic/warranty context, generates immediate technical guidance, and routes directly to the certified specialist team.
</p>
</div>

{!triageResult ? (
<div className="bg-white border border-stone/20 rounded-sm p-6 sm:p-8 space-y-6 shadow-editorial">
<form onSubmit={handleSubmit} className="space-y-4">
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
<div>
<label className="block text-sm font-mono uppercase font-bold tracking-wider text-ink mb-1.5">
Your Full Name
</label>
<input
type="text"
required
value={clientName}
onChange={e => setClientName(e.target.value)}
placeholder="e.g. Architect Rahul Varma"
className="w-full px-4 py-3 text-base font-medium text-ink bg-porcelain/30 border border-stone/40 focus:border-accent focus:outline-none transition-colors rounded-sm"
/>
</div>

<div>
<label className="block text-sm font-mono uppercase font-bold tracking-wider text-ink mb-1.5">
Email Address
</label>
<input
type="email"
required
value={clientEmail}
onChange={e => setClientEmail(e.target.value)}
placeholder="rahul@varma-studio.in"
className="w-full px-4 py-3 text-base font-medium text-ink bg-porcelain/30 border border-stone/40 focus:border-accent focus:outline-none transition-colors rounded-sm"
/>
</div>
</div>

<div>
<div className="flex justify-between items-center mb-1.5">
<label className="text-sm font-mono uppercase font-bold tracking-wider text-ink">
Describe Your Enquiry, Technical Query, or Specification Request
</label>
<span className="text-xs font-mono font-bold text-stone-dark">AI analyzes context</span>
</div>
<textarea
rows={5}
required
value={enquiryText}
onChange={e => setEnquiryText(e.target.value)}
placeholder="e.g., We are installing the Digital Shower System and Steam Cabin in a guest bathroom on the 4th floor. What dynamic bar pressure and electrical breaker amperage does the contractor need to rough in?"
className="w-full p-4 text-base font-medium text-ink bg-porcelain/30 border border-stone/40 focus:border-accent focus:outline-none transition-colors rounded-sm resize-none font-sans"
/>
</div>

{/* Prompt sample chips */}
<div className="space-y-2 pt-1">
<span className="text-xs font-mono uppercase font-bold text-stone-dark block">Try sample inquiries:</span>
<div className="flex flex-wrap gap-2">
{[
"Need rough-in depth for Wall-Hung Commode in a 120mm drywall partition",
"Is the French Gold PVD finish covered against high hard-water mineral spotting?",
"Designing a 1500 sq ft luxury master villa bathroom with bespoke steam suite"
].map((sample, i) => (
<button
key={i}
type="button"
onClick={() => setEnquiryText(sample)}
className="text-left text-xs font-mono font-semibold text-stone-dark bg-porcelain-warm hover:bg-stone/20 px-3 py-1.5 rounded-sm border border-stone/30 transition-colors"
>
"{sample.slice(0, 45)}..."
</button>
))}
</div>
</div>

<button
type="submit"
disabled={isProcessing || !enquiryText.trim()}
className="w-full py-4.5 bg-ink hover:bg-ink-muted text-white text-sm font-mono uppercase tracking-widest font-bold flex items-center justify-center gap-2 shadow-luxury transition-colors disabled:opacity-50 mt-4 rounded-sm"
>
{isProcessing ? (
<>
<RefreshCw size={17} className="animate-spin text-accent" />
<span>AI Classifying Inquiry & Auto-Drafting Guidance...</span>
</>
) : (
<>
<Send size={17} className="text-accent" />
<span>Submit for Instant AI Triage & Response</span>
</>
)}
</button>
</form>
</div>
) : (
/* AI Triage & Auto-Draft Result */
<div className="bg-white border border-accent/40 rounded-sm p-6 sm:p-8 space-y-6 shadow-luxury animate-scale-up">
<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-stone/15 pb-4">
<div className="flex items-center gap-2.5">
<CheckCircle2 size={24} className="text-green-700" />
<h3 className="font-serif text-2xl font-bold text-ink">
Enquiry Successfully Triaged
</h3>
</div>
<div className="flex items-center gap-2">
<span className="text-sm font-mono bg-porcelain-warm px-3 py-1.5 rounded border border-stone/30 font-bold text-ink">
Ticket: {triageResult.ticketId}
</span>
</div>
</div>

{/* Classification Pills */}
<div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
<div className="p-3.5 bg-porcelain-warm rounded-sm border border-stone/20 space-y-1">
<span className="text-xs text-stone-dark uppercase font-bold block">Assigned Category</span>
<strong className="text-ink font-bold text-sm">{triageResult.category}</strong>
</div>

<div className="p-3.5 bg-porcelain-warm rounded-sm border border-stone/20 space-y-1">
<span className="text-xs text-stone-dark uppercase font-bold block">Triage Priority</span>
<strong className="text-accent font-bold text-sm">{triageResult.priority}</strong>
</div>

<div className="p-3.5 bg-porcelain-warm rounded-sm border border-stone/20 space-y-1">
<span className="text-xs text-stone-dark uppercase font-bold block">Routed Specialist Desk</span>
<strong className="text-ink font-bold text-sm truncate block">{triageResult.routedDepartment}</strong>
</div>
</div>

{/* Auto-Drafted Response */}
<div className="p-5 bg-porcelain border border-stone/30 rounded-sm space-y-3">
<div className="flex items-center justify-between">
<div className="flex items-center gap-2 text-sm font-mono uppercase tracking-wider text-accent font-bold">
<Sparkles size={16} />
<span>AI Auto-Drafted Technical Response</span>
</div>
<span className="text-xs font-mono font-semibold text-stone-dark">Generated in 1.4s</span>
</div>

<p className="text-base text-ink font-medium leading-relaxed font-sans whitespace-pre-line">
{triageResult.autoDraftResponse}
</p>
</div>

<div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-stone/20">
<span className="text-sm font-mono font-medium text-stone-dark">
A copy has been dispatched to <strong className="text-ink font-bold">{clientEmail || 'your email'}</strong>
</span>
<button
onClick={handleReset}
className="px-6 py-3 border-2 border-stone/40 hover:border-ink text-sm font-mono uppercase font-bold tracking-wider text-ink transition-colors rounded-sm"
>
Submit Another Enquiry
</button>
</div>
</div>
)}

</div>
);
};
