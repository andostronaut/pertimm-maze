import { API_BASE_URL } from '$env/static/private';

export const POST = async ({ cookies, request }) => {
	const params = new URLSearchParams();
	const body = await request.json();

	const player = cookies.get('player');

	if (!player) {
		return new Response(JSON.stringify({ error: { message: 'Player not found in cookies' } }), {
			status: 400
		});
	}

	params.append('position_x', body.position_x);
	params.append('position_y', body.position_y);

	const response = await fetch(`${API_BASE_URL}/${player}/move/`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body: params.toString()
	});

	if (!response.ok) {
		return new Response(
			JSON.stringify({
				error: {
					message: 'Failed to make move',
					status: response.status
				}
			}),
			{
				status: 400
			}
		);
	}

	const data = await response.json();
	return new Response(JSON.stringify(data), { status: 200 });
};
