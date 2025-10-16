<script lang="ts">
 import { page } from '$app/state';
 import Badge from '$lib/components/generic/Badge.svelte';
 import Card from '$lib/components/generic/Card.svelte';
 import { type Snippet } from 'svelte';
 import type { LayoutServerData } from './$types';
 import ShortUrl from '$lib/components/layout/@me/short-urls/ShortURL.svelte';

 const { data, children }: { data: LayoutServerData; children: Snippet } = $props();
 const urls = $derived(data.shortURLs ?? []);
 const selectedId = $derived(page.params?.id ?? null);
 const totalUses = $derived(urls.reduce((acc, item) => acc + (item.uses ?? 0), 0));
 const avgUses = $derived(urls.length ? Math.round(totalUses / urls.length) : 0);
 const topUrl = $derived(urls.toSorted((a, b) => b.uses - a.uses)[0]);
</script>

<div class="p-8">
 <div class="mx-auto max-w-6xl space-y-8">
  <header class="space-y-4">
   <h1 class="text-4xl font-bold text-white">Short Link Studio</h1>
   <p class="text-white/60 max-w-3xl">
    Manage your personal short URLs, review engagement metrics, and inspect usage history without
    leaving the dashboard.
   </p>
  </header>

  <section class="grid gap-6 items-start lg:grid-cols-[1.2fr_0.8fr]">
   <Card title="Your Short Links" description="Copy-ready links with quick access to analytics">
    <div class="space-y-6">
     <div class="grid gap-3 sm:grid-cols-3" aria-label="Short URL summary">
      <div class="rounded-xl border border-white/10 bg-white/5 p-4">
       <p class="text-xs uppercase tracking-wide text-white/40">Active Links</p>
       <p class="text-2xl font-semibold text-white">{urls.length}</p>
      </div>
      <div class="rounded-xl border border-white/10 bg-white/5 p-4">
       <p class="text-xs uppercase tracking-wide text-white/40">Total Uses</p>
       <p class="text-2xl font-semibold text-white">{totalUses}</p>
      </div>
      <div class="rounded-xl border border-white/10 bg-white/5 p-4">
       <p class="text-xs uppercase tracking-wide text-white/40">Average Uses</p>
       <p class="text-2xl font-semibold text-white">{avgUses}</p>
      </div>
     </div>

     {#if topUrl}
      <div class="rounded-xl border border-primary-400/20 bg-primary-500/10 p-4">
       <p class="text-xs uppercase tracking-wide text-primary-200">Top performer</p>
       <p class="mt-2 text-sm text-primary-100">
        wzxy.org/{topUrl.id} · {topUrl.uses} uses
       </p>
      </div>
     {/if}

     {#if urls.length}
      <div class="space-y-4">
       {#each urls as url (url.id)}
        <ShortUrl {url} selected={selectedId === url.id} />
       {/each}
      </div>
     {:else}
      <div class="rounded-xl border border-white/10 bg-white/5 p-6 text-center text-white/50">
       <p class="text-sm">
        No short links yet. Contact the Ayako team to enable URL shortening for your account.
       </p>
      </div>
     {/if}
    </div>
   </Card>

   <Card
    title={selectedId ? 'Usage Analytics' : 'Select a Link'}
    description={selectedId
     ? 'Detailed usage timeline for the selected short URL'
     : 'Choose a short link from the list to inspect its usage history'}
   >
    {#if selectedId}
     {@render children()}
    {:else}
     <div class="space-y-3 text-sm text-white/60">
      <p>Select a short link to view recent visits, timestamps, and relative usage.</p>
      <p class="text-white/40">
       Pro tip: keep these analytics open while sharing your link to spot new hits in real time.
      </p>
     </div>
    {/if}
   </Card>
  </section>
 </div>
</div>
