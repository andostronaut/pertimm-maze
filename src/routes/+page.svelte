<script lang="ts">
	import { onMount } from 'svelte';
	import { position, updatePosition } from '$lib/stores/position';

	let { data } = $props();
	let mapsLoading = $state(false);

	const moveUp = async () => await makeMove($position.x, $position.y - 1);
	const moveDown = async () => await makeMove($position.x, $position.y + 1);
	const moveLeft = async () => await makeMove($position.x - 1, $position.y);
	const moveRight = async () => await makeMove($position.x + 1, $position.y);

	console.log('data', data);

	const discoverMaps = async () => {
		mapsLoading = true;
		const response = await fetch('/api/discover', { method: 'GET' });
		const maps = await response.json();
		mapsLoading = false;

		console.log('Maps discovered:', maps);
	};

	const makeMove = async (x: number, y: number) => {
		const response = await fetch('/api/move', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				position_x: x,
				position_y: y
			})
		});

		const result = await response.json();
		updatePosition(result.position_x, result.position_y);
	};

	$effect(() => {
		discoverMaps();
	});
</script>

<div class="p-4">
	<h1 class="mb-4 text-2xl font-bold">Maze Game</h1>

	<div class="mb-4">
		<p>Current position: ({$position.x}, {$position.y})</p>
	</div>

	<div class="mb-4 grid w-36 grid-cols-3 gap-2">
		<div></div>
		<button class="bg-blue-500 p-2 text-white" on:click={moveUp}>↑</button>
		<div></div>
		<button class="bg-blue-500 p-2 text-white" on:click={moveLeft}>←</button>
		<div></div>
		<button class="bg-blue-500 p-2 text-white" on:click={moveRight}>→</button>
		<div></div>
		<button class="bg-blue-500 p-2 text-white" on:click={moveDown}>↓</button>
		<div></div>
	</div>
</div>
