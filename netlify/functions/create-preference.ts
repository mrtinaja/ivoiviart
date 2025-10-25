// netlify/functions/create-preference.ts
import type { Handler } from "@netlify/functions";
import axios from "axios";

const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN || "";

/** Deducción del host público para armar back_urls correctas */
function getBaseUrl(headers: Record<string, string | undefined>) {
  // En producción Netlify expone URL/DEPLOY_PRIME_URL
  const envUrl =
    process.env.FRONTEND_BASE_URL ||
    process.env.URL ||
    process.env.DEPLOY_PRIME_URL;
  if (envUrl) return envUrl;

  // En netlify dev / locales
  const proto = (headers["x-forwarded-proto"] as string) || "http";
  const host = (headers["host"] as string) || "localhost:8888";
  return `${proto}://${host}`;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type,Authorization",
};

export const handler: Handler = async (event) => {
  // Preflight
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: corsHeaders, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  if (!MP_ACCESS_TOKEN) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: "MP_ACCESS_TOKEN no configurado" }),
    };
  }

  try {
    const body = event.body ? JSON.parse(event.body) : {};
    const rawItems = Array.isArray(body.items) ? body.items : [];
    if (!rawItems.length) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: "items[] es requerido" }),
      };
    }

    // Normalizar ítems
    const items = rawItems.map((p: any) => ({
      title: String(p.title || p.description || "Producto"),
      unit_price: Number(p.unit_price ?? p.price ?? 0),
      quantity: Number(p.quantity ?? 1),
      currency_id: String(p.currency_id || "ARS"),
    }));

    const base = getBaseUrl(event.headers || {});
    const preference = {
      items,
      back_urls: {
        success: `${base}/thank-you`,
        failure: `${base}/failure`,
        pending: `${base}/pending`,
      },
      auto_return: "approved",
    };

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

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
      body: JSON.stringify({ id: data.id, init_point: data.init_point }),
    };
  } catch (e: any) {
    const status = e?.response?.status || 500;
    const payload = e?.response?.data || { message: e?.message || "Error" };
    return {
      statusCode: status,
      headers: { "Content-Type": "application/json", ...corsHeaders },
      body: JSON.stringify({ error: payload }),
    };
  }
};
