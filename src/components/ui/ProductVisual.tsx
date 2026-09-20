import React, { useState } from 'react';
import { ProductItem } from '../../data/products';
import { getApprovedProductImage } from '../../data/assets';
import { IMAGE_MAP } from '../../data/imageMap';

interface ProductVisualProps {
  product: ProductItem;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showPhoto?: boolean;
}

export const ProductVisual: React.FC<ProductVisualProps> = ({ 
  product, 
  className = '', 
  size = 'md',
  showPhoto = true
}) => {
  const { category, id, finishCode, finishColor } = product;
  const initialUrl = IMAGE_MAP[id] || getApprovedProductImage(id) || product.imageUrl || '';
  const [photoUrl, setPhotoUrl] = useState<string>(initialUrl);
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageError = () => {
    // If primary failed, try approved asset fallback or product.imageUrl before falling back to SVG
    const fallback = getApprovedProductImage(id) || product.imageUrl;
    if (fallback && photoUrl !== fallback) {
      setPhotoUrl(fallback);
    } else {
      setImageError(true);
    }
  };

  const heightClass = 
    size === 'sm' ? 'h-36' : 
    size === 'md' ? 'h-56 sm:h-64' : 
    size === 'lg' ? 'h-72 sm:h-80' : 'h-80';

  const renderGraphic = () => {
    switch (category) {
      case 'shower':
        if (id === 'shower-digital') {
          return (
            <svg viewBox="0 0 200 200" className="w-full h-full p-4 drop-shadow-md">
              <defs>
                <linearGradient id="chromeGlass" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
                  <stop offset="50%" stopColor="#DCE4EC" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#9AAEC4" stopOpacity="0.7" />
                </linearGradient>
                <linearGradient id="wallPanel" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#252A30" />
                  <stop offset="100%" stopColor="#14171A" />
                </linearGradient>
                <radialGradient id="sprayCone" cx="50%" cy="0%" r="90%">
                  <stop offset="0%" stopColor="#A8C7EB" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#A8C7EB" stopOpacity="0.0" />
                </radialGradient>
              </defs>
              <rect x="75" y="15" width="50" height="12" rx="4" fill="url(#chromeGlass)" />
              <rect x="96" y="27" width="8" height="25" fill="#8C98A4" />
              <polygon points="100,52 60,160 140,160" fill="url(#sprayCone)" />
              <rect x="135" y="80" width="36" height="56" rx="6" fill="url(#wallPanel)" stroke="#8C98A4" strokeWidth="1.5" />
              <rect x="141" y="88" width="24" height="20" rx="2" fill="#0C1520" />
              <text x="153" y="102" fill="#64B5F6" fontSize="10" fontFamily="sans-serif" textAnchor="middle" fontWeight="bold">38°C</text>
              <circle cx="147" cy="122" r="3" fill="#AE8A4E" />
              <circle cx="159" cy="122" r="3" fill="#8C98A4" />
              <path d="M 40,70 L 40,125" stroke="#9AAEC4" strokeWidth="4" strokeLinecap="round" />
              <rect x="36" y="55" width="8" height="20" rx="3" fill="url(#chromeGlass)" />
            </svg>
          );
        } else if (id === 'shower-rainpanel') {
          return (
            <svg viewBox="0 0 200 200" className="w-full h-full p-4 drop-shadow-md">
              <defs>
                <linearGradient id="rainMetal" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#BCC5CE" />
                  <stop offset="50%" stopColor="#FFFFFF" />
                  <stop offset="100%" stopColor="#9BAAB8" />
                </linearGradient>
              </defs>
              <polygon points="40,40 160,40 180,65 20,65" fill="url(#rainMetal)" opacity="0.9" />
              <rect x="25" y="65" width="150" height="6" rx="2" fill="#718091" />
              {[40, 60, 80, 100, 120, 140, 160].map((x, i) => (
                <g key={i}>
                  <line x1={x} y1="75" x2={x} y2="105" stroke="#9AC0E6" strokeWidth="2" strokeDasharray="3 4" opacity="0.8" />
                  <line x1={x - 5} y1="115" x2={x - 5} y2="155" stroke="#9AC0E6" strokeWidth="1.5" strokeDasharray="2 5" opacity="0.6" />
                </g>
              ))}
            </svg>
          );
        } else if (id === 'shower-thermostatic') {
          return (
            <svg viewBox="0 0 200 200" className="w-full h-full p-4 drop-shadow-md">
              <defs>
                <linearGradient id="frenchGold" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#F5E4B5" />
                  <stop offset="40%" stopColor="#C49E5A" />
                  <stop offset="100%" stopColor="#8C6A2E" />
                </linearGradient>
              </defs>
              <path d="M 80,170 L 80,45 Q 80,30 95,30 L 125,30" fill="none" stroke="url(#frenchGold)" strokeWidth="6" strokeLinecap="round" />
              <ellipse cx="125" cy="35" rx="22" ry="7" fill="url(#frenchGold)" />
              <rect x="68" y="110" width="24" height="42" rx="4" fill="url(#frenchGold)" />
              <circle cx="68" cy="120" r="7" fill="url(#frenchGold)" stroke="#684E20" strokeWidth="1" />
              <circle cx="68" cy="140" r="7" fill="url(#frenchGold)" stroke="#684E20" strokeWidth="1" />
              <circle cx="105" cy="85" r="9" fill="url(#frenchGold)" />
              <circle cx="105" cy="108" r="9" fill="url(#frenchGold)" />
            </svg>
          );
        } else {
          return (
            <svg viewBox="0 0 200 200" className="w-full h-full p-4 drop-shadow-md">
              <defs>
                <linearGradient id="steamGlass" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#2D3339" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#12161A" stopOpacity="0.8" />
                </linearGradient>
              </defs>
              <rect x="50" y="30" width="100" height="140" rx="4" fill="url(#steamGlass)" stroke="#262A2E" strokeWidth="3" />
              <line x1="140" y1="30" x2="140" y2="170" stroke="#3D454D" strokeWidth="2" />
              <rect x="135" y="90" width="4" height="20" rx="2" fill="#AE8A4E" />
              <circle cx="100" cy="100" r="28" fill="#38BDF8" opacity="0.15" />
              <circle cx="100" cy="100" r="14" fill="#38BDF8" opacity="0.25" />
            </svg>
          );
        }

      case 'toilet':
        return (
          <svg viewBox="0 0 200 200" className="w-full h-full p-4 drop-shadow-md">
            <defs>
              <linearGradient id="ceramicShine" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="60%" stopColor="#F1F5F9" />
                <stop offset="100%" stopColor="#CBD5E1" />
              </linearGradient>
            </defs>
            <rect x="65" y="40" width="70" height="35" rx="4" fill="url(#ceramicShine)" stroke="#94A3B8" strokeWidth="1.5" />
            <ellipse cx="100" cy="115" rx="35" ry="42" fill="url(#ceramicShine)" stroke="#94A3B8" strokeWidth="1.5" />
            <ellipse cx="100" cy="115" rx="22" ry="28" fill="#E2E8F0" />
            <circle cx="90" cy="55" r="4" fill="#64748B" />
            <circle cx="110" cy="55" r="6" fill="#3B82F6" />
          </svg>
        );

      case 'faucet':
        return (
          <svg viewBox="0 0 200 200" className="w-full h-full p-4 drop-shadow-md">
            <path d="M 85,160 L 85,70 Q 85,45 105,45 L 125,45 Q 135,45 135,55 L 135,75" fill="none" stroke="#AE8A4E" strokeWidth="12" strokeLinecap="round" />
            <rect x="75" y="160" width="20" height="8" rx="2" fill="#64748B" />
            <line x1="85" y1="105" x2="60" y2="90" stroke="#AE8A4E" strokeWidth="7" strokeLinecap="round" />
          </svg>
        );

      case 'lighting':
        return (
          <svg viewBox="0 0 200 200" className="w-full h-full p-4 drop-shadow-md">
            <circle cx="100" cy="100" r="45" fill="#FEF3C7" opacity="0.4" />
            <circle cx="100" cy="100" r="30" fill="#FDE68A" opacity="0.6" />
            <circle cx="100" cy="100" r="18" fill="#F59E0B" />
            <circle cx="100" cy="100" r="6" fill="#FFFFFF" />
          </svg>
        );

      case 'flooring':
        return (
          <svg viewBox="0 0 200 200" className="w-full h-full p-4 drop-shadow-md">
            <rect x="40" y="40" width="120" height="120" rx="4" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1.5" />
            <line x1="40" y1="100" x2="160" y2="100" stroke="#94A3B8" strokeWidth="1.5" />
            <line x1="100" y1="40" x2="100" y2="160" stroke="#94A3B8" strokeWidth="1.5" />
            <path d="M 50,60 Q 80,80 70,120" stroke="#CBD5E1" strokeWidth="3" fill="none" opacity="0.6" />
            <path d="M 110,65 Q 140,85 130,135" stroke="#CBD5E1" strokeWidth="3" fill="none" opacity="0.6" />
          </svg>
        );

      case 'vanity':
        return (
          <svg viewBox="0 0 200 200" className="w-full h-full p-4 drop-shadow-md">
            <rect x="40" y="60" width="120" height="90" rx="4" fill="#334155" stroke="#1E293B" strokeWidth="2" />
            <rect x="36" y="55" width="128" height="10" rx="2" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1" />
            <ellipse cx="100" cy="58" rx="28" ry="5" fill="#E2E8F0" />
            <line x1="100" y1="65" x2="100" y2="150" stroke="#1E293B" strokeWidth="1.5" />
            <rect x="65" y="80" width="14" height="4" rx="1" fill="#AE8A4E" />
            <rect x="120" y="80" width="14" height="4" rx="1" fill="#AE8A4E" />
          </svg>
        );

      default:
        return (
          <svg viewBox="0 0 200 200" className="w-full h-full p-4 drop-shadow-md">
            <circle cx="100" cy="100" r="50" fill="#F8FAFC" stroke="#AE8A4E" strokeWidth="3" />
            <circle cx="100" cy="100" r="46" fill="#E0F2FE" opacity="0.5" />
          </svg>
        );
    }
  };

  const hasValidPhoto = showPhoto && photoUrl && !imageError;

  return (
    <div className={`w-full ${heightClass} bg-porcelain-warm/60 border-b border-stone/15 flex items-center justify-center relative overflow-hidden transition-all duration-300 group ${className}`}>
      {/* Photography View with Architectural Image Fallback */}
      {hasValidPhoto ? (
        <div className="w-full h-full relative">
          <img
            src={photoUrl}
            alt={product.name}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            onError={handleImageError}
            className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-porcelain-warm">
              {renderGraphic()}
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        </div>
      ) : (
        renderGraphic()
      )}

      {/* Finish Swatch Tag */}
      <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-porcelain/95 backdrop-blur-xs px-2.5 py-1 rounded border border-stone/25 shadow-xs">
        <span 
          className="w-3 h-3 rounded-full border border-black/15 shrink-0" 
          style={{ backgroundColor: finishColor || '#C49E5A' }} 
        />
        <span className="text-xs tracking-wider uppercase font-mono text-ink font-semibold">
          {finishCode}
        </span>
      </div>

      {/* Lead Time & Complexity Tag */}
      <div className="absolute top-3 right-3 text-xs font-mono uppercase tracking-wider text-stone-dark font-semibold bg-white/95 px-2 py-1 rounded border border-stone/25 shadow-xs">
        {product.tier}
      </div>
    </div>
  );
};
