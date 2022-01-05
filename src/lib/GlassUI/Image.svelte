<script context="module" lang="ts">
    interface ImageSrc {
        area: number;
        url: string;
    }
    export interface ChunkedImageSrc {
        images: ImageSrc[];
        direction: "vertical" | "horizontal";
        width: number;
        height: number;
    }
</script>

<script lang="ts">
    import { beforeUpdate, createEventDispatcher, onDestroy } from "svelte";
    import { subscribe } from "svelte/internal";
    import { Subscriber } from "svelte/store";
    const dispatch = createEventDispatcher();

    export let src: string | ChunkedImageSrc = null;
    export let alt: string = null;
    export let fit: "contain" | "cover" | "fill" | "scale-down" = "contain";

    let elements: HTMLImageElement[] = [];
    let loadedCount = 0;

    let srcCache = null;
    $: onSrcChange(src);
    function onSrcChange(value: typeof src) {
        if (src === srcCache) return;
        srcCache = src;
        loadedCount = typeof value === "object" ? 1 : 0;
    }
    function onChunkLoad(event: Event) {
        if (typeof src !== "object") return;
        if (src.images.length === ++loadedCount) dispatch("load", event);
    }

    onDestroy(() => {
        for (const element of elements) element?.removeAttribute("src");
        elements = [];
    });
</script>

<div class="image" style="--fit:{fit};">
    {#if typeof src === "string"}
        <img bind:this={elements[0]} {src} {alt} on:load on:abort on:loadstart />
    {:else}
        <div
            class="chunks"
            class:vertical-chunks={src.direction === "vertical"}
            class:horizontal-chunks={src.direction === "horizontal"}
            class:vertical={src.height >= src.width}
            class:horizontal={src.height < src.width}
            style="--width:{src.width};--height:{src.height}"
        >
            {#each src.images as image, i (image.url)}
                {#if i < loadedCount}
                    <img
                        bind:this={elements[i]}
                        class="chunk"
                        src={image.url}
                        {alt}
                        on:abort
                        on:loadstart
                        style="--area:{image.area};--offset-area:{i * src.images[0].area}"
                        on:load={(event) => onChunkLoad(event)}
                    />
                {/if}
            {/each}
        </div>
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

    .chunks.horizontal {
        position: absolute;
        width: 100%;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        aspect-ratio: var(--width) / var(--height);
    }

    .chunks.vertical {
        height: 100%;
    }

    .vertical-chunks img.chunk {
        height: calc(var(--area) * 100%);
        top: calc(var(--offset-area) * 100%);
        left: 0;
    }

    .horizontal-chunks img.chunk {
        width: calc(var(--area) * 100%);
        left: calc(var(--offset-area) * 100%);
        top: 0;
    }
</style>
