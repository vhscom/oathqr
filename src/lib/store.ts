import { writable, readable } from 'svelte/store';

export const exampleLabel = writable('vhsdev@tutanota.com');
export const exampleIssuer = writable('hub.docker.com');
export const isShieldActive = writable(false);
export const isNative = readable(import.meta.env.OATH_BUILD_TARGET === 'native');
