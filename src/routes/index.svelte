<script>
	import QR from 'svelte-qr';
	import Form from '$lib/Form.svelte';
	import Example from '$lib/Example.svelte';
	import About from '$lib/About.svelte';

	let size = 200;
	let text = 'otpauth://totp/?secret=';
</script>

<svelte:head>
	<title>2FA QR Code Generator</title>
	<meta name="author" content="VHS" />
	<meta name="description" content="Offline 2FA QR code generator." />
	<meta name="robots" content="noindex,follow" />
	<link
		rel="license"
		href="https://www.gnu.org/licenses/gpl-3.0.html"
		title="GNU GPL 3.0 or later"
	/>
</svelte:head>

<header class="mt-4 flex flex-col items-center">
	<h1 class="my-4">2FA QR Code Generator</h1>
	<p class="-mt-2 text-sm font-semibold">
		Save your 2FA secrets, then use this to scan them again.
	</p>
</header>

<p>
	This is a 2FA QR code generator made with SvelteKit that helps you make QR codes from 2FA secrets.
	Based on <a target="_blank" rel="external noopener" href="https://stefansundin.github.io/2fa-qr/"
		>the original</a
	> by Stefan Sundin.
</p>

<p>
	<b>Usage instructions:</b> Build from source (link below), and generate and scan your QR code
	after you've reviewed the source code of this application. Application uses strict same-origin
	<a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP">Content-Security Policy</a> to ensure
	your browser does not communicate outside the localhost when run offline. Don't trust. Verify.
</p>

<section class="flex flex-col space-y-12">
	<Form bind:text bind:size />
</section>

<section class="my-10 flex flex-col space-y-12">
	<div
		class="block self-center bg-gray-50 p-4 shadow-inner dark:bg-gray-200"
		style="width:{size}px"
	>
		{#key `${text}-${size}`}
			<QR {text} />
		{/key}
	</div>
</section>

<section class="flex flex-col">
	<Example />
</section>

<footer class="mt-12 flex flex-col">
	<About />
</footer>
