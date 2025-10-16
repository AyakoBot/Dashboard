<script lang="ts">
 import Badge from '$lib/components/generic/Badge.svelte';
 import Card from '$lib/components/generic/Card.svelte';
 import clsx from 'clsx';
 import makeRequest from '$lib/scripts/util/makeRequest';
 import { ERROR_DEFINITIONS } from '$lib/scripts/errorDefinitions.js';

 const openExternal = (url: string) => {
  if (typeof window === 'undefined') return;
  window.open(url, '_blank', 'noopener');
 };

 const resourceLinks = [
  {
   label: 'API Documentation',
   description: 'Comprehensive endpoint reference and usage examples',
   action: () => openExternal('https://docs.ayakobot.com'),
   icon: 'i-tabler-book',
   accent: 'text-primary-300'
  },
  {
   label: 'Developer Discord',
   description: 'Chat with the Ayako team and other integrators',
   action: () => openExternal('https://support.ayakobot.com'),
   icon: 'i-tabler-messages',
   accent: 'text-accent-cyan'
  },
  {
   label: 'Status Page',
   description: 'Track incidents and maintenance windows in real-time',
   action: () => openExternal('https://status.ayakobot.com'),
   icon: 'i-tabler-activity',
   accent: 'text-success'
  }
 ];

 const integrationSteps = [
  'Generate a personal API token and store it securely',
  'Add the token to your environment variables or secret manager',
  'Use the documented base URL and authenticated requests only',
  'Set up monitoring and rotate the token regularly'
 ];

 const showcasedErrors = ERROR_DEFINITIONS.slice(0, 3);

 let token = $state<string | null>(null);
 let copied = $state(false);
 let isGenerating = $state(false);
 let feedback = $state<string | null>(null);
 let timeout: ReturnType<typeof setTimeout> | null = null;

 const resetTimers = () => {
  if (timeout) clearTimeout(timeout);
 };

 const generateToken = async () => {
  if (isGenerating) return;

  isGenerating = true;
  feedback = null;

  const response = await makeRequest(
   { method: 'POST', path: '/@me/auth/generate' },
   {},
   fetch
  ).catch(() => null);

  if (!response?.token) {
   feedback = 'Unable to generate a token right now. Please try again shortly.';
   isGenerating = false;
   return;
  }

  token = response.token;
  feedback = 'New token generated. Copy it now—this value is shown once.';
  copied = false;
  resetTimers();
  isGenerating = false;
 };

 const copyToken = () => {
  if (!token) return;

  navigator.clipboard.writeText(token).catch(() => null);
  copied = true;

  resetTimers();
  timeout = setTimeout(() => {
   copied = false;
   timeout = null;
  }, 1200);
 };
</script>

<div class="p-8">
 <div class="max-w-6xl mx-auto space-y-10">
  <header class="space-y-4">
   <h1 class="text-4xl font-bold text-white">API Access & Integrations</h1>
   <p class="text-white/60 max-w-3xl">
    Manage your personal API token, review integration guidelines, and explore developer resources.
    Everything in this space follows the same design system shared across the dashboard.
   </p>
  </header>

  <section class="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
   <Card title="Personal Access Token" description="Generate and manage your secret API token">
    {#snippet children()}
     <div class="space-y-6">
      <div class="rounded-xl border border-white/10 bg-white/5 p-4">
       <p class="text-sm text-white/50">
        Tokens are single-view. Copy and store yours in a secure vault after generating it.
       </p>
      </div>

      <div class="flex flex-wrap items-center gap-3">
       <button
        type="button"
        class={clsx('btn-primary', isGenerating && 'opacity-60 pointer-events-none')}
        disabled={isGenerating}
        onclick={generateToken}
       >
        {isGenerating ? 'Generating…' : token ? 'Regenerate Token' : 'Generate Token'}
       </button>
       <button
        type="button"
        class="btn-link"
        onclick={() => openExternal('https://docs.ayakobot.com')}
       >
        Visit API Docs
       </button>
      </div>

      <div class="space-y-3">
       <button
        onclick={copyToken}
        onkeydown={(event) => event.key === 'Enter' && copyToken()}
        type="button"
        class="w-full rounded-lg border border-white/10 bg-main-darker/80 px-4 py-3 text-left transition hover:border-primary-400/40 focus-visible:border-primary-400/40 focus-visible:outline-none"
        aria-live="polite"
       >
        <div class="flex items-center justify-between gap-3 text-white">
         <span class="text-sm font-mono">
          {token || 'Generate a token to reveal the value here'}
         </span>
         <span class={copied ? 'i-tabler-check text-success' : 'i-tabler-copy text-white/40'}
         ></span>
        </div>
       </button>
       <p class="text-xs text-white/40">
        {copied ? 'Copied to clipboard.' : 'This button copies the token instantly.'}
       </p>
       {#if feedback}
        <p class="text-xs text-warning uppercase tracking-wide">{feedback}</p>
       {/if}
      </div>

      <div class="rounded-xl border border-danger/20 bg-danger/10 p-4 text-danger">
       <ul class="space-y-2 text-sm">
        <li>Rotating the token immediately invalidates the previous value.</li>
        <li>Store tokens in encrypted secrets—never embed them in client code.</li>
        <li>Contact support if you suspect a leak or unusual activity.</li>
       </ul>
      </div>
     </div>
    {/snippet}
   </Card>

   <Card
    title="Integration Checklist"
    description="Keep your implementation aligned with best practices"
   >
    {#snippet children()}
     <ul class="space-y-3">
      {#each integrationSteps as step}
       <li class="flex items-start gap-3 text-sm text-white/70">
        <span class="i-tabler-circle-check text-success"></span>
        <span>{step}</span>
       </li>
      {/each}
     </ul>
    {/snippet}
   </Card>
  </section>

  <section class="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
   <Card title="Developer Resources" description="Helpful destinations for integration success">
    {#snippet children()}
     <ul class="space-y-4">
      {#each resourceLinks as resource}
       <li
        class="flex items-start gap-3 rounded-xl border border-white/10 bg-main-darker/80 p-4 transition hover:border-primary-400/30 hover:shadow-lg"
       >
        <span class={clsx('text-xl', resource.accent, resource.icon)}></span>
        <div class="flex-1 space-y-2">
         <p class="text-sm font-semibold text-white">{resource.label}</p>
         <p class="text-xs text-white/50">{resource.description}</p>
         <button type="button" class="btn-link" onclick={resource.action}>Open</button>
        </div>
       </li>
      {/each}
     </ul>
    {/snippet}
   </Card>
  </section>
 </div>
</div>
