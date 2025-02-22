import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Acerca from "./pages/Acerca";
import Contacto from "./pages/Contacto";
import Header from "./components/Header";
import { MediaProvider } from "./context/MediaContext";
import { CartProvider } from "./context/CartContext";
import ProductDetails from "./pages/ProductDetails";
import CartPage from "./pages/CartPage"; // Importar la nueva pantalla
import ThankYouPage from "./pages/ThankYouPage";
import "@fontsource/open-sans/800.css";
import "@fontsource/open-sans/300.css";

const App: React.FC = () => {
  return (
    <MediaProvider>
      <CartProvider>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Acerca" element={<Acerca />} />
          <Route path="/Contacto" element={<Contacto />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/carrito" element={<CartPage />} />{" "}
          <Route path="/thank-you" element={<ThankYouPage />} />
          {/* Agregamos la ruta del carrito */}
        </Routes>
      </CartProvider>
    </MediaProvider>
  );
};

export default App;
