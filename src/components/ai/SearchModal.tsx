import React, { useState, useMemo } from 'react';
import { PRODUCTS, PRODUCT_MAP, ProductItem } from '../../data/products';
import { Search, X, Sparkles, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCartWishlist } from '../../context/CartWishlistContext';
import { ProductVisual } from '../ui/ProductVisual';

interface SearchModalProps {
isOpen: boolean;
onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
const [query, setQuery] = useState('');
const { addToCart } = useCartWishlist();

// Filter matching products
const matchingProducts = useMemo(() => {
if (!query.trim()) return [];
const q = query.toLowerCase();
return PRODUCTS.filter(p => 
p.name.toLowerCase().includes(q) ||
p.category.toLowerCase().includes(q) ||
p.finishName.toLowerCase().includes(q) ||
p.tier.toLowerCase().includes(q) ||
p.description.toLowerCase().includes(q)
);
}, [query]);

// AI Cross-Category Pairing Suggestions based on matches
const pairingSuggestions = useMemo(() => {
if (matchingProducts.length === 0) return [];
const primary = matchingProducts[0];
// Gather crossSellIds and match items in complementary categories
const pairedIds = primary.crossSellIds || [];
return pairedIds.map(id => PRODUCT_MAP[id]).filter(Boolean) as ProductItem[];
}, [matchingProducts]);

if (!isOpen) return null;

return (
<div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-ink/70 backdrop-blur-sm animate-fade-in">
<div className="w-full max-w-3xl bg-porcelain border border-stone/30 shadow-luxury rounded-sm overflow-hidden flex flex-col max-h-[85vh]">
{/* Search Input Bar */}
<div className="p-4 border-b border-stone/20 flex items-center gap-3 bg-white">
<Search size={20} className="text-stone" />
<input
type="text"
autoFocus
value={query}
onChange={e => setQuery(e.target.value)}
placeholder="Search fixtures, finishes (e.g. Rain Panel, French Gold, Steam, Basalt)..."
className="flex-1 text-base text-ink placeholder:text-stone focus:outline-none bg-transparent"
/>
{query && (
<button 
onClick={() => setQuery('')}
className="text-stone hover:text-ink text-xs uppercase font-mono px-2 py-1"
>
Clear
</button>
)}
<button 
onClick={onClose}
className="p-1.5 text-stone hover:text-ink transition-colors"
>
<X size={20} />
</button>
</div>

{/* Search Results Area */}
<div className="flex-1 overflow-y-auto p-6 space-y-6">
{!query.trim() ? (
<div className="text-center py-10 space-y-3">
<p className="text-base font-serif text-ink font-bold">Explore by Curated Keyword</p>
<div className="flex flex-wrap justify-center gap-2.5 max-w-lg mx-auto">
{['Digital Shower', 'Vibrant French Gold', 'Smart Commode', 'Matte Black', 'Waterfall Mixer', 'Marble Finish'].map((tag, i) => (
<button
key={i}
onClick={() => setQuery(tag)}
className="px-3.5 py-2 bg-porcelain-warm hover:bg-stone/20 border border-stone/30 text-xs font-mono font-bold text-ink rounded-sm transition-colors"
>
{tag}
</button>
))}
</div>
</div>
) : matchingProducts.length === 0 ? (
<div className="text-center py-12">
<p className="font-serif text-xl text-ink font-bold mb-2">No products found for "{query}"</p>
<p className="text-sm text-stone-dark font-medium">Try searching for categories like "shower", "faucet", or finishes like "gold" or "black".</p>
</div>
) : (
<>
{/* Primary Matching Products */}
<div>
<div className="flex items-center justify-between mb-3">
<h3 className="text-sm font-mono uppercase tracking-wider font-bold text-ink">
Matching Products ({matchingProducts.length})
</h3>
</div>
<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
{matchingProducts.map(prod => (
<div 
key={prod.id} 
className="p-3.5 bg-white border border-stone/30 rounded-sm flex gap-3.5 items-center hover:border-accent transition-all duration-200"
>
<div className="w-16 h-16 bg-porcelain-warm border border-stone/15 rounded-sm overflow-hidden shrink-0 flex items-center justify-center">
<ProductVisual product={prod} size="sm" className="h-16" />
</div>
<div className="flex-1 min-w-0">
<span className="text-[11px] font-mono uppercase text-stone-dark font-bold tracking-wider block">
{prod.tier} · {prod.category}
</span>
<h4 className="font-serif text-base font-bold text-ink leading-snug truncate mt-0.5">
{prod.name}
</h4>
<div className="flex items-center justify-between mt-1.5">
<span className="text-sm font-mono font-bold text-ink">
₹{prod.price.toLocaleString('en-IN')}
</span>
<button
onClick={() => addToCart(prod.id)}
className="p-1.5 bg-porcelain-warm hover:bg-ink hover:text-white text-ink rounded-sm transition-colors"
aria-label="Add to cart"
>
<ShoppingBag size={15} />
</button>
</div>
</div>
</div>
))}
</div>
</div>

{/* AI Cross-Category Pairing Suggestions */}
{pairingSuggestions.length > 0 && (
<div className="p-4.5 bg-porcelain-warm border border-accent/40 rounded-sm mt-4">
<div className="flex items-center gap-2 mb-3">
<Sparkles size={18} className="text-accent" />
<h3 className="font-serif text-base font-bold text-ink">
AI Spatial Pairing Suggestions
</h3>
<span className="text-xs font-mono text-stone-dark font-bold uppercase tracking-wider bg-white px-2 py-0.5 rounded border border-stone/30">
Cross-Category Synergy
</span>
</div>
<p className="text-sm text-stone-dark font-medium mb-3">
Based on your search for <span className="font-bold text-ink">"{matchingProducts[0].name}"</span>, Spatia AI identifies harmonizing fixtures for an integrated architectural finish:
</p>
<div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
{pairingSuggestions.map(paired => (
<div key={paired.id} className="p-3 bg-white border border-stone/20 rounded-sm flex flex-col justify-between">
<div>
<span className="text-[10px] font-mono uppercase tracking-wider text-accent font-bold block">
Pairs with {paired.category}
</span>
<div className="font-serif text-sm font-bold text-ink truncate mt-1">
{paired.name}
</div>
<div className="text-xs font-mono font-medium text-stone-dark truncate mt-0.5">
{paired.finishName}
</div>
</div>
<div className="flex items-center justify-between mt-2.5 pt-2 border-t border-stone/15">
<span className="text-xs font-mono font-bold text-ink">
₹{paired.price.toLocaleString('en-IN')}
</span>
<button
onClick={() => addToCart(paired.id)}
className="text-xs uppercase font-mono font-bold text-accent hover:underline flex items-center gap-1"
>
<span>Add</span>
<ArrowRight size={12} />
</button>
</div>
</div>
))}
</div>
</div>
)}
</>
)}
</div>
</div>
</div>
);
};
