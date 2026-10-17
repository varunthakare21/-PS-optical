import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { cartAPI } from '../../services/api';
import { Cart, CartItem } from '../../types';
import { useAuth } from '../auth/AuthContext';

interface CartContextType {
  cart: Cart | null;
  itemCount: number;
  isLoading: boolean;
  addItem: (data: any) => Promise<void>;
  updateItem: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
  subtotal: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const refreshCart = async () => {
    try {
      setIsLoading(true);
      const res = await cartAPI.getCart();
      setCart(res.data.data);
    } catch { setCart(null); }
    finally { setIsLoading(false); }
  };

  useEffect(() => { refreshCart(); }, [user]);

  const addItem = async (data: any) => {
    await cartAPI.addItem(data);
    await refreshCart();
  };

  const updateItem = async (itemId: string, quantity: number) => {
    await cartAPI.updateItem(itemId, { quantity });
    await refreshCart();
  };

  const removeItem = async (itemId: string) => {
    await cartAPI.removeItem(itemId);
    await refreshCart();
  };

  const clearCart = async () => {
    await cartAPI.clearCart();
    setCart(null);
  };

  const itemCount = cart?.items?.reduce((sum, item: CartItem) => sum + item.quantity, 0) || 0;
  const subtotal = cart?.items?.reduce((sum, item: CartItem) => sum + item.unitPrice * item.quantity, 0) || 0;

  return (
    <CartContext.Provider value={{ cart, itemCount, isLoading, addItem, updateItem, removeItem, clearCart, refreshCart, subtotal }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
