import { jsx as _jsx } from "preact/jsx-runtime";
/** @jsxImportSource preact */
import { createContext } from "preact";
import { useContext, useEffect, useState } from "preact/hooks";
const CartContext = createContext(undefined);
export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        try {
            const stored = localStorage.getItem("cart");
            return stored ? JSON.parse(stored) : [];
        }
        catch {
            return [];
        }
    });
    useEffect(() => {
        try {
            localStorage.setItem("cart", JSON.stringify(cart));
        }
        catch { }
    }, [cart]);
    const addToCart = (item) => {
        setCart((prev) => [...prev, { ...item, /* puedes agregar cartId si querés */ }]);
    };
    const removeFromCart = (id) => {
        setCart((prev) => {
            const idx = prev.findIndex((x) => x.id === id);
            if (idx < 0)
                return prev;
            return [...prev.slice(0, idx), ...prev.slice(idx + 1)];
        });
    };
    const clearCart = () => setCart([]);
    return (_jsx(CartContext.Provider, { value: { cart, addToCart, removeFromCart, clearCart }, children: children }));
};
export const useCart = () => {
    const ctx = useContext(CartContext);
    if (!ctx)
        throw new Error("useCart must be used within a CartProvider");
    return ctx;
};
