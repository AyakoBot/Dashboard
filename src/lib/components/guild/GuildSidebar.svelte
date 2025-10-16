<script lang="ts">
 import type { GETBotSettings } from '$lib/scripts/index.js';
 import makeRequest from '$lib/scripts/util/makeRequest.js';
 import { page } from '$app/state';
 import { onMount } from 'svelte';
 import { getGuildIconUrl } from '$lib/utils/discord.js';
 import { fade } from 'svelte/transition';
 import clsx from 'clsx';
 import { compareTwoStrings } from 'string-similarity';

 interface Props {
  guild: any;
  isDev: boolean;
  baseURL: string;
  isOpen?: boolean;
 }

 let { guild, isDev, baseURL, isOpen = $bindable(false) }: Props = $props();

 let settings = $state<GETBotSettings>([]);
 let loading = $state(true);
 let error = $state<string | null>(null);
 let categorizedSettings = $state<[string, GETBotSettings][]>([]);
 let collapsedCategories = $state<Set<string>>(new Set());
 let searchQuery = $state('');
 let favorites = $state<Set<string>>(new Set());
 let recentSettings = $state<string[]>([]);

 const STORAGE_KEYS = {
  favorites: `guild-settings-favorites-${guild?.id}`,
  recent: `guild-settings-recent-${guild?.id}`
 };

 const kebabCase = (str: string): string => {
  if (str === null || str === undefined) return '';
  if (typeof str !== 'string') {
   return String(str || '')
    .toLowerCase()
    .replace(/\s+/g, '-');
  }
  return str.toLowerCase().replace(/\s+/g, '-');
 };

 const generateSettingUrl = (setting: GETBotSettings[0]): string => {
  const category = setting.category || 'General';
  if (!setting.id) {
   console.error('generateSettingUrl called with missing ID:', setting);
   return `${baseURL}/error`;
  }
  return `${baseURL}/${kebabCase(category)}-${kebabCase(setting.id)}`;
 };

 const getCategoryIcon = (settingName: string): string => {
  const iconMap: Record<string, string> = {
   appeals: 'i-tabler-scale',
   moderation: 'i-tabler-shield',
   leveling: 'i-tabler-trophy',
   nitro: 'i-tabler-crown',
   vote: 'i-tabler-thumb-up',
   roles: 'i-tabler-user-check',
   automation: 'i-tabler-robot',
   general: 'i-tabler-settings',
   basic: 'i-tabler-settings',
   'appeal-questions': 'i-tabler-help',
   ticketing: 'i-tabler-ticket',
   censor: 'i-tabler-eye-off',
   cooldowns: 'i-tabler-clock',
   'disboard-reminders': 'i-tabler-bell',
   suggestions: 'i-tabler-bulb',
   verification: 'i-tabler-shield-check',
   welcome: 'i-tabler-heart',
   'voice-hubs': 'i-tabler-microphone',
   'custom-client': 'i-tabler-robot',
   'log-channels': 'i-tabler-file-text',
   afk: 'i-tabler-user-pause',
   'multi-channels': 'i-tabler-hash',
   'leveling-multi-channels': 'i-tabler-hash',
   'multi-roles': 'i-tabler-users',
   'leveling-multi-roles': 'i-tabler-users',
   'level-roles': 'i-tabler-award',
   'rule-channels': 'i-tabler-list-check',
   'leveling-rules-channels': 'i-tabler-list-check',
   'anti-raid': 'i-tabler-shield-lock',
   'anti-spam': 'i-tabler-shield-x',
   'anti-virus': 'i-tabler-virus',
   'auto-punish': 'i-tabler-hammer',
   newlines: 'i-tabler-text-wrap',
   invites: 'i-tabler-link-off',
   'denylist-rules': 'i-tabler-list',
   expiry: 'i-tabler-clock',
   'vote-punish': 'i-tabler-users',
   'booster-roles': 'i-tabler-rocket',
   'nitro-roles': 'i-tabler-rocket',
   'vote-rewards': 'i-tabler-gift',
   'ping-reporter': 'i-tabler-bell',
   'ping-report': 'i-tabler-bell',
   'linked-roles-decoration': 'i-tabler-link',
   'linked-roles-deco': 'i-tabler-link',
   shop: 'i-tabler-shopping-cart',
   'shop-items': 'i-tabler-package',
   'role-rewards': 'i-tabler-award',
   'reward-roles': 'i-tabler-award',
   'auto-roles': 'i-tabler-user-plus',
   'self-roles': 'i-tabler-user-cog',
   'role-separators': 'i-tabler-separator-horizontal',
   separators: 'i-tabler-separator-horizontal',
   sticky: 'i-tabler-pin',
   'reaction-settings': 'i-tabler-mood-smile',
   'reaction-role-settings': 'i-tabler-mood-smile',
   'reaction-roles': 'i-tabler-heart',
   'button-settings': 'i-tabler-square',
   'button-role-settings': 'i-tabler-square',
   'button-roles': 'i-tabler-square'
  };

  const kebabName = kebabCase(settingName);
  const lowerName = settingName.toLowerCase();
  const spacedName = settingName.toLowerCase().replace(/\s+/g, '-');

  return iconMap[kebabName] || iconMap[lowerName] || iconMap[spacedName] || 'i-tabler-settings';
 };

 const updateCategorizedSettings = () => {
  const categories: Record<string, GETBotSettings> = {};

  settings.forEach((setting) => {
   const category = setting.category || 'General';
   if (!categories[category]) {
    categories[category] = [];
   }
   categories[category].push(setting);
  });

  const result = Object.entries(categories).sort(([a], [b]) => a.localeCompare(b));
  categorizedSettings = result;
 };

 const isDashboardActive = $derived(page.url.pathname === baseURL);

 const toggleCategory = (categoryName: string) => {
  if (collapsedCategories.has(categoryName)) {
   collapsedCategories.delete(categoryName);
  } else {
   collapsedCategories.add(categoryName);
  }
  collapsedCategories = new Set(collapsedCategories);
 };

 const cleanSettingName = (name: string, category: string): string => {
  if (!name || !category) return name || '';

  const categoryLower = category.toLowerCase();
  const nameLower = name.toLowerCase();

  if (nameLower.startsWith(categoryLower + ' ')) {
   return name.substring(category.length + 1);
  }

  return name;
 };

 const generateSettingKey = (setting: GETBotSettings[0]): string =>
  `${kebabCase(setting.category || 'General')}-${kebabCase(setting.id)}`;

 const loadFromStorage = () => {
  if (typeof window === 'undefined') return;

  try {
   const favs = localStorage.getItem(STORAGE_KEYS.favorites);
   const recent = localStorage.getItem(STORAGE_KEYS.recent);

   if (favs) favorites = new Set(JSON.parse(favs));
   if (recent) recentSettings = JSON.parse(recent);
  } catch (e) {
   console.error('Failed to load settings from localStorage', e);
  }
 };

 const toggleFavorite = (settingKey: string) => {
  if (favorites.has(settingKey)) {
   favorites.delete(settingKey);
  } else {
   favorites.add(settingKey);
  }
  favorites = new Set(favorites);
  localStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify([...favorites]));
 };

 const addToRecent = (settingKey: string) => {
  // Delay reordering to prevent accidental re-clicks during DOM reflow
  setTimeout(() => {
   const updated = [settingKey, ...recentSettings.filter((s) => s !== settingKey)].slice(0, 5);
   recentSettings = updated;
   localStorage.setItem(STORAGE_KEYS.recent, JSON.stringify(updated));
  }, 150);
 };

 const getSettingByKey = (key: string) => {
  for (const setting of settings) {
   const settingKey = generateSettingKey(setting);
   if (settingKey === key) return setting;
  }
  return null;
 };

 const filteredSettings = $derived(() => {
  if (!searchQuery.trim()) return categorizedSettings;

  const query = searchQuery.toLowerCase();
  const SIMILARITY_THRESHOLD = 0.3;

  type SettingWithScore = {
   setting: (typeof categorizedSettings)[0][1][0];
   score: number;
  };

  const scoredSettings = categorizedSettings
   .flatMap(([category, categorySettings]) =>
    categorySettings.map((setting) => {
     const cleanName = cleanSettingName(setting.name, setting.category || 'General');
     const nameLower = setting.name.toLowerCase();
     const cleanNameLower = cleanName.toLowerCase();
     const categoryLower = category.toLowerCase();
     const description = setting.description?.toLowerCase() || '';
     const explainDesc = setting.explainDescription?.toLowerCase() || '';

     if (
      cleanNameLower.includes(query) ||
      nameLower.includes(query) ||
      categoryLower.includes(query) ||
      description.includes(query) ||
      explainDesc.includes(query)
     ) {
      return { setting, score: 1, category };
     }

     const nameScore = Math.max(
      compareTwoStrings(query, cleanNameLower),
      compareTwoStrings(query, nameLower)
     );
     const categoryScore = compareTwoStrings(query, categoryLower);
     const descScore = compareTwoStrings(query, description);
     const explainScore = compareTwoStrings(query, explainDesc);

     const maxScore = Math.max(nameScore, categoryScore, descScore * 0.8, explainScore * 0.9);

     if (maxScore >= SIMILARITY_THRESHOLD) {
      return { setting, score: maxScore, category };
     }

     return null;
    })
   )
   .filter((item): item is SettingWithScore & { category: string } => item !== null)
   .sort((a, b) => b.score - a.score);

  const grouped = scoredSettings.reduce(
   (acc, { setting, category }) => {
    if (!acc[category]) acc[category] = [];
    acc[category].push(setting);
    return acc;
   },
   {} as Record<string, GETBotSettings>
  );

  return Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b));
 });

 const favoriteSettings = $derived(() => {
  const result: GETBotSettings = [];
  for (const key of favorites) {
   const setting = getSettingByKey(key);
   if (setting) result.push(setting);
  }
  return result;
 });

 const recentSettingsData = $derived(() => {
  const result: GETBotSettings = [];
  for (const key of recentSettings) {
   const setting = getSettingByKey(key);
   if (setting) result.push(setting);
  }
  return result;
 });

 const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === '/' || (e.metaKey && e.key === 'k') || (e.ctrlKey && e.key === 'k')) {
   e.preventDefault();
   document.querySelector<HTMLInputElement>('input[type="search"]')?.focus();
  }
 };

 $effect(() => {
  if (isOpen) {
   document.body.style.overflow = 'hidden';
  } else {
   document.body.style.overflow = '';
  }
  return () => {
   document.body.style.overflow = '';
  };
 });

 $effect(() => {
  const hasQuery = searchQuery.trim().length > 0;
  if (hasQuery && collapsedCategories.size > 0) {
   collapsedCategories = new Set();
  }
 });

 onMount(async () => {
  loadFromStorage();

  const result = await makeRequest(
   { method: 'GET', path: '/bot/settings' },
   { query: `guildId=${page.params.guildId}` },
   fetch
  );

  if (result) {
   settings = result;
   updateCategorizedSettings();
  } else {
   error = 'Failed to load settings';
  }

  loading = false;
 });
