<script lang="ts">
	import '$lib/scripts/index.js';
 import './main.css'

	import { invalidateAll } from '$app/navigation';
	import { page } from '$app/state';
	import Login from '$lib/components/generic/Login.svelte';
	import Modal from '$lib/components/generic/Modal.svelte';
	import GuildBar from '$lib/components/layout/GuildBar.svelte';
	import { onMount, type Snippet } from 'svelte';
	import type { LayoutData } from './$types';

	const { data, children }: { data: LayoutData; children: Snippet } = $props();

	let showLogin = $state(false);

	onMount(() => {
		if (!page.url.searchParams.has('reload')) return;
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

<div
	class="flex flex-row justify-start items-start bg-main-dark relative text-poppins overflow-auto h-100vh"
>
	<GuildBar {data} onLogin={() => (showLogin = true)} />

	<div class="bg-main w-full">
		{@render children()}
	</div>
</div>
