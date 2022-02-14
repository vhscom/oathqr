const typography = require('@tailwindcss/typography');
const forms = require('@tailwindcss/forms');

const config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			backdropBlur: {
				shield: '8px'
			},
			colors: {
				oath: {
					50: '#d8d5cf',
					200: '#c0bab2',
					500: '#655e53',
					700: '#373c3e',
					900: '#181a1b',
					950: '#131516'
				}
			},
			typography: ({ theme }) => ({
				oath: {
					css: {
						'--tw-prose-body': theme('colors.gray[800]'),
						'--tw-prose-headings': theme('colors.oath[900]'),
						'--tw-prose-lead': theme('colors.oath[700]'),
						'--tw-prose-links': theme('colors.oath[900]'),
						'--tw-prose-bold': theme('colors.oath[900]'),
						'--tw-prose-counters': theme('colors.gray[600]'),
						'--tw-prose-bullets': theme('colors.gray[400]'),
						'--tw-prose-hr': theme('colors.gray[300]'),
						'--tw-prose-quotes': theme('colors.oath[900]'),
						'--tw-prose-quote-borders': theme('colors.gray[300]'),
						'--tw-prose-captions': theme('colors.oath[700]'),
						'--tw-prose-code': theme('colors.oath[900]'),
						'--tw-prose-pre-code': theme('colors.gray[100]'),
						'--tw-prose-pre-bg': theme('colors.oath[900]'),
						'--tw-prose-th-borders': theme('colors.gray[300]'),
						'--tw-prose-td-borders': theme('colors.oath[200]'),
						'--tw-prose-invert-body': theme('colors.oath[200]'),
						'--tw-prose-invert-headings': theme('colors.oath[50]'),
						'--tw-prose-invert-lead': theme('colors.gray[300]'),
						'--tw-prose-invert-links': theme('colors.oath[50]'),
						'--tw-prose-invert-bold': theme('colors.oath[50]'),
						'--tw-prose-invert-counters': theme('colors.gray[400]'),
						'--tw-prose-invert-bullets': theme('colors.gray[600]'),
						'--tw-prose-invert-hr': theme('colors.oath[700]'),
						'--tw-prose-invert-quotes': theme('colors.gray[100]'),
						'--tw-prose-invert-quote-borders': theme('colors.oath[700]'),
						'--tw-prose-invert-captions': theme('colors.gray[400]'),
						'--tw-prose-invert-code': theme('colors.oath[50]'),
						'--tw-prose-invert-pre-code': theme('colors.gray[300]'),
						'--tw-prose-invert-pre-bg': 'rgb(0 0 0 / 50%)',
						'--tw-prose-invert-th-borders': theme('colors.gray[600]'),
						'--tw-prose-invert-td-borders': theme('colors.oath[700]')
					}
				}
			})
		}
	},

	plugins: [forms, typography]
};

module.exports = config;
