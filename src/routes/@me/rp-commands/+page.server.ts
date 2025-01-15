import interactions from '@ayako/bot/src/BaseClient/Other/constants/interactions';
import type { PageServerLoad } from './$types';
import { PUBLIC_API } from '$env/static/public';
import type { Returned as GETrp } from '@ayako/server/src/routes/v1/@me/rp/+server.js';
import type { Returned as GETUsers } from '@ayako/server/src/routes/v1/users/find-many/+server.js';

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

	const baseStates = await event
		.fetch(`${PUBLIC_API}/@me/rp`, {
			headers: { Authorization: `Bearer ${event.cookies.get('discord-token')}` },
		})
		.then((r) => (r.status === 200 ? (r.json() as Promise<GETrp>) : null));

	const stateMap = new Map<string, { command: string; users: Set<string> }>();

	baseStates?.forEach((s) => {
		s.commands.forEach((c) => {
			if (stateMap.has(c)) stateMap.get(c)?.users.add(s.user);
			else stateMap.set(c, { command: c, users: new Set([s.user]) });
		});
	});

	const allIds = new Set<string>();
	stateMap.forEach((s) => s.users.forEach((u) => (u !== '0' ? allIds.add(u) : undefined)));

	const users = await event
		.fetch(`${PUBLIC_API}/users/find-many`, {
			method: 'PUT',
			headers: {
				Authorization: `Bearer ${event.cookies.get('discord-token')}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ userIds: [...allIds] }),
		})
		.then((r) => (r.status === 200 ? (r.json() as Promise<GETUsers>) : null));

	return {
		commands,
		stateMap,
		users: [...allIds].map((id) => users?.find((u) => u.id === id) || { id }),
	};
};
