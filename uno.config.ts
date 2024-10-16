import presetRemToPx from '@unocss/preset-rem-to-px';
import {
	defineConfig,
	presetIcons,
	presetTypography,
	presetUno,
	transformerDirectives,
	transformerVariantGroup,
} from 'unocss';
import presetAnimations from 'unocss-preset-animations';
import { presetShadcn } from 'unocss-preset-shadcn';

export default defineConfig({
	theme: {
		colors: {
			/* Dark Theme / Default */
			blurple: '#5865f2',
			'main-darkest': '#090c17',
			'main-darker': '#1e1f22',
			'main-dark': '#2b2d31',
			main: '#313338',

			'main-text': '#ffffff',
			'alt-text': '#bdc4de',
		},
	},
	rules: [
		['box-shadow-main', { 'box-shadow': '0 0.1em 0.3em 0.1em rgba(23, 23, 23, 0.75)' }],
		['text-fill-color', { '-webkit-text-fill-color': 'transparent' }],
		['code-font', { 'font-family': '"IBM Plex Mono", monospace' }],
		[/^column-count-(.+)$/, ([, d]) => ({ 'column-count': d })],
		[/^column-width-(\d+)$/, ([, d]) => ({ 'column-width': `${Number(d) / 4}rem` })],
	],
	shortcuts: {
		mention: 'bg-[rgba(88,101,242,0.3)] px-1 rounded-md',
	},
	transformers: [transformerDirectives(), transformerVariantGroup()],
	content: {
		pipeline: {
			include: [
				// the default
				/\.(vue|svelte|[jt]sx|mdx?|astro|elm|php|phtml|html)($|\?)/,
				// include js/ts files
				'src/**/*.{js,ts}',
			],
		},
	},
	presets: [
		presetAnimations() as any,
		presetShadcn(),
		presetRemToPx(),
		presetUno(),
		presetIcons({ scale: 1.2 }),
		presetTypography(),
	],
});
