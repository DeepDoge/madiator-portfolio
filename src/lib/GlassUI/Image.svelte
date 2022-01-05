<script lang="ts">
    import { onDestroy } from "svelte";

    export let src: string = null;
    export let alt: string = null;
    export let fit: 'contain' | 'cover' | 'fill' | 'scale-down' = 'contain'

    let element: HTMLImageElement = null;

    onDestroy(() => element?.removeAttribute("src"));
</script>

<div class="image" style="--fit:{fit};">
    <img bind:this={element} {src} {alt} on:load on:abort on:loadstart />
</div>

<style>
    .image {
        width: 100%;
        height: 100%;
        position: relative;
    }

    img {
        position: absolute;
        width: 100%;
        height: 100%;
        object-fit: var(--fit);
        object-position: center;
    }
</style>