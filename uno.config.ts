import presetRemToPx from '@unocss/preset-rem-to-px';
import {
	defineConfig,
	presetIcons,
	presetTypography,
	presetUno,
	presetWebFonts,
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
			'main-pre-darkest': '#191d2a',
			'main-darker': '#1e1f22',
			'main-dark': '#2b2d31',
			main: '#313338',
			'main-light': '#35373c',
			'main-lighter': '#404249',

			'main-text-active': '#ffffff',
			'main-text': '#d8ddf9',
			'alt-text': '#bdc4de',

			primary: '#6066f0',
			secondary: '#4f5058',
			danger: '#ba3438',
			success: '#508048',

			'primary-hover': '#4d53c3',
			'secondary-hover': '#6e6f78',
			'danger-hover': '#892625',
			'success-hover': '#3d6336',

			'check-checked': '#23a55a',
			'check-unchecked': '#80848e',
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
		'btn-base': 'min-w-15 duration-100 transition-all ease-in-out text-white rounded-md p-2 px-4',
		'btn-primary': 'btn-base bg-primary hover:bg-primary-hover',
		'btn-secondary': 'btn-base bg-secondary hover:bg-secondary-hover',
		'btn-danger': 'btn-base bg-danger hover:bg-danger-hover',
		'btn-success': 'btn-base bg-success hover:bg-success-hover',
		'btn-link':
			'btn-base bg-secondary hover:bg-secondary-hover flex flex-row justify-center items-center after:bg-[url(/svg/external.svg)] after:content-empty after:h-4 after:w-4 after:m-auto after:ml-1',
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
		presetWebFonts({
			fonts: {
				poppins: {
					name: 'Poppins',
					weights: ['400', '500', '600', '700', '800'],
					provider: 'google',
				},
				serif: 'DM Serif Display',
				mono: 'DM Mono',
				clock: 'Bungee Outline',
				card: 'Mina',
			},
		}),
	],
});
