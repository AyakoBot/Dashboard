<script lang="ts">
 import { type Snippet } from 'svelte';
 import { onMount } from 'svelte';
 import clsx from 'clsx';

 interface ModalProps {
 children: Snippet;
 authorImg?: string;
 author?: string;
 title?: string;
 description?: string;
 size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
 variant?: 'default' | 'glass' | 'minimal';
 showClose?: boolean;
 closeOnBackdrop?: boolean;
 animate?: boolean;
 autoFocus?: boolean;
 close: () => void;
 }

 const {
 children,
 authorImg = '',
 author = '',
 title = '',
 description = '',
 size = 'md',
 variant = 'glass',
 showClose = true,
 closeOnBackdrop = true,
 animate = true,
 autoFocus = true,
 close,
 }: ModalProps = $props();

 let isVisible = $state(false);
 let modalElement = $state<HTMLDivElement>();
 let previousFocus = $state<HTMLElement | null>(null);

 const sizeMap = {
 sm: 'max-w-md',
 md: 'max-w-2xl',
 lg: 'max-w-4xl',
 xl: 'max-w-6xl',
 full: 'max-w-[95vw]',
 };

 const handleEscape = (e: KeyboardEvent) => {
 if (e.key === 'Escape') close();
 };

 const handleBackdropClick = () => {
 if (closeOnBackdrop) close();
 };

 onMount(() => {
 // Store current focus
 previousFocus = document.activeElement as HTMLElement;
 
 requestAnimationFrame(() => {
  isVisible = true;
  // Focus modal after animation
  setTimeout(() => {
  if (modalElement && autoFocus) {
   // Find first focusable element
   const focusableElements = modalElement.querySelectorAll(
   'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
   );
   const firstFocusable = focusableElements[0] as HTMLElement;
   if (firstFocusable) {
   firstFocusable.focus();
   } else {
   modalElement.focus();
   }
   
   // Trap focus within modal
   const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement;
   
   const handleTab = (e: KeyboardEvent) => {
   if (e.key !== 'Tab') return;
   
   if (e.shiftKey) {
    if (document.activeElement === firstFocusable) {
    e.preventDefault();
    lastFocusable?.focus();
    }
   } else {
    if (document.activeElement === lastFocusable) {
    e.preventDefault();
    firstFocusable?.focus();
    }
   }
   };
   
   modalElement.addEventListener('keydown', handleTab);
   
   // Clean up on unmount
   return () => {
   modalElement?.removeEventListener('keydown', handleTab);
   };
  }
  }, 100);
 });
 
 document.addEventListener('keydown', handleEscape);
 document.body.style.overflow = 'hidden';
 document.body.setAttribute('aria-hidden', 'true');
 
 return () => {
  document.removeEventListener('keydown', handleEscape);
  document.body.style.overflow = '';
  document.body.removeAttribute('aria-hidden');
  // Restore focus
  if (previousFocus) {
  previousFocus.focus();
  }
 };
 });

 const backdropClasses = $derived(
 clsx(
  'fixed inset-0 z-[9999] flex items-center justify-center p-4',
  'bg-black/60 backdrop-blur-sm',
  animate && 'transition-all duration-300',
  isVisible ? 'opacity-100' : 'opacity-0'
 )
 );

 const modalClasses = $derived(
 clsx(
  'relative w-full max-h-[90vh] overflow-auto rounded-2xl shadow-2xl',
  sizeMap[size],
  variant === 'glass' && 'glass-heavy border-white/10',
  variant === 'default' && 'bg-main-dark border border-white/5',
  variant === 'minimal' && 'bg-main-darker',
  animate && 'transition-all duration-300 ease-out',
  isVisible 
  ? 'opacity-100 scale-100 translate-y-0' 
  : 'opacity-0 scale-95 translate-y-4'
 )
 );
</script>

<div
 class={backdropClasses}
 onclick={handleBackdropClick}
 role="presentation"
 aria-hidden="true"
>
 <div
 bind:this={modalElement}
 class={modalClasses}
 onclick={(e) => e.stopPropagation()}
 onkeydown={(e) => {
  if (e.key !== 'Escape') e.stopPropagation();
 }}
 role="dialog"
 tabindex="-1"
 aria-modal="true"
 aria-labelledby={title || author ? 'modal-title' : undefined}
 aria-describedby={description ? 'modal-description' : undefined}
 aria-live="polite"
 >
 {#if showClose}
  <button
  aria-label="Close modal"
  class={clsx(
   'absolute top-4 right-4 p-2 rounded-lg z-10',
   'text-muted-text hover:text-main-text',
   'hover:bg-white/10 transition-all duration-200',
   'focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2',
   'group'
  )}
  onclick={close}
  type="button"
  >
  <span class="i-tabler-x text-xl block group-hover:rotate-90 transition-transform duration-200" aria-hidden="true"></span>
  </button>
 {/if}

 <div class="p-6 md:p-8">
  {#if author || authorImg || title}
  <div class="mb-6">
   {#if author || authorImg}
   <div class="flex items-center gap-3 mb-4">
    {#if authorImg}
    <div class="relative">
     <img 
     src={authorImg} 
     width="48" 
     height="48" 
     alt={author || 'Author'} 
     class="rounded-full ring-2 ring-white/10"
     />
     <div class="absolute -bottom-1 -right-1 w-3 h-3 bg-success rounded-full ring-2 ring-main-dark" aria-hidden="true"></div>
    </div>
    {/if}
    {#if author}
    <div>
     <div id="modal-title" class="text-lg font-semibold text-main-text">{author}</div>
     {#if description}
     <div id="modal-description" class="text-sm text-muted-text">{description}</div>
     {/if}
    </div>
    {/if}
   </div>
   {/if}
   
   {#if title && !author}
   <h2 
    id="modal-title" 
    class="text-2xl font-bold text-main-text mb-2 gradient-text"
   >
    {title}
   </h2>
   {#if description}
    <p id="modal-description" class="text-muted-text">
    {description}
    </p>
   {/if}
   {/if}
   
   <div class="mt-4 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" role="separator" aria-hidden="true"></div>
  </div>
  {/if}

  <div class="animate-fade-in">
  {@render children()}
  </div>
 </div>
 </div>
</div>

<style>
 div[role="dialog"] {
 scrollbar-width: thin;
 scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
 }
 
 div[role="dialog"]::-webkit-scrollbar {
 width: 6px;
 }
 
 div[role="dialog"]::-webkit-scrollbar-track {
 background: transparent;
 }
 
 div[role="dialog"]::-webkit-scrollbar-thumb {
 background: rgba(255, 255, 255, 0.2);
 border-radius: 3px;
 }
 
 div[role="dialog"]::-webkit-scrollbar-thumb:hover {
 background: rgba(255, 255, 255, 0.3);
 }
</style>