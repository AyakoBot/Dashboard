<script lang="ts">
 import { onMount } from 'svelte';
 import { page } from '$app/state';

 onMount(() => {
  if (!page.url?.searchParams.has('logout')) return;

  setTimeout(() => {
   location.href = '/?reload=true';
  });
 });
</script>
