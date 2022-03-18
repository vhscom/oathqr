export const types = [
	{ name: 'Time-based (TOTP)', value: 'totp' },
	{ name: 'Counter-based (HOTP)', value: 'hotp' }
];

export const algorithms = [
	{ name: 'SHA1 algorithm', value: 'SHA1' },
	{ name: 'SHA256 algorithm', value: 'SHA256' },
	{ name: 'SHA512 algorithm', value: 'SHA512' }
];
export const digits = [
	{ name: '6 digits', value: 6 },
	{ name: '7 digits', value: 7 },
	{ name: '8 digits', value: 8 }
];

export const periods = [
	{ name: '15 seconds', value: 15 },
	{ name: '30 seconds', value: 30 },
	{ name: '60 seconds', value: 60 }
];

export const issuers = [
	'Amazon',
	'Apple',
	'Atlassian',
	'AWS',
	'Bitwarden',
	'Blizzard',
	'Cloudflare',
	'Codeberg',
	'Coinbase',
	'DigitalOcean',
	'Discord',
	'Docker',
	'DreamHost',
	'Dropbox',
	'EA',
	'eBay',
	'Epic Games',
	'EVE Online',
	'Evernote',
	'Facebook',
	'Fastly',
	'Firefox',
	'GitHub',
	'GitLab',
	'GoDaddy',
	'Google',
	'Heroku',
	'Humble Bundle',
	'LastPass',
	'MailChimp',
	'Mailgun',
	'MaxCDN',
	'Microsoft',
	'Namecheap',
	'Newegg',
	'npm',
	'Okta',
	'Private Internet Access',
	'ProtonMail',
	'Reddit',
	'Ring',
	'Salesforce',
	'SendGrid',
	'Segment',
	'Slack',
	'SparkPost',
	'Stripe',
	'Threat Stack',
	'Ting',
	'Tutanota',
	'Twitch',
	'Twitter',
	'Ubisoft',
	'Ubuntu',
	'Yahoo!'
];
