<script lang="ts">
	import { onMount } from 'svelte';
	import EyeOffSolidIcon from './icons/EyeOffSolidIcon.svelte';
	import { isShieldActive } from '$lib/store';

	let shield: HTMLCanvasElement;
	let gl: WebGLRenderingContextBase;
	onMount(() => {
		function render() {
			gl = shield.getContext('webgl', { premultipliedAlpha: false });
			if (gl === null) return;
			gl.clearColor(1.0, 1.0, 1.0, 0.5);
			gl.clear(gl.COLOR_BUFFER_BIT);
		}
		requestAnimationFrame(() => render());
	});
</script>

<button
	aria-label="Remove Visible Shield"
	on:click|once={({ currentTarget }) => (currentTarget.hidden = true)}
	class="absolute top-0 left-0 z-10 h-full w-full rounded outline-none ring-blue-500 focus:ring-2 {$isShieldActive
		? ''
		: 'hidden'}"
>
	<div class="absolute top-0 left-0 z-20 flex h-full w-full content-center justify-center">
		<EyeOffSolidIcon classes="inline-block w-12 text-white opacity-50 dark:opacity-30" />
	</div>
	<canvas
		bind:this={shield}
		class="absolute top-0 left-0 h-full w-full p-7 filter backdrop-blur-shield"
	/>
</button>
