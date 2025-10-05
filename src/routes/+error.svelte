<script lang="ts">
	import { page } from '$app/state';
	import clsx from 'clsx';
	import { onMount } from 'svelte';
	import { getErrorDefinition } from '$lib/scripts/errorDefinitions.js';

	const { status = 500, error, url } = $derived(page);
	
	let mounted = $state(false);
	let particles = $state<Array<{ x: number; y: number; delay: number }>>([]);
	
	onMount(() => {
		mounted = true;
		// Generate random particles for background animation
		particles = Array.from({ length: 20 }, () => ({
			x: Math.random() * 100,
			y: Math.random() * 100,
			delay: Math.random() * 5
		}));
	});
	
	const details = $derived(getErrorDefinition(status));
	
	const copyErrorDetails = () => {
		const errorInfo = `
Error ${status}: ${details.title}
URL: ${url?.pathname || 'Unknown'}
Time: ${new Date().toISOString()}
Message: ${error?.message || details.description}
		`.trim();
		
		navigator.clipboard.writeText(errorInfo);
	};
</script>

<div class="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-main-darkest via-main-darker to-main-dark relative overflow-hidden">
	<!-- Animated background particles -->
	{#if mounted}
	<div class="absolute inset-0 overflow-hidden">
		{#each particles as particle}
		<div 
			class="absolute w-1 h-1 bg-white/10 rounded-full animate-float"
			style="left: {particle.x}%; top: {particle.y}%; animation-delay: {particle.delay}s;"
		></div>
		{/each}
	</div>
	{/if}
	
	<!-- Gradient orbs -->
	<div class="absolute inset-0 opacity-30 pointer-events-none">
		<div class={clsx(
			'absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl',
			'bg-gradient-to-br', details.bgGradient,
			'animate-pulse'
		)}></div>
		<div class={clsx(
			'absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl',
			'bg-gradient-to-br', details.bgGradient,
			'animate-pulse animation-delay-1000'
		)}></div>
	</div>
	
	<div class="max-w-2xl w-full relative z-10">
		<!-- Error status code -->
		<div class="text-center mb-8 flex flex-col items-center gap-4">
			<div class="text-[150px] font-bold text-white/10 select-none animate-pulse leading-none">
				{status}
			</div>
			<span class={clsx(
				details.icon,
				'text-6xl',
				details.color,
				'animate-bounce',
				'drop-shadow-2xl'
			)}></span>
		</div>
		
		<!-- Glass card -->
		<div class={clsx(
			'backdrop-blur-xl',
			'bg-gradient-to-br from-white/[0.08] to-white/[0.02]',
			'border border-white/10',
			'rounded-2xl p-8',
			'shadow-2xl',
			'transform hover:scale-[1.01] transition-transform duration-300'
		)}>
			<!-- Error title and description -->
			<div class="text-center mb-8">
				<h1 class={clsx(
					'text-3xl font-bold mb-3',
					'bg-gradient-to-r', details.bgGradient.replace(/\/20/g, ''),
					'bg-clip-text text-transparent'
				)}>
					{details.title}
				</h1>
				<p class="text-white/60 text-lg leading-relaxed">
					{error?.message || details.description}
				</p>
			</div>
			
			<!-- Suggestions -->
			{#if details.suggestions}
			<div class="mb-8">
				<h3 class="text-sm font-semibold text-white/40 uppercase tracking-wider mb-3">
					What you can try:
				</h3>
				<ul class="space-y-2">
					{#each details.suggestions as suggestion}
					<li class="flex items-start gap-3">
						<span class="i-tabler-chevron-right text-primary-400 text-sm mt-0.5 flex-shrink-0"></span>
						<span class="text-white/70 text-sm">{suggestion}</span>
					</li>
					{/each}
				</ul>
			</div>
			{/if}
			
			<!-- Error details (collapsible) -->
			<details class="mb-8 group">
				<summary class="cursor-pointer text-sm text-white/40 hover:text-white/60 transition-colors flex items-center gap-2">
					<span class="i-tabler-chevron-right text-xs group-open:rotate-90 transition-transform"></span>
					Technical Details
				</summary>
				<div class="mt-4 p-4 rounded-lg bg-black/30 border border-white/5">
					<div class="grid grid-cols-2 gap-4 text-sm">
						<div>
							<span class="text-white/40">Status Code:</span>
							<span class="text-white ml-2 font-mono">{status}</span>
						</div>
						<div>
							<span class="text-white/40">Time:</span>
							<span class="text-white ml-2 font-mono text-xs">{new Date().toLocaleTimeString()}</span>
						</div>
						{#if url}
						<div class="col-span-2">
							<span class="text-white/40">URL:</span>
							<span class="text-white ml-2 font-mono text-xs break-all">{url.pathname}</span>
						</div>
						{/if}
						{#if error?.stack && error.stack !== error.message}
						<div class="col-span-2">
							<span class="text-white/40">Stack:</span>
							<pre class="text-white/60 mt-2 text-xs font-mono overflow-x-auto">{error.stack.slice(0, 200)}...</pre>
						</div>
						{/if}
					</div>
				</div>
			</details>
			
			<!-- Action buttons -->
			<div class="flex flex-col sm:flex-row gap-3">
				<a 
					href="/"
					class={clsx(
						'flex-1 px-6 py-3 rounded-xl text-center',
						'bg-gradient-to-r from-primary-500 to-primary-600',
						'text-white font-medium',
						'hover:from-primary-600 hover:to-primary-700',
						'transform hover:scale-[1.02] active:scale-[0.98]',
						'transition-all duration-200',
						'shadow-lg hover:shadow-xl'
					)}
				>
					<span class="i-tabler-home-2 text-sm mr-2"></span>
					Go to Dashboard
				</a>
				
				<button
					onclick={() => history.back()}
					class={clsx(
						'px-6 py-3 rounded-xl',
						'bg-white/5 hover:bg-white/10',
						'text-white/70 hover:text-white',
						'font-medium',
						'transition-all duration-200',
						'border border-white/10'
					)}
				>
					<span class="i-tabler-arrow-left text-sm mr-2"></span>
					Go Back
				</button>
				
				<button
					onclick={copyErrorDetails}
					class={clsx(
						'px-6 py-3 rounded-xl',
						'bg-white/5 hover:bg-white/10',
						'text-white/70 hover:text-white',
						'font-medium',
						'transition-all duration-200',
						'border border-white/10',
						'group flex items-center justify-center gap-2'
					)}
					title="Copy error details"
				>
					<span class="i-tabler-clipboard text-lg group-hover:scale-110 transition-transform inline-block"></span>
					<span class="text-sm">Copy</span>
				</button>
			</div>
		</div>
		
		<!-- Footer help text -->
		<div class="text-center mt-8 text-sm text-white/40">
			Need help? 
			<a href="https://discord.com/channels/298954459172700181/996850314357522452" class="text-primary-400 hover:text-primary-300 transition-colors">
				Report an issue
			</a>
			or visit our
			<a href="https://support.ayakobot.com" class="text-primary-400 hover:text-primary-300 transition-colors">
				Support server
			</a>
		</div>
	</div>
</div>

<style>
@keyframes float {
	0%, 100% {
		transform: translateY(0) translateX(0);
		opacity: 0.1;
	}
	50% {
		transform: translateY(-100vh) translateX(50px);
		opacity: 0.3;
	}
}

.animate-float {
	animation: float 20s ease-in-out infinite;
}

.animation-delay-1000 {
	animation-delay: 1s;
}
</style>
