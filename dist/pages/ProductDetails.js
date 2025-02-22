"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
const MediaContext_1 = require("../context/MediaContext");
const CartContext_1 = require("../context/CartContext");
const ArtisticButton_1 = __importDefault(require("../components/ArtisticButton"));
const react_lazy_load_image_component_1 = require("react-lazy-load-image-component");
require("react-lazy-load-image-component/src/effects/blur.css");
const ProductDetails = () => {
    const { id } = (0, react_router_dom_1.useParams)();
    const media = (0, MediaContext_1.useMedia)();
    const { addToCart } = (0, CartContext_1.useCart)();
    const navigate = (0, react_router_dom_1.useNavigate)();
    // Convertir id a número para buscar el producto
    const product = media.find((item) => item.id === Number(id));
    const [currentIndex, setCurrentIndex] = (0, react_1.useState)(0);
    const [imageError, setImageError] = (0, react_1.useState)(false);
    const [showModal, setShowModal] = (0, react_1.useState)(false);
    // Al montar el componente, recuperar el índice guardado para este producto
    (0, react_1.useEffect)(() => {
        if (product) {
            const savedIndex = localStorage.getItem(`product-${product.id}-currentIndex`);
            if (savedIndex !== null) {
                setCurrentIndex(Math.max(0, Math.min(Number(savedIndex), product.images.length - 1)));
            }
        }
    }, [product]);
    // Cada vez que currentIndex cambie, se guarda en localStorage
    (0, react_1.useEffect)(() => {
        if (product) {
            localStorage.setItem(`product-${product.id}-currentIndex`, currentIndex.toString());
        }
    }, [currentIndex, product]);
    // Reiniciar flag de error cuando cambia la imagen o el producto
    (0, react_1.useEffect)(() => {
        setImageError(false);
    }, [currentIndex, product?.id]);
    if (!product) {
        return ((0, jsx_runtime_1.jsx)("p", { className: "text-center text-purple-500", children: "Producto no encontrado" }));
    }
    const handleImageError = (e) => {
        if (!imageError) {
            console.warn("Imagen no encontrada, reemplazando con default:", e.currentTarget.src);
            e.currentTarget.src = "/img/default.jpg";
            setImageError(true);
        }
    };
    const handleNextImage = () => {
        if (!product.images || product.images.length === 0)
            return;
        setCurrentIndex((prevIndex) => (prevIndex + 1) % product.images.length);
    };
    const handlePrevImage = () => {
        if (!product.images || product.images.length === 0)
            return;
        setCurrentIndex((prevIndex) => prevIndex === 0 ? product.images.length - 1 : prevIndex - 1);
    };
    const handleAddToCart = () => {
        addToCart({
            ...product,
            id: Number(product.id),
            price: product.price ?? 0,
        });
        setShowModal(true);
        if (window.modalTimeout) {
            clearTimeout(window.modalTimeout);
        }
        window.modalTimeout = window.setTimeout(() => {
            setShowModal(false);
        }, 2000);
    };
    const handleGoToCart = () => {
        navigate("/carrito");
    };
    // Verificación de imagen segura
    const imageSrc = product.images && product.images.length > 0 && !imageError
        ? `/${product.images[currentIndex]}`
        : "/img/default.jpg";
    console.log("Mostrando imagen:", imageSrc); // Para depuración
    return ((0, jsx_runtime_1.jsxs)("div", { className: "bg-[#005e63] min-h-screen flex flex-col items-center justify-center p-6", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-full max-w-4xl", children: (0, jsx_runtime_1.jsx)(react_router_dom_1.Link, { to: "/", className: "text-[#f0eceb] hover:underline text-lg font-semibold", children: "\u2190 Volver a la Galer\u00EDa" }) }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-orange-200 shadow-md rounded-md p-6 w-full max-w-4xl mt-4 flex flex-col items-center", children: [(0, jsx_runtime_1.jsxs)("div", { className: "relative w-full flex justify-center items-center", children: [product.images.length > 1 && ((0, jsx_runtime_1.jsx)("button", { onClick: handlePrevImage, className: "absolute left-2 md:left-4 w-14 h-14 bg-[#90442a] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition", children: (0, jsx_runtime_1.jsx)("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: "2", stroke: "currentColor", className: "w-8 h-8", children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M15 19l-7-7 7-7" }) }) })), (0, jsx_runtime_1.jsx)(react_lazy_load_image_component_1.LazyLoadImage, { src: imageSrc, alt: product.description || "Imagen no disponible", effect: "blur", onError: handleImageError, className: "w-full max-w-2xl object-contain rounded-lg shadow-lg" }), product.images.length > 1 && ((0, jsx_runtime_1.jsx)("button", { onClick: handleNextImage, className: "absolute right-2 md:right-4 w-14 h-14 bg-[#90442a] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition", children: (0, jsx_runtime_1.jsx)("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: "2", stroke: "currentColor", className: "w-8 h-6", children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M9 5l7 7-7 7" }) }) }))] }), (0, jsx_runtime_1.jsx)("h1", { className: "text-3xl font-bold text-gray-800 mt-4", style: {
                            height: "72px",
                            overflow: "hidden",
                            fontFamily: "'Dancing Script', cursive",
                        }, children: product.description }), product.price !== undefined && ((0, jsx_runtime_1.jsxs)("p", { className: "text-5xl font-bold mt-2 tracking-wide bg-gradient-to-r from-[#90442a] via-[#005e63] to-[#90442a] bg-clip-text text-transparent drop-shadow-xl", style: { WebkitTextStroke: "1px white" }, children: ["$", product.price.toLocaleString()] })), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-4 mt-12 justify-center", children: [(0, jsx_runtime_1.jsx)(ArtisticButton_1.default, { onClick: handleAddToCart, className: "w-64 text-center", children: "A\u00F1adir al carrito" }), (0, jsx_runtime_1.jsx)(ArtisticButton_1.default, { onClick: handleGoToCart, className: "w-64 text-center", children: "\uD83D\uDED2 Ir al carrito" })] })] }), showModal && ((0, jsx_runtime_1.jsx)("div", { className: "fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50", onClick: () => setShowModal(false), children: (0, jsx_runtime_1.jsx)("div", { className: "bg-white p-6 rounded-lg shadow-lg text-center transform scale-105 transition-all", onClick: (e) => e.stopPropagation(), children: (0, jsx_runtime_1.jsxs)("p", { className: "text-lg font-semibold text-green-700", children: [product.description, " se ha agregado al carrito \uD83D\uDED2"] }) }) }))] }));
};
exports.default = ProductDetails;
