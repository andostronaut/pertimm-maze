<script lang="ts">
	import { onMount } from 'svelte';

	import Legend from '../components/legend.svelte';

	import { getCellColor } from '$lib';
	import { position, updatePosition } from '$lib/stores/position';

	import type { DiscoverMaps } from '$lib/types';

	let mapsLoading = $state(false);
	let maps = $state<DiscoverMaps>([]);
	let moveInProgress = $state(false);
	let moveHistory = $state<string[]>([]);

	const moveUp = async () => await makeMove($position.x, $position.y - 1, 'up');
	const moveDown = async () => await makeMove($position.x, $position.y + 1, 'down');
	const moveLeft = async () => await makeMove($position.x - 1, $position.y, 'left');
	const moveRight = async () => await makeMove($position.x + 1, $position.y, 'right');

	const restartGame = async (message: string) => {
		alert(message);

		await fetch('/api/restart', { method: 'GET' });
		updatePosition(0, 0);
		window.location.reload();
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

		if (result.dead) {
			moveInProgress = false;
			await restartGame('You have fallen into a trap! Game over.');
			return;
		}

		if (result.win) {
			moveInProgress = false;
			await restartGame('Congratulations! You have reached the goal!');
			return;
		}

		updatePosition(result.position_x, result.position_y);
		moveHistory = [...moveHistory, direction];

		await discoverMaps();

		moveInProgress = false;
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
			className: `p-4 text-2xl font-black border-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] 
				${isWall ? 'bg-red-200 text-gray-500 cursor-not-allowed' : 'bg-yellow-400 hover:bg-yellow-300 hover:translate-y-1 hover:shadow-[4px_3px_0px_0px_rgba(0,0,0,1)] transition-all'}`
		};
	};

	let upStyle = $derived(getMoveStyle('up'));
	let downStyle = $derived(getMoveStyle('down'));
	let leftStyle = $derived(getMoveStyle('left'));
	let rightStyle = $derived(getMoveStyle('right'));

	onMount(() => {
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

			<div class="mb-6 flex items-center justify-center">
				<div class="border-4 border-black bg-yellow-100 p-4">
					<span class="text-lg font-bold">MOVES: {moveHistory.length}</span>
				</div>
			</div>

			<div class="mb-8 grid grid-cols-1 gap-6">
				<div class="border-4 border-black bg-gray-100 p-4">
					<h2 class="mb-4 text-2xl font-black">MAP</h2>

					{#if mapsLoading}
						<div class="flex h-[340px] items-center justify-center">
							<span class="text-xl font-bold">Loading map...</span>
						</div>
					{:else}
						<div class="overflow-auto border-2 border-black p-2">
							<div class="mx-auto grid w-fit grid-cols-3 gap-0">
								{#each Array(3) as _, rowIndex}
									{#each Array(3) as _, colIndex}
										{@const x = $position.x - 1 + colIndex}
										{@const y = $position.y - 1 + rowIndex}
										{@const mapCell = maps.find((m) => m.x === x && m.y === y)}
										{@const isCurrentPosition = x === $position.x && y === $position.y}

										<div
											class={`h-[50px] w-[50px] border border-black ${mapCell ? getCellColor(mapCell.value) : $position.x === 0 && $position.y === 0 ? 'bg-white' : 'bg-gray-500'} ${isCurrentPosition ? 'relative' : ''}`}
											title={mapCell
												? `${mapCell.value} at (${x}, ${y})`
												: `Unknown at (${x}, ${y})`}
										>
											{#if isCurrentPosition}
												<div class="absolute inset-0 flex items-center justify-center bg-white">
													<div class="h-6 w-6 rounded-full bg-black"></div>
												</div>
											{/if}
										</div>
									{/each}
								{/each}
							</div>
						</div>
					{/if}
				</div>

				<div class="border-4 border-black bg-gray-100 p-4">
					<h2 class="mb-4 text-2xl font-black">CONTROLS</h2>

					<div class="flex items-center justify-center gap-8 p-4">
						<div class="flex items-center justify-center gap-8">
							<button class={upStyle.className} onclick={moveUp} disabled={moveInProgress}>
								↑
							</button>
							<button class={downStyle.className} onclick={moveDown} disabled={moveInProgress}>
								↓
							</button>
						</div>

						<div class="flex items-center justify-center gap-8">
							<button class={leftStyle.className} onclick={moveLeft} disabled={moveInProgress}>
								←
							</button>
							<button class={rightStyle.className} onclick={moveRight} disabled={moveInProgress}>
								→
							</button>
						</div>
					</div>
				</div>
			</div>
			<Legend />
		</div>
	</div>
</div>
