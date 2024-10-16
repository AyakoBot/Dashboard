import type { LayoutServerLoad } from './$types';
export const load: LayoutServerLoad = async () => {
	return {
		guilds: [
			{
				name: 'Animekos | Anime ❀ Social ❀ Ayako',
				icon:
					'https://cdn.discordapp.com/icons/298954459172700181/a_2a945cea66c917f525df699e08f315e6.gif',
				id: '298954459172700181',
			},
		],
	};
};
