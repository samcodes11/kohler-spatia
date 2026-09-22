import React from 'react';
import { Linkedin, Facebook, Instagram, Youtube } from 'lucide-react';

interface FooterProps {
onNavigate?: (view: 'home' | 'configurator' | 'enquiries' | 'dashboard' | 'about') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
return (
<footer className="bg-ink text-porcelain border-t border-stone/20 pt-16 pb-12">
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

{/* Main Footer Grid */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 pb-16 border-b border-stone/20">

{/* Brand Column (Spans 2 cols) */}
<div className="lg:col-span-2 space-y-4">
<div className="flex items-baseline gap-2">
<span className="font-sans font-bold text-2xl tracking-\[0.2em\] text-porcelain uppercase">Spatia</span>
</div>
<p className="text-stone-light text-sm leading-relaxed max-w-sm font-sans">
The AI-powered bathroom spatial intelligence platform. Harmonizing architectural proportions, hydraulic engineering, and bespoke metallic finishes into private sanctuaries.
</p>
{/* Social Icons Placeholders */}
<div className="flex items-center gap-4 pt-2">
<span className="w-8 h-8 rounded-full border border-stone/40 flex items-center justify-center text-stone-light hover:text-accent hover:border-accent transition-colors cursor-pointer" aria-label="LinkedIn">
<Linkedin size={15} />
</span>
<span className="w-8 h-8 rounded-full border border-stone/40 flex items-center justify-center text-stone-light hover:text-accent hover:border-accent transition-colors cursor-pointer" aria-label="Facebook">
<Facebook size={15} />
</span>
<span className="w-8 h-8 rounded-full border border-stone/40 flex items-center justify-center text-stone-light hover:text-accent hover:border-accent transition-colors cursor-pointer" aria-label="Instagram">
<Instagram size={15} />
</span>
<span className="w-8 h-8 rounded-full border border-stone/40 flex items-center justify-center text-stone-light hover:text-accent hover:border-accent transition-colors cursor-pointer" aria-label="YouTube">
<Youtube size={15} />
</span>
</div>
</div>

{/* Col 1: Showrooms */}
<div className="space-y-3.5">
<h4 className="text-sm font-mono uppercase tracking-widest text-accent font-bold">
Showrooms
</h4>
<ul className="space-y-2.5 text-sm sm:text-base text-porcelain/85 font-sans font-medium">
<li className="hover:text-porcelain transition-colors cursor-pointer">Experience Centres</li>
<li className="hover:text-porcelain transition-colors cursor-pointer">Find a Store</li>
<li className="hover:text-porcelain transition-colors cursor-pointer">Dealer Enquiry</li>
<li className="hover:text-porcelain transition-colors cursor-pointer">Virtual Spatial Suite</li>
</ul>
</div>

{/* Col 2: Resources */}
<div className="space-y-3.5">
<h4 className="text-sm font-mono uppercase tracking-widest text-accent font-bold">
Resources
</h4>
<ul className="space-y-2.5 text-sm sm:text-base text-porcelain/85 font-sans font-medium">
<li className="hover:text-porcelain transition-colors cursor-pointer">Design Guides</li>
<li className="hover:text-porcelain transition-colors cursor-pointer">Lookbooks</li>
<li className="hover:text-porcelain transition-colors cursor-pointer">Press Room</li>
<li className="hover:text-porcelain transition-colors cursor-pointer">Journal & Essays</li>
</ul>
</div>

{/* Col 3: Support */}
<div className="space-y-3.5">
<h4 className="text-sm font-mono uppercase tracking-widest text-accent font-bold">
Support
</h4>
<ul className="space-y-2.5 text-sm sm:text-base text-porcelain/85 font-sans font-medium">
<li 
onClick={() => onNavigate && onNavigate('enquiries')}
className="hover:text-porcelain transition-colors cursor-pointer"
>
Product Enquiry
</li>
<li 
onClick={() => onNavigate && onNavigate('enquiries')}
className="hover:text-porcelain transition-colors cursor-pointer"
>
Contact Us (AI Triage)
</li>
<li className="hover:text-porcelain transition-colors cursor-pointer">Warranty Documentation</li>
<li className="hover:text-porcelain transition-colors cursor-pointer">White-Glove Returns</li>
</ul>
</div>

{/* Col 4: Company */}
<div className="space-y-3.5">
<h4 className="text-sm font-mono uppercase tracking-widest text-accent font-bold">
Company
</h4>
<ul className="space-y-2.5 text-sm sm:text-base text-porcelain/85 font-sans font-medium">
<li 
onClick={() => onNavigate && onNavigate('about')}
className="hover:text-porcelain transition-colors cursor-pointer"
>
Who We Are
</li>
<li className="hover:text-porcelain transition-colors cursor-pointer">Careers & Fellows</li>
<li className="hover:text-porcelain transition-colors cursor-pointer">Sustainability & Net Zero</li>
<li className="hover:text-porcelain transition-colors cursor-pointer">Patents & Innovation</li>
</ul>
</div>

</div>

{/* Bottom Bar with Mandatory Portfolio Case Study Disclaimer */}
<div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs sm:text-sm font-mono text-porcelain/80 font-medium">
<div>
© 2026 Spatia. Concept case study — not affiliated with any specific fixture brand.
</div>
<div className="flex gap-6">
<span className="hover:text-porcelain transition-colors cursor-pointer">Terms of Exploration</span>
<span className="hover:text-porcelain transition-colors cursor-pointer">Privacy Charter</span>
<span className="hover:text-porcelain transition-colors cursor-pointer">Architectural Accreditation</span>
</div>
</div>

</div>
</footer>
);
};
