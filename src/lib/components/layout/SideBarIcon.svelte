<script lang="ts">
 import { page } from '$app/state';
 import clsx from 'clsx';

 interface SideBarIconProps {
  id: string;
  bg?: boolean;
  name: string;
  src?: string;
  size?: number;
  alt?: string;
  variant?: 'home' | 'guild' | 'special';
  onHover: (v: { y: number; name: string }) => void;
  onUnhover: (v: string) => void;
 }

 const {
  src,
  size = 48,
  alt = '',
  bg = false,
  name,
  id,
  variant = 'guild',
  onHover,
  onUnhover
 }: SideBarIconProps = $props();

 let self: HTMLElement | null = null;
 let barContainer: HTMLDivElement | null = $state(null);
 let img: HTMLImageElement | null = $state(null);
 let isHovered = $state(false);
 let oldActive = false;
 let active = $state(false);

 const keyFrames = $derived(
  active
   ? [
      { height: '8px', left: '-12px', opacity: '0.5' },
      { height: '40px', left: '-12px', opacity: '1' }
     ]
   : [
      { height: '40px', left: '-12px', opacity: '1' },
      { height: '8px', left: '-16px', opacity: '0.5' }
     ]
 );

 const hovered = (state: boolean) => {
  if (!self) return;
  isHovered = state;

  if (src?.startsWith('a_') && img && state && id !== 'favicon') {
   img.src = `https://cdn.discordapp.com/icons/${id}/${src}.gif?size=128&ver=${Date.now()}`;
  } else if (!state && img && src && !src.includes('favicon')) {
   img.src = `https://cdn.discordapp.com/icons/${id}/${src}.webp?size=128`;
  }

  if (state) onHover({ y: self.getBoundingClientRect().y, name });
  else onUnhover(name);
 };

 $effect(() => {
  const returnFN = () => {
   if (!barContainer) return;
   if (!oldActive) return;
   if (active) return;

   barContainer.animate(keyFrames, {
    fill: 'forwards',
    duration: 200,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
   });

   oldActive = active;
  };

  active =
   page.params?.guildId === id || (String(page.url?.pathname).startsWith('/@me') && id === '@me');

  if (!barContainer) return returnFN;
  if (!active) return returnFN;

  barContainer.animate(keyFrames, {
   fill: 'forwards',
   duration: 200,
   easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
  });

  oldActive = active;

  return returnFN;
 });

 const containerClasses = $derived(
  clsx('relative group transition-all duration-200', variant === 'home' && 'scale-110')
 );

 const iconClasses = $derived(
  clsx(
   'flex justify-center items-center overflow-hidden',
   'transition-all duration-300 ease-out',
   'relative',
   size === 48 ? 'w-12 h-12' : 'w-15 h-15',
   active ? 'rounded-2xl' : 'rounded-[50%]',
   isHovered && !active && 'rounded-2xl scale-110',
   variant === 'home' && 'ring-2 ring-primary-500/20',
   variant === 'guild' && active && 'ring-2 ring-primary-500/30',
   bg || id === 'favicon' ? 'bg-gradient-to-br from-primary-500 to-primary-700' : '',
   'shadow-lg hover:shadow-xl hover:shadow-primary-500/20'
  )
 );

 const getInitials = (text: string) => {
  return text
   .split(/\s+/g)
   .map((w) => w[0]?.toUpperCase())
   .filter(Boolean)
   .join('')
   .slice(0, variant === 'home' ? 2 : 3);
 };
</script>

<a
 class={containerClasses}
 onmouseover={() => hovered(true)}
 onmouseleave={() => hovered(false)}
 onfocus={() => hovered(true)}
 onblur={() => hovered(false)}
 bind:this={self}
 role="button"
 tabindex="0"
 data-sveltekit-preload-data="hover"
 href={id === '@me' ? '/@me' : `/guilds/${id}`}
>
 <div class={iconClasses}>
  {#if variant === 'home' && bg}
   <!-- Special glow effect for home button -->
   <div class="absolute inset-0 bg-primary-500/20 blur-xl animate-pulse"></div>
  {/if}

  {#if src}
   <img
    src={id !== '@me'
     ? (src && `https://cdn.discordapp.com/icons/${id}/${src}.webp?size=128`) || ''
     : '/favicon.webp'}
    width={size}
    height={size}
    {alt}
    loading="lazy"
    bind:this={img}
    class={clsx(
     'relative z-10 object-cover',
     isHovered && 'scale-110',
     'transition-transform duration-200'
    )}
   />
  {:else}
   <div
    class={clsx(
     'w-full h-full flex justify-center items-center',
     'bg-gradient-to-br from-main-light to-main-lighter',
     'text-white font-semibold',
     variant === 'home' ? 'text-lg' : 'text-sm',
     'transition-all duration-300',
     isHovered && 'bg-gradient-to-br from-primary-500 to-primary-600'
    )}
   >
    {getInitials(name)}
   </div>
  {/if}

  <!-- Hover overlay effect -->
  {#if isHovered && !active}
   <div class="absolute inset-0 bg-white/5 rounded-2xl pointer-events-none"></div>
  {/if}
 </div>

 <!-- Active/Hover Indicator Bar -->
 <div
  class={clsx(
   'absolute w-1 bg-white rounded-r-full z-20',
   'transition-all duration-200',
   active ? 'h-10 -left-3 opacity-100' : 'h-2 -left-4 opacity-0',
   isHovered && !active && 'h-5 -left-3 opacity-60'
  )}
  style="top: 50%; transform: translateY(-50%);"
  bind:this={barContainer}
 ></div>

 <!-- Notification Badge (optional) -->
 {#if variant === 'guild'}
  <div
   class={clsx(
    'absolute -bottom-1 -right-1 w-4 h-4',
    'bg-danger rounded-full',
    'border-2 border-main-darkest',
    'flex items-center justify-center',
    'text-[10px] font-bold text-white',
    'opacity-0 group-hover:opacity-100',
    'transition-opacity duration-200',
    'hidden' // Hidden by default, can be shown when needed
   )}
  >
   3
  </div>
 {/if}
</a>

<style>
 /* Smooth image loading transition */
 img {
  opacity: 0;
  animation: fadeIn 0.3s ease-out forwards;
 }

 @keyframes fadeIn {
  to {
   opacity: 1;
  }
 }
</style>
