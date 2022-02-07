<script lang="ts">
	import Form from '$lib/Form.svelte';
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
<section class="flex flex-col space-y-2">
	<Form />
</section>
