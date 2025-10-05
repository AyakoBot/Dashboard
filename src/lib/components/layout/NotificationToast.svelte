<script module lang="ts">
 export { addNotification } from '$lib/stores/notifications.svelte.js';
</script>

<script lang="ts">
 import { fade, fly } from 'svelte/transition';
 import { flip } from 'svelte/animate';
 import clsx from 'clsx';
 import { notificationStore, removeNotification, type NotificationType } from '$lib/stores/notifications.svelte.js';
 
 const notifications = $derived(notificationStore.notifications);

 // Get icon for notification type
 const getIcon = (type: NotificationType): string => {
 switch (type) {
  case 'success':
  return 'i-tabler-circle-check';
  case 'error':
  return 'i-tabler-alert-circle';
  case 'warning':
  return 'i-tabler-alert-triangle';
  case 'info':
  return 'i-tabler-info-circle';
 }
 };

 // Get color classes for notification type
 const getColorClasses = (type: NotificationType): string => {
 switch (type) {
  case 'success':
  return 'bg-success/20 border-success/30 text-success';
  case 'error':
  return 'bg-danger/20 border-danger/30 text-danger';
  case 'warning':
  return 'bg-warning/20 border-warning/30 text-warning';
  case 'info':
  return 'bg-info/20 border-info/30 text-info';
 }
 };
</script>

<!-- Notification Container -->
<div 
 class="fixed bottom-4 right-4 z-50 space-y-2 pointer-events-none max-w-md"
 role="region"
 aria-label="Notifications"
 aria-live="polite"
 aria-relevant="additions text"
>
 {#each notifications as notification (notification.id)}
 <div
  class={clsx(
  'p-4 rounded-xl backdrop-blur-xl border',
  'shadow-2xl pointer-events-auto',
  'animate-slide-in',
  getColorClasses(notification.type)
  )}
  role="alert"
  aria-live={notification.type === 'error' ? 'assertive' : 'polite'}
  transition:fly={{ x: 100, duration: 200 }}
  animate:flip={{ duration: 200 }}
 >
  <div class="flex items-start gap-3">
  <!-- Icon -->
  <span class={clsx(getIcon(notification.type), 'text-xl mt-0.5')} aria-hidden="true"></span>

  <!-- Content -->
  <div class="flex-1 min-w-0">
   <h4 class="font-semibold text-white" id="notification-{notification.id}-title">{notification.title}</h4>
   {#if notification.message}
   <p class="text-sm text-white/70 mt-1" id="notification-{notification.id}-message">{notification.message}</p>
   {/if}

   {#if notification.action}
   <button
    onclick={notification.action.onClick}
    class={clsx(
    'mt-2 text-sm font-medium',
    'hover:underline transition-all',
    'focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-transparent rounded px-1'
    )}
    aria-describedby="notification-{notification.id}-title notification-{notification.id}-message"
   >
    {notification.action.label}
   </button>
   {/if}
  </div>

  <!-- Close Button -->
  <button
   onclick={() => removeNotification(notification.id)}
   class={clsx(
   'text-white/50 hover:text-white transition-colors',
   'p-1 rounded',
   'focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-transparent'
   )}
   aria-label="Dismiss notification: {notification.title}"
  >
   <span class="i-tabler-x text-lg" aria-hidden="true"></span>
  </button>
  </div>

  <!-- Progress Bar -->
  {#if notification.duration}
  <div 
   class="mt-3 h-0.5 bg-white/10 rounded-full overflow-hidden"
   role="progressbar"
   aria-label="Notification auto-dismiss timer"
   aria-valuemin="0"
   aria-valuemax="100"
   aria-hidden="true"
  >
   <div
   class="h-full bg-white/30 animate-shrink"
   style="animation-duration: {notification.duration}ms;"
   ></div>
  </div>
  {/if}
 </div>
 {/each}
</div>

<style>
 @keyframes slide-in {
 from {
  transform: translateX(100%);
  opacity: 0;
 }
 to {
  transform: translateX(0);
  opacity: 1;
 }
 }

 @keyframes shrink {
 from {
  width: 100%;
 }
 to {
  width: 0%;
 }
 }

 .animate-slide-in {
 animation: slide-in 0.3s ease-out;
 }

 .animate-shrink {
 animation: shrink linear forwards;
 }
</style>
