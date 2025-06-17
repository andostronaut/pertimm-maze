<script lang="ts">
	import { position } from '$lib/stores/position';

	export let mapsLoading: boolean;
	export let maps: Array<{ x: number; y: number; move: string; value: string }>;
</script>

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
