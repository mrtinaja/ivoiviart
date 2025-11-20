// src/pages/Home.tsx
import React, {
  useMemo,
  useRef,
  useEffect,
  useState,
} from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import Card from "../components/Card";
import { useMedia } from "../services/media";

/* ================================
   Helpers
================================== */

const debug =
  typeof window !== "undefined"
    ? new URLSearchParams(window.location.search).has("debug")
    : false;

const pickCover = (arr?: string[] | null): string => {
  if (!arr?.length) return "/img/default.jpg";

  const url = arr.find((u) => {
    if (typeof u !== "string" || !u.trim()) return false;
    if (/^(null|undefined)$/i.test(u)) return false;
    try {
      return /^https?:\/\//i.test(u) || u.startsWith("/img/");
    } catch {
      return false;
    }
  });

  return url ?? "/img/default.jpg";
};

const toTitle = (s?: string) =>
  (s ?? "")
    .replace(/^\s*\d+\s*[-_]?/, "")
    .replace(/\.(jpe?g|png|webp|gif)$/i, "")
    .replace(/[-_]+/g, " ")
    .trim();

type Product = {
  id: string;
  code?: string | number;
  description: string;
  images: string[];
  price: number | null;
};

const groupByProduct = (list: Product[]): Product[] => {
  const map = new Map<string, Product>();

  for (const it of list) {
    const key = String(it.code ?? it.id);
    const prev = map.get(key);

    const mergedImages = [
      ...(prev?.images ?? []),
      ...((it.images ?? []).filter(Boolean) as string[]),
    ];

    const images = Array.from(new Set(mergedImages));
    const description = toTitle(it.description) || prev?.description || "Sin título";
    const price = it.price ?? prev?.price ?? null;

    map.set(key, { id: key, code: it.code, description, images, price });
  }

  return Array.from(map.values());
};

const splitIntoThree = <T,>(arr: T[]) =>
  arr.reduce<{ a: T[]; b: T[]; c: T[] }>(
    (acc, item, i) => {
      const key = ["a", "b", "c"][i % 3] as "a" | "b" | "c";
      acc[key].push(item);
      return acc;
    },
    { a: [], b: [], c: [] }
  );

/* ================================
   Carrusel
================================== */

type CarouselRowProps = { title: string; items: Product[] };

const GAP_PX = 12;
const PAD_PX = 12;

const computeVisible = (w: number) => {
  if (w < 480) return 1.6;
  if (w < 768) return 2.6;
  if (w < 1024) return 3.4;
  return 5;
};

