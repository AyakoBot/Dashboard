<script lang="ts">
 import Badge from '$lib/components/generic/Badge.svelte';
 import Card from '$lib/components/generic/Card.svelte';
 import Input from '$lib/components/generic/Input.svelte';
 import RPToggle from '$lib/components/layout/@me/rp-commands/RPToggle.svelte';
 import type { RUser } from '@ayako/bot/src/Typings/Redis';
 import { onMount } from 'svelte';
 import type { PageData } from './$types';
 import makeRequest from '$lib/scripts/util/makeRequest';

 const { data }: { data: PageData } = $props();

 const commandEnabled: Record<string, boolean> = $state({});
 let search = $state('');

 const defaultBlocked = new Set(
  Array.from(data.stateMap.entries())
   .filter(([, state]) => state.users.has('0'))
   .map(([name]) => name)
 );

 onMount(() => {
  Array.from(data.stateMap.values())
   .filter((state) => state.users.has('0'))
   .forEach((state) => {
    commandEnabled[state.command] = false;
   });
 });

 const checkChange = (name: string, state: boolean) => {
  commandEnabled[name] = state;

  makeRequest(
   { command: name, enabled: state, userId: '0', path: '/@me/rp', method: 'PATCH' },
   {},
   fetch
  );
 };

 const totalCommands = data.commands.length;
 const blockedCount = $derived(
  data.commands.reduce((total, command) => {
   const current = commandEnabled[command.name];
   if (current === undefined) return defaultBlocked.has(command.name) ? total + 1 : total;
   return current ? total : total + 1;
  }, 0)
 );
 const allowedCount = $derived(totalCommands - blockedCount);
 const normalizedSearch = $derived(search.trim().toLowerCase());
 const filteredCommands = $derived(
  data.commands
   .filter((command) => {
    if (!normalizedSearch) return true;
    if (command.name.toLowerCase().includes(normalizedSearch)) return true;
    return command.aliases.some((alias) => alias.toLowerCase().includes(normalizedSearch));
   })
   .toSorted((a, b) => a.name.localeCompare(b.name))
 );
</script>

<div class="p-8">
 <div class="mx-auto max-w-6xl space-y-8">
  <header class="space-y-4">
   <h1 class="text-4xl font-bold text-white">Roleplay Command Protection</h1>
   <p class="text-white/60 max-w-3xl">
    Choose which roleplay actions others can use on you. Blocking a command also prevents you from
    invoking it on other members.
   </p>
  </header>

  <section class="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] items-start">
   <Card title="Command Controls" description="Search, filter, and toggle individual commands">
    <div class="space-y-6">
     <div class="grid gap-3 sm:grid-cols-3" aria-label="Command summary">
      <div class="rounded-xl border border-white/10 bg-white/5 p-4">
       <p class="text-xs uppercase tracking-wide text-white/40">Total Commands</p>
       <p class="text-2xl font-semibold text-white">{totalCommands}</p>
      </div>
      <div class="rounded-xl border border-success/30 bg-success/10 p-4">
       <p class="text-xs uppercase tracking-wide text-success/70">Allowed</p>
       <p class="text-2xl font-semibold text-white">{allowedCount}</p>
      </div>
      <div class="rounded-xl border border-warning/30 bg-warning/10 p-4">
       <p class="text-xs uppercase tracking-wide text-warning/70">Blocked</p>
       <p class="text-2xl font-semibold text-white">{blockedCount}</p>
      </div>
     </div>

     <div class="relative">
      <input
       type="text"
       class="w-full rounded-xl border border-white/15 bg-black/30 px-10 py-3 text-sm text-white/80 placeholder-white/30 transition focus:border-primary-400/50 focus:outline-none focus:ring-2 focus:ring-primary-400/20"
       placeholder="Search by command or alias"
       bind:value={search}
      />
      <span
       class="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/30 i-tabler-search"
      ></span>
     </div>
     <p class="text-xs text-white/40">
      Showing {filteredCommands.length} of {totalCommands} commands
     </p>

     {#if filteredCommands.length}
      <div class="grid gap-4 md:grid-cols-2">
       {#each filteredCommands as command (command.name)}
        <RPToggle
         {command}
         {checkChange}
         {commandEnabled}
         defaultBlocked={defaultBlocked.has(command.name)}
         users={[...(data.stateMap.get(command.name)?.users || [])]
          .map((userId) => data.users?.find((u) => u.id === userId))
          .filter((user): user is RUser => !!user)}
        />
       {/each}
      </div>
     {:else}
      <div class="rounded-xl border border-white/10 bg-white/5 p-6 text-center text-white/50">
       <p class="text-sm">No commands match your search.</p>
      </div>
     {/if}
    </div>
   </Card>

   <Card title="How blocking works" description="Tips for keeping your RP experience comfortable">
    <ul class="space-y-3 text-sm text-white/60">
     <li class="flex items-start gap-3">
      <span class="i-tabler-shield-check text-success"></span>
      <span>Blocked commands are disabled for everyone—including you.</span>
     </li>
     <li class="flex items-start gap-3">
      <span class="i-tabler-user-off text-warning"></span>
      <span>Use the user picker inside each command to exempt specific people.</span>
     </li>
     <li class="flex items-start gap-3">
      <span class="i-tabler-device-floppy text-info"></span>
      <span>Changes are saved instantly—no additional confirmation required.</span>
     </li>
    </ul>
   </Card>
  </section>
 </div>
</div>
