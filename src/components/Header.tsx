import React from "react";
import { Link } from "react-router-dom";
import { FaWhatsapp, FaShoppingCart, FaBars, FaTimes } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import Logo from "../assets/logo.jpg";

const Header: React.FC = () => {
  const whatsappNumberRaw = "+5491166742221";
  const { cart } = useCart();
  const [menuOpen, setMenuOpen] = React.useState(false);

  const openWhatsapp = () => {
    const whatsappURL = `https://wa.me/${whatsappNumberRaw.replace("+", "")}`;
    window.open(whatsappURL, "_blank");
  };

  return (
    <>
      {/* NAV: más alto + gradiente verde a negro */}
      <nav
        className="
          fixed top-0 w-full z-50 
          text-white 
          shadow-lg
          bg-gradient-to-b from-[#005e63] via-[#043b3e] to-[#000000]
          backdrop-blur-[2px]
          h-[96px] sm:h-[112px] flex items-center
        "
      >
        <div className="max-w-6xl mx-auto flex justify-between items-center w-full px-4">
          {/* Logo + Marca */}
          <div className="flex items-center ">
            <Link to="/" className="hover:opacity-90 transition-opacity">
              <img
                src={Logo}
                alt="Logo"
                className="h-14 w-14 sm:h-16 sm:w-16 rounded-full ring-2 ring-white/20"
              />
            </Link>
            <h2
              className="text-3xl sm:text-3xl font-bold text-white/95 hidden sm:block tracking-wide ml-4"
            >
              IvoiviArt
            </h2>
          </div>

          {/* Toggle móvil */}
          <button
            className="md:hidden text-3xl"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Menú"
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>

          {/* Menú */}
          <div
            className={`
              md:flex md:items-center
              ${menuOpen
                ? "absolute top-full left-0 w-full bg-[#0b2e30] shadow-md flex flex-col py-4"
                : "hidden md:flex"}
              transition-all
            `}
          >
            <ul
              className="
                md:flex md:space-x-8 md:text-left w-full font-semibold
                text-white/95
              "
              
            >
              <li className="py-2 md:py-0">
                <Link to="/" className="text-xl md:text-1xl hover:text-white">
                  Inicio
                </Link>
              </li>
              <li className="py-2 md:py-0">
                <Link to="/acerca" className="text-xl md:text-1xl hover:text-white">
                  Acerca
                </Link>
              </li>
              <li className="py-2 md:py-0">
                <Link to="/contacto" className="text-xl md:text-1xl hover:text-white">
                  Contacto
                </Link>
              </li>
            </ul>

            {/* WhatsApp */}
            <div className="flex justify-center md:justify-start mt-2 md:mt-0 md:ml-4">
              <button
                onClick={openWhatsapp}
                className="text-3xl transition-transform hover:scale-110 mx-2"
                aria-label="WhatsApp"
                title="WhatsApp"
              >
                <FaWhatsapp />
              </button>
            </div>

            {/* Carrito */}
            <div className="flex justify-right md:justify-start mt-2 md:mt-0">
              <Link to="/carrito" className="text-white text-3xl relative mx-2" title="Carrito">
                <span className="inline-flex hover:scale-110 transition-transform">
                  <FaShoppingCart />
                </span>
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Línea de transición viva (debajo del header) */}
      <div
        className="
          fixed top-[96px] sm:top-[112px] left-0 w-full z-40
          h-[3px] sm:h-[4px]
          bg-gradient-to-r from-[#e6c105] via-[#fff] to-[#e6c105]
          opacity-80
        "
      />
      {/* empuje del contenido para no quedar debajo del header */}
      <div className="h-[96px] sm:h-[112px]" />
    </>
  );
};

export default Header;
