// Lists keys in the store, optionally filtered by prefix.
// GET /api/store?prefix=quote:

const STORE_PREFIX = "store:";
const ALLOWED_ORIGINS = ["https://saudihic.com", "https://www.saudihic.com"];

function corsHeaders(context) {
  const origin = context.request.headers.get("Origin") || "";
  const allowOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
    "access-control-allow-origin": allowOrigin,
    "access-control-allow-methods": "GET, PUT, DELETE, OPTIONS",
    "access-control-allow-headers": "content-type, x-admin-password",
    "vary": "Origin"
  };
}

function checkAuth(context) {
  const password = context.env.HIC_ADMIN_PASSWORD;
  if (!password) return false;
  const supplied = context.request.headers.get("x-admin-password");
  return supplied === password;
}

export async function onRequestOptions(context) {
  return new Response(null, { headers: corsHeaders(context) });
}

export async function onRequestGet(context) {
  try {
    if (!checkAuth(context)) {
      return new Response(JSON.stringify({ ok: false, error: "Unauthorized", keys: [] }), {
        status: 401,
        headers: corsHeaders(context)
      });
    }
    const url = new URL(context.request.url);
    const prefix = url.searchParams.get("prefix") || "";
    const list = await context.env.HIC_CONTENT.list({ prefix: STORE_PREFIX + prefix });
    const keys = list.keys.map(k => k.name.slice(STORE_PREFIX.length));
    return new Response(JSON.stringify({ ok: true, keys }), {
      headers: corsHeaders(context)
    });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: e.message, keys: [] }), {
      status: 500,
      headers: corsHeaders(context)
    });
  }
}
