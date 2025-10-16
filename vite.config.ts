import { defineConfig } from 'vite';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { sveltekit } from '@sveltejs/kit/vite';
import extractorSvelte from '@unocss/extractor-svelte';
import UnoCSS from '@unocss/svelte-scoped/vite';

export default defineConfig({
 server: { allowedHosts: ['dev.animekos.org'] },
 plugins: [UnoCSS({ injectReset: '' }), sveltekit(), extractorSvelte()],
 optimizeDeps: {
  include: ['string-similarity', 'marked']
 }
});
