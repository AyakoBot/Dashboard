<script lang="ts">
	import SettingsButton from '$lib/components/generic/SettingsButton.svelte';
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';

	const { children, data }: { children: Snippet; data: LayoutData } = $props();
</script>

<div class="h-100vh w-full flex flex-row justify-start items-start overflow-hidden">
	<section
		class="bg-main-dark h-100vh w-50 box-shadow-main self-start flex flex-col justify-start items-start p-2 mr-2 overflow-y-auto"
	>
		<h1 class="font-bold color-main-text text-2xl pl-2">User Settings</h1>
		<hr class="bg-main-darker rounded-full w-full h-0.5 z-5 my-1 b-none" />

		<SettingsButton text="Short URLs" href="/@me/short-urls" />
		<SettingsButton text="RP & Blocks" href="/@me/rp-commands" />
		<SettingsButton text="Reminders" href="/@me/reminders" />
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
