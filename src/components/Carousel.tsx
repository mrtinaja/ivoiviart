/** @jsxImportSource preact */
import { FunctionalComponent } from "preact";
import { useRef, useCallback } from "preact/hooks";
import CarouselItem from "./CarouselItem";

type Item = { id: string; image: string; description: string };
type Props = { title: string; items: Item[] };

const ArrowButton: FunctionalComponent<{
  side: "left" | "right";
  onClick: () => void;
}> = ({ side, onClick }) => (
  <button
    onClick={onClick}
    aria-label={side === "left" ? "Anterior" : "Siguiente"}
    className={[
      "hidden lg:flex items-center justify-center",
      "absolute top-1/2 -translate-y-1/2",
      side === "left" ? "left-2" : "right-2",
      "h-10 w-10 bg-black/50 hover:bg-black/70 text-white",
      "shadow-md transition"
    ].join(" ")}
  >
    {side === "left" ? "‹" : "›"}
  </button>
);

const Carousel: FunctionalComponent<Props> = ({ title, items }) => {
  const trackRef = useRef<HTMLDivElement>(null);

  const page = useCallback((dir: -1 | 1) => {
    const el = trackRef.current;
    if (!el) return;
    const delta = Math.floor(el.clientWidth * 0.9) * dir; // ~una “página”
    el.scrollBy({ left: delta, behavior: "smooth" });
  }, []);

  if (!items?.length) return null;

  return (
    <section className="relative my-10 min-w-0">
      <h2 className="text-2xl md:text-3xl text-white mb-4 px-2">{title}</h2>

      <div className="relative min-w-0">
        <ArrowButton side="left" onClick={() => page(-1)} />
        <ArrowButton side="right" onClick={() => page(1)} />

        <div
          ref={trackRef}
          className={[
            "flex gap-4 overflow-x-auto overflow-y-hidden",
            "scroll-smooth px-2 pe-6",           // un poco de padding derecho
            "scrollbar-hide",                    // <- oculta barras
            "snap-x snap-mandatory",
            "min-w-0"
          ].join(" ")}
        >
          {items.map((it) => (
            <div
              key={it.id}
              className={[
                "snap-start shrink-0",
                "w-[240px] sm:w-[260px] md:w-[280px] lg:w-[300px]",
                "min-w-0"
              ].join(" ")}
            >
              <CarouselItem id={it.id} image={it.image} description={it.description} />
            </div>
          ))}

          {/* Espaciador para que el último entre completo */}
          <div className="shrink-0 w-4 sm:w-6 md:w-8 lg:w-10" />
        </div>
      </div>
    </section>
  );
};

export default Carousel;
