<script lang="ts">
	import SettingsButton from '$lib/components/generic/SettingsButton.svelte';
	import type { Snippet } from 'svelte';

	const { children }: { children: Snippet } = $props();
</script>

<div class="h-100vh w-full flex flex-row justify-start items-start">
	<section
		class="bg-main-dark h-100vh w-50 box-shadow-main self-start flex flex-col justify-start items-start p-2 mr-2 of-y-auto"
	>
		<h1 class="font-bold color-main-text text-2xl pl-2">User Settings</h1>
		<hr class="bg-main-darker rounded-full w-full h-0.5 z-5 my-1 b-none" />
		<SettingsButton text="Short URLs" href="/@me/short-urls" />
		<SettingsButton text="RP Commands" href="/@me/rp-commands" />
		<SettingsButton text="Blocked Users" href="/@me/blocked-users" />
		<SettingsButton text="Reminders" href="/@me/reminders" />
		<SettingsButton text="Access Token" href="/@me/bot" />
	</section>

	<section class="w-[calc(100%-200px)]">
		{@render children()}
	</section>
</div>
