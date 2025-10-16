import { PUBLIC_HOSTNAME } from '$env/static/public';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
 const basicCookieOptions: Parameters<typeof event.cookies.delete>[1] = {
  path: '/',
  sameSite: 'strict',
  httpOnly: false,
  secure: PUBLIC_HOSTNAME.includes('https')
 };

 event.cookies.delete('discord-id', basicCookieOptions);
 event.cookies.delete('discord-username', basicCookieOptions);
 event.cookies.delete('discord-avatar', basicCookieOptions);
 event.cookies.delete('discord-token', basicCookieOptions);
};
