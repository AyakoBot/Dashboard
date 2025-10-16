<script lang="ts">
 import { type Snippet } from 'svelte';
 import clsx from 'clsx';

 interface ContainerProps {
  children: Snippet;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  centered?: boolean;
  class?: string;
 }

 const {
  children,
  size = 'lg',
  padding = 'md',
  centered = true,
  class: className = ''
 }: ContainerProps = $props();

 const sizeMap = {
  sm: 'max-w-screen-sm',
  md: 'max-w-screen-md',
  lg: 'max-w-screen-lg',
  xl: 'max-w-screen-xl',
  full: 'max-w-full'
 };

 const paddingMap = {
  none: '',
  sm: 'px-4 py-4 sm:px-6 lg:px-8',
  md: 'px-6 py-6 sm:px-8 lg:px-12',
  lg: 'px-8 py-8 sm:px-12 lg:px-16',
  xl: 'px-12 py-12 sm:px-16 lg:px-20'
 };

 const containerClasses = clsx(
  'w-full',
  sizeMap[size],
  paddingMap[padding],
  centered && 'mx-auto',
  className
 );
</script>

<div class={containerClasses}>
 {@render children()}
</div>
