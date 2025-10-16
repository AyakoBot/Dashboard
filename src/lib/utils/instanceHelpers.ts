import type {
 SettingValue,
 SettingField,
 SettingInstance,
 ValidationRule
} from '../types/settings.js';

export const generateInstanceId = (): string => crypto.randomUUID();

export const createEmptyInstance = (fields: SettingField[]): SettingInstance => ({
 id: generateInstanceId(),
 values: fields.reduce(
  (acc, field) => {
   acc[field.name] = null;
   return acc;
  },
  {} as Record<string, SettingValue>
 ),
 isNew: true,
 isEditing: true
});

export const validateField = (value: SettingValue, field: SettingField): string | null => {
 if (!field.validation) return null;

 for (const rule of field.validation) {
  switch (rule.type) {
   case 'required':
    if (!value && value !== 0 && value !== false) return rule.message;
    break;

   case 'min':
    if (typeof value === 'number' && typeof rule.value === 'number' && value < rule.value) {
     return rule.message;
    }
    if (typeof value === 'string' && typeof rule.value === 'number' && value.length < rule.value) {
     return rule.message;
    }
    break;

   case 'max':
    if (typeof value === 'number' && typeof rule.value === 'number' && value > rule.value) {
     return rule.message;
    }
    if (typeof value === 'string' && typeof rule.value === 'number' && value.length > rule.value) {
     return rule.message;
    }
    break;

   case 'pattern':
    if (typeof value === 'string' && rule.value instanceof RegExp) {
     if (!rule.value.test(value)) return rule.message;
    }
    break;

   case 'custom':
    if (rule.validator && !rule.validator(value)) return rule.message;
    break;
  }
 }

 return null;
};

export const validateInstance = (
 instance: SettingInstance,
 fields: SettingField[]
): Record<string, string> => {
 const errors: Record<string, string> = {};

 for (const field of fields) {
  const error = validateField(instance.values[field.name], field);
  if (error) errors[field.name] = error;
 }

 return errors;
};

export const cloneInstance = (instance: SettingInstance): SettingInstance => ({
 id: generateInstanceId(),
 values: { ...instance.values },
 isNew: true,
 isEditing: true
});

export const formatInstanceSummary = (
 instance: SettingInstance,
 fields: SettingField[],
 maxFields: number = 2
): string => {
 const summaryFields = fields.slice(0, maxFields);
 const parts = summaryFields
  .map((field) => {
   const value = instance.values[field.name];
   if (!value && value !== 0 && value !== false) return null;
   const displayValue = Array.isArray(value) ? value.join(', ') : String(value);
   return `${field.name}: ${displayValue}`;
  })
  .filter(Boolean);

 return parts.length > 0 ? parts.join(' • ') : 'No data';
};
