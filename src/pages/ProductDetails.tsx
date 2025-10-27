// src/pages/ProductDetails.tsx
import React, { useMemo, useState, useEffect, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { motion } from "framer-motion";
import { useCart } from "../context/CartContext";
import { useMedia } from "../services/media";

// Placeholder inline para evitar 404/ORB en dev
const fallbackUrl =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='800'>
      <rect width='100%' height='100%' fill='#11191a'/>
      <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle'
            font-family='system-ui,Segoe UI,Roboto' font-size='28' fill='#9fb3b8'>
        imagen no disponible
      </text>
    </svg>`
  );

/* ------------ Helpers de título ------------ */
const capitalizeWords = (s: string) => s.replace(/\b\p{L}/gu, (m) => m.toUpperCase());
const humanize = (s: string) =>
  (capitalizeWords((s || "").replace(/^\s*\d+\s*[-_]?/, "").replace(/[-_]+/g, " ").trim()) ||
    "Sin título");

/* ------------ Helpers de imágenes ------------ */
type ImgAny = string | { url: string; description?: string | null };
const GCS_BUCKET = "ivoiviart-bucket";
const FB_BUCKET  = "ivoiviart-420a2.appspot.com";
const FILE_LOCAL_DIRS = ["/img", "/img/products", "/images"] as const;

const getUrl = (img: ImgAny): string => (typeof img === "string" ? img : img?.url || "");

const inferLabelFromFilename = (url: string): string => {
  try {
    const raw = decodeURIComponent((url.split("/").pop() || "").split("?")[0]);
    const noExt = raw.replace(/\.(jpe?g|png|webp|gif|avif)$/i, "");
    let base = noExt
      .replace(/^\d+\s*[-_]?/, "")
      .replace(/[-_](\d{1,3})$/, "")
      .replace(/[-_]+/g, " ")
      .trim();
    if (!base) base = "Sin descripción";
    return base.toLowerCase();
  } catch {
    return "sin descripción";
  }
};

const normalizeImg = (img: ImgAny): { url: string; label: string } => {
  const url = getUrl(img);
  const label =
    typeof img === "string"
      ? inferLabelFromFilename(url)
      : img.description?.trim().toLowerCase() || inferLabelFromFilename(url);
  return { url, label };
};

function groupByLabel(imgs: ImgAny[]): Array<{ label: string; urls: string[] }> {
  const order: string[] = [];
  const map: Record<string, string[]> = {};
  for (const img of imgs) {
    const n = normalizeImg(img);
    if (!map[n.label]) order.push(n.label);
    (map[n.label] ||= []).push(n.url);
  }
  return order.map((lbl) => ({ label: lbl, urls: map[lbl] }));
}

const fileLeaf = (u: string) => {
  try { return decodeURIComponent((u.split("/").pop() || "").split("?")[0]); }
  catch { return (u.split("/").pop() || "").split("?")[0]; }
};

function normalizeRemote(u: string): string {
  try {
    const url = new URL(u);
    const noQS = `${url.origin}${url.pathname}`;
    if (url.hostname.includes("firebasestorage.googleapis.com") && url.pathname.includes("/o/")) {
      return `${noQS}?alt=media`; // sirve binario directo si es público
    }
    if (url.hostname.includes("storage.googleapis.com")) {
      return noQS; // sin query firmada
    }
  } catch {}
  return u;
}

function buildCandidates(orig: string): string[] {
  const base = (orig || "").split("?")[0];
  const normalized = normalizeRemote(base);
  const leaf = fileLeaf(normalized);

  const remoteExtras = leaf
    ? [
        `https://firebasestorage.googleapis.com/v0/b/${FB_BUCKET}/o/img%2F${encodeURIComponent(leaf)}?alt=media`,
        `https://storage.googleapis.com/${GCS_BUCKET}/img/${leaf}`,
      ]
    : [];

  const locals = leaf ? FILE_LOCAL_DIRS.map((d) => `${d}/${leaf}`) : [];
  const set = new Set<string>([normalized, ...remoteExtras, ...locals].filter(Boolean));
  return Array.from(set);
}

// Carga una imagen y resuelve true/false
function checkSrc(src: string, timeoutMs = 4000): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    let done = false;
    const close = (ok: boolean) => { if (!done) { done = true; resolve(ok); } };
    const t = setTimeout(() => close(false), timeoutMs);
    img.onload = () => { clearTimeout(t); close(true); };
    img.onerror = () => { clearTimeout(t); close(false); };
    // evita “cache pegajosa” sin romper URLs firmadas
    img.referrerPolicy = "no-referrer";
    img.src = src;
  });
}

// Devuelve el primer candidato que realmente carga
async function firstWorking(candidates: string[]): Promise<string | null> {
  for (const c of candidates) {
    if (await checkSrc(c)) return c;
  }
  return null;
}

