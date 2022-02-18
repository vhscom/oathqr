/// <reference types="@sveltejs/kit" />

declare module 'svelte-qr';

interface ImportMetaEnv {
	OATH_BUILD_TARGET: string;
}

// See https://kit.svelte.dev/docs#typescript
// for information about these interfaces
declare namespace App {
	interface Locals {}

	interface Platform {}

	interface Session {}

	interface Stuff {}
}
