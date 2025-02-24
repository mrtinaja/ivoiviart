import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// Función para generar la URL pública en Google Cloud Storage con manejo de errores
export const getStorageUrl = (fileName: string): string => {
  if (!fileName || typeof fileName !== "string") {
    console.warn("⚠️ Imagen inválida detectada:", fileName);
    return "https://via.placeholder.com/600"; // Imagen de fallback en caso de error
  }
  return `https://storage.googleapis.com/ivoiviart/img/${encodeURIComponent(
    fileName
  )}`;
};

// Definición del tipo de cada elemento multimedia
export type MediaItem = {
  id: number;
  images: string[];
  description: string;
  price?: number;
};

// Función para generar los datos de la galería
const generateMediaData = (): MediaItem[] => [
  {
    id: 1,
    images: ["IMG_20240421_210105.jpg", "IMG_20240421_210111.jpg"].map(
      getStorageUrl
    ),
    description: "Sirena (10x5x5)",
    price: 100,
  },
  {
    id: 2,
    images: ["IMG_20240421_210126.jpg", "IMG_20240421_210132.jpg"].map(
      getStorageUrl
    ),
    description: "Gata Cálico (8x6x5)",
    price: 100,
  },
  {
    id: 3,
    images: ["IMG_20240421_210140.jpg", "IMG_20240421_210146.jpg"].map(
      getStorageUrl
    ),
    description: "Elefante mandala (8x6x5)",
    price: 100,
  },
  {
    id: 4,
    images: [
      "IMG_20240421_210220.jpg",
      "IMG_20240421_210226.jpg",
      "IMG_20240503_210936.jpg",
      "IMG_20240503_210943.jpg",
      "IMG_20240503_210951.jpg",
    ].map(getStorageUrl),
    description: "Ranita (6x6x5)",
    price: 100,
  },
  {
    id: 5,
    images: ["IMG_20240421_210243.jpg", "IMG_20240421_210248.jpg"].map(
      getStorageUrl
    ),
    description: "Tazón para sopa - (10x5x5)",
    price: 100,
  },
  {
    id: 6,
    images: [
      "IMG_20240421_210257.jpg",
      "IMG_20240421_210305.jpg",
      "IMG_20240421_210312.jpg",
    ].map(getStorageUrl),
    description: "Gatitos siameses - (8x6x5)",
    price: 100,
  },
  {
    id: 7,
    images: [
      "IMG_20240503_205601.jpg",
      "IMG_20240503_205609.jpg",
      "IMG_20240503_205633.jpg",
      "IMG_20240503_205643.jpg",
      "IMG_20240503_205652.jpg",
      "IMG_20240503_205659.jpg",
    ].map(getStorageUrl),
    description: "Dragón para sahumerios escupe humo (20x15)",
    price: 100,
  },
  {
    id: 8,
    images: [
      "IMG_20240503_210829.jpg",
      "IMG_20240503_210837.jpg",
      "IMG_20240503_210844.jpg",
    ].map(getStorageUrl),
    description: "Taza alta primavera",
    price: 100,
  },
  {
    id: 9,
    images: [
      "IMG_20240530_125032.jpg",
      "IMG_20240530_125212.jpg",
      "IMG_20240530_125304.jpg",
      "IMG_20240530_125353.jpg",
    ].map(getStorageUrl),
    description: "Bowl noche estrellada (35x17)",
    price: 100,
  },
  {
    id: 10,
    images: [
      "IMG_20240530_150132.jpg",
      "IMG_20240530_150139.jpg",
      "IMG_20240530_150148.jpg",
      "IMG_20240530_150201.jpg",
      "IMG_20240530_150212.jpg",
    ].map(getStorageUrl),
    description: "Maceta conejo (15x10)",
    price: 100,
  },
  {
    id: 11,
    images: [
      "IMG_20240530_150246.jpg",
      "IMG_20240530_150253.jpg",
      "IMG_20240530_150258.jpg",
      "IMG_20240530_150304.jpg",
    ].map(getStorageUrl),
    description: "Lechuza (10x5x5)",
    price: 100,
  },
  {
    id: 12,
    images: ["IMG_20240530_150314.jpg", "IMG_20240530_150324.jpg"].map(
      getStorageUrl
    ),
    description: "Minimaceta frutilla (5x5)",
    price: 100,
  },
  {
    id: 14,
    images: ["IMG_20240605_115342.jpg", "IMG_20240605_115349.jpg"].map(
      getStorageUrl
    ),
    description: "Tetera jean una pieza (20x15)",
    price: 100,
  },
  {
    id: 15,
    images: [
      "IMG_20240611_165426.jpg",
      "IMG_20240611_165440.jpg",
      "IMG_20240611_165445.jpg",
      "IMG_20240611_165453.jpg",
    ].map(getStorageUrl),
    description: "Pacha mama (10x12x6)",
    price: 100,
  },
  {
    id: 16,
    images: ["IMG_20240612_141409.jpg", "IMG_20240612_141402.jpg"].map(
      getStorageUrl
    ),
    description: "Taza Artaud (5x7)",
    price: 100,
  },
  {
    id: 17,
    images: [
      "IMG_20240612_141440.jpg",
      "IMG_20240612_141435.jpg",
      "IMG_20240612_141427.jpg",
    ].map(getStorageUrl),
    description: "Taza iguana Encantados (15x8)",
    price: 100,
  },
  {
    id: 18,
    images: ["IMG_20240530_150332.jpg"].map(getStorageUrl),
    description: "Minipug",
    price: 100,
  },
  {
    id: 20,
    images: ["IMG_20240608_205038.jpg"].map(getStorageUrl),
    description: "Gato posa utensillo",
  },
  {
    id: 21,
    images: ["IMG_20240612_151112.jpg"].map(getStorageUrl),
    description: "Tacitas hongos terracota",
    price: 100,
  },
  {
    id: 22,
    images: ["IMG_20240619_104344.jpg"].map(getStorageUrl),
    description: "Tazas hongos gres",
    price: 100,
  },
  {
    id: 23,
    images: ["IMG_20250121_181629.jpg"].map(getStorageUrl),
    description: "Bebedero para pájaros - fondo vidriado",
    price: 100,
  },
  {
    id: 24,
    images: ["IMG_20250121_181712.jpg"].map(getStorageUrl),
    description: "Móvil de pájaros",
    price: 100,
  },
];

// Crear el contexto de medios con estado inicial vacío
const MediaContext = createContext<MediaItem[]>([]);

// Hook para acceder al contexto
export const useMedia = () => useContext(MediaContext);

// Definición de las props del provider
interface MediaProviderProps {
  children: ReactNode;
}

// Proveedor del contexto con carga dinámica
export const MediaProvider: React.FC<MediaProviderProps> = ({ children }) => {
  const [media, setMedia] = useState<MediaItem[]>([]);

  useEffect(() => {
    // Simula carga asíncrona (se puede reemplazar por un fetch a una API)
    setTimeout(() => {
      setMedia(generateMediaData());
    }, 500); // Retraso simulado de 500ms
  }, []);

  return (
    <MediaContext.Provider value={media}>{children}</MediaContext.Provider>
  );
};
