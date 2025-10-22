/** @jsxImportSource preact */
import { FunctionalComponent } from "preact";
import { Link } from "react-router-dom";
import Card from "./Card";
import { useMedia, type MediaItem } from "../services/media";

// helpers locales
const capitalizeWords = (s: string) =>
  s.replace(/\b\p{L}/gu, (m) => m.toUpperCase());

const humanize = (s: string) =>
  capitalizeWords(
    (s || "")
      .replace(/^\s*\d+\s*[-_]?/, "") // quita prefijo numérico + guión
      .replace(/[-_]+/g, " ")         // guiones -> espacios
      .trim()
  ) || "Sin título";

const CardList: FunctionalComponent = () => {
  const { media, loading, error } = useMedia();

  if (loading) return <div className="p-8 text-[#f0eceb]">cargando…</div>;
  if (error) {
    return (
      <div className="p-8 text-red-300">
        Error cargando catálogo: {String(error)}
      </div>
    );
  }
  if (!media || media.length === 0) {
    return <div className="p-8 text-[#f0eceb]">Sin productos por ahora.</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 place-items-start">
      {media.map((item: MediaItem, idx: number) => {
        // Preferimos description; fallback a title o code
        const raw = (item as any).description ?? (item as any).title ?? (item as any).code ?? "";
        const pretty = humanize(String(raw));

        return (
          <Link to={`/product/${item.id}`} key={`${item.id}-${idx}`} className="block">
            <Card
              image={item.images?.[0] ?? "/img/default.jpg"}
              description={pretty}
            />
          </Link>
        );
      })}
    </div>
  );
};

export default CardList;
