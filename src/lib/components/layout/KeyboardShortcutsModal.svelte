<script lang="ts">
 import { fade, scale } from 'svelte/transition';
 import clsx from 'clsx';

 interface Props {
  isOpen: boolean;
  onClose: () => void;
 }

 let { isOpen, onClose }: Props = $props();

 const shortcuts = [
  {
   category: 'Navigation',
   items: [
    { keys: ['G', 'D'], description: 'Go to Dashboard' },
    { keys: ['G', 'R'], description: 'Go to Reminders' },
    { keys: ['⌘', 'G'], description: 'Browse Servers' },
    { keys: ['⌘', 'B'], description: 'Toggle Sidebar' }
   ]
  },
  {
   category: 'Search & Help',
   items: [
    { keys: ['/'], description: 'Focus Search' },
    { keys: ['⌘', 'K'], description: 'Quick Search' },
    { keys: ['?'], description: 'Toggle Help' }
   ]
  },
  {
   category: 'Modal Navigation',
   items: [
    { keys: ['↑', '↓'], description: 'Navigate Items' },
    { keys: ['Enter'], description: 'Select Item' },
    { keys: ['Esc'], description: 'Close Modal' }
   ]
  }
 ];

 const handleKeyDown = (e: KeyboardEvent) => {
  if (!isOpen) return;
  if (e.key === 'Escape') {
   e.preventDefault();
   onClose();
  }
  // Don't handle '?' here - let the parent layout handle it for toggling
 };
</script>

<svelte:window on:keydown={handleKeyDown} />

{#if isOpen}
 <button
  class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
  onclick={onClose}
  transition:fade={{ duration: 200 }}
  aria-label="Close modal"
 ></button>

 <div
  class="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
  transition:fade={{ duration: 200 }}
 >
  <div
   class={clsx(
    'bg-neutral-900/95 backdrop-blur-xl rounded-2xl',
    'border border-white/10 shadow-2xl',
    'w-full max-w-2xl max-h-[80vh]',
    'flex flex-col pointer-events-auto',
    'overflow-hidden'
   )}
   onclick={(e) => e.stopPropagation()}
   onkeydown={(e) => e.stopPropagation()}
   role="dialog"
   aria-modal="true"
   aria-labelledby="shortcuts-modal-title"
   tabindex="-1"
   transition:scale={{ duration: 200, start: 0.95 }}
  >
   <div class="p-6 border-b border-white/10">
    <div class="flex items-center justify-between">
     <div>
      <h2 id="shortcuts-modal-title" class="text-2xl font-bold text-white flex items-center gap-3">
       <span class="i-tabler-keyboard text-primary-400"></span>
       Keyboard Shortcuts
      </h2>
      <p class="text-sm text-white/60 mt-1">Navigate faster with these keyboard combinations</p>
     </div>
     <button
      onclick={onClose}
      class="p-2 rounded-lg hover:bg-white/10 transition-colors group"
      aria-label="Close"
     >
      <span class="i-tabler-x text-xl text-white/60 group-hover:text-white"></span>
     </button>
    </div>
   </div>

   <div class="flex-1 overflow-y-auto p-6">
    <div class="space-y-8">
     {#each shortcuts as section}
      <div>
       <h3
        class="text-sm font-semibold text-primary-400 uppercase tracking-wider mb-4 flex items-center gap-2"
       >
        <span class="w-8 h-px bg-primary-400/30"></span>
        {section.category}
        <span class="flex-1 h-px bg-primary-400/30"></span>
       </h3>

       <div class="grid gap-3">
        {#each section.items as shortcut}
         <div
          class={clsx(
           'flex items-center justify-between p-3 rounded-lg',
           'bg-white/5 hover:bg-white/10',
           'border border-white/5 hover:border-white/10',
           'transition-all duration-200 group'
          )}
         >
          <span class="text-white/80 group-hover:text-white transition-colors">
           {shortcut.description}
          </span>

          <div class="flex items-center gap-1">
           {#each shortcut.keys as key, i}
            {#if i > 0}
             <span class="text-white/30 text-xs mx-1">+</span>
            {/if}
            <kbd
             class={clsx(
              'px-2.5 py-1 rounded-md',
              'bg-white/10 backdrop-blur-sm',
              'border border-white/20',
              'text-white text-sm font-medium',
              'shadow-sm',
              'group-hover:bg-primary-500/20 group-hover:border-primary-400/50',
              'transition-all duration-200'
             )}
            >
             {key}
            </kbd>
           {/each}
          </div>
         </div>
        {/each}
       </div>
      </div>
     {/each}
    </div>

    <div class="mt-8 p-4 rounded-xl bg-primary-500/10 border border-primary-400/20">
     <p class="text-sm text-primary-300/80">
      <span class="font-semibold text-primary-300">Pro tip:</span> Press
      <kbd class="px-2 py-0.5 mx-1 bg-primary-500/20 rounded text-xs">?</kbd>
      at any time to toggle this help menu
     </p>
    </div>
   </div>

   <div class="p-4 border-t border-white/10 bg-white/5">
    <div class="flex items-center justify-between text-xs text-white/40">
     <div>
      Press <kbd class="px-1.5 py-0.5 bg-white/10 rounded">Esc</kbd> or
      <kbd class="px-1.5 py-0.5 bg-white/10 rounded">?</kbd> to close
     </div>
     <div class="flex items-center gap-2">
      <span class="i-tabler-command text-sm"></span>
      <span>Command/Ctrl key</span>
     </div>
    </div>
   </div>
  </div>
 </div>
{/if}

<style>
 @keyframes fade-in {
  from {
   opacity: 0;
  }
  to {
   opacity: 1;
  }
 }
</style>
