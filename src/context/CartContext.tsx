import React, { createContext, useContext, useState, useEffect } from "react";

// Define el tipo para los items del carrito
export interface CartItem {
  id: number;
  price: number;
  images: string[];
  description: string;
}

// Define la interfaz del contexto
interface CartContextProps {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
}

// Crea el contexto
const CartContext = createContext<CartContextProps | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Al iniciar, se recupera el carrito del localStorage o se utiliza un arreglo vacío
  const [cart, setCart] = useState<CartItem[]>(() => {
    const storedCart = localStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : [];
  });

  // Guardar en localStorage cada vez que el carrito cambie
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item: CartItem) => {
    setCart((prevCart) => [
      ...prevCart,
      { ...item, cartId: Date.now() + Math.random() }, // ID único basado en timestamp
    ]);
  };

  // Elimina solo la primera ocurrencia del item con el id dado
  const removeFromCart = (id: number) => {
    setCart((prevCart) => {
      const index = prevCart.findIndex((item) => item.id === id);
      if (index === -1) return prevCart;
      return [...prevCart.slice(0, index), ...prevCart.slice(index + 1)];
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
