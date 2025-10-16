<script lang="ts">
 import { getFavoriteServers, toggleFavoriteServer } from '$lib/utils/serverFavorites.js';
 import { trackServerVisit } from '$lib/utils/serverTracking.js';
 import clsx from 'clsx';
 import { flip } from 'svelte/animate';
 import { fade, scale } from 'svelte/transition';

 interface Server {
  id: string;
  name: string;
  icon?: string;
  memberCount?: number;
  isOwner?: boolean;
  isFavorite?: boolean;
  category?: 'Managed' | 'General';
  hasNotifications?: boolean;
  permissions?: string;
 }

 interface Props {
  isOpen: boolean;
  servers: Server[];
  onClose: () => void;
  onSelect: (server: Server) => void;
 }

 let { isOpen, servers = [], onClose, onSelect }: Props = $props();

 let searchQuery = $state('');
 let selectedCategory = $state<string>('Managed');
 let hoveredServerId = $state<string | null>(null);
 let selectedIndex = $state(0);
 let favoriteServerIds = $state<Set<string>>(new Set());
 let serverElements = $state<Map<string, HTMLElement>>(new Map());
 let scrollTimeout: ReturnType<typeof setTimeout> | null = null;

 const canManage = (permissions: string | undefined) => {
  if (!permissions) return false;
  const perms = BigInt(permissions);
  const ManageGuild = 0x0000000020n;
  return (perms & ManageGuild) === ManageGuild;
 };

 let categorizedServers = $derived(() => {
  return servers.map((server) => ({
   ...server,
   category: canManage(server.permissions) ? 'Managed' : 'General'
  }));
 });

 let categories = $derived(() => {
  return ['Managed', 'General'];
 });

 let filteredServers = $derived(() => {
  let filtered = categorizedServers().map((s) => ({
   ...s,
   isFavorite: favoriteServerIds.has(s.id)
  }));

  if (searchQuery) {
   const query = searchQuery.toLowerCase();
   filtered = filtered.filter((s) => s.name.toLowerCase().includes(query));
  }

  filtered = filtered.filter((s) => s.category === selectedCategory);

  filtered = [...filtered].sort((a, b) => {
   if (a.isFavorite && !b.isFavorite) return -1;
   if (!a.isFavorite && b.isFavorite) return 1;
   return a.name.localeCompare(b.name);
  });

  return filtered;
 });

 let serverGroups = $derived(() => {
  const groups: Record<string, Server[]> = {};

  filteredServers().forEach((server) => {
   const key = server.isFavorite ? 'Favorites' : server.name[0].toUpperCase();

   if (!groups[key]) groups[key] = [];
   groups[key].push(server);
  });

  return groups;
 });

 let stats = $derived(() => ({
  total: servers.length,
  filtered: filteredServers().length,
  favorites: favoriteServerIds.size,
  owned: servers.filter((s) => s.isOwner).length,
  managed: servers.filter((s) => canManage(s.permissions)).length
 }));

 const scrollToSelectedServer = () => {
  setTimeout(() => {
   const serverList = filteredServers();
   const selectedServer = serverList[selectedIndex];

   if (!selectedServer) return;

   const element = document.querySelector(`[data-server-id="${selectedServer.id}"]`) as HTMLElement;

   if (!element) return;

   // Find the scroll container - it's the div with overflow-y-auto class
   const scrollContainer = document.querySelector(
    '[role="dialog"] .overflow-y-auto'
   ) as HTMLElement;

   if (!scrollContainer) {
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
   }

   const containerRect = scrollContainer.getBoundingClientRect();
   const elementRect = element.getBoundingClientRect();

   const elementTopRelative = elementRect.top - containerRect.top;
   const elementBottomRelative = elementRect.bottom - containerRect.top;

   const padding = 20;
   const visibleTop = padding;
   const visibleBottom = containerRect.height - padding;

   let needsScroll = false;
   let targetScrollTop = scrollContainer.scrollTop;

   if (elementTopRelative < visibleTop) {
    // Element is above the visible area - scroll up
    needsScroll = true;
    // Calculate how much to scroll up
    const scrollDistance = elementTopRelative - visibleTop;
    targetScrollTop = scrollContainer.scrollTop + scrollDistance;
   } else if (elementBottomRelative > visibleBottom) {
    // Element is below the visible area - scroll down
    needsScroll = true;
    // Calculate how much to scroll down
    const scrollDistance = elementBottomRelative - visibleBottom;
    targetScrollTop = scrollContainer.scrollTop + scrollDistance;
   }

   if (needsScroll) {
    // Ensure target is within bounds
    targetScrollTop = Math.max(
     0,
     Math.min(targetScrollTop, scrollContainer.scrollHeight - scrollContainer.clientHeight)
    );

    // Perform the scroll
    scrollContainer.scrollTo({
     top: targetScrollTop,
     behavior: 'smooth'
    });
   }
  }, 0);
 };

 const handleKeyDown = (e: KeyboardEvent) => {
  if (!isOpen) return;

  const serverList = filteredServers();
  const searchInput = document.getElementById('server-search') as HTMLInputElement;
  const isSearchFocused = document.activeElement === searchInput;

  switch (e.key) {
   case 'ArrowDown':
    e.preventDefault();
    e.stopPropagation();
    if (isSearchFocused) {
     searchInput.blur();
     selectedIndex = 0;
    } else {
     selectedIndex = Math.min(selectedIndex + 1, serverList.length - 1);
    }
    scrollToSelectedServer();
    break;
   case 'ArrowUp':
    e.preventDefault();
    e.stopPropagation();
    if (isSearchFocused) {
     searchInput.blur();
     selectedIndex = Math.max(serverList.length - 1, 0);
    } else {
     selectedIndex = Math.max(selectedIndex - 1, 0);
    }
    scrollToSelectedServer();
    break;
   case 'Enter':
    e.preventDefault();
    e.stopPropagation();
    if (!isSearchFocused && serverList[selectedIndex]) {
     handleServerSelect(serverList[selectedIndex]);
    }
    break;
   case 'Escape':
    e.preventDefault();
    e.stopPropagation();
    if (isSearchFocused) {
     searchInput.blur();
    } else {
     onClose();
    }
    break;
  }
 };

 const handleServerSelect = (server: Server) => {
  // Don't allow selecting servers from General category (no manage permissions)
  if (server.category === 'General') {
   return;
  }
  trackServerVisit(server.id, server.name, server.icon || null);
  onSelect(server);
  onClose();
  searchQuery = '';
  selectedIndex = 0;
 };

 const toggleFavorite = (e: Event, server: Server) => {
  e.stopPropagation();
  const newState = toggleFavoriteServer(server.id);
  if (newState) {
   favoriteServerIds.add(server.id);
  } else {
   favoriteServerIds.delete(server.id);
  }
  favoriteServerIds = new Set(favoriteServerIds);
 };

 const resetFilters = () => {
  searchQuery = '';
  selectedCategory = 'Managed';
  selectedIndex = 0;
 };

 function registerServerElement(node: HTMLElement, serverId: string) {
  serverElements.set(serverId, node);
  serverElements = new Map(serverElements);

  // Add data attribute for fallback selection
  node.setAttribute('data-server-id', serverId);

  return {
   update(newServerId: string) {
    // Handle updates if server ID changes
    if (newServerId !== serverId) {
     serverElements.delete(serverId);
     serverElements.set(newServerId, node);
     serverElements = new Map(serverElements);
     node.setAttribute('data-server-id', newServerId);
     serverId = newServerId;
    }
   },
   destroy() {
    serverElements.delete(serverId);
    serverElements = new Map(serverElements);
    node.removeAttribute('data-server-id');
   }
  };
 }

 $effect(() => {
  if (isOpen) {
   favoriteServerIds = getFavoriteServers();
   // Reset selected index when modal opens
   selectedIndex = 0;
   // Clear search and reset scroll position
   searchQuery = '';

   setTimeout(() => {
    const searchInput = document.getElementById('server-search');
    searchInput?.focus();

    // Reset scroll position of the container
    const scrollContainer = document.querySelector('[role="dialog"] .overflow-y-auto');
    if (scrollContainer) {
     scrollContainer.scrollTop = 0;
    }
   }, 100);
  } else {
   // Clear timeout when modal closes
   if (scrollTimeout) {
    clearTimeout(scrollTimeout);
    scrollTimeout = null;
   }
  }
 });

 // Reset selected index when filters change to prevent out-of-bounds selection
 $effect(() => {
  const serverList = filteredServers();
  // Keep selected index within bounds
  if (selectedIndex >= serverList.length) {
   selectedIndex = Math.max(0, serverList.length - 1);
  }
  // Optional: maintain selection on the same server if it's still in the filtered list
  // This improves UX when filters change but the selected server is still visible
 });
