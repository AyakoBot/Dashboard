<script lang="ts">
 import clsx from 'clsx';

 interface BadgeProps {
  text: string;
  variant?: 'primary' | 'success' | 'danger' | 'warning' | 'info' | 'neutral';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  rounded?: boolean;
  gradient?: boolean;
  icon?: string;
  iconPosition?: 'left' | 'right';
  animated?: boolean;
  class?: string;
 }

 const {
  text,
  variant = 'primary',
  size = 'sm',
  rounded = false,
  gradient = false,
  icon = '',
  iconPosition = 'left',
  animated = false,
  class: className = ''
 }: BadgeProps = $props();

 const sizeConfig = {
  xs: 'px-1.5 py-0.5 text-xs',
  sm: 'px-2 py-1 text-sm',
  md: 'px-3 py-1.5 text-base',
  lg: 'px-4 py-2 text-lg'
 };

 const variantStyles = {
  primary: gradient
   ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white'
   : 'bg-primary-500/20 text-primary-400 border-primary-500/30',
  success: gradient
   ? 'bg-gradient-to-r from-success to-emerald-600 text-white'
   : 'bg-success/20 text-success border-success/30',
  danger: gradient
   ? 'bg-gradient-to-r from-danger to-red-600 text-white'
   : 'bg-danger/20 text-danger border-danger/30',
  warning: gradient
   ? 'bg-gradient-to-r from-warning to-amber-600 text-white'
   : 'bg-warning/20 text-warning border-warning/30',
  info: gradient
   ? 'bg-gradient-to-r from-info to-blue-600 text-white'
   : 'bg-info/20 text-info border-info/30',
  neutral: gradient
   ? 'bg-gradient-to-r from-main-lighter to-main-light text-white'
   : 'bg-main-lighter text-main-text border-white/10'
 };

 const badgeClasses = clsx(
  'flex items-center gap-1',
  'inline-flex items-center gap-1.5 font-medium',
  'border backdrop-blur-sm',
  'transition-all duration-200',
  sizeConfig[size],
  variantStyles[variant],
  rounded ? 'rounded-full' : 'rounded-lg',
  animated && 'animate-pulse',
  className
 );
</script>

<span class={badgeClasses}>
 {#if icon && iconPosition === 'left'}
  <span class={clsx(icon, 'inline-block')}></span>
 {/if}

 <span>{text}</span>

 {#if icon && iconPosition === 'right'}
  <span class={clsx(icon, 'inline-block')}></span>
 {/if}
</span>
