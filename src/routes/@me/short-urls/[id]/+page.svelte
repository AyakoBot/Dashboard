<script lang="ts">
 import { afterNavigate } from '$app/navigation';
 import { page } from '$app/state';
 import Badge from '$lib/components/generic/Badge.svelte';
 import Card from '$lib/components/generic/Card.svelte';
 import Timestamp from '$lib/components/generic/Timestamp.svelte';
 import makeRequest from '$lib/scripts/util/makeRequest';
 import { onMount } from 'svelte';
 import type { GETResponse as GETUses } from '@ayako/server/src/routes/v1/@me/short-urls/[id]/uses/+server.js';

 let uses: Promise<GETUses> | null = $state(null);

 const fetchUsage = () => {
  const id = page.params?.id;
  if (!id) {
   uses = Promise.resolve([] as GETUses);
   return;
  }

  uses = makeRequest({ method: 'GET', path: '/@me/short-urls/:id/uses' }, { id }, fetch).then(
   (r) => {
    if (r) return r;
    throw new Error('Unable to fetch usage data');
   }
  );
 };

 onMount(fetchUsage);
 afterNavigate(fetchUsage);

 const shortLink = $derived(page.params?.id ? `https://wzxy.org/${page.params.id}` : '');
</script>

<div class="space-y-4">
 <div class="flex flex-wrap items-center gap-2">
  <Badge text="Analytics" variant="info" icon="i-tabler-chart-line" />
  <Badge text={shortLink.replace('https://', '')} variant="neutral" />
 </div>

 <Card title="Usage Timeline" description="Latest visits sorted from newest to oldest">
  {#await uses}
   <div class="flex items-center gap-2 text-sm text-white/50">
    <span class="i-tabler-loader-2 animate-spin"></span>
    <span>Fetching usage…</span>
   </div>
  {:then history}
   {#if history?.length}
    <div class="rounded-2xl border border-white/10 shadow-inner space-y-3">
     {#each history.toSorted((a, b) => b.timestamp - a.timestamp) as use, index}
      <div
       class="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-black/20 px-4 py-3"
      >
       <div class="flex items-center gap-3 text-sm text-white/70">
        <span
         class="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-xs text-white/60"
        >
         #{index + 1}
        </span>
        <span class="font-medium text-white/80">
         <Timestamp time={use.timestamp} />
        </span>
       </div>
       <span class="rounded-full bg-white/10 px-3 py-1 text-xs text-white/60">
        <Timestamp time={use.timestamp} type="R" />
       </span>
      </div>
     {/each}
    </div>
   {:else}
    <p class="text-sm text-white/40">
     No visits recorded yet. Share your link and check back soon.
    </p>
   {/if}
  {:catch error}
   <p class="text-sm text-danger">{error.message}</p>
  {/await}
 </Card>
</div>
