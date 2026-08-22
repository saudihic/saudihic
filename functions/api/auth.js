export async function onRequestPost(context) {
  try {
    const body = await context.request.json();
    const password = context.env.HIC_ADMIN_PASSWORD;

    if (!password) {
      return new Response(
        JSON.stringify({ ok: false, error: "Server not configured" }),
        {
          status: 500,
          headers: {
            "content-type": "application/json; charset=utf-8",
            "cache-control": "no-store"
          }
        }
      );
    }

    if (body && body.password === password) {
      return new Response(
        JSON.stringify({ ok: true }),
        {
          headers: {
            "content-type": "application/json; charset=utf-8",
            "cache-control": "no-store"
          }
        }
      );
    }

    return new Response(
      JSON.stringify({ ok: false, error: "Unauthorized" }),
      {
        status: 401,
        headers: {
          "content-type": "application/json; charset=utf-8",
          "cache-control": "no-store"
        }
      }
    );
  } catch (e) {
    return new Response(
      JSON.stringify({ ok: false, error: e.message }),
      {
        status: 500,
        headers: {
          "content-type": "application/json; charset=utf-8"
        }
      }
    );
  }
}
