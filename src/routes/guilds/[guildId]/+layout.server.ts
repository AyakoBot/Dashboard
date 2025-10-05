import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ params, parent }) => {
	const { guilds } = await parent();
	
	if (!guilds || guilds.length === 0) {
		throw error(401, {
			message: 'Not authenticated',
			code: 'UNAUTHORIZED'
		});
	}
	
	const guild = guilds.find((g: any) => g.id === params.guildId);
	
	if (!guild) {
		throw error(404, {
			message: 'Server not found',
			code: 'GUILD_NOT_FOUND'
		});
	}
	
	// Check if user has ManageGuild permission
	const canManage = (permissions: string | undefined) => {
		if (!permissions) return false;
		const perms = BigInt(permissions);
		const ManageGuild = 0x0000000020n;
		return (perms & ManageGuild) === ManageGuild;
	};
	
	if (!canManage(guild.permissions)) {
		throw error(403, {
			message: 'You do not have permission to manage this server',
			code: 'MISSING_PERMISSIONS'
		});
	}
	
	return {
		guild
	};
};