import { PUBLIC_API } from '$env/static/public';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import z from 'zod';

const Body = z.object({
 method: z
 .literal('PATCH')
 .or(z.literal('DELETE'))
 .or(z.literal('POST'))
 .or(z.literal('PUT'))
 .or(z.literal('GET'))
 .optional(),
 path: z
 .string()
 .startsWith('/', { message: 'Invalid path format (1)' })
 .regex(/^\/(?:[a-zA-Z0-9\-_@]+(?:\/[a-zA-Z0-9\-_@]+)*)?(?:\?[a-zA-Z0-9=&\-_@]*)?$/, {
  message: 'Invalid path format (2)',
 }),
 body: z.unknown(),
});

const handler: RequestHandler = async (req) => {
 let body: string | null = null;
 let jsonBody: unknown | null = null;

 body = await req.request.text().catch(() => null);
 if (!body) return error(400, 'Invalid request format');
 jsonBody = JSON.parse(body);
 if (!jsonBody) return error(400, 'Invalid request format');

 const validBody = Body.safeParse(jsonBody);
 if (!validBody.success) {
 return error(400, 'Invalid request parameters');
 }

 const { method, path } = validBody.data;

 if (!path.startsWith('/') || path.includes('..') || path.includes('\n') || path.includes('\r')) {
 return error(400, 'Invalid path format');
 }

 const token = req.cookies.get('discord-token');
 if (!token) return error(401, 'Authentication required');

 const url = `${PUBLIC_API}${path}`;

 const response = await fetch(url, {
 headers: {
  Authorization: `Bearer ${token}`,
  'Content-Type': 'application/json',
 },
 body:
  validBody.data && (method ?? req.request.method) !== 'GET'
  ? JSON.stringify(validBody.data.body)
  : null,
 method: method ?? req.request.method,
 credentials: 'include',
 }).catch((e) => {
 console.error('Fetch error:', e);
 if (e instanceof Error && !e.message?.includes('403')) {
  console.error('API request error:', e);
 }
 return null;
 });

 if (!response) return error(500, 'Internal server error');

 if (!response.ok) {
 const responseText = await response.text();
 if (!responseText.includes('Required OAuth2 scope is missing')) {
  console.log(responseText, validBody.data.body);
 }
 return error(response.status, response.statusText);
 }

 return new Response(response.body, {
 status: response.status,
 headers: {
  'Content-Type': response.headers.get('Content-Type') ?? 'application/json',
 },
 });
};

export const POST: RequestHandler = handler;
export const PUT: RequestHandler = handler;
export const PATCH: RequestHandler = handler;
export const DELETE: RequestHandler = handler;
export const GET: RequestHandler = handler;
