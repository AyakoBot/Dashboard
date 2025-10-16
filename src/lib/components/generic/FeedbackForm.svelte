<script lang="ts">
 import clsx from 'clsx';
 import { scale, fade } from 'svelte/transition';

 interface FeedbackFormProps {
  isOpen?: boolean;
  onClose?: () => void;
  onSubmit?: (feedback: FeedbackData) => void;
 }

 interface FeedbackData {
  type: 'bug' | 'feature' | 'improvement' | 'other';
  rating?: number;
  message: string;
  email?: string;
 }

 const { isOpen = false, onClose, onSubmit }: FeedbackFormProps = $props();

 let feedbackType = $state<FeedbackData['type']>('improvement');
 let rating = $state(0);
 let message = $state('');
 let email = $state('');
 let isSubmitting = $state(false);
 let isMinimized = $state(false);

 const feedbackTypes = [
  { value: 'bug', label: 'Bug Report', icon: 'i-tabler-bug', color: 'danger' },
  { value: 'feature', label: 'Feature Request', icon: 'i-tabler-bulb', color: 'primary' },
  { value: 'improvement', label: 'Improvement', icon: 'i-tabler-trending-up', color: 'success' },
  { value: 'other', label: 'Other', icon: 'i-tabler-message', color: 'info' }
 ];

 const handleSubmit = async () => {
  if (!message.trim()) return;

  isSubmitting = true;

  const feedbackData: FeedbackData = {
   type: feedbackType,
   rating: rating || undefined,
   message: message.trim(),
   email: email.trim() || undefined
  };

  // Simulate submission
  await new Promise((resolve) => setTimeout(resolve, 1000));

  if (onSubmit) onSubmit(feedbackData);

  // Reset form
  feedbackType = 'improvement';
  rating = 0;
  message = '';
  email = '';
  isSubmitting = false;

  if (onClose) onClose();
 };

 const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && onClose) onClose();
 };
</script>

<svelte:window onkeydown={handleKeydown} />

