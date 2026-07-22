// Generic key-value store API, backed by the HIC_CONTENT KV namespace
// already bound to this Pages project (same one used by the CMS).
// Used by quote-ar.html / quote-en.html / quote-archive.html to save
// and retrieve saved quotes, and can be reused by future tools.
//
// Keys are namespaced by prefix (e.g. "quote:HIC-2026-001") to keep
// different tools' data separate within the same KV store.

const STORE_PREFIX = "store:"; // internal namespace inside HIC_CONTENT KV

function corsHeaders() {
  return {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "GET, PUT, DELETE, OPTIONS",
    "access-control-allow-headers": "content-type, x-admin-password"
  };
}

function checkAuth(context) {
  const password = context.env.HIC_ADMIN_PASSWORD || "ahMed123";
  const supplied = context.request.headers.get("x-admin-password");
  return supplied === password;
}

export async function onRequestOptions() {
  return new Response(null, { headers: corsHeaders() });
}

export async function onRequestGet(context) {
  try {
    const key = STORE_PREFIX + context.params.key;
    const value = await context.env.HIC_CONTENT.get(key);
    if (value === null) {
      return new Response(JSON.stringify({ ok: false, error: "not found" }), {
        status: 404,
        headers: corsHeaders()
      });
    }
    return new Response(JSON.stringify({ ok: true, key: context.params.key, value }), {
      headers: corsHeaders()
    });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: e.message }), {
      status: 500,
      headers: corsHeaders()
    });
  }
}

export async function onRequestPut(context) {
  try {
    if (!checkAuth(context)) {
      return new Response(JSON.stringify({ ok: false, error: "Unauthorized" }), {
        status: 401,
        headers: corsHeaders()
      });
    }
    const key = STORE_PREFIX + context.params.key;
    const bodyText = await context.request.text();
    await context.env.HIC_CONTENT.put(key, bodyText);
    return new Response(JSON.stringify({ ok: true, key: context.params.key }), {
      headers: corsHeaders()
    });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: e.message }), {
      status: 500,
      headers: corsHeaders()
    });
  }
}

export async function onRequestDelete(context) {
  try {
    if (!checkAuth(context)) {
      return new Response(JSON.stringify({ ok: false, error: "Unauthorized" }), {
        status: 401,
        headers: corsHeaders()
      });
    }
    const key = STORE_PREFIX + context.params.key;
    await context.env.HIC_CONTENT.delete(key);
    return new Response(JSON.stringify({ ok: true }), {
      headers: corsHeaders()
    });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: e.message }), {
      status: 500,
      headers: corsHeaders()
    });
  }
}
