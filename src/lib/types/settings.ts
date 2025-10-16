import type { EditorTypes } from '$lib/scripts/index.js';

export type SettingValue = string | number | boolean | string[] | null;

export interface SettingInstance {
 id: string;
 values: Record<string, SettingValue>;
 errors?: Record<string, string>;
 isNew?: boolean;
 isEditing?: boolean;
}

export interface ValidationRule {
 type: 'required' | 'min' | 'max' | 'pattern' | 'custom';
 value?: number | string | RegExp;
 message: string;
 validator?: (value: SettingValue) => boolean;
}

export interface SettingField {
 name: string;
 type: EditorTypes;
 description: string;
 id?: string;
 required?: boolean;
 validation?: ValidationRule[];
}

export interface SaveInstanceResponse {
 success: boolean;
 data?: SettingInstance;
 error?: string;
}

export interface DeleteInstanceResponse {
 success: boolean;
 error?: string;
}
