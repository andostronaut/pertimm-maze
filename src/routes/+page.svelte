<script lang="ts">
	import { position, updatePosition } from '$lib/stores/position';

	type MapItem = { x: number; y: number; move: string; value: string };
	type DiscoverMaps = MapItem[];

	let mapsLoading = $state(false);
	let maps = $state<DiscoverMaps>([]);
	let moveInProgress = $state(false);
	let moveHistory = $state<string[]>([]);

	const moveUp = async () => {
		console.log('Moving up');
		await makeMove($position.x, $position.y - 1, 'up');
	};
	const moveDown = async () => {
		console.log('Moving down');
		await makeMove($position.x, $position.y + 1, 'down');
	};
	const moveLeft = async () => {
		console.log('Moving left');
		await makeMove($position.x - 1, $position.y, 'left');
	};
	const moveRight = async () => {
		console.log('Moving right');
		await makeMove($position.x + 1, $position.y, 'right');
	};

	const discoverMaps = async () => {
		mapsLoading = true;

		const response = await fetch('/api/discover', { method: 'GET' });
		const data = await response.json();
		maps = data;

		mapsLoading = false;
	};

	const makeMove = async (x: number, y: number, direction: string) => {
		if (moveInProgress) return;

		moveInProgress = true;
		console.log(`Making move to (${x}, ${y}) in direction ${direction}`);

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
		moveHistory = [...moveHistory, direction];

		await discoverMaps();

		moveInProgress = false;
	};

	const getCellColor = (value: string) => {
		if (value.includes('wall')) return 'bg-gray-500';
		if (value.includes('trap')) return 'bg-red-500';
		if (value.includes('home')) return 'bg-blue-500';
		if (value.includes('stop')) return 'bg-green-500';
		return 'bg-white';
	};

	const getMoveStyle = (direction: string) => {
		const availableMove = maps.find(
			(m) =>
				(direction === 'up' && m.y === $position.y - 1 && m.x === $position.x) ||
				(direction === 'down' && m.y === $position.y + 1 && m.x === $position.x) ||
				(direction === 'left' && m.x === $position.x - 1 && m.y === $position.y) ||
				(direction === 'right' && m.x === $position.x + 1 && m.y === $position.y)
		);

		const isWall = availableMove?.value?.includes('wall');

		return {
			disabled: moveInProgress || !availableMove || isWall,
			className: `p-4 text-2xl font-black border-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] 
				${isWall ? 'bg-red-200 text-gray-500 cursor-not-allowed' : 'bg-yellow-400 hover:bg-yellow-300 hover:translate-y-1 hover:shadow-[4px_3px_0px_0px_rgba(0,0,0,1)] transition-all'}`
		};
	};

	let upStyle = $derived(getMoveStyle('up'));
	let downStyle = $derived(getMoveStyle('down'));
	let leftStyle = $derived(getMoveStyle('left'));
	let rightStyle = $derived(getMoveStyle('right'));

	$effect(() => {
		discoverMaps();
	});
</script>

<svelte:head>
	<title>Pertimm - Maze</title>
</svelte:head>

<div class="min-h-screen bg-blue-100 p-6 font-mono">
	<div class="mx-auto max-w-4xl">
		<div class="mb-8 border-8 border-black bg-white p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
			<h1 class="mb-8 text-center text-6xl font-black tracking-tight">PERTIMM - MAZE</h1>

			<div class="mb-6 flex items-center justify-between">
				<div class="border-4 border-black bg-yellow-100 p-4">
					<span class="text-lg font-bold">POSITION: ({$position.x}, {$position.y})</span>
				</div>
				<div class="border-4 border-black bg-yellow-100 p-4">
					<span class="text-lg font-bold">MOVES: {moveHistory.length}</span>
				</div>
			</div>

			<div class="mb-8 grid grid-cols-1 gap-6">
				<div class="border-4 border-black bg-gray-100 p-4">
					<h2 class="mb-4 text-2xl font-black">MAP</h2>

					{#if mapsLoading}
						<div class="flex h-64 items-center justify-center">
							<span class="text-xl font-bold">Loading map...</span>
						</div>
					{:else}
						<div class="relative h-64 w-full border-2 border-black">
							{#each maps as map}
								<div
									class={`absolute border border-black ${getCellColor(map.value)}`}
									style="width: 20px; height: 20px; left: {(map.x - $position.x + 8) *
										20}px; top: {(map.y - $position.y + 8) * 20}px;"
									title="{map.value} at ({map.x}, {map.y})"
								></div>
							{/each}

							<div
								class="absolute border-2 border-black bg-red-500"
								style="width: 20px; height: 20px; left: 160px; top: 160px;"
							></div>
						</div>
					{/if}
				</div>

				<div class="border-4 border-black bg-gray-100 p-4">
					<h2 class="mb-4 text-2xl font-black">CONTROLS</h2>

					<div class="flex items-center justify-center gap-8 p-4">
						<div class="flex items-center justify-center gap-8">
							<button class={upStyle.className} onclick={moveUp} disabled={upStyle.disabled}>
								↑
							</button>

							<button class={downStyle.className} onclick={moveDown} disabled={downStyle.disabled}>
								↓
							</button>
						</div>

						<div class="flex items-center justify-center gap-8">
							<button class={leftStyle.className} onclick={moveLeft} disabled={leftStyle.disabled}>
								←
							</button>

							<button
								class={rightStyle.className}
								onclick={moveRight}
								disabled={rightStyle.disabled}
							>
								→
							</button>
						</div>
					</div>
				</div>
			</div>

			<div class="border-4 border-black bg-gray-100 p-4">
				<h2 class="mb-4 text-2xl font-black">SURROUNDINGS</h2>

				{#if mapsLoading}
					<p class="text-lg font-bold">Exploring the area...</p>
				{:else}
					<div class="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
						{#each maps.filter((m) => m.x === $position.x && m.y === $position.y) as current}
							<div class="border-2 border-black bg-blue-200 p-3">
								<span class="block font-bold">CURRENT LOCATION:</span>
								<span>{current.value}</span>
							</div>
						{/each}

						{#each maps.filter((m) => (m.x !== $position.x || m.y !== $position.y) && Math.abs(m.x - $position.x) <= 1 && Math.abs(m.y - $position.y) <= 1) as nearby}
							<div class="border-2 border-black bg-yellow-100 p-3">
								<span class="block font-bold">({nearby.x}, {nearby.y}):</span>
								<span>{nearby.value}</span>
							</div>
						{/each}
					</div>
				{/if}
			</div>

			<div class="mt-6 border-4 border-black bg-gray-100 p-4">
				<h2 class="mb-4 text-2xl font-black">LEGEND</h2>

				<div class="grid grid-cols-2 gap-2 text-sm md:grid-cols-5">
					<div class="flex items-center gap-2">
						<div class="h-6 w-6 border-2 border-black bg-gray-500"></div>
						<span class="font-black">WALL</span>
					</div>
					<div class="flex items-center gap-2">
						<div class="h-6 w-6 border-2 border-black bg-white"></div>
						<span class="font-black">PATH</span>
					</div>
					<div class="flex items-center gap-2">
						<div class="h-6 w-6 border-2 border-black bg-red-500"></div>
						<span class="font-black">TRAP</span>
					</div>
					<div class="flex items-center gap-2">
						<div class="h-6 w-6 border-2 border-black bg-green-500"></div>
						<span class="font-black">GOAL</span>
					</div>
					<div class="flex items-center gap-2">
						<div class="h-6 w-6 border-2 border-black bg-blue-500"></div>
						<span class="font-black">HOME</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
