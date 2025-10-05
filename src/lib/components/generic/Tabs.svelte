<script lang="ts">
 import clsx from 'clsx';
 import { type Snippet } from 'svelte';

 interface Tab {
 id: string;
 label: string;
 icon?: string;
 badge?: number;
 content: Snippet;
 }

 interface TabsProps {
 tabs: Tab[];
 defaultTab?: string;
 variant?: 'default' | 'pills' | 'underline' | 'glass';
 fullWidth?: boolean;
 class?: string;
 }

 const {
 tabs,
 defaultTab,
 variant = 'default',
 fullWidth = false,
 class: className = '',
 }: TabsProps = $props();

 let activeTab = $state(defaultTab || tabs[0]?.id || '');

 const tabListClasses = clsx(
 'flex gap-2 mb-6',
 fullWidth && 'w-full',
 variant === 'underline' && 'border-b border-white/10',
 variant === 'glass' && 'p-1 glass rounded-lg',
 className
 );

 const getTabClasses = (tabId: string) => {
 const isActive = activeTab === tabId;
 
 return clsx(
  'relative flex items-center gap-2 px-4 py-2 font-medium transition-all duration-200',
  'focus:outline-none focus:ring-2 focus:ring-primary-500/30',
  fullWidth && 'flex-1 justify-center',
  
  variant === 'default' && [
  'rounded-lg',
  isActive 
   ? 'bg-primary-500 text-white shadow-lg' 
   : 'text-muted-text hover:text-main-text hover:bg-white/5',
  ],
  
  variant === 'pills' && [
  'rounded-full',
  isActive
   ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg'
   : 'text-muted-text hover:text-main-text hover:bg-white/5',
  ],
  
  variant === 'underline' && [
  'pb-4',
  isActive
   ? 'text-primary-400'
   : 'text-muted-text hover:text-main-text',
  ],
  
  variant === 'glass' && [
  'rounded-md',
  isActive
   ? 'bg-white/10 text-main-text'
   : 'text-muted-text hover:text-main-text hover:bg-white/5',
  ]
 );
 };

 const indicatorStyle = $derived.by(() => {
 if (variant !== 'underline') return '';
 
 const tabIndex = tabs.findIndex(tab => tab.id === activeTab);
 const tabWidth = 100 / tabs.length;
 const translateX = tabIndex * tabWidth;
 
 return `width: ${tabWidth}%; transform: translateX(${translateX}%);`;
 });
</script>

<div class="w-full">
 <div class={tabListClasses} role="tablist">
 {#each tabs as tab}
  <button
  role="tab"
  aria-selected={activeTab === tab.id}
  aria-controls={`panel-${tab.id}`}
  class={getTabClasses(tab.id)}
  onclick={() => activeTab = tab.id}
  >
  {#if tab.icon}
   <span class={clsx(tab.icon, 'text-lg')}></span>
  {/if}
  
  {tab.label}
  
  {#if tab.badge}
   <span 
   class={clsx(
    'ml-2 px-1.5 py-0.5 text-xs rounded-full',
    'bg-danger text-white font-bold'
   )}
   >
   {tab.badge}
   </span>
  {/if}
  </button>
 {/each}
 
 {#if variant === 'underline'}
  <div 
  class="absolute bottom-0 h-0.5 bg-primary-500 transition-all duration-300"
  style={indicatorStyle}
  ></div>
 {/if}
 </div>

 <div class="animate-fade-in">
 {#each tabs as tab}
  <div
  id={`panel-${tab.id}`}
  role="tabpanel"
  aria-labelledby={tab.id}
  class={clsx(
   'transition-all duration-300',
   activeTab === tab.id ? 'block' : 'hidden'
  )}
  >
  {@render tab.content()}
  </div>
 {/each}
 </div>
</div>