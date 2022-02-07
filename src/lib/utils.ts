/**
 * Consult https://github.com/google/google-authenticator/wiki/Key-Uri-Format
 * for information on the format used.
 */
export const encodeKeyUri = (
	type: string,
	label: string,
	issuer: string,
	secret: string,
	count: number
) => {
	let uri = 'otpauth://';
	const encodedLabel = encodeURI(label);
	const encodedSecret = secret.replace(/\s/g, '');

	uri = `${uri}${type}/${encodedLabel}?secret=${encodedSecret}`;
	if (issuer) {
		uri = `${uri}&issuer=${encodeURI(issuer)}`;
	}
	if (type === 'hotp') {
		uri = `${uri}&counter=${!isNaN(count) ? count : 0}`;
	}

	return uri;
};
