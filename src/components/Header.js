import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "preact/jsx-runtime";
// src/components/Header.tsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaWhatsapp, FaShoppingCart, FaHome, FaInfoCircle, FaEnvelope, } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../context/CartContext";
/** WhatsApp */
const WHATSAPP = "+5491166742221";
const openWhatsapp = () => {
    const url = `https://wa.me/${WHATSAPP.replace("+", "")}`;
    window.open(url, "_blank");
};
/** Botón hamburguesa animado (bars -> X) */
const Burger = ({ open, onClick, }) => {
    return (_jsxs("button", { onClick: onClick, "aria-label": open ? "Cerrar menú" : "Abrir menú", className: "md:hidden relative w-11 h-11 grid place-items-center rounded-full bg-black/30 hover:bg-black/40 transition-colors", children: [_jsx("span", { className: `absolute block h-[2px] w-6 bg-white transition-all duration-300 ${open ? "rotate-45 translate-y-0" : "-translate-y-[6px]"}` }), _jsx("span", { className: `absolute block h-[2px] w-6 bg-white transition-opacity duration-200 ${open ? "opacity-0" : "opacity-100"}` }), _jsx("span", { className: `absolute block h-[2px] w-6 bg-white transition-all duration-300 ${open ? "-rotate-45 translate-y-0" : "translate-y-[6px]"}` })] }));
};
const fanItems = [
    { type: "link", to: "/", label: "Inicio", icon: _jsx(FaHome, {}) },
    { type: "link", to: "/acerca", label: "Acerca", icon: _jsx(FaInfoCircle, {}) },
    { type: "link", to: "/contacto", label: "Contacto", icon: _jsx(FaEnvelope, {}) },
    { type: "action", onClick: openWhatsapp, label: "WhatsApp", icon: _jsx(FaWhatsapp, {}) },
];
const Header = () => {
    const { cart } = useCart();
    const { pathname } = useLocation();
    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef(null);
    // Cerrar al navegar, escape o click fuera
    React.useEffect(() => setOpen(false), [pathname]);
    React.useEffect(() => {
        const onKey = (e) => e.key === "Escape" && setOpen(false);
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);
    React.useEffect(() => {
        if (!open)
            return;
        const onDown = (e) => {
            if (!anchorRef.current)
                return;
            if (!anchorRef.current.contains(e.target))
                setOpen(false);
        };
        document.addEventListener("mousedown", onDown);
        return () => document.removeEventListener("mousedown", onDown);
    }, [open]);
    // Evitar scroll de fondo cuando el abanico está abierto
    React.useEffect(() => {
        document.documentElement.style.overflow = open ? "hidden" : "";
        return () => {
            document.documentElement.style.overflow = "";
        };
    }, [open]);
    // Geometría del abanico (abre hacia abajo/izquierda)
    const R = 120;
    const angleStart = (110 * Math.PI) / 180; // 110°–170° → cos<0 (izq), sin>0 (abajo)
    const angleEnd = (170 * Math.PI) / 180;
    const angles = fanItems.length === 1
        ? [Math.PI * 0.75]
        : fanItems.map((_, i) => {
            const t = i / (fanItems.length - 1);
            return angleStart + t * (angleEnd - angleStart);
        });
    return (_jsxs(_Fragment, { children: [_jsx("nav", { className: "\r\n          fixed top-0 w-full z-50 text-white shadow-lg\r\n          bg-gradient-to-b from-[#005e63] via-[#043b3e] to-[#000000]\r\n          backdrop-blur-[2px] h-[96px] sm:h-[112px] flex items-center\r\n        ", children: _jsxs("div", { className: "max-w-6xl mx-auto flex justify-between items-center w-full px-4", children: [_jsxs("div", { className: "flex items-center", children: [_jsx(Link, { to: "/", className: "hover:opacity-90 transition-opacity", children: _jsx("img", { src: "/logo.jpg", alt: "logo", className: "h-14 w-14 sm:h-16 sm:w-16 rounded-full ring-2 ring-white/20" }) }), _jsx("h2", { className: "text-3xl font-bold text-white/95 hidden sm:block tracking-wide ml-4", children: "IvoiviArt" })] }), _jsxs("div", { className: "hidden md:flex items-center gap-8 font-semibold", children: [_jsx(Link, { to: "/", className: "hover:text-white text-white/95", children: "Inicio" }), _jsx(Link, { to: "/acerca", className: "hover:text-white text-white/95", children: "Acerca" }), _jsx(Link, { to: "/contacto", className: "hover:text-white text-white/95", children: "Contacto" }), _jsx("button", { onClick: openWhatsapp, className: "text-2xl transition-transform hover:scale-110", "aria-label": "WhatsApp", title: "WhatsApp", children: _jsx(FaWhatsapp, {}) }), _jsxs(Link, { to: "/carrito", className: "relative text-2xl", title: "Carrito", "aria-label": "Carrito", children: [_jsx(FaShoppingCart, {}), cart.length > 0 && (_jsx("span", { className: "absolute -top-2 -right-3 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 grid place-items-center", children: cart.length }))] })] }), _jsxs("div", { className: "md:hidden relative", ref: anchorRef, children: [_jsx(Burger, { open: open, onClick: () => setOpen((v) => !v) }), _jsx(AnimatePresence, { children: open && (_jsx(motion.div, { className: "fixed inset-0 z-40 bg-black/40", initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }, "overlay")) }), _jsx(AnimatePresence, { children: open && (_jsxs(motion.div, { className: "absolute z-50", style: { right: 0, top: 0 }, initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.12 }, children: [_jsx("div", { className: "absolute right-0 top-0 translate-x-[6px] -translate-y-[6px]", children: _jsxs(Link, { to: "/carrito", onClick: () => setOpen(false), className: "relative grid place-items-center w-12 h-12 rounded-full bg-black/70 text-white shadow-lg", "aria-label": "Carrito", title: "Carrito", children: [_jsx(FaShoppingCart, {}), cart.length > 0 && (_jsx("span", { className: "absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold rounded-full w-4 h-4 grid place-items-center", children: cart.length }))] }) }), fanItems.map((item, i) => {
                                                const x = Math.cos(angles[i]) * R; // cos<0 → izquierda
                                                const y = Math.sin(angles[i]) * R; // sin>0 → abajo
                                                return (_jsx(motion.div, { className: "absolute right-0 top-0", initial: { x: 0, y: 0, scale: 0.5, opacity: 0 }, animate: { x, y, scale: 1, opacity: 1 }, exit: { x: 0, y: 0, scale: 0.5, opacity: 0 }, transition: {
                                                        type: "spring",
                                                        stiffness: 320,
                                                        damping: 22,
                                                        delay: 0.02 * i,
                                                    }, children: item.type === "link" ? (_jsxs(Link, { to: item.to, onClick: () => setOpen(false), className: "flex items-center gap-2 pl-3 pr-3 py-2 rounded-full bg-[#0b2e30] text-white shadow-md border border-white/10", children: [_jsx("span", { className: "text-lg", children: item.icon }), _jsx("span", { className: "text-sm font-medium", children: item.label })] })) : (_jsxs("button", { onClick: () => {
                                                            item.onClick();
                                                            setOpen(false);
                                                        }, className: "flex items-center gap-2 pl-3 pr-3 py-2 rounded-full bg-[#0b2e30] text-white shadow-md border border-white/10", children: [_jsx("span", { className: "text-lg", children: item.icon }), _jsx("span", { className: "text-sm font-medium", children: item.label })] })) }, i));
                                            })] }, "fan")) })] })] }) }), _jsx("div", { className: "\r\n          fixed top-[96px] sm:top-[112px] left-0 w-full z-40\r\n          h-[3px] sm:h-[4px]\r\n          bg-gradient-to-r from-[#e6c105] via-[#fff] to-[#e6c105] opacity-80\r\n        " }), _jsx("div", { className: "h-[96px] sm:h-[112px]" })] }));
};
export default Header;
