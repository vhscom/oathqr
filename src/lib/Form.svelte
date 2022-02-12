<script lang="ts">
	import { afterUpdate } from 'svelte';
	import {
		issuers as issuerOptions,
		types as typeOptions,
		algorithms as algorithmOptions,
		digits as digitsOptions,
		periods as periodOptions
	} from './options';
	import { formatUri } from './utils';

	import { field, style } from 'svelte-forms';
	import { required } from 'svelte-forms/validators';

	const [firstType] = typeOptions;
	let type = firstType.value;
	const handleTypeChange = ({ target }) => (type = target.value);

	export let size: number;
	export let text: string;

	let slider: HTMLInputElement;

	$: uri = text;

	const secret = field('secret', '', [required()]);
	const label = field('label', '', [required()]);

	let issuer = null;
	let counter = null;
	let algorithm = 'SHA1';
	let digits = 6;
	let period = 30;

	let isAdvancedChecked = false;

	afterUpdate(() => {
		const min = Number(slider.min);
		const max = Number(slider.max);
		const val = Number(slider.value);
		slider.style.backgroundSize = `${((val - min) * 100) / (max - min)}% 100%`;

		const periodWithDefault = period ?? 30;
		const counterWithDefault = counter ?? 0;
		if (isAdvancedChecked) {
			if (type !== 'hotp') {
				text = formatUri(
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
				text = formatUri(
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
			text = formatUri(type, $label.value, issuer, $secret.value, counterWithDefault);
		}
	});
</script>

<form class="flex flex-col space-y-4" autocomplete="off" spellcheck="false">
	<fieldset class="flex flex-col space-y-2">
		<legend class="sr-only">Choose basic settings</legend>

		<div class="flex flex-col">
			<label for="type" class="mb-1 text-sm">Type</label>
			<select id="type" class="rounded text-sm shadow-inner" on:change={handleTypeChange}>
				{#each typeOptions as { name, value } (value)}
					<option {value}>{name}</option>
				{/each}
			</select>
		</div>

		<div class="flex flex-col">
			<label for="secret" class="mb-1 text-sm">Secret</label>
			<input
				class="validated rounded text-sm shadow-inner"
				type="text"
				id="secret"
				bind:value={$secret.value}
				placeholder="JBSWY3DPEHPK3PXP"
				use:style={{ field: secret }}
			/>
			{#if !$secret.valid}
				<div class="mt-1 text-sm">A secret is required.</div>
			{/if}
		</div>

		<div class="flex flex-col">
			<label for="label" class="mb-1 text-sm">Label</label>
			<input
				class="validated rounded text-sm shadow-inner"
				type="text"
				id="label"
				bind:value={$label.value}
				placeholder="vhsdev@tutanota.com"
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

		<div class="flex flex-col">
			<label for="issuer" class="mb-1 text-sm">Issuer</label>
			<input
				class="rounded text-sm shadow-inner"
				type="text"
				id="issuer"
				bind:value={issuer}
				placeholder="hub.docker.com"
				list="issuers"
			/>
		</div>

		{#if type === 'hotp'}
			<div class="flex flex-col">
				<label for="issuer" class="mb-1 text-sm">Counter</label>
				<input
					class="rounded text-sm shadow-inner"
					type="number"
					id="counter"
					bind:value={counter}
					placeholder="0"
				/>
			</div>
		{/if}
	</fieldset>

	<label class="text-sm">
		<input
			class="mr-1 rounded align-sub text-sm shadow-inner"
			type="checkbox"
			bind:checked={isAdvancedChecked}
		/>
		Advanced options
	</label>

	{#if isAdvancedChecked}
		<hr />
		<p class="text-sm">
			Advanced options are ignored by Google Authenticator but may be supported by other
			authenticator apps. Yubico, for example, is known to support these options.
		</p>
		<fieldset class="flex flex-col space-y-2">
			<legend class="sr-only">Choose advanced settings</legend>

			<div class="flex flex-col">
				<label for="algorithm" class="mb-1 text-sm">Algorithm</label>
				<select class="rounded text-sm shadow-inner" id="algorithm" bind:value={algorithm}>
					{#each algorithmOptions as { name, value } (value)}
						<option {value}>{name}</option>
					{/each}
				</select>
			</div>

			<div class="flex flex-col">
				<label for="digits" class="mb-1 text-sm">Digits</label>
				<select class="rounded text-sm shadow-inner" id="digits" bind:value={digits}>
					{#each digitsOptions as { name, value } (value)}
						<option {value}>{name}</option>
					{/each}
				</select>
			</div>
			{#if type !== 'hotp'}
				<div class="flex flex-col">
					<label for="period" class="mb-1 text-sm">Period</label>
					<select
						class="rounded text-sm shadow-inner"
						type="number"
						id="period"
						bind:value={period}
						placeholder="30"
					>
						{#each periodOptions as { name, value } (value)}
							<option {value}>{name}</option>
						{/each}
					</select>
				</div>
			{/if}
		</fieldset>
		<hr />
	{/if}

	<div class="flex flex-col">
		<label for="uri" class="sr-only">URI</label>
		<input
			readonly
			class="rounded text-sm shadow-inner"
			type="text"
			id="uri"
			bind:value={uri}
			placeholder="otpauth://"
		/>
	</div>

	<div class="flex">
		<label for="uri" class="w-12 text-sm">Size</label>
		<input
			class="w-full self-center"
			type="range"
			id="size"
			bind:value={size}
			bind:this={slider}
			min="180"
			max="360"
			step="15"
		/>
		<output class="w-8 rounded text-sm">{size}</output>
	</div>
</form>
