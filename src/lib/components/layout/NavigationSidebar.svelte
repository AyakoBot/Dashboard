<script lang="ts">
 import { page } from '$app/state';
import { goto, preloadCode, preloadData } from '$app/navigation';
 import { fade, fly, scale } from 'svelte/transition';
 import clsx from 'clsx';
 import type { LayoutData } from '../../../routes/$types.js';
 import ServerSelectionModal from './ServerSelectionModal.svelte';
 import { getGuildIconUrl, getUserAvatarUrl } from '$lib/utils/discord.js';
 import { trackServerVisit, getRecentServers } from '$lib/utils/serverTracking.js';
 
 const { data: incomingData, onLogin }: { data: LayoutData | null; onLogin: () => void } = $props();
const resolvedData = $derived(incomingData ?? null);
const guilds = $derived(resolvedData?.guilds ?? []);
const user = $derived(resolvedData?.user ?? null);
const isDev = $derived(resolvedData?.isDev ?? false);
 
 let collapsed = $state(false);
 let mobileMenuOpen = $state(false);
 let searchQuery = $state('');
 let showServerModal = $state(false);
let recentServers = $state(getRecentServers());

const preloadRoute = (path: string) => {
	preloadCode(path);
	preloadData(path);
};

const navigationItems = [
 {
  id: 'dashboard',
  label: 'Dashboard',
  icon: 'i-tabler-layout-dashboard',
  path: '/@me',
  description: 'Overview and quick actions',
  badge: null,
 },
 {
  id: 'reminders',
  label: 'Reminders',
  icon: 'i-tabler-bell',
  path: '/@me/reminders',
  description: 'Manage your reminders',
  badge: null,
 },
 {
  id: 'rp-commands',
  label: 'RP Commands',
  icon: 'i-tabler-terminal-2',
  path: '/@me/rp-commands',
  description: 'Role-play command settings',
  badge: null,
 },
 {
  id: 'short-urls',
  label: 'Short URLs',
  icon: 'i-tabler-link',
  path: '/@me/short-urls',
  description: 'Create and manage short URLs',
  badge: null,
 },
 {
  id: 'bot-settings',
  label: 'Bot Settings',
  icon: 'i-tabler-settings',
  path: '/@me/bot',
  description: 'Configure bot settings',
  badge: null,
 },
 ];
 
 // Add dev-only items if user is a developer
 const devItems = $derived(isDev ? [
  {
   id: 'designs',
   label: 'Design System',
   icon: 'i-tabler-palette',
   path: '/@me/designs',
   description: 'View all design tokens & components',
   badge: 'DEV',
  },
  {
   id: 'errors',
   label: 'Error Testing',
   icon: 'i-tabler-bug',
   path: '/@me/errors',
   description: 'Test error pages',
   badge: 'DEV',
  },
 ] : []);
 
 const allNavigationItems = $derived([...navigationItems, ...devItems]);
 
 const filteredItems = $derived(
 allNavigationItems.filter(item =>
  item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
  item.description.toLowerCase().includes(searchQuery.toLowerCase())
 )
 );
 
 const handleKeyboard = (e: KeyboardEvent) => {
 if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
  e.preventDefault();
  const searchInput = document.getElementById('nav-search');
  searchInput?.focus();
 }
 if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
  e.preventDefault();
  collapsed = !collapsed;
 }
 if ((e.metaKey || e.ctrlKey) && e.key === 'g') {
  e.preventDefault();
  showServerModal = true;
 }
 };
 
 const isActive = (path: string): boolean => {
 return page.url.pathname === path || page.url.pathname.startsWith(`${path}/`);
 };
 
 interface GuildInfo {
  id: string;
  name: string;
  icon: string | null;
 }

const handleGuildClick = (guild: GuildInfo) => {
 // If icon is already a full URL (from recent servers), use it as is
 const iconUrl = guild.icon?.startsWith('http') ? guild.icon : getGuildIconUrl(guild.id, guild.icon);
 trackServerVisit(guild.id, guild.name, iconUrl);
 recentServers = getRecentServers();
 collapsed = true;
 goto(`/guilds/${guild.id}`);
};

const handleNavClick = async (event: MouseEvent, path: string) => {
	event.preventDefault();
	mobileMenuOpen = false;
	if (page.url.pathname === path) return;
	await goto(path);
};

</script>

<svelte:window onkeydown={handleKeyboard} />

<button
 onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
 class={clsx(
 'fixed top-4 left-4 z-50 p-2 rounded-lg',
 'lg:hidden',
 'glass backdrop-blur-xl',
 'hover:bg-white/10 transition-all duration-200'
 )}
 aria-label="Toggle menu"
