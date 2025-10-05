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
 const startTime = formData.get('startTime') as string;
 const localDateTime = new Date(`${date}T${time}:00.000`);

 makeRequest(
  {
  method: 'POST',
  path: '/@me/reminders',
  reason,
  endTime: localDateTime.getTime(),
  startTime: Number(startTime),
  },
  {},
  event.fetch,
 );
 },
} satisfies Actions;
