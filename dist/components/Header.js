"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const Logo_jpg_1 = __importDefault(require("../assets/Logo.jpg"));
const react_router_dom_1 = require("react-router-dom");
const fa_1 = require("react-icons/fa");
const CartContext_1 = require("../context/CartContext"); // Hook del carrito
const Header = () => {
    const whatsappNumberRaw = "+5491166742221";
    const { cart } = (0, CartContext_1.useCart)(); // Obtiene la cantidad de productos en el carrito
    const [menuOpen, setMenuOpen] = (0, react_1.useState)(false);
    const openWhatsapp = () => {
        const whatsappURL = `https://wa.me/${whatsappNumberRaw.replace("+", "")}`;
        window.open(whatsappURL, "_blank");
    };
    return ((0, jsx_runtime_1.jsx)("nav", { className: "bg-[#90442a] text-white p-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "w-full flex justify-between items-center flex-wrap", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-x-3", children: [(0, jsx_runtime_1.jsx)(react_router_dom_1.Link, { to: "/", className: "hover:text-gray-300", children: (0, jsx_runtime_1.jsx)("img", { src: Logo_jpg_1.default, alt: "Logo", className: "h-20 w-20 rounded-full" }) }), (0, jsx_runtime_1.jsx)("h2", { className: "ext-3xl sm:text-4xl p-2 mt-5 sm:mb-6 font-bold text-yellow-50", style: { fontFamily: "'Dancing Script', cursive" }, children: "IvoiviArt" })] }), (0, jsx_runtime_1.jsx)("button", { className: "text-2xl md:hidden", onClick: () => setMenuOpen(!menuOpen), "aria-label": "Men\u00FA", children: menuOpen ? (0, jsx_runtime_1.jsx)(fa_1.FaTimes, {}) : (0, jsx_runtime_1.jsx)(fa_1.FaBars, {}) }), (0, jsx_runtime_1.jsxs)("ul", { className: `md:flex md:space-x-6 items-center text-lg transition-all ${menuOpen ? "flex flex-col mt-4 space-y-4 w-full" : "hidden md:flex"}`, children: [(0, jsx_runtime_1.jsx)("li", { children: (0, jsx_runtime_1.jsx)(react_router_dom_1.Link, { to: "/", className: "text-3xl sm:text-2xl  text-yellow-50 mb-4 sm:mb-6", children: "Inicio" }) }), (0, jsx_runtime_1.jsx)("li", { children: (0, jsx_runtime_1.jsx)(react_router_dom_1.Link, { to: "/acerca", className: "text-3xl sm:text-2xl  text-yellow-50 mb-4 sm:mb-6", children: "Acerca" }) }), (0, jsx_runtime_1.jsx)("li", { children: (0, jsx_runtime_1.jsx)(react_router_dom_1.Link, { to: "/contacto", className: "text-3xl sm:text-2xl  text-yellow-50 mb-4 sm:mb-6", children: "Contacto" }) }), (0, jsx_runtime_1.jsx)("li", { children: (0, jsx_runtime_1.jsx)("button", { onClick: openWhatsapp, className: "text-green-500 hover:text-green-600 text-3xl transition duration-200", "aria-label": "WhatsApp", children: (0, jsx_runtime_1.jsx)(fa_1.FaWhatsapp, {}) }) }), (0, jsx_runtime_1.jsx)("li", { className: "relative", children: (0, jsx_runtime_1.jsxs)(react_router_dom_1.Link, { to: "/carrito", className: "text-white text-4xl relative", children: [(0, jsx_runtime_1.jsx)(fa_1.FaShoppingCart, { className: "hover:text-yellow-200 transition duration-200 " }), cart.length > 0 && ((0, jsx_runtime_1.jsx)("span", { className: "absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center", children: cart.length }))] }) })] })] }) }));
};
exports.default = Header;
