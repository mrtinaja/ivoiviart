import React, { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";

export type ImageItem = {
  price: any;
  key: string;      // code-variant
  code: string;     // "001"
  title: string;
  variant: number;  // 0 por defecto
  url: string;      // remota (downloadURL) por defecto
  local?: string;   // fallback /img/...
  origin: "images" | "local";
};

type Ctx = { items: ImageItem[]; loading: boolean; error: string | null };

const ImagesContext = createContext<Ctx | undefined>(undefined);
export const useImages = () => {
  const ctx = useContext(ImagesContext);
  if (!ctx) throw new Error("useImages debe usarse dentro de <ImagesProvider>");
  return ctx;
};

export const ImagesProvider: React.FC<{ children?: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        // 1) Firestore (solo 'images')
        const snap = await getDocs(collection(db, "images"));
        const remote = snap.docs.map(d => ({ id: d.id, ...d.data() } as any));

        // 2) Manifest local
        let manifest: Array<{ code: string; title: string; variant: number; url: string }> = [];
        try {
          const res = await fetch("/img/manifest.json", { cache: "no-store" });
          if (res.ok) manifest = await res.json();
        } catch {}

        const locals = new Map<string, string>(); // "001-0" -> /img/...
        for (const m of manifest) {
          const k = `${m.code}-${m.variant ?? 0}`;
          if (!locals.has(k)) locals.set(k, m.url);
        }

        const out: ImageItem[] = [];
        for (const r of remote) {
          const code = String(r.code ?? "").padStart(3, "0");
          if (!code) continue;
          const v = Number.isFinite(r.variant) ? Number(r.variant) : 0;
          const key = `${code}-${v}`;
          const title = r.title ?? "sin título";
          const remoteUrl: string | undefined = r.downloadURL || r.url;
          const localUrl = locals.get(key);

          if (remoteUrl) out.push({
            key, code, title, variant: v, url: remoteUrl, local: localUrl, origin: "images",
            price: undefined
          });
          else if (localUrl) out.push({
            key, code, title, variant: v, url: localUrl, origin: "local",
            price: undefined
          });
        }

        // agrega locales que no estén en remoto
        for (const [key, url] of locals) {
          if (!out.find(x => x.key === key)) {
            const [code, vStr] = key.split("-");
            const mm = manifest.find(m => `${m.code}-${m.variant ?? 0}` === key)!;
            out.push({
              key, code, title: mm.title ?? "sin título", variant: Number(vStr) || 0, url, origin: "local",
              price: undefined
            });
          }
        }

        out.sort((a,b) => (a.code === b.code ? a.variant - b.variant : a.code.localeCompare(b.code)));
        if (!alive) return;
        setItems(out); setErr(null);
      } catch (e:any) {
        if (!alive) return;
        setItems([]); setErr(e?.message || "Error leyendo 'images'");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  const value = useMemo<Ctx>(() => ({ items, loading, error: err }), [items, loading, err]);
  return <ImagesContext.Provider value={value}>{children}</ImagesContext.Provider>;
};

// helper opcional para <img onError>
export const onImgErrorToLocal = (local?: string) => (ev: React.SyntheticEvent<HTMLImageElement>) => {
  if (!local) return;
  const img = ev.currentTarget;
  if ((img as any).__fallbackDone) return;
  (img as any).__fallbackDone = true;
  img.src = local;
};
