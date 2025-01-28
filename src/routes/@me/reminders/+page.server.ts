import makeRequest from '$lib/scripts/util/makeRequest';
import type { Actions } from '@sveltejs/kit';
import type { PageServerLoad } from '../$types';

export const load: PageServerLoad = async (event) => {
	const reminders = await makeRequest({ method: 'GET', path: '/@me/reminders' }, {}, event.fetch);

	return { reminders };
};

export const actions = {
	reminder: async (event) => {
		const formData = await event.request.formData();

		const date = formData.get('date') as string;
		const time = formData.get('time') as string;
		const reason = formData.get('reason') as string;

		makeRequest(
			{
				method: 'POST',
				path: '/reminders',
				content: reason,
				endtime: new Date(`${date}T${time}:00.000Z`).getTime(),
			},
			{},
			event.fetch,
		);
	},
} satisfies Actions;
