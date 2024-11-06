import { PUBLIC_API } from '$env/static/public';
import type { GETReturned as GETShortURLs } from '@ayako/server/src/routes/v1/@me/short-urls/+server';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
	const shortURLs = await event
		.fetch(`${PUBLIC_API}/@me/short-urls`, {
			headers: { Authorization: `Bearer ${event.cookies.get('discord-token')}` },
		})
		.then((r) => (r.ok ? (r.json() as Promise<GETShortURLs>) : []));

	return { shortURLs };
};
