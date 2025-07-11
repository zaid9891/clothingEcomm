import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

interface CartItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    price: number;
    images: string[];
  };
  quantity: number;
  size: string;
  color: string;
}

interface CartContextType {
  items: CartItem[];
  total: number;
  addToCart: (productId: string, size: string, color: string, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
  loading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  const refreshCart = async () => {
    if (!token) {
      setItems([]);
      setTotal(0);
      return;
    }

    try {
      const response = await fetch('/api/cart', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setItems(data.items || []);
        setTotal(parseFloat(data.total || 0));
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  useEffect(() => {
    refreshCart();
  }, [token]);

  const addToCart = async (productId: string, size: string, color: string, quantity = 1) => {
    if (!token) {
      throw new Error('Please login to add items to cart');
    }

    setLoading(true);
    try {
      const response = await fetch('/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId,
          size,
          color,
          quantity,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to add to cart');
      }

      await refreshCart();
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (!token) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/cart/update/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update cart');
      }

      await refreshCart();
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (itemId: string) => {
    if (!token) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/cart/remove/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to remove from cart');
      }

      await refreshCart();
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    if (!token) return;

    setLoading(true);
    try {
      const response = await fetch('/api/cart/clear', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to clear cart');
      }

      await refreshCart();
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <CartContext.Provider value={{
      items,
      total,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      refreshCart,
      loading,
    }}>
      {children}
    </CartContext.Provider>
  );
};