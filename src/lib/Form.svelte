<script lang="ts">
	import { issuers, types, algorithms, digits } from './options';

	const [firstType] = types;
	let type = firstType.value;
	const handleTypeChange = ({ target }) => (type = target.value);

	let isAdvancedChecked = false;
	const handleAdvancedCheckChange = ({ target }) => {
		isAdvancedChecked = target.checked;
	};
</script>

<form class="flex flex-col space-y-4" autocomplete="off">
	<fieldset class="flex flex-col space-y-4">
		<legend class="sr-only">Choose basic settings</legend>

		<select id="type" class="rounded">
			{#each types as { name, value } (value)}
				<option {value}>{name}</option>
			{/each}
		</select>

		<input
			class="rounded"
			type="search"
			id="secret"
			placeholder="Secret &mdash; Required"
			spellcheck="false"
		/>

		<input
			class="rounded"
			type="search"
			id="label"
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
			placeholder="Issuer &mdash; Optional"
			list="issuers"
			spellcheck="false"
		/>

		{#if type === 'hotp'}
			<input
				class="rounded"
				type="search"
				id="counter"
				placeholder="Initial counter &mdash; Defaults to 0"
				pattern="\d+"
				spellcheck="false"
			/>
		{/if}
	</fieldset>

	<label class="text-sm">
		<input class="mr-1 align-sub" type="checkbox" on:change={handleAdvancedCheckChange} />
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

	<input class="rounded" type="text" id="uri" placeholder="otpauth://" spellcheck="false" />

	<input
		class="out-of-range:border-red-500"
		type="range"
		id="size"
		value="200"
		min="50"
		max="650"
		title="QR Code Size"
	/>
</form>
