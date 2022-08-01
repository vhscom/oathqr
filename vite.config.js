import { sveltekit } from '@sveltejs/kit/vite';

/** @type {import('vite').UserConfig} */
const config = {
    envPrefix: 'OATH',
    plugins: [
        sveltekit()
    ]
}

export default config;