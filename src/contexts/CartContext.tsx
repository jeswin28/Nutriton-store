import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Product, CartItem, fetchUserCart, saveCartItem, removeCartItem, clearUserCart } from '../lib/firebaseApi';
import { useAuth } from './AuthContext';

interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  cartTotal: number;
  loading: boolean;
  addToCart: (productId: string, quantity: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  const refreshCart = async () => {
    if (!user) {
      setCartItems([]);
      return;
    }

    setLoading(true);
    try {
      const data = await fetchUserCart(user.id);
      setCartItems(data || []);
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    refreshCart();
  }, [user]);

  const addToCart = async (productId: string, quantity: number) => {
    if (!user) {
      throw new Error('Must be logged in to add to cart');
    }

    const existingItem = cartItems.find(item => item.product_id === productId);

    if (existingItem) {
      await saveCartItem(user.id, productId, existingItem.quantity + quantity, existingItem.id);
    } else {
      await saveCartItem(user.id, productId, quantity);
    }
    await refreshCart();
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (!user) return;

    if (quantity <= 0) {
      await removeFromCart(itemId);
      return;
    }

    const existingItem = cartItems.find(item => item.id === itemId);
    if (!existingItem) return;

    await saveCartItem(user.id, existingItem.product_id, quantity, itemId);
    await refreshCart();
  };

  const removeFromCart = async (itemId: string) => {
    await removeCartItem(itemId);
    await refreshCart();
  };

  const clearCart = async () => {
    if (!user) return;
    await clearUserCart(user.id);
    await refreshCart();
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce((sum, item) => sum + (item.products.price * item.quantity), 0);

  const value = {
    cartItems,
    cartCount,
    cartTotal,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    refreshCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};