import React, { useMemo } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

// Normaliza: "001-movil-dinos.jpg" -> "Movil Dinos"
const pretty = (s: string) => {
  const base = (s || "")
    .replace(/^\s*\d+\s*[-_]?/, "")
    .replace(/\.(jpe?g|png|webp|gif)$/i, "")
    .replace(/[-_]+/g, " ")
    .trim();

  return base
    ? base.toLowerCase().replace(/\b\p{L}/gu, (m) => m.toUpperCase())
    : "Sin Título";
};

type CardProps = { image: string; description: string };

const FALLBACK = "/img/default.jpg";

const fileFromUrl = (url: string): string | null => {
  try {
    const noQuery = url.split("?")[0];
    const last = decodeURIComponent(noQuery.split("/").pop() || "");
    return last || null;
  } catch {
    return null;
  }
};

const swapDashVariant = (name: string) => {
  const m = name.match(/^(.*?)(-\d+)?\.(jpg|jpeg|png|webp|gif)$/i);
  if (!m) return null;
  const base = m[1];
  const ext = m[3];
  if (m[2]) return `${base}.${ext}`;
  return `${base}-1.${ext}`;
};

const slugFromDesc = (s: string) =>
  (s || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const Card: React.FC<CardProps> = ({ image, description }) => {
  const label = pretty(description);

  const candidates = useMemo(() => {
    const list: string[] = [];
    const filename = fileFromUrl(image);
    if (filename) {
      list.push(`/img/${filename}`);
      const alt = swapDashVariant(filename);
      if (alt) list.push(`/img/${alt}`);
    }
    const slug = slugFromDesc(description);
    if (slug) {
      ["jpg", "jpeg", "png", "webp"].forEach((ext) => {
        list.push(`/img/${slug}.${ext}`);
        list.push(`/img/${slug}-1.${ext}`);
      });
    }
    list.push(FALLBACK);
    return Array.from(new Set(list));
  }, [image, description]);

  const initialSrc =
    typeof image === "string" && image.trim() && !/^(null|undefined)$/i.test(image)
      ? image
      : candidates[0] ?? FALLBACK;

  return (
    <div
      className="
        group w-full rounded-xl bg-[#0b2c2e]
        border border-teal-700/50 shadow-md overflow-hidden
        transition-transform duration-300 hover:scale-[1.03]
      "
    >
      <div className="relative">
        <LazyLoadImage
          src={initialSrc}
          alt={label}
          effect="blur"
          onError={(e) => {
            const el = e.currentTarget as HTMLImageElement;
            const i = Number(el.dataset.try || "0");
            const next = candidates[i] || FALLBACK;

            if (el.src.endsWith(next) || i >= candidates.length - 1) {
              el.onerror = null;
              console.warn("[Card] fallback final ->", FALLBACK, "desc:", description);
              el.src = FALLBACK;
              return;
            }

            console.warn("[Card] load error, probando ->", next, "desc:", description);
            el.dataset.try = String(i + 1);
            el.src = next;
          }}
          className="
            w-full h-[340px] object-cover
            transition-transform duration-300
            group-hover:scale-[1.04]
            bg-black/30
          "
        />
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
