<script lang="ts">
    import GlassElementBackground from "./GlassElementBackground.svelte";
    import Ripple from "./Ripple.svelte";

    export let photoSrc: string = null;
    export let hidePhoto: boolean = false;
    export let compact: boolean = false;
    export let title: string = null;
    export let href: string = null;
</script>

<a class="container" on:click on:focus on:mouseout on:mouseover {href}>
    <div class="inner" class:compact>
        <Ripple />
        <GlassElementBackground />
        {#if !hidePhoto}
            <div class="photo">
                {#if photoSrc}
                    <img src={photoSrc} alt={title} />
                {/if}
            </div>
        {/if}

        <div class="content">
            {#if title}
                <div class="title">
                    {title}
                </div>
            {/if}
            <div class="details">
                <slot />
            </div>
        </div>

        <div class="append">
            <slot name="append" />
        </div>
    </div>
</a>

<style>
    a {
        color: var(--g-text-color);
    }
    a:hover {
        text-decoration: none;
    }

    .container {
        cursor: pointer;
    }

    .inner {
        display: flex;
        padding: 0.5em;
        gap: 0.5em;
        position: relative;
        isolation: isolate;
        border-radius: var(--g-input-border-radius);
        overflow: hidden;
    }

    .title {
        font-weight: bold;
    }

    .details:empty {
        display: none;
    }

    .content {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        min-height: 2.8em;
    }

    .photo {
        width: 2.8em;
        aspect-ratio: 1/1;
        border-radius: 1000%;
        background-color: var(--g-primary-color);
    }

    .append {
        display: flex;
        flex-grow: 1;
        align-items: center;
        justify-content: flex-end;
    }

    .inner.compact .photo {
        width: 2em;
    }

    .inner.compact .content {
        min-height: unset;
    }
</style>
