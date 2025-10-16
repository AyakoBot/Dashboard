<script lang="ts">
 import type { GETBotSettings, GETGuildSetting } from '$lib/scripts/index.js';
 import type { SettingInstance, SettingValue } from '$lib/types/settings.js';
 import { createEmptyInstance } from '$lib/utils/instanceHelpers.js';
 import makeRequest from '$lib/scripts/util/makeRequest.js';
 import { onMount } from 'svelte';
 import InstanceCard from './InstanceCard.svelte';
 import InstanceForm from './InstanceForm.svelte';

 interface Props {
  setting: GETBotSettings[0];
  guildId: string;
 }

 const { setting, guildId }: Props = $props();

 let instances = $state<SettingInstance[]>([]);
 let isAddingNew = $state(false);
 let editingId = $state<string | null>(null);
 let deletingId = $state<string | null>(null);
 let deleteUndoData = $state<{ instance: SettingInstance; index: number } | null>(null);
 let deleteUndoTimer = $state<number | null>(null);
 let isSaving = $state(false);
 let loading = $state(true);
 let error = $state<string | null>(null);
 let toastMessage = $state('');
 let showToast = $state(false);

 const hasInstances = $derived(instances.length > 0);
 const editingInstance = $derived(instances.find((i) => i.id === editingId) ?? null);

 onMount(async () => {
  const result = await makeRequest(
   { method: 'GET', path: '/guilds/:guildId/settings/:setting' },
   { guildId, setting: setting.id },
   fetch
  );

  if (result && Array.isArray(result)) {
   instances = result.map((item) => ({
    id: String(item.id),
    values: setting.fields.reduce(
     (acc, field) => {
      const fieldKey = field.id || field.name;
      const value = (item as Record<string, SettingValue>)[fieldKey];
      acc[field.name] = value ?? null;
      return acc;
     },
     {} as Record<string, SettingValue>
    ),
    isNew: false,
    isEditing: false
   }));
  } else if (!result) {
   error = 'Failed to load instances';
  }

  loading = false;
 });

 const displayToast = (message: string) => {
  toastMessage = message;
  showToast = true;
  setTimeout(() => {
   showToast = false;
  }, 3000);
 };

 const handleAddNew = () => {
  const newInstance = createEmptyInstance(setting.fields);
  instances = [...instances, newInstance];
  editingId = newInstance.id;
  isAddingNew = true;
 };

 const handleEdit = (id: string) => {
  editingId = id;
  const instance = instances.find((i) => i.id === id);
  if (instance) instance.isEditing = true;
 };

 const handleCancelEdit = (id: string) => {
  const instance = instances.find((i) => i.id === id);
  if (!instance) return;

  if (instance.isNew) {
   instances = instances.filter((i) => i.id !== id);
   isAddingNew = false;
  } else {
   instance.isEditing = false;
   delete instance.errors;
  }

  editingId = null;
 };

 const handleSaveInstance = async (id: string) => {
  const instance = instances.find((i) => i.id === id);
  if (!instance) return;

  isSaving = true;

  // TODO: Replace with actual API call
  console.log('Saving instance:', { guildId, settingId: setting.id, instance });

  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500));

  instance.isEditing = false;
  instance.isNew = false;
  delete instance.errors;
  editingId = null;
  isAddingNew = false;
  isSaving = false;

  displayToast('Instance saved successfully');
 };

 const handleDeleteRequest = (id: string) => {
  deletingId = id;
 };

 const handleConfirmDelete = (id: string) => {
  const index = instances.findIndex((i) => i.id === id);
  if (index === -1) return;

  const deletedInstance = instances[index];
  deleteUndoData = { instance: deletedInstance, index };
  instances = instances.filter((i) => i.id !== id);
  deletingId = null;

  displayToast('Instance deleted. Click undo to restore.');

  deleteUndoTimer = window.setTimeout(() => {
   deleteUndoData = null;
   deleteUndoTimer = null;
  }, 5000);
 };

 const handleCancelDelete = () => {
  deletingId = null;
 };

 const handleUndoDelete = () => {
  if (!deleteUndoData) return;

  if (deleteUndoTimer) {
   clearTimeout(deleteUndoTimer);
   deleteUndoTimer = null;
  }

  const { instance, index } = deleteUndoData;
  instances = [...instances.slice(0, index), instance, ...instances.slice(index)];
  deleteUndoData = null;

  displayToast('Instance restored');
 };
