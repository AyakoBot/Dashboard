<script lang="ts">
 import clsx from 'clsx';
 import { onMount } from 'svelte';

 interface InputProps {
  required?: boolean;
  maxLen?: number;
  minLen?: number;
  maxVal?: number;
  minVal?: number;
  type?: 'text' | 'number' | 'email' | 'password' | 'url' | 'tel';
  label: string;
  placeholder?: string;
  id?: string;
  size?: 'short' | 'paragraph';
  variant?: 'default' | 'glass' | 'outlined';
  icon?: string;
  helpText?: string;
  error?: string;
  disabled?: boolean;
  onupdate?: (v: string | number | null) => void;
  class?: string;
  value?: string | number;
  autocomplete?: HTMLInputElement['autocomplete'];
 }

 let {
  required = false,
  maxLen,
  minLen,
  maxVal,
  minVal,
  type = 'text',
  label,
  placeholder = '',
  id = Math.random().toString(36).substring(7),
  size,
  variant = 'default',
  icon = '',
  helpText = '',
  error = '',
  disabled = false,
  onupdate,
  class: className,
  value = $bindable(''),
  autocomplete
 }: InputProps = $props();

 let focused = $state(false);
 let touched = $state(false);
 let inputElement = $state<HTMLInputElement>();
 let textareaElement = $state<HTMLTextAreaElement>();
 let queued = false;

 const update = () => {
  if (queued) return;
  queued = true;
  touched = true;

  setTimeout(() => {
   queued = false;
   onupdate?.(value);
  }, 300);
 };

 const hasValue = $derived(value !== null && value !== undefined && String(value).length > 0);
 const isFloating = $derived(focused || hasValue || placeholder);

 const validationErrors = $derived.by(() => {
  const errors = [];

  if (required && touched && !String(value ?? '').length) {
   errors.push('This field is required');
  }

  if (maxLen && String(value ?? '').length > maxLen) {
   errors.push(`Maximum ${maxLen} characters allowed`);
  }

  if (minLen && touched && String(value ?? '').length < minLen) {
   errors.push(`Minimum ${minLen} characters required`);
  }

  if (type === 'number') {
   const numValue = Number(value);
   if (maxVal !== undefined && numValue > maxVal) {
    errors.push(`Maximum value is ${maxVal}`);
   }
   if (minVal !== undefined && numValue < minVal) {
    errors.push(`Minimum value is ${minVal}`);
   }
  }

  if (error) errors.push(error);

  return errors;
 });

 const hasError = $derived(validationErrors.length > 0);
 const helpTextId = $derived(`${id}-help`);
 const errorId = $derived(`${id}-error`);
 const ariaDescribedby = $derived.by(() => {
  const ids = [];
  if (helpText) ids.push(helpTextId);
  if (hasError) ids.push(errorId);
  return ids.length > 0 ? ids.join(' ') : undefined;
 });

 const containerClasses = $derived(
  clsx(
   'relative group transition-all duration-300',
   variant === 'glass' && 'glass rounded-xl',
   variant === 'outlined' && 'border-2 border-main-lighter rounded-lg',
   variant === 'default' && 'bg-main-dark rounded-lg',
   focused && !hasError && 'ring-2 ring-primary-500/30',
   hasError && 'ring-2 ring-danger/30',
   disabled && 'opacity-50 cursor-not-allowed',
   className
  )
 );

 const inputClasses = clsx(
  'w-full bg-transparent text-main-text placeholder-transparent focus:outline-none transition-all duration-200',
  'focus:ring-2 focus:ring-primary-500/30 focus:ring-offset-2 focus:ring-offset-main-dark',
  icon ? 'pl-10 pr-4' : 'px-4',
  size === 'paragraph' ? 'pt-6 pb-2 min-h-[96px] resize-y' : 'h-14 pt-4',
  disabled && 'cursor-not-allowed'
 );

 const labelClasses = $derived(
  clsx(
   'absolute left-4 text-muted-text transition-all duration-200 pointer-events-none select-none',
   icon && 'left-10',
   isFloating ? 'top-1.5 text-xs' : 'top-4 text-base',
   focused && !hasError && 'text-primary-400',
   hasError && 'text-danger'
  )
 );

 onMount(() => {
  if (inputElement || textareaElement) {
   const element = inputElement || textareaElement;
   if (element && value) {
    touched = false;
   }
  }
 });
</script>

<div class={containerClasses}>
 {#if icon}
  <span
   class={clsx(
    icon,
    'absolute left-3 top-4 text-muted-text transition-colors duration-200',
    focused && !hasError && 'text-primary-400',
    hasError && 'text-danger'
   )}
   aria-hidden="true"
  ></span>
 {/if}

 {#if size === 'paragraph'}
  <textarea
   bind:this={textareaElement}
   name={id}
   {id}
   maxlength={maxLen}
   minlength={minLen}
   {required}
   {disabled}
   {placeholder}
   bind:value
   class={inputClasses}
   aria-required={required ? 'true' : undefined}
   aria-invalid={hasError ? 'true' : undefined}
   aria-describedby={ariaDescribedby}
   aria-label={!label ? placeholder : undefined}
   onfocus={() => (focused = true)}
   onblur={() => {
    focused = false;
    touched = true;
   }}
   oninput={update}
  ></textarea>
 {:else}
  <input
   bind:this={inputElement}
   name={id}
   {id}
   {type}
   maxlength={maxLen}
   minlength={minLen}
   max={maxVal}
   min={minVal}
   {required}
   {disabled}
   {placeholder}
   {autocomplete}
   bind:value
   class={inputClasses}
   aria-required={required ? 'true' : undefined}
   aria-invalid={hasError ? 'true' : undefined}
   aria-describedby={ariaDescribedby}
   aria-label={!label ? placeholder : undefined}
   onfocus={() => (focused = true)}
   onblur={() => {
    focused = false;
    touched = true;
   }}
   oninput={update}
  />
 {/if}

 <label for={id} class={labelClasses}>
  {label}
  {#if required}
   <span class="text-danger ml-0.5" aria-label="required">*</span>
  {/if}
 </label>

 {#if maxLen}
  <div
   class={clsx(
    'absolute right-2 bottom-2 text-xs transition-colors duration-200',
    String(value ?? '').length > maxLen ? 'text-danger' : 'text-muted-text'
   )}
   aria-live="polite"
   aria-atomic="true"
  >
   <span class="sr-only">Character count:</span>
   {String(value ?? '').length}/{maxLen}
  </div>
 {/if}

 <div
  class={clsx(
   'absolute bottom-0 left-0 h-0.5 bg-primary-500 transition-all duration-300',
   focused && !hasError ? 'w-full' : 'w-0'
  )}
  aria-hidden="true"
 ></div>
</div>

{#if helpText && !hasError}
 <p id={helpTextId} class="mt-1.5 text-xs text-muted-text animate-fade-in">
  {helpText}
 </p>
{/if}

{#if hasError}
 <div id={errorId} class="mt-1.5 space-y-1 animate-fade-in" role="alert" aria-live="polite">
  {#each validationErrors as error}
   <p class="text-xs text-danger flex items-center gap-1">
    <span class="i-tabler-alert-circle text-sm" aria-hidden="true"></span>
    {error}
   </p>
  {/each}
 </div>
{/if}
