<script lang="ts">
	import { findInParents } from '$lib/scripts/util/utils.js';

	const {
		options,
		single = true,
		required = false,
		label,
		id = Math.random().toString(36).substring(7),
		onupdate,
	}: {
		options: string[];
		single: boolean;
		required: boolean;
		label: string;
		id?: string;
		onupdate?: (v: string[]) => void;
	} = $props();

	let element: HTMLDivElement;
	let expanded = $state(false);
	let selectedOptions: typeof options = $state([]);

	const update = () => {
		if (expanded) return;
		onupdate?.(selectedOptions);
	};

	const optionClick = (
		e: (MouseEvent | KeyboardEvent) & { currentTarget: EventTarget & HTMLDivElement },
		opt: string,
	) => {
		if (opt === 'Clear selection') {
			selectedOptions = [];

			update();
			if (single) expanded = false;

			return;
		}

		if (single) selectedOptions = [opt];
		else {
			selectedOptions = selectedOptions.includes(opt)
				? selectedOptions.filter((s) => s !== opt)
				: [...selectedOptions, opt];
		}

		update();
		if (single) expanded = false;
	};

	const clickWindow = (
		e: (MouseEvent | KeyboardEvent) & { currentTarget: (EventTarget & Window) | HTMLDivElement },
	) => {
		if (findInParents(e.target as HTMLElement, id)) return;
		expanded = false;
		update();
	};

	const labelClick = () => {
		expanded = !expanded;
		update();
	};
</script>

<svelte:window on:click={clickWindow} on:keydown={clickWindow} />

<div {id} class="relative w-full">
	<input
		type="text"
		{required}
		value={selectedOptions.length ? JSON.stringify(selectedOptions) : ''}
		class="w-1px h-1px absolute top-full"
		name={id}
		onfocus={() => element.focus()}
		tabindex="-1"
	/>
	<div
		bind:this={element}
		onclick={labelClick}
		onkeydown={(e) => (e.key === 'Enter' ? labelClick() : undefined)}
		role="button"
		tabindex="0"
		class="cursor-pointer bg-neutral-900 w-full rounded-md px-2 py-2 relative text-left"
		aria-label="Toggle Select"
	>
		{#if selectedOptions.length}
			<div class="flex flex-row flex-wrap gap-1 items-center">
				{#each selectedOptions as opt, j (j)}
					{#if single}
						<div
							class="relative w-full"
							onclick={(e) => optionClick(e, opt)}
							onkeydown={(e) => (e.key === 'Enter' ? optionClick(e, opt) : undefined)}
							role="button"
							tabindex="0"
							aria-label="Toggle Select"
						>
							{opt}
						</div>
					{:else}
						<div
							class="px-2 py-1 bg-neutral-800 relative rounded-md flex flex-row justify-evenly items-center gap-2"
							onclick={(e) => optionClick(e, opt)}
							onkeydown={(e) => (e.key === 'Enter' ? optionClick(e, opt) : undefined)}
							role="button"
							tabindex="0"
							aria-label="Remove Select"
						>
							<span>
								{opt}
							</span>
							<img
								src="/svg/close.svg"
								class="!inline pointer-events-none select-none"
								alt="Remove"
								width="16"
								height="16"
							/>
						</div>
					{/if}
				{/each}

				{#if !single}
					<div class="color-neutral-500">{label}</div>
				{/if}
			</div>
		{:else}
			<div class="color-neutral-500">{label}</div>
		{/if}

		<div class="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none flex flex-row-reverse">
			<img
				src="/svg/chevron-up.svg"
				class:rotate-180={expanded}
				class="transition-all duration-100 ease-in-out"
				alt="Expand"
				width="16"
				height="16"
			/>
		</div>
	</div>

	{#if expanded}
		<div
			class="absolute top-full right-1/2 translate-x-1/2 bg-neutral-800 w-full z-100 rounded-md max-h-50 scroll-auto of-x-hidden custom-scrollbar"
		>
			{#each required ? options : ['Clear selection', ...options] as opt, i}
				<div
					onclick={(e) => optionClick(e, opt)}
					onkeydown={(e) => (e.key === 'Enter' ? optionClick(e, opt) : undefined)}
					role="button"
					tabindex="0"
					class="text-left px-2 py-2 hover:bg-neutral-600 rounded-md relative"
					class:color-white:50={!i}
					aria-label="Toggle Select"
				>
					{opt}
					{#if !single}
						<div class="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
							{#if selectedOptions.includes(opt) && !!i}
								<img src="/svg/square-check.svg" alt="Select" width="16" height="16" />
							{:else if !!i}
								<img src="/svg/square.svg" alt="Deselect" width="16" height="16" />
							{/if}
						</div>
					{/if}
				</div>
			{/each}
		</div>
	{/if}

	{#if required && !selectedOptions.length}
		<div class="color-red-500 text-2.5">This must have a value</div>
	{/if}
</div>
