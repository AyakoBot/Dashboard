<script lang="ts">
	import clsx from 'clsx';
	import makeRequest from '$lib/scripts/util/makeRequest';
	import type { RUser } from '@ayako/bot/src/Typings/Redis';
	import Select from '../../../generic/Select.svelte';
	import Switch from '../../../generic/Switch.svelte';
	import User from './User.svelte';

	let {
		command,
		checkChange,
		commandEnabled,
		users,
		defaultBlocked = false,
	}: {
		command: { aliases: string[]; name: string };
		checkChange: (n: string, v: boolean) => void;
		commandEnabled: Record<string, boolean>;
		users: (RUser | { id: string })[];
		defaultBlocked?: boolean;
	} = $props();

	let expanded = $state(false);
	let isLoading = $state(false);
	let userOptions = $state<RUser[]>([]);
	let selectedUsers = $state<RUser[]>([]);

	const isEnabled = $derived(() => {
		const state = commandEnabled[command.name];
		if (state === undefined) return !defaultBlocked;
		return state;
	});

	const statusLabel = $derived(isEnabled ? 'Allowed' : 'Blocked');

	const unblock = (id: string) => {
		users = users.filter((u) => (u as RUser).id !== id);
		makeRequest({ method: 'DELETE', path: '/@me/rp', command: command.name, userId: id }, {}, fetch);
	};

	$effect(() => {
		if (!selectedUsers.length) return;

		const snapshot = $state.snapshot(selectedUsers);
		selectedUsers = [];
		block(snapshot[0]);
	});

	const block = (user: RUser | { id: string } | undefined) => {
		if (!user) return;
		if (users.some((entry) => (entry as RUser).id === user.id)) return;
		users = [...users, user];
		makeRequest(
			{ method: 'POST', path: '/@me/rp', command: command.name, userId: user.id },
			{},
			fetch
		);
	};

	const search = async (value: string) => {
		if (!value.length) {
			userOptions = [];
			return;
		}

		if (/\d{17,19}/g.test(value)) {
			userOptions = [
				{
					global_name: 'Add by ID',
					username: value,
					id: value,
					discriminator: '0',
					avatar_url: null,
					banner_url: null,
				},
			];
			return;
		}

		isLoading = true;
		const response = await makeRequest(
			{ path: '/users/search', method: 'GET' },
			{ query: `query=${value}` },
			fetch
		).catch(() => []);
		isLoading = false;
		userOptions = response || [];
	};
</script>

<div class={clsx(
	'relative rounded-2xl border border-white/10 bg-main-darker/70 p-5 transition-all duration-300',
	!isEnabled && 'border-warning/40 shadow-lg shadow-warning/10',
	expanded && 'shadow-lg shadow-primary-500/10'
)}>
	<div class="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
		<div class="space-y-3">
			<div class={clsx(
				'inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide',
				isEnabled ? 'bg-success/10 text-success/80' : 'bg-warning/10 text-warning/80'
			)}>
				<span class={isEnabled ? 'i-tabler-circle-check' : 'i-tabler-ban'}></span>
				<span>{statusLabel}</span>
			</div>
			<h3 class="text-lg font-semibold text-white">{command.name}</h3>
			{#if command.aliases.length}
			<div class="flex flex-wrap gap-2 text-xs text-white/50">
				{#each command.aliases as alias}
				<span class="rounded-full bg-white/10 px-2 py-0.5">{alias}</span>
				{/each}
			</div>
			{/if}
		</div>

		<div class="flex justify-end sm:ml-6">
			<Switch
				name={command.name}
				checked={isEnabled}
				onchange={(state) => checkChange(command.name, state)}
				size="lg"
			>
			</Switch>
		</div>
	</div>

	<div class="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-white/50">
		<span>{users.length} user{users.length === 1 ? '' : 's'} blocked</span>
		<button
			type="button"
			class="inline-flex items-center gap-1 text-white/60 hover:text-primary-300 transition"
			onclick={() => (expanded = !expanded)}
		>
			<span>{expanded ? 'Hide details' : 'Manage blocks'}</span>
			<span class={clsx('i-tabler-chevron-down transition-transform duration-200', expanded && 'rotate-180')}></span>
		</button>
	</div>

	{#if expanded}
	<div class="mt-4 space-y-3 rounded-2xl border border-white/10 bg-black/20 p-4">
		{#if users.length}
			{#each users as user}
			<User {user} onremove={(id) => unblock(id)} />
			{/each}
		{:else}
			<p class="text-xs text-white/50">No users are blocked from this command.</p>
		{/if}

		<div class="relative border-t border-white/5 pt-3">
			<Select
				class="mt-2"
				maxOpts={1}
				minOpts={0}
				required={false}
				searchable={true}
				type="User"
				label="Block additional users"
				ontyping={(value) => search(value)}
				onupdate={(value) => block(value[0])}
				options={userOptions.filter((option) => !users.some((entry) => (entry as RUser).id === option.id))}
				bind:selectedOptions={selectedUsers}
			/>

			{#if isLoading}
				<span class="absolute right-3 top-3 text-white/40">
					<span class="i-tabler-loader-2 animate-spin"></span>
				</span>
			{/if}
		</div>
	</div>
	{/if}
</div>
