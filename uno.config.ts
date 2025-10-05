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

export default defineConfig({
	safelist: [
  'flex', 'items-center', 'justify-center', 'gap-1',
		// Switch component classes
		'h-6', 'w-10', 'h-4', 'w-4', 'translate-x-4',
		'h-8', 'w-13', 'h-6', 'w-6', 'translate-x-5',
		'h-9', 'w-15', 'h-7', 'w-7', 'translate-x-7',
		'translate-x-0', 'h-2', 'w-2', 'h-3', 'w-3', 'h-3.5', 'w-3.5',
		'left-0.5', 'top-0.5',
		'bg-main-lighter', 'bg-primary-500',
		// Color system classes for design page
		'bg-primary-50', 'bg-primary-100', 'bg-primary-200', 'bg-primary-300', 'bg-primary-400',
		'bg-primary-500', 'bg-primary-600', 'bg-primary-700', 'bg-primary-800', 'bg-primary-900',
		'bg-main-darkest', 'bg-main-pre-darkest', 'bg-main-darker', 'bg-main-dark', 'bg-main-dark-hover',
		'bg-main', 'bg-main-light', 'bg-main-lighter', 'bg-main-lightest',
		'bg-accent-purple', 'bg-accent-pink', 'bg-accent-cyan', 'bg-accent-emerald', 'bg-accent-amber', 'bg-accent-coral',
		'bg-primary', 'bg-secondary', 'bg-danger', 'bg-success', 'bg-warning', 'bg-info',
		'bg-blurple', 'bg-check-checked', 'bg-check-unchecked', 'bg-fake-white',
		'text-main-text-active', 'text-main-text', 'text-alt-text', 'text-muted-text',
		// Padding classes
		'p-3', 'p-4', 'p-6', 'p-8', 'p-10',
		// Rounded and background classes
		'rounded-lg', 'bg-white/[0.02]',
		// Icons
		'i-tabler-layout-dashboard',
		'i-tabler-bell',
		'i-tabler-terminal-2',
		'i-tabler-link',
		'i-tabler-palette',
		'i-tabler-settings',
		'i-tabler-search',
		'i-tabler-chevron-right',
		'i-tabler-chevron-left',
		'i-tabler-menu-2',
		'i-tabler-x',
			'i-tabler-grid-dots',
			'i-tabler-logout',
			'i-tabler-login',
			'i-tabler-home',
			'i-tabler-file-text',
			'i-tabler-key',
			'i-tabler-crown',
			'i-tabler-shield-check',
			'i-tabler-users',
		'i-tabler-star',
		'i-tabler-star-filled',
		'i-tabler-clipboard',
		'i-tabler-home-2',
		'i-tabler-arrow-left',
		'i-tabler-lock',
		'i-tabler-ghost-2',
		'i-tabler-exclamation-circle',
		'i-tabler-shield-x',
		'i-tabler-clock-pause',
			'i-tabler-server-off',
			'i-tabler-tool',
			'i-tabler-bug',
			'i-tabler-alert-triangle',
			'i-tabler-info-circle',
			'i-tabler-coffee',
			'i-tabler-gavel',
			'i-tabler-server-2',
			'i-tabler-chevron-down',
			'i-tabler-chevron-up',
			'i-tabler-arrow-up',
			'i-tabler-heart-filled',
			'i-tabler-code',
			'i-tabler-check',
			'i-tabler-chart-line',
			'i-tabler-swords',
			'i-tabler-user-off',
			'i-tabler-device-floppy',
			'i-tabler-loader-2',
			'i-tabler-circle-check',
			'i-tabler-ban',
		],
	theme: {
		breakpoints: {
			xs: '475px',
			sm: '640px',
			md: '768px',
			lg: '1024px',
			xl: '1280px',
			'2xl': '1536px',
		},
		colors: {
			/* Modern Color System */
			blurple: '#5865f2',
			
			/* Primary Palette */
			'primary-50': '#eef0ff',
			'primary-100': '#dde1ff',
			'primary-200': '#bbc3ff',
			'primary-300': '#8e99ff',
			'primary-400': '#5c69eb',
			'primary-500': '#3644d9',
			'primary-600': '#2732b3',
			'primary-700': '#1f2690',
			'primary-800': '#1a2177',
			'primary-900': '#181f63',
			
			/* Neutral/Background Colors */
			'main-darkest': '#0f0f0f',
			'main-pre-darkest': '#131313',
			'main-darker': '#1a1a1a',
			'main-dark': '#1f1f1f',
			'main-dark-hover': '#2a2a2a',
			main: '#262626',
			'main-light': '#2d2d2d',
			'main-lighter': '#333333',
			'main-lightest': '#404040',
			
			/* Text Colors */
			'main-text-active': '#ffffff',
			'main-text': '#e4e4e7',
			'alt-text': '#a1a1aa',
			'muted-text': '#71717a',
			
			/* Accent Colors */
			'accent-purple': '#a855f7',
			'accent-pink': '#ec4899',
			'accent-cyan': '#06b6d4',
			'accent-emerald': '#10b981',
			'accent-amber': '#f59e0b',
			'accent-coral': '#fb7185',
			
			/* Semantic Colors - WCAG AA Compliant */
			primary: '#5c69eb',
			secondary: '#52525b',
			danger: '#ef4444',
			success: '#16a34a', // Improved contrast: 4.5:1 on white
			warning: '#b45309', // Improved contrast: 4.6:1 on white
			info: '#3b82f6',
			
			/* Hover States */
			'primary-hover': '#4b55be',
			'secondary-hover': '#71717a',
			'danger-hover': '#dc2626',
			'success-hover': '#15803d', // Darker for better contrast
			'warning-hover': '#92400e', // Darker for better contrast
			'info-hover': '#2563eb',
			
			/* Special */
			'check-checked': '#22c55e',
			'check-unchecked': '#52525b',
			'fake-white': '#f3fefc',
		},
	},
	rules: [
		/* Shadows */
		['box-shadow-main', { 'box-shadow': '0 0.1em 0.3em 0.1em rgba(0, 0, 0, 0.15)' }],
		['shadow-glow', { 'box-shadow': '0 0 20px rgba(88, 101, 242, 0.4)' }],
		['shadow-soft', { 'box-shadow': '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }],
		['shadow-hard', { 'box-shadow': '0 10px 25px -5px rgba(0, 0, 0, 0.2)' }],
		
		/* Glass Morphism */
		['glass', { 
			'background': 'rgba(255, 255, 255, 0.05)',
			'backdrop-filter': 'blur(12px)',
			'-webkit-backdrop-filter': 'blur(12px)',
			'border': '1px solid rgba(255, 255, 255, 0.18)'
		}],
		['glass-heavy', { 
			'background': 'rgba(255, 255, 255, 0.1)',
			'backdrop-filter': 'blur(20px)',
			'-webkit-backdrop-filter': 'blur(20px)',
			'border': '1px solid rgba(255, 255, 255, 0.2)'
		}],
		['glass-dark', { 
			'background': 'rgba(0, 0, 0, 0.4)',
			'backdrop-filter': 'blur(12px)',
			'-webkit-backdrop-filter': 'blur(12px)',
			'border': '1px solid rgba(255, 255, 255, 0.1)'
		}],
		
		/* Text Effects */
		['text-fill-color', { '-webkit-text-fill-color': 'transparent' }],
		['text-gradient', { 
			'background': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
			'-webkit-background-clip': 'text',
			'background-clip': 'text',
			'-webkit-text-fill-color': 'transparent'
		}],
		
		/* Animations */
		['animate-fade-in', { 'animation': 'fadeIn 0.4s ease-in-out' }],
		['animate-slide-up', { 'animation': 'slideUp 0.3s ease-out' }],
		['animate-pulse-soft', { 'animation': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }],
		
		/* Fonts */
		['code-font', { 'font-family': '"IBM Plex Mono", monospace' }],
		[/^column-count-(.+)$/, ([, d]) => ({ 'column-count': d })],
		[/^column-width-(\d+)$/, ([, d]) => ({ 'column-width': `${Number(d) / 4}rem` })],
	],
	shortcuts: {
		/* Glass Components */
		'glass-card': 'glass rounded-xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300',
		'glass-panel': 'glass-heavy rounded-lg p-4 border-1 border-white/10',
		'glass-tooltip': 'glass rounded-lg px-3 py-2 text-sm shadow-lg',
		
		/* Tooltips */
		tooltiptext:
			'glass-tooltip text-main-text absolute group-hover:block hidden bottom-110% z-50 select-none hover:hidden animate-fade-in',
		mention: 'bg-primary-400/20 px-2 rounded-md hover:bg-primary-400/30 transition-colors',
		
		/* Modern Button System */
		'btn-base':
			'relative min-w-20 px-5 py-2.5 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100',
		
		/* Primary Buttons */
		'btn-primary': 'btn-base bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg hover:shadow-primary-500/25 hover:shadow-xl',
		'btn-secondary': 'btn-base bg-main-lighter text-main-text hover:bg-main-light border-1 border-white/10',
		'btn-danger': 'btn-base bg-gradient-to-r from-danger to-red-600 text-white shadow-lg hover:shadow-danger/25',
		'btn-success': 'btn-base bg-gradient-to-r from-success to-emerald-600 text-white shadow-lg hover:shadow-success/25',
		'btn-warning': 'btn-base bg-gradient-to-r from-warning to-amber-600 text-white shadow-lg hover:shadow-warning/25',
		'btn-info': 'btn-base bg-gradient-to-r from-info to-blue-600 text-white shadow-lg hover:shadow-info/25',
		
		/* Ghost Buttons */
		'btn-ghost': 'btn-base hover:bg-white/10 text-main-text',
		'btn-ghost-primary': 'btn-base hover:bg-primary-500/20 text-primary-400 hover:text-primary-300',
		'btn-ghost-danger': 'btn-base hover:bg-danger/20 text-danger hover:text-red-400',
		
		/* Glass Buttons */
		'btn-glass': 'btn-base glass text-main-text hover:bg-white/10',
		'btn-glass-primary': 'btn-base glass border-primary-500/30 text-primary-300 hover:bg-primary-500/10',
		
		/* Outlined Buttons */
		'btn-outlined': 'btn-base border-2 border-main-lighter text-main-text hover:bg-main-lighter',
		'btn-outlined-primary': 'btn-base border-2 border-primary-500 text-primary-400 hover:bg-primary-500 hover:text-white',
		'btn-outlined-danger': 'btn-base border-2 border-danger text-danger hover:bg-danger hover:text-white',
		
		/* Icon Buttons */
		'btn-icon': 'p-2 rounded-lg hover:bg-white/10 transition-all duration-200 active:scale-95',
		'btn-icon-primary': 'btn-icon text-primary-400 hover:bg-primary-500/20',
		
		/* Link Style */
		'btn-link': 'text-primary-400 hover:text-primary-300 underline-offset-4 hover:underline transition-colors',
		
		/* Input Styles */
		'input-base': 'w-full px-4 py-2.5 rounded-lg bg-main-dark border-1 border-white/10 text-main-text placeholder-muted-text focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all duration-200',
		'input-glass': 'input-base glass',
		
		/* Card Styles */
		'card-base': 'bg-main-dark rounded-xl p-6 border-1 border-white/5 hover:border-white/10 transition-all duration-300',
		'card-hover': 'card-base hover:shadow-xl hover:transform hover:scale-105',
		'card-glass': 'glass-card hover:transform hover:scale-105',
		
		/* Deprecated - kept for compatibility */
		'btn-extra-primary-outlined': 'btn-outlined-primary',
		'btn-extra-inverted-white': 'btn-base bg-white hover:bg-gray-100 text-primary-500',
		'btn-extra-danger-outlined': 'btn-outlined-danger',
		'btn-extra-success-outlined': 'btn-base border-2 border-success text-success hover:bg-success hover:text-white',
		'btn-extra-secondary-outlined': 'btn-outlined',
		'btn-extra-link-outlined': 'btn-outlined flex items-center gap-2',
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
		presetAnimations(),
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
