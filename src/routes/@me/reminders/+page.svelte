<script lang="ts">
 import { enhance } from '$app/forms';
import EmptyState from '$lib/components/generic/EmptyState.svelte';
import Modal from '$lib/components/generic/Modal.svelte';
import Badge from '$lib/components/generic/Badge.svelte';
import Card from '$lib/components/generic/Card.svelte';
import Reminder from '$lib/components/layout/@me/reminder/Reminder.svelte';
import { addNotification } from '$lib/components/layout/NotificationToast.svelte';
import clsx from 'clsx';
import { fly } from 'svelte/transition';
 import type { PageServerData } from './$types';

 const { data }: { data: PageServerData } = $props();
 let reminders = $state(data.reminders || []);
 let open = $state<boolean>(false);
 let searchQuery = $state('');
 let filterType = $state<'all' | 'upcoming'>('all');
 
 const filteredReminders = $derived(
 reminders.filter(reminder => {
  const matchesSearch = reminder.reason.toLowerCase().includes(searchQuery.toLowerCase());
  const now = Date.now();
  
  if (filterType === 'upcoming') return matchesSearch && reminder.endTime > now;
  return matchesSearch;
 })
 );
 
const groupedReminders: Record<string, typeof reminders> = $derived((() => {
 const groups: Record<string, typeof reminders> = {};
 for (const reminder of filteredReminders) {
  const date = new Date(reminder.endTime);
  const key = date.toDateString();
  if (!groups[key]) groups[key] = [];
  groups[key].push(reminder);
 }
 return groups;
 })());

const ondelete = (id: number) => {
if (!reminders) return;

const temp = reminders.filter((r) => r.id !== id);
reminders = temp;

addNotification({
 type: 'success',
 title: 'Reminder deleted',
 message: 'The reminder has been successfully removed.',
});
};

const upcomingReminders = $derived(reminders.filter((reminder) => reminder.endTime > Date.now()));
const upcomingCount = $derived(upcomingReminders.length);
const totalReminders = $derived(reminders.length);
const nextReminderLabel = $derived(() => {
	const next = upcomingReminders.toSorted((a, b) => a.endTime - b.endTime)[0];
	if (!next) return 'None scheduled';
	const diffMs = next.endTime - Date.now();
	if (diffMs <= 0) return 'Due now';
	const diffMinutes = Math.ceil(diffMs / (1000 * 60));
	if (diffMinutes < 60) return `${diffMinutes} min`;
	const diffHours = Math.ceil(diffMinutes / 60);
	if (diffHours < 24) return `${diffHours} hr${diffHours === 1 ? '' : 's'}`;
	const diffDays = Math.ceil(diffHours / 24);
	return `${diffDays} day${diffDays === 1 ? '' : 's'}`;
});

const filterOptions = [
	{ id: 'all', label: 'All' },
	{ id: 'upcoming', label: 'Upcoming' },
] as const;

