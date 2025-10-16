<script lang="ts">
 import clsx from 'clsx';
 import Badge from '$lib/components/generic/Badge.svelte';
 import Card from '$lib/components/generic/Card.svelte';
 import Switch from '$lib/components/generic/Switch.svelte';
 import Button from '$lib/components/generic/Button.svelte';
 import LoadingSpinner from '$lib/components/generic/LoadingSpinner.svelte';
 import FormField from '$lib/components/generic/FormField.svelte';
 import Toast from '$lib/components/generic/Toast.svelte';
 import LiveRegion from '$lib/components/generic/LiveRegion.svelte';
 import MultiInstanceSetting from '$lib/components/guild/MultiInstanceSetting.svelte';
 import { ERROR_DEFINITIONS } from '$lib/scripts/errorDefinitions.js';

 let showToastExample = $state(false);
 let toastMessage = $state('');
 let liveRegionMessage = $state('');
 let formError = $state('');

 // Color tokens from uno.config.ts
 const colors = {
  primary: [
   { name: 'primary-50', value: '#eef0ff', css: 'bg-primary-50' },
   { name: 'primary-100', value: '#dde1ff', css: 'bg-primary-100' },
   { name: 'primary-200', value: '#bbc3ff', css: 'bg-primary-200' },
   { name: 'primary-300', value: '#8e99ff', css: 'bg-primary-300' },
   { name: 'primary-400', value: '#5c69eb', css: 'bg-primary-400' },
   { name: 'primary-500', value: '#3644d9', css: 'bg-primary-500' },
   { name: 'primary-600', value: '#2732b3', css: 'bg-primary-600' },
   { name: 'primary-700', value: '#1f2690', css: 'bg-primary-700' },
   { name: 'primary-800', value: '#1a2177', css: 'bg-primary-800' },
   { name: 'primary-900', value: '#181f63', css: 'bg-primary-900' }
  ],
  neutral: [
   { name: 'main-darkest', value: '#0f0f0f', css: 'bg-main-darkest' },
   { name: 'main-pre-darkest', value: '#131313', css: 'bg-main-pre-darkest' },
   { name: 'main-darker', value: '#1a1a1a', css: 'bg-main-darker' },
   { name: 'main-dark', value: '#1f1f1f', css: 'bg-main-dark' },
   { name: 'main-dark-hover', value: '#2a2a2a', css: 'bg-main-dark-hover' },
   { name: 'main', value: '#262626', css: 'bg-main' },
   { name: 'main-light', value: '#2d2d2d', css: 'bg-main-light' },
   { name: 'main-lighter', value: '#333333', css: 'bg-main-lighter' },
   { name: 'main-lightest', value: '#404040', css: 'bg-main-lightest' }
  ],
  text: [
   { name: 'main-text-active', value: '#ffffff', css: 'text-main-text-active' },
   { name: 'main-text', value: '#e4e4e7', css: 'text-main-text' },
   { name: 'alt-text', value: '#a1a1aa', css: 'text-alt-text' },
   { name: 'muted-text', value: '#71717a', css: 'text-muted-text' }
  ],
  accents: [
   { name: 'accent-purple', value: '#a855f7', css: 'bg-accent-purple' },
   { name: 'accent-pink', value: '#ec4899', css: 'bg-accent-pink' },
   { name: 'accent-cyan', value: '#06b6d4', css: 'bg-accent-cyan' },
   { name: 'accent-emerald', value: '#10b981', css: 'bg-accent-emerald' },
   { name: 'accent-amber', value: '#f59e0b', css: 'bg-accent-amber' },
   { name: 'accent-coral', value: '#fb7185', css: 'bg-accent-coral' }
  ],
  semantic: [
   { name: 'primary', value: '#5c69eb', css: 'bg-primary' },
   { name: 'secondary', value: '#52525b', css: 'bg-secondary' },
   { name: 'danger', value: '#ef4444', css: 'bg-danger' },
   { name: 'success', value: '#16a34a', css: 'bg-success' },
   { name: 'warning', value: '#b45309', css: 'bg-warning' },
   { name: 'info', value: '#3b82f6', css: 'bg-info' }
  ],
  special: [
   { name: 'blurple', value: '#5865f2', css: 'bg-blurple' },
   { name: 'check-checked', value: '#22c55e', css: 'bg-check-checked' },
   { name: 'check-unchecked', value: '#52525b', css: 'bg-check-unchecked' },
   { name: 'fake-white', value: '#f3fefc', css: 'bg-fake-white' }
  ]
 };

 const buttonVariants = [
  { name: 'Primary', class: 'btn-primary' },
  { name: 'Secondary', class: 'btn-secondary' },
  { name: 'Danger', class: 'btn-danger' },
  { name: 'Success', class: 'btn-success' },
  { name: 'Warning', class: 'btn-warning' },
  { name: 'Info', class: 'btn-info' },
  { name: 'Ghost', class: 'btn-ghost' },
  { name: 'Ghost Primary', class: 'btn-ghost-primary' },
  { name: 'Ghost Danger', class: 'btn-ghost-danger' },
  { name: 'Glass', class: 'btn-glass' },
  { name: 'Glass Primary', class: 'btn-glass-primary' },
  { name: 'Outlined', class: 'btn-outlined' },
  { name: 'Outlined Primary', class: 'btn-outlined-primary' },
  { name: 'Outlined Danger', class: 'btn-outlined-danger' },
  { name: 'Icon', class: 'btn-icon' },
  { name: 'Icon Primary', class: 'btn-icon-primary' },
  { name: 'Link', class: 'btn-link' }
 ];

 const glassEffects = [
  { name: 'Light Glass', class: 'glass', description: 'Basic glass morphism effect' },
  { name: 'Heavy Glass', class: 'glass-heavy', description: 'Stronger blur and opacity' },
  { name: 'Dark Glass', class: 'glass-dark', description: 'Dark variant for light backgrounds' },
  { name: 'Glass Card', class: 'glass-card', description: 'Card component with glass effect' },
  { name: 'Glass Panel', class: 'glass-panel', description: 'Panel component with glass effect' },
  { name: 'Glass Tooltip', class: 'glass-tooltip', description: 'Tooltip styling with glass' }
 ];

 const cardStyles = [
  { name: 'Base Card', class: 'card-base' },
  { name: 'Hover Card', class: 'card-hover' },
  { name: 'Glass Card', class: 'card-glass' }
 ];

 const shadows = [
  { name: 'Main Shadow', class: 'box-shadow-main' },
  { name: 'Glow Shadow', class: 'shadow-glow' },
  { name: 'Soft Shadow', class: 'shadow-soft' },
  { name: 'Hard Shadow', class: 'shadow-hard' }
 ];

 const fonts = [
  {
   name: 'Poppins',
   class: 'font-poppins',
   sample: 'The quick brown fox jumps over the lazy dog',
   usage: 'Primary font for headings and body text'
  },
  {
   name: 'Code Font',
   class: 'code-font',
   sample: 'const hello = "world";',
   usage: 'IBM Plex Mono for code blocks'
  },
  {
   name: 'Serif',
   class: 'font-serif',
   sample: 'Elegant serif typography',
   usage: 'DM Serif Display for decorative text'
  },
  {
   name: 'Mono',
   class: 'font-mono',
   sample: 'Monospaced text example',
   usage: 'DM Mono for technical content'
  },
  {
   name: 'Clock',
   class: 'font-clock',
   sample: '12:34:56',
   usage: 'Bungee Outline for time displays'
  },
  { name: 'Card', class: 'font-card', sample: 'Card Typography', usage: 'Mina for card headers' }
 ];

 const icons = [
  'i-tabler-layout-dashboard',
  'i-tabler-bell',
  'i-tabler-terminal-2',
  'i-tabler-link',
  'i-tabler-palette',
  'i-tabler-settings',
  'i-tabler-search',
  'i-tabler-chevron-right',
  'i-tabler-menu-2',
  'i-tabler-x',
  'i-tabler-grid-dots',
  'i-tabler-logout',
  'i-tabler-login',
  'i-tabler-home',
  'i-tabler-file-text',
  'i-tabler-key',
  'i-tabler-crown',
  'i-tabler-shield-check',
  'i-tabler-users',
  'i-tabler-star',
  'i-tabler-star-filled',
  'i-tabler-clipboard',
  'i-tabler-arrow-left',
  'i-tabler-lock',
  'i-tabler-ghost-2',
  'i-tabler-exclamation-circle',
  'i-tabler-shield-x',
  'i-tabler-clock-pause',
  'i-tabler-server-off',
  'i-tabler-tool',
  'i-tabler-bug',
  'i-tabler-alert-triangle',
  'i-tabler-info-circle',
  'i-tabler-coffee',
  'i-tabler-gavel',
  'i-tabler-server-2',
  'i-tabler-home-2',
  'i-tabler-chevron-left',
  'i-tabler-chevron-down',
  'i-tabler-chevron-up',
  'i-tabler-arrow-up',
  'i-tabler-heart-filled'
 ];

 const errorDefinitions = ERROR_DEFINITIONS;

 // Component patterns documentation
 const componentPatterns = [
  {
   name: 'Accessibility: Skip Navigation',
   description: 'Skip link for keyboard users to bypass navigation',
   example: 'Main layout at top of page',
   classes: 'skip-link - Hidden until focused with Tab key'
  },
  {
   name: 'Accessibility: Touch Targets',
   description: 'All interactive elements meet 44x44px minimum size',
   example: 'Button component XS/SM sizes, Select options',
   classes: 'min-h-[44px] min-w-[44px]'
  },
  {
   name: 'Accessibility: Focus Indicators',
   description: 'Visible focus rings with sufficient contrast',
   example: 'All buttons, inputs, and interactive elements',
   classes: 'focus:ring-2 focus:ring-primary-500/50 focus:outline-none'
  },
  {
   name: 'Accessibility: ARIA Labels',
   description: 'Proper ARIA attributes for screen readers',
   example: 'Select (combobox), Modal (dialog), Options (listbox)',
   classes: 'role="combobox" aria-expanded aria-controls'
  },
  {
   name: 'Accessibility: ARIA Live Regions',
   description: 'Screen reader announcements for dynamic content updates',
   example: 'LiveRegion component, LoadingSpinner, Toast notifications',
   classes: 'role="status" aria-live="polite" aria-atomic="true"'
  },
  {
   name: 'Accessibility: Roving Tabindex',
   description: 'Arrow key navigation in lists and menus with active state tracking',
   example: 'Select Options component with ArrowUp/ArrowDown/Home/End keys',
   classes: 'aria-activedescendant tabindex="-1" onkeydown handler'
  },
  {
   name: 'Accessibility: Focus Management',
   description: 'Focus trap for modals and focus restoration utilities',
   example: 'KeyboardShortcutsModal, Modal component',
   classes: 'trapFocus, saveFocus, restoreFocus utilities'
  },
  {
   name: 'Accessibility: Keyboard Shortcuts',
   description: 'Global keyboard shortcuts with visual documentation',
   example: 'g+d (dashboard), g+r (reminders), ? (help), Escape (close)',
   classes: 'KeyboardShortcutsModal, handleKeyboardShortcut utility'
  },
  {
   name: 'Accessibility: Form Validation',
   description: 'Accessible form fields with error announcements and descriptions',
   example: 'FormField component with aria-invalid and aria-describedby',
   classes: 'role="alert" aria-invalid aria-describedby'
  },
  {
   name: 'Accessibility: Reduced Motion',
   description: 'Respects prefers-reduced-motion user preference',
   example: 'All animations disabled when user requests reduced motion',
   classes: '@media (prefers-reduced-motion: reduce) - applied globally'
  },
  {
   name: 'Mobile: Drawer Navigation',
   description: 'Slide-in drawer from left with overlay backdrop on mobile (<1024px)',
   example: 'NavigationSidebar, GuildSidebar',
   classes: 'fixed lg:sticky translate-x-0 max-lg:-translate-x-full transition-transform'
  },
  {
   name: 'Mobile: Bottom Sheet Modal',
   description: 'Modals slide up from bottom on mobile, centered on desktop',
   example: 'Modal component',
   classes: 'fixed bottom-0 md:relative rounded-t-3xl md:rounded-2xl'
  },
  {
   name: 'Mobile: Hamburger Menu',
   description: 'Animated hamburger button for mobile navigation toggle',
   example: 'MobileMenuButton component',
   classes: 'lg:hidden p-2 rounded-lg focus-visible-ring'
  },
  {
   name: 'Mobile: Touch Gestures',
   description: 'Swipe down to close modals, swipe left to close drawers',
   example: 'Modal swipe-to-close, Drawer swipe-to-close',
   classes: 'ontouchstart ontouchend - Touch event handlers'
  },
  {
   name: 'Mobile: Overlay Backdrop',
   description: 'Full-screen backdrop with blur for mobile drawers/modals',
   example: 'Sidebar overlays, Modal overlays',
   classes: 'fixed inset-0 bg-black/50 backdrop-blur-sm z-30'
  },
  {
   name: 'Modal Pattern',
   description: 'Overlay modals with backdrop blur and glass effects',
   example: 'ServerSelectionModal, KeyboardShortcutsModal',
   classes: 'fixed inset-0 z-50 bg-black/50 backdrop-blur-sm'
  },
  {
   name: 'Navigation Pattern',
   description: 'Collapsible sidebar with keyboard shortcuts',
   example: 'NavigationSidebar',
   classes: 'flex flex-col h-full transition-all duration-300'
  },
  {
   name: 'Loading States',
   description: 'Skeleton loaders and spinners for async content',
   example: 'LoadingSpinner, Skeleton, ProgressIndicator',
   classes: 'animate-pulse bg-white/10 rounded-lg'
  },
  {
   name: 'Empty States',
   description: 'Placeholder content when no data is available',
   example: 'EmptyState component',
   classes: 'text-center py-12 text-muted-text'
  },
  {
   name: 'Form Controls',
   description: 'Consistent input styling with validation states',
   example: 'TextInput, NumberInput, Select, Switch',
   classes: 'input-base focus:ring-2 focus:ring-primary-500/20'
  },
  {
   name: 'Feedback',
   description: 'Toast notifications and feedback forms',
   example: 'NotificationToast, FeedbackForm',
   classes: 'fixed bottom-4 right-4 animate-slide-up'
  }
 ];

 // Utility classes documentation
 const utilityPatterns = [
  {
   category: 'Accessibility',
   patterns: [
    { class: 'sr-only', description: 'Hide visually but keep for screen readers' },
    { class: 'not-sr-only', description: 'Revert sr-only hiding' },
    { class: 'focus-visible-ring', description: 'Primary focus ring for keyboard navigation' },
    { class: 'focus-visible-ring-white', description: 'White focus ring for dark backgrounds' },
    { class: 'min-h-[44px] min-w-[44px]', description: 'Minimum touch target size' }
   ]
  },
  {
   category: 'Mobile Responsive',
   patterns: [
    { class: 'lg:hidden', description: 'Hide on desktop (1024px+), show on mobile/tablet' },
    { class: 'lg:block', description: 'Show on desktop, hide on mobile/tablet' },
    { class: 'md:hidden', description: 'Hide on tablet+ (768px+)' },
    { class: 'sm:grid-cols-2', description: 'Two columns on mobile (640px+)' },
    { class: 'lg:grid-cols-3', description: 'Three columns on desktop (1024px+)' },
    { class: 'max-lg:-translate-x-full', description: 'Slide off-screen left on mobile' },
    { class: 'fixed lg:sticky', description: 'Fixed on mobile, sticky on desktop' },
    { class: 'rounded-t-3xl md:rounded-2xl', description: 'Top rounded on mobile, all on desktop' }
   ]
  },
  {
   category: 'Flexbox',
   patterns: [
    { class: 'flex-center', description: 'Centers content horizontally and vertically' },
    { class: 'flex-between', description: 'Space between with center alignment' },
    { class: 'flex-col-center', description: 'Column layout with centered content' }
   ]
  },
  {
   category: 'Transitions',
   patterns: [
    { class: 'transition-all duration-200', description: 'Standard transition' },
    { class: 'transition-all duration-300', description: 'Slower transition' },
    { class: 'hover:scale-105 active:scale-95', description: 'Interactive scaling' }
   ]
  },
  {
   category: 'Gradients',
   patterns: [
    { class: 'bg-gradient-to-r', description: 'Horizontal gradient' },
    { class: 'bg-gradient-to-br', description: 'Diagonal gradient' },
    { class: 'bg-clip-text text-transparent', description: 'Gradient text' }
   ]
  },
  {
   category: 'Borders',
   patterns: [
    { class: 'border border-white/10', description: 'Subtle border' },
    { class: 'border-l-4 border-primary-500', description: 'Accent border' },
    { class: 'rounded-lg', description: 'Standard border radius' },
    { class: 'rounded-xl', description: 'Large border radius' },
    { class: 'rounded-full', description: 'Circular/pill shape' }
   ]
  }
 ];

 // State management patterns
 const statePatterns = [
  {
   name: 'Loading State',
   description: 'Shows while data is being fetched',
   implementation: '$state(true) → LoadingSpinner → $state(false)'
  },
  {
   name: 'Error State',
   description: 'Displays when an operation fails',
   implementation: 'try/catch → error boundary → +error.svelte'
  },
  {
   name: 'Empty State',
   description: 'Shows when no data is available',
   implementation: 'data.length === 0 → EmptyState component'
  },
  {
   name: 'Success State',
   description: 'Confirmation after successful action',
   implementation: 'NotificationToast with success variant'
  }
 ];

 const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
 };

 const mobilePatterns = [
  {
   name: 'Mobile Navigation Drawer',
   code: `<!-- Mobile drawer with backdrop -->
{#if isOpen}
 <div
  class="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm"
  onclick={() => (isOpen = false)}
  role="presentation"
 ></div>
{/if}

<aside class="fixed lg:sticky top-0 h-screen z-40 transition-transform
 {isOpen ? 'translate-x-0' : 'max-lg:-translate-x-full'}">
 <!-- Sidebar content -->
</aside>`,
   description: 'Slide-in navigation drawer for mobile with backdrop overlay'
  },
  {
   name: 'Mobile Bottom Sheet Modal',
   code: `<!-- Bottom sheet modal -->
<div class="fixed inset-0 z-[9999] flex items-end md:items-center">
 <div class="fixed bottom-0 left-0 right-0 rounded-t-3xl
  md:relative md:rounded-2xl bg-main-dark">
  <div class="md:hidden w-12 h-1 bg-white/30 rounded-full mx-auto mt-3"></div>
  <!-- Modal content -->
 </div>
</div>`,
   description: 'Modal that slides from bottom on mobile, centered on desktop'
  },
  {
   name: 'Responsive Grid Layout',
   code: `<!-- Responsive card grid -->
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
 <!-- Cards stack on mobile, 2 cols on tablet, 3 on desktop -->
</div>`,
   description: 'Cards that reflow based on viewport width'
  },
  {
   name: 'Mobile Menu Toggle',
   code: `<!-- Hamburger menu button -->
<button class="lg:hidden p-2 rounded-lg focus-visible-ring"
 aria-label={isOpen ? 'Close menu' : 'Open menu'}>
 <div class="w-6 h-5 flex flex-col justify-between">
  <span class="block h-0.5 w-full bg-main-text transition-all
   {isOpen ? 'rotate-45 translate-y-2' : ''}"></span>
  <span class="block h-0.5 w-full bg-main-text transition-opacity
   {isOpen ? 'opacity-0' : ''}"></span>
  <span class="block h-0.5 w-full bg-main-text transition-all
   {isOpen ? '-rotate-45 -translate-y-2' : ''}"></span>
 </div>
</button>`,
   description: 'Animated hamburger menu icon with accessibility'
  }
 ];

 let selectedTab = $state<'colors' | 'components' | 'patterns' | 'utilities'>('colors');
