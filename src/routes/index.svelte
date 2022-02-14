<script lang="ts">
	import Instructions from '$lib/Instructions.svelte';
	import Form from '$lib/Form.svelte';
	import QR from 'svelte-qr';
	import Example from '$lib/Example.svelte';
	import Footer from '$lib/Footer.svelte';
	import Heading from '$lib/Heading.svelte';
	import Shield from '$lib/Shield.svelte';
	let size = 200;
	let text = 'otpauth://totp/?secret=';

	let container: HTMLDivElement;

	$: if (container) {
		container.style.width = `${size}px`;
		container.style.height = `${size}px`;
	}
</script>

<header class="mt-4 flex flex-col items-center">
	<Heading />
</header>

<section class="flex flex-col space-y-12">
	<Instructions />
</section>

<section class="flex flex-col space-y-12">
	<Form bind:text bind:size />
</section>

<section class="my-10 flex flex-col space-y-12">
	<div
		id="qr-container"
		bind:this={container}
		class="relative self-center bg-gray-100 p-4 shadow-inner dark:bg-oath-50/20 dark:shadow-oath-900"
	>
		<Shield />
		{#key text}
			<QR {text} />
		{/key}
	</div>
</section>

<section class="flex flex-col">
	<Example />
</section>

<footer class="mt-12 mb-8 flex flex-col">
	<Footer />
</footer>
