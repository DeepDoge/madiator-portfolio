<script context="module" lang="ts">
    export interface CardData {
        image: {
            before: string;
            after: string;
        };
        text?: string;
    }
</script>

<script lang="ts">
    import BeforeAfterImage from "./BeforeAfterImage.svelte";

    export let card: CardData;
</script>

<article>
    <BeforeAfterImage beforeSrc={card.image.before} afterSrc={card.image.after} />
    <p>{card.text}</p>
</article>

<style>
    article {
        display: grid;
        grid-auto-flow: row;
        gap: .5em
    }

    p {
        font-size: 0.85rem;
        text-align: center;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        padding: 0 1em;
    }
</style>
