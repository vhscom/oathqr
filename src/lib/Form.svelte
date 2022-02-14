<script lang="ts">
	import { afterUpdate } from 'svelte';
	import { exampleIssuer, exampleLabel } from './store';
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

	let slider: HTMLInputElement;
	let authstring: HTMLInputElement;

	export let size: number;
	export let text: string;

	$: uri = text;

	const secret = field('secret', '', [required()]);
	const label = field('label', '', [required()]);

	let issuer = null;
	let counter = null;
	let algorithm = 'SHA1';
	let digits = 6;
	let period = 30;

	const example = {
		issuer: $exampleIssuer,
		label: $exampleLabel
	};

	$: {
		$exampleIssuer = issuer ? issuer : example.issuer;
		$exampleLabel = $label.value ? $label.value : example.label;
	}

	let isAdvancedChecked = false;

	afterUpdate(() => {
		const min = Number(slider.min);
		const max = Number(slider.max);
		const val = Number(slider.value);
		slider.style.backgroundSize = `${((val - min) * 100) / (max - min)}% 100%`;

		const periodWithDefault = period ?? 30;
		const counterWithDefault = counter ?? 0;

		const args = [type, $label.value, issuer, $secret.value, counterWithDefault];
		if (isAdvancedChecked) {
			if (type !== 'hotp') {
				text = formatUri.apply(null, [...args, algorithm, digits, periodWithDefault]);
			} else {
				text = formatUri.apply(null, [...args, algorithm, digits]);
			}
		} else {
			text = formatUri.apply(null, [...args]);
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
			{#each issuerOptions as issuerOption (issuerOption)}
				<option value={issuerOption} />
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

	<div class="relative flex">
		<div class="flex flex-1 flex-col">
			<label for="uri" class="sr-only">URI</label>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="absolute top-2.5 left-1 h-5 w-8 border-r pr-1 text-gray-300 dark:border-r-oath-500 dark:text-oath-50/20"
				viewBox="0 0 20 20"
				fill="currentColor"
			>
				<path
					fill-rule="evenodd"
					d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
					clip-rule="evenodd"
				/>
			</svg>
			<input
				readonly
				class="rounded pl-11 text-sm shadow-inner"
				type="text"
				id="uri"
				bind:this={authstring}
				bind:value={uri}
				placeholder="otpauth://"
			/>
		</div>
		<button
			on:click|preventDefault={() => authstring.select()}
			class="absolute right-1.5 top-1/2 -mt-3.5 rounded bg-gray-100 px-4 py-1 text-sm text-gray-500 ring-blue-600 hover:bg-gray-200 focus:outline-none focus:ring-1 dark:bg-oath-900 dark:text-[#799832] dark:hover:bg-oath-950"
		>
			Select
		</button>
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
			max="330"
			step="10"
		/>
		<output class="w-8 rounded text-sm">{size}</output>
	</div>
</form>
