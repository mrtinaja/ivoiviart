// src/server.ts
import express, { Request, Response, NextFunction, RequestHandler } from "express";
import axios from "axios";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";

// Cargar .env desde la raíz del proyecto (ivoiviart/.env)
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const app = express();
app.use(express.json());

// --- CORS (ajusta ORIGIN para prod) ---
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || "*";
app.use(
  cors({
    origin: ALLOWED_ORIGIN,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// --- logger simple ---
app.use((req, _res, next) => {
  console.log(`📩 ${req.method} ${req.url}`, req.body ?? "");
  next();
});

// --- sanity check de credenciales ---
const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN;
if (!MP_ACCESS_TOKEN) {
  console.error("❌ MP_ACCESS_TOKEN no está definido en .env");
  process.exit(1);
}

// --- helper para errores axios ---
const toHttpError = (e: any) => ({
  status: e?.response?.status || 500,
  payload: e?.response?.data || { message: e?.message || "Internal error" },
});

// --- endpoint: crear preferencia ---
const createPreference: RequestHandler = async (req, res) => {
  // Validación mínima
  const items = Array.isArray(req.body?.items) ? req.body.items : [];
  if (!items.length) {
    return res.status(400).json({ error: "items[] es requerido" });
  }

  const host =
    process.env.FRONTEND_BASE_URL ||
    `http://localhost:${process.env.FRONTEND_PORT || 5173}`;

  const preference = {
    items, // [{ title, quantity, currency_id: 'ARS', unit_price }, ...]
    back_urls: {
      success: `${host}/thank-you`,
      failure: `${host}/failure`,
      pending: `${host}/pending`,
    },
    auto_return: "approved",
  };

  try {
    const { data } = await axios.post(
      "https://api.mercadopago.com/checkout/preferences",
      preference,
      {
        headers: {
          Authorization: `Bearer ${MP_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
        timeout: 15000,
      }
    );

    console.log("✅ Preferencia creada:", data.id);
    return res.json({ id: data.id, init_point: data.init_point });
  } catch (e: any) {
    const err = toHttpError(e);
    console.error("❌ Error MP:", err.payload);
    return res.status(err.status).json({ error: err.payload });
  }
};

app.post("/create-preference", createPreference);

// --- healthcheck + config ---
app.get("/", (_req, res) => res.send("✅ API OK"));
app.get("/config", (_req, res) =>
  res.json({
    allowedOrigin: ALLOWED_ORIGIN,
    frontend: process.env.FRONTEND_BASE_URL || null,
    env: process.env.NODE_ENV || "development",
  })
);

// --- 404 ---
app.use((_req, res) => res.status(404).json({ error: "Not found" }));

// --- manejador de errores ---
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error("💥 Unhandled:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

// --- start ---
const PORT = Number(process.env.PORT) || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server listening at http://localhost:${PORT}`);
});
