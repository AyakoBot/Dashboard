<script lang="ts">
	import '$lib/scripts/index.js';
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';
	import Guild from '$lib/components/layout/guild.svelte';

	const { data, children }: { data: LayoutData; children: Snippet } = $props();
</script>

<div id="main" class="flex flex-row justify-start items-start bg-main-dark">
	<section
		id="guild-bar"
		class="bg-main-darker flex flex-col justify-start items-center gap-2 p-1 h-100lvh box-shadow-main"
	>
		<div class="max-w-15">
			<Guild src="favicon.png" name="My Settings" size={40} bg />
		</div>

		<hr class="border-t-1 border-main-dark rounded-full w-65% box-shadow-main" />

		{#each data.guilds as guild}
			<Guild src={guild.icon} name={guild.name} />
		{/each}
	</section>

	{@render children()}
</div>
