<script>
	import Button from '$lib/components/generic/Button.svelte';
	import Modal from '$lib/components/generic/Modal.svelte';
	import NumberInput from '$lib/components/generic/NumberInput.svelte';
	import Select from '$lib/components/generic/Select.svelte';
	import TextInput from '$lib/components/generic/TextInput.svelte';

	let showModal = $state(false);
</script>

<section class="mx-5">
	<h1 class="text-3xl font-bold mt-2">Modal</h1>
	<Button width="fit" text="Open Modal" onclick={() => (showModal = true)} />

	{#if showModal}
		<Modal author="Author" close={() => (showModal = false)}>
			This is a Modal
			<div
				class="absolute bottom-0 right-0 w-full bg-main-pre-darkest
   flex flex-row justify-end items-center gap-2 h-15 border-t-solid border-main-dark border-0.01px"
			>
				<button class="btn-success! mt-10 mr-5 mb-10" type="submit">Submit</button>
				<button class="btn-danger! mt-10 mr-5 mb-10" onclick={() => (showModal = false)}>Cancel</button>
			</div>
		</Modal>
	{/if}

	<h1 class="text-3xl font-bold mt-2">Buttons</h1>

	<div class="mt-2 flex flex-row justify-evenly items-start gap-5">
		{#each [0, 1] as color}
			<div
				class="w-full flex flex-col justify-start items-center p-5 gap-2 rounded-md"
				class:bg-main-darkest={!color}
				class:bg-fake-white={!!color}
			>
				<Button width="full" text="Primary - Filled" />
				<Button width="full" text="Primary - Filled - Disabled" disabled={true} />
				<Button width="full" style="primary-outline" text="Primary - Outlined" />
				<Button
					width="full"
					style="primary-outline"
					text="Primary - Outlined - Disabled"
					disabled={true}
				/>

				<Button width="full" style="inverted-white" text="Inverted - Filled" />
				<Button
					width="full"
					style="inverted-white"
					text="Inverted - Filled - Disabled"
					disabled={true}
				/>

				<Button width="full" style="red" text="Red - Filled" />
				<Button width="full" style="red" text="Red - Filled - Disabled" disabled={true} />
				<Button width="full" style="red-outline" text="Red - Outlined" />
				<Button width="full" style="red-outline" text="Red - Outlined - Disabled" disabled={true} />

				<Button width="full" style="green" text="Green - Filled" />
				<Button width="full" style="green" text="Green - Filled - Disabled" disabled={true} />
				<Button width="full" style="green-outline" text="Green - Outlined" />
				<Button width="full" style="green-outline" text="Green - Outlined - Disabled" disabled={true} />

				<Button width="full" style="secondary" text="Secondary - Filled" />
				<Button width="full" style="secondary" text="Secondary - Filled - Disabled" disabled={true} />
				<Button width="full" style="secondary-outline" text="Secondary - Outlined" />
				<Button
					width="full"
					style="secondary-outline"
					text="Secondary - Outlined - Disabled"
					disabled={true}
				/>

				<Button width="full" style="link" text="Link - Filled" />
				<Button width="full" style="link" text="Link - Filled - Disabled" disabled={true} />
				<Button width="full" style="link-outline" text="Link - Outlined" />
				<Button width="full" style="link-outline" text="Link - Outlined - Disabled" disabled={true} />
			</div>
		{/each}
	</div>

	<div class="mt-2 flex flex-row justify-evenly items-start gap-5">
		{#each [0, 1] as color}
			<div
				class="w-full flex flex-col justify-start items-center p-5 gap-2 rounded-md"
				class:bg-main-darkest={!color}
				class:bg-fake-white={!!color}
			>
				<Button width="full" text="Tiny" height="tiny" />
				<Button width="full" text="Small" height="small" />
				<Button width="full" text="Medium" height="medium" />
				<Button width="full" text="Large" height="large" />
				<Button width="full" text="Min" height="min" />
				<Button width="full" text="Max" height="max" />
				<Button width="full" text="Icon" height="icon" />
			</div>
		{/each}
	</div>

	<div class="flex flex-col justify-center items-start gap-2 mt-2">
		<Button width="fit" text="Tiny" height="tiny" />
		<Button width="fit" text="Small" height="small" />
		<Button width="fit" text="Medium" height="medium" />
		<Button width="fit" text="Large" height="large" />
	</div>

	<h1 class="text-3xl font-bold mt-5">Select</h1>

	<div class="mt-2">
		<Select
			options={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(String)}
			maxOpts={1}
			minOpts={1}
			required={true}
			label="Single Required"
		/>
	</div>

	<div class="mt-2">
		<Select
			options={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(String)}
			maxOpts={1}
			minOpts={1}
			required={false}
			label="Single Optional"
		/>

		<div class="mt-2">
			<Select
				options={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(String)}
				maxOpts={2}
				minOpts={5}
				required={true}
				label="Multi Required"
			/>
		</div>

		<div class="mt-2">
			<Select
				options={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(String)}
				maxOpts={2}
				minOpts={5}
				required={false}
				label="Multi Optional"
			/>
		</div>

		<h1 class="text-3xl font-bold mt-5">Searchable Select</h1>

		<div class="mt-2">
			<Select
				options={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(String)}
				maxOpts={1}
				minOpts={1}
				required={true}
				label="Single Required"
				searchable={true}
			/>
		</div>

		<div class="mt-2">
			<Select
				options={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(String)}
				maxOpts={1}
				minOpts={1}
				required={false}
				label="Single Optional"
				searchable={true}
			/>

			<div class="mt-2">
				<Select
					options={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(String)}
					maxOpts={2}
					minOpts={5}
					required={true}
					label="Multi Required"
					searchable={true}
				/>
			</div>

			<div class="mt-2">
				<Select
					options={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(String)}
					maxOpts={2}
					minOpts={5}
					required={false}
					label="Multi Optional"
					searchable={true}
				/>
			</div>

			<h1 class="text-3xl font-bold mt-5">Input</h1>

			<div class="mt-2">
				<TextInput required={true} label="Text Required" size="paragraph" />
			</div>

			<div class="mt-2">
				<TextInput required={false} label="Text Optional" />
			</div>

			<div class="mt-2">
				<NumberInput required={true} label="Number Required" maxLen={4} maxVal={998} minVal={0} />
			</div>
		</div>
		<br />
		<br />
		<br />
		<br />
		<br />
	</div>
</section>
