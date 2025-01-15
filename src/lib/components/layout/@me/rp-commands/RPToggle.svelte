<script lang="ts">
	import Switch from '../../../generic/Switch.svelte';
	import Select from '../../../generic/Select.svelte';
	import type { RUser } from '@ayako/bot/src/Typings/Redis';
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

	const unblock = (id: string) => {
		users = users.filter((u) => (u as RUser).id !== id);

		fetch(`/@me/rp-commands`, {
			body: JSON.stringify({
				command: command.name,
				userId: id,
			}),
			method: 'DELETE',
		});
	};

	const block = (user: RUser | { id: string }) => {
		users = [...users, user];

		fetch(`/@me/rp-commands`, {
			body: JSON.stringify({
				command: command.name,
				userId: user.id,
			}),
			method: 'POST',
		});
	};

	let expanded = $state(false);
</script>

<div class="bg-main-dark rounded-md p-2 select-none">
	<div
		class="flex flex-row justify-between items-center h-7"
		role="button"
		aria-expanded={expanded}
		onclick={() => (expanded = !expanded)}
		onkeydown={(e) => (e.key === 'Enter' ? (expanded = !expanded) : undefined)}
		tabindex="0"
	>
		<div class="flex flex-row justify-center items-center">
			<span
				class="i-tabler-chevron-up mr-2 transition-all duration-100 ease-in-out"
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

		<Select
			class="mt-2"
			maxOpts={Infinity}
			minOpts={0}
			required={false}
			searchable={true}
			options={[]}
			label="Block Users"
		/>
	{/if}
</div>
