"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_router_dom_1 = require("react-router-dom");
const Home_1 = __importDefault(require("./pages/Home"));
const Acerca_1 = __importDefault(require("./pages/Acerca"));
const Contacto_1 = __importDefault(require("./pages/Contacto"));
const Header_1 = __importDefault(require("./components/Header"));
const MediaContext_1 = require("./context/MediaContext");
const CartContext_1 = require("./context/CartContext");
const ProductDetails_1 = __importDefault(require("./pages/ProductDetails"));
const CartPage_1 = __importDefault(require("./pages/CartPage")); // Importar la nueva pantalla
const ThankYouPage_1 = __importDefault(require("./pages/ThankYouPage"));
require("@fontsource/open-sans/800.css");
require("@fontsource/open-sans/300.css");
const App = () => {
    return ((0, jsx_runtime_1.jsx)(MediaContext_1.MediaProvider, { children: (0, jsx_runtime_1.jsxs)(CartContext_1.CartProvider, { children: [(0, jsx_runtime_1.jsx)(Header_1.default, {}), (0, jsx_runtime_1.jsxs)(react_router_dom_1.Routes, { children: [(0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/", element: (0, jsx_runtime_1.jsx)(Home_1.default, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/Acerca", element: (0, jsx_runtime_1.jsx)(Acerca_1.default, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/Contacto", element: (0, jsx_runtime_1.jsx)(Contacto_1.default, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/product/:id", element: (0, jsx_runtime_1.jsx)(ProductDetails_1.default, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/carrito", element: (0, jsx_runtime_1.jsx)(CartPage_1.default, {}) }), " ", (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/thank-you", element: (0, jsx_runtime_1.jsx)(ThankYouPage_1.default, {}) })] })] }) }));
};
exports.default = App;
