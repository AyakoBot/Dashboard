<script lang="ts">
 import type { RChannel, RRole, RUser } from '@ayako/bot/src/Typings/Redis';

 const {
  option
 }: {
  option: string | RUser | RChannel | RRole;
 } = $props();

 let hasErrored = false;
 let replaceImage: null | string = $state(null);

 const handleError = () => {
  if (hasErrored) return;

  hasErrored = true;
  replaceImage = '/images/member.webp';
 };

 const intToHex = (num: number): string => {
  return '#' + num.toString(16).padStart(6, '0');
 };

 const isRole = (opt: typeof option): opt is RRole => {
  return typeof opt !== 'string' && 'color' in opt;
 };

 const isChannel = (opt: typeof option): opt is RChannel => {
  return typeof opt !== 'string' && 'type' in opt;
 };

 const isUser = (opt: typeof option): opt is RUser => {
  return typeof opt !== 'string' && 'username' in opt;
 };

 const getChannelIcon = (channel: RChannel): string => {
  if (channel.type === 2 || channel.type === 13) return 'i-tabler-volume';
  if (channel.type === 4) return 'i-tabler-folder';
  if (channel.type === 15) return 'i-tabler-messages';
  return 'i-tabler-hash';
 };

 const getRoleColor = (role: RRole): string => {
  if (role.color) return intToHex(role.color);
  return '#99aab5';
 };

 const getDisplayString = (str: string): string => {
  if (str.includes('|||')) {
   return str.split('|||')[1];
  }
  return str;
 };
</script>

<div class="flex flex-row items-center gap-2 w-full">
 {#if typeof option === 'string'}
  <span class="text-main-text">{getDisplayString(option)}</span>
 {:else if isRole(option)}
  <div class="flex items-center gap-2 flex-1 min-w-0">
   {#if option.icon_url}
    <img
     src={option.icon_url}
     alt=""
     class="w-5 h-5 rounded-full flex-shrink-0"
     onerror={handleError}
    />
   {:else if option.unicode_emoji}
    <span class="text-base flex-shrink-0">{option.unicode_emoji}</span>
   {:else}
    <div
     class="w-3 h-3 rounded-full flex-shrink-0"
     style:background-color={getRoleColor(option)}
    ></div>
   {/if}
   <span class="text-main-text truncate flex-1">{option.name}</span>
   {#if option.member_count !== undefined}
    <span class="text-muted-text text-xs flex-shrink-0 flex items-center gap-1">
     <span class="i-tabler-users text-sm"></span>
     {option.member_count}
    </span>
   {/if}
  </div>
 {:else if isChannel(option)}
  <div class="flex items-center gap-2 flex-1 min-w-0">
   <span class="{getChannelIcon(option)} text-base text-muted-text flex-shrink-0"></span>
   <span class="text-main-text truncate flex-1">{option.name}</span>
  </div>
 {:else if isUser(option)}
  <div class="flex items-center gap-2 flex-1 min-w-0">
   <img
    src={replaceImage || option.avatar_url || '/images/member.webp'}
    alt=""
    class="w-6 h-6 rounded-full flex-shrink-0"
    onerror={handleError}
   />
   <span class="text-main-text truncate flex-1">
    {option.global_name || option.username}
   </span>
   {#if option.global_name && option.username}
    <span class="text-muted-text text-xs flex-shrink-0">({option.username})</span>
   {/if}
  </div>
 {/if}
</div>
