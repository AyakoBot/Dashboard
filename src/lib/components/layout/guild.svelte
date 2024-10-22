<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	const {
		src,
		size = 60,
		alt = '',
		bg = false,
		name,
		id,
	}: { id: string; bg?: boolean; name: string; src?: string; size?: number; alt?: string } = $props();

	let self: HTMLElement | null = null;
	let img: HTMLImageElement | null = null;
	let isHovered = $state<boolean>(false);

	const dispatch = createEventDispatcher<{
		hover: { y: number; name: string };
		unhover: { name: string };
	}>();

	const hovered = (state: boolean) => {
		if (!self) return;
		isHovered = state;
		if (src?.startsWith('a_') && img && state && !src.includes('favicon')) {
			img.src = `https://cdn.discordapp.com/icons/${id}/${src}.gif?size=64&ver=${Date.now()}`;
		} else if (!state && img && src && !src.includes('favicon')) {
			img.src = `https://cdn.discordapp.com/icons/${id}/${src}.webp?size=64`;
		}

		dispatch(
			state ? 'hover' : 'unhover',
			state ? { y: self.getBoundingClientRect().y, name } : { name },
		);
	};
</script>

<div
	class="relative"
	onmouseover={() => hovered(true)}
	onmouseleave={() => hovered(false)}
	onfocus={() => hovered(true)}
	onblur={() => hovered(false)}
	role="tooltip"
	bind:this={self}
>
	<div
		class="hover:rounded-[20px] flex justify-center items-center of-hidden min-w-15 min-h-15 rounded-[30px] ease-in-out transition-all duration-300 box-shadow-main {bg
			? 'bg-main-dark'
			: ''}"
	>
		<img
			src={!src?.includes('favicon')
				? (src && `https://cdn.discordapp.com/icons/${id}/${src}.webp?size=64`) || ''
				: src}
			width={size}
			height={size}
			{alt}
			loading="lazy"
			bind:this={img}
		/>
	</div>
</div>
