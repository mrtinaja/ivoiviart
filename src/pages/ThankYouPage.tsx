// src/pages/ThankYouPage.tsx
import React, { useEffect, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

// Fuentes (si las usas)
import "@fontsource/open-sans/800.css";
import "@fontsource/open-sans/300.css";

const ThankYouPage: React.FC = () => {
  const { clearCart } = useCart();
  const [params] = useSearchParams();

  // MP puede retornar distintos nombres según flujo
  const info = useMemo(() => {
    const status =
      params.get("status") ||
      params.get("collection_status") || // a veces viene así
      "";
    const paymentId =
      params.get("payment_id") ||
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b1111] text-[#eae8e6] px-4">
      <div className="text-center">
        <div className="text-5xl md:text-6xl font-extrabold">¡Gracias!</div>
        <p className="mt-3 text-lg md:text-xl text-[#cfd2d1]">
          Tu compra fue iniciada correctamente.
        </p>

        {/* Detalle técnico opcional */}
        {(info.paymentId || info.prefId) && (
          <div className="mt-4 text-sm text-[#aab0af]">
            {info.paymentId && <div>ID de pago: <span className="font-mono">{info.paymentId}</span></div>}
            {info.prefId && <div>Preference: <span className="font-mono">{info.prefId}</span></div>}
            {info.status && <div>Estado reportado: <span className="uppercase">{info.status}</span></div>}
          </div>
        )}

        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="px-6 py-3 bg-[#0d777b] text-white font-semibold shadow-md hover:opacity-90 transition rounded"
          >
            Volver a la galería
          </Link>
          <Link
            to="/carrito"
            className="px-6 py-3 bg-black text-white font-semibold shadow-md hover:opacity-90 transition rounded"
          >
            Ver carrito (vacío)
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ThankYouPage;
