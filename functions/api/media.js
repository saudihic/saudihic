function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store"
    }
  });
}

function safeName(name) {
  const ext = (name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
  const base = name.replace(/\.[^/.]+$/, "").toLowerCase()
    .replace(/[^a-z0-9-_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 50) || "image";
  return `${Date.now()}-${base}.${ext || "jpg"}`;
}

export async function onRequestGet(context) {
  try {
    const url = new URL(context.request.url);
    const key = url.searchParams.get("key");

    if (!key) {
      return json({ ok: true, usage: "Use /api/media?key=filename to retrieve an image." });
    }

    const object = await context.env.HIC_MEDIA.get(key);
    if (!object) {
      return new Response("Not found", { status: 404 });
    }

    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set("etag", object.httpEtag);
    headers.set("cache-control", "public, max-age=31536000, immutable");

    return new Response(object.body, { headers });
  } catch (e) {
    return json({ ok: false, error: e.message }, 500);
  }
}

export async function onRequestPost(context) {
  try {
    const form = await context.request.formData();
    const password = form.get("password");
    const expected = context.env.HIC_ADMIN_PASSWORD || "Aa@6821111";

    if (password !== expected) {
      return json({ ok: false, success: false, error: "Unauthorized" }, 401);
    }

    const file = form.get("file");
    if (!file || typeof file === "string") {
      return json({ ok: false, success: false, error: "No image file received" }, 400);
    }

    if (!file.type || !file.type.startsWith("image/")) {
      return json({ ok: false, success: false, error: "Only images are allowed" }, 400);
    }

    const key = safeName(file.name || "image.jpg");
    await context.env.HIC_MEDIA.put(key, file.stream(), {
      httpMetadata: { contentType: file.type }
    });

    return json({
      ok: true,
      success: true,
      key,
      url: `/api/media?key=${encodeURIComponent(key)}`
    });
  } catch (e) {
    return json({ ok: false, success: false, error: e.message }, 500);
  }
}
