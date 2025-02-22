import * as admin from "firebase-admin";
import * as fs from "fs";
import * as path from "path";
import { Storage } from "@google-cloud/storage";

// Inicializar Firebase Admin
const serviceAccountPath = path.resolve(__dirname, "firebase-key.json");

if (!fs.existsSync(serviceAccountPath)) {
  throw new Error(
    `❌ Archivo firebase-key.json no encontrado en: ${serviceAccountPath}`
  );
}

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf-8"));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  storageBucket: "ivoiviart.appspot.com", // Reemplazar con tu Storage Bucket
});

const storage = new Storage();
const bucket = storage.bucket("ivoiviart.appspot.com"); // Reemplazar con tu Storage Bucket

// 🔥 DEFINIR localFolder (ruta de las imágenes en tu PC)
const localFolder = path.join(__dirname, "public/img");

// 🔥 DEFINIR uploadFile (función para subir cada imagen a Firebase)
const uploadFile = async (filePath: string) => {
  const fileName = path.basename(filePath);
  const destination = `imagenes/${fileName}`;

  await bucket.upload(filePath, {
    destination,
    metadata: {
      contentType: "image/jpeg", // Cambiar según el tipo de imagen
    },
  });

  console.log(`✅ Imagen subida: ${fileName}`);
};

// 🔥 Función para leer todas las imágenes y subirlas
const uploadImages = async () => {
  fs.readdir(localFolder, async (err, files) => {
    if (err) {
      console.error("❌ Error al leer la carpeta:", err);
      return;
    }

    for (const file of files) {
      const filePath = path.join(localFolder, file);
      await uploadFile(filePath);
    }

    console.log("🚀 Todas las imágenes fueron subidas a Firebase Storage.");
  });
};

// Ejecutar la función
uploadImages();
