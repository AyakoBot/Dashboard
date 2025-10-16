<script lang="ts">
 import clsx from 'clsx';
 import { onDestroy } from 'svelte';

 interface ShortUrlRecord {
  id: string;
  forward: string;
  uses: number;
 }

 const { url, selected = false }: { url: ShortUrlRecord; selected?: boolean } = $props();

 const shortLink = $derived(`https://wzxy.org/${url.id}`);

 let slugCopied = $state(false);
 let targetCopied = $state(false);
 let slugTimeout: ReturnType<typeof setTimeout> | null = null;
 let targetTimeout: ReturnType<typeof setTimeout> | null = null;

 const clearTimers = () => {
  if (slugTimeout) clearTimeout(slugTimeout);
  if (targetTimeout) clearTimeout(targetTimeout);
  slugTimeout = null;
  targetTimeout = null;
 };

 const copyToClipboard = (value: string, type: 'slug' | 'target') => {
  navigator.clipboard.writeText(value).catch(() => null);

  if (type === 'slug') {
   slugCopied = true;
   if (slugTimeout) clearTimeout(slugTimeout);
   slugTimeout = setTimeout(() => {
    slugCopied = false;
    slugTimeout = null;
   }, 1200);
  }
  if (type === 'target') {
   targetCopied = true;
   if (targetTimeout) clearTimeout(targetTimeout);
   targetTimeout = setTimeout(() => {
    targetCopied = false;
    targetTimeout = null;
   }, 1200);
  }
 };

 const openExternal = (url: string) => {
  if (typeof window === 'undefined') return;
  window.open(url, '_blank', 'noopener');
 };

 const truncatedForward = $derived(url.forward.replace(/^https?:\/\//, '').replace(/^www\./, ''));

 onDestroy(clearTimers);
</script>

<div
 class={clsx(
  'relative rounded-xl border border-white/10 bg-main-darker/70 p-5 transition-all duration-300',
  selected && 'border-primary-400/60 shadow-lg shadow-primary-500/10'
 )}
>
 <div class="flex flex-wrap items-start justify-between gap-4">
  <div class="space-y-2">
   <p class="text-xs uppercase tracking-wide text-white/40">Short Link</p>
   <button
    type="button"
    onclick={() => copyToClipboard(shortLink, 'slug')}
    class="flex items-center gap-2 text-sm font-semibold text-white hover:text-primary-300 transition"
   >
    <span>{shortLink.replace('https://', '')}</span>
    <span
     class={clsx(slugCopied ? 'i-tabler-check text-success' : 'i-tabler-copy text-white/40')}
     aria-hidden="true"
    ></span>
   </button>
  </div>
  <div class="text-right">
   <p class="text-xs uppercase tracking-wide text-white/40">Total Uses</p>
   <p class="text-2xl font-semibold text-white">{url.uses}</p>
  </div>
 </div>

 <div class="mt-4 rounded-lg border border-white/5 bg-main-darker/60 p-4">
  <p class="text-xs uppercase tracking-wide text-white/40">Destination</p>
  <div class="mt-2 flex flex-wrap items-center gap-2">
   <span class="truncate text-sm text-white/80 max-w-60">
    {truncatedForward}
   </span>
   <button
    type="button"
    onclick={() => copyToClipboard(url.forward, 'target')}
    class="btn-ghost text-xs"
   >
    {targetCopied ? 'Copied Destination' : 'Copy Destination'}
   </button>
   <button type="button" onclick={() => openExternal(url.forward)} class="btn-link text-xs">
    Open Link
   </button>
  </div>
 </div>

 <div class="mt-4 flex flex-wrap items-center gap-3">
  <a
   class={clsx('btn-secondary', selected && 'border-primary-400/60 text-primary-200')}
   href={`/@me/short-urls/${url.id}`}
   data-sveltekit-preload-data="hover"
  >
   View Analytics
  </a>
  <button
   type="button"
   class="btn-danger opacity-60 cursor-not-allowed"
   title="URL deletion coming soon"
   aria-disabled="true"
  >
   Delete
  </button>
 </div>
</div>
