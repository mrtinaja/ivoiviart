"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCart = exports.CartProvider = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
// Crea el contexto
const CartContext = (0, react_1.createContext)(undefined);
const CartProvider = ({ children, }) => {
    // Al iniciar, se recupera el carrito del localStorage o se utiliza un arreglo vacío
    const [cart, setCart] = (0, react_1.useState)(() => {
        const storedCart = localStorage.getItem("cart");
        return storedCart ? JSON.parse(storedCart) : [];
    });
    // Guardar en localStorage cada vez que el carrito cambie
    (0, react_1.useEffect)(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);
    const addToCart = (item) => {
        setCart((prevCart) => [
            ...prevCart,
            { ...item, cartId: Date.now() + Math.random() }, // ID único basado en timestamp
        ]);
    };
    // Elimina solo la primera ocurrencia del item con el id dado
    const removeFromCart = (id) => {
        setCart((prevCart) => {
            const index = prevCart.findIndex((item) => item.id === id);
            if (index === -1)
                return prevCart;
            return [...prevCart.slice(0, index), ...prevCart.slice(index + 1)];
        });
    };
    const clearCart = () => {
        setCart([]);
    };
    return ((0, jsx_runtime_1.jsx)(CartContext.Provider, { value: { cart, addToCart, removeFromCart, clearCart }, children: children }));
};
exports.CartProvider = CartProvider;
const useCart = () => {
    const context = (0, react_1.useContext)(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};
exports.useCart = useCart;
