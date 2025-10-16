<script lang="ts">
 import { type Snippet } from 'svelte';
 import clsx from 'clsx';

 type EventVar = MouseEvent & {
  currentTarget: EventTarget & HTMLButtonElement;
 };

 type Variant =
  | 'primary'
  | 'secondary'
  | 'danger'
  | 'success'
  | 'warning'
  | 'info'
  | 'ghost'
  | 'glass'
  | 'link';

 type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
 type Width = 'fit' | 'full';

 interface ButtonProps {
  variant?: Variant;
  size?: Size;
  width?: Width;
  outlined?: boolean;
  loading?: boolean;
  disabled?: boolean;
  iconLeft?: string;
  iconRight?: string;
  ripple?: boolean;
  glow?: boolean;
  gradient?: boolean;
  onclick?: (e: EventVar) => void;
  children?: Snippet;
  ariaLabel?: string;
  ariaPressed?: boolean;
  ariaExpanded?: boolean;
  ariaControls?: string;
  ariaDescribedby?: string;
  type?: 'button' | 'submit' | 'reset';
 }

 const {
  variant = 'primary',
  size = 'md',
  width = 'fit',
  outlined = false,
  loading = false,
  disabled = false,
  iconLeft = '',
  iconRight = '',
  ripple = true,
  glow = false,
  gradient = true,
  onclick,
  children,
  ariaLabel = '',
  ariaPressed = undefined,
  ariaExpanded = undefined,
  ariaControls = '',
  ariaDescribedby = '',
  type = 'button'
 }: ButtonProps = $props();

 let buttonElement = $state<HTMLButtonElement>();
 let isRippling = $state(false);
 let rippleX = $state(0);
 let rippleY = $state(0);

 const handleRipple = (e: MouseEvent) => {
  if (!ripple || disabled || loading) return;

  const rect = buttonElement?.getBoundingClientRect();
  if (!rect) return;

  rippleX = e.clientX - rect.left;
  rippleY = e.clientY - rect.top;
  isRippling = true;

  setTimeout(() => {
   isRippling = false;
  }, 600);
 };

 const sizeClasses = {
  xs: 'px-3 py-2 text-xs min-h-[44px] min-w-[44px]',
  sm: 'px-4 py-2 text-sm min-h-[44px] min-w-[44px]',
  md: 'px-4 py-2 text-base min-h-[44px]',
  lg: 'px-5 py-2.5 text-lg min-h-[48px]',
  xl: 'px-6 py-3 text-xl min-h-[56px]'
 };

 const getVariantClasses = () => {
  const base =
   'relative font-medium transition-all duration-200 transform focus:outline-none focus:ring-2 focus:ring-offset-2';
  const hover = !disabled && !loading ? 'hover:scale-105 active:scale-95' : '';
  const disabled_state = disabled || loading ? 'opacity-50 cursor-not-allowed' : '';

  if (variant === 'link') {
   return clsx(
    'text-primary-400 hover:text-primary-300 underline-offset-4 focus:ring-primary-400',
    !disabled && !loading && 'hover:underline',
    disabled_state
   );
  }

  const variantStyles = {
   primary: outlined
    ? 'border-2 border-primary-500 text-primary-400 hover:bg-primary-500 hover:text-white focus:ring-primary-400'
    : gradient
      ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg hover:shadow-primary-500/25 hover:shadow-xl focus:ring-primary-400'
      : 'bg-primary-500 text-white hover:bg-primary-600 shadow-lg focus:ring-primary-400',

   secondary: outlined
    ? 'border-2 border-main-lighter text-main-text hover:bg-main-lighter focus:ring-main-lighter'
    : 'bg-main-lighter text-main-text hover:bg-main-light border-1 border-white/10 focus:ring-main-lighter',

   danger: outlined
    ? 'border-2 border-danger text-danger hover:bg-danger hover:text-white focus:ring-danger'
    : gradient
      ? 'bg-gradient-to-r from-danger to-red-600 text-white shadow-lg hover:shadow-danger/25 focus:ring-danger'
      : 'bg-danger text-white hover:bg-danger-hover shadow-lg focus:ring-danger',

   success: outlined
    ? 'border-2 border-success text-success hover:bg-success hover:text-white focus:ring-success'
    : gradient
      ? 'bg-gradient-to-r from-success to-emerald-600 text-white shadow-lg hover:shadow-success/25 focus:ring-success'
      : 'bg-success text-white hover:bg-success-hover shadow-lg focus:ring-success',

   warning: outlined
    ? 'border-2 border-warning text-warning hover:bg-warning hover:text-white focus:ring-warning'
    : gradient
      ? 'bg-gradient-to-r from-warning to-amber-600 text-white shadow-lg hover:shadow-warning/25 focus:ring-warning'
      : 'bg-warning text-white hover:bg-warning-hover shadow-lg focus:ring-warning',

   info: outlined
    ? 'border-2 border-info text-info hover:bg-info hover:text-white focus:ring-info'
    : gradient
      ? 'bg-gradient-to-r from-info to-blue-600 text-white shadow-lg hover:shadow-info/25 focus:ring-info'
      : 'bg-info text-white hover:bg-info-hover shadow-lg focus:ring-info',

   ghost: 'hover:bg-white/10 text-main-text focus:ring-white/20',

   glass: outlined
    ? 'glass border-2 border-white/20 text-main-text hover:bg-white/10 focus:ring-white/30'
    : 'glass text-main-text hover:bg-white/10 focus:ring-white/30'
  };

  return clsx(
   base,
   'rounded-lg',
   variantStyles[variant as keyof typeof variantStyles],
   hover,
   disabled_state
  );
 };

 const buttonClasses = $derived(
  clsx(
   getVariantClasses(),
   sizeClasses[size],
   width === 'full' && 'w-full',
   glow && !disabled && !loading && 'shadow-glow',
   'overflow-hidden'
  )
 );
