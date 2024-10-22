<script lang="ts">
	import '$lib/scripts/index.js';
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';
	import Guild from '$lib/components/layout/guild.svelte';
	import { PermissionFlagsBits } from 'discord-api-types/v10';

	const { data, children }: { data: LayoutData; children: Snippet } = $props();

	let nameContainer: HTMLDivElement | null = null;
	let name = $state<string | null>(null);

	const showName = (e: { y: number; name: string }) => {
		if (!nameContainer) return;

		name = e.name;
		nameContainer.style.top = `${e.y + 28}px`;
	};

	const hideName = (e: { name: string }) => {
		if (!nameContainer) return;
		if (e.name !== name) return;
		name = null;
	};

	const canManage = (permissions: bigint) =>
		(permissions & PermissionFlagsBits.ManageGuild) === PermissionFlagsBits.ManageGuild;
</script>

<div id="main" class="flex flex-row justify-start items-start bg-main-dark relative">
	<section
		id="guild-bar"
		class="bg-main-darker flex flex-col justify-start items-center gap-2 p-2 h-100lvh box-shadow-main of-y-scroll of-auto hide-scrollbar"
	>
		<div class="max-w-15">
			<Guild src="favicon.png" name="My Settings" size={40} id="favicon" bg />
		</div>

		<hr class="border-t-1 border-main-dark rounded-full w-65% box-shadow-main" />

		{#each data.guilds as guild}
			<Guild
				src={guild.icon ?? undefined}
				id={guild.id}
				name={guild.name}
				on:hover={(e) => showName(e.detail)}
				on:unhover={(e) => hideName(e.detail)}
			/>
		{/each}
	</section>

	<div
		bind:this={nameContainer}
		class="{name
			? ''
			: 'hidden'} absolute bg-main-darkest left-20 top-50% -translate-y-50% w-fit max-w-20lvw rounded-[5px] border-alt-text border-op-50 border-0.1px border-solid px-3 py-1 text-truncate box-shadow-main font-bold"
	>
		{name}
	</div>

	{@render children()}
</div>
