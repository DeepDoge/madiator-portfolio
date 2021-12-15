<script lang="ts">
	import ModalRouteViewer from "$lib/App/ModalRouteViewer.svelte";
	import GlassApp from "$lib/GlassUI/GlassApp.svelte";
	import "../app.css";
</script>

<GlassApp dark>
	<div class="layout">
		<div class="background" />
		<div class="container">
			<main>
				<slot />
			</main>

			<footer>
				<p>
					visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to learn SvelteKit
				</p>
			</footer>
		</div>
	</div>
	<ModalRouteViewer />
</GlassApp>

<style>
	.layout {
		position: relative;
		isolation: isolate;
	}

	.background {
		position: fixed;
		inset: 0;
		z-index: -1;
		background-image: url(/background.jpg);
		background-size: cover;
		background-position: center;
		opacity: 0.5;
		filter: saturate(2);
	}

	.container {
		min-height: 100vh;
		width: 100%;

		display: grid;
		grid-template:
			"sidebar main" minmax(100vh, auto)
			"sidebar footer" auto / auto 1fr;
	}

	main {
		grid-area: main;
		display: flex;
		flex-direction: column;
		gap: 1em;
		padding: 0.5em;
		width: 100%;
		box-sizing: border-box;
	}

	footer {
		grid-area: footer;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 40px;
	}

	footer a {
		font-weight: bold;
	}

	@media (min-width: 480px) {
		footer {
			padding: 40px 0;
		}
	}
</style>
