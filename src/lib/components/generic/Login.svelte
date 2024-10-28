<script lang="ts">
	import { enhance } from '$app/forms';
	import Switch from '$lib/components/generic/Switch.svelte';
	import Tooltip from '$lib/components/generic/Tooltip.svelte';
	import { OAuth2Scopes } from 'discord-api-types/v10';
	import type { Snippet } from 'svelte';

	const { children }: { children: Snippet } = $props();

	const scopes = [
		{
			scope: OAuth2Scopes.Identify,
			name: 'Identify',
			use: 'Mandatory for Ayako to identify you',
			access:
				'Full VIEW access to your user profile\nExluding your email address, password, phone number and other security information',
		},
		{
			scope: OAuth2Scopes.Guilds,
			name: 'Servers',
			use: 'Mandatory for Ayako to know what servers you are in and can manage',
			access:
				'Basic VIEW access to your servers. Including names, icons, banners, counts and your permissions',
		},
		{
			scope: OAuth2Scopes.ApplicationsBuildsRead,
			name: 'Read Applications',
			use: 'Lets Ayako help you set up Custom-Clients or Linked-Roles-Decorations',
			access: 'Full VIEW access to your Applications',
		},
		// {
		// 	scope: OAuth2Scopes.RelationshipsRead,
		//  name: 'Read Relationships',
		// 	use: 'Allows Ayako to automatically sync your friends and blocked users, making them unable to interact with you',
		// 	access: 'Full VIEW access to your Relationships',
		// },
		{
			scope: OAuth2Scopes.ApplicationCommandsPermissionsUpdate,
			name: 'Update Command Permissions',
			use: 'Helps you easily manage Ayakos command permissions when you want to sync your rp-command permissions',
			access: 'Full WRITE access to Ayakos command permissions',
		},
		{
			scope: OAuth2Scopes.GuildsJoin,
			name: 'Join Servers',
			use: 'Lets Ayako add you to her support server.',
			access:
				'Full WRITE access to add you to any server Ayako can create invites in. We will never add you to a server without your consent. You consent to be added to the support server by allowing this scope.',
		},
	];
</script>

<form use:enhance action="/@me?/login" method="post">
	{#each scopes as scope}
		<div class="py-2">
			<div class="flex flex-row justify-start gap-1 items-center text-4 gap-3">
				<Switch
					checked
					name={scope.scope}
					title={scope.name}
					type="y/n"
					disabled={[OAuth2Scopes.Identify, OAuth2Scopes.Guilds].includes(scope.scope)}
				/>
				<Tooltip text={scope.access} />
			</div>
			<div class="text-3 color-alt-text">{scope.use}</div>
		</div>
	{/each}

	<div
		class="absolute bottom-0 right-0 w-full bg-main-pre-darkest
  flex flex-row justify-end items-center gap-2 h-15 border-t-solid border-main-dark border-0.01px"
	>
		{@render children()}
		<button class="btn-success! mt-10 mr-5 mb-10" type="submit">Log in</button>
	</div>
</form>
