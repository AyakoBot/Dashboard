<script lang="ts">
 import clsx from 'clsx';

 interface SkeletonProps {
 variant?: 'text' | 'circular' | 'rectangular' | 'card';
 width?: string;
 height?: string;
 lines?: number;
 animated?: boolean;
 class?: string;
 }

 const {
 variant = 'text',
 width = '100%',
 height = 'auto',
 lines = 1,
 animated = true,
 class: className,
 }: SkeletonProps = $props();

 const getHeight = () => {
 if (height !== 'auto') return height;
 
 switch (variant) {
  case 'text':
  return '1.2em';
  case 'circular':
  return width;
  case 'rectangular':
  return '200px';
  case 'card':
  return '300px';
  default:
  return '1.2em';
 }
 };

 const baseClasses = clsx(
 'bg-main-lighter',
 animated && 'skeleton',
 variant === 'circular' && 'rounded-full',
 variant === 'rectangular' && 'rounded-lg',
 variant === 'card' && 'rounded-xl',
 variant === 'text' && 'rounded-md',
 className
 );
</script>

{#if variant === 'text' && lines > 1}
 <div class="space-y-2">
 {#each Array(lines) as _, i}
  <div
  class={baseClasses}
  style="width: {i === lines - 1 ? '80%' : width}; height: {getHeight()};"
  ></div>
 {/each}
 </div>
{:else if variant === 'card'}
 <div 
 class={clsx('glass-card p-6 space-y-4', className)}
 style="width: {width}; height: {getHeight()};"
 >
 <div class="flex items-center space-x-4">
  <div class={clsx(baseClasses, 'rounded-full')} style="width: 48px; height: 48px;"></div>
  <div class="flex-1 space-y-2">
  <div class={baseClasses} style="width: 40%; height: 1.2em;"></div>
  <div class={baseClasses} style="width: 60%; height: 1em;"></div>
  </div>
 </div>
 <div class="space-y-2">
  <div class={baseClasses} style="width: 100%; height: 1em;"></div>
  <div class={baseClasses} style="width: 100%; height: 1em;"></div>
  <div class={baseClasses} style="width: 75%; height: 1em;"></div>
 </div>
 <div class={clsx(baseClasses, 'rounded-lg')} style="width: 100%; height: 120px;"></div>
 </div>
{:else}
 <div
 class={baseClasses}
 style="width: {width}; height: {getHeight()};"
 ></div>
{/if}