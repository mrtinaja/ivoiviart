// src/pages/ProductDetails.tsx
import React, { useMemo, useState, useEffect, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { motion } from "framer-motion";
import { useCart } from "../context/CartContext";
import { useMedia } from "../services/media";

const fallbackUrl = "/img/default.jpg";

/** Helpers locales (no se importan de Card) */
const capitalizeWords = (s: string) =>
  s.replace(/\b\p{L}/gu, (m) => m.toUpperCase());

const humanize = (s: string) =>
  capitalizeWords(
    (s || "")
      .replace(/^\s*\d+\s*[-_]?/, "") // quita prefijo numérico + guión
      .replace(/[-_]+/g, " ") // guiones -> espacios
      .trim()
  ) || "Sin título";

const ProductDetails: React.FC = () => {
  const { id: routeId } = useParams<{ id: string }>(); // ej: "003"
  const { media, loading, error } = useMedia();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  /** Resolver el producto:
   *  1) match exacto con id (string)
   *  2) match por número inicial (acepta /product/3 o /product/003)
   */
  const product = useMemo(() => {
    if (!media || !routeId) return undefined;

    const exact = media.find((p) => String(p.id) === routeId);
    if (exact) return exact;

    const n = Number(routeId);
    if (Number.isFinite(n)) {
      return media.find((p) => Number(p.code) === n);
    }
    return undefined;
  }, [media, routeId]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    setImageError(false);
    setCurrentIndex(0);
    setIsZoomed(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.id]);

  const images = useMemo(
    () => (product?.images && Array.isArray(product.images) ? product.images : []),
    [product?.images]
  );
  const imageSrc =
    images.length && !imageError ? images[currentIndex] : fallbackUrl;

  // Precio: llega normalizado (number | null) desde el provider
  const priceNum = product?.price ?? null;
  const hasPrice = priceNum !== null && Number.isFinite(priceNum);

  // CartContext espera id:number -> usamos el número del code (p.e. "003" -> 3)
  const handleAddToCart = () => {
    if (!product) return;
    const numericId = Number(product.code) || 0;

    addToCart({
      id: numericId,
      price: hasPrice ? (priceNum as number) : 0,
      images: images,
      description: product.description ?? "",
    });
  };

  // Navegación con flechas
  const next = useCallback(() => {
    if (!images.length) return;
    setCurrentIndex((i) => (i + 1) % images.length);
  }, [images.length]);

  const prev = useCallback(() => {
    if (!images.length) return;
    setCurrentIndex((i) => (i - 1 + images.length) % images.length);
  }, [images.length]);

  // Atajos de teclado
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "Escape") setIsZoomed(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  if (loading) return <div className="p-8 text-[#f0eceb]">cargando…</div>;
  if (error) return <div className="p-8 text-red-300">Error: {String(error)}</div>;
  if (!product) return <div className="p-8 text-[#f0eceb]">Producto no encontrado</div>;

  const title = humanize(product.description || "");

  return (
    <div className="bg-[#0a0f10] min-h-screen flex flex-col items-center justify-start pt-[90px] pb-16 px-4">
      {/* Bread / Back */}
      <div className="w-full max-w-5xl">
        <Link
          to="/"
          className="text-[#eae8e6] hover:underline text-base sm:text-lg font-semibold"
        >
          ← Volver a la Galería
        </Link>
      </div>

      {/* Card principal */}
      <div className="w-full max-w-5xl mt-8">
        <div className="bg-[rgba(0,94,99,0.6)] rounded-xl shadow-xl p-4 sm:p-6 md:p-8 flex flex-col items-center overflow-hidden relative">

          {/* Imagen grande con zoom */}
          <div className="relative w-full flex justify-center items-center select-none">
            <motion.div
              className="relative"
              initial={{ scale: 0.98 }}
              animate={{ scale: isZoomed ? 1.1 : 1 }}
              transition={{ duration: 0.2 }}
            >
              <LazyLoadImage
                src={imageSrc}
                alt={title}
                effect="blur"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = fallbackUrl;
                  setImageError(true);
                }}
                className="max-w-[900px] w-full max-h-[70vh] object-contain rounded-lg shadow-lg cursor-zoom-in"
                onClick={() => setIsZoomed((z) => !z)}
              />
            </motion.div>

            {/* Flechas desktop */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prev}
                  className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white w-10 h-10 rounded-full items-center justify-center"
                  aria-label="Anterior"
                >
                  ‹
                </button>
                <button
                  onClick={next}
                  className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white w-10 h-10 rounded-full items-center justify-center"
                  aria-label="Siguiente"
                >
                  ›
                </button>
              </>
            )}
          </div>

          {/* Miniaturas */}
          {!!images.length && (
            <div className="flex gap-2 mt-4 flex-wrap justify-center">
              {images.map((img, index) => (
                <button
                  key={`${product.id}-${index}`}
                  className={`w-16 h-16 rounded-md overflow-hidden border-2 ${
                    currentIndex === index
                      ? "border-white"
                      : "border-transparent"
                  }`}
                  onClick={() => setCurrentIndex(index)}
                  aria-label={`Miniatura ${index + 1}`}
                >
                  <img
                    src={img}
                    alt={`Miniatura ${index + 1}`}
                    className="object-cover w-full h-full"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = fallbackUrl;
                    }}
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Título */}
          <h1
            className="text-3xl md:text-4xl  text-[#f5f3f1] mt-6 text-center"
           
          >
            {title}
          </h1>

          {/* Precio */}
          {hasPrice ? (
            <p
              className="text-3xl md:text-4xl font-extrabold mt-3 tracking-wide bg-gradient-to-r from-[#d7b876] via-[#e7d9a8] to-[#d7b876] bg-clip-text text-transparent drop-shadow-xl"
              style={{ WebkitTextStroke: "0.5px rgba(0,0,0,0.25)" }}
            >
              ${Number(priceNum).toLocaleString("es-AR")}
            </p>
          ) : (
            <p className="mt-3 text-[#f0eceb] text-xl">Precio: consultar</p>
          )}

          {/* Acciones */}
        <div className="flex flex-col sm:flex-row gap-3 mt-10 justify-center w-full max-w-xl">
  {/* Primario */}
  <button
    onClick={handleAddToCart}
    aria-label="Añadir al carrito"
    className="w-full rounded-none py-4 bg-[#2f777b] text-white font-semibold
               shadow-[0_10px_28px_rgba(0,0,0,.45)]
               active:scale-[.98] transition-transform duration-150
               focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
  >
    Añadir al carrito
  </button>

  {/* Secundario: negro */}
  

  {/* Tercero: ir al carrito */}
  <button
    onClick={() => navigate('/carrito')}
    aria-label="Ir al carrito"
    className="w-full rounded-none py-4 bg-[#043e41] text-white font-semibold
               shadow-[0_10px_28px_rgba(0,0,0,.45)]
               active:scale-[.98] transition-transform duration-150
               focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
  >
    🛒 Ir al carrito
  </button>
  <Link
    to="/"
    aria-label="Volver a la Galería"
    className="w-full text-center rounded-none py-4 bg-[#0b0b0b] text-[#eae8e6] font-semibold
               shadow-[0_12px_32px_rgba(0,0,0,.6)]
               active:scale-[.98] transition-transform duration-150
               focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
  >
    Volver a la Galería
  </Link>
</div>

        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
