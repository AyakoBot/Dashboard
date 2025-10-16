<script lang="ts">
 import clsx from 'clsx';

 interface User {
  id: string;
  username: string;
  avatar: string | null;
 }

 interface Channel {
  id: string;
  name: string;
 }

 interface Role {
  id: string;
  name: string;
  color: number | null;
  colors: { primary_color: number; secondary_color: number | null; tertiary_color: number | null; } | null;
  icon_url: string | null;
  unicode_emoji: string | null;
 }

 type MentionType = 'user' | 'channel' | 'role' | 'mentionable';

 interface Mention {
  type: MentionType;
  data: User | Channel | Role;
 }

 interface Props {
  required?: boolean;
  maxLen?: number;
  minLen?: number;
  label: string;
  placeholder?: string;
  id?: string;
  size?: 'short' | 'paragraph';
  variant?: 'default' | 'glass' | 'outlined';
  helpText?: string;
  error?: string;
  disabled?: boolean;
  onupdate?: (v: string) => void;
  class?: string;
  value?: string;
  mentions?: Mention[];
 }

 let {
  required = false,
  maxLen,
  minLen,
  label,
  placeholder = '',
  id = Math.random().toString(36).substring(7),
  size,
  variant = 'default',
  helpText = '',
  error = '',
  disabled = false,
  onupdate,
  class: className,
  value = $bindable(''),
  mentions = []
 }: Props = $props();

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

 const intToHex = (num: number): string => {
  return '#' + num.toString(16).padStart(6, '0');
 };

 const getRoleBackground = (role: Role): string => {
  if (role.colors) {
   const primary = intToHex(role.colors.primary_color);
   const secondary = role.colors.secondary_color ? intToHex(role.colors.secondary_color) : primary;
   const tertiary = role.colors.tertiary_color ? intToHex(role.colors.tertiary_color) : secondary;
   return `linear-gradient(90deg, ${primary}, ${secondary}, ${tertiary})`;
  }
  if (role.color) return intToHex(role.color);
  return '#5865f2';
 };

 const getUserAvatar = (user: User): string => {
  if (user.avatar) return user.avatar;
  return '/favicon.png';
 };

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
  'px-4',
  size === 'paragraph' ? 'pt-6 pb-2 min-h-[96px] resize-y' : 'h-14 pt-4',
  disabled && 'cursor-not-allowed'
 );

 const labelClasses = $derived(
  clsx(
   'absolute left-4 text-muted-text transition-all duration-200 pointer-events-none select-none',
   isFloating ? 'top-1.5 text-xs' : 'top-4 text-base',
   focused && !hasError && 'text-primary-400',
   hasError && 'text-danger'
  )
 );
</script>

<div class={containerClasses}>
 {#if mentions.length > 0}
  <div class="flex flex-wrap gap-1.5 px-4 pt-3 pb-2">
   {#each mentions as mention, i (i)}
    {#if mention.type === 'user'}
     {@const user = mention.data as User}
     <span
      class="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-primary-500/20 text-primary-300 text-sm font-medium transition-colors hover:bg-primary-500/30"
      role="button"
      tabindex="0"
      aria-label={`User mention: ${user.username}`}
     >
      <img
       src={getUserAvatar(user)}
       alt=""
       class="w-4 h-4 rounded-full"
       aria-hidden="true"
      />
      <span>@{user.username}</span>
     </span>
    {:else if mention.type === 'channel'}
     {@const channel = mention.data as Channel}
     <span
      class="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-primary-500/20 text-primary-300 text-sm font-medium transition-colors hover:bg-primary-500/30"
      role="button"
      tabindex="0"
      aria-label={`Channel mention: ${channel.name}`}
     >
      <span class="i-tabler-hash text-base" aria-hidden="true"></span>
      <span>{channel.name}</span>
     </span>
    {:else if mention.type === 'role'}
     {@const role = mention.data as Role}
     <span
      class="inline-flex items-center gap-1.5 px-2 py-1 rounded text-white text-sm font-medium transition-all hover:scale-105"
      style:background={role.colors ? getRoleBackground(role) : (role.color ? intToHex(role.color) : '#5865f2')}
      role="button"
      tabindex="0"
      aria-label={`Role mention: ${role.name}`}
     >
      {#if role.icon_url}
       <img
        src={role.icon_url}
        alt=""
        class="w-4 h-4 rounded-full"
        aria-hidden="true"
       />
      {:else if role.unicode_emoji}
       <span aria-hidden="true">{role.unicode_emoji}</span>
      {/if}
      <span>@{role.name}</span>
     </span>
    {:else if mention.type === 'mentionable'}
     <span
      class="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-primary-500/20 text-primary-300 text-sm font-medium transition-colors hover:bg-primary-500/30"
      role="button"
      tabindex="0"
      aria-label="Mentionable"
     >
      <span class="i-tabler-at text-base" aria-hidden="true"></span>
      <span>mentionable</span>
     </span>
    {/if}
   {/each}
  </div>
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
   type="text"
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
  {#each validationErrors as error, i (i)}
   <p class="text-xs text-danger flex items-center gap-1">
    <span class="i-tabler-alert-circle text-sm" aria-hidden="true"></span>
    {error}
   </p>
  {/each}
 </div>
{/if}

<style>
 /* Animated gradient for roles with colors property */
 [style*="linear-gradient"] {
  background-size: 200% 100%;
  animation: gradient-shift 3s linear infinite;
 }

 @keyframes gradient-shift {
  0% {
   background-position: 0% 50%;
  }
  100% {
   background-position: 200% 50%;
  }
 }

 @media (prefers-reduced-motion: reduce) {
  [style*="linear-gradient"] {
   animation: none;
  }
 }
</style>
