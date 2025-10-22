import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

// Normaliza: "001-movil-dinos.jpg" -> "Movil Dinos"
const pretty = (s: string) => {
  const base = (s || "")
    .replace(/^\s*\d+\s*[-_]?/, "") // prefijo numérico
    .replace(/\.(jpe?g|png|webp|gif)$/i, "") // extensión
    .replace(/[-_]+/g, " ") // guiones a espacio
    .trim();

  return base
    ? base
        .toLowerCase()
        .replace(/\b\p{L}/gu, (m) => m.toUpperCase())
    : "Sin Título";
};

type CardProps = {
  image: string;
  description: string;
};

const Card: React.FC<CardProps> = ({ image, description }) => {
  const label = pretty(description);

  return (
    <div
      className="
        group w-[260px] rounded-xl bg-[#0b2c2e]
        border border-teal-700/50 shadow-md overflow-hidden
        transition-transform duration-300 hover:scale-[1.03]
      "
    >
      <div className="relative">
        <LazyLoadImage
          src={image}
          alt={label}
          effect="blur"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "/img/default.jpg";
          }}
          className="
            w-full h-[340px] object-cover
            transition-transform duration-300
            group-hover:scale-[1.04]
            bg-black/30
          "
        />
        {/* línea fina arriba para darle “vida” */}
        <span className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-teal-400 via-amber-300 to-teal-400 opacity-70" />
      </div>

      <div className="bg-white/95 p-3">
        <p
          className="text-center text-[15px] leading-6 text-neutral-900 truncate"
          title={label}
          style={{ fontWeight: 500 }}
        >
          {label}
        </p>
      </div>
    </div>
  );
};

export default Card;
