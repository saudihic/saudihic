export async function onRequestPost(context) {
  try {
    const password = context.env.HIC_ADMIN_PASSWORD || "Aa@6821111";

    // Check password from header
    const auth = context.request.headers.get("x-admin-password") || "";
    if (auth !== password) {
      return new Response(
        JSON.stringify({ ok: false, error: "Unauthorized" }),
        { status: 401, headers: { "content-type": "application/json" } }
      );
    }

    // Get file from form data
    const formData = await context.request.formData();
    const file = formData.get("file");
    const filename = formData.get("filename") || file.name;

    if (!file) {
      return new Response(
        JSON.stringify({ ok: false, error: "No file provided" }),
        { status: 400, headers: { "content-type": "application/json" } }
      );
    }

    // Generate unique filename
    const ext = filename.split(".").pop().toLowerCase();
    const uniqueName = `uploads/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    // Upload to R2
    const arrayBuffer = await file.arrayBuffer();
    await context.env.HIC_MEDIA.put(uniqueName, arrayBuffer, {
      httpMetadata: { contentType: file.type || "image/jpeg" }
    });

    // Build public URL
    const url = `https://media.saudihic.com/${uniqueName}`;

    return new Response(
      JSON.stringify({ ok: true, url }),
      { headers: { "content-type": "application/json" } }
    );

  } catch (e) {
    return new Response(
      JSON.stringify({ ok: false, error: e.message }),
      { status: 500, headers: { "content-type": "application/json" } }
    );
  }
}
