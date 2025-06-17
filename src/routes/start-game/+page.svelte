<script lang="ts">
	import { goto } from '$app/navigation';

	let player = $state('');
	let postStartGameLoading = $state(false);

	const postStartGame = async () => {
		if (!player) {
			alert('Please enter your name to start the game.');
			return;
		}

		const data = { player };

		postStartGameLoading = true;

		const response = await fetch('/api/start-game', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		});

		const result = await response.json();

		console.log('Start Game Response:', result);

		if (response.ok) goto('/');

		postStartGameLoading = false;
	};
</script>

<svelte:head>
	<title>Pertimm - Start Game</title>
</svelte:head>

<div class="bg-gray-100 p-4 font-mono">
	<div class="mx-auto max-w-2xl">
		<div class="mb-8 border-8 border-black bg-white p-8">
			<h1 class="mb-8 text-center text-6xl font-black tracking-tight">MAZE GAME</h1>
			<div class="space-y-6">
				<div>
					<label for="player" class="mb-4 block text-2xl font-black">PLAYER NAME:</label>
					<input
						type="text"
						id="player"
						name="player"
						class="w-full rounded-none border-4 border-black bg-white p-4 text-2xl font-black focus:border-black focus:ring-0"
						placeholder="ENTER YOUR NAME"
						bind:value={player}
						disabled={postStartGameLoading}
					/>
				</div>
				<button
					type="button"
					class="w-full rounded-none border-4 border-black bg-yellow-400 p-6 text-3xl font-black text-black hover:bg-yellow-300 disabled:bg-gray-300"
					disabled={postStartGameLoading}
					onclick={postStartGame}
				>
					{postStartGameLoading ? 'LOADING...' : 'START GAME'}
				</button>
			</div>
		</div>
	</div>
</div>
