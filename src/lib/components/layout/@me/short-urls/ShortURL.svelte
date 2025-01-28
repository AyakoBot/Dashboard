<script lang="ts">
	import { page } from '$app/state';
	const { url, i }: { url: { id: string; forward: string; uses: number }; i: number } = $props();

	let copied = $state(false);
	let timeout: NodeJS.Timeout | null = null;

	const copy = (url: string) => {
		navigator.clipboard.writeText(url);
		copied = true;

		if (timeout) clearTimeout(timeout);
		timeout = setTimeout(() => {
			copied = false;
			timeout = null;
		}, 500);
	};
</script>

<div
	class="flex flex-col justify-between text-3 px-2 py-1 rounded-md mr-1 bg-main-darker/50"
	class:bg-main-darker={page.params?.id !== url.id}
>
	<div class="flex flex-row justify-start items-start my-1">
		{i + 1}.
		<button
			class="ml-2 group flex flex-row justify-center items-center gap-1"
			onclick={() => copy(`https://wzxy.org/${url.id}`)}
		>
			wzxy.org/{url.id}
			<span
				class="block group-hover:block hidden"
				class:i-tabler-copy={!copied}
				class:i-tabler-check={copied}
			></span>
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
			onclick={() => copy(url.forward)}
		>
			<span class="truncate">
				{url.forward.replace('https://', '').replace('http://', '')}
			</span>
			<span
				class="block group-hover:block hidden flex-shrink-0"
				class:i-tabler-copy={!copied}
				class:i-tabler-check={copied}
			></span>
		</button>
		Uses: {url.uses}
	</div>
</div>
