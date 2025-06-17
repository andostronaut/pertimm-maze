export const GET = async ({ cookies }) => {
	try {
		cookies.delete('player', { path: '/' });
		return new Response(JSON.stringify({ message: 'Game has been reset' }), { status: 200 });
	} catch (error) {
		console.error('Failed to reset game:', error);
		return new Response(JSON.stringify({ error: { message: 'Failed to reset game' } }), {
			status: 500
		});
	}
};
