import interactions from '@ayako/bot/src/BaseClient/Other/constants/interactions';
import type { PageServerLoad } from './$types';
import { PUBLIC_API } from '$env/static/public';
import type { Returned as GETrp } from '@ayako/server/src/routes/v1/@me/rp/+server.js';

export const load: PageServerLoad = async (event) => {
	const allCommands = [...new Set(interactions.map((i) => i.aliasOf))].map((i) => ({
		name: i,
		aliases: [...new Set(interactions.filter((x) => x.aliasOf === i).map((x) => x.name))],
	}));

	const singleCommands = allCommands.filter((i) => !i.name);
	singleCommands.forEach((i) => {
		i.aliases
			.filter((a) => !allCommands.find((x) => x.name === a))
			.forEach((a) => allCommands.push({ name: a, aliases: [] }));
	});

	const commands = allCommands
		.filter(
			(i): i is { name: string; aliases: string[] } =>
				!i.aliases.some((a) => singleCommands.find((x) => x.name === a)) && !!i.name,
		)
		.sort((a, b) => a.name.localeCompare(b.name));

	const baseStates = await fetch(`${PUBLIC_API}/@me/rp`, {
		headers: { Authorization: `Bearer ${event.cookies.get('discord-token')}` },
	}).then((r) => (r.status === 200 ? (r.json() as Promise<GETrp>) : null));

	return {
		commands,
		baseStates,
	};
};
