<script lang="ts">
	import { afterUpdate } from 'svelte';
	import {
		issuers as issuerOptions,
		types as typeOptions,
		algorithms as algorithmOptions,
		digits as digitsOptions
	} from './options';
	import { encodeKeyUri } from './utils';

	const [firstType] = typeOptions;
	let type = firstType.value;
	const handleTypeChange = ({ target }) => (type = target.value);

	export let size: number;
	export let text: string;

	let secret = '';
	let label = '';
	let issuer = '';
	let counter = null;
	let algorithm = 'SHA1';
	let digits = 6;
	let period = null;

	$: uri = text;

	let isAdvancedChecked = false;
	const handleAdvancedCheckChange = ({ target }) => {
		isAdvancedChecked = target.checked;
	};

	afterUpdate(() => {
		const periodWithDefault = period ?? 30;
		const counterWithDefault = counter ?? 0;
		if (isAdvancedChecked) {
			if (type !== 'hotp') {
				text = encodeKeyUri(
					type,
					label,
					issuer,
					secret,
					counterWithDefault,
					algorithm,
					digits,
					periodWithDefault
				);
			} else {
				text = encodeKeyUri(type, label, issuer, secret, counterWithDefault, algorithm, digits);
			}
		} else {
			text = encodeKeyUri(type, label, issuer, secret, counterWithDefault);
		}
	});
</script>

<form class="flex flex-col space-y-4" autocomplete="off">
	<fieldset class="flex flex-col space-y-4">
		<legend class="sr-only">Choose basic settings</legend>

		<select id="type" class="rounded" on:change={handleTypeChange}>
			{#each typeOptions as { name, value } (value)}
				<option {value}>{name}</option>
			{/each}
		</select>

		<input
			class="rounded"
			type="search"
			id="secret"
			bind:value={secret}
			placeholder="Secret &mdash; Required"
			spellcheck="false"
		/>

		<input
			class="rounded"
			type="search"
			id="label"
			bind:value={label}
			placeholder="Label &mdash; Required"
			spellcheck="false"
		/>

		<datalist id="issuers">
			{#each issuerOptions as issuer (issuer)}
				<option value={issuer} />
			{/each}
		</datalist>

		<input
			class="rounded"
			type="search"
			id="issuer"
			bind:value={issuer}
			placeholder="Issuer &mdash; Optional"
			list="issuers"
			spellcheck="false"
		/>

		{#if type === 'hotp'}
			<input
				class="rounded"
				type="search"
				id="counter"
				bind:value={counter}
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
		<fieldset class="flex flex-col space-y-2">
			<legend class="sr-only">Choose advanced settings</legend>
			<select class="rounded" id="algorithm" bind:value={algorithm}>
				{#each algorithmOptions as { name, value } (value)}
					<option {value}>{name}</option>
				{/each}
			</select>
			<select class="rounded" id="digits" bind:value={digits}>
				{#each digitsOptions as { name, value } (value)}
					<option {value}>{name}</option>
				{/each}
			</select>
			{#if type !== 'hotp'}
				<input
					class="rounded"
					type="number"
					id="period"
					bind:value={period}
					placeholder="Valid period, in seconds &mdash; Defaults to 30"
					pattern="\d+"
					spellcheck="false"
				/>
			{/if}
		</fieldset>
		<hr />
	{/if}

	<input
		class="rounded"
		type="text"
		id="uri"
		bind:value={uri}
		placeholder="otpauth://"
		spellcheck="false"
	/>

	<input
		class="w-full self-center out-of-range:border-red-500"
		type="range"
		id="size"
		bind:value={size}
		min="84"
		max="609"
		step="21"
		title="QR Code Size"
	/>
</form>
