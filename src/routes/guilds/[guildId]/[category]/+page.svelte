<script lang="ts">
 import FieldRenderer from '$lib/components/guild/FieldRenderer.svelte';
 import MultiInstanceSetting from '$lib/components/guild/MultiInstanceSetting.svelte';
 import { renderMarkdown } from '$lib/utils/markdown.js';
 import { slide } from 'svelte/transition';
 import type { PageData } from './$types';

 type FormFieldValue = string | number | boolean | null;
 type FormData = Record<string, FormFieldValue>;

 const { data }: { data: PageData } = $props();

 const currentSetting = $derived(data.setting);
 let formData = $state<FormData>(data.type === 'single' ? { ...data.values } : {});
 let originalFormData = $state<FormData>(data.type === 'single' ? { ...data.values } : {});
 let hasChanges = $state(false);

 const normalizeValue = (value: FormFieldValue): FormFieldValue =>
  value === null || value === undefined || value === '' ? '' : value;

 // Update form data when navigating to a different setting
 $effect(() => {
  if (data.type === 'single') {
   formData = { ...data.values };
   originalFormData = { ...data.values };
   hasChanges = false;
  }
 });

 // Check for changes whenever formData changes
 $effect(() => {
  if (!currentSetting || Object.keys(originalFormData).length === 0) {
   hasChanges = false;
   return;
  }

  const changed = Object.keys(formData).some((key) => {
   const current = normalizeValue(formData[key]);
   const original = normalizeValue(originalFormData[key]);
   return current !== original;
  });

  hasChanges = changed;
 });

 const handleSubmit = async (e: SubmitEvent) => {
  e.preventDefault();
  // TODO: Implement form submission
 };

 const handleReset = () => {
  if (currentSetting) {
   const initialData = currentSetting.fields.reduce((acc, field) => {
    acc[field.name] = '';
    return acc;
   }, {} as FormData);
   formData = { ...initialData };
   originalFormData = { ...initialData };
  }
 };

 const handleCancel = () => {
  formData = { ...originalFormData };
 };
</script>

<main class="p-8 max-w-4xl mx-auto relative">
 <div class="space-y-6">
  <div class="border-b border-white/10 pb-6">
   <h1 id="setting-title" class="text-2xl font-bold text-white mb-2">{currentSetting.name}</h1>
   <p class="text-white/70">{currentSetting.description}</p>
   {#if currentSetting.explainDescription}
    <div class="text-white/50 text-sm mt-2 max-w-none markdown-content">
     {@html renderMarkdown(currentSetting.explainDescription)}
    </div>
   {/if}
  </div>

  {#if data.type === 'multi'}
   <MultiInstanceSetting setting={currentSetting} guildId={data.guildId} />
  {:else}
   <form
    id="settings-form"
    class="space-y-6"
    onsubmit={handleSubmit}
    aria-labelledby="setting-title"
   >
    {#each currentSetting.fields as field}
     <FieldRenderer {field} bind:value={formData[field.name]} guildId={data.guildId} />
    {/each}
   </form>
  {/if}

  <!-- Bottom spacing to prevent popup overlap -->
  <div class="h-20" aria-hidden="true"></div>
 </div>

 {#if hasChanges && data.type === 'single'}
  <div
   class="absolute bottom-6 left-1/2 transform -translate-x-1/2 pointer-events-auto z-50"
   transition:slide={{ duration: 300 }}
   role="status"
   aria-live="polite"
  >
   <div class="bg-main-darker border-2 border-primary rounded-lg shadow-xl p-4 max-w-md">
    <div class="flex items-center justify-between gap-4">
     <div class="text-white/70 text-sm">You have unsaved changes</div>
     <div class="flex gap-2 flex-shrink-0">
      <button
       type="button"
       onclick={handleCancel}
       class="px-3 py-1.5 bg-white/10 text-white text-sm rounded-md hover:bg-white/20 transition-colors duration-200 hover:scale-105 active:scale-95"
       aria-label="Cancel changes and revert to original values"
      >
       Cancel
      </button>
      <button
       type="submit"
       form="settings-form"
       class="px-3 py-1.5 bg-primary text-white text-sm rounded-md hover:bg-primary/80 transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-primary/25"
       aria-label="Save setting changes"
      >
       Save Changes
      </button>
     </div>
    </div>
   </div>
  </div>
 {/if}
</main>

<style>
 :global(.markdown-content ol) {
  list-style-type: decimal;
  margin-left: 1rem;
  padding-left: 0.5rem;
 }

 :global(.markdown-content ul) {
  list-style-type: disc;
  margin-left: 1rem;
  padding-left: 0.5rem;
 }

 :global(.markdown-content li) {
  margin: 0.25rem 0;
 }

 :global(.markdown-content p) {
  margin: 0.5rem 0;
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
</style>
