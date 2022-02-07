<script lang="ts">
	import { issuers, types, algorithms, digits } from './options';
	import QrCode from './QrCode.svelte';

	const [firstType] = types;
	let type = firstType.value;
	const handleTypeChange = ({ target }) => (type = target.value);

	let qrCodeSize = 210;

	let secretValue = '';
	let labelValue = '';
	let issuerValue = '';
	let counterValue: number;

	/**
	 * Consult https://github.com/google/google-authenticator/wiki/Key-Uri-Format
	 * for information on the format used.
	 */
	const encodeKeyUri = (type: string, label: string, issuer: string, secret: string, count = 0) => {
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

	$: qrCodeValue = encodeKeyUri(type, labelValue, issuerValue, secretValue, counterValue);

	let isAdvancedChecked = false;
	const handleAdvancedCheckChange = ({ target }) => {
		isAdvancedChecked = target.checked;
	};
</script>

<form class="flex flex-col space-y-4" autocomplete="off">
	<fieldset class="flex flex-col space-y-4">
		<legend class="sr-only">Choose basic settings</legend>

		<select id="type" class="rounded" on:change={handleTypeChange}>
			{#each types as { name, value } (value)}
				<option {value}>{name}</option>
			{/each}
		</select>

		<input
			class="rounded"
			type="search"
			id="secret"
			bind:value={secretValue}
			placeholder="Secret &mdash; Required"
			spellcheck="false"
		/>

		<input
			class="rounded"
			type="search"
			id="label"
			bind:value={labelValue}
			placeholder="Label &mdash; Required"
			spellcheck="false"
		/>

		<datalist id="issuers">
			{#each issuers as issuer (issuer)}
				<option value={issuer} />
			{/each}
		</datalist>
		<input
			class="rounded"
			type="search"
			id="issuer"
			bind:value={issuerValue}
			placeholder="Issuer &mdash; Optional"
			list="issuers"
			spellcheck="false"
		/>

		{#if type === 'hotp'}
			<input
				class="rounded"
				type="search"
				id="counter"
				bind:value={counterValue}
				placeholder="Initial counter &mdash; Defaults to 0"
				pattern="\d+"
				spellcheck="false"
			/>
		{/if}
	</fieldset>

	<label class="text-sm">
		<input class="mr-1 rounded align-sub" type="checkbox" on:change={handleAdvancedCheckChange} />
		Advanced options
	</label>

	{#if isAdvancedChecked}
		<hr />
		<p class="text-sm">
			Please note that the advanced options are not supported by the Google Authenticator app (all
			advanced options are ignored). Yubico Authenticator supports these advanced options.
		</p>
		<fieldset class="flex flex-col space-y-2" id="advanced_options_container">
			<legend class="sr-only">Choose advanced settings</legend>
			<select class="rounded" id="algorithm">
				{#each algorithms as { name, value } (value)}
					<option {value}>{name}</option>
				{/each}
			</select>
			<select class="rounded" id="digits">
				{#each digits as { name, value } (value)}
					<option {value}>{name}</option>
				{/each}
			</select>
			<input
				class="rounded"
				type="search"
				id="period"
				placeholder="Valid period, in seconds &mdash; Defaults to 30"
				pattern="\d+"
				spellcheck="false"
			/>
		</fieldset>
		<hr />
	{/if}

	<input
		class="rounded"
		type="text"
		id="uri"
		bind:value={qrCodeValue}
		placeholder="otpauth://"
		spellcheck="false"
	/>

	<input
		class="w-full self-center out-of-range:border-red-500"
		type="range"
		id="size"
		bind:value={qrCodeSize}
		min="84"
		max="609"
		step="21"
		title="QR Code Size"
	/>
</form>

<div class="flex self-center">
	<QrCode size={qrCodeSize} value={qrCodeValue} />
</div>
