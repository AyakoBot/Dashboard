import { PUBLIC_API } from '$env/static/public';
import type { LayoutServerLoad } from './$types';

import type { Returned as GETGuilds } from '@ayako/server/src/routes/v1/@me/guilds/+server.js';

export const load: LayoutServerLoad = async (req) => {
	const guildsRes = await fetch(`${PUBLIC_API}/@me/guilds`, {
		headers: { Authorization: `Bearer ${req.cookies.get('discord-token')}` },
	}).then((r) => (r.ok ? (r.json() as Promise<GETGuilds>) : []));

	const id = req.cookies.get('discord-id');
	const username = req.cookies.get('discord-username');
	const avatar = req.cookies.get('discord-avatar');
	const token = req.cookies.get('discord-token');
	const isDev = !!req.cookies.get('is-dev');

	return {
		guilds: guildsRes,
		user: token ? { username, avatar, id } : null,
		isDev,
	};
};
