<script context="module" lang="ts">
    import Card from "$lib/App/Card.svelte";
    import { cards } from "$lib/App/cards";
    import Row from "$lib/Row.svelte";

    export const prerender = true;
</script>

<script lang="ts">
    let showName: string = "Show Name";
</script>

<svelte:head>
    <title>{showName}</title>
</svelte:head>

<div class="inner">
    <h1>{showName}</h1>
    <Row idealSize="100%" gap="1.5em">
        <!-- intead of index im gonna use id later as key -->
        {#each cards as card, index (index)}
            <Card mode="compare" {card} />
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
