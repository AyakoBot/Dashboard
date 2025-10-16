<script lang="ts">
 import Switch from '$lib/components/generic/Switch.svelte';
 import NumberInput from '$lib/components/generic/NumberInput.svelte';
 import Select from '$lib/components/generic/Select.svelte';
 import { renderMarkdown } from '$lib/utils/markdown.js';
 import { sortChannelsByPosition } from '$lib/utils/discord.js';
 import makeRequest from '$lib/scripts/util/makeRequest.js';
 import en from '@ayako/bot/src/Languages/en-GB.json' with { type: 'json' };
 import type { RRole } from '@ayako/gateway/src/BaseClient/Bot/CacheClasses/role';
 import type { RUser } from '@ayako/gateway/src/BaseClient/Bot/CacheClasses/user';
 import type { RChannel } from '@ayako/gateway/src/BaseClient/Bot/CacheClasses/channel';

 type EditorTypeValue =
  | 'channel'
  | 'channels'
  | 'role'
  | 'roles'
  | 'user'
  | 'users'
  | 'mention'
  | 'mentions'
  | 'boolean'
  | 'duration'
  | 'string'
  | 'language'
  | 'number'
  | 'punishment'
  | 'antiraid-punishment'
  | 'embed'
  | 'token'
  | 'bot-token'
  | 'message'
  | 'shoptype'
  | 'formulatype'
  | 'emote'
  | 'emotes'
  | 'command'
  | 'automodrules'
  | 'settinglink'
  | 'auto-punishment'
  | 'lvlupmode'
  | 'strings'
  | 'question-type'
  | 'category'
  | 'voice'
  | 'permission'
  | 'rolemode'
  | 'commands'
  | 'questions'
  | 'position'
  | 'thread-archive-time'
  | 'weekends-type'
  | 'ticketing-type';

 interface Props {
  field: { type: EditorTypeValue; name: string; description: string; id?: string };
  value?: any;
  onchange?: (value: any) => void;
  guildId?: string;
 }

 let { field, value = $bindable(), onchange, guildId }: Props = $props();

 const handleValueChange = (newValue: any) => {
  value = newValue;
  onchange?.(newValue);
 };

 let channels = $state<RChannel[]>([]);
 let roles = $state<RRole[]>([]);
 let users = $state<RUser[]>([]);
 let isLoadingOptions = $state(false);

 const needsChannelData = $derived(['channel', 'channels', 'voice', 'category'].includes(field.type));
 const needsRoleData = $derived(['role', 'roles'].includes(field.type));
 const needsUserData = $derived(['user', 'users', 'mention', 'mentions'].includes(field.type));

 $effect(() => {
  if (!guildId) return;

  const fetchData = async () => {
   isLoadingOptions = true;

   if (needsChannelData) {
    const result = await makeRequest(
     { method: 'GET', path: '/guilds/:guildId/channels' },
     { guildId },
     fetch
    );
    if (result && Array.isArray(result)) {
     channels = result;
    }
   }

   if (needsRoleData) {
    const result = await makeRequest(
     { method: 'GET', path: '/guilds/:guildId/roles' },
     { guildId },
     fetch
    );
    if (result && Array.isArray(result)) {
     roles = result;
    }
   }

   if (needsUserData) {
    users = [];
   }

   isLoadingOptions = false;
  };

  fetchData();
 });

 type InputMode = 'boolean' | 'text' | 'number' | 'textarea' | 'select' | 'discord-select';

 const getInputMode = (type: EditorTypeValue): InputMode => {
  if (type === 'boolean') return 'boolean';
  if (type === 'number') return 'number';
  if (type === 'message' || type === 'strings' || type === 'embed') return 'textarea';

  if (['channel', 'channels', 'role', 'roles', 'user', 'users', 'mention', 'mentions', 'voice', 'category'].includes(type)) {
   return 'discord-select';
  }

  const selectTypes: EditorTypeValue[] = [
   'language',
   'rolemode',
   'punishment',
   'antiraid-punishment',
   'auto-punishment',
   'shoptype',
   'formulatype',
   'lvlupmode',
   'question-type',
   'ticketing-type',
   'weekends-type',
   'permission',
   'thread-archive-time'
  ];

  if (selectTypes.includes(type)) return 'select';

  return 'text';
 };

 const isMultiSelect = (type: EditorTypeValue): boolean =>
  ['channels', 'roles', 'users', 'mentions', 'emotes', 'commands', 'strings', 'questions'].includes(
   type
  );

 const getSelectOptions = (type: EditorTypeValue): string[] => {
  if (type === 'language') return Object.keys(en.languages);
  if (type === 'rolemode') return Object.keys(en.rolemodes);
  if (type === 'punishment' || type === 'antiraid-punishment' || type === 'auto-punishment')
   return Object.keys(en.punishments);
  if (type === 'permission') return Object.keys(en.permissions.perms);
  if (type === 'thread-archive-time') return Object.keys(en.threadAutoArchiveDurations);
  if (type === 'weekends-type') return Object.keys(en.weekendstype);
  if (type === 'shoptype') return Object.keys(en.shoptypes);
  if (type === 'formulatype') return Object.keys(en.formulatypes);
  if (type === 'lvlupmode') return Object.keys(en.lvlupmodes);
  if (type === 'ticketing-type') return Object.keys(en.ticketingtype);
  if (type === 'question-type') return Object.keys(en.answertypes);

  return [];
 };

 const getOptionLabel = (type: EditorTypeValue, key: string): string => {
  if (type === 'language') return (en.languages as Record<string, string>)[key] || key;
  if (type === 'rolemode') return (en.rolemodes as Record<string, string>)[key] || key;
  if (type === 'punishment' || type === 'antiraid-punishment' || type === 'auto-punishment')
   return (en.punishments as Record<string, string>)[key] || key;
  if (type === 'permission') return (en.permissions.perms as Record<string, string>)[key] || key;
  if (type === 'thread-archive-time')
   return (en.threadAutoArchiveDurations as Record<string, string>)[key] || key;
  if (type === 'weekends-type') return (en.weekendstype as Record<string, string>)[key] || key;
  if (type === 'shoptype') return (en.shoptypes as Record<string, string>)[key] || key;
  if (type === 'formulatype') return (en.formulatypes as Record<string, string>)[key] || key;
  if (type === 'lvlupmode') return (en.lvlupmodes as Record<string, string>)[key] || key;
  if (type === 'ticketing-type') return (en.ticketingtype as Record<string, string>)[key] || key;
  if (type === 'question-type') return (en.answertypes as Record<string, string>)[key] || key;

  return key;
 };

 const inputMode = $derived(getInputMode(field.type));
 const isMulti = $derived(isMultiSelect(field.type));
 const selectOptions = $derived(getSelectOptions(field.type));

 const selectOptionsFormatted = $derived(
  selectOptions.map((key) => ({
   key,
   label: getOptionLabel(field.type, key)
  }))
 );

 const selectOptionsStrings = $derived(
  selectOptionsFormatted.map((opt) => `${opt.key}|||${opt.label}`)
 );

 const selectValue = $derived.by(() => {
  if (inputMode !== 'select') return [];

  if (Array.isArray(value)) {
   return value.map((v: any) => {
    const opt = selectOptionsFormatted.find((o) => o.key === v);
    return opt ? `${opt.key}|||${opt.label}` : v;
   });
  }

  if (value) {
   const opt = selectOptionsFormatted.find((o) => o.key === value);
   return opt ? [`${opt.key}|||${opt.label}`] : [];
  }

  return [];
 });

 let selectValueBindable = $state<string[]>([]);
 let previousSelectValue: any = $state(undefined);

 $effect(() => {
  if (!isLoadingOptions && value !== previousSelectValue) {
   selectValueBindable = selectValue;
   previousSelectValue = value;
  }
 });

 const handleSelectChange = (newValue: string[]) => {
  const extractedValues = newValue.map((v) => v.split('|||')[0]);
  if (isMulti) {
   handleValueChange(extractedValues);
  } else {
   handleValueChange(extractedValues[0] || null);
  }
 };

 const CHANNEL_TYPE_FILTERS: Record<string, number[]> = {
  channel: [0, 2, 5, 10, 11, 12, 13],
  channels: [0, 2, 5, 10, 11, 12, 13],
  voice: [2, 13],
  category: [4]
 };

 const getDiscordEntities = $derived.by(() => {
  if (field.type === 'channel' || field.type === 'channels' || field.type === 'voice' || field.type === 'category') {
   const allowedTypes = CHANNEL_TYPE_FILTERS[field.type] || [];
   const sorted = sortChannelsByPosition(channels);
   const filtered = sorted.filter((c) => allowedTypes.includes(c.type));

   const topLevel: typeof filtered = [];
   const children: typeof filtered = [];

   for (const channel of filtered) {
    if (!channel.parent_id) {
     topLevel.push(channel);
    } else {
     children.push(channel);
    }
   }

   return [...topLevel, ...children];
  }
  if (field.type === 'role' || field.type === 'roles') {
   return roles;
  }
  if (field.type === 'user' || field.type === 'users') {
   return users;
  }
  if (field.type === 'mention' || field.type === 'mentions') {
   return [...sortChannelsByPosition(channels), ...roles, ...users];
  }
  return [];
 });

 const getDiscordSelectType = $derived(() => {
  if (field.type === 'channel' || field.type === 'channels' || field.type === 'voice' || field.type === 'category') {
   return 'Channel';
  }
  if (field.type === 'role' || field.type === 'roles') {
   return 'Role';
  }
  if (field.type === 'user' || field.type === 'users' || field.type === 'mention' || field.type === 'mentions') {
   return 'User';
  }
  return 'string';
 });

 const discordSelectedOptions = $derived.by(() => {
  if (inputMode !== 'discord-select' || !value) return [];

  const ids = Array.isArray(value) ? value : [value];
  const entities = getDiscordEntities;

  return ids.map(id => entities.find((e: any) => e.id === id)).filter(Boolean);
 });

 let discordSelectedBindable = $state<any[]>([]);
 let previousValue: any = $state(undefined);

 $effect(() => {
  if (!isLoadingOptions && value !== previousValue) {
   discordSelectedBindable = discordSelectedOptions;
   previousValue = value;
  }
 });

 const handleDiscordSelectChange = (newValue: any[]) => {
  const ids = newValue.map((entity: any) => entity.id);
  if (isMulti) {
   handleValueChange(ids);
  } else {
   handleValueChange(ids[0] || null);
  }
 };

 const renderedName = $derived(renderMarkdown(field.name));
 const renderedDescription = $derived(field.description ? renderMarkdown(field.description) : '');
