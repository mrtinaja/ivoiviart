// src/pages/Home.tsx
import React, {
  useMemo,
  useRef,
  useLayoutEffect,
  useState,
  useEffect,
} from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import Card from "../components/Card";
import { useMedia } from "../services/media";

/* ================================
   Helpers
================================== */

const debug =
  typeof window !== "undefined" &&
  new URLSearchParams(window.location.search).has("debug");

const pickCover = (arr?: string[] | null): string => {
  if (!arr || !Array.isArray(arr) || arr.length === 0) return "/img/default.jpg";
  const url = arr.find(
    (u) =>
      typeof u === "string" &&
      u.trim().length > 0 &&
      !/^(null|undefined)$/i.test(u) &&
      (/^https?:\/\//i.test(u) || u.startsWith("/img/"))
  );
  return url ?? "/img/default.jpg";
};

const toTitle = (s?: string) =>
  (s ?? "")
    .replace(/^\s*\d+\s*[-_]?/, "")
    .replace(/\.(jpe?g|png|webp|gif)$/i, "")
    .replace(/[-_]+/g, " ")
    .trim();

type RawItem = {
  id: string;
  code?: string | number;
  description?: string;
  images?: string[];
  price?: number | null;
};

type Product = {
  id: string;
  code?: string | number;
  description: string;
  images: string[];
  price: number | null;
};

const groupByProduct = (list: RawItem[]): Product[] => {
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

const splitIntoThree = <T,>(arr: T[]) => {
  const a: T[] = [], b: T[] = [], c: T[] = [];
  arr.forEach((item, i) => {
    const m = i % 3;
    if (m === 0) a.push(item);
    else if (m === 1) b.push(item);
    else c.push(item);
  });
  return { a, b, c };
};

/* ================================
   Carrusel
================================== */

type CarouselRowProps = { title: string; items: Product[] };

// compact: un poco menos de gap/padding
const GAP_PX = 12;
const PAD_PX = 12;

// mostramos más “anchos” para que se vea más chico
const computeVisible = (w: number) => {
  if (w < 480) return 1.6;     // 1 grande + asomo generoso
  if (w < 768) return 2.6;     // mobile grande
  if (w < 1024) return 3.4;    // tablet
  return 5;                    // desktop
};

const CarouselRow: React.FC<CarouselRowProps> = ({ title, items }) => {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState<number>(
    typeof window !== "undefined" ? computeVisible(window.innerWidth) : 5
  );

  useLayoutEffect(() => {
    const onResize = () => setVisible(computeVisible(window.innerWidth));
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const itemW = `calc((100% - ${PAD_PX * 2}px - ${GAP_PX} * (${Math.ceil(
    visible
  ) - 1})) / ${visible})`;

  const page = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const first = el.querySelector<HTMLElement>("[data-card]");
    if (!first) return;
    const cardW = first.getBoundingClientRect().width;
    const step = Math.max(1, Math.floor(visible - 0.2));
    el.scrollBy({ left: (cardW + GAP_PX) * step * dir, behavior: "smooth" });
  };

  if (!items.length) return null;

  const showArrows = items.length > visible;

  return (
    <section className="relative w-full max-w-7xl mx-auto py-7">
      <h2 className="text-xl md:text-2xl font-semibold text-white mb-3 px-3">
        {title}
      </h2>

      {/* Flechas (solo md+) */}
      <button
        onClick={() => page(-1)}
        className={`${showArrows ? "hidden md:flex" : "hidden"} absolute left-1 top-1/2 -translate-y-1/2 z-10 h-8 w-8 items-center justify-center bg-black/50 hover:bg-black/70 text-white rounded-full`}
        aria-label="Anterior"
      >
        ‹
      </button>
      <button
        onClick={() => page(1)}
        className={`${showArrows ? "hidden md:flex" : "hidden"} absolute right-1 top-1/2 -translate-y-1/2 z-10 h-8 w-8 items-center justify-center bg-black/50 hover:bg-black/70 text-white rounded-full`}
        aria-label="Siguiente"
      >
        ›
      </button>

      {/* Track */}
      <div
        ref={scrollerRef}
        className="flex overflow-x-auto overflow-y-hidden snap-x snap-mandatory scroll-smooth scrollbar-hide min-w-0"
        style={{ gap: `${GAP_PX}px`, paddingInline: `${PAD_PX}px` }}
      >
        {items.map((p) => {
          const cover = pickCover(p.images);
          return (
            <Link
              to={`/product/${p.id}`}
              key={p.id}
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
    console.log("con cover default:", conDefault.length, conDefault.map((p) => p.id));
    console.groupEnd();
  }, [debug, loading, media, products]);

  if (loading) return <div className="p-8 text-[#f0eceb]">cargando…</div>;
  if (error)
    return <div className="p-8 text-red-300">Error cargando: {String(error)}</div>;

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
