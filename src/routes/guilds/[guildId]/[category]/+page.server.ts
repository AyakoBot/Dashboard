import { error } from '@sveltejs/kit';
import type { GETBotSettings } from '$lib/scripts/index.js';
import type { PageServerLoad } from './$types';

type FormFieldValue = string | number | boolean | null;
type FormData = Record<string, FormFieldValue>;

const kebabCase = (str: string): string => {
 if (str === null || str === undefined) return '';
 if (typeof str !== 'string') {
  return String(str || '')
   .toLowerCase()
   .replace(/\s+/g, '-');
 }
 return str.toLowerCase().replace(/\s+/g, '-');
};

const parseCategory = (categoryParam: string): { category: string; name: string } => {
 const parts = categoryParam.split('-');
 const category = parts[0];
 const name = parts.slice(1).join('-');
 return { category, name };
};

const findSetting = (settings: GETBotSettings, categoryParam: string) => {
 // Check if this is category-id format (contains hyphen)
 if (categoryParam.includes('-')) {
  const { category, name } = parseCategory(categoryParam);
  // Match by category and ID (not name, since multiple settings can share the same name)
  const byCategoryId = settings.find(
   (s) => kebabCase(s.category || 'General') === category && kebabCase(s.id) === name
  );
  if (byCategoryId) return byCategoryId;
 }

 // Fallback: try matching by ID only (for settings with unique IDs)
 const byId = settings.find((s) => kebabCase(s.id) === categoryParam);
 if (byId) {
  // Check if this ID is unique - if multiple settings share it, require category-id format
  const duplicates = settings.filter((s) => kebabCase(s.id) === categoryParam);
  if (duplicates.length > 1) return null;
  return byId;
 }

 return null;
};

const makeApiRequest = async <T = unknown>(
 path: string,
 fetch: typeof globalThis.fetch
): Promise<T> => {
 const response = await fetch('/api', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ method: 'GET', path })
 }).catch(() => null);

 if (!response?.ok) error(response?.status || 500, 'Failed to load data');
 return response.json() as Promise<T>;
};

const extractFieldValues = (
 setting: GETBotSettings[0],
 settingData: Array<Record<string, FormFieldValue>>
): FormData =>
 setting.fields.reduce((acc, field) => {
  const fieldKey = field.id || field.name;
  if (settingData && settingData[0]) {
   acc[field.name] = settingData[0][fieldKey] ?? '';
  } else {
   acc[field.name] = '';
  }
  return acc;
 }, {} as FormData);

export const load: PageServerLoad = async ({ params, fetch, cookies }) => {
 const token = cookies.get('discord-token');
 if (!token) error(401, 'Authentication required');

 const settings = await makeApiRequest<GETBotSettings>(
  `/bot/settings?guildId=${params.guildId}`,
  fetch
 );

 const currentSetting = findSetting(settings, params.category);
 if (!currentSetting) error(404, `Setting not found: ${params.category}`);

 // Determine the correct setting name for API calls
 // Special case: settings with id='basic' are subcommands in groups
 // For grouped 'basic' (leveling/basic, appeals/basic), use the group name (category)
 // For top-level 'basic', use 'basic'
 // For all other settings, use the ID
 const isBasicInGroup =
  currentSetting.id === 'basic' &&
  currentSetting.category &&
  !['Basic', 'General'].includes(currentSetting.category);

 const settingName = isBasicInGroup ? kebabCase(currentSetting.category!) : currentSetting.id;

 if (currentSetting.isMulti) {
  const instances = await makeApiRequest<Array<Record<string, FormFieldValue>>>(
   `/guilds/${params.guildId}/settings/${settingName}`,
   fetch
  );
  return {
   type: 'multi' as const,
   setting: currentSetting,
   instances,
   guildId: params.guildId
  };
 }

 const settingData = await makeApiRequest<Array<Record<string, FormFieldValue>>>(
  `/guilds/${params.guildId}/settings/${settingName}`,
  fetch
 );
 const initialData = extractFieldValues(currentSetting, settingData);

 return {
  type: 'single' as const,
  setting: currentSetting,
  values: initialData,
  guildId: params.guildId
 };
};
