<script lang="ts">
	let {
		title,
		name,
		checked = $bindable(false),
		required = false,
		type = 'on/off',
	}: {
		title: string;
		name: string;
		checked?: boolean;
		required?: boolean;
		type?: 'y/n' | 'on/off';
	} = $props();
</script>

<div class="p-2">
	<label class="flex items-center relative w-max cursor-pointer select-none relative">
		{#if title}
			<span class="font-bold mr-3">
				{title}
			</span>
		{/if}

		<input
			{required}
			{name}
			type="checkbox"
			class="appearance-none transition-colors cursor-pointer w-14 h-7 rounded-full focus:outline-none {checked
				? 'bg-[#3dff56]'
				: 'bg-[#FE6152]'}"
			bind:checked
		/>
		<span class="absolute font-medium uppercase text-.5rem right-1 text-black">
			{type === 'y/n' ? 'no' : 'off'}
		</span>
		<span class="absolute font-medium uppercase text-.5rem right-9 text-black"
			>{type === 'y/n' ? 'yes' : 'on'}
		</span>
		<span
			class="w-6 h-6 right-7.2 absolute rounded-full transition ease-in-out duration-.15s bg-neutral-100 {checked
				? 'translate-x-6.4'
				: ''}"
		></span>
	</label>
</div>
