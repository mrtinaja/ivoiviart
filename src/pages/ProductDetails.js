import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "preact/jsx-runtime";
// src/pages/ProductDetails.tsx
import { useMemo, useState, useEffect, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { motion } from "framer-motion";
import { useCart } from "../context/CartContext";
import { useMedia } from "../services/media";
// Placeholder inline para evitar 404/ORB en dev
const fallbackUrl = "data:image/svg+xml;utf8," +
    encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='800'>
      <rect width='100%' height='100%' fill='#11191a'/>
      <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle'
            font-family='system-ui,Segoe UI,Roboto' font-size='28' fill='#9fb3b8'>
        imagen no disponible
      </text>
    </svg>`);
/* ------------ Helpers de título ------------ */
const capitalizeWords = (s) => s.replace(/\b\p{L}/gu, (m) => m.toUpperCase());
const humanize = (s) => (capitalizeWords((s || "").replace(/^\s*\d+\s*[-_]?/, "").replace(/[-_]+/g, " ").trim()) ||
    "Sin título");
const GCS_BUCKET = "ivoiviart-bucket";
const FB_BUCKET = "ivoiviart-420a2.appspot.com";
const FILE_LOCAL_DIRS = ["/img", "/img/products", "/images"];
const getUrl = (img) => (typeof img === "string" ? img : img?.url || "");
const inferLabelFromFilename = (url) => {
    try {
        const raw = decodeURIComponent((url.split("/").pop() || "").split("?")[0]);
        const noExt = raw.replace(/\.(jpe?g|png|webp|gif|avif)$/i, "");
        let base = noExt
            .replace(/^\d+\s*[-_]?/, "")
            .replace(/[-_](\d{1,3})$/, "")
            .replace(/[-_]+/g, " ")
            .trim();
        if (!base)
            base = "Sin descripción";
        return base.toLowerCase();
    }
    catch {
        return "sin descripción";
    }
};
const normalizeImg = (img) => {
    const url = getUrl(img);
    const label = typeof img === "string"
        ? inferLabelFromFilename(url)
        : img.description?.trim().toLowerCase() || inferLabelFromFilename(url);
    return { url, label };
};
function groupByLabel(imgs) {
    var _a;
    const order = [];
    const map = {};
    for (const img of imgs) {
        const n = normalizeImg(img);
        if (!map[n.label])
            order.push(n.label);
        (map[_a = n.label] || (map[_a] = [])).push(n.url);
    }
    return order.map((lbl) => ({ label: lbl, urls: map[lbl] }));
}
const fileLeaf = (u) => {
    try {
        return decodeURIComponent((u.split("/").pop() || "").split("?")[0]);
    }
    catch {
        return (u.split("/").pop() || "").split("?")[0];
    }
};
function normalizeRemote(u) {
    try {
        const url = new URL(u);
        const noQS = `${url.origin}${url.pathname}`;
        if (url.hostname.includes("firebasestorage.googleapis.com") && url.pathname.includes("/o/")) {
            return `${noQS}?alt=media`; // sirve binario directo si es público
        }
        if (url.hostname.includes("storage.googleapis.com")) {
            return noQS; // sin query firmada
        }
    }
    catch { }
    return u;
}
function buildCandidates(orig) {
    const base = (orig || "").split("?")[0];
    const normalized = normalizeRemote(base);
    const leaf = fileLeaf(normalized);
    const remoteExtras = leaf
        ? [
            `https://firebasestorage.googleapis.com/v0/b/${FB_BUCKET}/o/img%2F${encodeURIComponent(leaf)}?alt=media`,
            `https://storage.googleapis.com/${GCS_BUCKET}/img/${leaf}`,
        ]
        : [];
    const locals = leaf ? FILE_LOCAL_DIRS.map((d) => `${d}/${leaf}`) : [];
    const set = new Set([normalized, ...remoteExtras, ...locals].filter(Boolean));
    return Array.from(set);
}
// Carga una imagen y resuelve true/false
function checkSrc(src, timeoutMs = 4000) {
    return new Promise((resolve) => {
        const img = new Image();
        let done = false;
        const close = (ok) => { if (!done) {
            done = true;
            resolve(ok);
        } };
        const t = setTimeout(() => close(false), timeoutMs);
        img.onload = () => { clearTimeout(t); close(true); };
        img.onerror = () => { clearTimeout(t); close(false); };
        // evita “cache pegajosa” sin romper URLs firmadas
        img.referrerPolicy = "no-referrer";
        img.src = src;
    });
}
// Devuelve el primer candidato que realmente carga
async function firstWorking(candidates) {
    for (const c of candidates) {
        if (await checkSrc(c))
            return c;
    }
    return null;
}
/* ---------------------- Componente ---------------------- */
const ProductDetails = () => {
    const { id: routeId } = useParams();
    const { media, loading, error } = useMedia();
    const { addToCart } = useCart();
    const navigate = useNavigate();
    // Resolver producto por id o por code numérico
    const product = useMemo(() => {
        if (!media || !routeId)
            return undefined;
        const exact = media.find((p) => String(p.id) === routeId);
        if (exact)
            return exact;
        const n = Number(routeId);
        if (Number.isFinite(n))
            return media.find((p) => Number(p.code) === n);
        return undefined;
    }, [media, routeId]);
    // Imágenes crudas
    const rawImages = useMemo(() => {
        const imgs = product?.images && Array.isArray(product.images) ? product.images : [];
        return imgs;
    }, [product?.images]);
    // Agrupación por label (sirve para Medallón)
    const groups = useMemo(() => groupByLabel(rawImages), [rawImages]);
    // Estado UI
    const [activeLabel, setActiveLabel] = useState(groups[0]?.label || "");
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isZoomed, setIsZoomed] = useState(false);
    // Lista final de imágenes válidas para el grupo activo
    const [resolvedSrcs, setResolvedSrcs] = useState(null);
    // Recalcular lista válida cuando cambia grupo
    useEffect(() => {
        let cancelled = false;
        const run = async () => {
            const group = groups.find((g) => g.label === activeLabel) || groups[0] || { urls: [] };
            const valid = [];
            for (const orig of group.urls) {
                const cand = buildCandidates(orig);
                const ok = await firstWorking(cand);
                if (ok)
                    valid.push(ok);
            }
            if (!cancelled) {
                setResolvedSrcs(valid);
                setCurrentIndex(0);
                setIsZoomed(false);
            }
        };
        setResolvedSrcs(null); // loading
        run();
        return () => { cancelled = true; };
    }, [groups, activeLabel]);
   
    // Precio
    const priceNum = product?.price ?? null;
    const hasPrice = priceNum !== null && Number.isFinite(priceNum);
    // Añadir al carrito con la imagen actualmente ampliada al frente
    const handleAddToCart = () => {
        if (!product || !resolvedSrcs || resolvedSrcs.length === 0)
            return;
        const numericId = Number(product.code) || 0;
        const selected = resolvedSrcs[currentIndex];
        const rest = resolvedSrcs.filter((_, i) => i !== currentIndex);
        addToCart({
            id: numericId,
            price: hasPrice ? priceNum : 0,
            images: [selected, ...rest],
            description: product.description ?? "",
        });
    };
    // Navegación
    const next = useCallback(() => {
        if (!resolvedSrcs?.length)
            return;
        setCurrentIndex((i) => (i + 1) % resolvedSrcs.length);
    }, [resolvedSrcs?.length]);
    const prev = useCallback(() => {
        if (!resolvedSrcs?.length)
            return;
        setCurrentIndex((i) => (i - 1 + resolvedSrcs.length) % resolvedSrcs.length);
    }, [resolvedSrcs?.length]);
    const switchGroup = useCallback((label) => {
        setActiveLabel(label);
    }, []);
    // Atajos
    useEffect(() => {
        const onKey = (e) => {
            if (e.key === "ArrowRight")
                next();
            if (e.key === "ArrowLeft")
                prev();
            if (e.key === "Escape")
                setIsZoomed(false);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [next, prev]);
    if (loading)
        return _jsx("div", { className: "p-8 text-[#f0eceb]", children: "cargando\u2026" });
    if (error)
        return _jsxs("div", { className: "p-8 text-red-300", children: ["Error: ", String(error)] });
    if (!product)
        return _jsx("div", { className: "p-8 text-[#f0eceb]", children: "Producto no encontrado" });
    const pageTitle = humanize(product.description || "");
    const uiActiveLabel = humanize(activeLabel);
    // Mientras se valida si hay fotos útiles para el grupo
    if (resolvedSrcs === null) {
        return (_jsx("div", { className: "bg-[#0a0f10] min-h-screen flex flex-col items-center justify-center pt-[78px] sm:pt-[90px] pb-20 px-3", children: _jsx("p", { className: "text-[#eae8e6]", children: "verificando im\u00E1genes\u2026" }) }));
    }
    // Si no hay ninguna válida, (useEffect ya redirige) mostramos un fallback por si tarda
    if (resolvedSrcs.length === 0) {
        return (_jsxs("div", { className: "bg-[#0a0f10] min-h-screen flex flex-col items-center justify-center pt-[78px] sm:pt-[90px] pb-20 px-3", children: [_jsx("p", { className: "text-[#eae8e6] mb-4", children: "Este producto no tiene im\u00E1genes disponibles." }), _jsx(Link, { to: "/", className: "text-[#eae8e6] underline", children: "Volver a la galer\u00EDa" })] }));
    }
    const imageSrc = resolvedSrcs[currentIndex];
    return (_jsxs("div", { className: "bg-[#0a0f10] min-h-screen flex flex-col items-center justify-start pt-[78px] sm:pt-[90px] pb-20 px-3", children: [_jsx("div", { className: "w-full max-w-5xl", children: _jsx(Link, { to: "/", className: "text-[#eae8e6] hover:underline text-sm sm:text-lg font-semibold", children: "\u2190 Volver a la Galer\u00EDa" }) }), _jsx("div", { className: "w-full max-w-5xl mt-4 sm:mt-8", children: _jsxs("div", { className: "bg-[rgba(0,94,99,0.6)] rounded-xl shadow-xl p-3 sm:p-6 md:p-8 flex flex-col items-center overflow-hidden relative", children: [groups.length > 1 && (_jsx("div", { className: "w-full flex gap-2 justify-start sm:justify-center mb-3 overflow-x-auto flex-nowrap sm:flex-wrap px-1 sm:px-0", children: groups.map((g) => (_jsx("button", { onClick: () => switchGroup(g.label), className: `px-3 py-1 rounded-full border text-xs sm:text-sm transition-colors duration-150 shrink-0 ${activeLabel === g.label
                                    ? "bg-black text-white border-black"
                                    : "bg-white/80 text-black border-black/20 hover:bg-white"}`, "aria-pressed": activeLabel === g.label, children: humanize(g.label) }, g.label))) })), _jsxs("div", { className: "relative w-full flex justify-center items-center select-none", children: [_jsx(motion.div, { className: "relative", initial: { scale: 0.98 }, animate: { scale: isZoomed ? 1.08 : 1 }, transition: { duration: 0.2 }, children: _jsx(LazyLoadImage, { visibleByDefault: true, src: imageSrc, alt: `${pageTitle} — ${uiActiveLabel}`, effect: "blur", className: "max-w-[900px] w-full max-h-[68vh] sm:max-h-[70vh] object-contain rounded-lg shadow-lg cursor-zoom-in", onClick: () => setIsZoomed((z) => !z) }, `${activeLabel}-${currentIndex}-${imageSrc}`) }), resolvedSrcs.length > 1 && (_jsxs(_Fragment, { children: [_jsx("button", { onClick: prev, className: "flex absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white w-8 h-8 sm:w-10 sm:h-10 rounded-full items-center justify-center", "aria-label": "Anterior", children: "\u2039" }), _jsx("button", { onClick: next, className: "flex absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white w-8 h-8 sm:w-10 sm:h-10 rounded-full items-center justify-center", "aria-label": "Siguiente", children: "\u203A" })] }))] }), _jsx("div", { className: "flex gap-2 mt-3 sm:mt-4 justify-start sm:justify-center overflow-x-auto flex-nowrap sm:flex-wrap px-1 sm:px-0", children: resolvedSrcs.map((thumb, index) => (_jsx("button", { className: `w-14 h-14 sm:w-16 sm:h-16 rounded-md overflow-hidden border-2 shrink-0 ${currentIndex === index ? "border-white" : "border-transparent"}`, onClick: () => setCurrentIndex(index), "aria-label": `Miniatura ${index + 1} — ${uiActiveLabel}`, children: _jsx("img", { src: thumb, alt: `Miniatura ${index + 1}`, className: "object-cover w-full h-full", loading: "lazy" }) }, `${product.id}-${activeLabel}-${index}`))) }), _jsx("h1", { className: "text-2xl sm:text-3xl md:text-4xl text-[#f5f3f1] mt-5 sm:mt-6 text-center", children: pageTitle }), _jsx("p", { className: "sr-only", children: uiActiveLabel }), hasPrice ? (_jsxs("p", { className: "text-2xl sm:text-3xl md:text-4xl font-extrabold mt-3 tracking-wide bg-gradient-to-r from-[#d7b876] via-[#e7d9a8] to-[#d7b876] bg-clip-text text-transparent drop-shadow-xl", style: { WebkitTextStroke: "0.5px rgba(0,0,0,0.25)" }, children: ["$", Number(priceNum).toLocaleString("es-AR")] })) : (_jsx("p", { className: "mt-3 text-[#f0eceb] text-lg sm:text-xl", children: "Precio: consultar" })), _jsxs("div", { className: "flex flex-col sm:flex-row gap-3 mt-8 sm:mt-10 justify-center w-full max-w-xl", children: [_jsx(Link, { to: "/", "aria-label": "Volver a la Galer\u00EDa", className: "w-full text-center rounded-none py-4 bg-[#0b0b0b] text-[#eae8e6] font-semibold shadow-[0_12px_32px_rgba(0,0,0,.6)] active:scale-[.98] transition-transform duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20", children: "Volver a la Galer\u00EDa" }), _jsx("button", { onClick: handleAddToCart, "aria-label": "A\u00F1adir al carrito", className: "w-full rounded-none py-4 bg-[#2f777b] text-white font-semibold shadow-[0_10px_28px_rgba(0,0,0,.45)] active:scale-[.98] transition-transform duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30", children: "A\u00F1adir al carrito" }), _jsx("button", { onClick: () => navigate("/carrito"), "aria-label": "Ir al carrito", className: "w-full rounded-none py-4 bg-[#043e41] text-white font-semibold shadow-[0_10px_28px_rgba(0,0,0,.45)] active:scale-[.98] transition-transform duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30", children: "\uD83D\uDED2 Ir al carrito" })] })] }) })] }));
};
export default ProductDetails;
