// src/server.ts
import express, { Request, Response, NextFunction, RequestHandler } from "express";
import axios from "axios";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const app = express();
app.use(express.json());

/* ---------------- CORS ---------------- */
const ORIGINS = (process.env.ALLOWED_ORIGIN || "http://localhost:3000")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: ORIGINS,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Idempotency-Key"],
  })
);
app.options("*", cors());

/* ------------- Logging simple --------- */
app.use((req, _res, next) => {
  console.log(`📩 ${req.method} ${req.url}`, Object.keys(req.body || {}).length ? req.body : "");
  next();
});

/* --------- Credenciales MP ----------- */
const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN;
if (!MP_ACCESS_TOKEN) {
  console.error("❌ MP_ACCESS_TOKEN no está definido en .env");
  process.exit(1);
}

/* -------------- Helpers -------------- */
const isHttpUrl = (u: string) => /^https?:\/\//i.test(u);
const trimSlash = (u: string) => u.replace(/\/$/, "");

const getFrontendBase = (req?: Request) => {
  const fromEnv = (process.env.FRONTEND_BASE_URL || "").trim();
  if (isHttpUrl(fromEnv)) return trimSlash(fromEnv);
  const fromOrigin = (req?.headers.origin || "").toString().trim();
  if (isHttpUrl(fromOrigin)) return trimSlash(fromOrigin);
  return "http://localhost:3000";
};

const idemKey = (obj: unknown) =>
  crypto.createHash("sha256").update(JSON.stringify(obj)).digest("hex");

/* -------------- Endpoint ------------- */
const createPreference: RequestHandler = async (req, res) => {
  const rawItems = Array.isArray(req.body?.items) ? req.body.items : [];
  if (!rawItems.length) return res.status(400).json({ error: "items[] es requerido" });

  // Normaliza tipos para evitar 400 de MP
  const items = rawItems.map((it: any) => ({
    title: String(it?.title || "Producto"),
    quantity: Number(it?.quantity || 1),
    unit_price: Number(it?.unit_price || 0),
    currency_id: String(it?.currency_id || "ARS"),
  }));

  const base = getFrontendBase(req);
  const back_urls = {
    success: `${base}/thank-you`,
    failure: `${base}/failure`,
    pending: `${base}/pending`,
  };

  // Construcción del payload. SIN auto_return por defecto.
  const preference: any = { items, back_urls };

  // Si querés auto-redirect, habilitalo con MP_AUTO_RETURN=approved|all
  const AUTO = (process.env.MP_AUTO_RETURN || "").trim();
  if ((AUTO === "approved" || AUTO === "all") && isHttpUrl(back_urls.success)) {
    preference.auto_return = AUTO;
  }

  console.log("➡️ Payload a MP:", JSON.stringify(preference, null, 2));

  try {
    const { data } = await axios.post(
      "https://api.mercadopago.com/checkout/preferences",
      preference,
      {
        headers: {
          Authorization: `Bearer ${MP_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-Idempotency-Key": idemKey(preference),
        },
        timeout: 15000,
      }
    );

    console.log("✅ Preferencia creada:", data.id);
    res.json({
      id: data.id,
      init_point: data.init_point || data.sandbox_init_point || null,
    });
  } catch (e: any) {
    const status = e?.response?.status || 500;
    const payload = e?.response?.data || { message: e?.message || "Internal error" };
    console.error("❌ Error MP:", payload);
    res.status(status).json({ error: payload });
  }
};

app.post("/create-preference", createPreference);

/* --------- Health & config ----------- */
app.get("/", (_req, res) => res.send("✅ API OK"));
app.get("/config", (req, res) =>
  res.json({
    origins: ORIGINS,
    frontendBase: getFrontendBase(req),
    env: process.env.NODE_ENV || "development",
    autoReturn: process.env.MP_AUTO_RETURN || null,
  })
);

/* -------------- 404 & error ---------- */
app.use((_req, res) => res.status(404).json({ error: "Not found" }));
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error("💥 Unhandled:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

/* --------------- Start ---------------- */
const PORT = Number(process.env.PORT) || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server listening at http://localhost:${PORT}`);
});
