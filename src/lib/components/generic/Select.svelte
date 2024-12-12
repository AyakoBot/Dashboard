<script lang="ts">
	import Fa from 'svelte-fa';
	import { faChevronUp, faChevronDown, faClose } from '@fortawesome/free-solid-svg-icons';
	import { faSquareCheck, faSquare } from '@fortawesome/free-regular-svg-icons';
	import { findInParents } from '$lib/scripts/util/utils.js';

	const {
		options,
		single = true,
		required = false,
		label,
		id = Math.random().toString(36).substring(7),
		onUpdate,
	}: {
		options: string[];
		single: boolean;
		required: boolean;
		label: string;
		id?: string;
		onUpdate: (v: string[]) => void;
	} = $props();

	let element: HTMLDivElement;
	let expanded = $state(false);
	let selectedOptions: typeof options = $state([]);

	const update = () => {
		if (expanded) return;
		onUpdate(selectedOptions);
	};

	const optionClick = (opt: string) => {
		if (single) selectedOptions = [opt];
		else {
			selectedOptions = selectedOptions.includes(opt)
				? selectedOptions.filter((s) => s !== opt)
				: [...selectedOptions, opt];
		}
		update();
	};

	const clickWindow = (
		e: (MouseEvent | KeyboardEvent) & { currentTarget: EventTarget & Window },
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
		onkeydown={labelClick}
		role="button"
		tabindex="0"
		class="cursor-pointer bg-neutral-900 w-full rounded-2xl px-2 py-2 relative text-left"
	>
		{#if selectedOptions.length}
			<div class="flex flex-row flex-wrap gap-1 items-center">
				{#each [...selectedOptions] as opt, j (j)}
					{#if single}
						<div
							class="relative w-full"
							onclick={() => optionClick(opt)}
							onkeydown={() => optionClick(opt)}
							role="button"
							tabindex="0"
						>
							{opt}
						</div>
					{:else}
						<div
							class="px-2 py-1 bg-neutral-800 relative rounded-2xl"
							onclick={() => optionClick(opt)}
							onkeydown={() => optionClick(opt)}
							role="button"
							tabindex="0"
						>
							{opt}
							<Fa icon={faClose} size="1x" class="!inline pointer-events-none" />
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

		<div class="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
			{#if expanded}
				<Fa icon={faChevronUp} size="1.5x" />
			{:else}
				<Fa icon={faChevronDown} size="1.5x" />
			{/if}
		</div>
	</div>

	{#if expanded}
		<div
			class="absolute top-full right-1/2 translate-x-1/2 bg-neutral-800 w-full z-100 rounded-2xl max-h-50 scroll-auto of-x-hidden"
		>
			{#each options as opt}
				<div
					onclick={() => optionClick(opt)}
					onkeydown={() => optionClick(opt)}
					role="button"
					tabindex="0"
					class="text-left px-2 py-2 hover:bg-neutral-600 rounded-2xl relative"
				>
					{opt}
					<div class="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
						{#if selectedOptions.includes(opt)}
							<Fa icon={faSquareCheck} size="1.5x" />
						{:else}
							<Fa icon={faSquare} size="1.5x" />
						{/if}
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
