import { API_BASE_URL } from '$env/static/private';

export const GET = async ({ cookies }) => {
	const player = cookies.get('player');

	if (!player) {
		return new Response(JSON.stringify({ error: { message: 'Player not found in cookies' } }), {
			status: 400
		});
	}

	const response = await fetch(`${API_BASE_URL}/${player}/discover/`, {
		method: 'GET'
	});

	if (!response.ok) {
		return new Response(JSON.stringify({ error: { message: 'Failed to discover' } }), {
			status: 400
		});
	}

	const data = await response.json();

	return new Response(JSON.stringify(data), { status: 200 });
};
