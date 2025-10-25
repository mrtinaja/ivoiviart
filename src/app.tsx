/** @jsxImportSource preact */
import { Routes, Route } from "react-router-dom";
import type { FunctionalComponent } from "preact";

import Home from "./pages/Home";
import Acerca from "./pages/Acerca";
import Contacto from "./pages/Contacto";
import ProductDetails from "./pages/ProductDetails";
import CartPage from "./pages/CartPage";
import ThankYouPage from "./pages/ThankYouPage";

import { CartProvider } from "./context/CartContext";
import { MediaProvider } from "./services/media";

import Header from "./components/Header";
import Footer from "./components/Footer";

const App: FunctionalComponent = () => {
  return (
    <MediaProvider>
      <CartProvider>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/acerca" element={<Acerca />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/carrito" element={<CartPage />} />
          <Route path="/thank-you" element={<ThankYouPage />} />
        </Routes>
        <Footer />
      </CartProvider>
    </MediaProvider>
  );
};

export default App;
