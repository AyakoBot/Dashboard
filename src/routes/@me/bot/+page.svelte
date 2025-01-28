<script lang="ts">
	import Button from '$lib/components/generic/Button.svelte';
	import ExplainBox from '$lib/components/generic/ExplainBox.svelte';
	import makeRequest from '$lib/scripts/util/makeRequest';

	let token = $state<string | null>(null);
	let timeout: null | NodeJS.Timeout = null;
	let copied = $state(false);

	const generateToken = async () => {
		const res = await makeRequest({ method: 'POST', path: '/@me/auth/generate' }, {}, fetch);
		if (!res) return;

		token = res.token;

		if (timeout) clearTimeout(timeout);
	};

	const copy = () => {
		if (!token) return;

		navigator.clipboard.writeText(token);

		copied = true;

		if (timeout) clearTimeout(timeout);
		timeout = setTimeout(() => {
			copied = false;
			timeout = null;
		}, 500);
	};
</script>

<div class="h-full w-full mt-2">
 <ExplainBox
	text="This section is for Developers only. If you don't intend to interact with Ayako's API in a meaningful way, please pass on."
	headline="What is this?"
/>

<div class="flex flex-col gap-5 w-full justify-center items-center h-80%">
	<div class="flex flex-row gap-5">
		<Button
			style="link"
			text="Visit API Documentation"
			onclick={() => (location.href = 'https://docs.ayakobot.com')}
		/>

		<Button style="red" text="Regenerate Token" onclick={() => generateToken()} />
	</div>

	<span> Regenerating your token will make your previous token invalid </span>

	<div
		class="flex flex-row gap-2 items-center"
		onclick={copy}
		onkeydown={copy}
		role="button"
		tabindex="0"
	>
		<div class="bg-main-darkest p-1 px-2 rounded-lg">
			{token || 'Your token will only be shown once'}
		</div>
		<i class:i-tabler-copy={!copied} class:hidden={!token} class:i-tabler-check={copied}></i>
	</div>

	<span> There might be more options in the future... </span>
</div>

</div>