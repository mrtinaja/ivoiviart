import React, { createContext, useContext, ReactNode } from "react";

// Definimos el tipo de los elementos de media
export type MediaItem = {
  id: number;
  images: string[];
  description: string;
  price?: number;
};

// Datos iniciales de la galería (sin `public/` en las rutas de imágenes)
const media: MediaItem[] = [
  {
    id: 1,
    images: ["img/IMG_20240421_210105.jpg", "img/IMG_20240421_210111.jpg"],
    description: "Sirena (10x5x5)",
    price: 100,
  },
  {
    id: 2,
    images: ["img/IMG_20240421_210126.jpg", "img/IMG_20240421_210132.jpg"],
    description: "Gata Cálico (8x6x5)",
    price: 100,
  },
  {
    id: 3,
    images: ["img/IMG_20240421_210140.jpg", "img/IMG_20240421_210146.jpg"],
    description: "Elefante mandala (8x6x5)",
    price: 100,
  },
  {
    id: 4,
    images: [
      "img/IMG_20240421_210220.jpg",
      "img/IMG_20240421_210226.jpg",
      "img/IMG_20240503_210936.jpg",
      "img/IMG_20240503_210943.jpg",
      "img/IMG_20240503_210951.jpg",
    ],
    description: "Ranita (6x6x5)",
    price: 100,
  },
  {
    id: 5,
    images: ["img/IMG_20240421_210243.jpg", "img/IMG_20240421_210248.jpg"],
    description: "Tazón para sopa - (10x5x5)",
    price: 100,
  },
  {
    id: 6,
    images: [
      "img/IMG_20240421_210257.jpg",
      "img/IMG_20240421_210305.jpg",
      "img/IMG_20240421_210312.jpg",
    ],
    description: "Gatitos siameses - (8x6x5)",
    price: 100,
  },
  {
    id: 7,
    images: [
      "img/IMG_20240503_205601.jpg",
      "img/IMG_20240503_205609.jpg",
      "img/IMG_20240503_205633.jpg",
      "img/IMG_20240503_205643.jpg",
      "img/IMG_20240503_205652.jpg",
      "img/IMG_20240503_205659.jpg",
    ],
    description: "Dragón para sahumerios escupe humo (20x15)",
    price: 100,
  },
  {
    id: 8,
    images: [
      "img/IMG_20240503_210829.jpg",
      "img/IMG_20240503_210837.jpg",
      "img/IMG_20240503_210844.jpg",
    ],
    description: "Taza alta primavera",
    price: 100,
  },
  {
    id: 9,
    images: [
      "img/IMG_20240530_125032.jpg",
      "img/IMG_20240530_125212.jpg",
      "img/IMG_20240530_125304.jpg",
      "img/IMG_20240530_125353.jpg",
    ],
    description: "Bowl noche estrellada (35x17)",
    price: 100,
  },
  {
    id: 10,
    images: [
      "img/IMG_20240530_150132.jpg",
      "img/IMG_20240530_150139.jpg",
      "img/IMG_20240530_150148.jpg",
      "img/IMG_20240530_150201.jpg",
      "img/IMG_20240530_150212.jpg",
    ],
    description: "Maceta conejo (15x10)",
    price: 100,
  },
  {
    id: 11,
    images: [
      "img/IMG_20240530_150246.jpg",
      "img/IMG_20240530_150253.jpg",
      "img/IMG_20240530_150258.jpg",
      "img/IMG_20240530_150304.jpg",
    ],
    description: "Lechuza (10x5x5)",
    price: 100,
  },
  {
    id: 12,
    images: ["img/IMG_20240530_150314.jpg", "img/IMG_20240530_150324.jpg"],
    description: "Minimaceta frutilla (5x5)",
    price: 100,
  },
  {
    id: 14,
    images: ["img/IMG_20240605_115342.jpg", "img/IMG_20240605_115349.jpg"],
    description: "Tetera jean una pieza (20x15)",
    price: 100,
  },
  {
    id: 15,
    images: [
      "img/IMG_20240611_165426.jpg",
      "img/IMG_20240611_165440.jpg",
      "img/IMG_20240611_165445.jpg",
      "img/IMG_20240611_165453.jpg",
    ],
    description: "Pacha mama (10x12x6)",
    price: 100,
  },
  {
    id: 16,
    images: ["img/IMG_20240612_141409.jpg", "img/IMG_20240612_141402.jpg"],
    description: "Taza Artaud (5x7)",
    price: 100,
  },
  {
    id: 17,
    images: [
      "img/IMG_20240612_141440.jpg",
      "img/IMG_20240612_141435.jpg",
      "img/IMG_20240612_141427.jpg",
    ],
    description: "Taza iguana Enacantados (15x8)",
    price: 100,
  },
  {
    id: 18,
    images: ["img/IMG_20240530_150332.jpg"],
    description: "Minipug",
    price: 100,
  },

  {
    id: 20,
    images: ["img/IMG_20240608_205038.jpg"],
    description: "Gato posa utensillo",
  },
  {
    id: 21,
    images: ["img/IMG_20240612_151112.jpg"],
    description: "Tacitas hongos terracota",
    price: 100,
  },
  {
    id: 22,
    images: ["img/IMG_20240619_104344.jpg"],
    description: "Tazas hongos gres",
    price: 100,
  },
  {
    id: 23,
    images: ["img/IMG_20250121_181629.jpg"],
    description: "Bebedero para pájaros - fondo vidriado",
    price: 100,
  },
  {
    id: 24,
    images: ["img/IMG_20250121_181712.jpg"],
    description: "Móvil de pájaros",
    price: 100,
  },
];

// Crear el contexto
const MediaContext = createContext<MediaItem[]>(media);

// Hook para acceder al contexto
export const useMedia = () => useContext(MediaContext);

// Definición de las props del provider
interface MediaProviderProps {
  children: ReactNode;
}

// Proveedor del contexto
export const MediaProvider: React.FC<MediaProviderProps> = ({ children }) => {
  return (
    <MediaContext.Provider value={media}>{children}</MediaContext.Provider>
  );
};