</script>

<svelte:window onkeydown={handleKeydown} />

{#if isOpen}
 <div
  class="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm"
  onclick={() => (isOpen = false)}
  onkeydown={(e) => e.key === 'Escape' && (isOpen = false)}
  transition:fade={{ duration: 200 }}
  role="presentation"
  aria-hidden="true"
 ></div>
{/if}

<section
 class={clsx(
  'bg-gradient-to-b from-main-darker to-main-darkest h-100vh w-60 border-r border-white/5',
  'flex flex-col justify-start items-start p-4 overflow-y-auto custom-scrollbar',
  'fixed lg:sticky top-0 z-40',
  'transition-transform duration-300 ease-out',
  isOpen ? 'translate-x-0' : 'max-lg:-translate-x-full'
 )}
 aria-label="Guild navigation sidebar"
>
 <div class="w-full mb-4">
  <div class="flex items-center justify-between mb-3">
   <button
    onclick={() => (isOpen = false)}
    class="lg:hidden p-2 -ml-2 rounded-lg hover:bg-white/10 transition-colors"
    aria-label="Close guild sidebar"
   >
    <span class="i-tabler-x text-base text-white"></span>
   </button>
  </div>
  <div class="flex items-center gap-3 mb-3">
   {#if guild?.icon}
    <img
     src={getGuildIconUrl(guild.id, guild.icon)}
     alt="Server icon for {guild?.name}"
     class="w-10 h-10 rounded-xl"
    />
   {:else}
    <div
     class="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center"
     role="img"
     aria-label="Default avatar for {guild?.name}"
    >
     <span class="text-white font-bold text-sm" aria-hidden="true">
      {guild?.name?.slice(0, 2).toUpperCase()}
     </span>
    </div>
   {/if}
   <div class="flex-1 min-w-0">
    <h1 class="font-semibold text-white text-base truncate">
     {guild?.name}
    </h1>
    <p class="text-xs text-white/50">Server Settings</p>
   </div>
  </div>

  <div class="relative w-full mb-3">
   <input
    type="search"
    placeholder="Search settings... (/ or Cmd+K)"
    bind:value={searchQuery}
    class="w-full px-3 py-2 pl-9 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all duration-200"
    aria-label="Search guild settings"
   />
   <span class="absolute left-3 top-1/2 -translate-y-1/2 i-tabler-search text-white/40"></span>
   {#if searchQuery}
    <button
     onclick={() => (searchQuery = '')}
     class="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded transition-colors duration-200"
     aria-label="Clear search query"
    >
     <span class="i-tabler-x text-xs text-white/40"></span>
    </button>
   {/if}
  </div>
 </div>

 <div class="w-full space-y-0.5">
  <a
   href={baseURL}
   class="flex items-center gap-2 px-2.5 py-1.5 rounded-md transition-all duration-200 group {isDashboardActive
    ? 'bg-white/20 text-white'
    : 'text-white/70 hover:text-white hover:bg-white/10'}"
  >
   <span class="i-tabler-home text-base"></span>
   <span class="text-xs font-medium">Dashboard</span>
  </a>
 </div>

 {#if loading}
  <div class="w-full mt-6 px-3">
   <div class="text-xs text-white/40">Loading settings...</div>
  </div>
 {:else if error}
  <div class="w-full mt-6 px-3">
   <div class="text-xs text-red-400">{error}</div>
  </div>
 {:else if categorizedSettings.length > 0}
  {#if !searchQuery && (favoriteSettings().length > 0 || recentSettingsData().length > 0)}
   <div class="w-full mt-3 space-y-3">
    {#if favoriteSettings().length > 0}
     <div>
      <h2
       class="px-2.5 py-1 text-[10px] uppercase text-white/40 font-medium flex items-center gap-1.5"
      >
       <span class="i-tabler-star-filled inline-block w-5 h-5 text-yellow-400"></span>
       <span>Favorites ({favoriteSettings().length})</span>
      </h2>
      <div class="space-y-0.5">
       {#each favoriteSettings() as setting}
        {@const settingUrl = generateSettingUrl(setting)}
        {@const isActive = page.url.pathname === settingUrl}
        {@const cleanName = cleanSettingName(setting.name, setting.category || 'General')}
        {@const settingKey = generateSettingKey(setting)}
        <a
         href={settingUrl}
         onclick={() => addToRecent(settingKey)}
         class="flex items-center gap-2 px-2.5 py-1.5 rounded-md transition-all duration-200 group {isActive
          ? 'bg-white/20 text-white'
          : 'text-white/70 hover:text-white hover:bg-white/10'}"
        >
         <span class="{getCategoryIcon(setting.name)} text-base"></span>
         <span class="text-xs font-medium truncate flex-1">{cleanName}</span>
         <button
          onclick={(e) => {
           e.preventDefault();
           toggleFavorite(settingKey);
          }}
          class="opacity-100 flex items-center justify-center p-0.5 hover:bg-white/10 rounded transition-all duration-200"
          aria-label="Remove from favorites"
         >
          <span class="i-tabler-star-filled inline-block w-5 h-5 text-yellow-400"></span>
         </button>
        </a>
       {/each}
      </div>
     </div>
    {/if}

    {#if recentSettingsData().length > 0}
     <div>
      <h2 class="px-3 py-2 text-xs uppercase text-white/40 font-medium flex items-center gap-2">
       <span class="i-tabler-clock"></span>
       <span>Recent</span>
      </h2>
      <div class="space-y-0.5">
       {#each recentSettingsData() as setting}
        {@const settingUrl = generateSettingUrl(setting)}
        {@const isActive = page.url.pathname === settingUrl}
        {@const cleanName = cleanSettingName(setting.name, setting.category || 'General')}
        {@const settingKey = generateSettingKey(setting)}
        <a
         href={settingUrl}
         onclick={() => addToRecent(settingKey)}
         class="flex items-center gap-2 px-3 rounded-lg transition-all duration-200 group {isActive
          ? 'bg-white/20 text-white'
          : 'text-white/70 hover:text-white hover:bg-white/10'}"
        >
         <span class="{getCategoryIcon(setting.name)} text-base"></span>
         <span class="text-xs font-medium truncate flex-1">{cleanName}</span>
         <button
          onclick={(e) => {
           e.preventDefault();
           toggleFavorite(settingKey);
          }}
          class="opacity-0 group-hover:opacity-100 flex items-center justify-center p-1 hover:bg-white/10 rounded transition-opacity duration-200"
          aria-label="{favorites.has(settingKey) ? 'Remove from' : 'Add to'} favorites"
         >
          <span
           class="i-tabler-star{favorites.has(settingKey)
            ? '-filled'
            : ''} inline-block w-5 h-5 {favorites.has(settingKey)
            ? 'text-yellow-400'
            : 'text-white/40'}"
          ></span>
         </button>
        </a>
       {/each}
      </div>
     </div>
    {/if}
   </div>
  {/if}

  {#each filteredSettings() as [categoryName, categorySettings], index}
   <div
    class="w-full {index === 0 ? 'mt-6' : collapsedCategories.has(categoryName) ? 'mt-2' : 'mt-6'}"
   >
    <button
     class="w-full flex items-center justify-between px-3 text-xs uppercase text-white/40 font-medium hover:text-white/60 transition-colors duration-200"
     onclick={() => toggleCategory(categoryName)}
     aria-expanded={!collapsedCategories.has(categoryName)}
     aria-label="Toggle {categoryName} category"
    >
     <span>
      {categoryName}
      {#if searchQuery}
       <span class="text-primary-400">({categorySettings.length} found)</span>
      {:else}
       ({categorySettings.length})
      {/if}
     </span>
     <span
      class="i-tabler-chevron-{collapsedCategories.has(categoryName)
       ? 'right'
       : 'down'} text-sm transition-transform duration-200"
     ></span>
    </button>

    {#if !collapsedCategories.has(categoryName)}
     <div class="space-y-0.5">
      {#each categorySettings as setting}
       {@const settingUrl = generateSettingUrl(setting)}
       {@const isActive = page.url.pathname === settingUrl}
       {@const cleanName = cleanSettingName(setting.name, setting.category || 'General')}
       {@const settingKey = generateSettingKey(setting)}
       <a
        href={settingUrl}
        onclick={() => addToRecent(settingKey)}
        class="flex items-center gap-2 px-3 rounded-lg transition-all duration-200 group {isActive
         ? 'bg-white/20 text-white'
         : 'text-white/70 hover:text-white hover:bg-white/10'}"
       >
        <span class="{getCategoryIcon(setting.name)} text-base"></span>
        <span class="text-xs font-medium truncate flex-1">{cleanName}</span>
        <button
         onclick={(e) => {
          e.preventDefault();
          toggleFavorite(settingKey);
         }}
         class="opacity-0 group-hover:opacity-100 flex items-center justify-center p-1 hover:bg-white/10 rounded transition-opacity duration-200"
         aria-label="{favorites.has(settingKey) ? 'Remove from' : 'Add to'} favorites"
        >
         <span
          class="i-tabler-star{favorites.has(settingKey)
           ? '-filled'
           : ''} inline-block w-5 h-5 {favorites.has(settingKey)
           ? 'text-yellow-400'
           : 'text-white/40'}"
         ></span>
        </button>
       </a>
      {/each}
     </div>
    {/if}
   </div>
  {/each}

  {#if searchQuery && filteredSettings().length === 0}
   <div class="w-full mt-8 px-3 text-center">
    <span class="i-tabler-search-off text-4xl text-white/20 block mb-3"></span>
    <p class="text-sm text-white/40 mb-1">No settings found</p>
    <p class="text-xs text-white/30">for "{searchQuery}"</p>
   </div>
  {/if}
 {:else}
  <div class="w-full mt-6 px-3">
   <div class="text-xs text-yellow-400">
    No categories found. Settings: {settings.length}, Categorized: {categorizedSettings.length}
   </div>
  </div>
 {/if}

 {#if isDev}
  <div class="w-full mt-auto pt-6 border-t border-white/5">
   <h2 class="text-xs uppercase text-white/40 font-medium mb-2 px-3">Development</h2>
   <div class="space-y-0.5">
    <a
     href="/@me/designs"
     class="flex items-center gap-2 px-2.5 py-1.5 rounded-md text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200 group"
    >
     <span class="i-tabler-palette text-base"></span>
     <span class="text-xs font-medium">Design System</span>
    </a>
   </div>
  </div>
 {/if}
</section>
