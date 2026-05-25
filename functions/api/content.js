export async function onRequest(context) {
  const { request, env } = context;

  if (!env.HIC_CONTENT) {
    return Response.json(
      { ok: false, error: "Missing HIC_CONTENT binding" },
      { status: 500 }
    );
  }

  const STORAGE_KEY = "site-content";
  const ADMIN_PASSWORD = "Aa@6821111";

  if (request.method === "GET") {
    const stored = await env.HIC_CONTENT.get(STORAGE_KEY);

    if (!stored) {
      return Response.json({ pages: {}, images: {} });
    }

    try {
      return new Response(stored, {
        headers: {
          "content-type": "application/json; charset=utf-8",
          "cache-control": "no-store"
        }
      });
    } catch (e) {
      return Response.json(
        { ok: false, error: "Invalid stored content" },
        { status: 500 }
      );
    }
  }

  if (request.method === "POST") {
    let body;

    try {
      body = await request.json();
    } catch (e) {
      return Response.json(
        { ok: false, error: "Invalid JSON body" },
        { status: 400 }
      );
    }

    if (!body || body.password !== ADMIN_PASSWORD) {
      return Response.json(
        { ok: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (!body.content || typeof body.content !== "object") {
      return Response.json(
        { ok: false, error: "Missing content object" },
        { status: 400 }
      );
    }

    await env.HIC_CONTENT.put(
      STORAGE_KEY,
      JSON.stringify(body.content)
    );

    return Response.json({
      ok: true,
      success: true,
      message: "Content saved"
    });
  }

  return Response.json(
    { ok: false, error: "Method not allowed" },
    { status: 405 }
  );
}
