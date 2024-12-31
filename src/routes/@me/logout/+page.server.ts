import { PUBLIC_HOSTNAME } from '$env/static/public';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const basicCookieOptions: Parameters<typeof event.cookies.set>[2] = {
		path: '/',
		domain: PUBLIC_HOSTNAME.replace('https://', ''),
		sameSite: 'strict',
		httpOnly: false,
		secure: true,
	};

	event.cookies.delete('discord-id', basicCookieOptions);
	event.cookies.delete('discord-username', basicCookieOptions);
	event.cookies.delete('discord-avatar', basicCookieOptions);
	event.cookies.delete('discord-token', basicCookieOptions);
};
