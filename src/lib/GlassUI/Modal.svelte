<!-- svelte-ignore module-script-reactive-declaration -->
<script lang="ts">
    export let active = false;
    export let idealWidth: string = "auto";

    let modalElement: HTMLDivElement;
    const appendBottom = () => modalElement && document.querySelector("#glass-app").appendChild(modalElement);
    $: modalElement && appendBottom();
    $: key = active && Math.random()
</script>

{#if active}
    <div bind:this={modalElement} class="modal">
        <div
            class="background"
            on:click={() => {
                active = false;
            }}
        />
        <div class="content" style="--ideal-width:{idealWidth};">
            <slot />
        </div>
    </div>
{/if}

<style>
    .modal {
        position: fixed;
        inset: 0;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    /* :global(#glass-app > .modal:not(:last-of-type) > .content) {
        transform: translateX(-10vw) scale(0.75);
        filter: opacity(0.9);
    } */

    .background {
        content: "";
        display: block;
        position: absolute;
        inset: 0;
        background-color: var(--g-background-color);
        opacity: 0.5;
    }

    .content {
        width: min(var(--ideal-width), calc(100% - 1em));
        max-height: 100%;
        overflow: auto;
        transition-property: transform, filter;
        transition-duration: 0.5s;
        transition-timing-function: ease-in-out;
    }
</style>
