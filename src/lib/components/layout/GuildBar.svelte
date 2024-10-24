<script lang="ts">
	import SideBarIcon from '$lib/components/layout/SideBarIcon.svelte';
	import { PermissionFlagsBits } from 'discord-api-types/v10';
	import type { LayoutData } from '../../../routes/$types';

	const { data }: { data: LayoutData } = $props();

	let nameContainer: HTMLDivElement | null = $state(null);
	let dotContainer: { div: HTMLDivElement | null; firstAppear: boolean } = $state({
		div: null,
		firstAppear: true,
	});
	let name = $state<string | null>(null);
	let profile: HTMLDivElement | null = $state(null);
	let mouseY = $state(0);

	const updateDotPos = () => {
		console.log(mouseY);
		if (!dotContainer.div) return;

		dotContainer.div.style.top = `${dotContainer.div.getBoundingClientRect().top}px`;

		dotContainer.div.animate([{ top: dotContainer.div.style.top }, { top: `${mouseY + 26}px` }], {
			duration: 300,
			easing: 'cubic-bezier(0,1,1,1)',
			fill: 'forwards',
		});
	};

	const showDot = (y: number) => {
		if (!dotContainer.div) return;

		if (dotContainer.firstAppear) dotContainer.div.style.top = `${y + 26}px`;

		dotContainer.div.animate(
			[
				{
					top: dotContainer.div.getBoundingClientRect().top,
					left: dotContainer.firstAppear ? '-8px' : '-4px',
				},
				{ top: `${y + 26}px`, left: '-4px' },
			],
			{
				duration: 300,
				easing: 'cubic-bezier(0,1,1,1)',
				fill: 'forwards',
			},
		);

		dotContainer.div.style.top = `${dotContainer.div.getBoundingClientRect().top}px`;
		dotContainer.firstAppear = false;
	};

	const hideDot = () => {
		if (!dotContainer.div) return;
		dotContainer.firstAppear = true;

		dotContainer.div.animate([{ left: '-4px' }, { left: '-8px' }], {
			duration: 300,
			easing: 'cubic-bezier(0,1,1,1)',
			fill: 'forwards',
		});
	};

	const showName = (e: { y: number; name: string }) => {
		showDot(e.y);
		if (!nameContainer) return;

		name = e.name;
		nameContainer.style.top = `${e.y + 28}px`;
	};

	const hideName = (e: { name: string }) => {
		if (!nameContainer) return;
		if (e.name !== name) return;
		name = null;
	};

	const canManage = (permissions: bigint) =>
		(permissions & PermissionFlagsBits.ManageGuild) === PermissionFlagsBits.ManageGuild;
</script>

<svelte:body onmousemove={(e) => (mouseY = e.clientY - 28)} />

<section
	id="guild-bar"
	class="bg-main-darker flex flex-col justify-start items-center gap-2 p-2 h-100lvh box-shadow-main of-y-scroll of-auto hide-scrollbar"
	onmouseleave={() => hideDot()}
	onscroll={(e) => updateDotPos()}
	role="navigation"
>
	<div
		class="max-w-15 fixed z-5
  before:content-empty before:bg-main-darker before:w-19 before:-left-2 before:h-19 before:absolute before:-top-2
  after:relative"
	>
		<hr
			class="border-t-2 border-main rounded-full w-101% m-auto z-5 absolute -bottom-2 left-50% -translate-x-50%"
		/>
		<SideBarIcon
			src="favicon.png"
			name="My Settings"
			size={40}
			bg
			id="@me"
			on:hover={(e) => showName(e.detail)}
			on:unhover={(e) => hideName(e.detail)}
		/>
	</div>

	<div class="h-80lvh mt-4">
		<div class="content-empty h-15"></div>

		{#each data.guilds.filter((g) => canManage(BigInt(g.permissions))) as guild, i}
			{#if i !== 0}
				<br class="mt-2.5 content-empty block" />
			{/if}

			<SideBarIcon
				src={guild.icon ?? undefined}
				id={guild.id}
				name={guild.name}
				on:hover={(e) => showName(e.detail)}
				on:unhover={(e) => hideName(e.detail)}
			/>
		{/each}

		<div class="content-empty h-19"></div>

		<div
			class="h-17 w-19 bg-main-dark fixed rounded-tr-xl hover:box-shadow-main left-0 bottom-0 transition-all duration-300 ease-in-out pt-2 group z-6
   {data.user?.username && data.user?.avatar
				? 'hover:flex-wrap hover:flex-row hover:h-30 hover:w-15lvw hover:flex hover:justify-center hover:items-center'
				: ''}"
			bind:this={profile}
		>
			{#if data.user?.avatar && data.user?.username}
				<img src={data.user.avatar} alt="" class="rounded-full w-15 m-auto" width="128" height="128" />
				<div class="text-2xl mr-3 group-hover:block hidden">{data.user.username}</div>
				<div class="group-hover:block hidden">
					<div class="text-xl">
						Not you?
						<button class="btn-primary">Log out</button>
					</div>
				</div>
			{:else}
				<a
					class="w-full h-full m-auto content-empty
     after:content-empty after:bg-[url(/svg/friends.svg)] after:block after:ml-1 after:bg-[size:64px] after:h-full after:w-full after:-mt-1"
					onmouseenter={() =>
						showName({ name: 'Log in', y: (profile?.getBoundingClientRect().y ?? 0) + 10 })}
					onmouseleave={() => hideName({ name: 'Log in' })}
					onfocus={() => showName({ name: 'Log in', y: (profile?.getBoundingClientRect().y ?? 0) + 10 })}
					onblur={() => hideName({ name: 'Log in' })}
					role="button"
					tabindex="0"
					aria-label="Log in"
					href="/login"
				></a>
			{/if}
		</div>
	</div>
</section>

<div
	bind:this={nameContainer}
	class="{name
		? ''
		: 'hidden'} absolute bg-main-darkest left-20 top-50% -translate-y-50% w-fit max-w-[200px] whitespace-normal break-words rounded-[5px] border-alt-text border-op-50 border-0.1px border-solid px-3 py-1 box-shadow-main font-bold"
>
	{name}
</div>

<div
	class="absolute w-2 h-2 bg-main-text/80 top-0 -left-2 top-0 content-empty rounded-full z-5"
	bind:this={dotContainer.div}
></div>
