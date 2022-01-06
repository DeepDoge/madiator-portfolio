<script context="module" lang="ts">
    import { GetShow } from "$/plugins/api";
    import { page } from "$app/stores";
    import BeforeAfterImageCard from "$lib/App/BeforeAfterImageCard.svelte";
    import Row from "$lib/Row.svelte";
    import type { Show } from "../api/get_show";

    export const prerender = true;
</script>

<script lang="ts">
    import Loading from "$lib/App/Loading.svelte";

    const name = $page.params.id;
    let showName: string = name;
    let show: Show = null;
    $: imageKeys = show ? Object.keys(show.images) : [];
    if (typeof window !== "undefined") GetShow(name).then((r) => (show = r));
</script>

<svelte:head>
    <title>Show: {showName}</title>
</svelte:head>

<div class="show">
    <h1><b>Show:</b> <span>{showName}</span></h1>
    {#if show}
        <Row idealSize="30em" gap="1.5em">
            <!-- intead of index im gonna use id later as key -->
            {#each imageKeys as imageKey (imageKey)}
                <BeforeAfterImageCard image={show.images[imageKey].image} text={imageKey[0] === "_" ? null : imageKey} />
            {/each}
        </Row>
    {:else}
        <Loading />
    {/if}
</div>

<style>
    .show {
        display: grid;
        grid-auto-flow: row;
        gap: 2em;
    }

    h1 span {
        text-transform: capitalize;
    }
</style>
