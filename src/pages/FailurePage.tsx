// src/pages/FailurePage.tsx
import React from "react";
import { Link } from "react-router-dom";

export default function FailurePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b1111] text-[#eae8e6] px-4">
      <div className="text-center">
        <div className="text-4xl md:text-5xl font-extrabold">Pago rechazado o cancelado</div>
        <p className="mt-3 text-lg text-[#cfd2d1]">Podés intentar nuevamente.</p>
        <div className="mt-8 flex gap-3 justify-center">
          <Link to="/carrito" className="px-6 py-3 bg-[#0d777b] text-white rounded">Volver al carrito</Link>
          <Link to="/" className="px-6 py-3 bg-black text-white rounded">Ir a la galería</Link>
        </div>
      </div>
    </div>
  );
}
