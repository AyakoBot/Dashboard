<script lang="ts">
 import Option from './Option.svelte';
 import type { RChannel, RRole, RUser } from '@ayako/bot/src/Typings/Redis';
 type TOption = RUser | RChannel | RRole | string;

 const {
  expanded,
  options,
  single,
  required,
  selectedOptions,
  optionClick,
  selectSearch
 }: {
  expanded: boolean;
  options: TOption[];
  single: boolean;
  required: boolean;
  selectedOptions: TOption[];
  optionClick: (opt: TOption) => void;
  selectSearch: string;
 } = $props();

 let activeIndex = $state(0);
 let listboxElement: HTMLDivElement | null = $state(null);

 const filter = (o: TOption) => {
  if (typeof o === 'string') return o.toLowerCase().includes(selectSearch);

  return true;
 };

 const filteredOptions = $derived(
  required ? options.filter(filter) : ['Clear selection', ...options.filter(filter)]
 );

 const handleKeyDown = (e: KeyboardEvent) => {
  if (!expanded) return;

  switch (e.key) {
   case 'ArrowDown':
    e.preventDefault();
    activeIndex = Math.min(activeIndex + 1, filteredOptions.length - 1);
    break;
   case 'ArrowUp':
    e.preventDefault();
    activeIndex = Math.max(activeIndex - 1, 0);
    break;
   case 'Home':
    e.preventDefault();
    activeIndex = 0;
    break;
   case 'End':
    e.preventDefault();
    activeIndex = filteredOptions.length - 1;
    break;
   case 'Enter':
   case ' ':
    e.preventDefault();
    if (filteredOptions[activeIndex]) {
     optionClick(filteredOptions[activeIndex]);
    }
    break;
  }
 };

 $effect(() => {
  if (expanded) {
   activeIndex = 0;
   listboxElement?.focus();
  }
 });
</script>

{#if expanded}
 <div
  bind:this={listboxElement}
  role="listbox"
  id={`listbox-${Math.random().toString(36).substring(7)}`}
  class="absolute top-full right-1/2 translate-x-1/2 bg-main-dark:80 backdrop-blur-sm b-1px b-solid b-main-darkest w-full z-100 rounded-md max-h-50 scroll-auto of-x-hidden select-none"
  onkeydown={handleKeyDown}
  tabindex="-1"
  aria-activedescendant={`option-${activeIndex}`}
 >
  {#each filteredOptions as opt, i}
   <Option
    {i}
    {required}
    opt={opt as TOption}
    {single}
    {selectedOptions}
    {optionClick}
    isActive={i === activeIndex}
   />
  {/each}
 </div>
{/if}
