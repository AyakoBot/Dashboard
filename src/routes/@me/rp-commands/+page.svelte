<script lang="ts">
	import ExplainBox from '$lib/components/generic/ExplainBox.svelte';
	import Input from '$lib/components/generic/Input.svelte';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import RPToggle from '$lib/components/layout/RPToggle.svelte';

	const { data }: { data: PageData } = $props();
	let search = $state('');

	const commandEnabled: Record<string, boolean> = $state({});

	onMount(() => {
		data.baseStates
			?.find((s) => s.user === '0')
			?.commands.forEach((c) => (commandEnabled[c] = false));
	});

	const checkChange = (name: string, state: boolean) => {
		commandEnabled[name] = state;

		fetch(`/@me/rp-commands`, {
			body: JSON.stringify({ command: name, enabled: state, userId: '0' }),
			method: 'PATCH',
		});
	};
</script>

<section class="my-2 mr-2">
	<ExplainBox headline="What is this?" text="">
		<div class="text-3">
			Here you can control what RP-Commands can be used on you. <br />
			<span class="font-bold">Be aware</span>; blocking a command will also make you unable to use it.
		</div>
	</ExplainBox>

	<Input label="Search" required={false} type="text" class="mt-2" bind:value={search} />

	<div class="grid grid-cols-2 gap-2 mt-2">
		{#each data.commands.filter((c) => c.name.includes(search) || c.aliases.some( (a) => a.includes(search), )) as command, i}
			<RPToggle {command} {checkChange} {commandEnabled} />
		{/each}
	</div>
</section>
