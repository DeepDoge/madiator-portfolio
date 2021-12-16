<script lang="ts">
    export let beforeSrc: string = null;
    export let afterSrc: string = null;

    let progress: number = 50;

    let containerElement: HTMLDivElement;
    function mouse(event: MouseEvent | TouchEvent) {
        if (event instanceof MouseEvent && event.buttons !== 1) return
        if (event instanceof TouchEvent) console.log(event.touches[0])
        const rect = containerElement.getBoundingClientRect();
        const localX = (event instanceof MouseEvent ? event.x : event.touches[0].pageX) - rect.x;
        progress = (localX / rect.width) * 100;
    }
</script>

<div class="container" style="--progress:{progress}%" on:mousemove={mouse} on:click|preventDefault={mouse} on:touchmove={mouse} bind:this={containerElement}>
    <img class="before" src={beforeSrc} alt={null} />
    <img class="after" src={afterSrc} alt={null} />
    <div class="slider">{`< >`}</div>
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

    img {
        object-position: top left;
        object-fit: cover;
        width: 100%;
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
        border: solid currentColor .1em;
        border-radius: 1000vw;
        background-color: rgba(0, 0, 0, 0.25);
        
        top: 50%;
        left: var(--progress);

        transform: translate(-50%, -50%);

        cursor: grab;
    }

    .slider::before
    {
        content: '';
        display: block;
        position: absolute;
        height: 100vh;
        border-left: solid currentColor .1em;
    }

    .slider:hover {
        background-color: rgba(0, 0, 0, 0.5);
    }

    .container:active .slider {
        cursor: grabbing;
    }
</style>
