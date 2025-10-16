import { PUBLIC_FORWARD } from '$env/static/public';
import type { EndpointArgMap, EndpointMap } from '../index.js';

const makeRequest = async <
 M extends keyof EndpointMap,
 P extends keyof EndpointMap[M] & keyof EndpointArgMap
>(
 body: {
  method: M;
  path: P;
 } & Record<string, unknown>,
 replaceArgs: Record<EndpointArgMap[P], string> & { query?: string },
 fetchFn: typeof fetch
): Promise<EndpointMap[M][P] | null> => {
 const r = await fetchFn(PUBLIC_FORWARD, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
   method: body.method,
   path: `${body.path.replace(/:(\w+)/g, (_, k) => replaceArgs[k as keyof typeof replaceArgs] ?? '')}${replaceArgs.query ? `?${replaceArgs.query}` : ''}`,
   body: Object.entries(body).reduce((acc, [k, v]) => {
    if (k === 'method' || k === 'path') return acc;
    (acc as Record<string, unknown>)[k] = v;
    return acc;
   }, {})
  })
 }).catch((err) => {
  console.error('Fetch error:', err);
  return null;
 });

 if (!r) return null;

 const text = await r.text().catch(() => '');

 if (r.ok) {
  console.log(`${body.method} ${body.path} responded with: ${r.status}`);
  if (!text) return null;
  return JSON.parse(text) as EndpointMap[M][P] | null;
 }

 const e = new Error(text);
 e.cause = `${body.method} ${body.path}`;
 console.log(e.cause, e.message);
 console.log(e.stack);
 return null;
};

export default makeRequest;
