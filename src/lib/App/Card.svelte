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
    import GlassContainer from "$lib/GlassUI/GlassContainer.svelte";
    import Modal from "$lib/GlassUI/Modal.svelte";
    import type { BeforeAfterMode } from "./BeforeAfterImage.svelte";
    import BeforeAfterImage from "./BeforeAfterImage.svelte";

    export let card: CardData;
    export let mode: BeforeAfterMode;
</script>

<Modal />

<a href="/show/id">
    <article>
        <GlassContainer fill>
            <div class="image-wrapper">
                <BeforeAfterImage {mode} beforeSrc={card.image.before} afterSrc={card.image.after} />
            </div>
        </GlassContainer>
        <GlassContainer fill>
            <p title={card.text}>{card.text}</p>
        </GlassContainer>
    </article>
</a>

<style>
    article {
        display: grid;
        width: 100%;
        grid-auto-flow: row;
        gap: 0.25em;
        max-height: calc(100vh - 5em);
    }

    p {
        font-size: 0.85rem;
        text-align: center;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
</style>
