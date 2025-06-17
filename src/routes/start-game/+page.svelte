<script lang="ts">
	import { goto } from '$app/navigation';
	import { updatePosition } from '$lib/stores/position';

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

		updatePosition(result.position_x, result.position_y);

		if (response.ok) window.location.reload();

		postStartGameLoading = false;
	};
</script>

<svelte:head>
	<title>Pertimm - Start Game</title>
</svelte:head>

<div class="min-h-screen bg-blue-100 p-6 font-mono">
	<div class="mx-auto max-w-2xl">
		<div class="mb-8 border-8 border-black bg-white p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
			<h1 class="mb-8 text-center text-6xl font-black tracking-tight">PERTIMM - MAZE</h1>

			<div class="mb-6 border-4 border-black bg-yellow-100 p-4">
				<p class="text-lg font-bold">
					Welcome to the Pertimm - Maze! Enter your name to start exploring.
				</p>
			</div>

			<div class="space-y-6">
				<div>
					<label for="player" class="mb-4 block text-2xl font-black">PLAYER NAME:</label>
					<input
						type="text"
						id="player"
						name="player"
						class="w-full rounded-none border-4 border-black bg-white p-4 text-2xl font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:border-black focus:ring-0"
						placeholder="ENTER YOUR NAME"
						bind:value={player}
						disabled={postStartGameLoading}
					/>
				</div>
				<button
					type="button"
					class="w-full rounded-none border-4 border-black bg-yellow-400 p-6 text-3xl font-black text-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-y-1 hover:bg-yellow-300 hover:shadow-[8px_7px_0px_0px_rgba(0,0,0,1)] disabled:bg-gray-300 disabled:shadow-none"
					disabled={postStartGameLoading}
					onclick={postStartGame}
				>
					{postStartGameLoading ? 'LOADING...' : 'START GAME'}
				</button>
			</div>

			<div
				class="mt-8 border-4 border-black bg-blue-200 p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
			>
				<h2 class="mb-2 text-xl font-black">HOW TO PLAY:</h2>
				<ul class="list-disc space-y-2 pl-6">
					<li class="font-bold">Navigate through the maze using direction buttons</li>
					<li class="font-bold">Discover hidden treasures</li>
					<li class="font-bold">Find the exit to win the game</li>
					<li class="font-bold">Avoid walls and dead ends</li>
				</ul>
			</div>
		</div>
	</div>
</div>
