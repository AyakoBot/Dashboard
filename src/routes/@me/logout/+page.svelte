<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';

	onMount(() => {
		if (!$page.url.searchParams.has('logout')) return;

		setTimeout(() => {
			location.href = '/?reload=true';
		});
	});
</script>
