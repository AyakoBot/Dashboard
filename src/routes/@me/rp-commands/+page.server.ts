import makeRequest from '$lib/scripts/util/makeRequest';
import interactions from '@ayako/bot/src/BaseClient/Other/constants/interactions';
import type { PageServerLoad } from './$types';

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

	const baseStates = await makeRequest({ method: 'GET', path: '/@me/rp' }, {}, event.fetch);
	const stateMap = new Map<string, { command: string; users: Set<string> }>();

	baseStates?.forEach((s) => {
		s.commands.forEach((c) => {
			if (stateMap.has(c)) stateMap.get(c)?.users.add(s.user);
			else stateMap.set(c, { command: c, users: new Set([s.user]) });
		});
	});

	const allIds = new Set<string>();
	stateMap.forEach((s) => s.users.forEach((u) => (u !== '0' ? allIds.add(u) : undefined)));

	const users = await makeRequest(
		{ method: 'PUT', path: '/users/find-many', userIds: [...allIds] },
		{},
		event.fetch,
	);

	return {
		commands,
		stateMap,
		users: [...allIds].map((id) => users?.find((u) => u.id === id) || { id }),
	};
};