</script>

<svelte:window on:keydown={handleKeyDown} />

{#if isOpen}
 <button
  class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
  onclick={onClose}
  transition:fade={{ duration: 200 }}
  aria-label="Close modal"
 ></button>
 <div
  class="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
  transition:fade={{ duration: 200 }}
 >
  <div
   class={clsx(
    'bg-neutral-900/95 backdrop-blur-xl rounded-2xl',
    'border border-white/10 shadow-2xl',
    'w-full max-w-4xl max-h-[85vh]',
    'flex flex-col pointer-events-auto'
   )}
   onclick={(e) => e.stopPropagation()}
   onkeydown={handleKeyDown}
   role="dialog"
   aria-modal="true"
   aria-labelledby="server-modal-title"
   tabindex="-1"
   transition:scale={{ duration: 200, start: 0.95 }}
  >
   <div class="p-6 border-b border-white/10">
    <div class="flex items-center justify-between mb-4">
     <div>
      <h2 id="server-modal-title" class="text-2xl font-bold text-white">Select Server</h2>
      <p class="text-sm text-white/60 mt-1">
       {stats().filtered} of {stats().total} servers •
       {stats().favorites} favorites •
       {stats().owned} owned •
       {stats().managed} managed
      </p>
     </div>
     <button
      onclick={onClose}
      class="p-2 rounded-lg hover:bg-white/10 transition-colors"
      aria-label="Close"
     >
      <span class="i-tabler-x text-xl text-white/60"></span>
     </button>
    </div>
    <div class="relative">
     <span class="absolute left-3 top-1/2 -translate-y-1/2 i-tabler-search text-white/40"></span>
     <input
      id="server-search"
      type="text"
      bind:value={searchQuery}
      placeholder="Search servers..."
      class={clsx(
       'w-full pl-10 pr-4 py-3 rounded-xl',
       'bg-white/5 border border-white/10',
       'text-white placeholder-white/40',
       'focus:bg-white/10 focus:border-primary/50',
       'focus:outline-none focus:ring-2 focus:ring-primary/20',
       'transition-all duration-200'
      )}
     />
     {#if searchQuery}
      <button
       onclick={() => (searchQuery = '')}
       class="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-white/10"
       aria-label="Clear search"
      >
       <span class="i-tabler-x text-sm text-white/60"></span>
      </button>
     {/if}
    </div>
    <div class="flex flex-wrap gap-2 mt-4">
     <div class="flex items-center gap-1 p-1 bg-white/5 rounded-lg">
      {#each categories() as category}
       <button
        onclick={() => (selectedCategory = category)}
        class={clsx(
         'px-3 py-1.5 rounded-md text-sm font-medium transition-all',
         selectedCategory === category
          ? 'bg-primary/20 text-primary'
          : 'text-white/60 hover:text-white hover:bg-white/10'
        )}
       >
        {category}
        {#if category === 'Managed'}
         <span class="i-tabler-shield-check ml-1 text-xs"></span>
        {/if}
       </button>
      {/each}
     </div>
     {#if searchQuery || selectedCategory !== 'Managed'}
      <button
       onclick={resetFilters}
       class="px-3 py-1.5 rounded-lg text-sm font-medium bg-white/5 text-white/60 hover:bg-white/10 transition-all"
      >
       <span class="i-tabler-filter-x text-sm mr-1"></span>
       Reset
      </button>
     {/if}
    </div>
   </div>
   <div class="flex-1 overflow-y-auto p-6 space-y-6">
    {#if filteredServers().length === 0}
     <div class="text-center py-12">
      <span class="i-tabler-search-off text-4xl text-white/20 mb-4"></span>
      <p class="text-white/60">No servers found</p>
      <p class="text-sm text-white/40 mt-2">Try adjusting your filters</p>
     </div>
    {:else}
     {@const allFilteredServers = filteredServers()}
     {#each Object.entries(serverGroups()) as [groupName, groupServers]}
      <div>
       <h3 class="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">
        {groupName}
       </h3>
       <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {#each groupServers as server, index (server.id)}
         {@const flatIndex = allFilteredServers.findIndex((s) => s.id === server.id)}
         <div
          use:registerServerElement={server.id}
          class={clsx(
           'group relative p-4 rounded-2xl',
           'transition-all duration-300 transform-gpu',
           'flex items-center gap-4',
           flatIndex === selectedIndex
            ? [
               'bg-gradient-to-br from-primary/25 via-primary/20 to-accent/15',
               'border-2 border-primary/60',
               'ring-2 ring-primary/40 ring-offset-2 ring-offset-neutral-900',
               'shadow-xl shadow-primary/30 scale-[1.02]'
              ]
            : [
               'bg-gradient-to-br from-white/[0.08] to-white/[0.02]',
               'border border-white/10',
               'hover:bg-gradient-to-br hover:from-white/[0.12] hover:to-white/[0.06]',
               'hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10',
               'hover:scale-[1.01] hover:ring-2 hover:ring-primary/20'
              ],
           hoveredServerId === server.id && flatIndex !== selectedIndex && 'ring-2 ring-primary/30'
          )}
          onmouseenter={() => (hoveredServerId = server.id)}
          onmouseleave={() => (hoveredServerId = null)}
          role="listitem"
          animate:flip={{ duration: 300 }}
         >
          {#if server.category === 'General'}
           <div
            class="relative flex items-center gap-4 flex-1 text-left opacity-50 cursor-not-allowed"
            title="You don't have permission to manage this server"
           >
            <div class="relative flex-shrink-0">
             {#if server.icon}
              <div class="w-14 h-14 rounded-2xl overflow-hidden bg-neutral-800 shadow-lg">
               <img
                src={server.icon}
                alt={server.name}
                class="w-full h-full object-cover"
                style="aspect-ratio: 1/1;"
               />
              </div>
             {:else}
              <div
               class="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/30 via-blue-500/30 to-cyan-500/30 flex items-center justify-center shadow-lg"
              >
               <span class="text-xl font-bold text-white">
                {server.name.slice(0, 2).toUpperCase()}
               </span>
              </div>
             {/if}

             {#if server.hasNotifications}
              <span
               class="absolute -top-1.5 -right-1.5 w-4 h-4 bg-gradient-to-br from-red-500 to-rose-600 rounded-full ring-2 ring-neutral-900 animate-pulse shadow-lg shadow-red-500/50"
              ></span>
             {/if}
            </div>
            <div class="flex-1 min-w-0 pr-16">
             <div class="flex items-center gap-2">
              <p class="font-semibold text-white truncate max-w-[120px]">
               {server.name}
              </p>
              {#if server.isOwner}
               <span class="i-tabler-crown text-yellow-400 text-sm flex-shrink-0"></span>
              {/if}
              {#if server.category === 'Managed'}
               <span class="i-tabler-shield-check text-blue-400 text-sm flex-shrink-0"></span>
              {/if}
             </div>
             {#if server.memberCount}
              <p class="text-sm text-white/50 flex items-center gap-1 mt-0.5">
               <span class="i-tabler-users text-xs"></span>
               {server.memberCount.toLocaleString()} members
              </p>
             {/if}
            </div>
           </div>
          {:else}
           <button
            onclick={() => handleServerSelect(server)}
            class="flex items-center gap-4 flex-1 text-left"
           >
            <div class="relative flex-shrink-0">
             {#if server.icon}
              <div class="w-14 h-14 rounded-2xl overflow-hidden bg-neutral-800 shadow-lg">
               <img
                src={server.icon}
                alt={server.name}
                class="w-full h-full object-cover"
                style="aspect-ratio: 1/1;"
               />
              </div>
             {:else}
              <div
               class="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/30 via-blue-500/30 to-cyan-500/30 flex items-center justify-center shadow-lg"
              >
               <span class="text-xl font-bold text-white">
                {server.name.slice(0, 2).toUpperCase()}
               </span>
              </div>
             {/if}

             {#if server.hasNotifications}
              <span
               class="absolute -top-1.5 -right-1.5 w-4 h-4 bg-gradient-to-br from-red-500 to-rose-600 rounded-full ring-2 ring-neutral-900 animate-pulse shadow-lg shadow-red-500/50"
              ></span>
             {/if}
            </div>
            <div class="flex-1 min-w-0 pr-16">
             <div class="flex items-center gap-2">
              <p class="font-semibold text-white truncate max-w-[120px]">
               {server.name}
              </p>
              {#if server.isOwner}
               <span class="i-tabler-crown text-yellow-400 text-sm flex-shrink-0"></span>
              {/if}
              {#if server.category === 'Managed'}
               <span class="i-tabler-shield-check text-blue-400 text-sm flex-shrink-0"></span>
              {/if}
             </div>
             {#if server.memberCount}
              <p class="text-sm text-white/50 flex items-center gap-1 mt-0.5">
               <span class="i-tabler-users text-xs"></span>
               {server.memberCount.toLocaleString()} members
              </p>
             {/if}
            </div>
           </button>
          {/if}
          {#if server.category !== 'General'}
           <button
            onclick={(e) => toggleFavorite(e, server)}
            class={clsx(
             'absolute top-1/2 -translate-y-1/2 right-4 p-2 rounded-lg transition-all duration-300 z-20',
             'hover:bg-white/10 hover:scale-110 group/star'
            )}
            aria-label={server.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
           >
            <div class="relative w-5 h-5 flex items-center justify-center">
             {#if server.isFavorite}
              <span
               class="i-tabler-star-filled text-xl text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]"
              ></span>
             {:else}
              <span class="i-tabler-star text-xl text-white/30 block group-hover/star:hidden"
              ></span>
              <span
               class="i-tabler-star-filled text-xl text-yellow-400 hidden group-hover/star:block absolute inset-0 drop-shadow-[0_0_8px_rgba(250,204,21,0.3)]"
              ></span>
             {/if}
            </div>
           </button>
          {:else}
           <div class="absolute top-1/2 -translate-y-1/2 right-4 p-2">
            <span class="i-tabler-lock text-xl text-white/20" title="No manage permissions"></span>
           </div>
          {/if}
         </div>
        {/each}
       </div>
      </div>
     {/each}
    {/if}
   </div>
   <div class="p-4 border-t border-white/10 flex items-center justify-between">
    <div class="text-xs text-white/40">
     <kbd class="px-1.5 py-0.5 bg-white/10 rounded">↑↓</kbd> Navigate
     <kbd class="px-1.5 py-0.5 bg-white/10 rounded ml-2">Enter</kbd> Select
     <kbd class="px-1.5 py-0.5 bg-white/10 rounded ml-2">Esc</kbd> Close
    </div>
    <button
     onclick={onClose}
     class="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-all"
    >
     Cancel
    </button>
   </div>
  </div>
 </div>
{/if}
