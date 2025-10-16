<script lang="ts">
 import type { SettingInstance, SettingField } from '$lib/types/settings.js';
 import { formatInstanceSummary } from '$lib/utils/instanceHelpers.js';

 interface Props {
  instance: SettingInstance;
  fields: SettingField[];
  isDeleting: boolean;
  onEdit: () => void;
  onDeleteRequest: () => void;
  onConfirmDelete: () => void;
  onCancelDelete: () => void;
 }

 const {
  instance,
  fields,
  isDeleting,
  onEdit,
  onDeleteRequest,
  onConfirmDelete,
  onCancelDelete
 }: Props = $props();

 const summary = $derived(formatInstanceSummary(instance, fields, 3));
</script>

<div
 class="border border-white/10 rounded-lg p-4 transition-all duration-200 hover:bg-white/5"
 role="listitem"
>
 {#if isDeleting}
  <div class="flex items-center justify-between">
   <p class="text-red-400 text-sm">Are you sure? This action cannot be undone.</p>
   <div class="flex gap-2">
    <button
     onclick={onConfirmDelete}
     class="px-3 py-1.5 bg-red-500/20 text-red-400 border border-red-500/50 rounded-md text-sm hover:bg-red-500/30 transition-colors duration-200"
    >
     Delete
    </button>
    <button
     onclick={onCancelDelete}
     class="px-3 py-1.5 bg-white/10 text-white rounded-md text-sm hover:bg-white/20 transition-colors duration-200"
    >
     Cancel
    </button>
   </div>
  </div>
 {:else}
  <div class="flex items-center justify-between gap-4">
   <div class="flex-1 min-w-0">
    <p class="text-sm text-white/90 truncate">{summary}</p>
   </div>
   <div class="flex gap-2 flex-shrink-0">
    <button
     onclick={onEdit}
     aria-label="Edit instance"
     class="px-3 py-1.5 bg-white/10 text-white rounded-md text-sm hover:bg-white/20 transition-colors duration-200"
    >
     Edit
    </button>
    <button
     onclick={onDeleteRequest}
     aria-label="Delete instance"
     class="px-3 py-1.5 bg-white/10 text-white/70 rounded-md text-sm hover:bg-red-500/20 hover:text-red-400 hover:border hover:border-red-500/50 transition-all duration-200"
    >
     Delete
    </button>
   </div>
  </div>
 {/if}
</div>
