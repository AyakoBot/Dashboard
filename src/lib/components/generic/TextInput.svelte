<script lang="ts">
 import Input from './Input.svelte';

 const {
 required = false,
 type = 'text',
 size = 'short',
 maxLen,
 minLen,
 value,
 label,
 id,
 onupdate,
 }: {
 required: boolean;
 type?: 'text' | 'number' | 'email' | 'password';
 size?: 'short' | 'paragraph';
 maxLen?: number;
 minLen?: number;
 value?: string;
 label: string;
 id?: string;
 onupdate?: (v: string | null) => void;
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
 onupdate={(val) => onupdate?.(val ? String(val) : null)}
 {size}
/>
