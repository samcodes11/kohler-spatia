import React, { createContext, useContext, useState, useEffect } from 'react';
import { ProductItem, PRODUCT_MAP } from '../data/products';
import { useAuth } from './AuthContext';

export interface CartItem {
  product: ProductItem;
  quantity: number;
}

interface CartWishlistContextType {
  cartItems: CartItem[];
  wishlistIds: string[];
  isCartOpen: boolean;
  isWishlistOpen: boolean;
  totalCartAmount: number;
  totalItemsCount: number;
  addToCart: (productOrId: ProductItem | string, quantity?: number) => boolean;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (productOrId: ProductItem | string) => boolean;
  isInWishlist: (productId: string) => boolean;
  openCart: () => void;
  closeCart: () => void;
  openWishlist: () => void;
  closeWishlist: () => void;
  checkoutSuccess: boolean;
  simulateCheckout: () => void;
  resetCheckoutSuccess: () => void;
}

const CartWishlistContext = createContext<CartWishlistContextType | undefined>(undefined);

const CART_KEY = 'kohler_spatia_cart';
const WISHLIST_KEY = 'kohler_spatia_wishlist';

export const CartWishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, openAuthModal } = useAuth();

  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem(CART_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    const saved = localStorage.getItem(WISHLIST_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlistIds));
  }, [wishlistIds]);

  const totalCartAmount = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity, 
    0
  );

  const totalItemsCount = cartItems.reduce(
    (sum, item) => sum + item.quantity, 
    0
  );

  const getProduct = (productOrId: ProductItem | string): ProductItem | undefined => {
    return typeof productOrId === 'string' ? PRODUCT_MAP[productOrId] : productOrId;
  };

  const addToCart = (productOrId: ProductItem | string, quantity = 1): boolean => {
    if (!isAuthenticated) {
      openAuthModal('cart');
      return false;
    }

    const prod = getProduct(productOrId);
    if (!prod) return false;

    setCartItems(prev => {
      const existing = prev.find(item => item.product.id === prod.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === prod.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product: prod, quantity }];
    });

    setIsCartOpen(true);
    return true;
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const toggleWishlist = (productOrId: ProductItem | string): boolean => {
    if (!isAuthenticated) {
      openAuthModal('wishlist');
      return false;
    }

    const prod = getProduct(productOrId);
    if (!prod) return false;

    setWishlistIds(prev => {
      if (prev.includes(prod.id)) {
        return prev.filter(id => id !== prod.id);
      } else {
        return [...prev, prod.id];
      }
    });

    return true;
  };

  const isInWishlist = (productId: string) => wishlistIds.includes(productId);

  const simulateCheckout = () => {
    setCheckoutSuccess(true);
    clearCart();
    setIsCartOpen(false);
  };

  const resetCheckoutSuccess = () => setCheckoutSuccess(false);

  return (
    <CartWishlistContext.Provider
      value={{
        cartItems,
        wishlistIds,
        isCartOpen,
        isWishlistOpen,
        totalCartAmount,
        totalItemsCount,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleWishlist,
        isInWishlist,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
        openWishlist: () => setIsWishlistOpen(true),
        closeWishlist: () => setIsWishlistOpen(false),
        checkoutSuccess,
        simulateCheckout,
        resetCheckoutSuccess
      }}
    >
      {children}
    </CartWishlistContext.Provider>
  );
};

export const useCartWishlist = () => {
  const context = useContext(CartWishlistContext);
  if (!context) throw new Error('useCartWishlist must be used within a CartWishlistProvider');
  return context;
};
