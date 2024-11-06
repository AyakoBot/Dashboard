<script lang="ts">
	import { page } from '$app/stores';
	import ExplainBox from '$lib/components/generic/ExplainBox.svelte';
	import { type Snippet } from 'svelte';
	import type { LayoutServerData } from './$types';

	const { data, children }: { data: LayoutServerData; children: Snippet } = $props();
</script>

<div class="w-full h-90lvh md:h-100vh">
	<div class="flex flex-row">
		<section class="flex flex-col gap-2 max-h-100lvh of-y-auto mb-10 w-full hide-scrollbar mr-1">
			<div class="h-16lvh md:h-16vh w-full mb-6">
				<h1 class="text-lg font-bold my-2">Short URLs</h1>

				<ExplainBox
					headline="Privileged Section"
					text="This section requires authorized access. Please contact the Ayako development team for permissions."
				/>
			</div>

			{#each data.shortURLs as url, i}
				<div
					class="flex flex-col justify-between text-3 {$page.params.id === url.id
						? 'bg-main-darker/50'
						: 'bg-main-darker'} px-2 py-1 rounded-md mr-1"
				>
					<div class="flex flex-row justify-start items-start my-1">
						{i + 1}.
						<button
							class="ml-2 group flex flex-row justify-center items-center gap-1"
							onclick={() => navigator.clipboard.writeText(`https://wzxy.org/${url.id}`)}
						>
							wzxy.org/{url.id}
							<img
								src="/svg/clipboard.svg"
								alt=""
								class="group-hover:block hidden"
								width="16"
								height="16"
							/>
						</button>
						<button class="btn-danger justify-self-end self-end ml-auto"> Delete </button>
						<a
							class="btn-secondary justify-self-end self-end ml-2"
							href="/@me/short-urls/{url.id}"
							data-sveltekit-preload-data="hover"
						>
							Statistics
						</a>
					</div>

					<div class="flex flex-row justify-between items-center">
						<button
							class="group flex flex-row justify-start items-center gap-1 max-w-50 whitespace-nowrap overflow-hidden"
							onclick={() => navigator.clipboard.writeText(`https://wzxy.org/${url.id}`)}
						>
							<span class="truncate">
								{url.forward.replace('https://', '').replace('http://', '')}
							</span>
							<img
								src="/svg/clipboard.svg"
								alt=""
								class="group-hover:block hidden flex-shrink-0"
								width="16"
								height="16"
							/>
						</button>
						Uses: {url.uses}
					</div>
				</div>
			{/each}
		</section>

		{#if $page.params.id}
			<section
				class="flex flex-col gap-2 max-h-100lvh of-y-auto mb-10 w-full hide-scrollbar pl-1 bg-main-lighter box-shadow-main"
			>
				{@render children()}
			</section>
		{/if}
	</div>
</div>
