<script lang="ts">
    import GlassContainer from "$lib/GlassUI/GlassContainer.svelte";
    import Modal from "$lib/GlassUI/Modal.svelte";

    export let text: string = null;
</script>

<Modal />

<div class="card" on:click>
    <GlassContainer fill>
        <div class="image-wrapper">
            <slot />
        </div>
    </GlassContainer>
    {#if text}
        <GlassContainer>
            <p title={text}>{text}</p>
        </GlassContainer>
    {/if}
</div>

<style>
    .card {
        display: grid;
        width: 100%;
        grid-template-rows: 1fr auto;
        justify-items: center;
        gap: 0.25em;
    }

    .image-wrapper {
        display: block;
        width: 100%;
        height: 100%;
    }

    p {
        padding: 0 1em;
        font-size: 1.1rem;
        text-align: center;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        text-transform: capitalize;
        font-weight: bold;
    }
</style>
