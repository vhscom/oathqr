<script lang="ts">
	import { onInterval } from './utils';
	import { exampleLabel, exampleIssuer } from './store';

	let progress: HTMLProgressElement;

	const generate = () => {
		const str = String(Math.random()).slice(3, 9);
		return `${str.slice(0, 3)} ${str.slice(3, 6)}`;
	};

	$: code = generate();

	let counter = 100;
	onInterval(() => {
		counter = counter <= 0 ? 100 : counter;
		progress.value = --counter;
		if (counter === 0) code = generate();
	}, 1000 / 20 /* 20 frames-per-second */);
</script>

<p>
	Scan above QR code with <a target="_blank" rel="external noopener" href="https://getaegis.app/"
		>Aegis Authenticator</a
	>
	to see something like:
</p>
<div class="border-y-8 border-gray-200 dark:border-black/20 dark:bg-gray-900/20">
	<div class="flex items-center px-6 pt-4">
		<div
			class="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-gray-600/60 text-3xl font-light text-white dark:text-gray-300"
		>
			{$exampleIssuer.slice(0, 1).toUpperCase()}
		</div>
		<div class="flex flex-col p-4">
			<div>
				<span class="font-semibold dark:text-gray-300">{$exampleIssuer}</span>
				<span class="text-gray-400 dark:text-gray-500">({$exampleLabel})</span>
			</div>
			<span class="text-3xl font-semibold text-blue-600 dark:text-gray-300">{code}</span>
		</div>
	</div>
	<progress aria-hidden="true" bind:this={progress} class="-mb-2 h-1 w-full" max="100" value="70" />
</div>
