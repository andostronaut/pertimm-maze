import { API_BASE_URL } from '$env/static/private';

export const POST = async ({ cookies, request }) => {
	const body = await request.json();
	const params = new URLSearchParams();

	params.append('player', body.player);

	const response = await fetch(`${API_BASE_URL}/start-game/`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body: params.toString()
	});

	if (!response.ok) {
		console.error('Failed to start game:', response);
		return new Response(JSON.stringify({ error: { message: 'Failed to start game' } }), {
			status: 400
		});
	}

	const data = await response.json();
	cookies.set('player', data.player, {
		httpOnly: true,
		path: '/',
		maxAge: 60 * 60 * 24
	});

	return new Response(
		JSON.stringify({ message: `Game started for player ${data.player}.`, data }),
		{
			status: 200
		}
	);
};
