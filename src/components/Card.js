import { jsx as _jsx, jsxs as _jsxs } from "preact/jsx-runtime";
import { useMemo } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
// Normaliza: "001-movil-dinos.jpg" -> "Movil Dinos"
const pretty = (s) => {
    const base = (s || "")
        .replace(/^\s*\d+\s*[-_]?/, "")
        .replace(/\.(jpe?g|png|webp|gif)$/i, "")
        .replace(/[-_]+/g, " ")
        .trim();
    return base
        ? base.toLowerCase().replace(/\b\p{L}/gu, (m) => m.toUpperCase())
        : "Sin Título";
};
const FALLBACK = "/img/default.jpg";
const fileFromUrl = (url) => {
    try {
        const noQuery = url.split("?")[0];
        const last = decodeURIComponent(noQuery.split("/").pop() || "");
        return last || null;
    }
    catch {
        return null;
    }
};
const swapDashVariant = (name) => {
    const m = name.match(/^(.*?)(-\d+)?\.(jpg|jpeg|png|webp|gif)$/i);
    if (!m)
        return null;
    const base = m[1];
    const ext = m[3];
    if (m[2])
        return `${base}.${ext}`;
    return `${base}-1.${ext}`;
};
const slugFromDesc = (s) => (s || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
const Card = ({ image, description, size = "normal" }) => {
    const label = pretty(description);
    const candidates = useMemo(() => {
        const list = [];
        const filename = fileFromUrl(image);
        if (filename) {
            list.push(`/img/${filename}`);
            const alt = swapDashVariant(filename);
            if (alt)
                list.push(`/img/${alt}`);
        }
        const slug = slugFromDesc(description);
        if (slug) {
            ["jpg", "jpeg", "png", "webp"].forEach((ext) => {
                list.push(`/img/${slug}.${ext}`);
                list.push(`/img/${slug}-1.${ext}`);
            });
        }
        list.push(FALLBACK);
        return Array.from(new Set(list));
    }, [image, description]);
    const initialSrc = typeof image === "string" && image.trim() && !/^(null|undefined)$/i.test(image)
        ? image
        : candidates[0] ?? FALLBACK;
    // alturas segun tamaño
    const imgHeight = size === "compact" ? "h-[220px] md:h-[240px]" : "h-[340px]";
    return (_jsxs("div", { className: "\r\n        group w-55 rounded-xl bg-[#0b2c2e]\r\n        border border-teal-700/50 shadow-md overflow-hidden\r\n        transition-transform duration-300 hover:scale-[1.03]\r\n      ", "data-card": true, children: [_jsxs("div", { className: "relative", children: [_jsx(LazyLoadImage, { src: initialSrc, alt: label, effect: "blur", onError: (e) => {
                            const el = e.currentTarget;
                            const i = Number(el.dataset.try || "0");
                            const next = candidates[Math.min(i, candidates.length - 1)] || FALLBACK;
                            // si no avanzamos más, fijamos fallback y cortamos
                            const same = el.src.endsWith(next) || i >= candidates.length - 1;
                            if (same) {
                                el.onerror = null;
                                el.src = FALLBACK;
                                return;
                            }
                            el.dataset.try = String(i + 1);
                            el.src = next;
                        }, className: `
            w-full ${imgHeight} object-cover
            transition-transform duration-300
            group-hover:scale-[1.04]
            bg-black/30
          ` }), _jsx("span", { className: "absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-teal-400 via-amber-300 to-teal-400 opacity-70" })] }), _jsx("div", { className: "bg-white/95 p-3", children: _jsx("p", { className: `text-center ${size === "compact" ? "text-[14px]" : "text-[15px]"} leading-6 text-neutral-900 truncate`, title: label, style: { fontWeight: 500 }, children: label }) })] }));
};
export default Card;
