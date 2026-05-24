export async function onRequestGet(context) {
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
}

export async function onRequestPost(context) {
  try {
    const body = await context.request.json();

    const password = context.env.HIC_ADMIN_PASSWORD;

    if (body.password !== password) {
      return new Response(
        JSON.stringify({
          ok: false,
          error: "Unauthorized"
        }),
        {
          status: 401,
          headers: {
            "content-type": "application/json"
          }
        }
      );
    }

    await context.env.HIC_CONTENT.put(
      "site-content",
      JSON.stringify(body.content)
    );

    return new Response(
      JSON.stringify({
        ok: true
      }),
      {
        headers: {
          "content-type": "application/json"
        }
      }
    );

  } catch (e) {
    return new Response(
      JSON.stringify({
        ok: false,
        error: e.message
      }),
      {
        status: 500,
        headers: {
          "content-type": "application/json"
        }
      }
    );
  }
}
