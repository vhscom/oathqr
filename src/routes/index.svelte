<script lang="ts">
	import QR from 'svelte-qr';
	import Form from '$lib/Form.svelte';

	let size = 200;
	let text = 'otpauth://totp/?secret=';
</script>

<svelte:head>
	<title>2FA QR code generator</title>
	<meta name="description" content="Save your 2FA secrets, then use this to scan them again." />
	<meta name="author" content="VHS" />
	<meta name="robots" content="noindex,follow" />
	<link
		rel="license"
		href="https://www.gnu.org/licenses/gpl-3.0.html"
		title="GNU GPL 3.0 or later"
	/>
</svelte:head>

<header class="mt-4 flex flex-col items-center">
	<h1 class="my-4">2FA QR code generator</h1>
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

<section class="flex flex-col space-y-12">
	<Form bind:text bind:size />
</section>

<section class="my-10 flex flex-col space-y-12">
	<div class="flex self-center bg-gray-50 dark:bg-gray-200 p-4 shadow-inner" style="width:{size}px">
		{#key `${text}-${size}`}
			<QR {text} />
		{/key}
	</div>
</section>

<section class="flex flex-col">
	<p>
		In the <a target="_blank" rel="external noopener" href="https://getaegis.app/"
			>Aegis Authenticator</a
		> app it will look something like this:
	</p>
	<div class="border-y-8 border-gray-200">
		<div class="flex items-center px-4">
			<div
				class="flex h-12 w-12 items-center justify-center rounded-full bg-gray-600 text-2xl font-light text-white"
			>
				H
			</div>
			<div class="flex flex-col p-4">
				<div>
					<span class="font-semibold">hub.docker.com</span>
					<span class="text-gray-400">(vhsdev)</span>
				</div>
				<span class="text-3xl text-blue-600">958 686</span>
			</div>
		</div>
	</div>
</section>

<section class="mt-12 flex flex-col">
	<ul>
		<li>
			Made by <a target="_blank" rel="external noopener" href="https://vhs.codeberg.page">VHS</a>.
		</li>
		<li>
			Get <a target="_blank" rel="external noopener" href="https://codeberg.org/vhs/2fa-qr-svelte">
				the source code.
			</a>
		</li>
		<li>
			Uses <a target="_blank" rel="external noopener" href="https://github.com/jnordberg/svelte-qr"
				>svelte-qr</a
			>
			,
			<a target="_blank" rel="external noopener" href="https://github.com/chainlist/svelte-forms"
				>svelte-forms</a
			>,
			<a target="_blank" rel="external noopener" href="https://tailwindcss.com/">Tailwind CSS</a>
			and
			<a target="_blank" rel="external noopener" href="https://kit.svelte.dev/">SvelteKit</a>.
		</li>
		<li>
			See <a
				target="_blank"
				rel="external noopener nofollow"
				href="https://github.com/google/google-authenticator/wiki/Key-Uri-Format">the docs</a
			> for the URI format.
		</li>
	</ul>
</section>
