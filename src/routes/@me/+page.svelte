<script lang="ts">
 import { fade, fly, scale } from 'svelte/transition';
 import { cubicOut } from 'svelte/easing';
 import clsx from 'clsx';
 import type { PageServerData } from './$types';

 const { data }: { data: PageServerData } = $props();

 // Quick actions
 const quickActions = [
  {
   title: 'Create Reminder',
   description: 'Set up a new reminder for yourself or your server',
   icon: 'i-tabler-bell-plus',
   href: '/@me/reminders',
   color: 'from-primary-500 to-primary-600'
  },
  {
   title: 'Shorten URL',
   description: 'Create a custom short URL for easy sharing',
   icon: 'i-tabler-link-plus',
   href: '/@me/short-urls',
   color: 'from-success to-emerald-600'
  },
  {
   title: 'Configure Bot',
   description: 'Customize bot settings and preferences',
   icon: 'i-tabler-settings-cog',
   href: '/@me/bot',
   color: 'from-info to-blue-600'
  },
  {
   title: 'Design Themes',
   description: "Personalize your bot's appearance",
   icon: 'i-tabler-palette',
   href: '/@me/designs',
   color: 'from-accent-purple to-pink-600'
  }
 ];

 // Recent activity
 const recentActivity = [
  {
   type: 'reminder',
   message: 'Reminder set for tomorrow at 3 PM',
   time: '2 hours ago',
   icon: 'i-tabler-bell'
  },
  {
   type: 'url',
   message: 'Short URL created: /abc123',
   time: '5 hours ago',
   icon: 'i-tabler-link'
  },
  {
   type: 'settings',
   message: 'Bot settings updated',
   time: '1 day ago',
   icon: 'i-tabler-settings'
  }
 ];

 let searchQuery = $state('');
 let showWelcome = $state(!data.user?.hasSeenWelcome);
</script>

