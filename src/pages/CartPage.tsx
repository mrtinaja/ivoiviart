import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import axios from "axios";
import TrashButton from "../components/TrashButton";

// URL de fallback en caso de error (asegúrate de que exista en tu bucket o donde quieras alojarlo)
const fallbackUrl =
  "https://storage.googleapis.com/ivoiviart-bucket/img/default.jpg";

const CartPage: React.FC = () => {
  const { cart, removeFromCart, clearCart } = useCart();
  const [loading, setLoading] = useState(false);

  // Calcular el total del carrito
  const total = cart.reduce((acc, item) => acc + (item.price || 0), 0);

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
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-4xl mx-auto bg-white p-10 rounded-lg shadow-lg">
        <div className="w-full max-w-4xl">
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
            {/* Lista de productos */}
            <ul>
              {cart.map((product) => (
                <li
                  key={product.id}
                  className="flex items-center justify-between border-b py-6"
                >
                  {/* Imagen miniatura: ya no anteponemos '/', pues product.images[0] es URL completa */}
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
                  <p className="text-xl text-yellow-700 flex-1 mx-6">
                    {product.description}
                  </p>

                  {/* Precio */}
                  <p className="text-purple-600-700 text-2xl p-4">
                    ${product.price}
                  </p>

                  {/* Botón eliminar */}
                  <TrashButton onClick={() => removeFromCart(product.id)} />
                </li>
              ))}
            </ul>

            {/* Subtotal y botón para vaciar carrito */}
            <div className="mt-8 text-right pt-4 border-t">
              <h2
                className="text-3xl font-bold mt-2 tracking-wide bg-gradient-to-r from-[#71ccd1] via-[#005e63] to-[#2a8290] bg-clip-text text-transparent drop-shadow-xl"
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
