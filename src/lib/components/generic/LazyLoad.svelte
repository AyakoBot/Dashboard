<script lang="ts">
 import { onMount, type Snippet } from 'svelte';
 import { fade, fly } from 'svelte/transition';
 import clsx from 'clsx';

 interface LazyLoadProps {
  threshold?: number;
  rootMargin?: string;
  placeholder?: Snippet;
  children: Snippet;
  transition?: 'fade' | 'fly' | 'scale' | 'none';
  duration?: number;
  delay?: number;
  once?: boolean;
  class?: string;
 }

 const {
  threshold = 0.1,
  rootMargin = '50px',
  placeholder,
  children,
  transition = 'fade',
  duration = 300,
  delay = 0,
  once = true,
  class: className = ''
 }: LazyLoadProps = $props();

 let container = $state<HTMLDivElement>();
 let isVisible = $state(false);
 let hasBeenVisible = $state(false);
 let observer: IntersectionObserver | null = null;

 onMount(() => {
  if (!container) return;

  // Set up Intersection Observer
  observer = new IntersectionObserver(
   (entries) => {
    entries.forEach((entry) => {
     if (entry.isIntersecting) {
      isVisible = true;
      hasBeenVisible = true;

      // If once is true, disconnect observer after first load
      if (once && observer) {
       observer.disconnect();
       observer = null;
      }
     } else if (!once) {
      isVisible = false;
     }
    });
   },
   {
    threshold,
    rootMargin
   }
  );

  observer.observe(container);

  // Cleanup
  return () => {
   if (observer) {
    observer.disconnect();
    observer = null;
   }
  };
 });

 const getTransition = (node: HTMLElement) => {
  switch (transition) {
   case 'fly':
    return fly(node, { y: 20, duration, delay });
   case 'scale':
    return { duration, delay, css: (t: number) => `transform: scale(${t}); opacity: ${t}` };
   case 'fade':
   default:
    return fade(node, { duration, delay });
  }
 };
</script>

<div bind:this={container} class={clsx('lazy-load-container', className)}>
 {#if !hasBeenVisible && placeholder}
  <!-- Placeholder content while loading -->
  <div class="lazy-load-placeholder">
   {@render placeholder()}
  </div>
 {/if}

 {#if hasBeenVisible || !placeholder}
  {#if transition !== 'none' && isVisible}
   <div transition:getTransition>
    {@render children()}
   </div>
  {:else if transition === 'none' && (isVisible || hasBeenVisible)}
   {@render children()}
  {/if}
 {/if}
</div>

<style>
 .lazy-load-container {
  min-height: 1px; /* Ensure container has height for observer */
 }

 .lazy-load-placeholder {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
 }

 @keyframes pulse {
  0%,
  100% {
   opacity: 1;
  }
  50% {
   opacity: 0.5;
  }
 }
</style>