const CarouselRow: React.FC<CarouselRowProps> = ({ title, items }) => {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState<number>(
    typeof window !== "undefined" ? computeVisible(window.innerWidth) : 5
  );

  useEffect(() => {
    const onResize = () => setVisible(computeVisible(window.innerWidth));
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const itemW = `calc((100% - ${PAD_PX * 2}px - ${GAP_PX} * (${Math.ceil(
    visible
  )} - 1)) / ${visible})`;

  const page = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const first = el.querySelector<HTMLElement>("[data-card]");
    if (!first) return;
    const cardW = first.getBoundingClientRect().width;
    const step = Math.max(1, Math.floor(visible - 0.2));
    el.scrollBy({ left: (cardW + GAP_PX) * step * dir, behavior: "smooth" });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft") page(-1);
    if (e.key === "ArrowRight") page(1);
  };

  if (!items.length) return null;

  const showArrows = items.length > visible;

  return (
    <section className="relative w-full max-w-7xl mx-auto py-7">
      <h2 className="text-xl md:text-2xl font-semibold text-white mb-3 px-3">
        {title}
      </h2>

      {/* Flechas */}
      <button
        onClick={() => page(-1)}
        className={`${
          showArrows ? "hidden md:flex" : "hidden"
        } absolute left-1 top-1/2 -translate-y-1/2 z-10 h-8 w-8 items-center justify-center bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors`}
        aria-label="Anterior"
      >
        ‹
      </button>
      <button
        onClick={() => page(1)}
        className={`${
          showArrows ? "hidden md:flex" : "hidden"
        } absolute right-1 top-1/2 -translate-y-1/2 z-10 h-8 w-8 items-center justify-center bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors`}
        aria-label="Siguiente"
      >
        ›
      </button>

      {/* Track */}
      <div
        ref={scrollerRef}
        role="region"
        aria-label={`Carrusel de ${title}`}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className="flex overflow-x-auto overflow-y-hidden snap-x snap-mandatory scroll-smooth scrollbar-hide min-w-0 focus:outline-none focus:ring-2 focus:ring-blue-500/50 rounded"
        style={{ gap: `${GAP_PX}px`, paddingInline: `${PAD_PX}px` }}
      >
        {items.map((p) => {
          const cover = pickCover(p.images);
          return (
            <Link
              to={`/product/${p.id}`}
              key={p.id}
              data-card
              className="snap-start shrink-0 min-w-0 block"
              aria-label={p.description}
              style={{ width: itemW, flex: `0 0 ${itemW}`, maxWidth: itemW }}
            >
              <Card image={cover} description={p.description} size="compact" />
            </Link>
          );
        })}

        <div className="shrink-0" style={{ width: `${PAD_PX}px` }} />
      </div>
    </section>
  );
};

/* ================================
   Loading Skeleton
================================== */

const LoadingSkeleton: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-b from-[#031a1a] to-black">
    <div className="h-[80px]" />
    <div className="space-y-8 p-8 max-w-7xl mx-auto">
      {[1, 2, 3].map((i) => (
        <div key={i} className="animate-pulse">
          <div className="h-6 bg-gray-700 rounded w-48 mb-4" />
          <div className="flex gap-4 overflow-hidden">
            {[1, 2, 3, 4, 5].map((j) => (
              <div
                key={j}
                className="h-64 bg-gray-700 rounded-lg flex-1 min-w-[200px]"
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

/* ================================
   Error State
================================== */

const ErrorState: React.FC<{ error: unknown }> = ({ error }) => (
  <div className="min-h-screen bg-gradient-to-b from-[#031a1a] to-black flex items-center justify-center p-4">
    <div className="text-center max-w-md">
      <div className="text-6xl mb-4">😕</div>
      <h2 className="text-2xl text-red-300 mb-4 font-semibold">
        Oops, algo salió mal
      </h2>
      <p className="text-gray-400 mb-6 text-sm">
        {error instanceof Error ? error.message : String(error)}
      </p>
      <button
        onClick={() => window.location.reload()}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
      >
        Reintentar
      </button>
    </div>
  </div>
);

/* ================================
   Home
================================== */

const Home: React.FC = () => {
  const { media, loading, error } = useMedia();

  const products = useMemo(() => groupByProduct(media ?? []), [media]);

  const { fila1, fila2, fila3 } = useMemo(() => {
    const sorted = [...products].sort((a, b) => {
      const na = parseInt(String(a.id).replace(/\D/g, "") || "0", 10);
      const nb = parseInt(String(b.id).replace(/\D/g, "") || "0", 10);
      return nb - na;
    });
    const { a, b, c } = splitIntoThree(sorted);
    return { fila1: a, fila2: b, fila3: c };
  }, [products]);

  useEffect(() => {
    if (!debug || loading) return;
    const setIds = new Set(products.map((p) => p.id));
    const sinImgs = products.filter((p) => !p.images || p.images.length === 0);
    const conDefault = products.filter(
      (p) => pickCover(p.images) === "/img/default.jpg"
    );
    console.groupCollapsed("[Home debug]");
    console.log("media docs:", media?.length ?? 0);
    console.log("productos agrupados:", products.length);
    console.log("únicos (ids):", setIds.size);
    console.log("sin imágenes:", sinImgs.length, sinImgs.map((p) => p.id));
    console.log(
      "con cover default:",
      conDefault.length,
      conDefault.map((p) => p.id)
    );
    console.groupEnd();
  }, [debug, loading, media, products]);

  if (loading) return <LoadingSkeleton />;
  if (error) return <ErrorState error={error} />;

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#031a1a] to-black">
      <div className="h-[80px]" />
      <main className="w-full pb-12">
        <CarouselRow title="Novedades" items={fila1} />
        <CarouselRow title="Recomendados" items={fila2} />
        <CarouselRow title="Destacados" items={fila3} />
      </main>
    </div>
  );
};

export default Home;