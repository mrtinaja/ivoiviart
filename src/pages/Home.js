import { jsx as _jsx, jsxs as _jsxs } from "preact/jsx-runtime";
// src/pages/Home.tsx
import { useMemo, useRef, useEffect, useState, } from "react";
import { Link } from "react-router-dom";
import Card from "../components/Card";
import { useMedia } from "../services/media";
/* ================================
   Helpers
================================== */
const debug = typeof window !== "undefined"
    ? new URLSearchParams(window.location.search).has("debug")
    : false;
const pickCover = (arr) => {
    if (!arr?.length)
        return "/img/default.jpg";
    const url = arr.find((u) => {
        if (typeof u !== "string" || !u.trim())
            return false;
        if (/^(null|undefined)$/i.test(u))
            return false;
        try {
            return /^https?:\/\//i.test(u) || u.startsWith("/img/");
        }
        catch {
            return false;
        }
    });
    return url ?? "/img/default.jpg";
};
const toTitle = (s) => (s ?? "")
    .replace(/^\s*\d+\s*[-_]?/, "")
    .replace(/\.(jpe?g|png|webp|gif)$/i, "")
    .replace(/[-_]+/g, " ")
    .trim();
const groupByProduct = (list) => {
    const map = new Map();
    for (const it of list) {
        const key = String(it.code ?? it.id);
        const prev = map.get(key);
        const mergedImages = [
            ...(prev?.images ?? []),
            ...(it.images ?? []).filter(Boolean),
        ];
        const images = Array.from(new Set(mergedImages));
        const description = toTitle(it.description) || prev?.description || "Sin título";
        const price = it.price ?? prev?.price ?? null;
        map.set(key, { id: key, code: it.code, description, images, price });
    }
    return Array.from(map.values());
};
const splitIntoThree = (arr) => arr.reduce((acc, item, i) => {
    const key = ["a", "b", "c"][i % 3];
    acc[key].push(item);
    return acc;
}, { a: [], b: [], c: [] });
const GAP_PX = 12;
const PAD_PX = 12;
const computeVisible = (w) => {
    if (w < 480)
        return 1.6;
    if (w < 768)
        return 2.6;
    if (w < 1024)
        return 3.4;
    return 5;
};
const CarouselRow = ({ title, items }) => {
    const scrollerRef = useRef(null);
    const [visible, setVisible] = useState(typeof window !== "undefined" ? computeVisible(window.innerWidth) : 5);
    useEffect(() => {
        const onResize = () => setVisible(computeVisible(window.innerWidth));
        onResize();
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);
    const itemW = `calc((100% - ${PAD_PX * 2}px - ${GAP_PX}px * (${Math.ceil(visible)} - 1)) / ${visible})`;
    const page = (dir) => {
        const el = scrollerRef.current;
        if (!el)
            return;
        const first = el.querySelector("[data-card]");
        if (!first)
            return;
        const cardW = first.getBoundingClientRect().width;
        const step = Math.max(1, Math.floor(visible - 0.2));
        el.scrollBy({ left: (cardW + GAP_PX) * step * dir, behavior: "smooth" });
    };
    const handleKeyDown = (e) => {
        if (e.key === "ArrowLeft")
            page(-1);
        if (e.key === "ArrowRight")
            page(1);
    };

    if (!items.length)
        return null;
    const showArrows = items.length > visible;
    return (_jsxs("section", { className: "relative w-full max-w-7xl mx-auto py-7", children: [_jsx("h2", { className: "text-xl md:text-2xl font-semibold text-white mb-3 px-3", children: title }), _jsx("button", { onClick: () => page(-1), className: `${showArrows ? "hidden md:flex" : "hidden"} absolute left-1 top-1/2 -translate-y-1/2 z-10 h-8 w-8 items-center justify-center bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors`, "aria-label": "Anterior", children: "‹" }), _jsx("button", { onClick: () => page(1), className: `${showArrows ? "hidden md:flex" : "hidden"} absolute right-1 top-1/2 -translate-y-1/2 z-10 h-8 w-8 items-center justify-center bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors`, "aria-label": "Siguiente", children: "›" }),             _jsxs("div", { ref: scrollerRef, role: "region", "aria-label": `Carrusel de ${title}`, tabIndex: 0, onKeyDown: handleKeyDown, className: "flex overflow-x-auto overflow-y-hidden snap-x snap-mandatory scroll-smooth scrollbar-hide min-w-0 focus:outline-none focus:ring-2 focus:ring-blue-500/50 rounded", style: { gap: `${GAP_PX}px`, paddingInline: `${PAD_PX}px` }, children: [items.map((p) => {
                        const cover = pickCover(p.images);
                        return (_jsx(Link, { to: `/product/${p.id}`, "data-card": true, className: "snap-start shrink-0 min-w-0 block", "aria-label": p.description, style: { width: itemW, flex: `0 0 ${itemW}`, maxWidth: itemW }, children: _jsx(Card, { image: cover, description: p.description, size: "compact" }) }, p.id));
                    }), _jsx("div", { className: "shrink-0", style: { width: `${PAD_PX}px` } })] })] }));
};
/* ================================
   Loading Skeleton
================================== */
const LoadingSkeleton = () => (_jsxs("div", { className: "min-h-screen bg-gradient-to-b from-[#031a1a] to-black", children: [_jsx("div", { className: "h-[80px]" }), _jsx("div", { className: "space-y-8 p-8 max-w-7xl mx-auto", children: [1, 2, 3].map((i) => (_jsxs("div", { className: "animate-pulse", children: [_jsx("div", { className: "h-6 bg-gray-700 rounded w-48 mb-4" }), _jsx("div", { className: "flex gap-4 overflow-hidden", children: [1, 2, 3, 4, 5].map((j) => (_jsx("div", { className: "h-64 bg-gray-700 rounded-lg flex-1 min-w-[200px]" }, j))) })] }, i))) })] }));
/* ================================
   Error State
================================== */
const ErrorState = ({ error }) => (_jsx("div", { className: "min-h-screen bg-gradient-to-b from-[#031a1a] to-black flex items-center justify-center p-4", children: _jsxs("div", { className: "text-center max-w-md", children: [_jsx("div", { className: "text-6xl mb-4", children: "😕" }), _jsx("h2", { className: "text-2xl text-red-300 mb-4 font-semibold", children: "Oops, algo salió mal" }), _jsx("p", { className: "text-gray-400 mb-6 text-sm", children: error instanceof Error ? error.message : String(error) }), _jsx("button", { onClick: () => window.location.reload(), className: "px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium", children: "Reintentar" })] }) }));
/* ================================
   Home
================================== */
const Home = () => {
    const { media, loading, error } = useMedia();
    const products = useMemo(() => groupByProduct(media ?? []), [media]);
    const { fila1, fila2, fila3 } = useMemo(() => {
        const sorted = [...products].sort((a, b) => {
            const na = parseInt(String(a.id).replace(/\D/g, "") || "0", 10);
            const nb = parseInt(String(b.id).replace(/\D/g, "") || "0", 10);
            return nb - na;
        });
        const { a, b, c } = splitIntoThree(sorted);
        return { fila1: a, fila2: b, fila3: c };
    }, [products]);
    useEffect(() => {
        if (!debug || loading)
            return;
        const setIds = new Set(products.map((p) => p.id));
        const sinImgs = products.filter((p) => !p.images || p.images.length === 0);
        const conDefault = products.filter((p) => pickCover(p.images) === "/img/default.jpg");
        console.groupCollapsed("[Home debug]");
        console.log("media docs:", media?.length ?? 0);
        console.log("productos agrupados:", products.length);
        console.log("únicos (ids):", setIds.size);
        console.log("sin imágenes:", sinImgs.length, sinImgs.map((p) => p.id));
        console.log("con cover default:", conDefault.length, conDefault.map((p) => p.id));
        console.groupEnd();
    }, [debug, loading, media, products]);
    if (loading)
        return _jsx(LoadingSkeleton, {});
    if (error)
        return _jsx(ErrorState, { error: error });
    return (_jsxs("div", { className: "min-h-screen w-full bg-gradient-to-b from-[#031a1a] to-black", children: [_jsx("div", { className: "h-[80px]" }), _jsxs("main", { className: "w-full pb-12", children: [_jsx(CarouselRow, { title: "Novedades", items: fila1 }), _jsx(CarouselRow, { title: "Recomendados", items: fila2 }), _jsx(CarouselRow, { title: "Destacados", items: fila3 })] })] }));
};
export default Home;