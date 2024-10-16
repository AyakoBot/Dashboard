<script lang="ts">
	import { page } from '$app/stores';
	import { invalidateAll } from '$app/navigation';
	import { redirect } from '@sveltejs/kit';

	const reload = async () => {
		const reload = $page.url.searchParams.get('reload');
		if (!reload) return;

		await invalidateAll();
		redirect(307, '/');
	};

	$effect(() => {
		reload();
	});
</script>

<div class="flex flex-col items-center">
	<span class="mt-2">The page you were looking for, doesn't exist</span>

	<a href="/" class="btn-medium mt-2">Take me back</a>
</div>
