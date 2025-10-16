<script lang="ts">
 import { type Snippet } from 'svelte';
 import clsx from 'clsx';

 interface CardProps {
  children: Snippet;
  title?: string;
  description?: string;
  variant?: 'default' | 'glass' | 'gradient' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  hoverable?: boolean;
  clickable?: boolean;
  class?: string;
  onclick?: () => void;
  ariaLabel?: string;
  ariaDescribedby?: string;
  role?: string;
 }

 const {
  children,
  title = '',
  description = '',
  variant = 'default',
  padding = 'md',
  hoverable = false,
  clickable = false,
  class: className = '',
  onclick,
  ariaLabel = '',
  ariaDescribedby = '',
  role = ''
 }: CardProps = $props();

 const cardClasses = clsx(
  'rounded-2xl transition-all duration-300',
  variant === 'default' && 'border border-white/5',
  variant === 'glass' && 'glass-card',
  variant === 'gradient' && 'bg-gradient-to-br from-main-dark to-main-darker border border-white/5',
  variant === 'outlined' && 'border-2 border-white/10 bg-transparent',
  hoverable && 'hover:shadow-xl hover:scale-[1.02] hover:border-white/10',
  clickable &&
   'cursor-pointer active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 focus:ring-offset-main-dark',
  className
 );

 const handleClick = () => {
  if (clickable && onclick) {
   onclick();
  }
 };

 const cardId = $derived(title ? `card-${title.toLowerCase().replace(/\s+/g, '-')}` : undefined);
 const descriptionId = $derived(description && cardId ? `${cardId}-description` : undefined);
</script>

{#if clickable}
 <button
  class={cardClasses}
  id={cardId}
  onclick={handleClick}
  type="button"
  aria-label={ariaLabel || (title ? `${title} card` : undefined)}
  aria-describedby={ariaDescribedby || descriptionId || undefined}
 >
  {#if title || description}
   <div class="mb-4">
    {#if title}
     <h3 class="text-xl font-semibold text-main-text mb-1" id="{cardId}-title">
      {title}
     </h3>
    {/if}
    {#if description}
     <p id={descriptionId} class="text-sm text-muted-text">
      {description}
     </p>
    {/if}
    {#if title || description}
     <div
      class="mt-3 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
      role="separator"
      aria-hidden="true"
     ></div>
    {/if}
   </div>
  {/if}

  <div
   class="animate-fade-in p-4"
   style="border-radius: 10px; background: rgba(255, 255, 255, 0.02);"
  >
   {@render children()}
  </div>
 </button>
{:else}
 <div
  class={cardClasses}
  id={cardId}
  role={role || undefined}
  aria-label={ariaLabel || undefined}
  aria-describedby={ariaDescribedby || descriptionId || undefined}
 >
  {#if title || description}
   <div class="mb-4">
    {#if title}
     <h3 class="text-xl font-semibold text-main-text mb-1" id="{cardId}-title">
      {title}
     </h3>
    {/if}
    {#if description}
     <p id={descriptionId} class="text-sm text-muted-text">
      {description}
     </p>
    {/if}
    {#if title || description}
     <div
      class="mt-3 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
      role="separator"
      aria-hidden="true"
     ></div>
    {/if}
   </div>
  {/if}

  <div
   class="animate-fade-in p-4"
   style="border-radius: 10px; background: rgba(255, 255, 255, 0.02);"
  >
   {@render children()}
  </div>
 </div>
{/if}
