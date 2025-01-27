import { PUBLIC_API } from '$env/static/public';
import makeRequest from '$lib/scripts/util/makeRequest';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (req) => {
	const guildsRes = await makeRequest({ method: 'GET', path: '/@me/guilds' }, {}, req.fetch);

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