</script>

<div class="space-y-6">
 <div class="flex items-center justify-between">
  <div>
   <h2 class="text-lg font-semibold text-white">
    {setting.name} Instances
   </h2>
   <p class="text-sm text-white/70 mt-1">Manage multiple instances of this setting</p>
  </div>
  {#if hasInstances && !isAddingNew && !loading}
   <button
    onclick={handleAddNew}
    class="px-4 py-2 bg-primary text-white rounded-md text-sm hover:bg-primary/80 transition-colors duration-200 shadow-lg hover:shadow-primary/25"
   >
    + Add Instance
   </button>
  {/if}
 </div>

 {#if loading}
  <div class="flex items-center justify-center py-12">
   <div class="text-white/70">Loading instances...</div>
  </div>
 {:else if error}
  <div class="text-center py-12 border border-red-500/20 rounded-lg bg-red-500/5">
   <div class="flex justify-center mb-3">
    <span class="i-tabler-alert-triangle inline-block w-12 h-12 text-red-400"></span>
   </div>
   <p class="text-red-400 mb-1">{error}</p>
   <button
    onclick={() => window.location.reload()}
    class="mt-4 px-4 py-2 bg-red-500/20 text-red-400 rounded-md text-sm hover:bg-red-500/30 transition-colors duration-200"
   >
    Retry
   </button>
  </div>
 {:else}
  <div class="space-y-3" role="list" aria-label="Setting instances">
   {#if !hasInstances}
    <div class="text-center py-12 border border-white/10 rounded-lg bg-white/5">
     <div class="flex justify-center mb-3">
      <span class="i-tabler-database-off inline-block w-12 h-12 text-white/20"></span>
     </div>
     <p class="text-white/70 mb-1">No instances configured yet</p>
     <p class="text-white/50 text-sm mb-4">Create your first instance to get started</p>
     <button
      onclick={handleAddNew}
      class="px-4 py-2 bg-primary text-white rounded-md text-sm hover:bg-primary/80 transition-colors duration-200 shadow-lg hover:shadow-primary/25"
     >
      Add First Instance
     </button>
    </div>
   {:else}
    {#each instances as instance (instance.id)}
     {#if instance.isEditing}
      <InstanceForm
       {instance}
       fields={setting.fields}
       onSave={() => handleSaveInstance(instance.id)}
       onCancel={() => handleCancelEdit(instance.id)}
       {isSaving}
       {guildId}
      />
     {:else}
      <InstanceCard
       {instance}
       fields={setting.fields}
       isDeleting={deletingId === instance.id}
       onEdit={() => handleEdit(instance.id)}
       onDeleteRequest={() => handleDeleteRequest(instance.id)}
       onConfirmDelete={() => handleConfirmDelete(instance.id)}
       onCancelDelete={handleCancelDelete}
      />
     {/if}
    {/each}
   {/if}
  </div>
 {/if}

 {#if showToast}
  <div
   class="fixed bottom-6 right-6 bg-main-darker border border-primary rounded-lg shadow-xl p-4 max-w-sm z-50 flex items-center gap-3"
   role="alert"
  >
   <span class="i-tabler-check text-primary text-xl"></span>
   <p class="text-white text-sm flex-1">{toastMessage}</p>
   {#if deleteUndoData}
    <button
     onclick={handleUndoDelete}
     class="px-3 py-1 bg-primary text-white text-xs rounded hover:bg-primary/80 transition-colors duration-200"
    >
     Undo
    </button>
   {/if}
  </div>
 {/if}
</div>
