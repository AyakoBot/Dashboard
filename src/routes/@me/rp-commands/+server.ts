import { PUBLIC_API } from '$env/static/public';
import type { RequestHandler } from '@sveltejs/kit';

export const PATCH: RequestHandler = async (req) => {
	const res = await fetch(`${PUBLIC_API}/@me/rp`, {
		headers: {
			Authorization: `Bearer ${req.cookies.get('discord-token')}`,
			'Content-Type': 'application/json',
		},
		body: await req.request.text(),
		method: 'PATCH',
	});

	return res;
};
