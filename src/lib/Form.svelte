<script lang="ts">
	import { afterUpdate } from 'svelte';
	import {
		issuers as issuerOptions,
		types as typeOptions,
		algorithms as algorithmOptions,
		digits as digitsOptions
	} from './options';
	import { encodeKeyUri } from './utils';

	import { field, style } from 'svelte-forms';
	import { required } from 'svelte-forms/validators';

	const [firstType] = typeOptions;
	let type = firstType.value;
	const handleTypeChange = ({ target }) => (type = target.value);

	export let size: number;
	export let text: string;

	const secret = field('secret', '', [required()]);
	const label = field('label', '', [required()]);
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
					$label.value,
					issuer,
					$secret.value,
					counterWithDefault,
					algorithm,
					digits,
					periodWithDefault
				);
			} else {
				text = encodeKeyUri(
					type,
					$label.value,
					issuer,
					$secret.value,
					counterWithDefault,
					algorithm,
					digits
				);
			}
		} else {
			text = encodeKeyUri(type, $label.value, issuer, $secret.value, counterWithDefault);
		}
	});
</script>

<form class="flex flex-col space-y-4" autocomplete="off" spellcheck="false">
	<fieldset class="flex flex-col space-y-4">
		<legend class="sr-only">Choose basic settings</legend>

		<select id="type" class="rounded" on:change={handleTypeChange}>
			{#each typeOptions as { name, value } (value)}
				<option {value}>{name}</option>
			{/each}
		</select>

		<div class="flex flex-col">
			<input
				class="validated rounded"
				type="text"
				id="secret"
				bind:value={$secret.value}
				placeholder="Secret &mdash; Required"
				use:style={{ field: secret }}
			/>
			{#if !$secret.valid}
				<div class="mt-1 text-sm">A secret is required.</div>
			{/if}
		</div>

		<div class="flex flex-col">
			<input
				class="validated rounded"
				type="text"
				id="label"
				bind:value={$label.value}
				placeholder="Label &mdash; Required"
				use:style={{ field: label }}
			/>
			{#if !$label.valid}
				<div class="mt-1 text-sm">A label is required.</div>
			{/if}
		</div>

		<datalist id="issuers">
			{#each issuerOptions as issuer (issuer)}
				<option value={issuer} />
			{/each}
		</datalist>

		<input
			class="rounded"
			type="text"
			id="issuer"
			bind:value={issuer}
			placeholder="Issuer &mdash; Optional"
			list="issuers"
		/>

		{#if type === 'hotp'}
			<input
				class="rounded"
				type="number"
				id="counter"
				bind:value={counter}
				placeholder="Initial counter &mdash; Defaults to 0"
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
				/>
			{/if}
		</fieldset>
		<hr />
	{/if}

	<input readonly class="rounded" type="text" id="uri" bind:value={uri} placeholder="otpauth://" />

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
