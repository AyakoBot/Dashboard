<script lang="ts">
 import clsx from 'clsx';
 import { renderMarkdown } from '$lib/utils/markdown.js';

 interface SwitchProps {
  title?: string;
  description?: string;
  name: string;
  checked?: boolean;
  required?: boolean;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  onchange?: (checked: boolean) => void;
 }

 let {
  title,
  description = '',
  name,
  checked = $bindable(false),
  required = false,
  disabled = false,
  size = 'md',
  onchange
 }: SwitchProps = $props();

 const handleToggle = () => {
  if (!disabled) {
   checked = !checked;
   onchange?.(checked);
  }
 };
</script>

<div class="flex items-center gap-3 w-full">
 {#if title || description}
  <div class="flex-1 min-w-0">
   {#if title}
    <label
     for={name}
     class={clsx(
      'block font-medium text-main-text markdown-content',
      disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
     )}
    >
     {@html renderMarkdown(title)}
     {#if required}
      <span class="text-danger ml-1" aria-label="required">*</span>
     {/if}
    </label>
   {/if}
   {#if description}
    <div class="text-sm text-muted-text mt-1 markdown-content">
     {@html renderMarkdown(description)}
    </div>
   {/if}
  </div>
 {/if}

 <!-- Hidden checkbox for form submission -->
 <input
  type="checkbox"
  {name}
  {checked}
  {disabled}
  {required}
  style="position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0;"
  tabindex="-1"
  aria-hidden="true"
 />

 <button
  id={name}
  type="button"
  role="switch"
  aria-checked={checked}
  aria-label={title || 'Toggle switch'}
  {disabled}
  onclick={handleToggle}
  class={clsx(
   'relative inline-flex shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out',
   'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-main-dark',
   disabled && 'opacity-50 cursor-not-allowed',
   checked ? 'bg-primary-500' : 'bg-main-lighter',
   size === 'sm' && 'h-6 w-10',
   size === 'md' && 'h-8 w-13',
   size === 'lg' && 'h-9 w-15'
  )}
 >
  <span class="sr-only">{checked ? 'On' : 'Off'}</span>
  <span
   aria-hidden="true"
   class={clsx(
    'pointer-events-none absolute left-0.5 top-0.5 inline-block transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out',
    checked
     ? size === 'sm'
       ? 'translate-x-4'
       : size === 'md'
         ? 'translate-x-5'
         : 'translate-x-7'
     : 'translate-x-0',
    size === 'sm' && 'h-4 w-4',
    size === 'md' && 'h-6 w-6',
    size === 'lg' && 'h-7 w-7'
   )}
  >
   {#if checked}
    <span class="flex h-full w-full items-center justify-center">
     <svg
      class={clsx(
       'text-primary-500',
       size === 'sm' && 'h-2 w-2',
       size === 'md' && 'h-3 w-3',
       size === 'lg' && 'h-3.5 w-3.5'
      )}
      fill="currentColor"
      viewBox="0 0 20 20"
     >
      <path
       fill-rule="evenodd"
       d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
       clip-rule="evenodd"
      />
     </svg>
    </span>
   {/if}
  </span>
 </button>
</div>

<style>
 /* Ensure smooth transitions and override global min-height */
 button {
  -webkit-tap-highlight-color: transparent;
  min-height: unset !important;
  min-width: unset !important;
 }

 /* Markdown content styling */
 :global(.markdown-content p) {
  display: inline;
  margin: 0;
 }

 :global(.markdown-content strong) {
  font-weight: 600;
 }

 :global(.markdown-content em) {
  font-style: italic;
 }

 :global(.markdown-content code) {
  background: rgba(255, 255, 255, 0.1);
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  font-family: monospace;
  font-size: 0.875em;
 }

 :global(.markdown-content a) {
  color: inherit;
  text-decoration: underline;
 }

 :global(.markdown-content small) {
  font-size: 0.75rem;
  opacity: 0.75;
 }
</style>
