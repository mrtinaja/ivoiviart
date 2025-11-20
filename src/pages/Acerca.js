import { jsx as _jsx, jsxs as _jsxs } from "preact/jsx-runtime";
import { motion } from "framer-motion";
const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut", delay },
    viewport: { once: true },
});
const scaleIn = (delay = 0) => ({
    initial: { opacity: 0, scale: 0.92 },
    whileInView: { opacity: 1, scale: 1 },
    transition: { duration: 0.6, ease: "easeOut", delay },
    viewport: { once: true  }, 
    
    
});
const Acerca = () => {
    return (_jsx("div", { className: "min-.-screen gap-4 bg-[#05282a] text-white flex items-start justify-center pt-28 pb-16 px-4", children: _jsxs(motion.div, { className: "w-full max-w-4xl text-center", ...fadeUp(0), children: [_jsx(motion.h1, { className: "p-10 text-2xl sm:text-5xl md:text-6xl font-extrabold text-[#f0eceb] inline-block border-b-4 border-[#f0eceb] pb-2", ...scaleIn(0), children: "\u00A1Bienvenid@!" }), _jsxs(motion.p, { className: "mt-8 text-lg sm:text-xl md:text-2xl text-[#f0eceb] leading-relaxed", ...fadeUp(0.15), children: ["\u00A1Hola! Bienvenido a", " ", _jsx("span", { className: "font-semibold text-yellow-300", children: "Ivoivi Art" }), ". Ac\u00E1 vas a encontrar mis obras en", " ", _jsx("span", { className: "italic text-yellow-300", children: "cer\u00E1mica, pintura y artesan\u00EDas" }), ", todo \u00FAnico y hecho a mano."] }), _jsxs(motion.p, { className: "mt-10 text-lg sm:text-xl md:text-2xl text-[#f0eceb] leading-relaxed", ...fadeUp(0.3), children: ["Ten\u00E9 en cuenta que la realizaci\u00F3n del producto puede tardar aproximadamente", " ", _jsx("span", { className: "font-bold text-yellow-400", children: "15 d\u00EDas" }), " ", "siempre y cuando no est\u00E9n realizados. Ojal\u00E1 disfrutes la visita."] }), _jsx(motion.p, { className: "mt-14 text-3xl sm:text-4xl md:text-5xl font-semibold text-yellow-400", ...scaleIn(0.45), children: "\u00A1Muchas gracias! \uD83C\uDFA8\u2728" })] }) }));
};
export default Acerca;
