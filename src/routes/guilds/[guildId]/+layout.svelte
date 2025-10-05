<script lang="ts">
 import SettingsButton from '$lib/components/generic/SettingsButton.svelte';
 import type { Snippet } from 'svelte';
 import type { LayoutData } from './$types';
 import { page } from '$app/state';
 import { onMount } from 'svelte';
 import { trackServerVisit } from '$lib/utils/serverTracking.js';
 import { getGuildIconUrl } from '$lib/utils/discord.js';

 const { children, data }: { children: Snippet; data: LayoutData } = $props();
 const guild = data.guilds?.find((g) => g.id === page.params.guildId);
 const baseURL = `/guilds/${page.params.guildId}`;
 
 onMount(() => {
  if (guild) {
   const iconUrl = guild.icon ? getGuildIconUrl(guild.id, guild.icon) : null;
   trackServerVisit(guild.id, guild.name, iconUrl);
  }
 });
</script>

<div class="h-100vh w-full flex flex-row justify-start items-start overflow-hidden">
 <section
 class="bg-gradient-to-b from-main-darker to-main-darkest h-100vh w-60 border-r border-white/5 flex flex-col justify-start items-start p-4 overflow-y-auto"
 >
 <div class="w-full mb-4">
  <div class="flex items-center gap-3 mb-3">
   {#if guild?.icon}
    <img 
     src={getGuildIconUrl(guild.id, guild.icon)}
     alt={guild?.name}
     class="w-10 h-10 rounded-xl"
    />
   {:else}
    <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center">
     <span class="text-white font-bold text-sm">{guild?.name?.slice(0, 2).toUpperCase()}</span>
    </div>
   {/if}
   <div class="flex-1 min-w-0">
    <h1 class="font-semibold text-white text-base truncate">
     {guild?.name}
    </h1>
    <p class="text-xs text-white/50">Server Settings</p>
   </div>
  </div>
 </div>

 <div class="w-full space-y-1">
  <a 
   href={baseURL} 
   class="flex items-center gap-3 px-3 py-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200 group"
  >
   <span class="i-tabler-home text-lg"></span>
   <span class="text-sm font-medium">Overview</span>
  </a>
 </div>

 <div class="w-full mt-6">
  <h2 class="text-xs uppercase text-white/40 font-medium mb-2 px-3">Configuration</h2>
  <div class="space-y-1">
   <a 
    href="{baseURL}/basic" 
    class="flex items-center gap-3 px-3 py-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200 group"
   >
    <span class="i-tabler-settings text-lg"></span>
    <span class="text-sm font-medium">Basic Settings</span>
   </a>
   <a 
    href="{baseURL}/logs" 
    class="flex items-center gap-3 px-3 py-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200 group"
   >
    <span class="i-tabler-file-text text-lg"></span>
    <span class="text-sm font-medium">Log Channels</span>
   </a>
  </div>
 </div>

 <div class="w-full mt-6">
  <h2 class="text-xs uppercase text-white/40 font-medium mb-2 px-3">Bot Management</h2>
  <div class="space-y-1">
   <a 
    href="/@me/bot" 
    class="flex items-center gap-3 px-3 py-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200 group"
   >
    <span class="i-tabler-key text-lg"></span>
    <span class="text-sm font-medium">Access Token</span>
   </a>
  </div>
 </div>

 {#if data.isDev}
  <div class="w-full mt-auto pt-6 border-t border-white/5">
   <h2 class="text-xs uppercase text-white/40 font-medium mb-2 px-3">Development</h2>
   <div class="space-y-1">
    <a 
     href="/@me/designs" 
     class="flex items-center gap-3 px-3 py-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200 group"
    >
     <span class="i-tabler-palette text-lg"></span>
     <span class="text-sm font-medium">Design System</span>
    </a>
   </div>
  </div>
 {/if}
 </section>

 <section class="flex-1 overflow-y-auto h-100vh bg-gradient-to-br from-main-darkest via-main-darker to-main-dark">
 {@render children()}
 </section>
</div>
