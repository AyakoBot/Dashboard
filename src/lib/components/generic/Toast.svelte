<script lang="ts">
 import clsx from 'clsx';

 interface Props {
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  onClose: () => void;
  duration?: number;
 }

 const { message, type = 'info', onClose, duration = 5000 }: Props = $props();

 $effect(() => {
  if (duration > 0) {
   const timer = setTimeout(onClose, duration);
   return () => clearTimeout(timer);
  }
 });

 const iconMap = {
  success: 'i-tabler-circle-check',
  error: 'i-tabler-circle-x',
  warning: 'i-tabler-alert-triangle',
  info: 'i-tabler-info-circle'
 };

 const colorMap = {
  success: 'border-success text-success',
  error: 'border-danger text-danger',
  warning: 'border-warning text-warning',
  info: 'border-info text-info'
 };

 const getAriaLabel = () => {
  const labels = {
   success: 'Success notification',
   error: 'Error notification',
   warning: 'Warning notification',
   info: 'Information notification'
  };
  return labels[type];
 };
</script>

<div
 role="status"
 aria-live="polite"
 aria-atomic="true"
 aria-label={getAriaLabel()}
 class={clsx(
  'flex items-center gap-3 p-4 rounded-lg min-w-[300px] max-w-[500px]',
  'bg-main-dark border shadow-lg',
  'animate-slide-right',
  colorMap[type]
 )}
>
 <span class={clsx(iconMap[type], 'text-xl flex-shrink-0')} aria-hidden="true"></span>
 <p class="flex-1 text-main-text m-0">{message}</p>
 <button
  type="button"
  onclick={onClose}
  aria-label="Dismiss notification"
  class={clsx(
   'flex-shrink-0 p-1 rounded transition-colors duration-200',
   'bg-transparent border-none cursor-pointer',
   'text-alt-text hover:text-main-text',
   'focus-visible:outline-2 focus-visible:outline-current focus-visible:outline-offset-2'
  )}
 >
  <span class="i-tabler-x text-base" aria-hidden="true"></span>
 </button>
</div>

<style>
 @keyframes slideRight {
  from {
   transform: translateX(100%);
   opacity: 0;
  }
  to {
   transform: translateX(0);
   opacity: 1;
  }
 }

 .animate-slide-right {
  animation: slideRight 0.3s ease-out;
 }

 @media (prefers-reduced-motion: reduce) {
  .animate-slide-right {
   animation: none;
   opacity: 1;
   transform: translateX(0);
  }
 }
</style>
