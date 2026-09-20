import React from 'react';
import { useCartWishlist } from '../../context/CartWishlistContext';
import { PRODUCT_MAP } from '../../data/products';
import { X, Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { ProductVisual } from '../ui/ProductVisual';

export const WishlistDrawer: React.FC = () => {
  const { 
    isWishlistOpen, 
    closeWishlist, 
    wishlistIds, 
    toggleWishlist, 
    addToCart 
  } = useCartWishlist();

  if (!isWishlistOpen) return null;

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const wishlistProducts = wishlistIds
    .map(id => PRODUCT_MAP[id])
    .filter(Boolean);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-ink/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-md bg-porcelain h-full shadow-2xl flex flex-col border-l border-stone/20 animate-slide-left relative"
      >
        {/* Drawer Header */}
        <div className="p-6 border-b border-stone/20 flex items-center justify-between bg-porcelain-warm/50">
          <div className="flex items-center gap-3">
            <Heart size={22} className="text-red-800 fill-red-800" />
            <h2 className="font-serif text-2xl tracking-tight text-ink font-bold">Saved Finishes & Fixtures</h2>
            <span className="text-sm font-mono font-bold bg-porcelain px-2.5 py-1 rounded border border-stone/30 text-ink">
              {wishlistProducts.length}
            </span>
          </div>
          <button 
            onClick={closeWishlist} 
            className="p-1.5 text-stone hover:text-ink transition-colors"
            aria-label="Close wishlist"
          >
            <X size={22} />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {wishlistProducts.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-16 px-4">
              <div className="w-16 h-16 rounded-full bg-porcelain-warm border border-stone/20 flex items-center justify-center text-stone mb-4">
                <Heart size={32} />
              </div>
              <p className="font-serif text-2xl text-ink font-bold mb-2">Uh oh, no liked products</p>
              <p className="text-base text-stone-dark font-medium max-w-xs mb-6 leading-relaxed">
                Save your favorite Kohler Spatia fixtures, finish swatches, and lighting elements while configuring your space.
              </p>
              <button
                onClick={closeWishlist}
                className="px-7 py-3 border-2 border-ink text-sm uppercase tracking-widest font-bold text-ink hover:bg-ink hover:text-white transition-colors"
              >
                Discover Fixtures
              </button>
            </div>
          ) : (
            wishlistProducts.map(product => (
              <div 
                key={product.id} 
                className="flex gap-4 p-4 bg-white border border-stone/20 shadow-sm rounded-sm"
              >
                <div className="w-20 h-20 shrink-0 bg-porcelain-warm border border-stone/15 rounded-sm overflow-hidden flex items-center justify-center">
                  <ProductVisual product={product} size="sm" className="h-20" />
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <span className="text-xs uppercase tracking-wider font-mono font-bold px-2 py-0.5 bg-porcelain-warm text-ink rounded border border-stone/30">
                        {product.category}
                      </span>
                      <h4 className="font-serif text-base font-bold text-ink leading-tight truncate mt-1.5">
                        {product.name}
                      </h4>
                      <p className="text-xs font-mono font-semibold text-stone-dark truncate">
                        {product.finishName}
                      </p>
                    </div>
                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className="text-stone hover:text-red-700 transition-colors p-1"
                      aria-label="Remove from wishlist"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-stone/10">
                    <span className="font-mono text-base font-bold text-ink">
                      {formatPrice(product.price)}
                    </span>
                    <button
                      onClick={() => addToCart(product.id)}
                      className="flex items-center gap-1.5 px-3.5 py-2 bg-ink hover:bg-accent text-white text-xs font-mono uppercase font-bold tracking-wider transition-colors rounded-sm"
                    >
                      <ShoppingBag size={14} />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer */}
        {wishlistProducts.length > 0 && (
          <div className="p-4 border-t border-stone/20 bg-porcelain-warm/70 text-center">
            <button
              onClick={() => {
                wishlistProducts.forEach(p => addToCart(p.id));
                closeWishlist();
              }}
              className="w-full py-3.5 bg-ink hover:bg-ink-muted text-white font-bold text-sm tracking-widest uppercase flex items-center justify-center gap-2 transition-colors shadow-md"
            >
              <span>Move All to Project Cart</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
