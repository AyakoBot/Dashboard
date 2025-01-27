<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import Timestamp from '$lib/components/generic/Timestamp.svelte';
	import makeRequest from '$lib/scripts/util/makeRequest';
	import type { GETResponse as GETUses } from '@ayako/server/src/routes/v1/@me/short-urls/[id]/uses/+server.js';

	let uses: Promise<GETUses> | null = $state(null);

	const getUsage = () => {
		uses = makeRequest(
			{ method: 'GET', path: '/@me/short-urls/:id/uses' },
			{ id: page.params?.id },
			fetch,
		).then((r) => {
			if (r) return r;
			throw new Error('Error fetching usage');
		});
	};

	afterNavigate(() => {
		uses = null;
		getUsage();
	});
</script>

<h1 class="font-bold text-lg mt-2">Usage history</h1>
{#await uses}
	<div class="color-alt-text text-3">Fetching usage...</div>
{:then uses}
	{#if uses?.length}
		<div class="flex flex-col justify-center items-start gap-2">
			{#each uses.sort((a, b) => b.timestamp - a.timestamp) as use, i}
				<div class="flex flex-row justify-start items-center gap-1">
					{i + 1}. <Timestamp time={use.timestamp} /> / <Timestamp time={use.timestamp} type="R" />
				</div>
			{/each}
		</div>
	{:else}
		<div class="color-alt-text text-3">No uses recorded</div>
	{/if}
{:catch error}
	<div class="color-error text-3">{error.message}</div>
{/await}
