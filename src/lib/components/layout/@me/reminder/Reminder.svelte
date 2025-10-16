<script lang="ts">
 import Timestamp from '$lib/components/generic/Timestamp.svelte';
 import makeRequest from '$lib/scripts/util/makeRequest';
 import type { GETResponse } from '@ayako/server/src/routes/v1/@me/reminders/+server';

 const { reminder, ondelete }: { reminder: GETResponse[number]; ondelete: (id: number) => void } =
  $props();

 const del = () => {
  ondelete(reminder.id);

  makeRequest(
   { method: 'DELETE', path: '/@me/reminders/:reminderId' },
   { reminderId: String(reminder.id) },
   fetch
  );
 };
</script>

<div class="bg-main-dark b-1px b-solid b-main-darkest rounded-md p-2 mb-2">
 <div class="flex flex-row items-center gap-2 justify-between">
  <div class="flex flex-row gap-1 items-center">
   <div
    class="transition-all duration-100 ease-in-out group relative btn-extra-danger-outlined min-w-0 p-0"
   >
    <i
     class="i-tabler-x block"
     onclick={del}
     onkeydown={(e) => e.key === 'Enter' && del()}
     tabindex="0"
     role="button"
     aria-label="Delete"
    ></i>
    <span class="tooltiptext">Delete</span>
   </div>
   <span>{reminder.reason}</span>
  </div>

  <div class="flex flex-row gap-1">
   <Timestamp time={reminder.endTime} type="R" />
   (<Timestamp time={reminder.endTime} type="f" />)
  </div>
 </div>
</div>
