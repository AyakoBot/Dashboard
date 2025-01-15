import { PUBLIC_API } from '$env/static/public';
import type { RequestHandler } from '@sveltejs/kit';

export const PATCH: RequestHandler = async (req) =>
	fetch(`${PUBLIC_API}/@me/rp`, {
		headers: {
			Authorization: `Bearer ${req.cookies.get('discord-token')}`,
			'Content-Type': 'application/json',
		},
		body: await req.request.text(),
		method: 'PATCH',
	});

export const DELETE: RequestHandler = async (req) =>
	fetch(`${PUBLIC_API}/@me/rp`, {
		headers: {
			Authorization: `Bearer ${req.cookies.get('discord-token')}`,
			'Content-Type': 'application/json',
		},
		body: await req.request.text(),
		method: 'DELETE',
	});

export const POST: RequestHandler = async (req) =>
	fetch(`${PUBLIC_API}/@me/rp`, {
		headers: {
			Authorization: `Bearer ${req.cookies.get('discord-token')}`,
			'Content-Type': 'application/json',
		},
		body: await req.request.text(),
		method: 'DELETE',
	});
