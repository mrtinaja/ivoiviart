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

// habilita debug con ?debug=1
const debug =
  typeof window !== "undefined" &&
  new URLSearchParams(window.location.search).has("debug");

// 1) Elige la primera URL “usable”. Si no hay, usa /img/default.jpg
const pickCover = (arr?: string[] | null): string => {
  if (!arr || !Array.isArray(arr) || arr.length === 0) return "/img/default.jpg";
  const url = arr.find(
    (u) =>
      typeof u === "string" &&
      u.trim().length > 0 &&
      !/^(null|undefined)$/i.test(u) &&
      // si trae http(s) o es ruta pública ya sirve
      (/^https?:\/\//i.test(u) || u.startsWith("/img/"))
  );
  return url ?? "/img/default.jpg";
};

// 2) Normaliza títulos para las cards
const toTitle = (s?: string) =>
  (s ?? "")
    .replace(/^\s*\d+\s*[-_]?/, "")
    .replace(/\.(jpe?g|png|webp|gif)$/i, "")
    .replace(/[-_]+/g, " ")
    .trim();

// 3) Tipos y “agrupar por producto”
type RawItem = {
  id: string;
  code?: string | number;
  description?: string;
  images?: string[];
  price?: number | null;
};

type Product = {
  id: string; // usamos code como id “humano”
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

    map.set(key, {
      id: key,
      code: it.code,
      description,
      images,
      price,
    });
  }

  return Array.from(map.values());
};

// 4) Reparto en 3 filas (round-robin) para usar **todos** sin repetir
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

// paddings y gap
const GAP_PX = 16;
const PAD_PX = 16;

// breakpoints -> cuántas cards completas entran
const computeVisible = (w: number) => {
  if (w < 480) return 1.2; // mobile chico: 1 + “asomo”
  if (w < 768) return 2; // mobile grande / tablet chica
  if (w < 1024) return 3; // tablet
  return 4; // desktop
};

const CarouselRow: React.FC<CarouselRowProps> = ({ title, items }) => {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState<number>(
    typeof window !== "undefined" ? computeVisible(window.innerWidth) : 4
  );

  useLayoutEffect(() => {
    const onResize = () => setVisible(computeVisible(window.innerWidth));
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // ancho de item dinámico según cantidad visible
  const itemW = `calc((100% - ${PAD_PX * 2}px - ${GAP_PX} * (${Math.ceil(
    visible
  ) - 1})) / ${visible})`;

  const page = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const first = el.querySelector<HTMLElement>("[data-card]");
    if (!first) return;
    const cardW = first.getBoundingClientRect().width;
    const step = Math.max(1, Math.floor(visible - 0.2)); // cuánto avanzar
    el.scrollBy({ left: (cardW + GAP_PX) * step * dir, behavior: "smooth" });
  };

  if (!items.length) return null;

  const showArrows = items.length > visible;

  return (
    <section className="relative w-full max-w-7xl mx-auto py-8">
      <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4 px-3">
        {title}
      </h2>

      {/* Flechas (solo md+) */}
      <button
        onClick={() => page(-1)}
        className={`${showArrows ? "hidden md:flex" : "hidden"} absolute left-1 top-1/2 -translate-y-1/2 z-10 h-9 w-9 items-center justify-center bg-black/50 hover:bg-black/70 text-white rounded-full`}
        aria-label="Anterior"
      >
        ‹
      </button>
      <button
        onClick={() => page(1)}
        className={`${showArrows ? "hidden md:flex" : "hidden"} absolute right-1 top-1/2 -translate-y-1/2 z-10 h-9 w-9 items-center justify-center bg-black/50 hover:bg-black/70 text-white rounded-full`}
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
              data-card
              style={{ width: itemW, flex: `0 0 ${itemW}`, maxWidth: itemW }}
            >
              <Card image={cover} description={p.description} />
            </Link>
          );
        })}

        {/* Espaciador para que el último no quede cortado */}
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

  // 1) agrupar por producto (dedupe por code/id, merge imágenes)
  const products = useMemo(() => groupByProduct(media ?? []), [media]);

  // 2) ordenar “nuevos primero” si hay números en id, y repartir en 3 filas
  const { fila1, fila2, fila3 } = useMemo(() => {
    const sorted = [...products].sort((a, b) => {
      const na = parseInt(String(a.id).replace(/\D/g, "") || "0", 10);
      const nb = parseInt(String(b.id).replace(/\D/g, "") || "0", 10);
      return nb - na; // desc
    });
    const { a, b, c } = splitIntoThree(sorted);
    return { fila1: a, fila2: b, fila3: c };
  }, [products]);

  // DEBUG (solo cuando terminó de cargar)
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
    console.log("fila1:", fila1.length, "fila2:", fila2.length, "fila3:", fila3.length);
    console.log("TOTAL carruseles:", fila1.length + fila2.length + fila3.length);
    console.groupEnd();
  }, [debug, loading, media, products, fila1, fila2, fila3]);

  if (loading) return <div className="p-8 text-[#f0eceb]">cargando…</div>;
  if (error)
    return <div className="p-8 text-red-300">Error cargando: {String(error)}</div>;

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#031a1a] to-black">
      {/* espacio para el header fijo */}
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
