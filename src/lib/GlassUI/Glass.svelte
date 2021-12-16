<script lang="ts">
    export let dark = false;
    export let fill = false;
</script>

<div class="g-theme-root container" class:fill class:dark>
    <span class="color-layer" />
    <span class="blur-layer" />
    <div class="content">
        <slot />
    </div>
</div>

<style>
    .container {
        position: relative;
        isolation: isolate;
    }

    .fill,
    .fill .content {
        min-width: 100%;
        min-height: 100%;
    }

    .blur-layer,
    .color-layer {
        position: absolute;
        inset: 0;
        z-index: -1;
    }

    .blur-layer {
        backdrop-filter: blur(50px);
    }

    .color-layer {
        filter: opacity(.5);
    }

    .color-layer {
        background: var(--g-background-color);
    }

    .content {
        color: var(--g-text-color);
    }
</style>
