import React from 'react';
import { useCartWishlist } from '../../context/CartWishlistContext';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, CheckCircle2 } from 'lucide-react';
import { ProductVisual } from '../ui/ProductVisual';

export const CartDrawer: React.FC = () => {
  const { 
    isCartOpen, 
    closeCart, 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    totalCartAmount, 
    totalItemsCount,
    simulateCheckout,
    checkoutSuccess,
    resetCheckoutSuccess
  } = useCartWishlist();

  if (!isCartOpen) return null;

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-ink/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-md bg-porcelain h-full shadow-2xl flex flex-col border-l border-stone/20 animate-slide-left relative"
      >
        {/* Drawer Header */}
        <div className="p-6 border-b border-stone/20 flex items-center justify-between bg-porcelain-warm/50">
          <div className="flex items-center gap-3">
            <ShoppingBag size={22} className="text-ink" />
            <h2 className="font-serif text-2xl tracking-tight text-ink font-bold">Your Project Cart</h2>
            <span className="text-sm font-mono font-bold bg-porcelain px-2.5 py-1 rounded border border-stone/30 text-ink">
              {totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'}
            </span>
          </div>
          <button 
            onClick={closeCart} 
            className="p-1.5 text-stone hover:text-ink transition-colors"
            aria-label="Close cart"
          >
            <X size={22} />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {checkoutSuccess ? (
            <div className="text-center py-12 px-4 space-y-4">
              <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto text-accent mb-2">
                <CheckCircle2 size={36} />
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl text-ink font-bold">Specification Reserved</h3>
              <p className="text-base text-stone-dark font-medium leading-relaxed">
                Your luxury fixture order reservation has been dispatched to Kohler Experience Center India. A senior spatial consultant will coordinate white-glove logistics.
              </p>
              <div className="p-4 bg-porcelain-warm border border-stone/30 text-sm text-left font-mono space-y-2 mt-4">
                <div className="text-stone-dark">Order Reference: <span className="text-ink font-bold">KS-2026-SP984</span></div>
                <div className="text-stone-dark">AI Care Assistant: <span className="text-accent font-bold">Activated in Dashboard</span></div>
              </div>
              <button
                onClick={resetCheckoutSuccess}
                className="w-full py-3.5 bg-ink text-white text-sm uppercase tracking-widest font-bold hover:bg-ink-muted transition-colors mt-4"
              >
                Continue Designing
              </button>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-16 px-4">
              <div className="w-16 h-16 rounded-full bg-porcelain-warm border border-stone/20 flex items-center justify-center text-stone mb-4">
                <ShoppingBag size={32} />
              </div>
              <p className="font-serif text-2xl text-ink font-bold mb-2">Uh oh, cart is empty</p>
              <p className="text-base text-stone-dark font-medium max-w-xs mb-6 leading-relaxed">
                Explore our curated lookbooks or launch the bathroom spatial configurator to select hand-crafted fixtures.
              </p>
              <button
                onClick={closeCart}
                className="px-7 py-3 border-2 border-ink text-sm uppercase tracking-widest font-bold text-ink hover:bg-ink hover:text-white transition-colors"
              >
                Browse Catalog
              </button>
            </div>
          ) : (
            cartItems.map(({ product, quantity }) => (
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
                      <h4 className="font-serif text-base font-bold text-ink leading-tight truncate">
                        {product.name}
                      </h4>
                      <p className="text-xs font-mono font-semibold text-stone-dark mt-0.5 truncate">
                        {product.finishName}
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromCart(product.id)}
                      className="text-stone hover:text-red-700 transition-colors p-1"
                      aria-label="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-stone/10">
                    <div className="flex items-center border border-stone/30 rounded-sm bg-porcelain-warm/50">
                      <button
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        className="px-2.5 py-1 text-ink font-bold hover:text-accent text-sm transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="px-2.5 text-sm font-mono font-bold text-ink">{quantity}</span>
                      <button
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        className="px-2.5 py-1 text-ink font-bold hover:text-accent text-sm transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <span className="font-mono text-base font-bold text-ink">
                      {formatPrice(product.price * quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer */}
        {!checkoutSuccess && cartItems.length > 0 && (
          <div className="p-6 border-t border-stone/20 bg-porcelain-warm/70 space-y-4">
            <div className="space-y-2 text-sm font-mono font-medium">
              <div className="flex justify-between text-stone-dark">
                <span>Subtotal ({totalItemsCount} items)</span>
                <span className="font-bold text-ink">{formatPrice(totalCartAmount)}</span>
              </div>
              <div className="flex justify-between text-stone-dark">
                <span>Direct Architectural Freight</span>
                <span className="text-accent font-bold">Complimentary</span>
              </div>
              <div className="flex justify-between text-base text-ink font-bold pt-2.5 border-t border-stone/30">
                <span>Estimated Investment</span>
                <span>{formatPrice(totalCartAmount)}</span>
              </div>
            </div>

            <button
              onClick={simulateCheckout}
              className="w-full py-4 bg-ink hover:bg-ink-muted text-white font-bold text-sm tracking-widest uppercase flex items-center justify-center gap-2 transition-all duration-200 shadow-md group"
            >
              <span>Reserve Specification</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
