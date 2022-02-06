<script lang="ts">
	import { afterUpdate, onMount } from 'svelte';
	import QRious from 'qrious';

	export let size: number;
	export let errorCorrection = 'H';
	export let background = '#fff';
	export let backgroundAlpha = 0.986;
	export let color = '#000';
	export let value = '';
	export let padding = 0;
	export let classes = 'qrcode';

	interface IQrious {
		set: Function;
		toDataURL: Function;
	}

	let qr: IQrious;
	let image: string;

	function generateQrCode() {
		qr.set({
			background,
			foreground: color,
			level: errorCorrection,
			backgroundAlpha,
			padding,
			size,
			value
		});

		image = qr.toDataURL('image/png');
	}

	afterUpdate(() => {
		requestAnimationFrame(() => {
			generateQrCode();
		});
	});

	onMount(() => {
		qr = new QRious();
		generateQrCode();
	});
</script>

<img src={image} alt={value} class={classes} />
