<script lang="ts">
	import '$lib/scripts/index.js';

	import Login from '$lib/components/generic/Login.svelte';
	import Modal from '$lib/components/generic/Modal.svelte';
	import GuildBar from '$lib/components/layout/GuildBar.svelte';
	import { onMount, type Snippet } from 'svelte';
	import type { LayoutData } from './$types';
	import { page } from '$app/stores';
	import { invalidateAll } from '$app/navigation';

	const { data, children }: { data: LayoutData; children: Snippet } = $props();

	let showLogin = $state(false);

	onMount(() => {
		if (!$page.url.searchParams.has('reload')) return;
		invalidateAll();
		location.href = '/';
	});
</script>

{#if showLogin}
	<Modal author="Authorizing Ayako" close={() => (showLogin = false)}>
		<Login>
			<button
				class="btn-danger! mt-10 mb-10"
				type="button"
				onclick={() => (showLogin = false)}
				onkeydown={(e) => e.key === 'Enter' && (showLogin = false)}>Cancel</button
			>
		</Login>
	</Modal>
{/if}

<div id="main" class="flex flex-row justify-start items-start bg-main-dark relative text-poppins">
	<GuildBar {data} on:login={() => (showLogin = true)} />

	<div class="bg-main w-full">
		{@render children()}
	</div>
</div>
