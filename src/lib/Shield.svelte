<script lang="ts">
	import { onMount } from 'svelte';
	import EyeOffSolidIcon from './icons/EyeOffSolidIcon.svelte';

	let shield: HTMLCanvasElement;
	let ctx: WebGLRenderingContextBase;
	onMount(() => {
		ctx = shield.getContext('webgl');
		if (ctx === null) return;
		ctx.clearColor(0.0, 0.0, 0.0, 0.0);
		ctx.clear(ctx.COLOR_BUFFER_BIT);
	});
</script>

<button
	aria-label="Remove Shield"
	on:click|once={({ currentTarget }) => (currentTarget.hidden = true)}
	class="absolute top-0 left-0 z-10 h-full w-full rounded outline-none ring-blue-500 focus:ring-2"
>
	<div class="absolute top-0 left-0 z-20 flex h-full w-full content-center justify-center">
		<EyeOffSolidIcon classes="sh-16 inline-block w-16 text-white opacity-50 dark:opacity-30" />
	</div>
	<canvas
		bind:this={shield}
		class="absolute top-0 left-0 h-full w-full p-7 filter backdrop-blur-shield"
	/>
</button>
