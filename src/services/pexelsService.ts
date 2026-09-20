/**
 * Pexels API Service
 * Fetches generic, unbranded stock photography for product/theme catalog cards.
 * Implements persistent local storage caching and graceful fallback.
 */

const PEXELS_CACHE_KEY = 'kohler_spatia_pexels_cache_v1';

interface PexelsPhoto {
  id: number;
  src: {
    medium: string;
    large: string;
    small: string;
    tiny: string;
  };
  alt: string;
}

interface PexelsResponse {
  photos: PexelsPhoto[];
  total_results: number;
}

// In-memory cache synced with localStorage
let memoryCache: Record<string, string> = {};

try {
  const cached = localStorage.getItem(PEXELS_CACHE_KEY);
  if (cached) {
    memoryCache = JSON.parse(cached);
  }
} catch (e) {
  console.warn('Pexels cache initialization failed:', e);
}

const saveCache = () => {
  try {
    localStorage.setItem(PEXELS_CACHE_KEY, JSON.stringify(memoryCache));
  } catch (e) {
    // Ignore storage quota limits
  }
};

/**
 * Curated high-aesthetic fallback photography links (Unbranded architectural stock)
 * Ensures that even when an API key is not configured, the interface renders
 * gorgeous editorial photography immediately instead of plain blank boxes.
 */
export const CURATED_STOCK_FALLBACKS: Record<string, string> = {
  // Shower
  'shower-digital': 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80',
  'shower-rainpanel': 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=600&auto=format&fit=crop&q=80',
  'shower-thermostatic': 'https://images.unsplash.com/photo-1595846519845-68e298c2edd8?w=600&auto=format&fit=crop&q=80',
  'shower-steam': 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=600&auto=format&fit=crop&q=80',

  // Toilet
  'toilet-wallhung': 'https://images.unsplash.com/photo-1584622781564-1d987f7333c1?w=600&auto=format&fit=crop&q=80',
  'toilet-smart': 'https://images.unsplash.com/photo-1564540586988-aa4e53c3d799?w=600&auto=format&fit=crop&q=80',
  'toilet-floormounted': 'https://images.unsplash.com/photo-1585058177579-247514336c56?w=600&auto=format&fit=crop&q=80',
  'toilet-onepiece': 'https://images.unsplash.com/photo-1584622781867-1c70e303bc3a?w=600&auto=format&fit=crop&q=80',

  // Faucet
  'faucet-waterfall': 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80',
  'faucet-singlelever': 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&auto=format&fit=crop&q=80',
  'faucet-wallmount': 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=600&auto=format&fit=crop&q=80',
  'faucet-bridge': 'https://images.unsplash.com/photo-1604709177225-055f99402ea3?w=600&auto=format&fit=crop&q=80',

  // Lighting
  'light-downlight': 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80',
  'light-backlit': 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&auto=format&fit=crop&q=80',
  'light-cove': 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=600&auto=format&fit=crop&q=80',
  'light-vanitytask': 'https://images.unsplash.com/photo-1540518614846-7ede433c4ef0?w=600&auto=format&fit=crop&q=80',

  // Flooring
  'floor-marble': 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80',
  'floor-mattestone': 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=600&auto=format&fit=crop&q=80',
  'floor-woodtile': 'https://images.unsplash.com/photo-1533779283484-84e1b833217b?w=600&auto=format&fit=crop&q=80',
  'floor-terrazzo': 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&auto=format&fit=crop&q=80',

  // Vanity
  'vanity-floating': 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80',
  'vanity-freestanding': 'https://images.unsplash.com/photo-1604709177225-055f99402ea3?w=600&auto=format&fit=crop&q=80',
  'vanity-doublebasin': 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=600&auto=format&fit=crop&q=80',

  // Mirror & Extras
  'extra-mirror': 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&auto=format&fit=crop&q=80',
  'extra-glass': 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=600&auto=format&fit=crop&q=80',
  'extra-ventilation': 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80'
};

/**
 * Fetches generic unbranded stock photo for a product from Pexels API
 * or falls back to curated stock imagery / fallback swatch.
 */
export async function fetchProductStockImage(productId: string, query: string): Promise<string> {
  // Check memory / local cache first
  if (memoryCache[productId]) {
    return memoryCache[productId];
  }

  const apiKey = (import.meta as any).env?.VITE_PEXELS_API_KEY;
  if (!apiKey || apiKey.trim() === '' || apiKey === 'your_pexels_api_key_here') {
    // Return curated architectural stock image or fallback
    const fallback = CURATED_STOCK_FALLBACKS[productId] || '';
    if (fallback) {
      memoryCache[productId] = fallback;
      saveCache();
      return fallback;
    }
    return '';
  }

  try {
    const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1&orientation=square`;
    const response = await fetch(url, {
      headers: {
        Authorization: apiKey
      }
    });

    if (!response.ok) {
      throw new Error(`Pexels API error: ${response.status}`);
    }

    const data: PexelsResponse = await response.json();
    if (data.photos && data.photos.length > 0) {
      const photoUrl = data.photos[0].src.medium || data.photos[0].src.large;
      memoryCache[productId] = photoUrl;
      saveCache();
      return photoUrl;
    }
  } catch (error) {
    console.warn(`Pexels fetch failed for "${query}":`, error);
  }

  // Graceful fallback
  const fallback = CURATED_STOCK_FALLBACKS[productId] || '';
  if (fallback) {
    memoryCache[productId] = fallback;
    saveCache();
    return fallback;
  }

  return '';
}

/**
 * Returns cached image URL if available synchronously
 */
export function getCachedProductImage(productId: string): string {
  return memoryCache[productId] || CURATED_STOCK_FALLBACKS[productId] || '';
}
