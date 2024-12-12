<svelte:options customElement="side-bar-icon" />

<script lang="ts">
	import { page } from '$app/stores';

	const {
		src,
		size = 60,
		alt = '',
		bg = false,
		name,
		id,
	}: {
		id: string;
		bg?: boolean;
		name: string;
		src?: string;
		size?: number;
		alt?: string;
	} = $props();

	let self: HTMLElement | null = null;
	let img: HTMLImageElement | null = $state(null);
	let active = $state(false);

	$effect(() => {
		$host().dispatchEvent(new CustomEvent('imAt', { detail: self?.getBoundingClientRect().y || 0 }));
	});

	const hovered = (state: boolean) => {
		if (!self) return;

		if (src?.startsWith('a_') && img && state && id !== 'favicon') {
			img.src = `https://cdn.discordapp.com/icons/${id}/${src}.gif?size=64&ver=${Date.now()}`;
		} else if (!state && img && src && !src.includes('favicon')) {
			img.src = `https://cdn.discordapp.com/icons/${id}/${src}.webp?size=64`;
		}

		$host().dispatchEvent(
			new CustomEvent(state ? 'hover' : 'unhover', {
				detail: state ? { y: self.getBoundingClientRect().y, name } : name,
			}),
		);
	};

	$effect(() => {
		active =
			$page.params?.guildId === id || (String($page.url?.pathname).startsWith('/@me') && id === '@me');
	});
</script>

<a
	class="group relative"
	onmouseover={() => hovered(true)}
	onmouseleave={() => hovered(false)}
	onfocus={() => hovered(true)}
	onblur={() => hovered(false)}
	bind:this={self}
	role="button"
	tabindex="0"
	data-sveltekit-preload-data="hover"
	href={id === '@me' ? '/@me' : `/guilds/${id}`}
>
	<div
		class="hover:rounded-[20px] flex justify-center items-center of-hidden min-w-15 min-h-15 ease-in-out transition-all duration-300 box-shadow-main w-full aspect-square of-hidden" 
   class:bg-main={bg || id === 'favicon'}
   class:rounded-[20px]={active}
   class:rounded-[30px]={!active}
   class:hover:bg-blurple={id === 'favicon'}
   class:transition-all={id === 'favicon'}
   class:duration-300={id === 'favicon'}
   class:ease-in-out={id === 'favicon'}
	>
		{#if src}
			<img
				src={id !== '@me'
					? (src && `https://cdn.discordapp.com/icons/${id}/${src}.webp?size=128`) || ''
					: '/favicon.webp'}
				width={size}
				height={size}
				{alt}
				loading="lazy"
				bind:this={img}
			/>
		{:else}
			<div
				class="bg-main hover:bg-blurple transition-all duration-300 ease-in-out w-full h-full flex justify-center items-center color-alt-text hover:color-main-text text-lg of-hidden"
			>
				{name
					.split(/\s+/g)
					.map((w) => w[0].toUpperCase())
					.join('')
					.slice(0, 5)}
			</div>
		{/if}
	</div>
</a>