const pad = (value: number) => value.toString().padStart(2, '0');
const formatLocalDate = (date: Date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
const formatLocalTime = (date: Date) => `${pad(date.getHours())}:${pad(date.getMinutes())}`;

const quickSelections = [
	{
		label: 'In 1 hour',
		getTarget: () => {
			const target = new Date();
			target.setHours(target.getHours() + 1);
			return target;
		}
	},
	{
		label: 'Tomorrow morning',
		getTarget: () => {
			const target = new Date();
			target.setDate(target.getDate() + 1);
			target.setHours(9, 0, 0, 0);
			return target;
		}
	},
	{
		label: 'Next week',
		getTarget: () => {
			const target = new Date();
			target.setDate(target.getDate() + 7);
			target.setHours(9, 0, 0, 0);
			return target;
		}
	}
];

let dateInput = $state<HTMLInputElement | null>(null);
let timeInput = $state<HTMLInputElement | null>(null);

const applyQuickSelection = (getTarget: () => Date) => {
	const targetDateInput = $state.snapshot(dateInput);
	const targetTimeInput = $state.snapshot(timeInput);
	if (!targetDateInput || !targetTimeInput) return;
	const target = getTarget();
	const dateValue = formatLocalDate(target);
	const timeValue = formatLocalTime(target);
	targetDateInput.value = dateValue;
	targetTimeInput.value = timeValue;
	targetDateInput.dispatchEvent(new Event('input', { bubbles: true }));
	targetTimeInput.dispatchEvent(new Event('input', { bubbles: true }));
	targetDateInput.dispatchEvent(new Event('change', { bubbles: true }));
	targetTimeInput.dispatchEvent(new Event('change', { bubbles: true }));
};
</script>

<div class="min-h-screen bg-gradient-to-br from-main-darkest via-main-darker to-main-dark">
	<div class="pointer-events-none absolute inset-0 overflow-hidden">
		<div class="absolute left-[-10rem] top-32 h-80 w-80 rounded-full bg-primary-500/10 blur-3xl"></div>
		<div class="absolute right-[-6rem] bottom-24 h-96 w-96 rounded-full bg-accent-purple/10 blur-3xl"></div>
	</div>

	<div class="relative z-10 p-6 lg:p-8">
		<div class="mx-auto max-w-6xl space-y-10">
			<header class="space-y-6">
				<div class="flex flex-wrap items-center gap-3">
					<Badge text="Personal" variant="primary" icon="i-tabler-bell" />
					<Badge text="Reminders" variant="info" icon="i-tabler-calendar-event" />
				</div>
				<div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
					<div class="space-y-2">
						<h1 class="text-4xl font-bold text-white">Personal Reminders</h1>
						<p class="text-white/60 max-w-2xl">
							Schedule gentle nudges and Ayako will deliver them straight to your DMs right on time.
						</p>
					</div>
					<button type="button" class="btn-primary flex items-center gap-2" onclick={() => (open = true)}>
						<span class="i-tabler-plus text-base"></span>
						Create Reminder
					</button>
				</div>
			</header>

			<section class="grid gap-6 items-start lg:grid-cols-[1.3fr_0.7fr]">
				<Card title="Reminder Planner" description="Search, filter, and review upcoming notifications">
					<div class="space-y-6">
						<div class="grid gap-3 sm:grid-cols-3" aria-label="Reminder summary">
							<div class="rounded-xl border border-white/10 bg-white/5 p-4">
								<p class="text-xs uppercase tracking-wide text-white/40">Total</p>
								<p class="text-2xl font-semibold text-white">{totalReminders}</p>
							</div>
							<div class="rounded-xl border border-success/30 bg-success/10 p-4">
								<p class="text-xs uppercase tracking-wide text-success/70">Upcoming</p>
								<p class="text-2xl font-semibold text-white">{upcomingCount}</p>
							</div>
							<div class="rounded-xl border border-info/30 bg-info/10 p-4">
								<p class="text-xs uppercase tracking-wide text-info/70">Next Reminder</p>
								<p class="text-2xl font-semibold text-white">{nextReminderLabel()}</p>
							</div>
						</div>

						<div class="space-y-3">
							<div class="relative">
								<input
									type="text"
									class="w-full rounded-xl border border-white/15 bg-black/30 px-10 py-3 text-sm text-white/80 placeholder-white/30 transition focus:border-primary-400/50 focus:outline-none focus:ring-2 focus:ring-primary-400/20"
									placeholder="Search reminders by note"
									bind:value={searchQuery}
								/>
								<span class="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/30 i-tabler-search"></span>
								{#if searchQuery}
								<button
									type="button"
									class="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-primary-300"
									aria-label="Clear search"
									onclick={() => (searchQuery = '')}
								>
									<span class="i-tabler-x"></span>
								</button>
								{/if}
							</div>
							<div class="flex flex-wrap gap-2">
								{#each filterOptions as option}
								<button
									type="button"
									class={clsx(
										'px-4 py-2 text-sm font-medium rounded-lg transition',
										filterType === option.id
											? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20'
											: 'border border-white/10 bg-white/5 text-white/60 hover:text-white hover:border-primary-400/40'
									)}
									onclick={() => (filterType = option.id)}
								>
									{option.label}
								</button>
								{/each}
							</div>
							<p class="text-xs text-white/40">
								Showing {filteredReminders.length} of {totalReminders} reminder{totalReminders === 1 ? '' : 's'}
							</p>
						</div>
					</div>
				</Card>

				<Card title="Helpful hints" description="Keep your reminders tidy and timely">
					<ul class="space-y-3 text-sm text-white/60">
						<li class="flex items-start gap-3">
							<span class="i-tabler-calendar-event text-info"></span>
							<span>Group reminders by day to scan what is coming up at a glance.</span>
						</li>
						<li class="flex items-start gap-3">
							<span class="i-tabler-check text-success"></span>
							<span>Use filters to focus on upcoming notifications when triaging.</span>
						</li>
						<li class="flex items-start gap-3">
							<span class="i-tabler-alert-triangle text-warning"></span>
							<span>Remember: deleting a reminder removes it permanently.</span>
						</li>
					</ul>
				</Card>
			</section>

			{#if filteredReminders.length === 0}
				{#if reminders.length === 0}
					<EmptyState
						illustration="empty"
						title="No reminders yet"
						description="Create your first reminder and Ayako will notify you when it's time."
						actionLabel="Create your first reminder"
						actionIcon="i-tabler-plus"
						onAction={() => (open = true)}
					/>
				{:else}
					<EmptyState
						illustration="search"
						title="No reminders match your filters"
						description="Try clearing your search or switch back to all reminders."
						actionLabel="Clear filters"
						onAction={() => {
							searchQuery = '';
							filterType = 'all';
						}}
					/>
				{/if}
			{:else}
				<section class="space-y-6">
					{#each Object.entries(groupedReminders) as [date, dateReminders], index}
						<div
							class="animate-fade-in rounded-2xl border border-white/10 bg-white/5 p-5 shadow-inner shadow-black/10"
							style="animation-delay: {index * 50}ms"
							transition:fly={{ y: 18, duration: 250, delay: index * 50 }}
						>
							<div class="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-white/50">
								<span class="i-tabler-calendar-event text-primary-400"></span>
								{date}
							</div>
							<div class="mt-4 space-y-3">
								{#each dateReminders.toSorted((a, b) => a.endTime - b.endTime) as reminder}
									<div class="rounded-xl border border-white/10 bg-main-darker/70 p-4 transition hover:border-primary-400/40 hover:bg-primary-500/5">
										<Reminder {reminder} {ondelete} />
									</div>
								{/each}
							</div>
						</div>
					{/each}
				</section>
			{/if}
		</div>
	</div>
</div>

{#if open}
 <Modal 
 author="Create New Reminder" 
 description="Set a reminder and Ayako will notify you at the specified time"
 close={() => (open = false)}
 variant="glass"
 >
 <form
  use:enhance={(event) => {
  const temp = [...reminders];
  temp.push({
   channelId: 'Website',
   endTime: new Date(event.formData.get('date') + 'T' + event.formData.get('time')).getTime(),
   id: Number(event.formData.get('startTime')),
   reason: event.formData.get('reason') as string,
   userId: 'Website',
  });
  reminders = temp;
  open = false;
  
  addNotification({
   type: 'success',
   title: 'Reminder created',
   message: 'Your reminder has been set successfully.',
  });
  }}
  action="?/reminder"
  method="post"
  class="p-6 space-y-6"
 >
  <div class="space-y-4">
   <div>
   <label for="reason" class="block text-sm font-medium text-white mb-2">
   What would you like to be reminded about?
   </label>
   <textarea
   id="reason"
   name="reason"
   required
   maxlength="2000"
   minlength="1"
   rows="4"
   placeholder="e.g., Team meeting, Birthday party, Project deadline..."
   class={clsx(
    'w-full px-4 py-3 rounded-xl',
    'bg-white/5 border border-white/10',
    'text-white placeholder-white/40',
    'focus:bg-white/10 focus:border-primary-400/50',
    'transition-all duration-200',
    'resize-none'
   )}
   ></textarea>
   <div class="mt-1 text-xs text-white/40 text-right">
   Max 2000 characters
   </div>
  </div>
  
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
  <div>
  <label for="date" class="block text-sm font-medium text-white mb-2">
   Reminder Date
  </label>
  <input
   type="date"
   id="date"
   name="date"
   required
   min={new Date().toISOString().split('T')[0]}
   class={clsx(
   'w-full px-4 py-3 rounded-xl',
   'bg-white/5 border border-white/10',
   'text-white',
   'focus:bg-white/10 focus:border-primary-400/50',
   'transition-all duration-200'
   )}
   bind:this={dateInput}
  />
  </div>
  
  <div>
  <label for="time" class="block text-sm font-medium text-white mb-2">
   Reminder Time
  </label>
  <input
   type="time"
   id="time"
   name="time"
   required
   class={clsx(
   'w-full px-4 py-3 rounded-xl',
   'bg-white/5 border border-white/10',
   'text-white',
   'focus:bg-white/10 focus:border-primary-400/50',
   'transition-all duration-200'
   )}
   bind:this={timeInput}
  />
  </div>
 </div>
 
 <div>
  <p class="text-sm font-medium text-white mb-2">Quick select:</p>
   <div class="flex flex-wrap gap-2">
   {#each quickSelections as option}
    <button
    type="button"
    class={clsx(
     'px-3 py-1.5 rounded-lg text-sm',
     'bg-white/5 hover:bg-white/10',
     'text-white/70 hover:text-white',
     'transition-all duration-200'
    )}
    onclick={() => applyQuickSelection(option.getTarget)}
    >
    {option.label}
    </button>
   {/each}
   </div>
  </div>
  </div>
  
  <input type="hidden" value={Date.now()} name="startTime" />
  
  <div class="flex justify-end gap-3 pt-4 border-t border-white/10">
  <button 
   type="button" 
   onclick={() => (open = false)}
   class={clsx(
   'px-5 py-2.5 rounded-lg font-medium',
   'text-white/70 hover:text-white',
   'hover:bg-white/10',
   'transition-all duration-200'
   )}
  >
   Cancel
  </button>
  <button
   type="submit"
   class={clsx(
   'px-5 py-2.5 rounded-lg font-medium',
   'bg-primary-500 hover:bg-primary-600',
   'text-white shadow-lg',
   'transform transition-all duration-200',
   'hover:scale-105'
   )}
  >
   Create Reminder
  </button>
  </div>
 </form>
 </Modal>
{/if}

<style>
 @keyframes fade-in {
 from {
  opacity: 0;
  transform: translateY(10px);
 }
 to {
  opacity: 1;
  transform: translateY(0);
 }
 }
 
 .animate-fade-in {
 animation: fade-in 0.5s ease-out forwards;
 opacity: 0;
 }
</style>
