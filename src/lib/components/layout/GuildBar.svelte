<script lang="ts">
 import SideBarIcon from '$lib/components/layout/SideBarIcon.svelte';
 import type { LayoutData } from '../../../routes/$types';
 import { canManage, hideDot, setMouse, showName } from './GuildBar.js';
 import clsx from 'clsx';
 import { onMount } from 'svelte';

 const { data, onLogin }: { data: LayoutData; onLogin: () => void } = $props();

 const login = () => onLogin();
 const logout = () => (location.href = '/@me/logout?logout=true');

 let nameContainer: HTMLDivElement | null = $state(null);
 let dotContainer: HTMLDivElement | null = $state(null);
 let currentName: string | null = $state(null);
 let mouseY = $state(0);
 let profile: HTMLDivElement | null = $state(null);
 let guildBarSection: HTMLElement | null = $state(null);
 let scrolled = $state(false);
 let isAnimated = $state(false);

 onMount(() => {
  setTimeout(() => (isAnimated = true), 100);
 });

 const handleScroll = () => {
  if (guildBarSection) {
   scrolled = guildBarSection.scrollTop > 10;
  }
 };
</script>

<svelte:body onmousemove={(e) => setMouse(e.clientY, mouseY)} />

<section
 class={clsx(
  'flex flex-col justify-start items-center gap-3 p-3 h-100lvh',
  'bg-gradient-to-b from-main-darker to-main-darkest',
  'border-r border-white/5 backdrop-blur-xl',
  'overflow-y-auto overflow-x-hidden hide-scrollbar',
  'transition-all duration-300 ease-out',
  'relative z-20',
  isAnimated ? 'w-20 opacity-100' : 'w-0 opacity-0'
 )}
 onmouseleave={() => hideDot(dotContainer!)}
 onscroll={handleScroll}
 role="navigation"
 bind:this={guildBarSection}
>
 <div
  class={clsx(
   'sticky top-0 z-30 pb-3 mb-2',
   'bg-gradient-to-b from-main-darker to-transparent',
   'backdrop-blur-lg',
   scrolled && 'shadow-lg'
  )}
 >
  <div class="relative group">
   <div
    class="absolute inset-0 bg-primary-500/20 rounded-2xl blur-xl group-hover:bg-primary-500/30 transition-all duration-300"
   ></div>
   <SideBarIcon
    src="favicon.png"
    name="My Settings"
    size={48}
    bg
    id="@me"
    variant="home"
    onHover={(e) => {
     showName(e, dotContainer!, nameContainer!);
     currentName = e.name;
    }}
    onUnhover={() => (currentName = null)}
   />
  </div>

  <div class="mt-3 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
 </div>

 <div class="flex-1 flex flex-col gap-3 pb-20">
  {#each data.guilds?.filter((g) => canManage(BigInt(g.permissions))) as guild, i}
   <div
    class="animate-fade-in opacity-0"
    style="animation-delay: {i * 50}ms; animation-fill-mode: forwards;"
   >
    <SideBarIcon
     src={guild.icon ?? undefined}
     id={guild.id}
     name={guild.name}
     variant="guild"
     onHover={(e) => {
      showName(e, dotContainer!, nameContainer!);
      currentName = e.name;
     }}
     onUnhover={() => (currentName = null)}
    />
   </div>
  {/each}

  <div class="mt-auto pt-3 border-t border-white/10">
   <button
    class={clsx(
     'w-12 h-12 rounded-2xl',
     'bg-main-light hover:bg-success/20',
     'border-2 border-dashed border-white/20 hover:border-success/50',
     'flex items-center justify-center',
     'transition-all duration-200 transform hover:scale-110',
     'group'
    )}
    onmouseenter={() => {
     showName({ y: mouseY }, dotContainer!, nameContainer!);
     currentName = 'Add a Server';
    }}
    onmouseleave={() => (currentName = null)}
    aria-label="Add a Server"
   >
    <span class="i-tabler-plus text-2xl text-white/50 group-hover:text-success transition-colors"
    ></span>
   </button>
  </div>
 </div>

 <div
  class={clsx(
   'fixed bottom-0 left-0 h-20 w-20',
   'bg-gradient-to-t from-main-darkest via-main-darker to-transparent',
   'backdrop-blur-xl border-t border-r border-white/10',
   'rounded-tr-2xl',
   'transition-all duration-300 ease-out',
   'group z-30'
  )}
  bind:this={profile}
 >
  {#if data.user?.avatar && data.user?.username}
   <button
    aria-label="User Profile - Click to log out"
    class="h-full w-full flex items-center justify-center p-3 relative"
    onmouseenter={() => {
     showName({ y: (profile?.getBoundingClientRect().y ?? 0) + 10 }, dotContainer!, nameContainer!);
     currentName = `${data.user?.username ?? 'User'} - Click to log out`;
    }}
    onmouseleave={() => (currentName = null)}
    onclick={logout}
    onkeydown={(e) => e.key === 'Enter' && logout()}
   >
    <div class="relative">
     <img
      src={data.user.avatar}
      class="rounded-full w-12 h-12 ring-2 ring-white/10 group-hover:ring-danger/50 transition-all duration-200"
      alt={data.user.username}
     />
     <div
      class="absolute -bottom-1 -right-1 w-3 h-3 bg-success rounded-full ring-2 ring-main-darkest"
     ></div>
    </div>
   </button>
  {:else}
   <button
    class="w-full h-full flex flex-col items-center justify-center gap-1 group"
    onmouseenter={() => {
     showName({ y: (profile?.getBoundingClientRect().y ?? 0) + 10 }, dotContainer!, nameContainer!);
     currentName = 'Log in';
    }}
    onmouseleave={() => (currentName = null)}
    onclick={login}
    onkeydown={(e) => e.key === 'Enter' && login()}
    tabindex="0"
    aria-label="Log in"
   >
    <span
     class="i-tabler-login text-2xl text-emerald-500 group-hover:text-emerald-400 transition-colors"
    ></span>
    <span class="text-xs text-white/50 group-hover:text-white/70">Login</span>
   </button>
  {/if}
 </div>
</section>

<div
 bind:this={nameContainer}
 class={clsx(
  'fixed left-24 z-50',
  'px-3 py-2 rounded-lg',
  'glass-tooltip',
  'text-sm font-medium text-white',
  'pointer-events-none select-none',
  'transition-all duration-200',
  'whitespace-nowrap max-w-[200px] truncate',
  currentName ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
 )}
 style="top: 50%; transform: translateY(-50%);"
>
 {currentName}
</div>

<div
 class={clsx(
  'fixed w-1 h-8 left-0 z-40',
  'bg-gradient-to-b from-primary-400 to-primary-600',
  'rounded-r-full',
  'transition-all duration-150 ease-out',
  'shadow-glow'
 )}
 bind:this={dotContainer}
></div>

<style>
 @keyframes slideIn {
  from {
   transform: translateX(-100%);
   opacity: 0;
  }
  to {
   transform: translateX(0);
   opacity: 1;
  }
 }

 section {
  animation: slideIn 0.3s ease-out;
 }
</style>
