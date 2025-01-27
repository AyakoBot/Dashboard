import makeRequest from '$lib/scripts/util/makeRequest';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
	const shortURLs = await makeRequest({ method: 'GET', path: '/@me/short-urls' }, {}, event.fetch);

	if (!shortURLs) return { shortURLs: [] };
	return { shortURLs };
};