</script>

<button
 bind:this={buttonElement}
 class={buttonClasses}
 {disabled}
 {type}
 aria-label={ariaLabel || undefined}
 aria-pressed={ariaPressed !== undefined ? (ariaPressed ? 'true' : 'false') : undefined}
 aria-expanded={ariaExpanded !== undefined ? (ariaExpanded ? 'true' : 'false') : undefined}
 aria-controls={ariaControls || undefined}
 aria-describedby={ariaDescribedby || undefined}
 aria-busy={loading ? 'true' : undefined}
 onclick={(e) => {
  handleRipple(e);
  if (onclick && !disabled && !loading) onclick(e as EventVar);
 }}
>
 {#if loading}
  <span class="absolute inset-0 flex items-center justify-center" aria-hidden="true">
   <span class="i-tabler-loader-2 animate-spin text-current"></span>
  </span>
  <span class="invisible" aria-hidden="true">
   {#if children}
    {@render children()}
   {/if}
  </span>
 {:else}
  <span class="flex items-center justify-center gap-2">
   {#if iconLeft}
    <span class={clsx(iconLeft, 'block')} aria-hidden="true"></span>
   {/if}

   {#if children}
    {@render children()}
   {/if}

   {#if iconRight}
    <span class={clsx(iconRight, 'block')} aria-hidden="true"></span>
   {/if}
  </span>
 {/if}

 {#if isRippling && ripple}
  <span
   class="absolute rounded-full bg-white/30 animate-ripple pointer-events-none"
   style="left: {rippleX}px; top: {rippleY}px;"
   aria-hidden="true"
  ></span>
 {/if}
</button>

<style>
 @keyframes ripple {
  from {
   width: 0;
   height: 0;
   opacity: 0.5;
   transform: translate(-50%, -50%);
  }
  to {
   width: 500px;
   height: 500px;
   opacity: 0;
   transform: translate(-50%, -50%);
  }
 }

 .animate-ripple {
  animation: ripple 0.6s ease-out;
 }
</style>
