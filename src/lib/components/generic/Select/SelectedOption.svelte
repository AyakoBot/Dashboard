<script lang="ts">
 import type { RChannel, RRole, RUser } from '@ayako/bot/src/Typings/Redis';

 type Option = string | RRole | RChannel | RUser;

 const {
  single,
  optionClick,
  opt
 }: { single: boolean; optionClick: (opt: Option) => void; opt: Option } = $props();

 const intToHex = (num: number): string => {
  return '#' + num.toString(16).padStart(6, '0')
;
 };

 const isRole = (option: Option): option is RRole => {
  return typeof option !== 'string' && 'color' in option;
 };

 const isChannel = (option: Option): option is RChannel => {
  return typeof option !== 'string' && 'type' in option;
 };

 const isUser = (option: Option): option is RUser => {
  return typeof option !== 'string' && 'username' in option;
 };

 const intToRgba = (num: number, alpha: number = 0.7): string => {
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
 };

 const getRoleBackground = (role: RRole): string => {
  if (role.colors) {
   const primary = intToRgba(role.colors.primary_color, 0.5);
   const secondary = role.colors.secondary_color ? intToRgba(role.colors.secondary_color, 0.5) : primary;
   const tertiary = role.colors.tertiary_color ? intToRgba(role.colors.tertiary_color, 0.5) : secondary;
   return `linear-gradient(90deg, ${primary}, ${secondary}, ${tertiary})`;
  }
  if (role.color) return intToRgba(role.color, 0.5);
  return 'rgba(88, 101, 242, 0.5)';
 };

 const getChannelIcon = (channel: RChannel): string => {
  if (channel.type === 2 || channel.type === 13) return 'i-tabler-volume';
  if (channel.type === 4) return 'i-tabler-folder';
  if (channel.type === 15) return 'i-tabler-messages';
  return 'i-tabler-hash';
 };

 let hasErrored = false;
 let replaceImage: null | string = $state(null);

 const handleError = () => {
  if (hasErrored) return;
  hasErrored = true;
  replaceImage = '/images/member.webp';
 };

 const getDisplayString = (str: string): string => {
  if (str.includes('|||')) {
   return str.split('|||')[1];
  }
  return str;
 };
</script>

{#if single}
 <div
  class="relative w-full"
  onclick={(e) => optionClick(opt)}
  onkeydown={(e) => (e.key === 'Enter' ? optionClick(opt) : undefined)}
  role="button"
  tabindex="0"
  aria-label="Toggle Select"
 >
  {#if typeof opt === 'string'}
   <span class="text-main-text">{getDisplayString(opt)}</span>
  {:else if isRole(opt)}
   <span class="text-main-text">{opt.name}</span>
  {:else if isChannel(opt)}
   <span class="text-main-text">{opt.name}</span>
  {:else if isUser(opt)}
   <span class="text-main-text">{opt.global_name || opt.username}</span>
  {/if}
 </div>
{:else if typeof opt === 'string'}
 <div
  class="px-2 py-1 bg-neutral-800 rounded-md flex flex-row justify-between items-center gap-2"
  onclick={() => optionClick(opt)}
  onkeydown={(e) => (e.key === 'Enter' ? optionClick(opt) : undefined)}
  role="button"
  tabindex="0"
  aria-label="Remove Select"
 >
  <span class="text-main-text">{getDisplayString(opt)}</span>
  <div class="w-4">
   <span class="i-tabler-x block pointer-events-none select-none"></span>
  </div>
 </div>
{:else if isRole(opt)}
 <div
  class="px-2 py-1 rounded-md flex flex-row items-center gap-1.5 text-white text-sm font-medium transition-all hover:scale-105 cursor-pointer"
  style:background={getRoleBackground(opt)}
  onclick={() => optionClick(opt)}
  onkeydown={(e) => (e.key === 'Enter' ? optionClick(opt) : undefined)}
  role="button"
  tabindex="0"
  aria-label="Remove {opt.name}"
 >
  {#if opt.icon_url}
   <img
    src={opt.icon_url}
    alt=""
    class="w-4 h-4 rounded-full"
    onerror={handleError}
   />
  {:else if opt.unicode_emoji}
   <span>{opt.unicode_emoji}</span>
  {/if}
  <span class="truncate max-w-[200px]">{opt.name}</span>
  <span class="i-tabler-x text-sm block pointer-events-none select-none ml-1"></span>
 </div>
{:else if isChannel(opt)}
 <div
  class="px-2 py-1 bg-primary-500:20 rounded-md flex flex-row items-center gap-1.5 text-primary-300 text-sm font-medium transition-colors hover:bg-primary-500:30 cursor-pointer"
  onclick={() => optionClick(opt)}
  onkeydown={(e) => (e.key === 'Enter' ? optionClick(opt) : undefined)}
  role="button"
  tabindex="0"
  aria-label="Remove {opt.name}"
 >
  <span class="{getChannelIcon(opt)} text-base"></span>
  <span class="truncate max-w-[200px]">{opt.name}</span>
  <span class="i-tabler-x text-sm block pointer-events-none select-none ml-1"></span>
 </div>
{:else if isUser(opt)}
 <div
  class="px-2 py-1 bg-primary-500:20 rounded-md flex flex-row items-center gap-1.5 text-primary-300 text-sm font-medium transition-colors hover:bg-primary-500:30 cursor-pointer"
  onclick={() => optionClick(opt)}
  onkeydown={(e) => (e.key === 'Enter' ? optionClick(opt) : undefined)}
  role="button"
  tabindex="0"
  aria-label="Remove {opt.global_name || opt.username}"
 >
  <img
   src={replaceImage || opt.avatar_url || '/images/member.webp'}
   alt=""
   class="w-4 h-4 rounded-full"
   onerror={handleError}
  />
  <span class="truncate max-w-[200px]">{opt.global_name || opt.username}</span>
  <span class="i-tabler-x text-sm block pointer-events-none select-none ml-1"></span>
 </div>
{/if}
