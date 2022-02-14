<script lang="ts">
	import { page } from '$app/stores';
	import { hasTrustedOrigin } from './utils';
</script>

{#if hasTrustedOrigin($page.url.origin)}
	<p class="text-sm">
		<b>Usage instructions: </b>App running on trusted origin {$page.url.origin}. Fill out the form
		below to generate your <code>otpauth</code> URI string and corresponding scannable QR code.
	</p>
{:else}
	<p class="text-sm">
		<b>Usage instructions:</b> Build from source (link below), and generate and scan your QR code
		once you've reviewed the README and application source. OATHqr uses a strict
		<a
			rel="external noopener"
			tabindex="-1"
			href="https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP">Content-Security Policy</a
		> to ensure conforming browsers cannot communicate outside the loopback interface.
	</p>
{/if}
