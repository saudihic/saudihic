// Lists keys in the store, optionally filtered by prefix.
// GET /api/store?prefix=quote:

const STORE_PREFIX = "store:";

function corsHeaders() {
  return {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "GET, PUT, DELETE, OPTIONS",
    "access-control-allow-headers": "content-type, x-admin-password"
  };
}

export async function onRequestOptions() {
  return new Response(null, { headers: corsHeaders() });
}

export async function onRequestGet(context) {
  try {
    const url = new URL(context.request.url);
    const prefix = url.searchParams.get("prefix") || "";
    const list = await context.env.HIC_CONTENT.list({ prefix: STORE_PREFIX + prefix });
    const keys = list.keys.map(k => k.name.slice(STORE_PREFIX.length));
    return new Response(JSON.stringify({ ok: true, keys }), {
      headers: corsHeaders()
    });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: e.message, keys: [] }), {
      status: 500,
      headers: corsHeaders()
    });
  }
}
