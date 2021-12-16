<script context="module" lang="ts">
	import Card from "$lib/App/Card.svelte";
	import { cards } from "$lib/App/cards";
	import GlassContainer from "$lib/GlassUI/GlassContainer.svelte";
	import Row from "$lib/Row.svelte";

	export const prerender = true;
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>

<div class="inner">
	<h1>Shows</h1>
	<Row idealSize="25em" gap="1.5em">
		<!-- intead of index im gonna use id later as key -->
		{#each cards as card, index (index)}
			<Card mode="preview" {card} />
		{/each}
	</Row>
</div>

<style>
	.inner {
		display: grid;
		grid-auto-flow: row;
		gap: 2em;
	}
</style>
