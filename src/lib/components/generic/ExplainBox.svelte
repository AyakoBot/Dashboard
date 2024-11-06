<script lang="ts">
	const { headline, text }: { headline: string; text: string } = $props();
</script>

<div class="border-solid border-2px border-main-darker rounded-md p-2 mt-1 mr-1">
	<h4 class="font-bold color-alt-text text-sm">{headline}</h4>
	<div class="text-3">{text}</div>
</div>
