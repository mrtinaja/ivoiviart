import React, { useState } from "react";
import Logo from "../assets/Logo.jpg";
import { Link } from "react-router-dom";
import { FaWhatsapp, FaShoppingCart, FaBars, FaTimes } from "react-icons/fa";
import { useCart } from "../context/CartContext"; // Hook del carrito

const Header: React.FC = () => {
  const whatsappNumberRaw = "+5491166742221";
  const { cart } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  const openWhatsapp = () => {
    const whatsappURL = `https://wa.me/${whatsappNumberRaw.replace("+", "")}`;
    window.open(whatsappURL, "_blank");
  };

  return (
    <nav className="bg-gradient-to-r from-[#5a2b1b] to-[#d6785d] text-white gap-y-14 shadow-lg fixed top-0 w-full z-50 h-[75px] flex items-center">
      <div className="max-w-6xl mx-auto flex justify-between items-center w-full">
        {/* Logo y Nombre */}
        <div className="flex items-center gap-x-3">
          <Link to="/" className="hover:text-gray-300">
            <img src={Logo} alt="Logo" className="h-12 w-12 rounded-full" />
          </Link>
          <h2
            className="text-3xl font-bold text-yellow-50 hidden sm:block"
            style={{ fontFamily: "'Dancing Script', cursive" }}
          >
            IvoiviArt
          </h2>
        </div>

        {/* Menú Hamburguesa en móviles */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menú"
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Contenedor del Menú */}
        <div
          className={`md:flex md:items-center ${
            menuOpen
              ? "absolute top-full left-0 w-full bg-[#d6785d] shadow-md flex flex-col py-4 "
              : "hidden md:flex"
          } transition-all`}
        >
          <ul
            className="md:flex md:space-x-6 md:text-left w-full font-semibold "
            style={{
              fontFamily: "'Dancing Script', cursive",
            }}
          >
            <li className="py-2 md:py-0">
              <Link
                to="/"
                className="text-xl md:text-2xl text-white hover:text-gray-300 block md:inline"
              >
                Inicio
              </Link>
            </li>
            <li className="py- md:py-0">
              <Link
                to="/acerca"
                className="text-xl md:text-2xl text-white hover:text-gray-300 block md:inline"
              >
                Acerca
              </Link>
            </li>
            <li className="py-4 md:py-0">
              <Link
                to="/contacto"
                className="text-xl md:text-2xl text-white hover:text-gray-300 block md:inline"
              >
                Contacto
              </Link>
            </li>
          </ul>

          {/* Botón de WhatsApp (mantiene tamaño) */}
          <div className="flex justify-center md:justify-start mt-2 md:mt-0 ml-4">
            <button
              onClick={openWhatsapp}
              className="text-green-400 hover:text-green-500 text-3xl transition duration-200 mx-2"
              aria-label="WhatsApp"
            >
              <FaWhatsapp />
            </button>
          </div>

          {/* Ícono de Carrito con Notificación (mantiene tamaño) */}
          <div className="flex justify-right md:justify-start mt-2 md:mt-0">
            <Link to="/carrito" className="text-white text-3xl relative mx-2">
              <FaShoppingCart className="hover:text-yellow-300 transition duration-200" />
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
  );
};

export default Header;
