<script lang="ts">
	import Button from '$lib/components/generic/Button.svelte';
	import type { RUser } from '@ayako/bot/src/Typings/Redis';

	const { user, onremove }: { user: RUser | { id: string }; onremove: (id: string) => void } =
		$props();
</script>

<div class="flex flex-row items-center justify-between p-1 pl-2 bg-main-darker rounded mt-2">
	{#if Object.keys(user).length > 1}
		<div class="flex flex-row justify-center items-center gap-2">
			<img src={(user as RUser).avatar_url} alt="" width="32" height="32" class="rounded-full" />
			<span>{(user as RUser).global_name} ({(user as RUser).username})</span>
		</div>
		<Button style="red-outline" text="Unblock" onclick={() => onremove(user.id)} />
	{:else}
		<span>Unknown User ({user.id})</span>
		<Button style="red-outline" text="Unblock" onclick={() => onremove(user.id)} />
	{/if}
</div>
