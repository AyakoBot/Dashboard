<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/generic/Button.svelte';
	import DateInput from '$lib/components/generic/DateInput.svelte';
	import ExplainBox from '$lib/components/generic/ExplainBox.svelte';
	import Modal from '$lib/components/generic/Modal.svelte';
	import TextInput from '$lib/components/generic/TextInput.svelte';
	import TimeInput from '$lib/components/generic/TimeInput.svelte';
	import Reminder from '$lib/components/layout/@me/reminder/Reminder.svelte';
	import type { PageServerData } from './$types';

	const { data }: { data: PageServerData } = $props();
	let reminders = $state(data.reminders);
	let open = $state<boolean>(false);

	const ondelete = (id: number) => {
		if (!reminders) return;

		const temp = reminders.filter((r) => r.id !== id);
		reminders = [];

		setTimeout(() => {
			reminders = temp;
		}, 1);
	};
</script>

<ExplainBox
	headline="What is this?"
	text="Here you can set and delete Reminders. Make sure Ayako can DM you."
	class="pt-1"
></ExplainBox>

<div class="mt-3">
	<Button text="Create Reminder" style="green" width="full" onclick={() => (open = true)} />
</div>

<div class="py-3">
	{#each (reminders || []).toSorted((a, b) => a.endTime - b.endTime) as reminder}
		<Reminder {reminder} {ondelete} />
	{/each}
</div>

{#if open}
	<Modal author="Create Reminder" close={() => (open = false)}>
		<form
			use:enhance={(event) => {
				if (!reminders) return;

				const temp = reminders;
				reminders = [];
				temp.push({
					channelId: 'Website',
					endTime: new Date(event.formData.get('date') + 'T' + event.formData.get('time')).getTime(),
					id: Number(event.formData.get('startTime')),
					reason: event.formData.get('reason') as string,
					userId: 'Website',
				});

				setTimeout(() => {
					reminders = temp;
				}, 1);

				open = false;
			}}
			action="?/reminder"
			method="post"
			class="pt-10 px-10 flex flex-col"
		>
			<TextInput
				label="What's the reminder for?"
				maxLen={2000}
				minLen={1}
				size="paragraph"
				type="text"
				required
				id="reason"
			/>

			<input type="hidden" value={Date.now()} name="startTime" />

			<div class="flex flex-col justify-between h-full">
				<div class="flex flex-row justify-between items-center flex-wrap gap-2 mt-5">
					<div class="w-40%">
						<DateInput id="date" name="date" placeholder="End Date" label="End Date" width="full" />
					</div>
					<div class="w-40%">
						<TimeInput id="time" name="time" placeholder="End Time" label="End Time" width="full" />
					</div>
				</div>

				<div
					class="absolute bottom-0 right-0 w-full bg-main-pre-darkest pr-4 pb-4
    flex flex-row justify-end items-center gap-2 h-15 border-t-solid border-main-dark border-0.01px"
				>
					<button type="button" class="btn-danger mt-5" onclick={() => (open = false)}>Cancel</button>
					<input type="submit" class="btn-success mt-5" value="Create" />
				</div>
			</div>
		</form>
	</Modal>
{/if}
