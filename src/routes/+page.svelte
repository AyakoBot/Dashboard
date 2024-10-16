<script lang="ts">
	import { page } from '$app/stores';
	import type { PageServerData } from './$types';

	const { data }: { data: PageServerData } = $props();

	$effect(() => {
		const reload = $page.url.searchParams.get('reload');
		if (!reload) return;

		window.location.href = '/';
	});
</script>

<div>
 Hi
</div>