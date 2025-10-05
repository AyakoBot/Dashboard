<script lang="ts">
 import clsx from 'clsx';
 import { onMount } from 'svelte';
 
 interface ProgressIndicatorProps {
 value?: number;
 max?: number;
 variant?: 'linear' | 'circular' | 'dots' | 'skeleton';
 size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
 color?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
 indeterminate?: boolean;
 showLabel?: boolean;
 label?: string;
 class?: string;
 }
 
 const {
 value = 0,
 max = 100,
 variant = 'linear',
 size = 'md',
 color = 'primary',
 indeterminate = false,
 showLabel = false,
 label = '',
 class: className = '',
 }: ProgressIndicatorProps = $props();
 
 const percentage = $derived(Math.min((value / max) * 100, 100));
 let mounted = $state(false);
 
 onMount(() => {
 // Trigger animation after mount
 requestAnimationFrame(() => {
  mounted = true;
 });
 });
 
 const sizeClasses = {
 xs: { height: 'h-1', text: 'text-xs' },
 sm: { height: 'h-1.5', text: 'text-sm' },
 md: { height: 'h-2', text: 'text-base' },
 lg: { height: 'h-3', text: 'text-lg' },
 xl: { height: 'h-4', text: 'text-xl' },
 };
 
 const colorClasses = {
 primary: 'bg-primary-500',
 success: 'bg-success',
 warning: 'bg-warning',
 danger: 'bg-danger',
 info: 'bg-info',
 };
</script>

<div class={clsx('progress-indicator', className)}>
 {#if variant === 'linear'}
 <!-- Linear Progress Bar -->
 <div class="w-full">
  {#if label || showLabel}
  <div class="flex justify-between items-center mb-2">
   <span class={clsx('text-white/70', sizeClasses[size].text)}>
   {label || 'Progress'}
   </span>
   {#if showLabel && !indeterminate}
   <span class={clsx('text-white/50', sizeClasses[size].text)}>
    {percentage.toFixed(0)}%
   </span>
   {/if}
  </div>
  {/if}
  
  <div 
  class={clsx(
   'w-full rounded-full overflow-hidden',
   'bg-white/10',
   sizeClasses[size].height
  )}
  role="progressbar"
  aria-valuenow={indeterminate ? undefined : value}
  aria-valuemin={0}
  aria-valuemax={max}
  >
  {#if indeterminate}
   <div 
   class={clsx(
    'h-full rounded-full',
    colorClasses[color],
    'animate-indeterminate'
   )}
   ></div>
  {:else}
   <div 
   class={clsx(
    'h-full rounded-full transition-all duration-500 ease-out',
    colorClasses[color],
    'relative overflow-hidden'
   )}
   style="width: {mounted ? percentage : 0}%"
   >
   <!-- Shimmer effect -->
   <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
   </div>
  {/if}
  </div>
 </div>
 
 {:else if variant === 'circular'}
 <!-- Circular Progress -->
 <div class="relative inline-flex items-center justify-center">
  {#if size === 'xs'}
  {@const radius = 8}
  {@const circumference = 2 * Math.PI * radius}
  <svg class="w-5 h-5 transform -rotate-90">
   <circle
   cx="10"
   cy="10"
   r={radius}
   stroke="currentColor"
   stroke-width="2"
   fill="none"
   class="text-white/10"
   />
   <circle
   cx="10"
   cy="10"
   r={radius}
   stroke="currentColor"
   stroke-width="2"
   fill="none"
   class={clsx('transition-all duration-500', `text-${color}-500`)}
   stroke-dasharray={circumference}
   stroke-dashoffset={indeterminate ? circumference * 0.75 : circumference - (percentage / 100) * circumference}
   stroke-linecap="round"
   class:animate-spin={indeterminate}
   />
  </svg>
  {:else if size === 'sm'}
  {@const radius = 12}
  {@const circumference = 2 * Math.PI * radius}
  <svg class="w-8 h-8 transform -rotate-90">
   <circle
   cx="16"
   cy="16"
   r={radius}
   stroke="currentColor"
   stroke-width="2"
   fill="none"
   class="text-white/10"
   />
   <circle
   cx="16"
   cy="16"
   r={radius}
   stroke="currentColor"
   stroke-width="2"
   fill="none"
   class={clsx('transition-all duration-500', `text-${color}-500`)}
   stroke-dasharray={circumference}
   stroke-dashoffset={indeterminate ? circumference * 0.75 : circumference - (percentage / 100) * circumference}
   stroke-linecap="round"
   class:animate-spin={indeterminate}
   />
  </svg>
  {:else}
  {@const radius = 20}
  {@const circumference = 2 * Math.PI * radius}
  <svg class="w-12 h-12 transform -rotate-90">
   <circle
   cx="24"
   cy="24"
   r={radius}
   stroke="currentColor"
   stroke-width="3"
   fill="none"
   class="text-white/10"
   />
   <circle
   cx="24"
   cy="24"
   r={radius}
   stroke="currentColor"
   stroke-width="3"
   fill="none"
   class={clsx('transition-all duration-500', `text-${color}-500`)}
   stroke-dasharray={circumference}
   stroke-dashoffset={indeterminate ? circumference * 0.75 : circumference - (percentage / 100) * circumference}
   stroke-linecap="round"
   class:animate-spin={indeterminate}
   />
  </svg>
  {/if}
  
  {#if showLabel && !indeterminate}
  <span class={clsx('absolute', sizeClasses[size].text, 'text-white/70')}>
   {percentage.toFixed(0)}%
  </span>
  {/if}
 </div>
 
 {:else if variant === 'dots'}
 <!-- Loading Dots -->
 <div class="flex gap-1.5">
  {#each [0, 1, 2] as i}
  <div 
   class={clsx(
   'rounded-full',
   colorClasses[color],
   size === 'xs' && 'w-1.5 h-1.5',
   size === 'sm' && 'w-2 h-2',
   size === 'md' && 'w-2.5 h-2.5',
   size === 'lg' && 'w-3 h-3',
   size === 'xl' && 'w-4 h-4',
   'animate-bounce'
   )}
   style="animation-delay: {i * 150}ms"
  ></div>
  {/each}
 </div>
 
 {:else if variant === 'skeleton'}
 <!-- Skeleton Loading -->
 <div 
  class={clsx(
  'rounded-lg bg-gradient-to-r from-white/5 via-white/10 to-white/5',
  'animate-skeleton',
  size === 'xs' && 'h-4',
  size === 'sm' && 'h-6',
  size === 'md' && 'h-8',
  size === 'lg' && 'h-12',
  size === 'xl' && 'h-16',
  className
  )}
 ></div>
 {/if}
</div>

<style>
 @keyframes indeterminate {
 0% {
  transform: translateX(-100%);
 }
 100% {
  transform: translateX(400%);
 }
 }
 
 @keyframes shimmer {
 0% {
  transform: translateX(-100%);
 }
 100% {
  transform: translateX(100%);
 }
 }
 
 @keyframes skeleton {
 0% {
  background-position: -200% 0;
 }
 100% {
  background-position: 200% 0;
 }
 }
 
 .animate-indeterminate {
 animation: indeterminate 1.5s linear infinite;
 width: 30%;
 }
 
 .animate-shimmer {
 animation: shimmer 2s linear infinite;
 }
 
 .animate-skeleton {
 background-size: 200% 100%;
 animation: skeleton 2s ease-in-out infinite;
 }
</style>