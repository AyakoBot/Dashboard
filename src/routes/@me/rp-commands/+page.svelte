<script lang="ts">
	import ExplainBox from '$lib/components/generic/ExplainBox.svelte';
	import Input from '$lib/components/generic/Input.svelte';
	import RPToggle from '$lib/components/layout/@me/rp-commands/RPToggle.svelte';
	import type { RUser } from '@ayako/bot/src/Typings/Redis';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import makeRequest from '$lib/scripts/util/makeRequest';

	const { data }: { data: PageData } = $props();
	let search = $state('');

	const commandEnabled: Record<string, boolean> = $state({});

	onMount(() => {
		[...data.stateMap.values()]
			?.filter((s) => s.users.has('0'))
			?.forEach((c) => (commandEnabled[c.command] = false));
	});

	const checkChange = (name: string, state: boolean) => {
		commandEnabled[name] = state;

		makeRequest(
			{ command: name, enabled: state, userId: '0', path: '/@me/rp', method: 'PATCH' },
			{},
			fetch,
		);
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
		{#each data.commands.filter((c) => c.name.includes(search) || c.aliases.some( (a) => a.includes(search), )) as command}
			<RPToggle
				{command}
				{checkChange}
				{commandEnabled}
				users={[...(data.stateMap.get(command.name)?.users || [])]
					.map((u) => data.users?.find((u2) => u2.id === u))
					.filter((u): u is RUser => !!u)}
			/>
		{/each}
	</div>
</section>
