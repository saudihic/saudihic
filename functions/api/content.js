export async function onRequestGet(context) {
  try {
    const saved = await context.env.HIC_CONTENT.get("site-content");

    return new Response(
      saved || JSON.stringify({ pages: {} }),
      {
        headers: {
          "content-type": "application/json; charset=utf-8",
          "cache-control": "no-store"
        }
      }
    );
  } catch (e) {
    return new Response(
      JSON.stringify({ pages: {}, error: e.message }),
      {
        headers: {
          "content-type": "application/json; charset=utf-8",
          "cache-control": "no-store"
        }
      }
    );
  }
}

export async function onRequestPost(context) {
  try {
    const body = await context.request.json();
    const password = context.env.HIC_ADMIN_PASSWORD;

    if (!password || !body || body.password !== password) {
      return new Response(
        JSON.stringify({
          ok: false,
          success: false,
          error: "Unauthorized"
        }),
        {
          status: 401,
          headers: {
            "content-type": "application/json; charset=utf-8"
          }
        }
      );
    }

    if (!body.content || typeof body.content !== "object") {
      return new Response(
        JSON.stringify({
          ok: false,
          success: false,
          error: "Invalid content"
        }),
        {
          status: 400,
          headers: {
            "content-type": "application/json; charset=utf-8"
          }
        }
      );
    }

    await context.env.HIC_CONTENT.put(
      "site-content",
      JSON.stringify(body.content, null, 2)
    );

    return new Response(
      JSON.stringify({
        ok: true,
        success: true,
        saved: true,
        savedAt: new Date().toISOString()
      }),
      {
        headers: {
          "content-type": "application/json; charset=utf-8",
          "cache-control": "no-store"
        }
      }
    );

  } catch (e) {
    return new Response(
      JSON.stringify({
        ok: false,
        success: false,
        error: e.message
      }),
      {
        status: 500,
        headers: {
          "content-type": "application/json; charset=utf-8"
        }
      }
    );
  }
}
