import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import axios from "axios";
import TrashButton from "../components/TrashButton";
import { motion, AnimatePresence } from "framer-motion";

// URL de fallback en caso de error
const fallbackUrl =
  "https://storage.googleapis.com/ivoiviart-bucket/img/default.jpg";

const CartPage: React.FC = () => {
  const { cart, removeFromCart, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [itemsToRemove, setItemsToRemove] = useState<number[]>([]);

  // Calcular el total del carrito
  const total = cart.reduce((acc, item) => acc + (item.price || 0), 0);

  // ✅ Función mejorada para animación de eliminación
  const handleRemove = (id: number) => {
    setItemsToRemove((prev) => [...prev, id]); // Marcamos como "en proceso de eliminar"

    setTimeout(() => {
      removeFromCart(id); // Eliminamos realmente después de la animación
      setItemsToRemove((prev) => prev.filter((item) => item !== id));
    }, 300); // Duración de la animación de salida
  };

  // Función para procesar el pago
  const handlePay = async () => {
    if (cart.length === 0) {
      alert("El carrito está vacío.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8080/create-preference",
        {
          items: cart.map((product) => ({
            title: product.description,
            unit_price: product.price,
            quantity: 1,
          })),
        }
      );

      // Redirigir a Mercado Pago
      window.location.href = `https://www.mercadopago.com.ar/checkout/v1/redirect?preference_id=${response.data.id}`;
    } catch (error) {
      console.error("Error al procesar el pago:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[rgb(0,94,99)] min-h-screen flex flex-col justify-center items-center pt-20">
      <div className="max-w-4xl mx-auto bg-[#7fbec2] p-10 rounded-lg shadow-lg">
        <div className="w-full 5 mx-auto  mb-12">
          <Link
            to="/"
            className="text-gray-800 hover:underline text-lg font-semibold"
          >
            ← Volver a la Galería
          </Link>
        </div>

        <h1
          className="text-4xl font-bold text-gray-800 mb-8 text-center"
          style={{
            height: "72px",
            overflow: "hidden",
            fontFamily: "'Dancing Script', cursive",
          }}
        >
          🛒 Tu Carrito
        </h1>

        {cart.length === 0 ? (
          <p className="text-center text-gray-600 text-xl">
            No hay productos en el carrito.
          </p>
        ) : (
          <div>
            {/* Lista de productos con animaciones */}
            <ul>
              <AnimatePresence>
                {cart.map((product) => (
                  <motion.li
                    key={product.id} // 🔥 Ahora es 100% único
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5, x: -100 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center justify-between border-b py-6"
                  >
                    {/* Imagen miniatura */}
                    <img
                      src={product.images[0]}
                      alt={product.description}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = fallbackUrl;
                      }}
                      className="w-20 h-20 object-cover rounded-md shadow-sm"
                    />

                    {/* Descripción */}
                    <p className="text-xl text-black flex-1 mx-6">
                      {product.description}
                    </p>

                    {/* Precio */}
                    <p className="text-purple-600-700 text-2xl p-4">
                      ${product.price}
                    </p>

                    {/* Botón eliminar con animación */}
                    <TrashButton
                      onClick={() => handleRemove(product.id)}
                      disabled={itemsToRemove.includes(product.id)}
                    />
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>

            {/* Subtotal y botón para vaciar carrito */}
            <div className="mt-8 text-right pt-4 border-t">
              <h2
                className="text-3xl font-bold mt-2 tracking-wide bg-gradient-to-r from-[#2a6b6e] via-[#02393c] to-[#155d68] bg-clip-text text-transparent drop-shadow-xl"
                style={{ WebkitTextStroke: "1px white" }}
              >
                Total: $ {total.toLocaleString()}
              </h2>
              <button
                onClick={clearCart}
                className="relative overflow-hidden mt-4 px-3 py-2 text-base font-semibold text-white rounded-md bg-red-700"
              >
                Vaciar carrito
              </button>
            </div>

            {/* Botón para volver a la tienda */}
            <div className="mt-8 text-right">
              <Link
                to="/"
                className="relative overflow-hidden px-3 py-2 text-base font-semibold text-white rounded-md bg-gradient-to-r from-[#71ccd1] via-[#005e63] to-[#2a8290]  shadow-lg transition-all duration-300 hover:from-[#005e63] hover:via-[#90442a] hover:to-[#005e63] active:scale-95 focus:outline-none inline-block mt-6"
              >
                Seguir comprando
              </Link>
            </div>

            {/* Botón para pagar con Mercado Pago */}
            <div className="mt-8 text-center">
              <button
                onClick={handlePay}
                className="relative overflow-hidden px-3 py-2 text-base font-semibold text-black rounded-md bg-gradient-to-r from-[#009ee3] via-[#04e9f5] to-[#009ee3] shadow-lg transition-all duration-300 hover:from-[#04e9f5] hover:via-[#009ee3] hover:to-[#04e9f5] active:scale-95 focus:outline-none inline-block mt-6"
                disabled={loading}
              >
                {loading ? "Procesando..." : "Pagar con Mercado Pago"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
