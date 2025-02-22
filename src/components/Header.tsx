import React, { useState } from "react";
import Logo from "../assets/Logo.jpg";
import { Link } from "react-router-dom";
import { FaWhatsapp, FaShoppingCart, FaBars, FaTimes } from "react-icons/fa";
import { useCart } from "../context/CartContext"; // Hook del carrito

const Header: React.FC = () => {
  const whatsappNumberRaw = "+5491166742221";
  const { cart } = useCart(); // Obtiene la cantidad de productos en el carrito
  const [menuOpen, setMenuOpen] = useState(false);

  const openWhatsapp = () => {
    const whatsappURL = `https://wa.me/${whatsappNumberRaw.replace("+", "")}`;
    window.open(whatsappURL, "_blank");
  };

  return (
    <nav className="bg-[#90442a] text-white p-4">
      <div className="w-full flex justify-between items-center flex-wrap">
        {/* Logo y Nombre */}
        <div className="flex items-center gap-x-3">
          <Link to="/" className="hover:text-gray-300">
            <img src={Logo} alt="Logo" className="h-20 w-20 rounded-full" />
          </Link>
          <h2
            className="ext-3xl sm:text-4xl p-2 mt-5 sm:mb-6 font-bold text-yellow-50"
            style={{ fontFamily: "'Dancing Script', cursive" }}
          >
            IvoiviArt
          </h2>
        </div>

        {/* Menú Hamburguesa en móviles */}
        <button
          className="text-2xl md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menú"
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Menú en Desktop */}
        <ul
          className={`md:flex md:space-x-6 items-center text-lg transition-all ${
            menuOpen ? "flex flex-col mt-4 space-y-4 w-full" : "hidden md:flex"
          }`}
        >
          <li>
            <Link
              to="/"
              className="text-3xl sm:text-2xl  text-yellow-50 mb-4 sm:mb-6"
            >
              Inicio
            </Link>
          </li>
          <li>
            <Link
              to="/acerca"
              className="text-3xl sm:text-2xl  text-yellow-50 mb-4 sm:mb-6"
            >
              Acerca
            </Link>
          </li>
          <li>
            <Link
              to="/contacto"
              className="text-3xl sm:text-2xl  text-yellow-50 mb-4 sm:mb-6"
            >
              Contacto
            </Link>
          </li>

          {/* Botón de WhatsApp */}
          <li>
            <button
              onClick={openWhatsapp}
              className="text-green-500 hover:text-green-600 text-3xl transition duration-200"
              aria-label="WhatsApp"
            >
              <FaWhatsapp />
            </button>
          </li>

          {/* Ícono de Carrito con Notificación */}
          <li className="relative">
            <Link to="/carrito" className="text-white text-4xl relative">
              <FaShoppingCart className="hover:text-yellow-200 transition duration-200 " />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Header;
