<script lang="ts">
	import About from '$lib/About.svelte';
	import Form from '$lib/Form.svelte';
	import QR from 'svelte-qr';
	import Example from '$lib/Example.svelte';
	import Footer from '$lib/Footer.svelte';
	import { beforeUpdate } from 'svelte';

	let size = 200;
	let text = 'otpauth://totp/?secret=';
	let container: HTMLDivElement;
	beforeUpdate(() => {
		if (container) {
			container.style.width = `${size}px`;
			container.style.height = `${size}px`;
		}
	});
</script>

<header class="mt-4 flex flex-col items-center">
	<h1 class="my-4">Offline 2FA QR Code Generator</h1>
	<p class="-mt-2 text-sm font-semibold">
		Save your 2FA secrets, then use this to scan them again.
	</p>
</header>

<About />

<section class="flex flex-col space-y-12">
	<Form bind:text bind:size />
</section>

<section class="my-10 flex flex-col space-y-12">
	<div bind:this={container} class="block self-center bg-gray-50 p-4 shadow-inner dark:bg-gray-200">
		{#key text}
			<QR {text} />
		{/key}
	</div>
</section>

<section class="flex flex-col">
	<Example />
</section>

<footer class="mt-12 flex flex-col">
	<Footer />
</footer>
