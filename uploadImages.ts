import * as admin from "firebase-admin";
import serviceAccount from "./firebase-key.json"; // ✅ Asegurate de que este archivo existe

import { Storage } from "@google-cloud/storage";
import * as path from "path";
import * as fs from "fs";

// 🔥 Inicializar Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    storageBucket: "ivoiviart-bucket.appspot.com",
  });
}

const storage = new Storage({
  keyFilename: path.join(__dirname, "firebase-key.json"),
});

const bucket = storage.bucket("ivoiviart-bucket.appspot.com"); // Verificá que el nombre sea correcto

// 📤 Función para subir archivos
async function uploadFile(filePath: string) {
  try {
    const destination = `images/${path.basename(filePath)}`;

    await bucket.upload(filePath, {
      destination,
      public: true,
      metadata: {
        cacheControl: "public, max-age=31536000",
      },
    });

    console.log(`✅ ${filePath} subido correctamente a ${destination}`);
  } catch (error) {
    console.error(`❌ Error al subir ${filePath}:`, error);
  }
}

// 📂 Subir todas las imágenes de la carpeta /public/img
const localFolder = path.join(__dirname, "public/img");
fs.readdir(localFolder, async (err, files) => {
  if (err) {
    console.error("❌ Error al leer la carpeta:", err);
    return;
  }

  if (files.length === 0) {
    console.log("⚠️ No hay imágenes para subir.");
    return;
  }

  console.log(`📂 Imágenes detectadas:`, files);
  for (const file of files) {
    await uploadFile(path.join(localFolder, file));
  }

  console.log("🚀 Proceso de subida completado.");
});
