/* scripts/upload-images.ts
   Sube todas las imágenes de public/img a Firebase Storage,
   crea/actualiza docs en Firestore (colección "images")
   y genera public/img/manifest.json como fallback local.
   Requisitos:
   - Guardar serviceAccount.json en la raíz del repo (gitignored).
   - npm i -D tsx fast-glob mime firebase-admin
   Ejecutar: npx tsx scripts/upload-images.ts
*/
/* eslint-disable no-console */
import * as admin from "firebase-admin";
import fg from "fast-glob";
import * as fs from "fs";
import * as path from "path";
import * as mime from "mime";
const PROJECT_ROOT = process.cwd();
const IMG_DIR = path.join(PROJECT_ROOT, "public", "img");
const MANIFEST_PATH = path.join(IMG_DIR, "manifest.json");
// --- Cargar service account (sin require, compatible con Vite/Preact) ---
const SA_PATH = path.join(PROJECT_ROOT, "serviceAccount.json");
if (!fs.existsSync(SA_PATH)) {
    console.error(`No se encontró ${SA_PATH}. Colocá el JSON de la service account en la raíz y probá de nuevo.`);
    process.exit(1);
}
const sa = JSON.parse(fs.readFileSync(SA_PATH, "utf8"));
// --- Inicializar Admin SDK con bucket explícito ---
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(sa),
        storageBucket: "ivoiviart-420a2.firebasestorage.app", // ← ESTE
    });
}
const bucket = admin.storage().bucket("ivoiviart-420a2.firebasestorage.app");
const db = admin.firestore();
// --- Parser tolerante de nombre de archivo ---
function parseName(fileName) {
    const base = fileName.replace(/\.[^.]+$/, ""); // sin extensión
    const codeMatch = base.match(/^(\d{3,5})\b/);
    const code = codeMatch ? codeMatch[1] : "000";
    let rest = codeMatch ? base.slice(codeMatch[0].length).trim() : base;
    let variant = 0;
    const variantMatch = rest.match(/(?:-|_| |\b)(\d+)$/);
    if (variantMatch) {
        const v = parseInt(variantMatch[1], 10);
        if (!Number.isNaN(v)) {
            variant = v;
            rest = rest.slice(0, rest.length - variantMatch[0].length).trim();
        }
    }
    const title = rest.replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim() || "sin título";
    const slug = title
        .toLowerCase()
        .replace(/[^\p{L}\p{N}]+/gu, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
    return { code, title, slug, variant };
}
// --- URL firmada por 1 año (si preferís público, usar makePublic + publicUrl) ---
async function ensurePublicURL(file) {
    const [url] = await file.getSignedUrl({
        action: "read",
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
    });
    return url;
}
async function run() {
    console.log("Bucket:", bucket.name);
    // Smoke test de credenciales
    await bucket.getFiles({ maxResults: 1 });
    console.log("Credenciales OK");
    if (!fs.existsSync(IMG_DIR)) {
        console.error("No existe la carpeta:", IMG_DIR);
        process.exit(1);
    }
    const files = await fg(["**/*.{jpg,jpeg,png,webp,avif,gif}"], { cwd: IMG_DIR, dot: false });
    if (!files.length) {
        console.log("No se encontraron imágenes en public/img.");
        return;
    }
    const manifest = [];
    let ok = 0;
    let fail = 0;
    for (const rel of files) {
        try {
            const abs = path.join(IMG_DIR, rel);
            const fileName = path.basename(abs);
            const ext = path.extname(fileName).toLowerCase();
            const type = mime.getType?.(fileName) ||
                mime.lookup?.(fileName) ||
                "application/octet-stream";
            const { code, title, slug, variant } = parseName(fileName);
            const destName = `${code}-${slug}${variant ? `-${variant}` : ""}${ext}`;
            const storagePath = `images/${code}/${destName}`;
            // Subir a Storage
            const [uploadFile] = await bucket.upload(abs, {
                destination: storagePath,
                metadata: {
                    contentType: type,
                    cacheControl: "public,max-age=31536000,immutable",
                    metadata: { code, title, variant: String(variant) },
                },
                gzip: true,
            });
            // URL firmada
            const downloadURL = await ensurePublicURL(uploadFile);
            // Upsert Firestore
            const docId = `${code}-${slug}${variant ? `-${variant}` : ""}`;
            const docData = {
                code,
                title,
                variant,
                storagePath,
                downloadURL,
                contentType: type,
                fileName,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            };
            await db.collection("images").doc(docId).set(docData, { merge: true });
            // Fallback local
            manifest.push({
                code,
                title,
                variant,
                url: `/img/${rel.replace(/\\/g, "/")}`,
                fileName,
            });
            ok++;
            console.log(`✔ Subido: ${fileName} → ${storagePath}`);
        }
        catch (err) {
            fail++;
            console.error(`✖ Error con ${rel}:`, err?.message || err);
            // continuar con el resto
        }
    }
    // Guardar manifest
    manifest.sort((a, b) => (a.code === b.code ? a.variant - b.variant : a.code.localeCompare(b.code)));
    fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), "utf8");
    console.log(`\nResultado: ${ok} ok, ${fail} errores.`);
    console.log(`Manifest generado en: ${path.relative(PROJECT_ROOT, MANIFEST_PATH)}`);
    if (ok === 0) {
        console.error("No se subió ninguna imagen. Revisá credenciales/roles o el bucket.");
        process.exit(1);
    }
}
run().catch((e) => {
    console.error(e);
    process.exit(1);
});
