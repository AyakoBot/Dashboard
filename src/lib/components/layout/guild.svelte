<script lang="ts">
	export const {
		src,
		size = 60,
		alt = '',
		bg,
		name,
	}: { bg: boolean; name: string; src: string; size: number; alt: string } = $props();
</script>

<div class="relative">
	<div
		class=" hover:rounded-[20px] flex justify-center items-center of-hidden min-w-15 min-h-15 rounded-[30px] ease-in-out transition-all duration-300 box-shadow-main {bg
			? 'bg-main-dark'
			: ''}"
	>
		<img {src} width={size} height={size} {alt} />
	</div>
	<div
		class="absolute bg-main-darkest left-120% top-50% -translate-y-50% w-fit max-w-20lvw rounded-[5px] border-alt-text border-op-50 border-0.1px border-solid px-3 py-1 text-truncate box-shadow-main font-bold"
	>
		{name}
	</div>
</div>
