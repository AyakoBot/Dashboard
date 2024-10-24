<script lang="ts">
	import '$lib/scripts/index.js';
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';
	import GuildBar from '$lib/components/layout/GuildBar.svelte';

	const { data, children }: { data: LayoutData; children: Snippet } = $props();
</script>

<div id="main" class="flex flex-row justify-start items-start bg-main-dark relative text-poppins">
	<GuildBar {data} />

	<div class="m-auto">
		{@render children()}
	</div>
</div>
