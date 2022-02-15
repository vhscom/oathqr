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
	import AnnotationSolidIcon from './icons/AnnotationSolidIcon.svelte';
	import LockSolidIcon from './icons/LockSolidIcon.svelte';
	import LinkSolidIcon from './icons/LinkSolidIcon.svelte';

	const [firstType] = typeOptions;
	let type = firstType.value;
	const handleTypeChange = ({ target }) => (type = target.value);

	let sliderInput: HTMLInputElement;
	let uriInput: HTMLInputElement;
	let uriInputButton: HTMLButtonElement;
	let secretInput: HTMLInputElement;

	const handleSecretButtonClick = ({ currentTarget }) => {
		if (secretInput.type === 'password') {
			currentTarget.textContent = 'Hide';
			secretInput.type = 'text';
		} else {
			currentTarget.textContent = 'Show';
			secretInput.type = 'password';
		}
	};

	const handleSecretInput = ({ currentTarget }) => {
		if (currentTarget.value) {
			uriInput.type = 'password';
			uriInputButton.textContent = 'Show';
		} else {
			uriInput.type = 'text';
			uriInputButton.textContent = 'Select';
		}
	};

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
		const min = Number(sliderInput.min);
		const max = Number(sliderInput.max);
		const val = Number(sliderInput.value);
		sliderInput.style.backgroundSize = `${((val - min) * 100) / (max - min)}% 100%`;

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
			<div class="relative flex flex-col">
				<LockSolidIcon
					classes="absolute top-2 left-1 h-5 w-8 border-r pr-1 text-gray-300 dark:border-r-oath-500 dark:text-oath-50/20"
				/>
				<input
					class="validated rounded pl-11 text-sm shadow-inner"
					type="password"
					id="secret"
					bind:this={secretInput}
					bind:value={$secret.value}
					on:input={handleSecretInput}
					placeholder="JBSWY3DPEHPK3PXP"
					use:style={{ field: secret }}
				/>
				<button
					on:click|preventDefault={handleSecretButtonClick}
					class="absolute right-1.5 top-1/2 -mt-3.5 rounded bg-gray-100 px-4 py-1 text-sm text-gray-500 ring-blue-600 hover:bg-gray-200 focus:outline-none focus:ring-1 dark:bg-oath-900 dark:text-[#799832] dark:hover:bg-oath-950"
				>
					Show
				</button>
			</div>
			{#if !$secret.valid}
				<div class="mt-1 text-sm">A secret is required.</div>
			{/if}
		</div>

		<div class="flex flex-col">
			<label for="label" class="mb-1 text-sm">Label</label>
			<div class="relative flex flex-col">
				<AnnotationSolidIcon
					classes="absolute top-2 left-1 h-5 w-8 border-r pr-1 text-gray-300 dark:border-r-oath-500 dark:text-oath-50/20"
				/>
				<input
					class="validated rounded pl-11 text-sm shadow-inner"
					type="text"
					id="label"
					bind:value={$label.value}
					placeholder="vhsdev@tutanota.com"
					use:style={{ field: label }}
				/>
			</div>
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

	<div class="flex flex-col">
		<label for="uri" class="sr-only">URI</label>
		<div class="relative flex flex-col">
			<LinkSolidIcon
				classes="absolute top-2 left-1 h-5 w-8 border-r pr-1 text-gray-300 dark:border-r-oath-500 dark:text-oath-50/20"
			/>
			<input
				readonly
				class="rounded pl-11 text-sm shadow-inner"
				type="text"
				id="uri"
				bind:this={uriInput}
				bind:value={uri}
				placeholder="otpauth://"
			/>
			<button
				bind:this={uriInputButton}
				on:click|preventDefault={({ currentTarget }) => {
					if (uriInput.type === 'password') {
						uriInput.type = 'text';
						currentTarget.textContent = 'Select';
					} else if (currentTarget.textContent === 'Select') {
						uriInput.select();
						currentTarget.textContent = 'Hide';
					} else {
						uriInput.type = 'password';
						uriInput.blur();
						currentTarget.textContent = 'Show';
					}
				}}
				class="absolute right-1.5 top-1/2 -mt-3.5 rounded bg-gray-100 px-4 py-1 text-sm text-gray-500 ring-blue-600 hover:bg-gray-200 focus:outline-none focus:ring-1 dark:bg-oath-900 dark:text-[#799832] dark:hover:bg-oath-950"
			>
				{uriInput?.type === 'password' ? 'Show' : 'Select'}
			</button>
		</div>
	</div>

	<div class="flex">
		<label for="uri" class="w-12 text-sm">Size</label>
		<input
			class="w-full self-center"
			type="range"
			id="size"
			bind:value={size}
			bind:this={sliderInput}
			min="180"
			max="330"
			step="10"
		/>
		<output class="w-8 rounded text-sm">{size}</output>
	</div>
</form>
