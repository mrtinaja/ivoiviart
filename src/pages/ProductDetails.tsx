import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

import { useCart } from "../context/CartContext";
import ArtisticButton from "../components/ArtisticButton";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { useMedia } from "../context/MediaContext";

// Función para generar la URL pública en Google Cloud Storage (debe estar definida en algún lugar compartido)
const getStorageUrl = (fileName: string): string =>
  `https://storage.googleapis.com/ivoiviart/img/${encodeURIComponent(
    fileName
  )}`;

// URL fallback (asegúrate de que este archivo exista en el bucket)
const fallbackUrl = getStorageUrl("default.jpg");

declare global {
  interface Window {
    modalTimeout?: number;
  }
}

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const media = useMedia();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const product = media.find((item) => item.id === Number(id));

  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (product) {
      const savedIndex = localStorage.getItem(
        `product-${product.id}-currentIndex`
      );
      if (savedIndex !== null) {
        setCurrentIndex(
          Math.max(0, Math.min(Number(savedIndex), product.images.length - 1))
        );
      }
    }
  }, [product]);

  useEffect(() => {
    if (product) {
      localStorage.setItem(
        `product-${product.id}-currentIndex`,
        currentIndex.toString()
      );
    }
  }, [currentIndex, product]);

  useEffect(() => {
    setImageError(false);
  }, [currentIndex, product?.id]);

  if (!product) {
    return (
      <p className="text-center text-purple-500">Producto no encontrado</p>
    );
  }

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    if (!imageError) {
      console.warn(
        "Imagen no encontrada, usando fallback:",
        e.currentTarget.src
      );
      e.currentTarget.src = fallbackUrl;
      setImageError(true);
    }
  };

  const handleNextImage = () => {
    if (!product.images || product.images.length === 0) return;
    setCurrentIndex((prevIndex) => (prevIndex + 1) % product.images.length);
  };

  const handlePrevImage = () => {
    if (!product.images || product.images.length === 0) return;
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? product.images.length - 1 : prevIndex - 1
    );
  };

  const handleAddToCart = () => {
    addToCart({
      ...product,
      id: Number(product.id),
      price: product.price ?? 0,
    });
    setShowModal(true);
    if (window.modalTimeout) clearTimeout(window.modalTimeout);
    window.modalTimeout = window.setTimeout(() => setShowModal(false), 2000);
  };

  const handleGoToCart = () => {
    navigate("/carrito");
  };

  // Aquí product.images ya contiene URLs completas (desde GCS)
  const imageSrc =
    product.images && product.images.length > 0 && !imageError
      ? product.images[currentIndex]
      : fallbackUrl;

  console.log("Mostrando imagen:", imageSrc);

  return (
    <div className="bg-[#005e63] min-h-screen flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-4xl">
        <Link
          to="/"
          className="text-[#f0eceb] hover:underline text-lg font-semibold"
        >
          ← Volver a la Galería
        </Link>
      </div>

      <div className="bg-orange-200 shadow-md rounded-md p-6 w-full max-w-4xl mt-4 flex flex-col items-center">
        <div className="relative w-full flex justify-center items-center">
          {product.images.length > 1 && (
            <button
              onClick={handlePrevImage}
              className="absolute left-2 md:left-4 w-14 h-14 bg-[#90442a] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="w-8 h-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          )}

          <LazyLoadImage
            src={imageSrc}
            alt={product.description || "Imagen no disponible"}
            effect="blur"
            onError={handleImageError}
            className="w-full max-w-2xl object-contain rounded-lg shadow-lg"
          />

          {product.images.length > 1 && (
            <button
              onClick={handleNextImage}
              className="absolute right-2 md:right-4 w-14 h-14 bg-[#90442a] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="w-8 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          )}
        </div>

        <h1
          className="text-3xl font-bold text-gray-800 mt-4"
          style={{
            height: "72px",
            overflow: "hidden",
            fontFamily: "'Dancing Script', cursive",
          }}
        >
          {product.description}
        </h1>

        {product.price !== undefined && (
          <p
            className="text-5xl font-bold mt-2 tracking-wide bg-gradient-to-r from-[#90442a] via-[#005e63] to-[#90442a] bg-clip-text text-transparent drop-shadow-xl"
            style={{ WebkitTextStroke: "1px white" }}
          >
            ${product.price.toLocaleString()}
          </p>
        )}

        <div className="flex gap-4 mt-12 justify-center">
          <ArtisticButton
            onClick={handleAddToCart}
            className="w-64 text-center"
          >
            Añadir al carrito
          </ArtisticButton>
          <ArtisticButton onClick={handleGoToCart} className="w-64 text-center">
            🛒 Ir al carrito
          </ArtisticButton>
        </div>
      </div>

      {showModal && (
        <div
          className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg text-center transform scale-105 transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-lg font-semibold text-green-700">
              {product.description} se ha agregado al carrito 🛒
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
