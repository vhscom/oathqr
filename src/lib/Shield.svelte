<script lang="ts">
	import { onMount } from 'svelte';
	import { onInterval } from './utils';

	let shield: HTMLCanvasElement;
	let ctx: WebGLRenderingContextBase;
	onMount(() => {
		// return;
		ctx = shield.getContext('webgl');
		if (ctx === null) return;
		// Set clear color to black, fully transparent
		ctx.clearColor(0.0, 0.0, 0.0, 0.0);
		// Clear the color buffer with specified clear color
		ctx.clear(ctx.COLOR_BUFFER_BIT);
		// Clear the color at 60fps
		// onInterval(() => {
		// 	ctx.clear(ctx.COLOR_BUFFER_BIT);
		// }, 1000 / 60 /* 60fps */);
		console.log(ctx);
	});
</script>

<canvas
	bind:this={shield}
	class="absolute top-0 left-0 p-3.5 z-10 w-full h-full filter backdrop-blur-sm pointer-events-none"
/>