</script>

<div class="p-8">
 <div class="max-w-7xl mx-auto">
  <!-- Header -->
  <div class="mb-8">
   <h1 class="text-4xl font-bold text-white mb-2">Design System Documentation</h1>
   <p class="text-white/60">
    Comprehensive reference of all design tokens, components, patterns, and utilities used in the
    Ayako Dashboard.
   </p>
  </div>

  <!-- Navigation Tabs -->
  <div class="mb-8 flex gap-2 p-1 bg-white/5 rounded-lg">
   <button
    onclick={() => (selectedTab = 'colors')}
    class={clsx(
     'px-4 py-2 rounded-lg transition-all duration-200',
     selectedTab === 'colors'
      ? 'bg-primary-500 text-white'
      : 'text-white/60 hover:text-white hover:bg-white/5'
    )}
   >
    Colors
   </button>
   <button
    onclick={() => (selectedTab = 'components')}
    class={clsx(
     'px-4 py-2 rounded-lg transition-all duration-200',
     selectedTab === 'components'
      ? 'bg-primary-500 text-white'
      : 'text-white/60 hover:text-white hover:bg-white/5'
    )}
   >
    Components
   </button>
   <button
    onclick={() => (selectedTab = 'patterns')}
    class={clsx(
     'px-4 py-2 rounded-lg transition-all duration-200',
     selectedTab === 'patterns'
      ? 'bg-primary-500 text-white'
      : 'text-white/60 hover:text-white hover:bg-white/5'
    )}
   >
    Patterns
   </button>
   <button
    onclick={() => (selectedTab = 'utilities')}
    class={clsx(
     'px-4 py-2 rounded-lg transition-all duration-200',
     selectedTab === 'utilities'
      ? 'bg-primary-500 text-white'
      : 'text-white/60 hover:text-white hover:bg-white/5'
    )}
   >
    Utilities
   </button>
  </div>

  {#if selectedTab === 'colors'}
   <!-- Color Palette Section -->
   <section class="space-y-12">
    <Card
     title="Color System"
     description="Complete color palette with hex values and usage guidelines"
    >
     {#snippet children()}
      <!-- Primary Colors -->
      <div class="mb-8">
       <h3 class="text-lg font-semibold text-white/80 mb-4">Primary Palette</h3>
       <div class="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {#each colors.primary as color}
         <button onclick={() => copyToClipboard(color.value)} class="group relative">
          <div
           class={clsx(
            color.css,
            'h-20 rounded-lg border border-white/10',
            'group-hover:scale-105 transition-transform duration-200'
           )}
          ></div>
          <div class="mt-2">
           <p class="text-xs text-white/60 font-mono">{color.name}</p>
           <p class="text-xs text-white/40">{color.value}</p>
          </div>
          <div
           class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
           <span class="bg-black/80 text-white text-xs px-2 py-1 rounded">Click to copy</span>
          </div>
         </button>
        {/each}
       </div>
      </div>

      <!-- Neutral Colors -->
      <div class="mb-8">
       <h3 class="text-lg font-semibold text-white/80 mb-4">Neutral/Background</h3>
       <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {#each colors.neutral as color}
         <button onclick={() => copyToClipboard(color.value)} class="group relative">
          <div
           class={clsx(
            color.css,
            'h-20 rounded-lg border border-white/10',
            'group-hover:scale-105 transition-transform duration-200'
           )}
          ></div>
          <div class="mt-2">
           <p class="text-xs text-white/60 font-mono">{color.name}</p>
           <p class="text-xs text-white/40">{color.value}</p>
          </div>
         </button>
        {/each}
       </div>
      </div>

      <!-- Semantic Colors -->
      <div class="mb-8">
       <h3 class="text-lg font-semibold text-white/80 mb-4">Semantic Colors (WCAG AA Compliant)</h3>
       <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {#each colors.semantic as color}
         <button onclick={() => copyToClipboard(color.value)} class="group relative">
          <div
           class={clsx(
            color.css,
            'h-20 rounded-lg',
            'group-hover:scale-105 transition-transform duration-200'
           )}
          ></div>
          <div class="mt-2">
           <p class="text-xs text-white/60 font-mono">{color.name}</p>
           <p class="text-xs text-white/40">{color.value}</p>
          </div>
         </button>
        {/each}
       </div>
      </div>

      <!-- Text Colors -->
      <div>
       <h3 class="text-lg font-semibold text-white/80 mb-4">Text Hierarchy</h3>
       <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {#each colors.text as color}
         <button
          onclick={() => copyToClipboard(color.value)}
          class="group relative bg-main-dark rounded-lg p-4 border border-white/10 hover:border-white/20 transition-all"
         >
          <p class={clsx(color.css, 'text-lg font-medium mb-2')}>Sample Text</p>
          <p class="text-xs text-white/60 font-mono">{color.name}</p>
          <p class="text-xs text-white/40">{color.value}</p>
         </button>
        {/each}
       </div>
      </div>
     {/snippet}
    </Card>

    <Card
     title="Error Responses"
     description="Standard HTTP error templates used across the dashboard"
    >
     {#snippet children()}
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
       {#each errorDefinitions as definition}
        <div
         class="relative p-4 rounded-xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/10 overflow-hidden"
        >
         <div
          class={clsx(
           'absolute inset-0 opacity-10 pointer-events-none',
           'bg-gradient-to-br',
           definition.bgGradient
          )}
         ></div>
         <div class="relative z-10 space-y-3">
          <div class="flex items-center gap-3">
           <span class={clsx('text-2xl', definition.color, definition.icon)}></span>
           <div>
            <p class={clsx('text-sm font-semibold uppercase tracking-wide', definition.color)}>
             {definition.code}
            </p>
            <p class="text-white text-base font-medium">{definition.title}</p>
           </div>
          </div>
          <p class="text-white/50 text-sm leading-relaxed">{definition.description}</p>
          <ul class="space-y-1 text-xs text-white/40">
           {#each definition.suggestions as suggestion}
            <li class="flex items-center gap-2">
             <span class="i-tabler-arrow-right text-primary-400"></span>
             <span>{suggestion}</span>
            </li>
           {/each}
          </ul>
         </div>
        </div>
       {/each}
      </div>
     {/snippet}
    </Card>
   </section>
  {/if}

  {#if selectedTab === 'components'}
   <!-- Components Section -->
   <section class="space-y-8">
    <!-- Button Components -->
    <Card title="Button System" description="All button variants with hover and active states">
     {#snippet children()}
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
       {#each buttonVariants as variant}
        <div
         class="p-4 rounded-lg bg-white/5 border border-white/10 flex justify-between items-center"
        >
         <button class={variant.class}>
          {variant.name}
         </button>
         <code class="text-xs text-white/40 font-mono ml-2">{variant.class}</code>
        </div>
       {/each}
      </div>

      <!-- Button Sizes -->
      <div class="mt-8">
       <h4 class="text-white/80 mb-4">Size Variants</h4>
       <div class="flex gap-4 items-center">
        <Button size="xs">Extra Small</Button>
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg">Large</Button>
       </div>
      </div>
     {/snippet}
    </Card>

    <!-- Badge Component -->
    <Card title="Badge Component" description="Status indicators and labels">
     {#snippet children()}
      <div class="flex flex-wrap gap-3">
       <Badge text="Primary" variant="primary" />
       <Badge text="Success" variant="success" />
       <Badge text="Danger" variant="danger" />
       <Badge text="Warning" variant="warning" />
       <Badge text="Info" variant="info" />
       <Badge text="Neutral" variant="neutral" />
      </div>
      <div class="mt-4 flex flex-wrap gap-3">
       <Badge text="With Icon" variant="primary" icon="i-tabler-star" />
       <Badge text="Gradient" variant="success" gradient />
       <Badge text="Rounded" variant="info" rounded />
       <Badge text="Animated" variant="danger" animated />
      </div>
     {/snippet}
    </Card>

    <!-- Card Variants -->
    <Card title="Card Components" description="Different card styles for content containers">
     {#snippet children()}
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
       <Card variant="default" title="Default Card" description="Standard card with border">
        {#snippet children()}
         <p class="text-white/60">Card content goes here</p>
        {/snippet}
       </Card>

       <Card variant="glass" title="Glass Card" description="With glass morphism effect">
        {#snippet children()}
         <p class="text-white/60">Transparent background with blur</p>
        {/snippet}
       </Card>

       <Card variant="gradient" title="Gradient Card" description="Subtle gradient background">
        {#snippet children()}
         <p class="text-white/60">Gradient from dark to darker</p>
        {/snippet}
       </Card>

       <Card variant="outlined" title="Outlined Card" description="Border only, no background">
        {#snippet children()}
         <p class="text-white/60">Minimal outlined style</p>
        {/snippet}
       </Card>
      </div>
     {/snippet}
    </Card>

    <!-- Form Controls -->
    <Card title="Form Controls" description="Input fields and interactive elements">
     {#snippet children()}
      <div class="space-y-6 max-w-md">
       <div>
        <label for="designs-text-input" class="block text-sm text-white/60 mb-2">Text Input</label>
        <input id="designs-text-input" type="text" class="input-base" placeholder="Enter text..." />
       </div>

       <div>
        <label for="designs-glass-input" class="block text-sm text-white/60 mb-2">Glass Input</label
        >
        <input
         id="designs-glass-input"
         type="text"
         class="input-glass"
         placeholder="Glass style input..."
        />
       </div>

       <div>
        <label for="designs-feature-toggle" class="block text-sm text-white/60 mb-2"
         >Switch Toggle</label
        >
        <Switch name="designs-feature-toggle" title="Enable notifications" />
       </div>
      </div>
     {/snippet}
    </Card>

    <!-- Multi-Instance Settings -->
    <Card
     title="Multi-Instance Settings"
     description="Component for managing multiple instances of a setting with add/edit/delete functionality"
    >
     {#snippet children()}
      <div class="space-y-6">
       <div>
        <h4 class="text-white/80 font-medium mb-3">MultiInstanceSetting Component</h4>
        <p class="text-sm text-white/60 mb-4">
         Allows users to create, edit, and delete multiple instances of a setting. Each instance has
         all the fields defined in the setting template.
        </p>
        <div class="bg-main-darker p-4 rounded-lg">
         <MultiInstanceSetting
          setting={{
           id: 'example-multi',
           name: 'Example Multi Setting',
           description: 'This is an example of a multi-instance setting',
           category: 'General',
           isMulti: true,
           fields: [
            { name: 'Label', type: 'string' as const, description: 'Display label' },
            { name: 'Value', type: 'string' as const, description: 'Configuration value' }
           ]
          }}
          guildId="example-guild"
         />
        </div>
        <div class="mt-4 p-4 rounded-lg bg-black/40">
         <p class="text-xs text-white/60 mb-2">Usage:</p>
         <pre class="text-xs text-primary-300 font-mono"><code
           >&lt;MultiInstanceSetting setting=&#123;setting&#125; guildId=&#123;guildId&#125; /&gt;</code
          ></pre>
         <p class="text-xs text-white/60 mt-3 mb-1">Props:</p>
         <ul class="text-xs text-white/50 space-y-1 ml-4">
          <li>
           • <code class="text-primary-400">setting</code>: GETBotSettings[0] - Setting definition
          </li>
          <li>• <code class="text-primary-400">guildId</code>: string - Guild ID for API calls</li>
         </ul>
         <p class="text-xs text-white/60 mt-3 mb-1">Features:</p>
         <ul class="text-xs text-white/50 space-y-1 ml-4">
          <li>• Add new instances with form validation</li>
          <li>• Edit existing instances inline</li>
          <li>• Delete with confirmation and 5-second undo</li>
          <li>• Empty state with helpful messaging</li>
          <li>• Toast notifications for user feedback</li>
          <li>• Keyboard accessible</li>
         </ul>
        </div>
       </div>
      </div>
     {/snippet}
    </Card>

    <!-- Accessibility Components -->
    <Card title="Accessibility Components" description="Phase 3 enhanced accessibility features">
     {#snippet children()}
      <div class="space-y-6">
       <!-- FormField with Validation -->
       <div>
        <h4 class="text-white/80 font-medium mb-3">FormField Component</h4>
        <FormField
         label="Email Address"
         id="email-example"
         required
         description="We'll never share your email with anyone else."
         error={formError}
        >
         <input
          id="email-example"
          type="email"
          class="input-base w-full"
          placeholder="name@example.com"
          onblur={(e) => {
           const value = e.currentTarget.value;
           if (value && !value.includes('@')) {
            formError = 'Please enter a valid email address';
           } else {
            formError = '';
           }
          }}
         />
        </FormField>
       </div>

       <!-- LoadingSpinner with Announcements -->
       <div>
        <h4 class="text-white/80 font-medium mb-3">Loading Spinner (with ARIA)</h4>
        <div class="flex gap-4 items-center">
         <LoadingSpinner size="sm" variant="default" label="Loading content..." />
         <LoadingSpinner size="md" variant="ring" label="Processing..." />
         <LoadingSpinner size="lg" variant="dots" label="Please wait..." />
        </div>
       </div>

       <!-- Toast Notifications -->
       <div>
        <h4 class="text-white/80 font-medium mb-3">Toast Notifications</h4>
        <div class="flex gap-2 flex-wrap">
         <Button
          variant="success"
          size="sm"
          onclick={() => {
           toastMessage = 'Successfully saved changes!';
           showToastExample = true;
          }}
         >
          Show Success
         </Button>
         <Button
          variant="danger"
          size="sm"
          onclick={() => {
           toastMessage = 'An error occurred. Please try again.';
           showToastExample = true;
          }}
         >
          Show Error
         </Button>
         <Button
          variant="info"
          size="sm"
          onclick={() => {
           toastMessage = 'New message received';
           showToastExample = true;
          }}
         >
          Show Info
         </Button>
        </div>
        {#if showToastExample}
         <div class="mt-4 relative">
          <Toast
           message={toastMessage}
           type={toastMessage.includes('error')
            ? 'error'
            : toastMessage.includes('success')
              ? 'success'
              : 'info'}
           onClose={() => (showToastExample = false)}
          />
         </div>
        {/if}
       </div>

       <!-- ARIA Live Regions -->
       <div>
        <h4 class="text-white/80 font-medium mb-3">ARIA Live Region</h4>
        <Button
         variant="primary"
         size="sm"
         onclick={() => {
          liveRegionMessage = `Update announced at ${new Date().toLocaleTimeString()}`;
          setTimeout(() => (liveRegionMessage = ''), 3000);
         }}
        >
         Trigger Announcement
        </Button>
        <LiveRegion message={liveRegionMessage} />
        {#if liveRegionMessage}
         <p class="text-sm text-alt-text mt-2">Screen reader announced: "{liveRegionMessage}"</p>
        {/if}
       </div>

       <!-- Keyboard Shortcuts Info -->
       <div>
        <h4 class="text-white/80 font-medium mb-3">Keyboard Shortcuts</h4>
        <div class="bg-main-darker p-4 rounded-lg space-y-2">
         <p class="text-sm text-alt-text">Try these shortcuts:</p>
         <ul class="text-sm text-white/60 space-y-1">
          <li><kbd class="px-2 py-1 bg-main-dark rounded text-xs">?</kbd> - Show shortcuts help</li>
          <li>
           <kbd class="px-2 py-1 bg-main-dark rounded text-xs">g</kbd> +
           <kbd class="px-2 py-1 bg-main-dark rounded text-xs">d</kbd> - Go to dashboard
          </li>
          <li>
           <kbd class="px-2 py-1 bg-main-dark rounded text-xs">g</kbd> +
           <kbd class="px-2 py-1 bg-main-dark rounded text-xs">r</kbd> - Go to reminders
          </li>
          <li><kbd class="px-2 py-1 bg-main-dark rounded text-xs">Escape</kbd> - Close modals</li>
         </ul>
        </div>
       </div>
      </div>
     {/snippet}
    </Card>
   </section>
  {/if}

  {#if selectedTab === 'patterns'}
   <!-- Design Patterns Section -->
   <section class="space-y-8">
    <!-- Mobile Patterns -->
    <Card
     title="Mobile Responsive Patterns"
     description="Mobile-first responsive design patterns with code examples"
    >
     {#snippet children()}
      <div class="space-y-6">
       {#each mobilePatterns as pattern}
        <div class="p-6 rounded-lg bg-white/5 border border-white/10">
         <h4 class="text-lg font-semibold text-white mb-2">{pattern.name}</h4>
         <p class="text-sm text-white/60 mb-4">{pattern.description}</p>
         <div class="bg-black/40 rounded-lg p-4 overflow-x-auto">
          <pre class="text-xs text-primary-300 font-mono"><code>{pattern.code}</code></pre>
         </div>
        </div>
       {/each}
      </div>
     {/snippet}
    </Card>

    <!-- Component Patterns -->
    <Card title="Component Patterns" description="Reusable UI patterns and their implementations">
     {#snippet children()}
      <div class="space-y-4">
       {#each componentPatterns as pattern}
        <div class="p-6 rounded-lg bg-white/5 border border-white/10">
         <h4 class="text-lg font-semibold text-white mb-2">{pattern.name}</h4>
         <p class="text-sm text-white/60 mb-3">{pattern.description}</p>
         <div class="flex flex-wrap gap-2 mb-3">
          <Badge text="Example" variant="info" size="xs" />
          <span class="text-xs text-white/40">{pattern.example}</span>
         </div>
         <code class="text-xs text-primary-400 font-mono block p-2 bg-black/30 rounded">
          {pattern.classes}
         </code>
        </div>
       {/each}
      </div>
     {/snippet}
    </Card>

    <!-- State Management -->
    <Card
     title="State Management Patterns"
     description="Common application states and their handling"
    >
     {#snippet children()}
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
       {#each statePatterns as state}
        <div class="p-4 rounded-lg bg-white/5 border border-white/10">
         <h4 class="font-semibold text-white mb-2">{state.name}</h4>
         <p class="text-sm text-white/60 mb-3">{state.description}</p>
         <code class="text-xs text-primary-400 font-mono">
          {state.implementation}
         </code>
        </div>
       {/each}
      </div>
     {/snippet}
    </Card>

    <!-- Glass Effects -->
    <Card title="Glass Morphism" description="Different glass effect intensities">
     {#snippet children()}
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
       {#each glassEffects as effect}
        <div class={clsx(effect.class, 'p-6 relative')}>
         <h3 class="text-lg font-semibold text-white mb-2">{effect.name}</h3>
         <p class="text-sm text-white/60 mb-4">{effect.description}</p>
         <code class="text-xs text-white/40 font-mono">{effect.class}</code>
        </div>
       {/each}
      </div>
     {/snippet}
    </Card>
   </section>
  {/if}

  {#if selectedTab === 'utilities'}
   <!-- Utilities Section -->
   <section class="space-y-8">
    <!-- Typography -->
    <Card title="Typography System" description="Font families and their use cases">
     {#snippet children()}
      <div class="space-y-4">
       {#each fonts as font}
        <div class="p-6 rounded-lg bg-white/5 border border-white/10">
         <div class="flex justify-between items-start">
          <div class="flex-1">
           <p class="text-sm text-white/60 mb-2">{font.name}</p>
           <p class={clsx(font.class, 'text-2xl text-white mb-2')}>{font.sample}</p>
           <p class="text-xs text-white/40">{font.usage}</p>
          </div>
          <button
           onclick={() => copyToClipboard(font.class)}
           class="px-3 py-1 rounded bg-white/5 hover:bg-white/10 text-white/60 text-xs transition-colors"
          >
           Copy class
          </button>
         </div>
        </div>
       {/each}
      </div>
     {/snippet}
    </Card>

    <!-- Utility Classes -->
    <Card title="Utility Classes" description="Common utility patterns for rapid development">
     {#snippet children()}
      <div class="space-y-6">
       {#each utilityPatterns as category}
        <div>
         <h4 class="text-lg font-semibold text-white mb-4">{category.category}</h4>
         <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          {#each category.patterns as pattern}
           <div class="flex justify-between items-center p-3 rounded-lg bg-white/5">
            <code class="text-sm text-primary-400 font-mono">{pattern.class}</code>
            <span class="text-xs text-white/60">{pattern.description}</span>
           </div>
          {/each}
         </div>
        </div>
       {/each}
      </div>
     {/snippet}
    </Card>

    <!-- Shadows -->
    <Card title="Shadow Effects" description="Elevation and depth through shadows">
     {#snippet children()}
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
       {#each shadows as shadow}
        <div class={clsx('bg-main-dark rounded-lg p-6 border border-white/10', shadow.class)}>
         <p class="text-white font-medium mb-2">{shadow.name}</p>
         <code class="text-xs text-white/40 font-mono">{shadow.class}</code>
        </div>
       {/each}
      </div>
     {/snippet}
    </Card>

    <!-- Icons -->
    <Card title="Icon Library" description="Tabler icons used throughout the application">
     {#snippet children()}
      <div class="p-6 rounded-lg bg-white/5 border border-white/10">
       <div class="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-4">
        {#each icons as icon}
         <button
          onclick={() => copyToClipboard(icon)}
          class="group flex flex-col items-center justify-center p-4 rounded-lg hover:bg-white/5 transition-colors"
          title={icon}
         >
          <span
           class={clsx(icon, 'text-2xl text-white/80 group-hover:text-white transition-colors')}
          ></span>
          <span class="text-xs text-white/40 mt-2 font-mono truncate w-full text-center">
           {icon.split('-').slice(-1)[0]}
          </span>
         </button>
        {/each}
       </div>
      </div>
     {/snippet}
    </Card>

    <!-- Spacing Scale -->
    <Card title="Spacing System" description="Consistent spacing scale based on 4px units">
     {#snippet children()}
      <div class="space-y-2">
       {#each [0, 1, 2, 4, 8, 12, 16, 20, 24, 32, 40, 48, 56, 64] as size}
        <div class="flex items-center gap-4">
         <span class="text-xs text-white/40 font-mono w-12">{size}</span>
         <div class="bg-primary-500 h-8" style="width: {size * 4}px"></div>
         <span class="text-xs text-white/60">{size * 4}px / {size}rem</span>
        </div>
       {/each}
      </div>
     {/snippet}
    </Card>

    <!-- Animations -->
    <Card title="Animation Classes" description="Predefined animations for interactive elements">
     {#snippet children()}
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
       <div class="glass-panel text-center">
        <div class="animate-fade-in mb-4">
         <span class="i-tabler-star-filled text-4xl text-yellow-400"></span>
        </div>
        <p class="text-white">Fade In</p>
        <code class="text-xs text-white/40 font-mono">animate-fade-in</code>
       </div>
       <div class="glass-panel text-center">
        <div class="animate-slide-up mb-4">
         <span class="i-tabler-arrow-up text-4xl text-blue-400"></span>
        </div>
        <p class="text-white">Slide Up</p>
        <code class="text-xs text-white/40 font-mono">animate-slide-up</code>
       </div>
       <div class="glass-panel text-center">
        <div class="animate-pulse-soft mb-4">
         <span class="i-tabler-heart-filled text-4xl text-red-400"></span>
        </div>
        <p class="text-white">Pulse Soft</p>
        <code class="text-xs text-white/40 font-mono">animate-pulse-soft</code>
       </div>
      </div>
     {/snippet}
    </Card>

    <!-- Breakpoints -->
    <Card title="Responsive Breakpoints" description="Tailwind-based responsive design breakpoints">
     {#snippet children()}
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
       {#each [{ name: 'xs', size: '475px', usage: 'Small mobile' }, { name: 'sm', size: '640px', usage: 'Mobile' }, { name: 'md', size: '768px', usage: 'Tablet' }, { name: 'lg', size: '1024px', usage: 'Desktop' }, { name: 'xl', size: '1280px', usage: 'Large desktop' }, { name: '2xl', size: '1536px', usage: 'Extra large' }] as breakpoint}
        <div class="text-center p-4 rounded-lg bg-white/5">
         <p class="text-lg font-bold text-white">{breakpoint.name}:</p>
         <p class="text-sm text-white/60">{breakpoint.size}</p>
         <p class="text-xs text-white/40 mt-1">{breakpoint.usage}</p>
        </div>
       {/each}
      </div>
     {/snippet}
    </Card>
   </section>
  {/if}

  <!-- Footer -->
  <div class="mt-16 p-6 rounded-lg bg-white/5 border border-white/10">
   <div class="flex items-start gap-3">
    <span class="i-tabler-info-circle text-primary-400 text-lg flex-shrink-0 mt-0.5"></span>
    <div class="text-sm text-white/60">
     <p class="mb-2">
      <strong class="text-white">Living Documentation:</strong> This page automatically reflects the
      current state of the design system.
     </p>
     <p class="mb-2">
      All components, patterns, and utilities shown here are actively used in production. Changes to
      the design system should be documented here.
     </p>
     <p>
      <strong class="text-white">Usage:</strong> Click on any color or class name to copy it to your
      clipboard for quick implementation.
     </p>
    </div>
   </div>
  </div>
 </div>
</div>
