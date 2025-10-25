import React, { useCallback, useMemo, useRef, useState, useLayoutEffect } from "react";
import { Link } from "react-router-dom";
import Card from "./Card";

type Item = { id: string; image: string; description: string };
type Props = { title: string; items: Item[] };

const GAP_PX = 16;            // espacio entre tarjetas
const EDGE_FADE = true;       // máscara en bordes para hint de scroll

const Carousel: React.FC<Props> = ({ title, items }) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [showArrows, setShowArrows] = useState(false);

  // recalcular si hay overflow para decidir flechas en desktop
  const recalc = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setShowArrows(el.scrollWidth > el.clientWidth + 8);
  }, []);

  useLayoutEffect(() => {
    recalc();
    const onResize = () => recalc();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [recalc]);

  const page = useCallback((dir: -1 | 1) => {
    const el = trackRef.current;
    if (!el) return;
    // página ≈ 90% del viewport del carrusel
    const delta = Math.floor(el.clientWidth * 0.9) * dir;
    el.scrollBy({ left: delta, behavior: "smooth" });
  }, []);

  const itemsMemo = useMemo(() => items ?? [], [items]);
  if (!itemsMemo.length) return null;

  return (
    <section className="relative my-8 sm:my-10 min-w-0">
      <h2 className="text-xl sm:text-2xl md:text-3xl text-white mb-3 sm:mb-4 px-1 sm:px-2">
        {title}
      </h2>

      <div className="relative min-w-0">
        {/* Flechas solo en ≥lg y si realmente hay overflow */}
        {showArrows && (
          <>
            <button
              onClick={() => page(-1)}
              aria-label="Anterior"
              className="hidden lg:flex items-center justify-center absolute left-1 top-1/2 -translate-y-1/2 h-10 w-10 bg-black/50 hover:bg-black/70 text-white rounded-md shadow transition z-10"
            >
              ‹
            </button>
            <button
              onClick={() => page(1)}
              aria-label="Siguiente"
              className="hidden lg:flex items-center justify-center absolute right-1 top-1/2 -translate-y-1/2 h-10 w-10 bg-black/50 hover:bg-black/70 text-white rounded-md shadow transition z-10"
            >
              ›
            </button>
          </>
        )}

        {/* máscara sutil en bordes en móvil para hint de scroll */}
        {EDGE_FADE && (
          <>
            <div className="pointer-events-none absolute inset-y-0 left-0 w-6 sm:w-8 bg-gradient-to-r from-black/40 to-transparent rounded-l-lg" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-6 sm:w-8 bg-gradient-to-l from-black/40 to-transparent rounded-r-lg" />
          </>
        )}

        <div
          ref={trackRef}
          className={[
            "flex gap-4 overflow-x-auto overflow-y-hidden scroll-smooth",
            "px-2 pe-6 sm:px-3 sm:pe-8", // espacio lateral para que no se corte
            "snap-x snap-mandatory",
            "scrollbar-hide",           // tailwind plugin opcional
            "min-w-0"
          ].join(" ")}
          style={{ scrollPadding: "0.5rem" }}
          onScroll={recalc}
        >
          {itemsMemo.map((it) => (
            <Link
              key={it.id}
              to={`/product/${it.id}`}
              className="snap-start shrink-0 block focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 rounded-xl"
              style={{
                // ancho fluido: 1.1 cards en móvil, 2–3 en tablet, 4–5 en desktop
                width: "clamp(200px, 70vw, 300px)",
                flex: "0 0 clamp(200px, 70vw, 300px)",
                marginRight: `${GAP_PX}px`,
              }}
              aria-label={it.description}
            >
              <Card image={it.image} description={it.description} />
            </Link>
          ))}

          {/* espaciador al final para que la última no quede cortada */}
          <div className="shrink-0" style={{ width: "8px" }} />
        </div>
      </div>
    </section>
  );
};

export default Carousel;
