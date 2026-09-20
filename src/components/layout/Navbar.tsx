import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCartWishlist } from '../../context/CartWishlistContext';
import { Search, Heart, ShoppingBag, User, Sparkles, Menu, X } from 'lucide-react';
import { SearchModal } from '../ai/SearchModal';

interface NavbarProps {
  currentView: 'home' | 'configurator' | 'enquiries' | 'dashboard' | 'about';
  onNavigate: (view: 'home' | 'configurator' | 'enquiries' | 'dashboard' | 'about') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate }) => {
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const { totalItemsCount, wishlistIds, openCart, openWishlist } = useCartWishlist();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-porcelain/95 backdrop-blur-md editorial-border-b transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Brand Wordmark */}
          <div 
            onClick={() => onNavigate('home')} 
            className="cursor-pointer group flex items-baseline gap-2 select-none"
          >
            <span className="font-sans font-black text-2xl tracking-[0.2em] text-ink uppercase group-hover:text-accent transition-colors">
              KOHLER
            </span>
            <span className="font-sans font-light text-2xl tracking-[0.05em] text-stone-dark">
              Spatia
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={() => onNavigate('configurator')}
              className={`text-sm font-mono uppercase tracking-widest font-bold transition-colors cursor-pointer ${
                currentView === 'configurator' ? 'text-accent' : 'text-ink hover:text-accent'
              }`}
            >
              Bathroom
            </button>
            <button
              onClick={() => onNavigate('about')}
              className={`text-sm font-mono uppercase tracking-widest font-bold transition-colors cursor-pointer ${
                currentView === 'about' ? 'text-accent' : 'text-ink hover:text-accent'
              }`}
            >
              About Us
            </button>
            <button
              onClick={() => onNavigate('enquiries')}
              className={`text-sm font-mono uppercase tracking-widest font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                currentView === 'enquiries' ? 'text-accent' : 'text-ink hover:text-accent'
              }`}
            >
              <span>Ask Enquiries</span>
              <span className="inline-flex items-center gap-0.5 text-xs bg-accent/20 text-accent px-2 py-0.5 rounded font-mono font-bold">
                <Sparkles size={12} /> AI
              </span>
            </button>
          </nav>

          {/* Action Icons */}
          <div className="flex items-center gap-4 sm:gap-5">
            {/* Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-ink hover:text-accent transition-colors relative cursor-pointer"
              aria-label="AI Search"
            >
              <Search size={20} />
            </button>

            {/* Wishlist Trigger */}
            <button
              onClick={openWishlist}
              className="p-2 text-ink hover:text-accent transition-colors relative cursor-pointer"
              aria-label="Wishlist"
            >
              <Heart size={20} />
              {wishlistIds.length > 0 && (
                <span className="absolute top-0.5 right-0.5 w-4.5 h-4.5 bg-accent text-porcelain text-xs font-mono font-bold rounded-full flex items-center justify-center">
                  {wishlistIds.length}
                </span>
              )}
            </button>

            {/* Cart Trigger */}
            <button
              onClick={openCart}
              className="p-2 text-ink hover:text-accent transition-colors relative cursor-pointer"
              aria-label="Cart"
            >
              <ShoppingBag size={20} />
              {totalItemsCount > 0 && (
                <span className="absolute top-0.5 right-0.5 w-4.5 h-4.5 bg-ink text-porcelain text-xs font-mono font-bold rounded-full flex items-center justify-center">
                  {totalItemsCount}
                </span>
              )}
            </button>

            {/* Auth / Account Trigger */}
            {isAuthenticated && user ? (
              <button
                onClick={() => onNavigate('dashboard')}
                className="flex items-center gap-2.5 pl-2.5 border-l-2 border-stone/30 hover:opacity-80 transition-opacity cursor-pointer"
                title={`Logged in as ${user.username || user.name}`}
              >
                <div className="w-8.5 h-8.5 rounded-full bg-ink text-porcelain font-mono text-xs flex items-center justify-center font-bold border border-stone/30">
                  {(user.username || user.name).charAt(0).toUpperCase()}
                </div>
                <span className="hidden lg:inline text-sm font-mono text-ink font-bold max-w-[130px] truncate">
                  {user.username || user.name}
                </span>
              </button>
            ) : (
              <button
                onClick={() => openAuthModal('general')}
                className="hidden sm:flex items-center gap-1.5 px-4 py-2 border-2 border-ink text-xs sm:text-sm font-mono uppercase tracking-widest text-ink hover:bg-ink hover:text-porcelain transition-all duration-200 font-bold rounded-sm cursor-pointer"
              >
                <User size={15} />
                <span>LOG IN</span>
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-ink"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t-2 border-stone/20 bg-porcelain px-6 py-4 space-y-3">
            <button
              onClick={() => { onNavigate('configurator'); setMobileMenuOpen(false); }}
              className="block w-full text-left text-sm font-mono uppercase tracking-widest py-2 text-ink font-bold"
            >
              Bathroom Configurator
            </button>
            <button
              onClick={() => { onNavigate('about'); setMobileMenuOpen(false); }}
              className="block w-full text-left text-sm font-mono uppercase tracking-widest py-2 text-ink font-bold"
            >
              About Us
            </button>
            <button
              onClick={() => { onNavigate('enquiries'); setMobileMenuOpen(false); }}
              className="block w-full text-left text-sm font-mono uppercase tracking-widest py-2 text-ink font-bold flex items-center justify-between"
            >
              <span>Ask Enquiries</span>
              <span className="text-xs bg-accent/20 text-accent px-2 py-0.5 rounded font-mono font-bold">AI</span>
            </button>
            {!isAuthenticated && (
              <button
                onClick={() => { openAuthModal('general'); setMobileMenuOpen(false); }}
                className="w-full mt-2 py-3 bg-ink text-porcelain text-xs sm:text-sm font-mono uppercase tracking-widest text-center font-bold rounded-sm"
              >
                Sign In / Register
              </button>
            )}
          </div>
        )}
      </header>

      {/* AI Search Modal */}
      <SearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />
    </>
  );
};
