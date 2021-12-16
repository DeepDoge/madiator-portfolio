<script lang="ts">
	import { page } from "$app/stores";

	import AboutMe from "$lib/App/AboutMe.svelte";

	import Glass from "$lib/GlassUI/Glass.svelte";

	import GlassApp from "$lib/GlassUI/GlassApp.svelte";

	import "../app.css";
</script>

<GlassApp dark>
	<div class="layout">
		<div class="background" />
		<main>
			<Glass fill>
				<div class="about-me">
					<AboutMe />
				</div>
			</Glass>

			<content>
				{#if ($page.path ?? "/") !== "/"}
					<a class="home-button" href="/">Home</a>
				{/if}
				<slot />
			</content>
		</main>

		<footer>
			<p>
				visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to learn SvelteKit
			</p>
		</footer>
	</div>
</GlassApp>

<style>
	.layout {
		position: relative;
		isolation: isolate;
		min-height: 100vh;
	}

	.background {
		position: fixed;
		z-index: -1;
		inset: 0;
		background-image: url(/background.jpeg);
		background-size: cover;
		opacity: 0.25;
	}

	main {
		display: grid;
		grid-auto-flow: row;
		gap: 1em;
		justify-items: center;
		width: 100%;
		box-sizing: border-box;
	}
	.about-me {
		display: flex;
		justify-content: center;
		width: 100%;
		padding: clamp(1em, 5%, 3em);
	}

	content {
		display: block;
		width: mind(100em, 100%);
		padding: 1em;
	}

	footer {
		grid-area: footer;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 2em;
	}

	footer a {
		font-weight: bold;
	}
</style>
