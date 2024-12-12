<script lang="ts">
	import SideBarIcon from '$lib/components/layout/SideBarIcon.svelte';
	import { PermissionFlagsBits } from 'discord-api-types/v10';
	import type { LayoutData } from '../../../routes/$types';
	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/stores';

	const { data, onLogin }: { data: LayoutData; onLogin: () => void } = $props();
	const easing = 'cubic-bezier(.35,1.58,1,.83)';
	const offset = 26;

	const login = () => {
		onLogin();
	};

	const logout = () => {
		location.href = '/@me/logout?logout=true';
	};

	let guilds: { id: string; y: number }[] = [];
	let nameContainer: HTMLDivElement | null = $state(null);
	let dotContainer: {
		point: HTMLDivElement | null;
		bar: HTMLDivElement | null;
		firstAppear: boolean;
	} = $state({
		point: null,
		firstAppear: true,
		bar: null,
	});
	let name = $state<string | null>(null);
	let profile: HTMLDivElement | null = $state(null);
	let mouseY = $state(0);
	let guildBarSection: HTMLElement | null = $state(null);

	const scroll = () => {
		updateDotPos();
		barScroll();
	};

	const barScroll = () => {
		if (!guildBarSection) return;
		if (!dotContainer.bar) return;

		const oldPos = guilds.find(
			(g) => g.id === ($page.url?.pathname.startsWith('/@me') ? '@me' : $page.params?.guildId),
		);

		if (!oldPos) return;

		const newPos = { y: oldPos.y - guildBarSection.scrollTop };
		dotContainer.bar.style.top = `${newPos.y + offset}px`;
	};

	const updateDotPos = () => {
		if (!dotContainer.point) return;

		dotContainer.point.style.top = `${dotContainer.point.getBoundingClientRect().top}px`;

		dotContainer.point.animate(
			[{ top: dotContainer.point.style.top }, { top: `${mouseY + offset}px` }],
			{ duration: 200, easing, fill: 'forwards' },
		);
	};

	const updateBarPos = (oldPos: number, newPos: number, initialAnimation: boolean = false) => {
		if (!dotContainer.bar) return;
		if (!guildBarSection) return;
		if (initialAnimation) oldPos = newPos;

		dotContainer.bar.style.top = `${dotContainer.bar.getBoundingClientRect().top}px`;

		dotContainer.bar
			.animate(
				[
					initialAnimation
						? { top: dotContainer.bar.style.top, left: '-8px' }
						: { top: dotContainer.bar.style.top },

					initialAnimation
						? { top: `${newPos + offset - guildBarSection.scrollTop}px`, left: '-4px' }
						: { top: `${newPos + offset - guildBarSection.scrollTop}px` },
				],
				{ duration: 200, easing },
			)
			.finished.then(() => {
				if (!dotContainer.bar) return;
				if (!guildBarSection) return;

				dotContainer.bar.style.top = `${newPos + offset - guildBarSection.scrollTop}px`;
				dotContainer.bar.style.left = '-4px';
			});
	};

	const showDot = (y: number) => {
		if (!dotContainer.point) return;
		if (dotContainer.point.style.top === `${y + offset}px` && !dotContainer.firstAppear) return;

		dotContainer.point.animate(
			[
				{
					top: dotContainer.point.style.top,
					left: dotContainer.firstAppear ? '-8px' : '-4px',
				},
				{ top: `${y + offset}px`, left: '-4px' },
			],
			{ duration: 200, easing, fill: 'forwards' },
		);

		dotContainer.firstAppear = false;
		dotContainer.point.style.top = `${y + offset}px`;
		dotContainer.point.style.left = '-4px';
	};

	const hideDot = () => {
		if (!dotContainer.point) return;
		dotContainer.firstAppear = true;

		dotContainer.point.animate([{ left: '-4px' }, { left: '-8px' }], {
			duration: 200,
			easing,
			fill: 'forwards',
		});

		dotContainer.point.style.left = '-8px';
	};

	const showName = (e: { y: number; name: string }) => {
		showDot(e.y);
		if (!nameContainer) return;

		name = e.name;
		nameContainer.style.top = `${e.y + offset}px`;
	};

	const hideName = (e: string) => {
		if (!nameContainer) return;
		if (e !== name) return;
		name = null;
	};

	const canManage = (permissions: bigint) =>
		(permissions & PermissionFlagsBits.ManageGuild) === PermissionFlagsBits.ManageGuild;

	const pushGuilds = (e: { id: string; y: number }) => {
		guilds = guilds.filter((g) => g.id !== e.id);
		guilds.push(e);
	};

	$effect(() => {
		if (!dotContainer.bar) return;

		const newPos = guilds.find(
			(g) => g.id === ($page.route?.id === '/@me' ? '@me' : $page.params?.guildId),
		);

		if (!newPos) return;

		updateBarPos(0, newPos.y, true);
	});

	afterNavigate((e) => {
		const oldPos = guilds.find(
			(g) => g.id === (e.from?.route.id === '/@me' ? '@me' : e.from?.params?.guildId),
		);
		const newPos = guilds.find(
			(g) => g.id === (e.to?.route.id === '/@me' ? '@me' : e.to?.params?.guildId),
		);

		if (!oldPos) return;
		if (!newPos) return;

		updateBarPos(oldPos.y, newPos.y);
	});
