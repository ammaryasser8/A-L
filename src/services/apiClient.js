let csrfToken = null;

async function request(path, options = {}) {
  const method = options.method || 'GET';
  const headers = { Accept: 'application/json', ...(options.headers || {}) };
  if (options.body && !(options.body instanceof FormData)) headers['Content-Type'] = 'application/json';
  if (!['GET', 'HEAD', 'OPTIONS'].includes(method) && csrfToken) headers['X-CSRF-Token'] = csrfToken;
  const response = await fetch(`/api${path}`, { credentials: 'include', ...options, headers });
  const data = response.status === 204 ? null : await response.json().catch(() => null);
  if (!response.ok) { const error = new Error(data?.error || 'Request failed.'); error.status = response.status; throw error; }
  return data;
}

export async function getCsrfToken() { const data = await request('/auth/csrf'); csrfToken = data.csrfToken; return csrfToken; }
export function setCsrfToken(token) { csrfToken = token || null; }
export async function api(path, options = {}) { if (!['GET', 'HEAD', 'OPTIONS'].includes(options.method || 'GET') && !csrfToken) await getCsrfToken(); return request(path, options); }
