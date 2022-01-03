<script context="module" lang="ts">
    import Ripple from "$lib/GlassUI/Ripple.svelte";
    import { writable } from "svelte/store";

    export type BeforeAfterMode = "preview" | "compare";

    let mouseDown = writable(false);
    if (typeof window !== "undefined") {
        document.addEventListener("mousedown", () => mouseDown.set(true));
        document.addEventListener("mouseup", () => mouseDown.set(false));
        document.addEventListener("blur", () => mouseDown.set(false));
        document.addEventListener("visibilitychange", () => mouseDown.set(false));
    }
</script>

<script lang="ts">
    export let beforeSrc: string = null;
    export let afterSrc: string = null;

    export let mode: BeforeAfterMode;

    let progress: number = 50;

    let containerElement: HTMLDivElement;
    function mouse(event: MouseEvent | TouchEvent) {
        if (mode === "compare") event.preventDefault();
        if (event instanceof MouseEvent && !$mouseDown) return;
        const rect = containerElement.getBoundingClientRect();
        const localX = (event instanceof MouseEvent ? event.x : event.touches[0].pageX) - rect.x;
        progress = (localX / rect.width) * 100;
    }
</script>

<div
    class="container"
    class:mode-preview={mode === "preview"}
    class:mode-compare={mode === "compare"}
    style="--progress:{progress}%"
    on:mousemove={mouse}
    on:click={mouse}
    on:touchmove={mouse}
    bind:this={containerElement}
>
    <div class="image">
        <img class="before" src={beforeSrc} alt={null} />
        <img class="after" src={afterSrc} alt={null} />
        <div class="slider" />
        {#if mode === "preview"}
            <Ripple />
        {/if}
    </div>
</div>

<style>
    .container {
        --progress: 50%;
        aspect-ratio: 16/9;
        position: relative;
        isolation: isolate;
        overflow: hidden;
        user-select: none;
    }

    .image {
        width: 100%;
        height: 100%;
    }

    img {
        object-position: center;
        object-fit: cover;
        width: 100%;
        height: 100%;
    }

    .container:active img {
        pointer-events: none;
    }

    .before {
        position: absolute;
        inset: 0;
        clip-path: polygon(0% 0%, var(--progress) 0%, var(--progress) 100%, 0% 100%);
    }

    .slider {
        display: flex;
        position: absolute;

        align-items: center;
        justify-content: center;

        width: 1.8em;
        aspect-ratio: 1/1;
        font-size: 2em;

        color: white;
        border: solid currentColor 0.1em;
        border-radius: 1000vw;
        background-color: rgba(0, 0, 0, 0.25);

        top: 50%;
        left: var(--progress);

        transform: translate(-50%, -50%);

        cursor: grab;
    }

    .slider::after {
        content: "< >";
    }

    .slider::before {
        content: "";
        display: block;
        position: absolute;
        height: 100vh;
        border-left: solid currentColor 0.1em;
    }

    .slider:hover {
        background-color: rgba(0, 0, 0, 0.5);
    }

    .container:active .slider {
        cursor: grabbing;
    }

    .mode-preview.container {
        --progress: 40% !important;
    }

    .mode-preview:hover.container {
        --progress: 10% !important;
    }

    .mode-preview .slider {
        border: none;
        width: 0;
        height: 100vh;
        border-left: solid currentColor 0.1em;
        opacity: 0.5;
        transition-property: left, opacity;
        transition-timing-function: linear;
        transition-duration: 0.5s;
    }

    .mode-preview .slider::before,
    .mode-preview .slider::after {
        content: unset;
    }

    .mode-preview:hover .slider {
        opacity: 1;
    }

    .mode-preview .image {
        transition: transform 0.25s linear;
        transform: scale(1);
    }

    .mode-preview:hover .image {
        transform: scale(1.05);
    }

    .mode-preview img {
        transition: clip-path 0.5s linear;
    }
</style>
