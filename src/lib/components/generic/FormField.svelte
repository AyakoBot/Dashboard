<script lang="ts">
 import type { Snippet } from 'svelte';

 interface Props {
  label: string;
  id: string;
  error?: string;
  required?: boolean;
  description?: string;
  children?: Snippet;
 }

 const { label, id, error, required, description, children }: Props = $props();

 const errorId = `${id}-error`;
 const descId = `${id}-description`;
</script>

<div class="w-full mb-4">
 <label for={id} class="block text-main-text mb-2 font-medium cursor-pointer">
  {label}
  {#if required}
   <span class="text-danger ml-1" aria-label="required">*</span>
  {/if}
 </label>

 {#if description}
  <p id={descId} class="text-sm text-alt-text mb-2">
   {description}
  </p>
 {/if}

 <div
  aria-describedby={[description && descId, error && errorId].filter(Boolean).join(' ') ||
   undefined}
  aria-invalid={!!error}
 >
  {@render children?.()}
 </div>

 {#if error}
  <p id={errorId} role="alert" class="text-danger text-sm mt-1 flex items-center gap-1">
   <span class="i-tabler-alert-circle text-base" aria-hidden="true"></span>
   <span>{error}</span>
  </p>
 {/if}
</div>

<style>
 /* Apply error border to form controls when parent has aria-invalid */
 [aria-invalid='true'] :global(input),
 [aria-invalid='true'] :global(select),
 [aria-invalid='true'] :global(textarea) {
  border-color: #ef4444;
 }
</style>
