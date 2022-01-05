<script context="module" lang="ts">
    interface ImageSrc {
        area: number;
        url: string;
    }
    export interface ChunkedImageSrc {
        images: ImageSrc[];
        direction: "vertical" | "horizontal";
    }
</script>

<script lang="ts">
    import { onDestroy } from "svelte";

    export let src: string | ChunkedImageSrc = null;
    export let alt: string = null;
    export let fit: "contain" | "cover" | "fill" | "scale-down" = "contain";

    let element: HTMLImageElement = null;

    let chunkedImagesToLoad: ChunkedImageSrc["images"] = [];
    $: typeof src === "object" ? chunkedImagesToLoad.push(src.images[0]) : (chunkedImagesToLoad = []);

    function onChunkLoad(loadedChunk: number) {
        if (typeof src !== "object") return;
        if (chunkedImagesToLoad.length >= src.images.length) return;
        chunkedImagesToLoad = [...chunkedImagesToLoad, src.images[loadedChunk + 1]];
    }

    onDestroy(() => element?.removeAttribute("src"));
</script>

<div class="image" style="--fit:{fit};">
    {#if typeof src === "string"}
        <img bind:this={element} {src} {alt} on:load on:abort on:loadstart />
    {:else}
        {#each chunkedImagesToLoad as image, i (i)}
            <img
                bind:this={element}
                class="chunk"
                src={image.url}
                {alt}
                on:load
                on:abort
                on:loadstart
                style="--area:{image.area};--offset-area:{i * src.images[0].area}"
                on:load={() => onChunkLoad(i)}
            />
        {/each}
    {/if}
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

    img.chunk {
        height: calc(var(--area) * 100%);
        top: calc(var(--offset-area) * 100%);
        left: 0;
    }
</style>
