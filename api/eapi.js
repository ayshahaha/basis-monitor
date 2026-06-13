export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  const { path: rawPath, ...query } = req.query;
  const cleanPath = (rawPath || '').replace(/^\//, '');
  const qs = new URLSearchParams(query).toString();
  const url = `https://eapi.binance.com/eapi/v1/${cleanPath}${qs ? '?' + qs : ''}`;

  try {
    const response = await fetch(url, { headers: { 'User-Agent': 'basis-monitor/1.0' } });
    let data;
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = { error: 'non-json response', status: response.status, text: await response.text().catch(() => '') };
    }
    res.status(response.status).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message, url });
  }
}
