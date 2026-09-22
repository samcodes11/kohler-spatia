import React, { useState } from 'react';
import { ThemeId } from '../../data/themes';
import { PRODUCT_MAP } from '../../data/products';
import { ProductVisual } from '../ui/ProductVisual';
import { useCartWishlist } from '../../context/CartWishlistContext';
import { 
ShoppingBag, 
Heart, 
ArrowRight, 
Sparkles, 
Compass, 
Sliders, 
X, 
Check, 
Layers 
} from 'lucide-react';
import { useConfigurator } from '../../context/ConfiguratorContext';
import { CURATED_COLLECTIONS, ORDERED_COLLECTION_IDS, CollectionHotspot, SubThemeId } from '../../data/collectionCuration';

interface Path02Props {
onStartConfiguring?: () => void;
}

export const Path02CollectionsLookbook: React.FC<Path02Props> = ({ onStartConfiguring }) => {
const [activeTheme, setActiveTheme] = useState<SubThemeId>('nature-retreat');
const [activeHotspot, setActiveHotspot] = useState<CollectionHotspot | null>(null);
const [addedCartFeedback, setAddedCartFeedback] = useState<string | null>(null);

const { addToCart, toggleWishlist, isInWishlist } = useCartWishlist();
const { applyCuratedCollection, setActiveStep } = useConfigurator();

const currentCollection = CURATED_COLLECTIONS[activeTheme] || CURATED_COLLECTIONS['nature-retreat'];
const curatedProducts = currentCollection.curatedProductIds
.map(id => PRODUCT_MAP[id])
.filter(Boolean);

const formatPrice = (val: number) => {
return new Intl.NumberFormat('en-IN', {
style: 'currency',
currency: 'INR',
maximumFractionDigits: 0
}).format(val);
};

const handleConfigureIn3D = (themeId: SubThemeId) => {
const col = CURATED_COLLECTIONS[themeId];
applyCuratedCollection(themeId, col.recommendedFixtures, col.wallFinishId);
setActiveStep(3);
if (onStartConfiguring) onStartConfiguring();
};

const handleBuildMyVersion = (themeId: SubThemeId) => {
const col = CURATED_COLLECTIONS[themeId];
applyCuratedCollection(themeId, col.recommendedFixtures, col.wallFinishId);
setActiveStep(2);
if (onStartConfiguring) onStartConfiguring();
};

const handleAddHotspotToCart = (productId: string) => {
addToCart(productId);
setAddedCartFeedback(productId);
setTimeout(() => setAddedCartFeedback(null), 2200);
};

return (
<div className="py-6 sm:py-8 space-y-8 animate-fade-in w-full">
{/* Editorial Header */}
<div className="text-center max-w-3xl mx-auto space-y-2">
<span className="text-xs font-mono uppercase tracking-[0.2em] text-accent font-bold">
02 — Curated Lookbook
</span>
<h2 className="font-serif text-xl sm:text-2xl lg:text-3xl text-ink font-bold">
Collections by Finish Narrative
</h2>
<p className="text-stone-dark text-xs sm:text-sm font-medium leading-relaxed">
Five original architectural compositions curated across signature signature metallic tones. Explore room hotspots, inspect hand-curated specifications, or launch into 3D.
</p>
</div>

{/* 5 Clickable Sub-Theme Navigation Tabs (A1) */}
<div className="flex justify-center border-b border-stone/20">
<div className="flex gap-2 sm:gap-4 overflow-x-auto pb-[-1px]">
{ORDERED_COLLECTION_IDS.map(themeId => {
const col = CURATED_COLLECTIONS[themeId];
const isActive = activeTheme === themeId;
return (
<button
key={col.id}
onClick={() => {
setActiveTheme(col.id);
setActiveHotspot(null);
}}
className={`pb-3 px-3.5 text-left transition-all duration-200 border-b-2 flex flex-col items-center sm:items-start cursor-pointer ${
isActive
? 'border-accent text-ink'
: 'border-transparent text-stone-dark hover:text-ink'
}`}
>
<span className="text-[9px] font-mono uppercase tracking-widest text-accent font-bold">
{col.parentTheme}
</span>
<span className={`text-xs sm:text-sm font-mono uppercase tracking-wider ${
isActive ? 'font-bold text-ink' : 'font-semibold text-stone-dark'
}`}>
{col.name}
</span>
</button>
);
})}
</div>
</div>

{/* Interactive Room Hero with Hotspot Markers (A4) */}
<div className="relative border-2 border-stone/30 shadow-luxury rounded-sm overflow-hidden bg-white">
<div className="relative aspect-[16/9] sm:aspect-[21/9] w-full overflow-hidden bg-stone/20">
<img
src={currentCollection.heroImage}
alt={currentCollection.name}
className="w-full h-full object-cover object-center"
loading="eager"
/>
<div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent pointer-events-none" />

{/* Issue Tag */}
<div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-3 py-1 rounded-xs border border-stone/30 text-[10px] sm:text-xs font-mono uppercase tracking-widest text-ink font-bold shadow-xs">
{currentCollection.parentTheme} · {currentCollection.name}
</div>

{/* Interactive Hotspot Markers (A4) */}
{currentCollection.hotspots.map((hs, idx) => {
const product = PRODUCT_MAP[hs.productId];
const isSelected = activeHotspot?.id === hs.id;
return (
<div
key={hs.id}
style={{ top: `${hs.y}%`, left: `${hs.x}%` }}
className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
>
<button
type="button"
onClick={() => setActiveHotspot(isSelected ? null : hs)}
className={`relative w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center cursor-pointer transition-transform hover:scale-110 shadow-lg ${
isSelected ? 'bg-accent text-white scale-110 ring-4 ring-accent/40' : 'bg-white/95 text-ink hover:bg-accent hover:text-white'
}`}
aria-label={`Inspect ${hs.label}`}
>
<span className="font-mono text-xs font-bold">{idx + 1}</span>
<span className="absolute inset-0 rounded-full bg-accent/40 animate-ping pointer-events-none" />
</button>

{/* Hotspot Product Popover */}
{isSelected && product && (
<div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-40 w-64 p-3.5 bg-white border border-stone/30 shadow-luxury rounded-sm space-y-2 animate-fade-in text-left">
<div className="flex items-start justify-between gap-2 border-b border-stone/15 pb-1.5">
<div>
<span className="text-[9px] font-mono uppercase text-accent font-bold block">
{product.category} · {product.tier}
</span>
<h4 className="font-serif text-xs sm:text-sm font-bold text-ink leading-snug">
{product.name}
</h4>
</div>
<button
onClick={(e) => {
e.stopPropagation();
setActiveHotspot(null);
}}
className="p-1 text-stone-dark hover:text-ink rounded-xs"
>
<X size={13} />
</button>
</div>

<div className="text-[11px] font-mono text-stone-dark">
Finish: <span className="text-ink font-bold">{product.finishName}</span>
</div>

<div className="flex items-center justify-between pt-1 font-mono text-xs">
<span className="font-bold text-ink">{formatPrice(product.price)}</span>
<button
type="button"
onClick={() => handleAddHotspotToCart(product.id)}
className={`px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider font-bold rounded-xs flex items-center gap-1 transition-colors ${
addedCartFeedback === product.id
? 'bg-green-700 text-white'
: 'bg-ink hover:bg-accent text-white'
}`}
>
{addedCartFeedback === product.id ? (
<>
<Check size={11} />
<span>Added ✓</span>
</>
) : (
<>
<ShoppingBag size={11} />
<span>Add to Cart</span>
</>
)}
</button>
</div>
</div>
)}
</div>
);
})}

{/* Caption Overlay */}
<div className="absolute bottom-4 left-4 right-4 text-porcelain flex flex-col sm:flex-row sm:items-end justify-between gap-3">
<div>
<span className="text-xs font-mono uppercase tracking-widest text-accent block font-bold mb-0.5">
Atmospheric Room Visual · Tap Pins to Inspect
</span>
<div className="font-serif text-lg sm:text-xl font-bold leading-tight drop-shadow-md">
{currentCollection.tagline}
</div>
</div>

{/* Quick CTAs on Hero Image */}
<div className="flex items-center gap-2">
<button
type="button"
onClick={() => handleConfigureIn3D(activeTheme)}
className="px-4 py-2 bg-accent hover:bg-accent-hover text-white text-xs font-mono uppercase tracking-wider font-bold rounded-sm shadow-md flex items-center gap-1.5 cursor-pointer"
>
<Compass size={14} />
<span>Configure in 3D</span>
</button>
<button
type="button"
onClick={() => handleBuildMyVersion(activeTheme)}
className="px-4 py-2 bg-white/95 hover:bg-white text-ink text-xs font-mono uppercase tracking-wider font-bold rounded-sm shadow-md flex items-center gap-1.5 cursor-pointer"
>
<Sliders size={14} />
<span>Build My Version</span>
</button>
</div>
</div>
</div>
</div>

{/* Theme Atmosphere Banner with Full Narrative & Dual CTAs */}
<div className="p-6 bg-porcelain-warm border border-stone/25 rounded-sm grid grid-cols-1 lg:grid-cols-3 gap-6 items-center shadow-xs">
<div className="lg:col-span-2 space-y-2">
<div className="inline-flex items-center gap-2 text-xs font-mono text-accent font-bold uppercase tracking-wider">
<Sparkles size={14} />
<span>Finish Spec: {currentCollection.finishes}</span>
</div>
<h3 className="font-serif text-lg sm:text-xl text-ink font-bold">
{currentCollection.tagline}
</h3>
<p className="text-xs sm:text-sm text-stone-dark font-medium leading-relaxed max-w-2xl font-sans">
{currentCollection.materialStory}
</p>
<div className="flex flex-wrap gap-3 pt-1 text-xs font-mono font-semibold text-stone-dark">
<span>Lighting: {currentCollection.lightingTemp}</span>
<span>•</span>
<span>Wall Texture: {currentCollection.wallTexture}</span>
</div>
</div>

{/* Dual Actions: Configure in 3D (A3) & Build My Version (A5) */}
<div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 justify-end">
<button
type="button"
onClick={() => handleConfigureIn3D(activeTheme)}
className="w-full px-5 py-3 bg-ink hover:bg-accent text-white text-xs font-mono uppercase tracking-widest font-bold transition-all shadow-luxury flex items-center justify-center gap-2 rounded-sm cursor-pointer"
>
<Compass size={15} />
<span>Configure in 3D</span>
<ArrowRight size={14} />
</button>

<button
type="button"
onClick={() => handleBuildMyVersion(activeTheme)}
className="w-full px-5 py-3 bg-white hover:bg-stone/10 border border-stone/30 text-ink text-xs font-mono uppercase tracking-widest font-bold transition-all flex items-center justify-center gap-2 rounded-sm cursor-pointer"
>
<Sliders size={15} className="text-accent" />
<span>Build My Version</span>
</button>
</div>
</div>

{/* Curated Catalog Spread Grid (A2: Hand-curated 7 items with minimal overlap) */}
<div className="space-y-3">
<div className="flex items-center justify-between border-b border-stone/20 pb-2">
<div className="flex items-center gap-2">
<Layers size={15} className="text-accent" />
<h3 className="font-serif text-base sm:text-lg font-bold text-ink">
Curated Fixture Specifications ({curatedProducts.length} Items)
</h3>
</div>
<span className="text-xs font-mono text-stone-dark uppercase">
{currentCollection.name} Suite
</span>
</div>

<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
{curatedProducts.map(product => (
<div 
key={product.id}
className="group bg-white border border-stone/20 hover:border-stone/40 hover:shadow-editorial transition-all duration-300 flex flex-col justify-between rounded-sm overflow-hidden"
>
<div>
{/* Product Visual */}
<div className="relative overflow-hidden">
<ProductVisual product={product} size="md" />
{/* Wishlist Button */}
<button
onClick={() => toggleWishlist(product.id)}
className="absolute top-2 right-2 p-1.5 bg-white/90 hover:bg-white text-stone-dark hover:text-red-700 rounded-full shadow-xs transition-colors"
aria-label="Save to wishlist"
>
<Heart 
size={14} 
className={isInWishlist(product.id) ? 'text-red-700 fill-red-700' : ''} 
/>
</button>
</div>

{/* Product Info */}
<div className="p-3.5 space-y-1.5">
<div className="flex items-center justify-between text-xs font-mono uppercase text-stone-dark font-bold">
<span>{product.category}</span>
<span className="flex items-center gap-1.5">
<span className={`w-2 h-2 rounded-full ${
product.tier === 'Premium' ? 'bg-amber-800' :
product.tier === 'Mid-luxury' ? 'bg-accent' : 'bg-stone'
}`} />
<span>{product.tier}</span>
</span>
</div>

<h4 className="font-serif text-sm sm:text-base font-bold text-ink group-hover:text-accent transition-colors leading-snug">
{product.name}
</h4>

<div className="text-xs font-mono text-stone-dark font-medium pt-0.5">
Finish: <span className="text-ink font-bold">{product.finishName} ({product.finishCode})</span>
</div>
</div>
</div>

{/* Price & Add to Cart */}
<div className="p-3.5 pt-2.5 border-t border-stone/15 bg-porcelain/30 flex items-center justify-between mt-1">
<span className="font-mono text-sm font-bold text-ink">
{formatPrice(product.price)}
</span>
<button
onClick={() => addToCart(product.id)}
className="flex items-center gap-1.5 px-3 py-1.5 bg-ink hover:bg-accent text-white text-xs font-mono uppercase font-bold tracking-wider transition-colors rounded-xs shadow-xs cursor-pointer"
>
<ShoppingBag size={12} />
<span>Add</span>
</button>
</div>
</div>
))}
</div>
</div>
</div>
);
};
