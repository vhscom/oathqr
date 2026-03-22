export interface OathParams {
	type: "totp" | "hotp";
	secret: string;
	label: string;
	issuer: string;
	algorithm: string;
	digits: number;
	period: number;
	counter: number;
}

export function formatUri(params: OathParams): string {
	const { type, secret, label, issuer, algorithm, digits, period, counter } =
		params;

	if (!secret || !label) return "";

	const encodedLabel = encodeURIComponent(
		issuer ? `${issuer}:${label}` : label,
	);

	const search = new URLSearchParams();
	search.set("secret", secret.replace(/\s/g, "").toUpperCase());
	if (issuer) search.set("issuer", issuer);
	if (algorithm !== "SHA1") search.set("algorithm", algorithm);
	if (digits !== 6) search.set("digits", String(digits));
	if (type === "totp" && period !== 30) search.set("period", String(period));
	if (type === "hotp") search.set("counter", String(counter));

	return `otpauth://${type}/${encodedLabel}?${search.toString()}`;
}
