<script lang="ts">
	import { goto } from '$app/navigation';
	import clsx from 'clsx';
	import { ERROR_DEFINITIONS } from '$lib/scripts/errorDefinitions.js';

	const errorDefinitions = ERROR_DEFINITIONS;
	
	let customCode = $state('');
	let customMessage = $state('');
	
	const triggerError = (code: number, message?: string) => {
		const params = new URLSearchParams({
			trigger: code.toString(),
			...(message && { message })
		});
		goto(`/@me/errors?${params.toString()}`);
	};
	
	const triggerCustomError = () => {
		const code = parseInt(customCode);
		if (isNaN(code) || code < 100 || code > 599) {
			alert('Please enter a valid HTTP status code (100-599)');
			return;
		}
		triggerError(code, customMessage || undefined);
	};
</script>

<div class="min-h-screen p-8 bg-gradient-to-br from-main-darkest via-main-darker to-main-dark">
	<div class="max-w-7xl mx-auto">
		<!-- Header -->
		<div class="mb-8">
			<h1 class="text-4xl font-bold text-white mb-2">Error Page Testing</h1>
			<p class="text-white/60">
				Click any error code to trigger and view its error page. This is only visible to developers.
			</p>
			<div class="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
				<div class="flex items-center gap-2">
					<span class="i-tabler-alert-triangle text-yellow-400"></span>
					<p class="text-sm text-yellow-200">
						Warning: Clicking these buttons will trigger actual error pages and navigate away from this page.
					</p>
				</div>
			</div>
		</div>
		
		<!-- Predefined Error Codes -->
		<div class="mb-8">
			<h2 class="text-xl font-semibold text-white mb-4">Common Error Codes</h2>
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
				{#each errorDefinitions as definition}
				<button
					onclick={() => triggerError(definition.code)}
					class={clsx(
						'group relative p-6 rounded-xl',
						'bg-gradient-to-br from-white/[0.08] to-white/[0.02]',
						'border border-white/10',
						'hover:border-white/20 hover:shadow-lg',
						'transition-all duration-300',
						'hover:scale-[1.02] active:scale-[0.98]'
					)}
				>
					<div class={clsx(
						'absolute inset-0 rounded-xl opacity-0 group-hover:opacity-20',
						'bg-gradient-to-br', definition.bgGradient,
						'transition-opacity duration-300'
					)}></div>
					
					<div class="relative z-10">
						<div class={clsx(
							'flex items-center gap-3 mb-3'
						)}>
							<span class={clsx('text-3xl', definition.color, definition.icon)}></span>
							<span class={clsx('text-4xl font-bold', definition.color)}>{definition.code}</span>
						</div>
						<p class="text-white/80 text-sm font-medium">{definition.title}</p>
						<p class="text-white/40 text-xs mt-1">{definition.description}</p>
						<p class="text-white/30 text-[11px] mt-3">Click to test this error state</p>
					</div>
				</button>
				{/each}
			</div>
		</div>
		
		<!-- Custom Error Code -->
		<div class="mb-8">
			<h2 class="text-xl font-semibold text-white mb-4">Custom Error Code</h2>
			<div class={clsx(
				'p-6 rounded-xl',
				'bg-gradient-to-br from-white/[0.08] to-white/[0.02]',
				'border border-white/10'
			)}>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
					<div>
						<label for="custom-code" class="block text-sm font-medium text-white/60 mb-2">
							Status Code
						</label>
						<input
							id="custom-code"
							type="number"
							bind:value={customCode}
							placeholder="e.g. 418"
							min="100"
							max="599"
							class={clsx(
								'w-full px-4 py-2 rounded-lg',
								'bg-white/5 border border-white/10',
								'text-white placeholder-white/40',
								'focus:bg-white/10 focus:border-primary/50',
								'focus:outline-none focus:ring-2 focus:ring-primary/20'
							)}
						/>
					</div>
					<div>
						<label for="custom-message" class="block text-sm font-medium text-white/60 mb-2">
							Custom Message (Optional)
						</label>
						<input
							id="custom-message"
							type="text"
							bind:value={customMessage}
							placeholder="e.g. I'm a teapot"
							class={clsx(
								'w-full px-4 py-2 rounded-lg',
								'bg-white/5 border border-white/10',
								'text-white placeholder-white/40',
								'focus:bg-white/10 focus:border-primary/50',
								'focus:outline-none focus:ring-2 focus:ring-primary/20'
							)}
						/>
					</div>
				</div>
				<button
					onclick={triggerCustomError}
					class={clsx(
						'px-6 py-3 rounded-xl',
						'bg-gradient-to-r from-primary-500 to-primary-600',
						'text-white font-medium',
						'hover:from-primary-600 hover:to-primary-700',
						'transform hover:scale-[1.02] active:scale-[0.98]',
						'transition-all duration-200',
						'shadow-lg hover:shadow-xl'
					)}
				>
					Trigger Custom Error
				</button>
			</div>
		</div>
		
		<!-- Additional Testing Options -->
		<div>
			<h2 class="text-xl font-semibold text-white mb-4">Special Cases</h2>
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
				<button
					onclick={() => triggerError(418, "I'm a teapot - The server refuses to brew coffee because it is, permanently, a teapot.")}
					class={clsx(
						'p-4 rounded-xl text-left',
						'bg-gradient-to-br from-white/[0.08] to-white/[0.02]',
						'border border-white/10',
						'hover:border-white/20 hover:shadow-lg',
						'transition-all duration-300'
					)}
				>
					<div class="flex items-center gap-3 mb-2">
						<span class="i-tabler-coffee text-2xl text-green-400"></span>
						<span class="text-lg font-bold text-green-400">418</span>
					</div>
					<p class="text-white/80 text-sm font-medium">I'm a teapot</p>
					<p class="text-white/40 text-xs mt-1">RFC 2324 April Fools</p>
				</button>
				
				<button
					onclick={() => triggerError(451, "Unavailable For Legal Reasons - This content has been removed due to legal requirements.")}
					class={clsx(
						'p-4 rounded-xl text-left',
						'bg-gradient-to-br from-white/[0.08] to-white/[0.02]',
						'border border-white/10',
						'hover:border-white/20 hover:shadow-lg',
						'transition-all duration-300'
					)}
				>
					<div class="flex items-center gap-3 mb-2">
						<span class="i-tabler-gavel text-2xl text-red-400"></span>
						<span class="text-lg font-bold text-red-400">451</span>
					</div>
					<p class="text-white/80 text-sm font-medium">Unavailable For Legal Reasons</p>
					<p class="text-white/40 text-xs mt-1">Content censored</p>
				</button>
				
				<button
					onclick={() => triggerError(502, "Bad Gateway - The server received an invalid response from an upstream server.")}
					class={clsx(
						'p-4 rounded-xl text-left',
						'bg-gradient-to-br from-white/[0.08] to-white/[0.02]',
						'border border-white/10',
						'hover:border-white/20 hover:shadow-lg',
						'transition-all duration-300'
					)}
				>
					<div class="flex items-center gap-3 mb-2">
						<span class="i-tabler-server-2 text-2xl text-orange-400"></span>
						<span class="text-lg font-bold text-orange-400">502</span>
					</div>
					<p class="text-white/80 text-sm font-medium">Bad Gateway</p>
					<p class="text-white/40 text-xs mt-1">Upstream server error</p>
				</button>
			</div>
		</div>
		
	</div>
</div>
