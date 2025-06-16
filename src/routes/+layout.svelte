<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>

<div class="flex min-h-screen items-center justify-center bg-white p-6">
	{@render children()}
</div>