<div class="min-h-screen bg-gradient-to-br from-main-darkest via-main-darker to-main-dark">
 <!-- Background decoration -->
 <div class="absolute inset-0 overflow-hidden pointer-events-none">
  <div class="absolute top-20 left-20 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl"></div>
  <div
   class="absolute bottom-20 right-20 w-96 h-96 bg-accent-purple/10 rounded-full blur-3xl"
  ></div>
 </div>

 <div class="relative z-10 p-6 lg:p-8 max-w-7xl mx-auto">
  <!-- Welcome Message -->
  {#if showWelcome && data.user}
   <div
    class={clsx(
     'mb-8 p-6 rounded-2xl',
     'bg-gradient-to-r from-primary-500/20 to-primary-600/20',
     'border border-primary-400/30 backdrop-blur-xl',
     'animate-fade-in'
    )}
    transition:scale={{ duration: 500, easing: cubicOut }}
   >
    <div class="flex items-start justify-between">
     <div>
      <h2 class="text-2xl font-bold text-white mb-2">
       Welcome back, {data.user.username}!
      </h2>
      <p class="text-white/70">
       Here's your dashboard overview. Navigate through features using the sidebar or quick actions
       below.
      </p>
     </div>
     <button
      onclick={() => (showWelcome = false)}
      class="text-white/50 hover:text-white transition-colors"
      aria-label="Dismiss welcome message"
     >
      <span class="i-tabler-x text-xl"></span>
     </button>
    </div>
   </div>
  {/if}

  <!-- Header -->
  <header class="mb-8">
   <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
    <div>
     <h1 class="text-3xl lg:text-4xl font-bold text-white">Dashboard</h1>
     <p class="text-white/60 mt-2">Manage your Ayako bot and server settings</p>
    </div>

    <!-- Global Search -->
    <div class="relative lg:w-96">
     <input
      type="text"
      bind:value={searchQuery}
      placeholder="Search anything... (Press / to focus)"
      class={clsx(
       'w-full px-12 py-3 rounded-xl',
       'bg-white/5 backdrop-blur-xl border border-white/10',
       'text-white placeholder-white/40',
       'focus:bg-white/10 focus:border-primary-400/50',
       'transition-all duration-200'
      )}
      onkeydown={(e) => {
       if (e.key === 'Escape') searchQuery = '';
      }}
     />
     <span class="i-tabler-search absolute left-4 top-3.5 text-white/40 text-xl"></span>
     <kbd
      class="absolute right-4 top-3 px-2 py-1 text-xs bg-white/10 rounded border border-white/20 text-white/60"
     >
      /
     </kbd>
    </div>
   </div>
  </header>

  <!-- Quick Actions -->
  <section class="mb-8">
   <h2 class="text-xl font-semibold text-white mb-4 flex items-center gap-2">
    <span class="i-tabler-rocket text-primary-400"></span>
    Quick Actions
   </h2>

   <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    {#each quickActions as action, i}
     <a
      href={action.href}
      class={clsx(
       'group relative p-6 rounded-2xl overflow-hidden',
       'bg-gradient-to-br ' + action.color,
       'transform transition-all duration-300',
       'hover:scale-105 hover:shadow-2xl',
       'animate-fade-in'
      )}
      style="animation-delay: {i * 100}ms"
     >
      <!-- Background pattern -->
      <div class="absolute inset-0 opacity-10">
       <div class="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-white/20"></div>
       <div class="absolute -bottom-8 -left-8 w-24 h-24 rounded-full bg-white/10"></div>
      </div>

      <div class="relative z-10">
       <div class="mb-4">
        <span class={clsx(action.icon, 'text-3xl text-white')}></span>
       </div>
       <h3 class="text-lg font-semibold text-white mb-1">{action.title}</h3>
       <p class="text-white/80 text-sm">{action.description}</p>

       <div class="mt-4 flex items-center gap-2 text-white/90 group-hover:gap-3 transition-all">
        <span class="text-sm font-medium">Get started</span>
        <span class="i-tabler-arrow-right"></span>
       </div>
      </div>
     </a>
    {/each}
   </div>
  </section>

  <!-- Main Content Grid -->
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
   <!-- Recent Activity -->
   <div class="lg:col-span-2">
    <div class={clsx('p-6 rounded-2xl', 'glass backdrop-blur-xl', 'border border-white/10')}>
     <h2 class="text-xl font-semibold text-white mb-4 flex items-center gap-2">
      <span class="i-tabler-activity text-primary-400"></span>
      Recent Activity
     </h2>

     {#if recentActivity.length > 0}
      <div class="space-y-3">
       {#each recentActivity as activity, i}
        <div
         class={clsx(
          'flex items-center gap-4 p-4 rounded-xl',
          'bg-white/5 hover:bg-white/10',
          'transition-all duration-200',
          'animate-fade-in'
         )}
         style="animation-delay: {i * 50}ms"
        >
         <div
          class={clsx(
           'p-2 rounded-lg',
           activity.type === 'reminder' && 'bg-primary-500/20',
           activity.type === 'url' && 'bg-success/20',
           activity.type === 'settings' && 'bg-info/20'
          )}
         >
          <span
           class={clsx(
            activity.icon,
            'text-lg',
            activity.type === 'reminder' && 'text-primary-400',
            activity.type === 'url' && 'text-success',
            activity.type === 'settings' && 'text-info'
           )}
          ></span>
         </div>

         <div class="flex-1">
          <p class="text-white text-sm">{activity.message}</p>
          <p class="text-white/40 text-xs mt-1">{activity.time}</p>
         </div>

         <button
          class="text-white/30 hover:text-white/60 transition-colors"
          aria-label="More options for {activity.message}"
         >
          <span class="i-tabler-dots-vertical"></span>
         </button>
        </div>
       {/each}
      </div>

      <button
       class={clsx(
        'mt-4 w-full py-2 rounded-lg',
        'text-primary-400 text-sm font-medium',
        'hover:bg-primary-500/10 transition-all duration-200'
       )}
      >
       View all activity
      </button>
     {:else}
      <!-- Empty State -->
      <div class="py-12 text-center">
       <div class="mb-4">
        <span class="i-tabler-clock-pause text-5xl text-white/20"></span>
       </div>
       <p class="text-white/50">No recent activity</p>
       <p class="text-white/30 text-sm mt-1">Your activity will appear here</p>
      </div>
     {/if}
    </div>
   </div>

   <!-- Getting Started Guide -->
   <div>
    <div class={clsx('p-6 rounded-2xl', 'glass backdrop-blur-xl', 'border border-white/10')}>
     <h2 class="text-xl font-semibold text-white mb-4 flex items-center gap-2">
      <span class="i-tabler-bulb text-amber-400"></span>
      Getting Started
     </h2>

     <div class="space-y-3">
      <a
       href="/docs/setup"
       class={clsx(
        'block p-3 rounded-lg',
        'bg-white/5 hover:bg-white/10',
        'transition-all duration-200',
        'group'
       )}
      >
       <div class="flex items-center gap-3">
        <span class="i-tabler-book text-primary-400"></span>
        <div class="flex-1">
         <p class="text-white text-sm font-medium">Read the docs</p>
         <p class="text-white/50 text-xs">Learn about features</p>
        </div>
        <span
         class="i-tabler-chevron-right text-white/30 group-hover:text-white/60 transition-colors"
        ></span>
       </div>
      </a>

      <a
       href="/support"
       class={clsx(
        'block p-3 rounded-lg',
        'bg-white/5 hover:bg-white/10',
        'transition-all duration-200',
        'group'
       )}
      >
       <div class="flex items-center gap-3">
        <span class="i-tabler-help-circle text-success"></span>
        <div class="flex-1">
         <p class="text-white text-sm font-medium">Get support</p>
         <p class="text-white/50 text-xs">Join our Discord</p>
        </div>
        <span
         class="i-tabler-chevron-right text-white/30 group-hover:text-white/60 transition-colors"
        ></span>
       </div>
      </a>

      <a
       href="/@me/bot"
       class={clsx(
        'block p-3 rounded-lg',
        'bg-white/5 hover:bg-white/10',
        'transition-all duration-200',
        'group'
       )}
      >
       <div class="flex items-center gap-3">
        <span class="i-tabler-settings text-info"></span>
        <div class="flex-1">
         <p class="text-white text-sm font-medium">Configure bot</p>
         <p class="text-white/50 text-xs">Set up preferences</p>
        </div>
        <span
         class="i-tabler-chevron-right text-white/30 group-hover:text-white/60 transition-colors"
        ></span>
       </div>
      </a>
     </div>
    </div>

    <!-- Tips Card -->
    <div
     class={clsx(
      'mt-4 p-6 rounded-2xl',
      'bg-gradient-to-br from-primary-500/10 to-primary-600/10',
      'border border-primary-400/30'
     )}
    >
     <h3 class="text-sm font-semibold text-primary-300 mb-2 flex items-center gap-2">
      <span class="i-tabler-info-circle"></span>
      Pro Tip
     </h3>
     <p class="text-white/70 text-sm">
      Use keyboard shortcuts to navigate faster. Press <kbd
       class="px-1.5 py-0.5 bg-white/10 rounded text-xs">?</kbd
      > to see all shortcuts.
     </p>
    </div>
   </div>
  </div>
 </div>
</div>

<!-- Keyboard shortcut listener -->
<svelte:window
 onkeydown={(e) => {
  if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
   e.preventDefault();
   const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
   searchInput?.focus();
  }
 }}
/>

<style>
 @keyframes fade-in {
  from {
   opacity: 0;
   transform: translateY(10px);
  }
  to {
   opacity: 1;
   transform: translateY(0);
  }
 }

 .animate-fade-in {
  animation: fade-in 0.5s ease-out forwards;
  opacity: 0;
 }
</style>
