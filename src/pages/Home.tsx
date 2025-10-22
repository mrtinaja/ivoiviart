import React, { useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { useMedia, type MediaItem } from "../services/media";
import Card from "../components/Card";

type CarouselRowProps = {
  title: string;
  items: MediaItem[];
};

const scrollAmount = 320; // ~ ancho card + gap

const CarouselRow: React.FC<CarouselRowProps> = ({ title, items }) => {
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  const onPrev = () => {
    scrollerRef.current?.scrollBy({ left: -scrollAmount, behavior: "smooth" });
  };
  const onNext = () => {
    scrollerRef.current?.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  if (!items.length) return null;

  return (
    <section className="relative w-full max-w-7xl mx-auto py-8">
      <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4 px-2">
        {title}
      </h2>

      {/* Botones (solo desktop) */}
      <button
        onClick={onPrev}
        className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 h-10 w-10 items-center justify-center bg-black/50 hover:bg-black/70 text-white transition"
        aria-label="Anterior"
      >
        ‹
      </button>
      <button
        onClick={onNext}
        className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 h-10 w-10 items-center justify-center bg-black/50 hover:bg-black/70 text-white transition"
        aria-label="Siguiente"
      >
        ›
      </button>

      {/* Carrusel */}
      <div
        ref={scrollerRef}
        className="flex gap-6 overflow-x-auto overflow-y-hidden snap-x snap-mandatory px-2 scroll-smooth scrollbar-hide"
      >
        {items.map((it, idx) => (
          <Link
            to={`/product/${it.id}`}
            key={`${it.id}-${idx}`}
            className="snap-start shrink-0"
            aria-label={it.description}
          >
            <Card
              image={it.images?.[0] ?? "/img/default.jpg"}
              description={it.description}
            />
          </Link>
        ))}
        {/* Espaciador para que el último entre completo */}
        <div className="shrink-0 w-4 md:w-8" />
      </div>
    </section>
  );
};

const Home: React.FC = () => {
  const { media, loading, error } = useMedia();

  const { novedades, recomendados, destacados } = useMemo(() => {
    const list = media ?? [];
    const novedades = list.slice(0, 8);
    const recomendados = list.filter((m) => m.price != null).slice(0, 8);
    const destacados = list.slice(8, 16);
    return { novedades, recomendados, destacados };
  }, [media]);

  if (loading) return <div className="p-8 text-[#f0eceb]">cargando…</div>;
  if (error) return <div className="p-8 text-red-300">Error cargando: {String(error)}</div>;

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#031a1a] to-black">
      {/* espacio para el header fijo */}
      <div className="h-[80px]" />

      <main className="w-full pb-12">
        <CarouselRow title="Novedades" items={novedades} />
        <CarouselRow title="Recomendados" items={recomendados} />
        <CarouselRow title="Destacados" items={destacados} />
      </main>
    </div>
  );
};

export default Home;
