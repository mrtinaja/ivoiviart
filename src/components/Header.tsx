// src/components/Header.tsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaWhatsapp,
  FaShoppingCart,
  FaHome,
  FaInfoCircle,
  FaEnvelope,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../context/CartContext";

/** WhatsApp */
const WHATSAPP = "+5491166742221";
const openWhatsapp = () => {
  const url = `https://wa.me/${WHATSAPP.replace("+", "")}`;
  window.open(url, "_blank");
};

/** Botón hamburguesa animado con contador */
const Burger: React.FC<{
  open: boolean;
  onClick: () => void;
  count?: number;
}> = ({ open, onClick, count }) => {
  const showBadge = typeof count === "number" && count > 0;

  return (
    <button
      onClick={onClick}
      aria-label={open ? "Cerrar menú" : "Abrir menú"}
      className="md:hidden relative w-11 h-11 grid place-items-center rounded-full bg-black/35 hover:bg-black/50 transition-colors shadow-lg"
    >
      {/* barras */}
      <span
        className={`absolute block h-[2px] w-6 bg-white transition-all duration-300 ${
          open ? "rotate-45 translate-y-0" : "-translate-y-[6px]"
        }`}
      />
      <span
        className={`absolute block h-[2px] w-6 bg-white transition-opacity duration-200 ${
          open ? "opacity-0" : "opacity-100"
        }`}
      />
      <span
        className={`absolute block h-[2px] w-6 bg-white transition-all duration-300 ${
          open ? "-rotate-45 translate-y-0" : "translate-y-[6px]"
        }`}
      />

      {/* badge del carrito, SIEMPRE sobre el botón */}
      {showBadge && (
        <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] px-1 grid place-items-center leading-none">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </button>
  );
};

/** Ítems del abanico mobile */
type FanItem =
  | { type: "link"; to: string; label: string; icon: React.ReactNode }
  | { type: "action"; onClick: () => void; label: string; icon: React.ReactNode };

const fanItems: FanItem[] = [
  { type: "link", to: "/", label: "Inicio", icon: <FaHome /> },
  { type: "link", to: "/acerca", label: "Acerca", icon: <FaInfoCircle /> },
  { type: "link", to: "/contacto", label: "Contacto", icon: <FaEnvelope /> },
  { type: "action", onClick: openWhatsapp, label: "WhatsApp", icon: <FaWhatsapp /> },
];

const Header: React.FC = () => {
  const { cart } = useCart();
  const { pathname } = useLocation();
  const [open, setOpen] = React.useState(false);

  // Cerrar al navegar
  React.useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Escape cierra menú
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Evitar scroll de fondo cuando el menú está abierto
  React.useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  // Geometría del abanico (abre hacia abajo/izquierda)
  const R = 120;
  const angleStart = (110 * Math.PI) / 180;
  const angleEnd = (170 * Math.PI) / 180;

  const angles: number[] =
    fanItems.length === 1
      ? [Math.PI * 0.75]
      : fanItems.map((_, i) => {
          const t = i / (fanItems.length - 1);
          return angleStart + t * (angleEnd - angleStart);
        });

  return (
    <>
      {/* HEADER */}
      <nav
        className="
          fixed top-0 w-full z-50 text-white shadow-lg
          bg-gradient-to-b from-[#005e63] via-[#043b3e] to-[#000000]
          backdrop-blur-[2px] h-[96px] sm:h-[112px] flex items-center
        "
      >
        <div className="max-w-6xl mx-auto flex justify-between items-center w-full px-4">
          {/* Logo + Marca */}
          <div className="flex items-center">
            <Link to="/" className="hover:opacity-90 transition-opacity">
              <img
                src="/logo.jpg"
                alt="logo"
                className="h-14 w-14 sm:h-16 sm:w-16 rounded-full ring-2 ring-white/20"
              />
            </Link>
            <h2 className="text-3xl font-bold text-white/95 hidden sm:block tracking-wide ml-4">
              IvoiviArt
            </h2>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center gap-8 font-semibold">
            <Link to="/" className="hover:text-white text-white/95">
              Inicio
            </Link>
            <Link to="/acerca" className="hover:text-white text-white/95">
              Acerca
            </Link>
            <Link to="/contacto" className="hover:text-white text-white/95">
              Contacto
            </Link>

            <button
              onClick={openWhatsapp}
              className="text-2xl transition-transform hover:scale-110"
              aria-label="WhatsApp"
              title="WhatsApp"
            >
              <FaWhatsapp />
            </button>

            <Link
              to="/carrito"
              className="relative text-2xl"
              title="Carrito"
              aria-label="Carrito"
            >
              <FaShoppingCart />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 grid place-items-center">
                  {cart.length}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile: solo el botón hamburguesa */}
          <div className="md:hidden">
            <Burger
              open={open}
              onClick={() => setOpen((v) => !v)}
              count={cart.length}
            />
          </div>
        </div>
      </nav>

      {/* Overlay (click para cerrar) */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="overlay"
            className="fixed inset-0 z-40 bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Abanico flotante anclado cerca del botón */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="fan"
            className="fixed top-[70px] right-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
          >
            <div className="relative">
              {/* FAB carrito */}
              <div className="absolute right-0 top-0 translate-x-[6px] -translate-y-[6px]">
                <Link
                  to="/carrito"
                  onClick={() => setOpen(false)}
                  className="relative grid place-items-center w-12 h-12 rounded-full bg-black/70 text-white shadow-lg"
                  aria-label="Carrito"
                  title="Carrito"
                >
                  <FaShoppingCart />
                  {cart.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold rounded-full w-4 h-4 grid place-items-center">
                      {cart.length}
                    </span>
                  )}
                </Link>
              </div>

              {/* Items del abanico */}
              {fanItems.map((item, i) => {
                const x = Math.cos(angles[i]) * R;
                const y = Math.sin(angles[i]) * R;
                return (
                  <motion.div
                    key={i}
                    className="absolute right-0 top-0"
                    initial={{ x: 0, y: 0, scale: 0.5, opacity: 0 }}
                    animate={{ x, y, scale: 1, opacity: 1 }}
                    exit={{ x: 0, y: 0, scale: 0.5, opacity: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 320,
                      damping: 22,
                      delay: 0.02 * i,
                    }}
                  >
                    {item.type === "link" ? (
                      <Link
                        to={item.to}
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-2 pl-3 pr-3 py-2 rounded-full bg-[#0b2e30] text-white shadow-md border border-white/10"
                      >
                        <span className="text-lg">{item.icon}</span>
                        <span className="text-sm font-medium">
                          {item.label}
                        </span>
                      </Link>
                    ) : (
                      <button
                        onClick={() => {
                          item.onClick();
                          setOpen(false);
                        }}
                        className="flex items-center gap-2 pl-3 pr-3 py-2 rounded-full bg-[#0b2e30] text-white shadow-md border border-white/10"
                      >
                        <span className="text-lg">{item.icon}</span>
                        <span className="text-sm font-medium">
                          {item.label}
                        </span>
                      </button>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Línea viva bajo el header */}
      <div
        className="
          fixed top-[96px] sm:top-[112px] left-0 w-full z-40
          h-[3px] sm:h-[4px]
          bg-gradient-to-r from-[#e6c105] via-[#fff] to-[#e6c105] opacity-80
        "
      />
      {/* Empuje del contenido */}
      <div className="h-[96px] sm:h-[112px]" />
    </>
  );
};

export default Header;
