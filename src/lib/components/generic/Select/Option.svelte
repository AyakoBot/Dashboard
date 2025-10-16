<script lang="ts">
 import type { RChannel, RRole, RUser } from '@ayako/bot/src/Typings/Redis';
 import OptionDisplay from './OptionDisplay.svelte';

 const {
  optionClick,
  required,
  opt,
  single,
  selectedOptions,
  i,
  isActive = false
 }: {
  i: number;
  selectedOptions: (string | RUser | RRole | RChannel)[];
  required: boolean;
  opt: string | RUser | RRole | RChannel;
  single: boolean;
  optionClick: (opt: string | RUser | RRole | RChannel) => void;
  isActive?: boolean;
 } = $props();

 let element: HTMLDivElement | null = $state(null);

 const isSelected = $derived.by(() => {
  if (typeof opt === 'string') {
   return selectedOptions.includes(opt);
  }

  const optId = (opt as any).id;
  return selectedOptions.some((s) => typeof s !== 'string' && (s as any).id === optId);
 });

 $effect(() => {
  if (isActive && element) {
   element.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }
 });
</script>

<div
 bind:this={element}
 id={`option-${i}`}
 onclick={() => optionClick(opt)}
 onkeydown={(e) => (e.key === 'Enter' ? optionClick(opt) : undefined)}
 role="option"
 tabindex="-1"
 class="text-left px-2 py-2 hover:bg-main-dark-hover:60 relative min-h-[44px] flex items-center"
 class:bg-main-dark-hover:60={isSelected || isActive}
 class:color-white:50={!required && !i}
 aria-selected={isSelected}
>
 <span>
  <OptionDisplay option={opt} />
 </span>
 {#if !single}
  <div class="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
   {#if isSelected && (!!i || required)}
    <span class="i-tabler-checkbox select-none block"></span>
   {:else if !!i || required}
    <span class="i-tabler-square-dashed select-none block"></span>
   {/if}
  </div>
 {:else if isSelected}
  <div class="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
   <span class="i-tabler-circle-check select-none block"></span>
  </div>
 {/if}
</div>
