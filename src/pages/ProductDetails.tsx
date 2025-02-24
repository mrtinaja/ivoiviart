import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import ArtisticButton from "../components/ArtisticButton";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { useMedia } from "../context/MediaContext";

const getStorageUrl = (fileName: string): string =>
  `https://storage.googleapis.com/ivoiviart/img/${encodeURIComponent(
    fileName
  )}`;

const fallbackUrl = getStorageUrl("default.jpg");

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
    setImageError(false);
  }, [product?.id]);

  if (!product) {
    return (
      <p className="text-center text-purple-500">Producto no encontrado</p>
    );
  }

  const handleNextImage = () => {
    if (product.images.length === 0) return;
    setCurrentIndex((prevIndex) => (prevIndex + 1) % product.images.length);
  };

  const handlePrevImage = () => {
    if (product.images.length === 0) return;
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? product.images.length - 1 : prevIndex - 1
    );
  };

  const handleThumbnailClick = (index: number) => {
    setCurrentIndex(index);
  };

  const handleAddToCart = () => {
    addToCart({
      ...product,
      id: Number(product.id),
      price: product.price ?? 0,
    });
    setShowModal(true);
    setTimeout(() => setShowModal(false), 2000);
  };

  const handleGoToCart = () => {
    navigate("/carrito");
  };

  const imageSrc =
    product.images.length > 0 && !imageError
      ? product.images[currentIndex]
      : fallbackUrl;

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

      <div className="bg-[#2f777b] shadow-md rounded-md p-6 w-full max-w-4xl mt-12 flex flex-col items-center overflow-hidden">
        <div className="relative w-full flex justify-center items-center">
          <LazyLoadImage
            src={imageSrc}
            alt={product.description || "Imagen no disponible"}
            effect="blur"
            onError={(e) => {
              console.error("⚠️ Error al cargar imagen:", e.currentTarget.src);
              e.currentTarget.onerror = null;
              e.currentTarget.src = fallbackUrl;
            }}
            className="w-auto max-w-[600px] h-auto max-h-[80vh] object-contain rounded-lg shadow-lg transition-opacity duration-500"
          />
        </div>

        {/* Miniaturas debajo de la imagen */}
        <div className="flex gap-2 mt-4">
          {product.images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt="Miniatura"
              onClick={() => handleThumbnailClick(index)}
              className={`w-16 h-16 object-cover rounded-md shadow-md cursor-pointer border-2 ${
                currentIndex === index ? "border-white" : "border-transparent"
              }`}
            />
          ))}
        </div>

        <h1
          className="text-3xl font-bold text-black mt-4"
          style={{ fontFamily: "'Dancing Script', cursive" }}
        >
          {product.description}
        </h1>

        {product.price !== undefined && (
          <p
            className="text-4xl font-bold mt-4 tracking-wide bg-gradient-to-r from-[#90442a] via-[#005e63] to-[#90442a] bg-clip-text text-transparent drop-shadow-xl"
            style={{ WebkitTextStroke: "2px white" }}
          >
            ${product.price.toLocaleString()}
          </p>
        )}

        <div className="flex flex-col md:flex-row gap-4 mt-12 justify-center w-full">
          <ArtisticButton
            onClick={handleAddToCart}
            className="w-full md:w-64 text-center"
          >
            Añadir al carrito
          </ArtisticButton>
          <Link
            to="/"
            className="text-[#070302] hover:underline text-lg font-semibold text-center"
          >
            ← Volver a la Galería
          </Link>
          <ArtisticButton
            onClick={handleGoToCart}
            className="w-full md:w-64 text-center"
          >
            🛒 Ir al carrito
          </ArtisticButton>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
