<script context="module" lang="ts">
    import Image, { ChunkedImageSrc } from "$lib/GlassUI/Image.svelte";
    import Ripple from "$lib/GlassUI/Ripple.svelte";
    import { writable } from "svelte/store";
    import Loading from "./Loading.svelte";

    export type BeforeAfterMode = "preview" | "compare";

    let mouseDown = writable(false);
    if (typeof window !== "undefined") {
        document.addEventListener("mousedown", (e) => e.button === 0 && mouseDown.set(true));
        document.addEventListener("mouseup", () => mouseDown.set(false));
        document.addEventListener("touchstart", (e) => mouseDown.set(true));
        document.addEventListener("touchend", () => mouseDown.set(false));
        document.addEventListener("blur", () => mouseDown.set(false));
        document.addEventListener("visibilitychange", () => mouseDown.set(false));
    }
</script>

<script lang="ts">
    
    export let beforeSrc: ChunkedImageSrc | string = null;
    export let afterSrc: ChunkedImageSrc | string = null;

    export let mode: BeforeAfterMode;

    let progress: number = 50;

    let containerElement: HTMLDivElement;
    function mouse(event: MouseEvent | TouchEvent) {
        if (mode === "preview") return;
        if (event instanceof MouseEvent && !$mouseDown) return;
        event.preventDefault();
        const rect = containerElement.getBoundingClientRect();
        const localX = (event instanceof MouseEvent ? event.x : event.touches[0].pageX) - rect.x;
        progress = (localX / rect.width) * 100;
    }

    let scale: number = 1;
    let positionX: number = 0;
    let positionY: number = 0;
    let beforeLoaded = false;
    let afterLoaded = false;

    $: beforeSrc && (beforeLoaded = false);
    $: afterSrc && (afterLoaded = false);

    function mouseWheel(event: WheelEvent) {
        if (mode === "preview") return;
        event.preventDefault();
        const rect = containerElement.getBoundingClientRect();
        const currentScale = scale;
        scale += event.deltaY * -0.005;
        scale = Math.min(Math.max(1, scale), 10);
        if (event.deltaY < 0) {
            const localX = event.x - rect.x;
            const localY = event.y - rect.y;
            const localXFromCenter = localX - rect.width / 2;
            const localYFromCenter = localY - rect.height / 2;
            const localXOnImageFromCenter = localXFromCenter / currentScale - positionX;
            const localYOnImageFromCenter = localYFromCenter / currentScale - positionY;
            const localXOnImageFromCenterNext = localXFromCenter / scale - positionX;
            const localYOnImageFromCenterNext = localYFromCenter / scale - positionY;

            const vectorX = localXOnImageFromCenterNext - localXOnImageFromCenter;
            const vectorY = localYOnImageFromCenterNext - localYOnImageFromCenter;

            positionX += vectorX;
            positionY += vectorY;
        }

        const minX = rect.width / 2 / scale - rect.width / 2;
        const maxX = -(rect.width / 2) / scale + rect.width / 2;
        positionX = Math.min(Math.max(minX, positionX), maxX);

        const minY = rect.height / 2 / scale - rect.height / 2;
        const maxY = -(rect.height / 2) / scale + rect.height / 2;
        positionY = Math.min(Math.max(minY, positionY), maxY);
    }

    function keyPress(event: KeyboardEvent) {
        switch (event.key) {
            case "a":
            case "ArrowLeft":
                progress -= 10;
                break;
            case "d":
            case "ArrowRight":
                progress += 10;
                break;
        }
        progress = Math.min(Math.max(0, progress), 100);
    }
</script>

<div
    class="container"
    class:mode-preview={mode === "preview"}
    class:mode-compare={mode === "compare"}
    class:before-loading={!beforeLoaded}
    class:after-loading={!afterLoaded}
    class:mouse-down={$mouseDown}
    style="--progress:{progress}%;--scale:{scale};--pos-x:{positionX}px;--pos-y:{positionY}px"
    on:mousemove={mouse}
    on:click={mouse}
    on:touchmove={mouse}
    on:mousewheel={mouseWheel}
    on:keydown={keyPress}
    tabindex="-1"
    bind:this={containerElement}
>
    <div class="images">
        <div class="before image">
            <Image src={beforeSrc} fit={mode === 'preview' ? 'cover' : 'contain'} on:load={() => (beforeLoaded = true)} />
        </div>
        <div class="after image">
            <Image src={afterSrc} fit={mode === 'preview' ? 'cover' : 'contain'} on:load={() => (afterLoaded = true)} />
        </div>
    </div>
    <div class="overlay before-overlay">
        {#if !beforeLoaded}
            <Loading />
        {/if}
    </div>
    <div class="overlay after-overlay">
        {#if !afterLoaded}
            <Loading />
        {/if}
    </div>
    <div class="slider" />
    {#if mode === "preview"}
        <Ripple />
    {/if}
</div>

<style>
    .container {
        --transition-duration: 0.1s;
        --progress-from-center: calc(var(--progress) - 50%);
        --progress-on-image-from-center: calc(var(--progress-from-center) / var(--scale) - var(--pos-x));
        --progress-on-image: calc(var(--progress-on-image-from-center) + 50%);
        width: 100%;
        height: 100%;
        position: relative;
        isolation: isolate;
        overflow: hidden;
        user-select: none;
    }

    .overlay {
        position: absolute;
        inset: 0;
        pointer-events: none;
        display: grid;
        justify-content: center;
        align-items: center;
    }
    .before-overlay {
        right: calc(100% - var(--progress));
    }
    .after-overlay {
        left: var(--progress);
    }

    .mode-preview .overlay {
        display: none;
    }

    .images {
        width: 100%;
        height: 100%;
        transform: scale(var(--scale)) translate(var(--pos-x), var(--pos-y));
    }

    .image {
        height: 100%;
    }

    .container.mouse-down .image {
        pointer-events: none;
    }

    .container:not(.mouse-down) .slider {
        transition: left linear var(--transition-duration);
    }

    .after {
        position: absolute;
        inset: 0;
        clip-path: polygon(var(--progress-on-image) 0%, 100% 0%, 100% 100%, var(--progress-on-image) 100%);
    }

    .after-loading .after{
        backdrop-filter: saturate(0) blur(3px);
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
        transition-duration: var(--transition-duration);
    }

    .mode-preview .slider::before,
    .mode-preview .slider::after {
        content: unset;
    }

    .mode-preview:hover .slider {
        opacity: 1;
    }

    .mode-preview .images {
        transition: transform var(--transition-duration) linear;
    }

    .mode-preview:hover.container {
        --scale: 1.05 !important;
    }

    .mode-preview .image {
        transition: clip-path var(--transition-duration) linear;
        aspect-ratio: 16/10;
    }
</style>
