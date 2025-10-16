<script lang="ts">
 import Input from './Input.svelte';

 const {
  required = false,
  type = 'number',
  maxLen,
  minLen,
  maxVal,
  minVal,
  value,
  label,
  id,
  onupdate
 }: {
  required: boolean;
  type?: 'text' | 'number' | 'email' | 'password';
  maxLen?: number;
  minLen?: number;
  maxVal?: number;
  minVal?: number;
  value?: string;
  label: string;
  id?: string;
  onupdate?: (v: number | null) => void;
 } = $props();
</script>

<Input
 {type}
 {required}
 {label}
 {maxLen}
 {minLen}
 {value}
 {id}
 {maxVal}
 {minVal}
 onupdate={(val) => onupdate?.(val ? Number(val) : null)}
/>
