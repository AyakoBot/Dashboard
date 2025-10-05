<script lang="ts">
import '$lib/scripts/index.js';
import './main.css';

import { invalidateAll } from '$app/navigation';
import { navigating, page } from '$app/stores';
 import Login from '$lib/components/generic/Login.svelte';
 import Modal from '$lib/components/generic/Modal.svelte';
 import KeyboardShortcutsModal from '$lib/components/layout/KeyboardShortcutsModal.svelte';
 import NavigationSidebar from '$lib/components/layout/NavigationSidebar.svelte';
import NotificationToast from '$lib/components/layout/NotificationToast.svelte';
import clsx from 'clsx';
import { onMount, type Snippet } from 'svelte';
 import { fade } from 'svelte/transition';
import type { LayoutData } from './$types';

const { data, children }: { data: LayoutData; children: Snippet } = $props();
const currentPage = $derived($page);
const navigationState = $derived($navigating);
const showNavigationOverlay = $derived(Boolean(navigationState));

 let showLogin = $state(false);
 let mounted = $state(false);
 let showKeyboardShortcuts = $state(false);

onMount(() => {
mounted = true;

if (!currentPage?.url?.searchParams?.has('reload')) return;
invalidateAll();
location.href = '/';
});

let keySequence = '';
 let keySequenceTimer: ReturnType<typeof setTimeout>;
 
 const handleKeyboard = (e: KeyboardEvent) => {
 const target = e.target as HTMLElement;
 const isInputField = ['INPUT', 'TEXTAREA'].includes(target.tagName);
 
 if (e.key === '?' && !isInputField) {
  e.preventDefault();
  showKeyboardShortcuts = !showKeyboardShortcuts;
  return;
 }
 
 // Vim-style navigation shortcuts
 if (!isInputField && !e.ctrlKey && !e.metaKey && !e.altKey) {
  const key = e.key.toUpperCase();
  
  if (key === 'G' || key === 'D' || key === 'R') {
   clearTimeout(keySequenceTimer);
   keySequence += key;
   
   // Check for complete sequences
   if (keySequence === 'GD') {
    e.preventDefault();
    location.href = '/@me';
    keySequence = '';
   } else if (keySequence === 'GR') {
    e.preventDefault();
    location.href = '/@me/reminders';
    keySequence = '';
   } else if (keySequence.length >= 2) {
    // Reset if sequence doesn't match
    keySequence = '';
   } else {
    // Reset sequence after 1 second
    keySequenceTimer = setTimeout(() => {
     keySequence = '';
    }, 1000);
   }
  } else if (keySequence.length > 0) {
   // Reset on any other key
   keySequence = '';
  }
 }
 };
</script>

<svelte:window onkeydown={handleKeyboard} />

{#if showLogin}
 <Modal 
 author="Sign In to Ayako" 
 description="Access your dashboard and manage your bot"
 close={() => (showLogin = false)}
 variant="glass"
 >
 <Login>
  <button
  class="btn-danger mt-6"
  type="button"
  onclick={() => (showLogin = false)}
  onkeydown={(e) => e.key === 'Enter' && (showLogin = false)}
  >
  Cancel
  </button>
 </Login>
 </Modal>
{/if}

<KeyboardShortcutsModal 
 isOpen={showKeyboardShortcuts}
 onClose={() => (showKeyboardShortcuts = false)}
/>

<div
 class={clsx(
 'flex flex-row justify-start items-start relative overflow-hidden min-h-screen',
 'bg-gradient-to-br from-main-darkest via-main-darker to-main-dark'
 )}
>
 <div class="absolute inset-0 opacity-20 pointer-events-none">
 <div class="absolute top-0 left-0 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl"></div>
 <div class="absolute bottom-0 right-0 w-96 h-96 bg-accent-purple/10 rounded-full blur-3xl"></div>
 <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent-cyan/10 rounded-full blur-3xl"></div>
 </div>

 <NavigationSidebar {data} onLogin={() => (showLogin = true)} />

 <main 
 class={clsx(
  'flex-1 relative overflow-y-auto overflow-x-hidden custom-scrollbar h-screen',
  'animate-fade-in'
 )}
 id="main-content"
 aria-label="Main content"
 tabindex="-1"
 >
 {#if showNavigationOverlay}
 <div class="absolute inset-0 bg-gradient-to-br from-main-darkest to-main-dark z-50 flex items-center justify-center" transition:fade={{ duration: 150 }}>
  <div class="flex flex-col items-center gap-6">
   <div class="relative">
     <div class="w-20 h-20 rounded-full border-4 border-primary-500/20 border-t-primary-500 animate-spin"></div>
     <div class="absolute inset-0 w-20 h-20 rounded-full border-4 border-transparent border-b-accent-purple/50 animate-spin-reverse"></div>
    </div>
    <div class="flex items-center gap-2">
     <div class="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style="animation-delay: 0ms"></div>
     <div class="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style="animation-delay: 150ms"></div>
     <div class="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style="animation-delay: 300ms"></div>
    </div>
    <p class="text-white/60 text-sm animate-pulse">Loading...</p>
   </div>
  </div>
 {/if}
 
 {@render children()}
 </main>
</div>

<NotificationToast />

<style>
@keyframes spin-reverse {
 0% {
  transform: rotate(0deg);
 }
 100% {
  transform: rotate(-360deg);
 }
}

.animate-spin-reverse {
 animation: spin-reverse 1s linear infinite;
}
</style>

<button
 onclick={() => (showKeyboardShortcuts = !showKeyboardShortcuts)}
 class={clsx(
 'fixed bottom-6 right-6 z-40',
 'w-12 h-12 rounded-full',
 showKeyboardShortcuts 
  ? 'bg-white/20 hover:bg-white/30 ring-2 ring-white/40' 
  : 'bg-primary-500/90 hover:bg-primary-600',
 'backdrop-blur-xl shadow-lg hover:shadow-xl',
 'flex items-center justify-center',
 'text-white font-bold text-lg',
 'transition-all duration-200 transform hover:scale-110',
 'group'
 )}
 aria-label={showKeyboardShortcuts ? "Close keyboard shortcuts" : "Show keyboard shortcuts"}
 aria-pressed={showKeyboardShortcuts}
>
 <span class={clsx(
  showKeyboardShortcuts ? 'i-tabler-x' : 'i-tabler-question-mark',
  'text-xl transition-transform duration-200',
  showKeyboardShortcuts && 'rotate-90'
 )}></span>
 {#if !showKeyboardShortcuts}
 <div class={clsx(
 'absolute bottom-full mb-2 right-0',
 'px-3 py-1.5 rounded-lg',
 'bg-main-darker/95 backdrop-blur-xl border border-white/10',
 'text-xs text-white whitespace-nowrap',
 'opacity-0 group-hover:opacity-100',
 'pointer-events-none transition-opacity duration-200',
 'shadow-xl'
 )}>
 Keyboard shortcuts (?)
 </div>
 {/if}
</button>
