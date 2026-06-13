export default async function handler(req, res) {
  const { path: rawPath, ...query } = req.query;
  const cleanPath = (rawPath || '').replace(/^\//, '');
  const qs = new URLSearchParams(query).toString();
  const url = `https://eapi.binance.com/eapi/v1/${cleanPath}${qs ? '?' + qs : ''}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.status(response.status).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
