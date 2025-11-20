// storageConfig.ts
import { Storage } from "@google-cloud/storage";
import * as path from "path";
// Asegúrate de que el archivo JSON de la cuenta de servicio esté en una ruta segura
const keyFilename = path.join(__dirname, "google-cloud-key.json");
// Inicializa el cliente de GCS
const storage = new Storage({ keyFilename });
const bucket = storage.bucket("ivoiviart"); // Ajusta el nombre según corresponda
export { storage, bucket };
