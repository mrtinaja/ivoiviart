import { jsx as _jsx, jsxs as _jsxs } from "preact/jsx-runtime";
// src/pages/CartPage.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import axios from "axios";
import TrashButton from "../components/TrashButton";
import { motion, AnimatePresence } from "framer-motion";
// Paleta
const BG = "#0b1111";
const PANEL = "#0f1b1b";
const BORDER = "rgba(255,255,255,0.08)";
const INK = "#eae8e6";
const SUBTLE = "#cfd2d1";
const BRAND = "#0d777b";
const DARK = "#000000";
const NEUTRAL = "#1f2a2a";
// Placeholder inline (sin CORS/404)
const FALLBACK_IMG = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><rect width='100%' height='100%' fill='%23161a1d'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%23a1a1a1' font-family='sans-serif' font-size='12'>sin imagen</text></svg>";
// Base de API: usa /api (proxy) o env
const API_BASE = import.meta.env.VITE_API_BASE || "/api";
const api = axios.create({ baseURL: API_BASE, timeout: 12000 });
const CartPage = () => {
    const { cart, removeFromCart, clearCart } = useCart();
    const [loading, setLoading] = useState(false);
    const [itemsToRemove, setItemsToRemove] = useState([]);
    const total = cart.reduce((acc, item) => acc + (item.price || 0), 0);
    const handleRemove = (id) => {
        setItemsToRemove((prev) => [...prev, id]);
        setTimeout(() => {
            removeFromCart(id);
            setItemsToRemove((prev) => prev.filter((x) => x !== id));
        }, 300);
    };
    const handlePay = async () => {
        if (cart.length === 0) {
            alert("El carrito está vacío.");
            return;
        }
        setLoading(true);
        try {
            const payload = {
                items: cart.map((p) => ({
                    title: p.description || "Producto",
                    unit_price: Number(p.price || 0),
                    quantity: 1,
                    currency_id: "ARS",
                })),
            };
            const res = await api.post("/create-preference", payload);
            const { init_point, id } = res.data || {};
            const url = init_point ||
                (id
                    ? `https://www.mercadopago.com.ar/checkout/v1/redirect?preference_id=${id}`
                    : null);
            if (!url)
                throw new Error("Respuesta inválida del servidor de pagos.");
            window.location.href = url;
        }
        catch (e) {
            console.error("Error al procesar el pago:", e);
            const msg = e?.code === "ERR_NETWORK"
                ? "No pude conectar con el servidor de pagos. ¿Está levantado el backend?"
                : e?.response?.data?.error?.message ||
                    e?.response?.data?.message ||
                    e?.message ||
                    "No se pudo iniciar el pago.";
            alert(msg);
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsx("div", { className: "min-h-screen w-full pt-24 pb-16", style: { backgroundColor: BG, color: INK }, children: _jsxs("div", { className: "max-w-5xl mx-auto px-4", children: [_jsx("div", { className: "mb-6", children: _jsx(Link, { to: "/", className: "text-sm tracking-wide", style: { color: SUBTLE }, children: "\u2190 Volver a la Galer\u00EDa" }) }), _jsx("h1", { className: "text-3xl md:text-4xl font-extrabold mb-8", children: "Tu carrito" }), _jsx("div", { className: "w-full shadow-xl", style: { backgroundColor: PANEL, border: `1px solid ${BORDER}` }, children: cart.length === 0 ? (_jsxs("div", { className: "p-10 text-center", children: [_jsx("p", { className: "text-base md:text-lg", style: { color: SUBTLE }, children: "No hay productos en el carrito." }), _jsx(Link, { to: "/", className: "inline-block mt-6 px-6 py-3 font-semibold shadow-lg hover:opacity-90 transition", style: { backgroundColor: DARK, color: INK, border: `1px solid ${BORDER}` }, children: "Explorar productos" })] })) : (_jsxs("div", { className: "p-4 md:p-6", children: [_jsx("ul", { children: _jsx(AnimatePresence, { initial: false, children: cart.map((product, idx) => (_jsxs(motion.li, { layout: true, initial: { opacity: 0, scale: 0.95, y: 8 }, animate: { opacity: 1, scale: 1, y: 0 }, exit: { opacity: 0, scale: 0.9, x: -80 }, transition: { duration: 0.25 }, className: "flex items-center gap-4 md:gap-6 py-4 border-b", style: { borderColor: BORDER }, children: [_jsx("img", { src: product.images?.[0] || FALLBACK_IMG, alt: product.description, onError: (e) => {
                                                    e.currentTarget.src = FALLBACK_IMG;
                                                }, className: "w-20 h-20 object-cover", style: { border: `1px solid ${BORDER}` } }), _jsx("div", { className: "flex-1 min-w-0", children: _jsx("p", { className: "text-base md:text-lg truncate", children: product.description }) }), _jsx("div", { className: "text-right", children: _jsxs("p", { className: "text-lg md:text-xl font-semibold", children: ["$", Number(product.price || 0).toLocaleString("es-AR")] }) }), _jsx("div", { className: "pl-2", children: _jsx(TrashButton, { onClick: () => handleRemove(product.id), disabled: itemsToRemove.includes(product.id) }) })] }, `${product.id}-${idx}`))) }) }), _jsxs("div", { className: "pt-6 border-t", style: { borderColor: BORDER }, children: [_jsxs("div", { className: "flex items-end justify-between mb-4", children: [_jsx("span", { style: { color: SUBTLE }, children: "Subtotal" }), _jsxs("span", { className: "text-2xl md:text-3xl font-bold", children: ["$", total.toLocaleString("es-AR")] })] }), _jsxs("div", { className: "grid grid-cols-1 gap-3 md:flex md:justify-end", children: [_jsx("button", { onClick: clearCart, className: "w-full md:w-auto px-6 py-3 font-semibold shadow-lg hover:opacity-90 transition", style: { backgroundColor: NEUTRAL, color: INK, border: `1px solid ${BORDER}` }, children: "Vaciar carrito" }), _jsx(Link, { to: "/", className: "w-full md:w-auto px-6 py-3 text-center font-semibold shadow-lg hover:opacity-90 transition", style: { backgroundColor: DARK, color: INK, border: `1px solid ${BORDER}` }, children: "Seguir comprando" }), _jsx("button", { onClick: handlePay, disabled: loading, className: "w-full md:w-auto px-6 py-3 font-semibold shadow-lg hover:opacity-90 transition disabled:opacity-60", style: { backgroundColor: BRAND, color: "#fff", border: `1px solid ${BORDER}` }, children: loading ? "Procesando…" : "Pagar con Mercado Pago" })] })] })] })) })] }) }));
};
export default CartPage;
