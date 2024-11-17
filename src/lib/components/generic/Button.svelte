<script lang="ts">
	import getEffectiveBackgroundColor from '$lib/scripts/util/getEffectiveBackgroundColor';
	import getBrightness from '$lib/scripts/util/getBrightness';
	import { onMount } from 'svelte';

	type Styles =
		| 'primary'
		| 'primary-outline'
		| 'inverted-white'
		| 'red'
		| 'red-outline'
		| 'green'
		| 'green-outline'
		| 'secondary'
		| 'secondary-outline'
		| 'link'
		| 'link-outline';

	type Height = 'tiny' | 'small' | 'medium' | 'large' | 'min' | 'max' | 'icon';
	type Width = 'fit' | 'full';

	const {
		text,
		style = 'primary',
		disabled = false,
		height = 'small',
		width = 'fit',
	}: { text: string; style?: Styles; disabled?: boolean; height?: Height; width?: Width } = $props();

	let element: HTMLButtonElement | null = $state(null);
	const backgroundColor = $derived(getEffectiveBackgroundColor(element));
	let cssStyle = $state('');

	onMount(() => {
		cssStyle = `color: ${getBrightness(backgroundColor) > 255 / 2 ? 'black' : 'white'}; --un-bg-opacity: ${disabled ? 0.5 : 1};`;
	});
</script>

