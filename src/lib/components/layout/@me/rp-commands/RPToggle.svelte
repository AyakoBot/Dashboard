<script lang="ts">
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
	}: {
		command: { aliases: string[]; name: string };
		checkChange: (n: string, v: boolean) => void;
		commandEnabled: Record<string, boolean>;
		users: (RUser | { id: string })[];
	} = $props();

	let isLoading = $state(false);
	let userOptions = $state<RUser[]>([]);
	let selectedUsers = $state<RUser[]>([]);

	const unblock = (id: string) => {
		users = users.filter((u) => (u as RUser).id !== id);

		makeRequest({ method: 'DELETE', path: '/@me/rp', command: command.name, userId: id }, {}, fetch);
	};

	$effect(() => {
		if (!selectedUsers.length) return;

		const newUser = $state.snapshot(selectedUsers)[0];
		selectedUsers = [];

		if (newUser) block(newUser);
	});

	const block = (user: RUser | { id: string } | undefined) => {
		if (!user) return;

		users = [...users, user];

		makeRequest(
			{ method: 'POST', path: '/@me/rp', command: command.name, userId: user.id },
			{},
			fetch,
		);
	};

	let expanded = $state(false);

	const search = async (v: string) => {
		if (!v.length) {
			userOptions = [];
			return;
		}

		if (/\d{17,19}/g.test(v)) {
			userOptions = [
				{
					global_name: 'Add by ID',
					username: v,
					id: v,
					discriminator: '0',
					avatar_url: null,
					banner_url: null,
				},
			];
			return;
		}

		isLoading = true;

		const res = await makeRequest(
			{ path: '/users/search', method: 'GET' },
			{ query: `query=${v}` },
			fetch,
		).catch(() => []);

		isLoading = false;
		userOptions = res || [];
	};
</script>

<div class="bg-main-dark rounded-md p-2 select-none">
	<div
		class="flex flex-row justify-between items-center h-7 group"
		role="button"
		aria-expanded={expanded}
		onclick={() => (expanded = !expanded)}
		onkeydown={(e) => (e.key === 'Enter' ? (expanded = !expanded) : undefined)}
		tabindex="0"
	>
		<div class="flex flex-row justify-center items-center">
			<span
				class="i-tabler-chevron-up mr-2 transition-all duration-100 ease-in-out group-hover:rotate-90"
				class:rotate-180={expanded}
			></span>
			{command.name}
			{#if command.aliases.length}
				<br />
				<div class="color-neutral-400 text-2 mb-1 ml-1 mt-2">
					aka: {command.aliases.join(', ')}
				</div>
			{/if}
		</div>
		<Switch
			name={command.name}
			checked={commandEnabled[command.name] ?? true}
			oncheck={checkChange}
		/>
	</div>

	{#if expanded}
		{#each users as user}
			<User {user} onremove={(id) => unblock(id)} />
		{/each}

		<div class="relative">
			<Select
				class="mt-2"
				maxOpts={1}
				minOpts={0}
				required={false}
				searchable={true}
				ontyping={(v) => search(v)}
				onupdate={(v) => block(v[0])}
				type="User"
				options={userOptions.filter((u) => !users.some((us) => (us as RUser).id === u.id))}
				label="Block Users"
				bind:selectedOptions={selectedUsers}
			/>

			{#if isLoading}
				<img
					class="color-neutral-400 mt-2 absolute top-0 right-2"
					alt="Loading..."
					height="32"
					width="32"
					src="/images/loading.webp"
				/>
			{/if}
		</div>
	{/if}
</div>
