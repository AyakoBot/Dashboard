<script lang="ts">
 import { fade, scale } from 'svelte/transition';
 import clsx from 'clsx';
 import type { Snippet } from 'svelte';
 
 interface EmptyStateProps {
 icon?: string;
 title: string;
 description?: string;
 actionLabel?: string;
 actionIcon?: string;
 onAction?: () => void;
 secondaryActionLabel?: string;
 onSecondaryAction?: () => void;
 variant?: 'default' | 'compact' | 'centered';
 illustration?: 'empty' | 'error' | 'search' | 'connection' | 'maintenance';
 children?: Snippet;
 }
 
 const {
 icon,
 title,
 description,
 actionLabel,
 actionIcon,
 onAction,
 secondaryActionLabel,
 onSecondaryAction,
 variant = 'default',
 illustration,
 children,
 }: EmptyStateProps = $props();
 
 const getIllustrationIcon = (): string => {
 switch (illustration) {
  case 'empty':
  return 'i-tabler-inbox';
  case 'error':
  return 'i-tabler-alert-triangle';
  case 'search':
  return 'i-tabler-search-off';
  case 'connection':
  return 'i-tabler-wifi-off';
  case 'maintenance':
  return 'i-tabler-tool';
  default:
  return icon || 'i-tabler-package-off';
 }
 };
 
 const illustrationIcon = $derived(getIllustrationIcon());
</script>

<div 
 class={clsx(
 'flex flex-col items-center justify-center text-center',
 variant === 'default' && 'py-16 px-8',
 variant === 'compact' && 'py-8 px-4',
 variant === 'centered' && 'min-h-64 p-8',
 'animate-fade-in'
 )}
 transition:fade={{ duration: 300 }}
>
 <!-- Illustration/Icon -->
 <div 
 class="mb-6 relative"
 transition:scale={{ duration: 500, delay: 100 }}
 >
 <!-- Background decoration -->
 <div class="absolute inset-0 opacity-20">
  <div class="absolute inset-0 bg-primary-500/20 rounded-full blur-3xl"></div>
 </div>
 
 <!-- Main Icon -->
 <div class={clsx(
  'relative',
  'w-24 h-24 rounded-full',
  'bg-gradient-to-br from-primary-500/10 to-primary-600/10',
  'border border-primary-400/20',
  'flex items-center justify-center',
  'group'
 )}>
  <span class={clsx(
  illustrationIcon,
  'text-4xl text-primary-400/70',
  'group-hover:scale-110 transition-transform duration-300'
  )}></span>
 </div>
 
 <!-- Decorative elements -->
 <div class="absolute -top-2 -right-2 w-3 h-3 bg-primary-400/30 rounded-full animate-pulse"></div>
 <div class="absolute -bottom-1 -left-1 w-2 h-2 bg-primary-500/30 rounded-full animate-pulse" style="animation-delay: 0.5s"></div>
 <div class="absolute top-1/2 -right-4 w-2 h-2 bg-primary-300/30 rounded-full animate-pulse" style="animation-delay: 1s"></div>
 </div>
 
 <!-- Text Content -->
 <div class="max-w-md">
 <h3 class={clsx(
  'font-semibold text-white mb-2',
  variant === 'compact' ? 'text-lg' : 'text-xl'
 )}>
  {title}
 </h3>
 
 {#if description}
  <p class={clsx(
  'text-white/60',
  variant === 'compact' ? 'text-sm' : 'text-base'
  )}>
  {description}
  </p>
 {/if}
 </div>
 
 <!-- Actions -->
 {#if actionLabel || secondaryActionLabel}
 <div class="flex flex-col sm:flex-row items-center gap-3 mt-8">
  {#if actionLabel && onAction}
  <button
   onclick={onAction}
   class={clsx(
   'px-6 py-2.5 rounded-lg font-medium',
   'bg-primary-500 hover:bg-primary-600',
   'text-white shadow-lg',
   'transform transition-all duration-200',
   'hover:scale-105 hover:shadow-xl',
   'flex items-center gap-2'
   )}
  >
   {#if actionIcon}
   <span class={clsx(actionIcon, 'text-lg')}></span>
   {/if}
   {actionLabel}
  </button>
  {/if}
  
  {#if secondaryActionLabel && onSecondaryAction}
  <button
   onclick={onSecondaryAction}
   class={clsx(
   'px-6 py-2.5 rounded-lg font-medium',
   'text-white/70 hover:text-white',
   'hover:bg-white/10',
   'transition-all duration-200'
   )}
  >
   {secondaryActionLabel}
  </button>
  {/if}
 </div>
 {/if}
 
 <!-- Additional Content Slot -->
 {#if children}
 <div class="mt-8">
  {@render children()}
 </div>
 {/if}
 
 <!-- Helpful Tips (optional) -->
 {#if variant === 'default'}
 <div class="mt-12 p-4 rounded-lg bg-white/5 max-w-sm">
  <div class="flex items-start gap-3">
  <span class="i-tabler-bulb text-amber-400 text-lg mt-0.5"></span>
  <div class="text-left">
   <p class="text-xs font-medium text-white/80 mb-1">Quick tip</p>
   <p class="text-xs text-white/60">
   {#if illustration === 'empty'}
    Start by creating your first item using the button above.
   {:else if illustration === 'search'}
    Try adjusting your search filters or search for something else.
   {:else if illustration === 'connection'}
    Check your internet connection and try refreshing the page.
   {:else if illustration === 'error'}
    If this problem persists, please contact support.
   {:else}
    Need help? Check out our documentation or contact support.
   {/if}
   </p>
  </div>
  </div>
 </div>
 {/if}
</div>

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
 animation: fade-in 0.5s ease-out;
 }
</style>