<script lang="ts">
	import SettingsButton from '$lib/components/generic/SettingsButton.svelte';
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';
	import { page } from '$app/state';

	const { children, data }: { children: Snippet; data: LayoutData } = $props();
	const guild = data.guilds?.find((g) => g.id === page.params.guildId);
	const baseURL = `/guilds/${page.params.guildId}`;
</script>

<div class="h-100vh w-full flex flex-row justify-start items-start overflow-hidden">
	<section
		class="bg-main-dark h-100vh w-50 box-shadow-main self-start flex flex-col justify-start items-start p-2 mr-2 overflow-y-auto"
	>
		<h1 class="font-bold color-main-text text-md pl-2">
			{guild?.name.slice(0, 20)}{Number(guild?.name.length) > 20 ? '...' : ''}
		</h1>
		<hr class="bg-main-darker rounded-full w-full h-0.5 z-5 my-1 b-none" />

		<SettingsButton text="Home" href={baseURL} />
		<hr class="bg-main-darker rounded-full w-full h-0.5 z-5 my-1 b-none" />

		<h2 class="text-xs color-alt-text">Basic Settings</h2>
  <SettingsButton text="Basic Settings" href="{baseURL}/basic" />
		<SettingsButton text="Log-Channels" href="{baseURL}/logs" />
		<hr class="bg-main-darker rounded-full w-full h-0.5 z-5 my-1 b-none" />

		<SettingsButton text="Access Token" href="/@me/bot" />

		{#if data.isDev}
			<h1 class="font-bold color-main-text text-2xl pl-2 mt-5">Dev Settings</h1>
			<hr class="bg-main-darker rounded-full w-full h-0.5 z-5 my-1 b-none" />

			<SettingsButton text="Design Systems" href="/@me/designs" />
		{/if}
	</section>

	<section class="w-[calc(100%-200px)] overflow-y-scroll h-100vh hide-scrollbar">
		{@render children()}
	</section>
</div>
