import { jsx as _jsx, jsxs as _jsxs } from "preact/jsx-runtime";
const socials = [
    {
        name: "Instagram",
        href: "https://www.instagram.com/ivoivi_art/",
        icon: (p) => (_jsx("svg", { viewBox: "0 0 24 24", fill: "currentColor", ...p, children: _jsx("path", { d: "M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.9.2 2.4.4.6.2 1 .5 1.5 1 .4.4.8.9 1 1.5.2.5.3 1.2.4 2.4.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.2 1.9-.4 2.4-.2.6-.5 1-1 1.5-.4.4-.9.8-1.5 1-.5.2-1.2.3-2.4.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.9-.2-2.4-.4-.6-.2-1-.5-1.5-1-.4-.4-.8-.9-1-1.5-.2-.5-.3-1.2-.4-2.4C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.2-1.9.4-2.4.2-.6.5-1 1-1.5.4-.4.9-.8 1.5-1 .5-.2 1.2-.3 2.4-.4C8.4 2.2 8.8 2.2 12 2.2Zm0 1.8c-3.1 0-3.5 0-4.7.1-1 .1-1.6.2-2 .4-.5.2-.8.4-1.1.8-.3.3-.6.6-.8 1.1-.2.4-.3 1-.4 2-.1 1.2-.1 1.6-.1 4.7s0 3.5.1 4.7c.1 1 .2 1.6.4 2 .2.5.4.8.8 1.1.3.3.6.6 1.1.8.4.2 1 .3 2 .4 1.2.1 1.6.1 4.7.1s3.5 0 4.7-.1c1-.1 1.6-.2 2-.4.5-.2.8-.4 1.1-.8.3-.3.6-.6.8-1.1.2-.4.3-1 .4-2 .1-1.2.1-1.6.1-4.7s0-3.5-.1-4.7c-.1-1-.2-1.6-.4-2-.2-.5-.4-.8-.8-1.1a2.9 2.9 0 0 0-1.1-.8c-.4-.2-1-.3-2-.4-1.2-.1-1.6-.1-4.7-.1Zm0 3.4a6.6 6.6 0 1 1 0 13.2 6.6 6.6 0 0 1 0-13.2Zm0 1.8a4.8 4.8 0 1 0 0 9.6 4.8 4.8 0 0 0 0-9.6Zm6-1.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" }) })),
    },
    {
        name: "Facebook",
        href: "https://www.facebook.com/0viceversa",
        icon: (p) => (_jsx("svg", { viewBox: "0 0 24 24", fill: "currentColor", ...p, children: _jsx("path", { d: "M13 22v-8h3l.5-3H13V9.5c0-.9.3-1.5 1.7-1.5H17V5.2C16.5 5.1 15.4 5 14.2 5 11.7 5 10 6.5 10 9.2V11H7v3h3v8h3Z" }) })),
    },
    {
        name: "WhatsApp",
        href: "https://api.whatsapp.com/send/?phone=5491166742221&text&type=phone_number&app_absent=0",
        icon: (p) => (_jsx("svg", { viewBox: "0 0 24 24", fill: "currentColor", ...p, children: _jsx("path", { d: "M2 22l1.6-5.8A9 9 0 1 1 12 21a9.2 9.2 0 0 1-4.4-1.1L2 22Zm6.7-6.9c1.3 1.3 2.9 2.1 3.5 2.3.6.1 1.2.1 1.7-.4.5-.4.8-.9.9-1.5.1-.6-.2-.9-.7-1.1l-1.1-.5c-.5-.2-.7 0-1 .3-.2.3-.4.6-.7.5-.3 0-1.1-.4-1.9-1.2-.8-.8-1.2-1.6-1.2-1.9 0-.3.2-.5.5-.7.3-.3.5-.5.3-1.1l-.5-1.1c-.2-.5-.5-.8-1.1-.7-.6.1-1.1.4-1.5.9-.5.5-.5 1.1-.4 1.7.2.6 1 2.1 2.3 3.4Z" }) })),
    },
    {
        name: "Pinterest",
        href: "https://ar.pinterest.com/ivoiviart",
        icon: (p) => (_jsx("svg", { viewBox: "0 0 24 24", fill: "currentColor", ...p, children: _jsx("path", { d: "M12 2C6.5 2 3 5.8 3 10.3c0 3.2 1.8 5 2.8 5 .4 0 .6-1 .6-1.3 0-.3-1-1.2-1-2.9 0-3.4 2.6-5.8 6.1-5.8 3 0 5.2 1.7 5.2 4.9 0 2.7-1.1 7.7-4.7 7.7-1.3 0-2.5-.9-2.2-2.2l.6-2.5c-.2-.4-.3-1-.3-1.6 0-1.4.8-2.4 1.8-2.4.8 0 1.1.6 1.1 1.3 0 .8-.5 2-0.8 3.1-.2.9.5 1.6 1.4 1.6 2.3 0 3.2-3 3.2-5 0-2.4-1.7-4.1-4.7-4.1-3.2 0-5.2 2.4-5.2 5.1 0 1 .3 1.8 1 2.3.1.1.1.1.1 0l.3-1.1c.1-.4.2-.5.1-.9-.1-.3-.4-1-.4-1.3 0-.8.5-1.5 1.6-1.5 1.3 0 2.2 1 2.2 2.5 0 1.8-1.1 3.3-1.1 4.1 0 .4.3.8.7.8 1.3 0 2.2-2.7 2.2-4.6 0-1.9-1.3-3.2-3.4-3.2-2.3 0-3.8 1.7-3.8 3.6 0 .7.2 1.4.6 1.8L7.8 17C7 19.9 6.6 21 6.6 21H6.5c-.2 0-2.7-1-3.4-4.1-.2-.9-.3-1.8-.3-2.6C2.8 6.8 6.6 2 12 2Z" }) })),
    },
    {
        name: "Email",
        href: "mailto:ivoivi@hotmail.com?subject=Consulta%20IvoiviArt&body=Hola%20IvoiviArt%2C%0AQuisiera%20saber...",
        icon: (p) => (_jsx("svg", { viewBox: "0 0 24 24", fill: "currentColor", ...p, children: _jsx("path", { d: "M2 6c0-1.1.9-2 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6Zm2 0 8 5 8-5H4Zm16 2.3-8 5-8-5V18h16V8.3Z" }) })),
    },
    {
        name: "Teléfono",
        href: "tel:+541166742221",
        icon: (p) => (_jsx("svg", { viewBox: "0 0 24 24", fill: "currentColor", ...p, children: _jsx("path", { d: "M6.6 10.8a15.3 15.3 0 0 0 6.6 6.6l2.2-2.2c.3-.3.8-.4 1.2-.2 1 .4 2 .6 3 .6.7 0 1.2.6 1.2 1.2V20c0 .7-.5 1.2-1.2 1.2C10.6 21.2 2.8 13.4 2.8 3.2 2.8 2.5 3.3 2 4 2h2.1c.7 0 1.2.5 1.2 1.2 0 1 .2 2 .6 3 .1.4 0 .9-.3 1.2l-2 2.4Z" }) })),
    },
];
/** Normaliza href: agrega mailto:/tel: si venía “pelado” */
function normalizeHref(raw) {
    if (/^(https?:|mailto:|tel:)/i.test(raw))
        return raw;
    if (/@/.test(raw))
        return `mailto:${raw}`;
    if (/^\+?\d[\d\s-]+$/.test(raw))
        return `tel:${raw.replace(/[\s-]/g, "")}`;
    return raw;
}
const Footer = () => {
    const year = new Date().getFullYear();
    return (_jsx("footer", { className: " bg-[#061f20] text-gray-300 border-t border-emerald-900/40", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10", children: [_jsxs("div", { className: "flex flex-col md:flex-row md:items-center md:justify-between gap-8", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-xl font-semibold text-white", children: "IvoiviArt" }), _jsx("p", { className: "mt-1 text-sm text-gray-400", children: "Piezas \u00FAnicas en cer\u00E1mica. Hecho a mano, con cari\u00F1o." })] }), _jsx("nav", { "aria-label": "Redes sociales", children: _jsx("ul", { className: "flex flex-wrap items-center gap-3 sm:gap-4", children: socials.map((s) => {
                                    const href = normalizeHref(s.href);
                                    const isHttp = /^https?:/i.test(href);
                                    // Solo abrimos en nueva pestaña para http(s)
                                    const extra = isHttp
                                        ? { target: "_blank", rel: "noopener noreferrer" }
                                        : {};
                                    return (_jsx("li", { children: _jsx("a", { href: href, ...extra, "aria-label": s.name, title: s.name, className: "group inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/5 hover:bg-white/10 ring-1 ring-white/10 hover:ring-white/20 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400/60", children: s.icon({
                                                className: "h-5 w-5 text-teal-300 group-hover:text-teal-200",
                                            }) }) }, s.name));
                                }) }) })] }), _jsxs("div", { className: "mt-8 pt-6 border-t border-white/10 text-sm text-gray-400 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2", children: [_jsxs("span", { children: ["\u00A9 ", year, " IvoiviArt. Todos los derechos reservados."] }), _jsx("span", { className: "opacity-80", children: "Hecho en Argentina." })] })] }) }));
};
export default Footer;
