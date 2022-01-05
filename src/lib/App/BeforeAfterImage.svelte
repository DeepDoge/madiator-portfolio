<script context="module" lang="ts">
    import Ripple from "$lib/GlassUI/Ripple.svelte";
    import { writable } from "svelte/store";

    export type BeforeAfterMode = "preview" | "compare";

    let mouseDown = writable(false);
    if (typeof window !== "undefined") {
        document.addEventListener("mousedown", (e) => e.button === 0 && mouseDown.set(true));
        document.addEventListener("mouseup", () => mouseDown.set(false));
        document.addEventListener("blur", () => mouseDown.set(false));
        document.addEventListener("visibilitychange", () => mouseDown.set(false));
    }
</script>

<script lang="ts">
    import Loading from "./Loading.svelte";

    export let beforeSrc: string = null;
    export let afterSrc: string = null;

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
    let beforeLoading = false;
    let afterLoading = false;

    $: beforeLoading = !!beforeSrc;
    $: afterLoading = !!afterSrc;

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
    class:before-loading={beforeLoading}
    class:after-loading={afterLoading}
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
    <div class="image">
        <img class="before" src={beforeSrc} alt={null} on:load={() => (beforeLoading = false)} />
        <img class="after" src={afterSrc} alt={null} on:load={() => (afterLoading = false)} />
        <div class="overlay before-overlay">
            {#if beforeLoading}
                <Loading />
            {/if}
        </div>
        <div class="overlay after-overlay">
            {#if afterLoading}
                <Loading />
            {/if}
        </div>
    </div>
    <div class="slider" />
    {#if mode === "preview"}
        <Ripple />
    {/if}
</div>

<style>
    .container {
        --transition-duration: 0.1s;
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

    .image {
        position: relative;
        width: 100%;
        height: 100%;
        transform: scale(var(--scale)) translate(var(--pos-x), var(--pos-y));
    }

    img {
        object-position: center;
        object-fit: contain;
        width: 100%;
        height: 100%;
    }

    .container.mouse-down img {
        pointer-events: none;
    }

    .container:not(:active) .slider {
        transition: left linear var(--transition-duration);
    }

    .after {
        position: absolute;
        inset: 0;
        --from-center: calc(var(--progress) - 50%);
        --on-image: calc(var(--from-center) / var(--scale) - var(--pos-x));
        --v: calc(var(--on-image) + 50%);
        clip-path: polygon(var(--v) 0%, 100% 0%, 100% 100%, var(--v) 100%);
    }

    .after-loading .after {
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

    .mode-preview .image {
        transition: transform var(--transition-duration) linear;
    }

    .mode-preview:hover.container {
        --scale: 1.05 !important;
    }

    .mode-preview img {
        transition: clip-path var(--transition-duration) linear;
        aspect-ratio: 16/10;
        object-fit: cover;
    }
</style>
