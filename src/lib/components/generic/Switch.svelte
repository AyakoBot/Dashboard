<script lang="ts">
	let {
		title,
		name,
		checked = $bindable(false),
		required = false,
		type = 'on/off',
		disabled = false,
	}: {
		title: string;
		name: string;
		checked?: boolean;
		required?: boolean;
		type?: 'y/n' | 'on/off';
		disabled?: boolean;
	} = $props();
</script>

<div class="py-2 {disabled ? 'cursor-not-allowed op-60' : ''}">
	<label
		class="flex items-center relative w-max cursor-pointer select-none relative
 {disabled ? 'cursor-not-allowed' : ''}"
	>
		{#if title}
			<span class="mr-3">
				{title}
			</span>
		{/if}

		<input
			{disabled}
			{required}
			{name}
			type="checkbox"
			class="appearance-none transition-colors cursor-pointer w-14 h-7 rounded-full focus:outline-none
   {checked ? 'bg-check-checked' : 'bg-check-unchecked'}
    {disabled ? 'cursor-not-allowed!' : ''}"
			bind:checked
		/>
		<span
			class="absolute font-medium uppercase text-10px right-2 top-1.6
   {checked ? 'text-main-text' : 'text-black'} 
   {disabled ? 'cursor-not-allowed' : ''}"
		>
			{type === 'y/n' ? 'no' : 'off'}
		</span>
		<span
			class="absolute font-medium uppercase text-10px right-8 top-1.6
   {checked ? 'text-main-text' : 'text-black'} 
   {disabled ? 'cursor-not-allowed' : ''}"
			>{type === 'y/n' ? 'yes' : 'on'}
		</span>
		<span
			class="w-6 h-6 right-7.2 absolute rounded-full transition ease-in-out duration-.15s bg-neutral-100
   {checked ? 'translate-x-6.4' : ''}
   {disabled ? 'cursor-not-allowed' : ''}"
		></span>
	</label>
</div>
