import React, { createContext, ReactNode, useContext, useState } from 'react';

export type CartItem = {
  id: string;
  name: string;
  presentation: string;
  price: number;
  description: string;
  category: string;
  prescription: boolean;
  available: boolean;
  pharmacy: string;
  quantity: number;
};

type CartContextType = {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (item: CartItem) => {
    console.log('🛒 CartContext addToCart called with:', item);
    setCartItems(prev => {
      console.log('📦 Current cartItems:', prev);
      const existing = prev.find(ci => ci.id === item.id);
      if (existing) {
        console.log('🔄 Item exists, updating quantity');
        const updated = prev.map(ci =>
          ci.id === item.id ? { ...ci, quantity: (ci.quantity || 1) + (item.quantity || 1) } : ci
        );
        console.log('📦 Updated cartItems:', updated);
        return updated;
      } else {
        console.log('🆕 New item, adding to cart');
        const newCart = [...prev, { ...item, quantity: item.quantity || 1 }];
        console.log('📦 New cartItems:', newCart);
        return newCart;
      }
    });
  };

  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(ci => ci.id !== id));
  };

  const clearCart = () => setCartItems([]);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, setCartItems }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart debe usarse dentro de <CartProvider>');
  return ctx;
}; 