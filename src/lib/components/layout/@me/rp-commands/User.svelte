<script lang="ts">
 import type { RUser } from '@ayako/bot/src/Typings/Redis';

 const { user, onremove }: { user: RUser | { id: string }; onremove: (id: string) => void } =
  $props();

 const isFullUser = (candidate: RUser | { id: string }): candidate is RUser =>
  'username' in candidate;
 const displayName = $derived(
  isFullUser(user) ? (user.global_name ?? user.username) : 'Unknown user'
 );
 const username = $derived(isFullUser(user) ? `@${user.username}` : user.id);
 const avatarUrl = $derived(isFullUser(user) ? user.avatar_url : null);
</script>

<div
 class="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-main-darker/60 px-3 py-2"
>
 <div class="flex items-center gap-3">
  {#if avatarUrl}
   <img
    src={avatarUrl}
    alt={displayName}
    width="32"
    height="32"
    class="h-8 w-8 rounded-full object-cover"
   />
  {:else}
   <div
    class="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-xs text-white/70"
   >
    {displayName.slice(0, 2).toUpperCase()}
   </div>
  {/if}
  <div>
   <p class="text-sm font-medium text-white">{displayName}</p>
   <p class="text-xs text-white/40">{username}</p>
  </div>
 </div>
 <button type="button" class="btn-danger text-xs" onclick={() => onremove(user.id)}>
  Unblock
 </button>
</div>
