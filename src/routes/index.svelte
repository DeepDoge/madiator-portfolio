<script context="module" lang="ts">
	import { GetShows } from "$/plugins/api";
	import { ToResizedPath } from "$/plugins/resize/common";
	import Card from "$lib/App/Card.svelte";
	import Row from "$lib/Row.svelte";
	import type { ShowInfo } from "./api/get_shows";

	export const prerender = true;
</script>

<script lang="ts">
	import Loading from "$lib/App/Loading.svelte";

	let showInfos: ShowInfo[] = null;
	if (typeof window !== "undefined") GetShows().then((r) => (showInfos = r));
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>

<div class="shows">
	<h1>Shows</h1>
	{#if showInfos}
		<Row idealSize="30em" gap="1.5em">
			<!-- intead of index im gonna use id later as key -->
			{#each showInfos as showInfo (showInfo.name)}
				<a class="show-info" href="/show/{showInfo.name}">
					<Card text={showInfo.name}>
						<img src={ToResizedPath(showInfo.thumbnail, 500)} alt={showInfo.name} />
					</Card>
				</a>
			{/each}
		</Row>
	{:else}
		<Loading />
	{/if}
</div>

<style>
	.shows {
		display: grid;
		grid-auto-flow: row;
		gap: 2em;
	}

	.show-info {
		display: block;
		width: 100%;
	}

	img {
		object-fit: contain;
		object-position: center;
		width: 100%;
		height: 100%;
		aspect-ratio: 16/10;
	}
</style>
