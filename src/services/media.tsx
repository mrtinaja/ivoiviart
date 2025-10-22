/** @jsxImportSource preact */
import { createContext } from "preact";
import { useContext, useEffect, useMemo, useState } from "preact/hooks";
import type { FunctionalComponent, ComponentChildren } from "preact";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";

/* ---------------- helpers ---------------- */

// Capitaliza “tipo título” sin romper acentos
const titleCase = (s: string) =>
  s.replace(/\S+/g, (w) => w.charAt(0).toLocaleUpperCase() + w.slice(1));

// Limpia guiones / números iniciales del filename o texto crudo
const humanize = (s: string) =>
  titleCase(
    (s || "")
      .replace(/^\s*\d+\s*[-_]?/, "") // quita prefijo numérico + guión
      .replace(/[-_]+/g, " ")         // guiones -> espacios
      .trim()
  ) || "Sin Título";

function normalizePrice(raw: unknown): number | null {
  if (typeof raw === "number" && Number.isFinite(raw)) return raw;
  if (typeof raw === "string") {
    // Acepta "25.000", "25,000.00", "$ 25000", etc.
    const cleaned = raw.replace(/[^\d,.-]/g, "").replace(/\./g, "").replace(",", ".");
    const n = Number(cleaned);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

/* ---------------- tipos públicos ---------------- */

export type MediaItem = {
  id: string;           // usamos code como id de ruta (e.g. "001")
  code: string;         // "001"
  description: string;  // ya limpio y capitalizado
  images: string[];     // urls (index 0 = principal)
  price: number | null; // null si no hay precio
};

type Ctx = {
  media: MediaItem[];
  loading: boolean;
  error: string | null;
};

/* ---------------- contexto + hook ---------------- */

const MediaContext = createContext<Ctx | undefined>(undefined);

export const useMedia = () => {
  const ctx = useContext(MediaContext);
  if (!ctx) throw new Error("useMedia debe usarse dentro de <MediaProvider>");
  return ctx;
};

/* ---------------- raw doc ---------------- */

type RawImageDoc = {
  code?: string;
  title?: string;
  description?: string;
  variant?: number;
  downloadURL?: string;
  url?: string;
  price?: unknown;
};

/* ---------------- provider ---------------- */

export const MediaProvider: FunctionalComponent<{ children?: ComponentChildren }> = ({ children }) => {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);

        // 1) leer docs
        const snap = await getDocs(collection(db, "images"));
        const raws = snap.docs.map((d) => d.data() as RawImageDoc);

        // 2) agrupar por code
        const byCode = new Map<
          string,
          {
            code: string;
            description: string;
            price: number | null;
            variants: Array<{ v: number; url: string }>;
          }
        >();

        for (const r of raws) {
          const code = String(r.code ?? "").padStart(3, "0");
          if (!code || code === "000") continue;

          const url = r.downloadURL || r.url;
          if (!url) continue;

          const variant = Number.isFinite(r.variant) ? Number(r.variant) : 0;

          const rawDesc = (r.description && String(r.description)) || (r.title && String(r.title)) || "";
          const cleanedDescription = humanize(rawDesc);

          const price = normalizePrice(r.price);

          const bucket =
            byCode.get(code) ??
            {
              code,
              description: cleanedDescription,
              price: price ?? null,
              variants: [],
            };

          // priorizar el primer precio definido
          if (bucket.price == null && price != null) bucket.price = price;

          // si la descripción actual es vacía/"Sin Título" y la nueva tiene contenido, reemplazar
          if (
            (!bucket.description || bucket.description.toLowerCase() === "sin título" || bucket.description.toLowerCase() === "sin titulo") &&
            cleanedDescription &&
            cleanedDescription.toLowerCase() !== "sin título" &&
            cleanedDescription.toLowerCase() !== "sin titulo"
          ) {
            bucket.description = cleanedDescription;
          }

          bucket.variants.push({ v: variant, url });
          byCode.set(code, bucket);
        }

        // 3) construir salida
        const out: MediaItem[] = [];
        for (const [code, { description, price, variants }] of byCode) {
          variants.sort((a, b) => a.v - b.v);
          out.push({
            id: code,
            code,
            description,
            images: variants.map((x) => x.url),
            price: price ?? null,
          });
        }

        // 4) ordenar por code asc
        out.sort((a, b) => Number(a.code) - Number(b.code));

        if (!alive) return;
        setMedia(out);
        setErr(null);
      } catch (e: any) {
        if (!alive) return;
        setMedia([]);
        setErr(e?.message || "Error leyendo imágenes");
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  const value = useMemo<Ctx>(() => ({ media, loading, error: err }), [media, loading, err]);

  return <MediaContext.Provider value={value}>{children}</MediaContext.Provider>;
};
