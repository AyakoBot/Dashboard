<script lang="ts">
 import SettingsButton from '$lib/components/generic/SettingsButton.svelte';
 import GuildSidebar from '$lib/components/guild/GuildSidebar.svelte';
 import MobileMenuButton from '$lib/components/layout/MobileMenuButton.svelte';
 import type { Snippet } from 'svelte';
 import type { LayoutData } from './$types';
 import { page } from '$app/state';
 import { onMount } from 'svelte';
 import { trackServerVisit } from '$lib/utils/serverTracking.js';
 import { getGuildIconUrl } from '$lib/utils/discord.js';

 const { children, data }: { children: Snippet; data: LayoutData } = $props();
 const guild = data.guilds?.find((g) => g.id === page.params.guildId);
 const baseURL = `/guilds/${page.params.guildId}`;
 let guildSidebarOpen = $state(false);

 onMount(() => {
  if (guild) {
   const iconUrl = guild.icon ? getGuildIconUrl(guild.id, guild.icon) : null;
   trackServerVisit(guild.id, guild.name, iconUrl);
  }
 });
</script>

<div class="h-100vh w-full flex flex-row justify-start items-start overflow-hidden relative">
 <div class="fixed top-4 left-4 z-50 lg:hidden">
  <MobileMenuButton
   onclick={() => (guildSidebarOpen = !guildSidebarOpen)}
   isOpen={guildSidebarOpen}
   label="guild settings menu"
  />
 </div>

 <GuildSidebar {guild} isDev={data.isDev} {baseURL} bind:isOpen={guildSidebarOpen} />

 <section
  class="flex-1 overflow-y-auto h-100vh bg-gradient-to-br from-main-darkest via-main-darker to-main-dark"
 >
  {@render children()}
 </section>
</div>
