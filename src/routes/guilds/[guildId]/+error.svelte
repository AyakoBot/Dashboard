<script lang="ts">
	import { page } from '$app/state';
	import clsx from 'clsx';

	const { status = 500, error } = $derived(page);
	
	const getErrorIcon = () => {
		if (status === 403) return 'i-tabler-lock';
		if (status === 404) return 'i-tabler-search-off';
		if (status === 401) return 'i-tabler-user-x';
		return 'i-tabler-alert-triangle';
	};
	
	const getErrorTitle = () => {
		if (status === 403) return 'Missing Permissions';
		if (status === 404) return 'Server Not Found';
		if (status === 401) return 'Not Authenticated';
		return 'Something Went Wrong';
	};
	
	const getErrorMessage = () => {
		if (error?.message) return error.message;
		if (status === 403) return 'You do not have permission to manage this server';
		if (status === 404) return 'The server you are looking for could not be found';
		if (status === 401) return 'Please log in to continue';
		return 'An unexpected error occurred';
	};
	
	const getActionButton = () => {
		if (status === 401) {
			return { text: 'Log In', href: '/login' };
		}
		return { text: 'Back to Dashboard', href: '/@me' };
	};
	
	const action = $derived(getActionButton());
</script>

<div class="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-main-darkest via-main-darker to-main-dark">
	<div class={clsx(
		'max-w-md w-full',
		'glass-card backdrop-blur-xl',
		'bg-gradient-to-br from-white/[0.08] to-white/[0.02]',
		'border border-white/10',
		'rounded-2xl p-8',
		'shadow-2xl'
	)}>
		<div class="text-center">
			<div class="relative inline-block mb-6">
				<div class={clsx(
					'w-24 h-24 rounded-full',
					'bg-gradient-to-br',
					status === 403 ? 'from-orange-500/20 to-red-500/20' :
					status === 404 ? 'from-purple-500/20 to-pink-500/20' :
					status === 401 ? 'from-blue-500/20 to-cyan-500/20' :
					'from-red-500/20 to-rose-500/20',
					'flex items-center justify-center',
					'shadow-lg'
				)}>
					<span class={clsx(
						getErrorIcon(),
						'text-4xl',
						status === 403 ? 'text-orange-400' :
						status === 404 ? 'text-purple-400' :
						status === 401 ? 'text-blue-400' :
						'text-red-400'
					)}></span>
				</div>
				{#if status === 403}
				<div class="absolute -bottom-1 -right-1 w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-lg">
					<span class="i-tabler-x text-white text-sm"></span>
				</div>
				{/if}
			</div>
			
			<h1 class="text-2xl font-bold text-white mb-2">
				{getErrorTitle()}
			</h1>
			
			<p class="text-white/60 mb-8 leading-relaxed">
				{getErrorMessage()}
			</p>
			
			{#if status === 403}
			<div class="mb-8 p-4 rounded-xl bg-orange-500/10 border border-orange-500/20">
				<div class="flex items-start gap-3">
					<span class="i-tabler-info-circle text-orange-400 text-lg flex-shrink-0 mt-0.5"></span>
					<div class="text-left">
						<p class="text-sm text-white/80 mb-2">
							To manage this server, you need the <span class="font-semibold text-orange-400">Manage Server</span> permission.
						</p>
						<p class="text-xs text-white/60">
							Ask a server administrator to grant you this permission if you need access.
						</p>
					</div>
				</div>
			</div>
			{/if}
			
			<div class="flex flex-col gap-3">
				<a 
					href={action.href}
					class={clsx(
						'w-full px-6 py-3 rounded-xl',
						'bg-gradient-to-r from-primary-500 to-primary-600',
						'text-white font-medium',
						'hover:from-primary-600 hover:to-primary-700',
						'transform hover:scale-[1.02] active:scale-[0.98]',
						'transition-all duration-200',
						'shadow-lg hover:shadow-xl'
					)}
				>
					{action.text}
				</a>
				
				{#if status === 403}
				<button
					onclick={() => history.back()}
					class={clsx(
						'w-full px-6 py-3 rounded-xl',
						'bg-white/5 hover:bg-white/10',
						'text-white/70 hover:text-white',
						'font-medium',
						'transition-all duration-200',
						'border border-white/10'
					)}
				>
					Go Back
				</button>
				{/if}
			</div>
		</div>
	</div>
</div>

<style>
	@keyframes float {
		0%, 100% { transform: translateY(0); }
		50% { transform: translateY(-10px); }
	}
	
	.glass-card {
		animation: float 6s ease-in-out infinite;
	}
</style>