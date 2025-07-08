export default async function handler(req, res) {
  const path = req.url.replace("/api/proxy", ""); // giữ nguyên path và query string
  const targetUrl = `https://dacdev.com/api/v1${path}`;

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        ...req.headers,
        'x-api-key': 'f435d83dbce7489b88c307841bfaff03', // 🔐 Gắn API key vào header
      },
      body: req.method !== "GET" && req.method !== "HEAD" ? req : undefined,
    });

    const data = await response.arrayBuffer();
    res.status(response.status);

    response.headers.forEach((v, k) => res.setHeader(k, v));
    res.send(Buffer.from(data));
  } catch (error) {
    res.status(500).json({ error: "Proxy error", details: error.message });
  }
}
