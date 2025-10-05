import { PUBLIC_API, PUBLIC_HOSTNAME } from '$env/static/public';
import type { Returned as GETLogin } from '@ayako/server/src/routes/login/+server.ts';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
 await event.parent();

 const code = event.url.searchParams.get('code');
 const userId = event.cookies.get('discord-id');

 if (!code && userId) redirect(307, '/');
 if (!code) return;

 const state = event.url.searchParams.get('state');

 const res = await event.fetch(
 `${PUBLIC_API.split(/\//g)
  .filter((p) => !!p.length)
  .slice(0, 2)
  .join('//')}/login${state ? `?state=${state}&` : '?'}redirect_uri=${PUBLIC_HOSTNAME}/login`,
 {
  headers: { Authorization: `Bearer ${code}` },
 },
 );

 if (!res.ok) throw redirect(307, '/login');

 const json = (await res.json()) as GETLogin;

 const basicCookieOptions: Parameters<typeof event.cookies.set>[2] = {
 expires: new Date(Date.now() + json.expires * 1000),
 path: '/',
 maxAge: json.expires,
 sameSite: 'strict',
 httpOnly: false,
 secure: PUBLIC_HOSTNAME.includes('https'),
 };

 event.cookies.set('discord-id', json.id, basicCookieOptions);
 event.cookies.set('discord-username', json.username, basicCookieOptions);
 event.cookies.set('discord-avatar', json.avatar, basicCookieOptions);
 event.cookies.set('discord-token', json.access_token, basicCookieOptions);

 throw redirect(307, '/?reload=true');
};
