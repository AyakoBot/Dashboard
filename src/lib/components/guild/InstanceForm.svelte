<script lang="ts">
 import type { SettingInstance, SettingField } from '$lib/types/settings.js';
 import { validateInstance } from '$lib/utils/instanceHelpers.js';
 import FieldRenderer from './FieldRenderer.svelte';

 interface Props {
  instance: SettingInstance;
  fields: SettingField[];
  onSave: () => void;
  onCancel: () => void;
  isSaving: boolean;
  guildId: string;
 }

 const { instance, fields, onSave, onCancel, isSaving, guildId }: Props = $props();

 const handleFieldChange = (fieldName: string, value: any) => {
  instance.values[fieldName] = value;
 };

 const handleSubmit = (e: Event) => {
  e.preventDefault();

  const errors = validateInstance(instance, fields);
  if (Object.keys(errors).length > 0) {
   instance.errors = errors;
   return;
  }

  onSave();
 };
</script>

<form class="border-2 border-primary rounded-lg p-4 bg-white/5 space-y-4" onsubmit={handleSubmit}>
 <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
  {#each fields as field}
   {@const fieldValue = instance.values[field.name]}
   <div class="col-span-1">
    <FieldRenderer
     {field}
     value={fieldValue}
     onchange={(newValue) => handleFieldChange(field.name, newValue)}
     {guildId}
    />
    {#if instance.errors?.[field.name]}
     <p class="text-red-400 text-xs mt-1" role="alert">
      {instance.errors[field.name]}
     </p>
    {/if}
   </div>
  {/each}
 </div>

 <div class="flex gap-2 justify-end pt-2 border-t border-white/10">
  <button
   type="button"
   onclick={onCancel}
   disabled={isSaving}
   class="px-4 py-2 bg-white/10 text-white rounded-md text-sm hover:bg-white/20 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
  >
   Cancel
  </button>
  <button
   type="submit"
   disabled={isSaving}
   class="px-4 py-2 bg-primary text-white rounded-md text-sm hover:bg-primary/80 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-primary/25"
  >
   {isSaving ? 'Saving...' : 'Save Instance'}
  </button>
 </div>
</form>
