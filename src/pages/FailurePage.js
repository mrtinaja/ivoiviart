import { jsx as _jsx, jsxs as _jsxs } from "preact/jsx-runtime";
import { Link } from "react-router-dom";
export default function FailurePage() {
    return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-[#0b1111] text-[#eae8e6] px-4", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-4xl md:text-5xl font-extrabold", children: "Pago rechazado o cancelado" }), _jsx("p", { className: "mt-3 text-lg text-[#cfd2d1]", children: "Pod\u00E9s intentar nuevamente." }), _jsxs("div", { className: "mt-8 flex gap-3 justify-center", children: [_jsx(Link, { to: "/carrito", className: "px-6 py-3 bg-[#0d777b] text-white rounded", children: "Volver al carrito" }), _jsx(Link, { to: "/", className: "px-6 py-3 bg-black text-white rounded", children: "Ir a la galer\u00EDa" })] })] }) }));
}
