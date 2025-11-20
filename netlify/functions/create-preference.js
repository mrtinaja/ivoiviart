// netlify/functions/create-preference.js

const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN || "";

/** Deducción del host público para armar back_urls correctas */
function getBaseUrl(headers) {
  const envUrl =
    process.env.FRONTEND_BASE_URL ||
    process.env.URL ||
    process.env.DEPLOY_PRIME_URL;

  if (envUrl) return envUrl;

  const proto = headers["x-forwarded-proto"] || "http";
  const host = headers["host"] || "localhost:8888";
  return `${proto}://${host}`;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type,Authorization",
};

export const handler = async (event) => {
  // Preflight CORS
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: corsHeaders, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  if (!MP_ACCESS_TOKEN) {
    console.error("MP_ACCESS_TOKEN no está configurado en Netlify");
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: "MP_ACCESS_TOKEN no configurado" }),
    };
  }

  let body;
  try {
    body = event.body ? JSON.parse(event.body) : {};
  } catch (e) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Body JSON inválido" }),
    };
  }

  const rawItems = Array.isArray(body.items) ? body.items : [];
  if (!rawItems.length) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ error: "items[] es requerido" }),
    };
  }

  // Normalizar ítems
  const items = rawItems.map((p) => ({
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

  try {
    const mpResponse = await fetch(
      "https://api.mercadopago.com/checkout/preferences",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${MP_ACCESS_TOKEN}`,
          // 👇 ACÁ ESTABA EL ERROR: SIN DOS PUNTOS
          "Content-Type": "application/json",
        },
        body: JSON.stringify(preference),
      }
    );

    const text = await mpResponse.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }

    if (!mpResponse.ok) {
      console.error("MP error:", mpResponse.status, data);
      return {
        statusCode: mpResponse.status,
        headers: { "Content-Type": "application/json", ...corsHeaders },
        body: JSON.stringify({ error: data }),
      };
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
      body: JSON.stringify({
        id: data.id,
        init_point: data.init_point,
      }),
    };
  } catch (e) {
    console.error("Error general create-preference:", e);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
      body: JSON.stringify({ error: e.message || "Error interno" }),
    };
  }
};
