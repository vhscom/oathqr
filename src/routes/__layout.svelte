<script>
	import '../app.css';
</script>

<svelte:head>
	<title>OATHgen</title>
	<meta name="author" content="VHS" />
	<meta name="description" content="Turn your secrets into scannable QR codes." />
	<meta name="robots" content="noindex,follow" />
	<base target="_blank" />
</svelte:head>

<div class="prose prose-oath mx-auto p-4 dark:prose-invert">
	<slot />
</div>
