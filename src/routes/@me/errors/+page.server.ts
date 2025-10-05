import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	// Check if we need to trigger an error
	const errorCode = url.searchParams.get('trigger');
	const errorMessage = url.searchParams.get('message');
	
	if (errorCode) {
		const code = parseInt(errorCode);
		if (!isNaN(code) && code >= 100 && code <= 599) {
			throw error(code, {
				message: errorMessage || `This is a simulated ${code} error for testing purposes.`
			});
		}
	}
	
	return {};
};