<script lang="ts">
	import GlassApp from "$lib/GlassUI/GlassApp.svelte";
	import "../app.css";
</script>

<GlassApp dark>
	<div class="layout">
		<main>
			<slot />
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

	main {
		grid-area: main;
		display: flex;
		flex-direction: column;
		gap: 1em;
		padding: 1.5em;
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
