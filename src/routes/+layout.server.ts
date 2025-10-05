import makeRequest from '$lib/scripts/util/makeRequest';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (req) => {
 const guildsRes = await makeRequest({ method: 'GET', path: '/@me/guilds' }, {}, req.fetch);

 const id = req.cookies.get('discord-id');
 const username = req.cookies.get('discord-username');
 const avatar = req.cookies.get('discord-avatar');
 const token = req.cookies.get('discord-token');
 const isDev = !!req.cookies.get('is-dev');

 const user = token && username && id 
  ? { username, avatar: avatar || null, id, hasSeenWelcome: false } 
  : null;

 return {
  guilds: guildsRes || [],
  user,
  isDev,
 };
};
