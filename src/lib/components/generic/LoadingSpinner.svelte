<script lang="ts">
 import clsx from 'clsx';

 interface LoadingSpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'dots' | 'pulse' | 'bars' | 'ring';
  color?: 'primary' | 'white' | 'current';
  class?: string;
  label?: string;
 }

 const {
  size = 'md',
  variant = 'default',
  color = 'primary',
  class: className,
  label = 'Loading...'
 }: LoadingSpinnerProps = $props();

 const sizeMap = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12'
 };

 const colorMap = {
  primary: 'text-primary-500',
  white: 'text-white',
  current: 'text-current'
 };

 const containerClasses = clsx('inline-flex items-center justify-center', className);
</script>

<div class={containerClasses} role="status" aria-live="polite" aria-busy="true">
 <span class="sr-only">{label}</span>
 {#if variant === 'default'}
  <svg
   class={clsx(sizeMap[size], colorMap[color], 'animate-spin')}
   xmlns="http://www.w3.org/2000/svg"
   fill="none"
   viewBox="0 0 24 24"
  >
   <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
   ></circle>
   <path
    class="opacity-75"
    fill="currentColor"
    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
   ></path>
  </svg>
 {:else if variant === 'dots'}
  <div class="flex space-x-1">
   {#each [0, 1, 2] as i}
    <div
     class={clsx(
      'rounded-full bg-current animate-pulse',
      size === 'xs' && 'w-1 h-1',
      size === 'sm' && 'w-1.5 h-1.5',
      size === 'md' && 'w-2 h-2',
      size === 'lg' && 'w-2.5 h-2.5',
      size === 'xl' && 'w-3 h-3',
      colorMap[color]
     )}
     style="animation-delay: {i * 150}ms;"
    ></div>
   {/each}
  </div>
 {:else if variant === 'pulse'}
  <div class="relative">
   <div
    class={clsx(
     'rounded-full animate-ping absolute inline-flex h-full w-full opacity-75',
     sizeMap[size],
     color === 'primary' && 'bg-primary-400',
     color === 'white' && 'bg-white',
     color === 'current' && 'bg-current'
    )}
   ></div>
   <div
    class={clsx(
     'relative inline-flex rounded-full',
     sizeMap[size],
     color === 'primary' && 'bg-primary-500',
     color === 'white' && 'bg-white',
     color === 'current' && 'bg-current'
    )}
   ></div>
  </div>
 {:else if variant === 'bars'}
  <div class="flex space-x-1">
   {#each [0, 1, 2, 3] as i}
    <div
     class={clsx(
      'bg-current animate-bars',
      size === 'xs' && 'w-0.5 h-3',
      size === 'sm' && 'w-0.5 h-4',
      size === 'md' && 'w-1 h-5',
      size === 'lg' && 'w-1 h-6',
      size === 'xl' && 'w-1.5 h-8',
      colorMap[color]
     )}
     style="animation-delay: {i * 100}ms;"
    ></div>
   {/each}
  </div>
 {:else if variant === 'ring'}
  <div
   class={clsx(
    'rounded-full border-2 border-t-transparent animate-spin',
    sizeMap[size],
    color === 'primary' && 'border-primary-500',
    color === 'white' && 'border-white',
    color === 'current' && 'border-current'
   )}
  ></div>
 {/if}
</div>

<style>
 @keyframes bars {
  0%,
  100% {
   transform: scaleY(0.5);
  }
  50% {
   transform: scaleY(1);
  }
 }

 .animate-bars {
  animation: bars 1s ease-in-out infinite;
 }

 .sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
 }

 @media (prefers-reduced-motion: reduce) {
  .animate-spin,
  .animate-pulse,
  .animate-ping,
  .animate-bars {
   animation: none;
  }
 }
</style>