</script>

<div class="space-y-2">
 {#if inputMode === 'boolean'}
  <Switch
   title={field.name}
   description={field.description}
   name={field.name}
   checked={value ?? false}
   onchange={handleValueChange}
   size="md"
  />
 {:else if inputMode === 'number'}
  <NumberInput
   label={field.name}
   required={true}
   value={value ? String(value) : ''}
   onupdate={(v) => handleValueChange(v)}
   id={field.id || field.name}
   minVal={0}
  />
  {#if field.description}
   <div class="text-xs text-white/50 max-w-none markdown-content">
    {@html renderedDescription}
   </div>
  {/if}
 {:else if inputMode === 'textarea'}
  <label class="block text-sm font-medium text-white markdown-content" for={field.name}>
   {@html renderedName}
  </label>

  {#if field.description}
   <div class="text-xs text-white/50 max-w-none markdown-content">
    {@html renderedDescription}
   </div>
  {/if}

  <textarea
   id={field.name}
   name={field.name}
   value={value ?? ''}
   oninput={(e) => handleValueChange(e.currentTarget.value)}
   rows="4"
   class="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-vertical"
   placeholder="Enter {field.name.toLowerCase()}..."
  ></textarea>
 {:else if inputMode === 'discord-select'}
  <label class="block text-sm font-medium text-white markdown-content" for={field.name}>
   {@html renderedName}
  </label>

  {#if field.description}
   <div class="text-xs text-white/50 max-w-none markdown-content">
    {@html renderedDescription}
   </div>
  {/if}

  {#if isLoadingOptions}
   <div class="text-sm text-white/60">Loading options...</div>
  {:else}
   <Select
    type={getDiscordSelectType}
    options={getDiscordEntities}
    maxOpts={isMulti ? 999 : 1}
    minOpts={0}
    required={true}
    label={field.name}
    id={field.id || field.name}
    bind:selectedOptions={discordSelectedBindable}
    onupdate={handleDiscordSelectChange}
   />
  {/if}
 {:else if inputMode === 'select'}
  <label class="block text-sm font-medium text-white markdown-content" for={field.name}>
   {@html renderedName}
  </label>

  {#if field.description}
   <div class="text-xs text-white/50 max-w-none markdown-content">
    {@html renderedDescription}
   </div>
  {/if}

  {#if isLoadingOptions}
   <div class="text-sm text-white/60">Loading options...</div>
  {:else}
   <Select
    type="string"
    options={selectOptionsStrings}
    maxOpts={isMulti ? 999 : 1}
    minOpts={0}
    required={true}
    label={field.name}
    id={field.id || field.name}
    bind:selectedOptions={selectValueBindable}
    onupdate={handleSelectChange}
   />
  {/if}
 {:else}
  <label class="block text-sm font-medium text-white markdown-content" for={field.name}>
   {@html renderedName}
  </label>

  {#if field.description}
   <div class="text-xs text-white/50 max-w-none markdown-content">
    {@html renderedDescription}
   </div>
  {/if}

  <input
   id={field.id || field.name}
   name={field.id || field.name}
   type="text"
   value={value ?? ''}
   oninput={(e) => handleValueChange(e.currentTarget.value)}
   class="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
   placeholder="Enter {field.name.toLowerCase()}..."
  />
 {/if}
</div>

<style>
 label.markdown-content :global(p) {
  display: inline;
  margin: 0;
 }

 div.markdown-content :global(ol) {
  list-style-type: decimal;
  margin-left: 1rem;
  padding-left: 0.5rem;
 }

 div.markdown-content :global(ul) {
  list-style-type: disc;
  margin-left: 1rem;
  padding-left: 0.5rem;
 }

 div.markdown-content :global(li) {
  margin: 0.25rem 0;
 }

 div.markdown-content :global(p) {
  margin: 0.5rem 0;
 }

 :global(.markdown-content strong) {
  font-weight: 600;
 }

 :global(.markdown-content em) {
  font-style: italic;
 }

 :global(.markdown-content code) {
  background: rgba(255, 255, 255, 0.1);
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  font-family: monospace;
  font-size: 0.875em;
 }

 :global(.markdown-content a) {
  text-decoration: underline;
  text-decoration-color: rgba(255, 255, 255, 0.3);
  text-underline-offset: 2px;
 }

 :global(.markdown-content a:hover) {
  text-decoration-color: currentColor;
 }

 :global(.markdown-content small) {
  font-size: 0.75rem;
  opacity: 0.75;
 }
</style>
