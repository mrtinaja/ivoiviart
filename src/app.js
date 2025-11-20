import { jsx as _jsx, jsxs as _jsxs } from "preact/jsx-runtime";
/** @jsxImportSource preact */
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Acerca from "./pages/Acerca";
import Contacto from "./pages/Contacto";
import ProductDetails from "./pages/ProductDetails";
import CartPage from "./pages/CartPage";
import ThankYouPage from "./pages/ThankYouPage";
import { CartProvider } from "./context/CartContext";
import { MediaProvider } from "./services/media";
import Header from "./components/Header";
import Footer from "./components/Footer";
const App = () => {
    return (_jsx(MediaProvider, { children: _jsxs(CartProvider, { children: [_jsx(Header, {}), _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Home, {}) }), _jsx(Route, { path: "/acerca", element: _jsx(Acerca, {}) }), _jsx(Route, { path: "/contacto", element: _jsx(Contacto, {}) }), _jsx(Route, { path: "/product/:id", element: _jsx(ProductDetails, {}) }), _jsx(Route, { path: "/carrito", element: _jsx(CartPage, {}) }), _jsx(Route, { path: "/thank-you", element: _jsx(ThankYouPage, {}) })] }), _jsx(Footer, {})] }) }));
};
export default App;
