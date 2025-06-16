import { redirect } from '@sveltejs/kit';

export const load = async ({ cookies }) => {
	if (cookies.get('player')) {
		redirect(302, '/');
	}
};
