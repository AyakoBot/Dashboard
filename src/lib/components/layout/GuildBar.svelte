<script lang="ts">
	import SideBarIcon from '$lib/components/layout/SideBarIcon.svelte';
	import type { LayoutData } from '../../../routes/$types';

	import { canManage, hideDot, setMouse, showName } from './GuildBar';

	const { data, onLogin }: { data: LayoutData; onLogin: () => void } = $props();

	const login = () => onLogin();
	const logout = () => (location.href = '/@me/logout?logout=true');

	let nameContainer: HTMLDivElement | null = $state(null);
	let dotContainer: HTMLDivElement | null = $state(null);

	let currentName: string | null = $state(null);
	let mouseY = $state(0);

	let profile: HTMLDivElement | null = $state(null);
	let guildBarSection: HTMLElement | null = $state(null);
</script>

<svelte:body onmousemove={(e) => setMouse(e.clientY, mouseY)} />

<section
	class="bg-main-darker flex flex-col justify-start items-center gap-2 p-2 h-100lvh box-shadow-main z-10
 of-y-scroll of-auto hide-scrollbar"
	onmouseleave={() => hideDot(dotContainer!)}
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
			onHover={(e) => {
				showName(e, dotContainer!, nameContainer!);
				currentName = e.name;
			}}
			onUnhover={() => (currentName = null)}
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
				onHover={(e) => {
					showName(e, dotContainer!, nameContainer!);
					currentName = e.name;
				}}
				onUnhover={() => (currentName = null)}
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
					onmouseenter={() => {
						showName(
							{ y: (profile?.getBoundingClientRect().y ?? 0) + 10 },
							dotContainer!,
							nameContainer!,
						);
						currentName = 'Log out';
					}}
					onmouseleave={() => (currentName = null)}
					onfocus={() => {
						showName(
							{ y: (profile?.getBoundingClientRect().y ?? 0) + 10 },
							dotContainer!,
							nameContainer!,
						);
						currentName = 'Log out';
					}}
					onblur={() => (currentName = null)}
					onclick={() => logout()}
					onkeydown={(e) => e.key === 'Enter' && logout()}
				>
					<img src={data.user.avatar} class="rounded-full w-15 h-15" alt="" />
				</button>
			{:else}
				<button
					class="w-full h-full m-auto content-empty"
					onmouseenter={() => {
						showName(
							{ y: (profile?.getBoundingClientRect().y ?? 0) + 10 },
							dotContainer!,
							nameContainer!,
						);
						currentName = 'Log in';
					}}
					onmouseleave={() => (currentName = null)}
					onfocus={() => {
						showName(
							{ y: (profile?.getBoundingClientRect().y ?? 0) + 10 },
							dotContainer!,
							nameContainer!,
						);
						currentName = 'Log in';
					}}
					onblur={() => (currentName = null)}
					onclick={() => login()}
					onkeydown={(e) => e.key === 'Enter' && login()}
					tabindex="0"
					aria-label="Log in"
				>
					Log in
					<span class="i-tabler-login block h-10 w-10 m-auto color-emerald"></span>
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
	class:hidden={!currentName}
>
	{currentName}
</div>

<div
	class="absolute w-2 h-8 bg-main-text/80 -left-2 top-0 content-empty rounded-full z-10 -translate-y-3"
	bind:this={dotContainer}
></div>

<div class="absolute w-1.5 h-17 bottom-0 left-0 bg-main-dark content-empty z-10"></div>
