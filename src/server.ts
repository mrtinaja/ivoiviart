import express, { Request, Response } from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

// 📌 Configurar CORS (Opcional: puedes personalizar los orígenes permitidos)
app.use(
  cors({
    origin: "*", // Cambia esto si querés restringir accesos
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// 📌 Middleware para ver las solicitudes recibidas
app.use((req, res, next) => {
  console.log(`📩 Solicitud recibida: ${req.method} ${req.url}`);
  next();
});

// 📌 Verificar si `MP_ACCESS_TOKEN` está definido
const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN;
if (!MP_ACCESS_TOKEN) {
  console.error("❌ ERROR: MP_ACCESS_TOKEN no está definido en el .env");
  process.exit(1);
}

// 📌 Ruta `/create-preference`
app.post("/create-preference", async (req: Request, res: Response) => {
  console.log("📩 POST /create-preference recibido con datos:", req.body);

  try {
    const preference = {
      items: req.body.items || [],
      back_urls: {
        success: "http://localhost:3000/thank-you",
        failure: "http://localhost:3000/failure",
        pending: "http://localhost:3000/pending",
      },
      auto_return: "approved",
    };

    const response = await axios.post(
      "https://api.mercadopago.com/checkout/preferences",
      preference,
      {
        headers: {
          Authorization: `Bearer ${MP_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Preferencia creada:", response.data.id);
    res.json({ id: response.data.id });
  } catch (error: any) {
    console.error(
      "❌ Error al crear la preferencia:",
      error.response?.data || error.message
    );

    res.status(error.response?.status || 500).json({
      error: error.response?.data || "Error interno del servidor",
    });
  }
});

// 📌 Ruta de prueba para verificar si el servidor responde correctamente
app.get("/", (req, res) => {
  res.send("✅ Servidor funcionando correctamente");
});

// 📌 Verificación de rutas registradas
app._router.stack.forEach((r: any) => {
  if (r.route && r.route.path) {
    console.log(`📌 Ruta registrada: ${r.route.path}`);
  }
});

// 📌 Definir el puerto desde `.env` o usar 8080 por defecto
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