/* ---------------------- Componente ---------------------- */
const ProductDetails: React.FC = () => {
  const { id: routeId } = useParams<{ id: string }>();
  const { media, loading, error } = useMedia();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  // Resolver producto por id o por code numérico
  const product = useMemo(() => {
    if (!media || !routeId) return undefined;
    const exact = media.find((p: any) => String(p.id) === routeId);
    if (exact) return exact;
    const n = Number(routeId);
    if (Number.isFinite(n)) return media.find((p: any) => Number(p.code) === n);
    return undefined;
  }, [media, routeId]);

  // Imágenes crudas
  const rawImages: ImgAny[] = useMemo(() => {
    const imgs = product?.images && Array.isArray(product.images) ? (product.images as ImgAny[]) : [];
    return imgs;
  }, [product?.images]);

  // Agrupación por label (sirve para Medallón)
  const groups = useMemo(() => groupByLabel(rawImages), [rawImages]);

  // Estado UI
  const [activeLabel, setActiveLabel] = useState<string>(groups[0]?.label || "");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  // Lista final de imágenes válidas para el grupo activo
  const [resolvedSrcs, setResolvedSrcs] = useState<string[] | null>(null);

  // Recalcular lista válida cuando cambia grupo
  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      const group =
        groups.find((g) => g.label === activeLabel) || groups[0] || { urls: [] as string[] };
      const valid: string[] = [];
      for (const orig of group.urls) {
        const cand = buildCandidates(orig);
        const ok = await firstWorking(cand);
        if (ok) valid.push(ok);
      }
      if (!cancelled) {
        setResolvedSrcs(valid);
        setCurrentIndex(0);
        setIsZoomed(false);
      }
    };
    setResolvedSrcs(null); // loading
    run();
    return () => { cancelled = true; };
  }, [groups, activeLabel]);

  // Si no quedó ninguna imagen válida, volvemos a la galería
  useEffect(() => {
    if (resolvedSrcs && resolvedSrcs.length === 0) {
      navigate("/", { replace: true });
    }
  }, [resolvedSrcs, navigate]);

  // Precio
  const priceNum = (product as any)?.price ?? null;
  const hasPrice = priceNum !== null && Number.isFinite(priceNum as number);

  // Añadir al carrito con la imagen actualmente ampliada al frente
  const handleAddToCart = () => {
    if (!product || !resolvedSrcs || resolvedSrcs.length === 0) return;
    const numericId = Number((product as any).code) || 0;
    const selected = resolvedSrcs[currentIndex]!;
    const rest = resolvedSrcs.filter((_, i) => i !== currentIndex);
    addToCart({
      id: numericId,
      price: hasPrice ? (priceNum as number) : 0,
      images: [selected, ...rest],
      description: (product as any).description ?? "",
    });
  };

  // Navegación
  const next = useCallback(() => {
    if (!resolvedSrcs?.length) return;
    setCurrentIndex((i) => (i + 1) % resolvedSrcs.length);
  }, [resolvedSrcs?.length]);

  const prev = useCallback(() => {
    if (!resolvedSrcs?.length) return;
    setCurrentIndex((i) => (i - 1 + resolvedSrcs.length) % resolvedSrcs.length);
  }, [resolvedSrcs?.length]);

  const switchGroup = useCallback((label: string) => {
    setActiveLabel(label);
  }, []);

  // Atajos
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
  if (error)   return <div className="p-8 text-red-300">Error: {String(error)}</div>;
  if (!product) return <div className="p-8 text-[#f0eceb]">Producto no encontrado</div>;

  const pageTitle = humanize((product as any).description || "");
  const uiActiveLabel = humanize(activeLabel);

  // Mientras se valida si hay fotos útiles para el grupo
  if (resolvedSrcs === null) {
    return (
      <div className="bg-[#0a0f10] min-h-screen flex flex-col items-center justify-center pt-[78px] sm:pt-[90px] pb-20 px-3">
        <p className="text-[#eae8e6]">verificando imágenes…</p>
      </div>
    );
  }

  // Si no hay ninguna válida, (useEffect ya redirige) mostramos un fallback por si tarda
  if (resolvedSrcs.length === 0) {
    return (
      <div className="bg-[#0a0f10] min-h-screen flex flex-col items-center justify-center pt-[78px] sm:pt-[90px] pb-20 px-3">
        <p className="text-[#eae8e6] mb-4">Este producto no tiene imágenes disponibles.</p>
        <Link to="/" className="text-[#eae8e6] underline">Volver a la galería</Link>
      </div>
    );
  }

  const imageSrc = resolvedSrcs[currentIndex]!;

  return (
    <div className="bg-[#0a0f10] min-h-screen flex flex-col items-center justify-start pt-[78px] sm:pt-[90px] pb-20 px-3">
      <div className="w-full max-w-5xl">
        <Link to="/" className="text-[#eae8e6] hover:underline text-sm sm:text-lg font-semibold">
          ← Volver a la Galería
        </Link>
      </div>

      <div className="w-full max-w-5xl mt-4 sm:mt-8">
        <div className="bg-[rgba(0,94,99,0.6)] rounded-xl shadow-xl p-3 sm:p-6 md:p-8 flex flex-col items-center overflow-hidden relative">

          {/* Tabs de grupos (sin contador) */}
          {groups.length > 1 && (
            <div className="w-full flex gap-2 justify-start sm:justify-center mb-3 overflow-x-auto flex-nowrap sm:flex-wrap px-1 sm:px-0">
              {groups.map((g) => (
                <button
                  key={g.label}
                  onClick={() => switchGroup(g.label)}
                  className={`px-3 py-1 rounded-full border text-xs sm:text-sm transition-colors duration-150 shrink-0 ${
                    activeLabel === g.label
                      ? "bg-black text-white border-black"
                      : "bg-white/80 text-black border-black/20 hover:bg-white"
                  }`}
                  aria-pressed={activeLabel === g.label}
                >
                  {humanize(g.label)}
                </button>
              ))}
            </div>
          )}

          {/* Imagen grande */}
          <div className="relative w-full flex justify-center items-center select-none">
            <motion.div
              className="relative"
              initial={{ scale: 0.98 }}
              animate={{ scale: isZoomed ? 1.08 : 1 }}
              transition={{ duration: 0.2 }}
            >
              <LazyLoadImage
                key={`${activeLabel}-${currentIndex}-${imageSrc}`}
                visibleByDefault
                src={imageSrc}
                alt={`${pageTitle} — ${uiActiveLabel}`}
                effect="blur"
                className="max-w-[900px] w-full max-h-[68vh] sm:max-h-[70vh] object-contain rounded-lg shadow-lg cursor-zoom-in"
                onClick={() => setIsZoomed((z) => !z)}
              />
            </motion.div>

            {resolvedSrcs.length > 1 && (
              <>
                <button
                  onClick={prev}
                  className="flex absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white w-8 h-8 sm:w-10 sm:h-10 rounded-full items-center justify-center"
                  aria-label="Anterior"
                >
                  ‹
                </button>
                <button
                  onClick={next}
                  className="flex absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white w-8 h-8 sm:w-10 sm:h-10 rounded-full items-center justify-center"
                  aria-label="Siguiente"
                >
                  ›
                </button>
              </>
            )}
          </div>

          {/* Miniaturas */}
          <div className="flex gap-2 mt-3 sm:mt-4 justify-start sm:justify-center overflow-x-auto flex-nowrap sm:flex-wrap px-1 sm:px-0">
            {resolvedSrcs.map((thumb, index) => (
              <button
                key={`${(product as any).id}-${activeLabel}-${index}`}
                className={`w-14 h-14 sm:w-16 sm:h-16 rounded-md overflow-hidden border-2 shrink-0 ${
                  currentIndex === index ? "border-white" : "border-transparent"
                }`}
                onClick={() => setCurrentIndex(index)}
                aria-label={`Miniatura ${index + 1} — ${uiActiveLabel}`}
              >
                <img
                  src={thumb}
                  alt={`Miniatura ${index + 1}`}
                  className="object-cover w-full h-full"
                  loading="lazy"
                />
              </button>
            ))}
          </div>

          {/* Título + precio */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl text-[#f5f3f1] mt-5 sm:mt-6 text-center">
            {pageTitle}
          </h1>
          <p className="sr-only">{uiActiveLabel}</p>

          {hasPrice ? (
            <p
              className="text-2xl sm:text-3xl md:text-4xl font-extrabold mt-3 tracking-wide bg-gradient-to-r from-[#d7b876] via-[#e7d9a8] to-[#d7b876] bg-clip-text text-transparent drop-shadow-xl"
              style={{ WebkitTextStroke: "0.5px rgba(0,0,0,0.25)" }}
            >
              ${Number(priceNum).toLocaleString("es-AR")}
            </p>
          ) : (
            <p className="mt-3 text-[#f0eceb] text-lg sm:text-xl">Precio: consultar</p>
          )}

          {/* Acciones */}
          <div className="flex flex-col sm:flex-row gap-3 mt-8 sm:mt-10 justify-center w-full max-w-xl">
             <Link
              to="/"
              aria-label="Volver a la Galería"
              className="w-full text-center rounded-none py-4 bg-[#0b0b0b] text-[#eae8e6] font-semibold shadow-[0_12px_32px_rgba(0,0,0,.6)] active:scale-[.98] transition-transform duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
            >
              Volver a la Galería
            </Link>
            <button
              onClick={handleAddToCart}
              aria-label="Añadir al carrito"
              className="w-full rounded-none py-4 bg-[#2f777b] text-white font-semibold shadow-[0_10px_28px_rgba(0,0,0,.45)] active:scale-[.98] transition-transform duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
            >
              Añadir al carrito
            </button>

            <button
              onClick={() => navigate("/carrito")}
              aria-label="Ir al carrito"
              className="w-full rounded-none py-4 bg-[#043e41] text-white font-semibold shadow-[0_10px_28px_rgba(0,0,0,.45)] active:scale-[.98] transition-transform duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
            >
              🛒 Ir al carrito
            </button>

           
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