{#if style === 'primary'}
	<button
		bind:this={element}
		class=" {width === 'full' ? 'w-full' : ''}
  {height === 'tiny'
			? 'p-1 min-w-15'
			: height === 'small'
				? 'p-2 min-w-20'
				: height === 'medium'
					? 'p-3 min-w-30'
					: height === 'large'
						? 'p-4 min-w-40'
						: height === 'min'
							? 'p-0'
							: height === 'max'
								? 'p-5'
								: height === 'icon'
									? 'p-1'
									: 'p-2'}
  hover:text-white! btn-primary
  {disabled ? '' : 'hover:bg-primary-hover'}"
		style={cssStyle}
		{disabled}
	>
		{text}
	</button>
{:else if style === 'primary-outline'}
	<button
		bind:this={element}
		class=" {width === 'full' ? 'w-full' : ''}
  {height === 'tiny'
   ? 'p-1'
   : height === 'small'
    ? 'p-2'
    : height === 'medium'
     ? 'p-3'
     : height === 'large'
      ? 'p-4'
      : height === 'min'
       ? 'p-0'
       : height === 'max'
        ? 'p-5'
        : height === 'icon'
         ? 'p-1'
         : 'p-2'}
  btn-extra-primary-outlined
  {disabled ? '' : 'hover:bg-primary-hover hover:border-transparent'}"
		style={cssStyle}
		{disabled}
	>
		{text}
	</button>
{:else if style === 'inverted-white'}
	<button
		bind:this={element}
		class=" {width === 'full' ? 'w-full' : ''}
  {height === 'tiny'
			? 'p-1'
			: height === 'small'
				? 'p-2'
				: height === 'medium'
					? 'p-3'
					: height === 'large'
						? 'p-4'
						: height === 'min'
							? 'p-0'
							: height === 'max'
								? 'p-5'
								: height === 'icon'
									? 'p-1'
									: 'p-2'}
  {disabled ? 'cursor-not-allowed' : ''}
  btn-extra-inverted-white text-primary! hover:text-primary!
  {disabled ? '' : 'hover:bg-primary-hover'}"
		style={cssStyle}
		{disabled}
	>
		{text}
	</button>
{:else if style === 'red'}
	<button
		bind:this={element}
		class=" {width === 'full' ? 'w-full' : ''}
  {height === 'tiny'
			? 'p-1'
			: height === 'small'
				? 'p-2'
				: height === 'medium'
					? 'p-3'
					: height === 'large'
						? 'p-4'
						: height === 'min'
							? 'p-0'
							: height === 'max'
								? 'p-5'
								: height === 'icon'
									? 'p-1'
									: 'p-2'}
  btn-danger
  {disabled ? '' : 'hover:bg-danger-hover'}"
		style={cssStyle}
		{disabled}
	>
		{text}
	</button>
{:else if style === 'red-outline'}
	<button
		bind:this={element}
		class=" {width === 'full' ? 'w-full' : ''}
  {height === 'tiny'
			? 'p-1'
			: height === 'small'
				? 'p-2'
				: height === 'medium'
					? 'p-3'
					: height === 'large'
						? 'p-4'
						: height === 'min'
							? 'p-0'
							: height === 'max'
								? 'p-5'
								: height === 'icon'
									? 'p-1'
									: 'p-2'}
  btn-extra-danger-outlined
  {disabled ? '' : 'hover:bg-red-hover hover:border-transparent'}"
		style={cssStyle}
		{disabled}
	>
		{text}
	</button>
{:else if style === 'green'}
	<button
		bind:this={element}
		class=" {width === 'full' ? 'w-full' : ''}
  {height === 'tiny'
			? 'p-1'
			: height === 'small'
				? 'p-2'
				: height === 'medium'
					? 'p-3'
					: height === 'large'
						? 'p-4'
						: height === 'min'
							? 'p-0'
							: height === 'max'
								? 'p-5'
								: height === 'icon'
									? 'p-1'
									: 'p-2'}
  btn-success
  {disabled ? '' : 'hover:bg-success-hover'}"
		style={cssStyle}
		{disabled}
	>
		{text}
	</button>
{:else if style === 'green-outline'}
	<button
		bind:this={element}
		class=" {width === 'full' ? 'w-full' : ''}
  {height === 'tiny'
			? 'p-1'
			: height === 'small'
				? 'p-2'
				: height === 'medium'
					? 'p-3'
					: height === 'large'
						? 'p-4'
						: height === 'min'
							? 'p-0'
							: height === 'max'
								? 'p-5'
								: height === 'icon'
									? 'p-1'
									: 'p-2'}
  btn-extra-success-outlined
  {disabled ? '' : 'hover:bg-green-hover hover:border-transparent'}"
		style={cssStyle}
		{disabled}
	>
		{text}
	</button>
{:else if style === 'secondary'}
	<button
		bind:this={element}
		class=" {width === 'full' ? 'w-full' : ''}
  {height === 'tiny'
			? 'p-1'
			: height === 'small'
				? 'p-2'
				: height === 'medium'
					? 'p-3'
					: height === 'large'
						? 'p-4'
						: height === 'min'
							? 'p-0'
							: height === 'max'
								? 'p-5'
								: height === 'icon'
									? 'p-1'
									: 'p-2'}
  btn-secondary
  {disabled ? '' : 'hover:bg-secondary-hover'}"
		style={cssStyle}
		{disabled}
	>
		{text}
	</button>
{:else if style === 'secondary-outline'}
	<button
		bind:this={element}
		class=" {width === 'full' ? 'w-full' : ''}
  {height === 'tiny'
			? 'p-1'
			: height === 'small'
				? 'p-2'
				: height === 'medium'
					? 'p-3'
					: height === 'large'
						? 'p-4'
						: height === 'min'
							? 'p-0'
							: height === 'max'
								? 'p-5'
								: height === 'icon'
									? 'p-1'
									: 'p-2'}
  btn-extra-secondary-outlined
  {disabled ? '' : 'hover:bg-secondary-hover hover:border-transparent'}"
		style={cssStyle}
		{disabled}
	>
		{text}
	</button>
{:else if style === 'link'}
	<button
		bind:this={element}
		class=" {width === 'full' ? 'w-full' : ''}
  {height === 'tiny'
			? 'p-1'
			: height === 'small'
				? 'p-2'
				: height === 'medium'
					? 'p-3'
					: height === 'large'
						? 'p-4'
						: height === 'min'
							? 'p-0'
							: height === 'max'
								? 'p-5'
								: height === 'icon'
									? 'p-1'
									: 'p-2'}
  btn-link
  {disabled ? '' : 'hover:bg-secondary-hover'}"
		style={cssStyle}
		{disabled}
	>
		{text}
		<img src="/svg/external.svg" alt="" width="20" />
	</button>
{:else if style === 'link-outline'}
	<button
		bind:this={element}
		class=" {width === 'full' ? 'w-full' : ''}
  {height === 'tiny'
			? 'p-1'
			: height === 'small'
				? 'p-2'
				: height === 'medium'
					? 'p-3'
					: height === 'large'
						? 'p-4'
						: height === 'min'
							? 'p-0'
							: height === 'max'
								? 'p-5'
								: height === 'icon'
									? 'p-1'
									: 'p-2'}
  btn-extra-link-outlined
  {disabled ? '' : 'hover:bg-secondary-hover hover:border-transparent'}"
		style={cssStyle}
		{disabled}
	>
		{text}
		<img src="/svg/external.svg" alt="" width="20" />
	</button>
{/if}
