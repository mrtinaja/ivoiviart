import { jsx as _jsx } from "preact/jsx-runtime";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";
const ImagesContext = createContext(undefined);
export const useImages = () => {
    const ctx = useContext(ImagesContext);
    if (!ctx)
        throw new Error("useImages debe usarse dentro de <ImagesProvider>");
    return ctx;
};
export const ImagesProvider = ({ children }) => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState(null);
    useEffect(() => {
        let alive = true;
        (async () => {
            try {
                // 1) Firestore (solo 'images')
                const snap = await getDocs(collection(db, "images"));
                const remote = snap.docs.map(d => ({ id: d.id, ...d.data() }));
                // 2) Manifest local
                let manifest = [];
                try {
                    const res = await fetch("/img/manifest.json", { cache: "no-store" });
                    if (res.ok)
                        manifest = await res.json();
                }
                catch { }
                const locals = new Map(); // "001-0" -> /img/...
                for (const m of manifest) {
                    const k = `${m.code}-${m.variant ?? 0}`;
                    if (!locals.has(k))
                        locals.set(k, m.url);
                }
                const out = [];
                for (const r of remote) {
                    const code = String(r.code ?? "").padStart(3, "0");
                    if (!code)
                        continue;
                    const v = Number.isFinite(r.variant) ? Number(r.variant) : 0;
                    const key = `${code}-${v}`;
                    const title = r.title ?? "sin título";
                    const remoteUrl = r.downloadURL || r.url;
                    const localUrl = locals.get(key);
                    if (remoteUrl)
                        out.push({
                            key, code, title, variant: v, url: remoteUrl, local: localUrl, origin: "images",
                            price: undefined
                        });
                    else if (localUrl)
                        out.push({
                            key, code, title, variant: v, url: localUrl, origin: "local",
                            price: undefined
                        });
                }
                // agrega locales que no estén en remoto
                for (const [key, url] of locals) {
                    if (!out.find(x => x.key === key)) {
                        const [code, vStr] = key.split("-");
                        const mm = manifest.find(m => `${m.code}-${m.variant ?? 0}` === key);
                        out.push({
                            key, code, title: mm.title ?? "sin título", variant: Number(vStr) || 0, url, origin: "local",
                            price: undefined
                        });
                    }
                }
                out.sort((a, b) => (a.code === b.code ? a.variant - b.variant : a.code.localeCompare(b.code)));
                if (!alive)
                    return;
                setItems(out);
                setErr(null);
            }
            catch (e) {
                if (!alive)
                    return;
                setItems([]);
                setErr(e?.message || "Error leyendo 'images'");
            }
            finally {
                if (alive)
                    setLoading(false);
            }
        })();
        return () => { alive = false; };
    }, []);
    const value = useMemo(() => ({ items, loading, error: err }), [items, loading, err]);
    return _jsx(ImagesContext.Provider, { value: value, children: children });
};
// helper opcional para <img onError>
export const onImgErrorToLocal = (local) => (ev) => {
    if (!local)
        return;
    const img = ev.currentTarget;
    if (img.__fallbackDone)
        return;
    img.__fallbackDone = true;
    img.src = local;
};