</script>

<svelte:body onmousemove={(e) => (mouseY = e.clientY - offset)} />

<section
	class="bg-main-darker flex flex-col justify-start items-center gap-2 p-2 h-100lvh box-shadow-main z-10
 of-y-scroll of-auto hide-scrollbar"
	onmouseleave={() => hideDot()}
	onscroll={() => scroll()}
	role="navigation"
	bind:this={guildBarSection}
>
	<div
		class="max-w-15 fixed z-5
  before:content-empty before:bg-main-darker before:w-17 before:-left-2 before:h-19 before:absolute
  before:-top-2 after:relative"
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
			onHover={showName}
			onUnhover={hideName}
			onImAt={(e) => pushGuilds({ id: '@me', y: e })}
		/>
	</div>

	<div class="h-80lvh mt-4">
		<div class="content-empty h-15 min-w-15"></div>
		{#each data.guilds?.filter((g) => canManage(BigInt(g.permissions))) as guild, i}
			{#if i !== 0}
				<br class="mt-2.5 content-empty block" />
			{/if}

			<SideBarIcon
				src={guild.icon ?? undefined}
				id={guild.id}
				name={guild.name}
				onHover={showName}
				onUnhover={hideName}
				onImAt={(e) => pushGuilds({ id: guild.id, y: e })}
			/>
		{/each}

		<div class="content-empty h-19"></div>

		<div
			class="h-17 w-19 bg-main-dark fixed rounded-tr-xl hover:box-shadow-main left-0 bottom-0 transition-all
   duration-300 ease-in-out pt-1 group z-6"
			bind:this={profile}
		>
			{#if data.user?.avatar && data.user?.username}
				<button
					aria-label="Log out"
					class="h-full w-full flex flex-row justify-center items-center pb-1"
					onmouseenter={() =>
						showName({ name: 'Log out', y: (profile?.getBoundingClientRect().y ?? 0) + 10 })}
					onmouseleave={() => hideName('Log out')}
					onfocus={() =>
						showName({ name: 'Log out', y: (profile?.getBoundingClientRect().y ?? 0) + 10 })}
					onblur={() => hideName('Log out')}
					onclick={() => logout()}
					onkeydown={(e) => e.key === 'Enter' && logout()}
				>
					<img src={data.user.avatar} class="rounded-full w-15 h-15" alt="" />
				</button>
			{:else}
				<button
					class="w-full h-full m-auto content-empty
     after:content-empty after:bg-[url(/svg/friends.svg)] after:block after:bg-[size:64px]
     after:h-full after:w-full after:-mt-1 after:bg-no-repeat"
					onmouseenter={() =>
						showName({ name: 'Log in', y: (profile?.getBoundingClientRect().y ?? 0) + 10 })}
					onmouseleave={() => hideName('Log in')}
					onfocus={() => showName({ name: 'Log in', y: (profile?.getBoundingClientRect().y ?? 0) + 10 })}
					onblur={() => hideName('Log in')}
					onclick={() => login()}
					onkeydown={(e) => e.key === 'Enter' && login()}
					tabindex="0"
					aria-label="Log in"
				>
					Log in
				</button>
			{/if}
		</div>
	</div>
</section>

<div
	bind:this={nameContainer}
	class="absolute bg-main-darkest left-20 top-50% -translate-y-50% w-fit max-w-[200px]
  whitespace-normal break-words rounded-[5px] border-alt-text border-op-50 border-0.1px
  border-solid px-3 py-1 box-shadow-main font-bold z-10"
	class:hidden={!name}
>
	{name}
</div>

<div
	class="absolute w-2 h-8 bg-main-text/80 -left-2 top-0 content-empty rounded-full z-10 -translate-y-3"
	bind:this={dotContainer.point}
></div>

<div
	class="absolute w-2 h-12 bg-main-text -left-2 top-0 content-empty rounded-full z-10 -translate-y-5"
	bind:this={dotContainer.bar}
></div>

<div class="absolute w-1.5 h-17 bottom-0 left-0 bg-main-dark content-empty z-10"></div>
