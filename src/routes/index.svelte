<script lang="ts">
	import QR from 'svelte-qr';
	import Form from '$lib/Form.svelte';

	let size = 200;
	let text = 'otpauth://totp/?secret=';
</script>

<header class="mt-4 flex flex-col items-center">
	<h1 class="my-4">2FA QR code generator</h1>
	<p class="-mt-2 text-sm font-semibold">
		Save your 2FA secrets, then use this to scan them again.
	</p>
</header>

<p>
	This is a 2FA QR code generator made with SvelteKit that helps you make QR codes from 2FA secrets.
	Based on <a href="https://stefansundin.github.io/2fa-qr/">the original</a> by Stefan Sundin.
</p>

<section class="flex flex-col space-y-12">
	<Form bind:text bind:size />
</section>

<section class="my-10 flex flex-col space-y-12">
	<div class="flex self-center shadow-inner p-4 bg-gray-50" style="width:{size}px">
		{#key `${text}-${size}`}
			<QR {text} />
		{/key}
	</div>
</section>
