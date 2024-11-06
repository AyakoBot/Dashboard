import { PUBLIC_API } from '$env/static/public';
import type { GETReturned as GETUses } from '@ayako/server/src/routes/v1/@me/short-urls/[id]/uses/+server.js';
import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async (req) => {
	const uses = await req
		.fetch(`${PUBLIC_API}/@me/short-urls/${req.params.id}/uses`, {
			headers: { Authorization: `Bearer ${req.cookies.get('discord-token')}` },
		})
		.then((r) => (r.ok ? (r.json() as Promise<GETUses>) : []));

	return json(uses);
};
