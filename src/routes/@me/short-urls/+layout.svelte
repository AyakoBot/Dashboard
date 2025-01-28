<script lang="ts">
	import { page } from '$app/state';
	import ExplainBox from '$lib/components/generic/ExplainBox.svelte';
	import { type Snippet } from 'svelte';
	import type { LayoutServerData } from './$types';
	import ShortUrl from '$lib/components/layout/@me/short-urls/ShortURL.svelte';

	const { data, children }: { data: LayoutServerData; children: Snippet } = $props();
</script>

<div class="w-full h-90lvh md:h-100vh mt-1">
	<div class="flex flex-row">
		<section class="flex flex-col gap-2 max-h-100lvh of-y-auto w-full hide-scrollbar mr-1 pb-2">
			<div class="w-full mb-2 flex flex-col gap-1">
				<ExplainBox
					headline="Privileged Section"
					text="This section requires authorized access. Please contact the Ayako development team for permissions."
				/>

				<ExplainBox
					headline="What is this?"
					text="Here you can see, delete and create your Short-URLs and track their usage."
				/>
			</div>

			{#each data.shortURLs as url, i}
				<ShortUrl {i} {url} />
			{/each}
		</section>

		{#if page.params?.id}
			<section
				class="flex flex-col gap-2 max-h-100lvh of-y-auto mb-10 w-full hide-scrollbar pl-1 bg-main-lighter box-shadow-main"
			>
				{@render children()}
			</section>
		{/if}
	</div>
</div>
