import { jsx as _jsx, jsxs as _jsxs } from "preact/jsx-runtime";
// src/pages/ThankYouPage.tsx
import { useEffect, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
// Fuentes (si las usas)
import "@fontsource/open-sans/800.css";
import "@fontsource/open-sans/300.css";
const ThankYouPage = () => {
    const { clearCart } = useCart();
    const [params] = useSearchParams();
    // MP puede retornar distintos nombres según flujo
    const info = useMemo(() => {
        const status = params.get("status") ||
            params.get("collection_status") || // a veces viene así
            "";
        const paymentId = params.get("payment_id") ||
            params.get("collection_id") ||
            "";
        const prefId = params.get("preference_id") || "";
        return { status: status.toLowerCase(), paymentId, prefId };
    }, [params]);
    // Vacía carrito una sola vez al aterrizar
    useEffect(() => {
        // si querés ser más estricto: if (info.status === "approved") clearCart();
        clearCart();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-[#0b1111] text-[#eae8e6] px-4", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-5xl md:text-6xl font-extrabold", children: "\u00A1Gracias!" }), _jsx("p", { className: "mt-3 text-lg md:text-xl text-[#cfd2d1]", children: "Tu compra fue iniciada correctamente." }), (info.paymentId || info.prefId) && (_jsxs("div", { className: "mt-4 text-sm text-[#aab0af]", children: [info.paymentId && _jsxs("div", { children: ["ID de pago: ", _jsx("span", { className: "font-mono", children: info.paymentId })] }), info.prefId && _jsxs("div", { children: ["Preference: ", _jsx("span", { className: "font-mono", children: info.prefId })] }), info.status && _jsxs("div", { children: ["Estado reportado: ", _jsx("span", { className: "uppercase", children: info.status })] })] })), _jsxs("div", { className: "mt-8 flex flex-col sm:flex-row gap-3 justify-center", children: [_jsx(Link, { to: "/", className: "px-6 py-3 bg-[#0d777b] text-white font-semibold shadow-md hover:opacity-90 transition rounded", children: "Volver a la galer\u00EDa" }), _jsx(Link, { to: "/carrito", className: "px-6 py-3 bg-black text-white font-semibold shadow-md hover:opacity-90 transition rounded", children: "Ver carrito (vac\u00EDo)" })] })] }) }));
};
export default ThankYouPage;
