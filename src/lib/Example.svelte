<script lang="ts">
	import { onMount } from 'svelte';

	let progress: HTMLProgressElement;
	const getCode = () => {
		const str = String(Math.random()).slice(3, 9);
		return `${str.slice(0, 3)} ${str.slice(3, 6)}`;
	};
	let code = getCode();

	onMount(() => {
		const speed = 1000 / 20; // 20fps
		const countdown = () => {
			let value = 100;
			let id = setInterval(frame, speed);
			function frame() {
				if (value <= 0) {
					clearInterval(id);
					code = getCode();
					countdown();
				} else {
					value--;
					requestAnimationFrame(() => (progress.value = value));
				}
			}
		};
		countdown();
	});
</script>

<p>
	In the <a target="_blank" rel="external noopener" href="https://getaegis.app/"
		>Aegis Authenticator</a
	> app it will look something like this:
</p>
<div class="border-y-8 border-gray-200 dark:border-black dark:bg-gray-900">
	<div class="flex items-center px-4">
		<div
			class="flex h-12 w-12 items-center justify-center rounded-full bg-gray-600 text-2xl font-light text-white"
		>
			H
		</div>
		<div class="flex flex-col p-4">
			<div>
				<span class="font-semibold">hub.docker.com</span>
				<span class="text-gray-400">(vhsdev)</span>
			</div>
			<span class="text-3xl text-blue-600 font-semibold">{code}</span>
		</div>
	</div>
	<progress bind:this={progress} class="h-1 w-full -mb-2" max="100" value="70" />
</div>