>
 {#if mobileMenuOpen}
 <span class="i-tabler-x text-xl"></span>
 {:else}
 <span class="i-tabler-menu-2 text-xl"></span>
 {/if}
</button>

<aside
 class={clsx(
 'fixed lg:sticky top-0 h-screen z-40',
 'bg-gradient-to-b from-main-darker/95 to-main-darkest/95',
 'backdrop-blur-xl border-r border-white/5',
 'transition-all duration-300 ease-out',
 'flex flex-col',
 collapsed && !mobileMenuOpen ? 'w-20' : 'w-72',
 'max-lg:w-72',
 mobileMenuOpen ? 'translate-x-0' : 'max-lg:-translate-x-full'
 )}
>
 <div class="p-4 border-b border-white/5">
 {#if !collapsed || mobileMenuOpen}
  <button
  onclick={() => (collapsed = !collapsed)}
  class={clsx(
   'w-full flex items-center gap-3 rounded-xl p-2 -m-2',
   'hover:bg-white/5 transition-all duration-300',
   'group relative'
  )}
  aria-label="Toggle sidebar"
  >
  <div class="relative flex-shrink-0">
   <img src="/favicon.png" alt="Ayako" class="w-10 h-10 rounded-xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3" />
   <div class="absolute inset-0 bg-gradient-to-br from-primary-400/20 to-accent-400/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
  </div>
  <div class="flex-1 text-left" transition:fade={{ duration: 200 }}>
   <h1 class="text-lg font-semibold text-white group-hover:text-primary-300 transition-colors">Ayako Dashboard</h1>
   <p class="text-xs text-white/60">Manage your Discord bot</p>
  </div>
  </button>
 {:else}
 <button
  onclick={() => (collapsed = !collapsed)}
  class={clsx(
   'w-full flex flex-col items-center gap-1 rounded-xl p-2',
   'transition-all duration-300',
   'group relative'
  )}
  aria-label="Toggle sidebar"
  >
  <div class="relative flex-shrink-0">
   <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center transition-all duration-300 group-hover:scale-110">
    <span class="i-tabler-chevron-right text-xl text-white transition-transform duration-300 group-hover:translate-x-0.5"></span>
   </div>
  </div>
  <kbd class="text-[11px] text-white/50 font-mono">Ctrl+B</kbd>
 </button>
 {/if}
 </div>
 
 {#if !collapsed || mobileMenuOpen}
 <div class="p-4" transition:fly={{ y: -10, duration: 200 }}>
  <div class="relative">
  <span class="absolute left-3 top-1/2 -translate-y-1/2 i-tabler-search text-white/40 text-sm"></span>
  <input
   id="nav-search"
   type="text"
   bind:value={searchQuery}
   placeholder="Search menu... (⌘K)"
   class={clsx(
   'w-full pl-9 pr-3 py-2 rounded-lg',
   'bg-white/5 border border-white/10',
   'text-sm text-white placeholder-white/40',
   'focus:bg-white/10 focus:border-primary-400/50',
   'focus:outline-none focus:ring-2 focus:ring-primary-400/20',
   'transition-all duration-200'
   )}
  />
  </div>
 </div>
 {/if}
 
 <nav class="flex-1 overflow-y-auto p-4 space-y-1" data-sveltekit-preload-code="hover">
 {#each filteredItems as item, i (item.id)}
		<a
			href={item.path}
			onpointerenter={() => preloadRoute(item.path)}
			onclick={(event) => handleNavClick(event, item.path)}
		class={clsx(
			'group relative flex items-center gap-3 px-3 py-2 rounded-lg',
			'transition-all duration-200',
   'hover:translate-x-0.5',
   collapsed && !mobileMenuOpen && 'justify-center px-2',
   isActive(item.path)
   ? 'bg-primary-500/20 text-primary-300 shadow-lg'
   : 'hover:bg-white/5 text-white/70 hover:text-white'
  )}
  style="animation-delay: {i * 50}ms"
  >
  {#if isActive(item.path)}
   <div class="absolute left-0 top-0 bottom-0 w-1 bg-primary-400"></div>
  {/if}
  
  {#if item.id === 'dashboard'}
   <span class="i-tabler-layout-dashboard text-xl flex-shrink-0 block {collapsed && !mobileMenuOpen ? 'mx-auto' : ''}"></span>
  {:else if item.id === 'reminders'}
   <span class="i-tabler-bell text-xl flex-shrink-0 block {collapsed && !mobileMenuOpen ? 'mx-auto' : ''}"></span>
  {:else if item.id === 'rp-commands'}
   <span class="i-tabler-terminal-2 text-xl flex-shrink-0 block {collapsed && !mobileMenuOpen ? 'mx-auto' : ''}"></span>
  {:else if item.id === 'short-urls'}
   <span class="i-tabler-link text-xl flex-shrink-0 block {collapsed && !mobileMenuOpen ? 'mx-auto' : ''}"></span>
  {:else if item.id === 'designs'}
   <span class="i-tabler-palette text-xl flex-shrink-0 block {collapsed && !mobileMenuOpen ? 'mx-auto' : ''}"></span>
  {:else if item.id === 'bot-settings'}
   <span class="i-tabler-settings text-xl flex-shrink-0 block {collapsed && !mobileMenuOpen ? 'mx-auto' : ''}"></span>
  {:else if item.id === 'errors'}
   <span class="i-tabler-bug text-xl flex-shrink-0 block {collapsed && !mobileMenuOpen ? 'mx-auto' : ''}"></span>
  {/if}
  
  {#if !collapsed || mobileMenuOpen}
   <div class="flex-1 min-w-0" transition:fly={{ x: -10, duration: 200 }}>
   <div class="flex items-center justify-between">
    <span class="font-medium text-sm">{item.label}</span>
    {#if item.badge}
    <span class={clsx(
     'px-1.5 py-0.5 rounded-full text-xs',
     'bg-primary-500/20 text-primary-300',
     'animate-pulse'
    )}>
     {item.badge}
    </span>
    {/if}
   </div>
   <p class="text-xs text-white/50 truncate">{item.description}</p>
   </div>
  {/if}
  
  {#if collapsed && !mobileMenuOpen}
   <div class={clsx(
   'absolute left-full ml-3 px-3 py-2 rounded-lg',
   'bg-main-darker/95 backdrop-blur-sm border border-white/10',
   'opacity-0 group-hover:opacity-100',
   'pointer-events-none transition-all duration-200',
   'whitespace-nowrap z-50',
   'shadow-2xl',
   'before:content-[""] before:absolute before:right-full before:top-1/2 before:-translate-y-1/2',
   'before:border-4 before:border-transparent before:border-r-main-darker/95'
   )}
   role="tooltip"
   aria-hidden="true"
   >
   <div class="text-sm font-medium text-white mb-0.5">{item.label}</div>
   <div class="text-xs text-white/60">{item.description}</div>
   </div>
  {/if}
  </a>
 {/each}
 </nav>
 
{#if guilds.length > 0}
<div class="p-4 border-t border-white/5">
 {#if !collapsed || mobileMenuOpen}
 <div class="mb-3 flex items-center justify-between" transition:fade={{ duration: 200 }}>
  <h3 class="text-xs uppercase text-white/40 font-medium">Your Servers</h3>
  <span class="text-xs text-white/40">{guilds.length} total</span>
 </div>
 {/if}
 
 <div class="space-y-3">
  <div class={clsx(
   'flex gap-2',
   collapsed && !mobileMenuOpen ? 'flex-col' : 'flex-row flex-wrap'
  )}>
   {#each recentServers as server, i}
  {@const guild = guilds.find(g => g.id === server.id)}
   {#if guild}
   <button
    onclick={() => handleGuildClick({ id: server.id, name: server.name, icon: server.icon })}
    class={clsx(
    'group relative block',
    collapsed && !mobileMenuOpen ? 'w-12 h-12 mx-auto' : 'w-10 h-10',
    'rounded-xl overflow-hidden',
    'ring-2 ring-transparent hover:ring-primary-400/50',
    'transition-all duration-200 transform hover:scale-110',
    'bg-neutral-800',
    'shadow-lg hover:shadow-xl hover:shadow-primary-500/20'
    )}
    style="animation: fadeIn 0.3s ease-out {i * 50}ms both"
   >
    {#if server.icon}
    <img src={server.icon} alt={server.name} class="w-full h-full object-cover" style="aspect-ratio: 1/1;" />
    {:else}
    <div class="w-full h-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
     <span class="text-white text-xs font-bold">
     {server.name.slice(0, 2).toUpperCase()}
     </span>
    </div>
    {/if}
    
    {#if collapsed && !mobileMenuOpen}
    <div class={clsx(
    'absolute left-full ml-3 px-3 py-2 rounded-lg',
    'bg-main-darker/95 backdrop-blur-sm border border-white/10',
    'opacity-0 group-hover:opacity-100',
    'pointer-events-none transition-all duration-200',
    'whitespace-nowrap z-50',
    'shadow-2xl'
    )}>
     <div class="text-sm font-medium text-white mb-0.5">{server.name}</div>
     <div class="text-xs text-white/60">
      {guild.memberCount ? `${guild.memberCount.toLocaleString()} members` : 'Click to manage'}
     </div>
    </div>
    {:else}
    <div class={clsx(
    'absolute left-full ml-2 px-2 py-1 rounded',
    'bg-main-darker border border-white/10',
    'opacity-0 group-hover:opacity-100',
    'pointer-events-none transition-opacity',
    'whitespace-nowrap z-50',
    'text-xs text-white'
    )}>
    {server.name}
    </div>
    {/if}
   </button>
   {/if}
   {/each}
  </div>
  
  <button
   onclick={() => showServerModal = true}
   class={clsx(
   'w-full flex items-center gap-2 px-3 py-2 rounded-lg',
   'bg-gradient-to-r from-primary-500/10 to-accent-500/10',
   'border border-white/10 hover:border-primary-400/30',
   'transition-all duration-200',
   'text-sm text-white/70 hover:text-white',
   'hover:bg-primary-500/20',
   'group',
   collapsed && !mobileMenuOpen && 'px-2 justify-center'
   )}
   aria-label="Browse all servers (Ctrl+G)"
  >
   <span class="i-tabler-grid-dots text-lg group-hover:rotate-90 transition-transform duration-300"></span>
  {#if !collapsed || mobileMenuOpen}
  <span class="flex-1 text-left">Browse All Servers</span>
  <span class="text-xs bg-white/10 px-2 py-0.5 rounded">{guilds.length}</span>
  <span class="i-tabler-chevron-right text-xs opacity-50 group-hover:opacity-100"></span>
  {:else}
    <div class={clsx(
    'absolute left-full ml-3 px-3 py-2 rounded-lg',
    'bg-main-darker/95 backdrop-blur-sm border border-white/10',
    'opacity-0 group-hover:opacity-100',
    'pointer-events-none transition-all duration-200',
    'whitespace-nowrap z-50',
    'shadow-2xl'
   )}>
    <div class="text-sm font-medium text-white mb-0.5">Browse All Servers</div>
    <div class="text-xs text-white/60">{guilds.length} servers • Press Ctrl+G</div>
  </div>
  {/if}
 </button>
  </div>
 </div>
 {/if}
 
<div class="p-4 border-t border-white/5">
{#if user}
  <div class={clsx(
  'flex items-center gap-3 p-2 rounded-lg',
  'hover:bg-white/5 transition-all cursor-pointer',
  collapsed && !mobileMenuOpen && 'justify-center'
  )}>
  <img 
   src={user.avatar || '/favicon.png'} 
   alt={user.username}
   class="w-8 h-8 rounded-full ring-2 ring-white/10"
  />
  {#if !collapsed || mobileMenuOpen}
   <div class="flex-1 min-w-0" transition:fade={{ duration: 200 }}>
   <div class="text-sm font-medium text-white truncate">{user.username}</div>
   <div class="text-xs text-white/50">Click to sign out</div>
   </div>
   <button
   onclick={() => location.href = '/@me/logout?logout=true'}
   class="p-1 rounded hover:bg-white/10 transition-colors"
   aria-label="Sign out"
   >
   <span class="i-tabler-logout text-sm text-white/50"></span>
   </button>
  {/if}
  </div>
 {:else}
  <button
  onclick={onLogin}
  class={clsx(
   'w-full px-4 py-2 rounded-lg',
   'bg-primary-500 hover:bg-primary-600',
   'text-white font-medium text-sm',
   'transition-all duration-200 transform hover:scale-105',
   'flex items-center justify-center gap-2'
  )}
  >
  <span class="i-tabler-login"></span>
  {#if !collapsed || mobileMenuOpen}
   <span>Sign In</span>
  {/if}
  </button>
 {/if}
 </div>
</aside>

<ServerSelectionModal
 isOpen={showServerModal}
 servers={guilds.map(g => ({
 id: g.id,
 name: g.name,
 icon: getGuildIconUrl(g.id, g.icon) || undefined,
 memberCount: undefined,
 isOwner: g.owner,
 isFavorite: false,
 permissions: g.permissions,
 hasNotifications: false
 })) || []}
 onClose={() => showServerModal = false}
 onSelect={(server) => {
 collapsed = true;
 goto(`/guilds/${server.id}`);
 }}
/>

{#if mobileMenuOpen}
 <button
 class="fixed inset-0 bg-black/50 z-30 lg:hidden"
 onclick={() => (mobileMenuOpen = false)}
 transition:fade={{ duration: 200 }}
 aria-label="Close mobile menu"
 ></button>
{/if}

<style>
@keyframes fadeIn {
 from {
  opacity: 0;
  transform: translateY(10px);
 }
 to {
  opacity: 1;
  transform: translateY(0);
 }
}
</style>
