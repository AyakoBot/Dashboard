<script lang="ts">
	const {
		required = false,
		maxLen,
		minLen,
		maxVal,
		minVal,
		val,
		type = 'text',
		label,
		id = Math.random().toString(36).substring(7),
		size,
		onupdate,
	}: {
		required: boolean;
		type?: 'text' | 'number' | 'email' | 'password';
		maxLen?: number;
		minLen?: number;
		maxVal?: number;
		minVal?: number;
		val?: string;
		label: string;
		id?: string;
		size?: 'short' | 'paragraph';
		onupdate?: (v: string | number | null) => void;
	} = $props();

	let value: string | number | null = $state(val || null);
	let queued = false;

	const update = () => {
		if (queued) return;
		queued = true;

		setTimeout(() => {
			queued = false;
			onupdate?.(value);
		}, 500);
	};

	const validateNumberInput = (event: Event) => {
		const input = event.target as HTMLInputElement;
		if (maxVal !== undefined && parseFloat(input.value) > maxVal) {
			input.value = maxVal.toString();
		}
		update();
	};
</script>

<div {id} class="cursor-pointer">
	<div class="bg-neutral-900 w-full rounded-md px-2 py-2 relative text-left">
		{#if size === 'paragraph'}
			<textarea
				maxlength={maxLen}
				minlength={minLen}
				{required}
				bind:value
				id={id}
				tabindex="-1"
				class="bg-transparent w-full"
				oninput={() => update()}
			></textarea>
		{:else}
			<input
				{type}
				maxlength={maxLen}
				minlength={minLen}
				max={maxVal}
				min={minVal}
				{required}
				bind:value
				id={id}
				tabindex="-1"
				class="bg-transparent w-full"
				oninput={type === 'number' ? validateNumberInput : update}
			/>
		{/if}

		<label
			for={id}
			class="color-neutral-500 absolute left-2"
			class:hidden={value && String(value)?.length}
		>
			{label}
		</label>
	</div>

	{#if required && !String(value)?.length}
		<div class="color-red-500 text-2.5">This must have a value</div>
	{/if}
</div>
