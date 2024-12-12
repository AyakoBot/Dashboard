<script>
	import Button from '$lib/components/generic/Button.svelte';
</script>

<section class="mx-5">
	<h1 class="text-3xl font-bold mt-2">Buttons</h1>

	<div class="mt-2 flex flex-row justify-evenly items-start gap-5">
		{#each [0, 1] as color}
			<div
				class="{color === 0 ? 'bg-main-darkest' : 'bg-fake-white'}
     w-full flex flex-col justify-start items-center p-5 gap-2 rounded-md"
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
				class="{color === 0 ? 'bg-main-darkest' : 'bg-fake-white'} 
    w-full flex flex-col justify-start items-center p-5 gap-2 rounded-md"
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

	<h1 class="text-3xl font-bold">Searchable Select</h1>
</section>
