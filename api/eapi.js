export const config = {
  runtime: 'edge'
};

export default async function handler(req) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': '*'
  };
  if (req.method === 'OPTIONS') return new Response(null, { status: 200, headers: corsHeaders });

  const url = new URL(req.url);
  const path = (url.searchParams.get('path') || '').replace(/^\//, '');
  url.searchParams.delete('path');
  const qs = url.searchParams.toString();
  const target = 'https://eapi.binance.com/eapi/v1/' + path + (qs ? '?' + qs : '');

  try {
    const resp = await fetch(target);
    const body = await resp.arrayBuffer();
    const respHeaders = { ...corsHeaders };
    if (resp.headers.get('content-type')) respHeaders['Content-Type'] = resp.headers.get('content-type');
    return new Response(body, { status: resp.status, headers: respHeaders });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}
