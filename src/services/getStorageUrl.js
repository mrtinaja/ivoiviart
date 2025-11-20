/// <reference types="vite/client" />
// src/services/getStorageUrl.ts
// Genera URL pública de Firebase Storage, configurable por .env (Vite)
const BUCKET = import.meta.env.VITE_FB_BUCKET ?? "ivoiviart-420a2.firebasestorage.app";
// si subiste todo a la raíz del bucket, dejá carpeta vacía ""; si usás subcarpeta ponela aquí
const FOLDER = import.meta.env.VITE_FB_FOLDER ?? ""; // ej "media", termina SIN slash
export const getStorageUrl = (fileName) => {
    if (!fileName)
        return "https://via.placeholder.com/600";
    const path = FOLDER ? `${FOLDER}/${fileName}` : fileName;
    // Regla general: https://firebasestorage.googleapis.com/v0/b/<bucket>/o/<path>?alt=media
    return `https://firebasestorage.googleapis.com/v0/b/${BUCKET}/o/${encodeURIComponent(path)}?alt=media`;
};
