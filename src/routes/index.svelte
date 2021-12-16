<script context="module" lang="ts">
	import AboutMe from "$lib/App/AboutMe.svelte";
	import Cards from "$lib/App/Cards.svelte";

	export const prerender = true;
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>

<div id="sections">
	<section id="about-me">
		<AboutMe />
	</section>

	<section id="cards">
		<h1>My Works</h1>
		<Cards />
	</section>
</div>

<style>
	#sections {
		display: grid;
		grid-auto-flow: row;
		gap: 1em;
		justify-items: center;
	}

	#about-me {
		display: flex;
		justify-content: center;
		width: 100%;
		padding: clamp(1em, 5%, 3em);
	}

	#cards {
		width: min(100em, 100%);
	}

	#cards h1 {
		display: block;
		font-size: 2rem;
		padding-bottom: .5em;
		text-align: left;
	}
</style>
