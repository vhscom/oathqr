import { onDestroy } from 'svelte';

export const formatUri = (
	type: string,
	label: string,
	issuer: string,
	secret: string,
	counter: number,
	algorithm?: string,
	digits?: number,
	period?: number
) => {
	let uri = `otpauth://${type}/${encodeURIComponent(label)}?secret=${encodeURIComponent(
		secret.replace(/\s/g, '')
	)}`;
	if (issuer) uri = `${uri}&issuer=${encodeURIComponent(issuer)}`;
	if (type === 'hotp') uri = `${uri}&counter=${counter}`;
	if (algorithm) uri = `${uri}&algorithm=${algorithm}`;
	if (digits) uri = `${uri}&digits=${digits}`;
	if (period) uri = `${uri}&period=${period}`;

	return uri;
};

export function onInterval(callback: Function, milliseconds: number) {
	const interval = setInterval(callback, milliseconds);

	onDestroy(() => {
		clearInterval(interval);
	});
}