{#if isOpen}
 <!-- Floating Feedback Button/Widget -->
 <div
  class={clsx(
   'fixed bottom-6 right-6 z-50',
   'transition-all duration-300 ease-out',
   isMinimized ? 'w-14 h-14' : 'w-96'
  )}
  transition:scale={{ duration: 300 }}
 >
  {#if isMinimized}
   <!-- Minimized State -->
   <button
    onclick={() => (isMinimized = false)}
    class={clsx(
     'w-14 h-14 rounded-full',
     'bg-primary-500 hover:bg-primary-600',
     'flex items-center justify-center',
     'shadow-xl hover:shadow-2xl',
     'transform transition-all duration-200 hover:scale-110',
     'group'
    )}
   >
    <span class="i-tabler-message-circle text-white text-xl"></span>

    <!-- Pulse animation -->
    <div class="absolute inset-0 rounded-full bg-primary-400 opacity-30 animate-ping"></div>
   </button>
  {:else}
   <!-- Expanded Form -->
   <div
    class={clsx(
     'w-full rounded-2xl',
     'glass backdrop-blur-xl',
     'border border-white/10',
     'shadow-2xl',
     'overflow-hidden'
    )}
    transition:fade={{ duration: 200 }}
   >
    <!-- Header -->
    <div class="px-4 py-3 border-b border-white/10 flex items-center justify-between">
     <h3 class="font-semibold text-white flex items-center gap-2">
      <span class="i-tabler-message-report text-primary-400"></span>
      Send Feedback
     </h3>
     <div class="flex items-center gap-2">
      <button
       onclick={() => (isMinimized = true)}
       class="text-white/50 hover:text-white transition-colors"
       aria-label="Minimize"
      >
       <span class="i-tabler-minus text-lg"></span>
      </button>
      {#if onClose}
       <button
        onclick={onClose}
        class="text-white/50 hover:text-white transition-colors"
        aria-label="Close"
       >
        <span class="i-tabler-x text-lg"></span>
       </button>
      {/if}
     </div>
    </div>

    <!-- Form Content -->
    <form
     onsubmit={(e) => {
      e.preventDefault();
      handleSubmit();
     }}
     class="p-4 space-y-4"
    >
     <!-- Feedback Type -->
     <div>
      <fieldset>
       <legend class="block text-xs font-medium text-white/70 mb-2"> What's this about? </legend>
       <div class="grid grid-cols-2 gap-2">
        {#each feedbackTypes as type}
         <button
          type="button"
          onclick={() => (feedbackType = type.value as FeedbackData['type'])}
          class={clsx(
           'p-2 rounded-lg text-xs font-medium',
           'transition-all duration-200',
           'flex items-center gap-1.5',
           feedbackType === type.value
            ? 'bg-primary-500/20 text-primary-300 border border-primary-400/30'
            : 'bg-white/5 text-white/70 hover:bg-white/10 border border-white/10'
          )}
         >
          <span class={clsx(type.icon, 'text-sm')}></span>
          {type.label}
         </button>
        {/each}
       </div>
      </fieldset>
     </div>

     <!-- Rating -->
     <div>
      <fieldset>
       <legend class="block text-xs font-medium text-white/70 mb-2">
        How would you rate your experience?
       </legend>
       <div class="flex gap-2">
        {#each [1, 2, 3, 4, 5] as star}
         <button
          type="button"
          onclick={() => (rating = star)}
          aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
          class={clsx(
           'text-2xl transition-all duration-200 transform hover:scale-110',
           rating >= star ? 'text-amber-400' : 'text-white/20 hover:text-white/40'
          )}
         >
          <span class={rating >= star ? 'i-tabler-star-filled' : 'i-tabler-star'}></span>
         </button>
        {/each}
       </div>
      </fieldset>
     </div>

     <!-- Message -->
     <div>
      <label for="feedback-message" class="block text-xs font-medium text-white/70 mb-2">
       Tell us more
      </label>
      <textarea
       id="feedback-message"
       bind:value={message}
       required
       rows="3"
       placeholder="Share your thoughts, report an issue, or suggest an improvement..."
       class={clsx(
        'w-full px-3 py-2 rounded-lg text-sm',
        'bg-white/5 border border-white/10',
        'text-white placeholder-white/40',
        'focus:bg-white/10 focus:border-primary-400/50',
        'transition-all duration-200',
        'resize-none'
       )}
      ></textarea>
     </div>

     <!-- Email (optional) -->
     <div>
      <label for="feedback-email" class="block text-xs font-medium text-white/70 mb-2">
       Email (optional)
       <span class="text-white/40 ml-1">for follow-up</span>
      </label>
      <input
       id="feedback-email"
       type="email"
       bind:value={email}
       placeholder="your@email.com"
       class={clsx(
        'w-full px-3 py-2 rounded-lg text-sm',
        'bg-white/5 border border-white/10',
        'text-white placeholder-white/40',
        'focus:bg-white/10 focus:border-primary-400/50',
        'transition-all duration-200'
       )}
      />
     </div>

     <!-- Submit Button -->
     <button
      type="submit"
      disabled={isSubmitting || !message.trim()}
      class={clsx(
       'w-full px-4 py-2.5 rounded-lg font-medium',
       'bg-primary-500 hover:bg-primary-600',
       'text-white shadow-lg',
       'transform transition-all duration-200',
       'hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed',
       'flex items-center justify-center gap-2'
      )}
     >
      {#if isSubmitting}
       <span class="i-tabler-loader-2 animate-spin"></span>
       Sending...
      {:else}
       <span class="i-tabler-send"></span>
       Send Feedback
      {/if}
     </button>
    </form>

    <!-- Footer -->
    <div class="px-4 py-2 bg-white/5 text-center">
     <p class="text-xs text-white/40">Your feedback helps us improve</p>
    </div>
   </div>
  {/if}
 </div>
{/if}

<style>
 @keyframes ping {
  75%,
  100% {
   transform: scale(2);
   opacity: 0;
  }
 }

 .animate-ping {
  animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
 }
</style>
