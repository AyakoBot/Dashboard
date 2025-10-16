import { PUBLIC_HOSTNAME, PUBLIC_ID } from '$env/static/public';
import { redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types.js';

const baseLoginURL = `https://discord.com/oauth2/authorize?client_id=${PUBLIC_ID}&response_type=code&redirect_uri=${PUBLIC_HOSTNAME}%2Flogin&scope=`;
const mandatoryScopes = ['identify', 'guilds'];

export const load: PageServerLoad = async ({ parent }) => {
 const parentData = await parent();

 return {
  user: parentData.user,
  reminders: [],
  shortUrls: [],
  rpCommands: []
 };
};

export const actions = {
 login: async (event) => {
  const formData = await event.request.formData();
  const formJSON: { [key: string]: boolean } = {};
  formData.forEach((val, k) => (formJSON[k] = val.toString() === 'on'));

  const acceptedScopes = Object.entries(formJSON)
   .filter(([k, v]) => !!v)
   .map(([k]) => k);

  throw redirect(307, `${baseLoginURL}${[...mandatoryScopes, ...acceptedScopes].join('+')}`);
 }
} satisfies Actions;
