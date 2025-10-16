<script lang="ts">
 interface Props {
  onclick?: () => void;
  isOpen?: boolean;
  label?: string;
 }

 const { onclick, isOpen = false, label = 'menu' }: Props = $props();
</script>

<button
 type="button"
 {onclick}
 class="lg:hidden p-2 rounded-lg hover:bg-white/10 focus-visible-ring transition-all duration-200 active:scale-95"
 aria-label={isOpen ? `Close ${label}` : `Open ${label}`}
 aria-expanded={isOpen}
>
 <div class="w-6 h-5 flex flex-col justify-between">
  <span
   class="block h-0.5 w-full bg-main-text transition-all duration-200 {isOpen
    ? 'rotate-45 translate-y-2'
    : ''}"
  ></span>
  <span
   class="block h-0.5 w-full bg-main-text transition-opacity duration-200 {isOpen
    ? 'opacity-0'
    : ''}"
  ></span>
  <span
   class="block h-0.5 w-full bg-main-text transition-all duration-200 {isOpen
    ? '-rotate-45 -translate-y-2'
    : ''}"
  ></span>
 </div>
</button>
