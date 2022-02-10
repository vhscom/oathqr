/**
 * Consult https://github.com/google/google-authenticator/wiki/Key-Uri-Format
 * for information on the format used.
 */
export const encodeKeyUri = (
	type: string,
	label: string,
	issuer: string,
	secret: string,
	counter: number,
	algorithm?: string,
	digits?: number,
	period?: number
) => {
	let uri = `otpauth://${type}/${encodeURIComponent(label)}?secret=${secret.replace(/\s/g, '')}`;
	if (issuer) uri = `${uri}&issuer=${encodeURIComponent(issuer)}`;
	if (type === 'hotp') uri = `${uri}&counter=${counter}`;
	if (algorithm) uri = `${uri}&algorithm=${algorithm}`;
	if (digits) uri = `${uri}&digits=${digits}`;
	if (period) uri = `${uri}&period=${period}`;

	return uri;
};
