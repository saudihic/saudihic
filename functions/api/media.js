export async function onRequest(context) {
  const { request, env } = context;

  if (!env.HIC_CONTENT) {
    return Response.json({ ok: false, error: "Missing HIC_CONTENT binding" }, { status: 500 });
  }

  if (request.method === "POST") {
    const form = await request.formData();
    const password = form.get("password");
    const file = form.get("file");

    if (password !== "Aa@6821111") {
      return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    if (!file || typeof file.arrayBuffer !== "function") {
      return Response.json({ ok: false, error: "No file uploaded" }, { status: 400 });
    }

    const originalName = file.name || "image.jpg";
    const safeName = originalName
      .toLowerCase()
      .replace(/[^a-z0-9.]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

    const key = Date.now() + "-" + safeName;
    const buffer = await file.arrayBuffer();

    await env.HIC_CONTENT.put("media:" + key, buffer, {
      metadata: {
        contentType: file.type || "application/octet-stream",
        name: originalName
      }
    });

    return Response.json({
      ok: true,
      success: true,
      key,
      url: "/api/media?key=" + encodeURIComponent(key)
    });
  }

  if (request.method === "GET") {
    const url = new URL(request.url);
    const key = url.searchParams.get("key");

    if (!key) {
      return new Response("Missing key", { status: 400 });
    }

    const item = await env.HIC_CONTENT.getWithMetadata("media:" + key, { type: "arrayBuffer" });

    if (!item || !item.value) {
      return new Response("Not found", { status: 404 });
    }

    return new Response(item.value, {
      headers: {
        "content-type": item.metadata?.contentType || "application/octet-stream",
        "cache-control": "public, max-age=31536000, immutable"
      }
    });
  }

  return new Response("Method not allowed", { status: 405 });
}
