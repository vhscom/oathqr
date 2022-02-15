<script>
	import '../app.css';
</script>

<svelte:head>
	<title>OATHqr</title>
	<meta name="author" content="VHS" />
	<meta name="description" content="Turn your secrets into scannable QR codes." />
	<meta name="robots" content="noindex,follow" />
	<meta name="theme-color" content="#799832" />
	<base target="_blank" />
	<link rel="manifest" href="manifest.json" />
</svelte:head>

<div class="prose prose-oath mx-auto p-4 dark:prose-invert">
	<slot />
</div>
