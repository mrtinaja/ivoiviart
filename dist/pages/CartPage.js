"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
const CartContext_1 = require("../context/CartContext");
const axios_1 = __importDefault(require("axios"));
const TrashButton_1 = __importDefault(require("../components/TrashButton"));
const CartPage = () => {
    const { cart, removeFromCart, clearCart } = (0, CartContext_1.useCart)();
    const [loading, setLoading] = (0, react_1.useState)(false);
    // Calcular el total del carrito
    const total = cart.reduce((acc, item) => acc + (item.price || 0), 0);
    // Función para procesar el pago
    const handlePay = async () => {
        if (cart.length === 0)
            return alert("El carrito está vacío.");
        setLoading(true);
        try {
            const response = await axios_1.default.post("http://localhost:8080/create-preference", {
                items: cart.map((product) => ({
                    title: product.description,
                    unit_price: product.price,
                    quantity: 1,
                })),
            });
            // Redirigir a Mercado Pago
            window.location.href = `https://www.mercadopago.com.ar/checkout/v1/redirect?preference_id=${response.data.id}`;
        }
        catch (error) {
            console.error("Error al procesar el pago:", error);
        }
        finally {
            setLoading(false);
        }
    };
    return ((0, jsx_runtime_1.jsx)("div", { className: "min-h-screen bg-gray-100 p-10", children: (0, jsx_runtime_1.jsxs)("div", { className: "max-w-4xl mx-auto bg-white p-10 rounded-lg shadow-lg", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-full max-w-4xl", children: (0, jsx_runtime_1.jsx)(react_router_dom_1.Link, { to: "/", className: " text-gray-800 hover:underline text-lg font-semibold", children: "\u2190 Volver a la Galer\u00EDa" }) }), (0, jsx_runtime_1.jsx)("h1", { className: "text-4xl font-bold text-gray-800 mb-8 text-center", style: {
                        height: "72px",
                        overflow: "hidden",
                        fontFamily: "'Dancing Script', cursive",
                    }, children: "\uD83D\uDED2 Tu Carrito" }), cart.length === 0 ? ((0, jsx_runtime_1.jsx)("p", { className: "text-center text-gray-600 text-xl", children: "No hay productos en el carrito." })) : ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("ul", { children: cart.map((product) => ((0, jsx_runtime_1.jsxs)("li", { className: "flex items-center justify-between border-b py-6", children: [(0, jsx_runtime_1.jsx)("img", { src: `/${product.images[0]}`, alt: product.description, onError: (e) => {
                                            e.currentTarget.onerror = null;
                                            e.currentTarget.src = "/img/default.jpg";
                                        }, className: "w-20 h-20 object-cover rounded-md shadow-sm" }), (0, jsx_runtime_1.jsx)("p", { className: "text-xl text-yellow-700 flex-1 mx-6", children: product.description }), (0, jsx_runtime_1.jsxs)("p", { className: "text-purple-600-700 text-2xl p-4", children: ["$", product.price] }), (0, jsx_runtime_1.jsx)(TrashButton_1.default, { onClick: () => removeFromCart(product.id) })] }, product.id))) }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-8 text-right pt-4 border-t", children: [(0, jsx_runtime_1.jsxs)("h2", { className: "text-3xl font-bold mt-2 tracking-wide bg-gradient-to-r from-[#71ccd1] via-[#005e63] to-[#2a8290] bg-clip-text text-transparent drop-shadow-xl", style: { WebkitTextStroke: "1px white" }, children: ["Total: $ ", total.toLocaleString()] }), (0, jsx_runtime_1.jsx)("button", { onClick: clearCart, className: "relative overflow-hidden mt-4 px-3 py-2 text-base font-semibold text-white rounded-md bg-red-700", children: "Vaciar carrito" })] }), (0, jsx_runtime_1.jsx)("div", { className: "mt-8 text-right", children: (0, jsx_runtime_1.jsx)(react_router_dom_1.Link, { to: "/", className: "relative overflow-hidden px-3 py-2 text-base font-semibold text-white rounded-md bg-gradient-to-r from-[#71ccd1] via-[#005e63] to-[#2a8290]  shadow-lg transition-all duration-300 hover:from-[#005e63] hover:via-[#90442a] hover:to-[#005e63] active:scale-95 focus:outline-none inline-block mt-6", children: "Seguir comprando" }) }), (0, jsx_runtime_1.jsx)("div", { className: "mt-8 text-center", children: (0, jsx_runtime_1.jsx)("button", { onClick: handlePay, className: "relative overflow-hidden px-3 py-2 text-base font-semibold text-black rounded-md bg-gradient-to-r from-[#009ee3] via-[#04e9f5] to-[#009ee3] shadow-lg transition-all duration-300 hover:from-[#04e9f5] hover:via-[#009ee3] hover:to-[#04e9f5] active:scale-95 focus:outline-none inline-block mt-6", disabled: loading, children: loading ? "Procesando..." : "Pagar con Mercado Pago" }) })] }))] }) }));
};
exports.default = CartPage;
