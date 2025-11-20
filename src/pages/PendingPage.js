import { jsx as _jsx, jsxs as _jsxs } from "preact/jsx-runtime";
import { Link } from "react-router-dom";
export default function PendingPage() {
    return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-[#0b1111] text-[#eae8e6] px-4", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-4xl md:text-5xl font-extrabold", children: "Pago pendiente" }), _jsx("p", { className: "mt-3 text-lg text-[#cfd2d1]", children: "Cuando se acredite, te avisamos. Mientras tanto, pod\u00E9s seguir navegando." }), _jsx("div", { className: "mt-8 flex gap-3 justify-center", children: _jsx(Link, { to: "/", className: "px-6 py-3 bg-[#0d777b] text-white rounded", children: "Volver a la galer\u00EDa" }) })] }) }));
}
