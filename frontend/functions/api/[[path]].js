// Cloudflare Pages Function: proxy /api/* requests to the Worker backend
// Decodes the Access JWT to extract the authenticated user email,
// then forwards it to the Worker via a header.

function getEmailFromJWT(jwt) {
  try {
    const parts = jwt.split('.');
    if (parts.length !== 3) return null;
    // Base64url decode the payload
    const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const decoded = atob(payload);
    const data = JSON.parse(decoded);
    return data.email || null;
  } catch {
    return null;
  }
}

export async function onRequest(context) {
  const url = new URL(context.request.url);

  // Get email from Access JWT
  const jwt = context.request.headers.get('cf-access-jwt-assertion');
  const email = jwt ? getEmailFromJWT(jwt) : null;

  // Debug endpoint: show what we're getting
  if (url.pathname === '/api/debug-headers') {
    return new Response(JSON.stringify({ email, hasJWT: !!jwt }, null, 2), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const targetUrl = `https://pipeline-backend.office-a21.workers.dev${url.pathname}${url.search}`;

  // Build headers for the outbound request to the Worker
  const headers = new Headers();
  headers.set('Content-Type', context.request.headers.get('Content-Type') || 'application/json');

  // Forward the authenticated email so the Worker can identify the user
  if (email) {
    headers.set('Cf-Access-Authenticated-User-Email', email);
    headers.set('X-Access-User-Email', email);
  }

  const response = await fetch(targetUrl, {
    method: context.request.method,
    headers,
    body: context.request.method !== 'GET' && context.request.method !== 'HEAD'
      ? context.request.body
      : undefined,
  });

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
  });
}
