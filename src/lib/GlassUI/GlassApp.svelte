<script lang="ts">
    export let dark: boolean = false;
</script>

<div id="glass-app" class:dark>
    <slot />
</div>

<style>
    @import "@fontsource/fira-mono";

    :global(:root) {
        font-family: Arial, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
        --font-mono: "Fira Mono", monospace;
        --g-input-box-shadow: 0 0px 5px 0 rgb(0 0 0 / 12%);
        --g-input-border-radius: 1rem;
    }

    #glass-app :global(*) {
        box-sizing: border-box;
    }

    :global(#glass-app),
    :global(.light.g-theme-root) {
        --g-primary-color: #ff3e00;
        --g-primary-text-color: #fff;
        --g-accent-color: #ff3e00;
        --g-accent-text-color: #fff;

        --g-body-color: #b4b7c0;
        --g-background-color: #edf0f8;
        --g-text-color: #444444;

        --g-info-color: blue;
        --g-error-color: red;
        --g-warning-color: yellow;
    }

    #glass-app.dark,
    :global(.dark.g-theme-root) {
        --g-primary-color: #ff3e00;
        --g-primary-text-color: #fff;
        --g-accent-color: #ff3e00;
        --g-accent-text-color: #fff;

        --g-body-color: rgb(20, 20, 20);
        --g-background-color: #000;
        --g-text-color: #edf0f8;

        --g-info-color: blue;
        --g-error-color: red;
        --g-warning-color: yellow;
    }

    #glass-app {
        min-height: 100%;
        width: 100%;
        background-color: var(--g-body-color);
        color: var(--g-text-color);
    }

    :global(h1),
    :global(h2),
    :global(p) {
        font-weight: 400;
        color: var(--g-text-color);
        margin: 0;
    }

    :global(img) {
        display: block;
        max-width: 100%;
    }

    :global(p) {
        line-height: 1.5;
    }

    :global(a) {
        color: var(--g-accent-color);
        text-decoration: none;
        cursor: pointer;
    }

    :global(a):hover {
        text-decoration: underline;
    }

    :global(h1) {
        font-size: 2rem;
        text-align: center;
    }

    :global(h2) {
        font-size: 1.8rem;
    }

    :global(pre) {
        font-size: 1rem;
        font-family: var(--font-mono);
        background-color: rgba(255, 255, 255, 0.45);
        border-radius: 0.4em;
        box-shadow: 2px 2px 6px rgb(255 255 255 / 25%);
        padding: 0.5em;
        overflow-x: auto;
        color: var(--g-text-color);
    }

    :global(input),
    :global(button) {
        font-size: inherit;
        font-family: inherit;
    }

    :global(button):focus:not(:focus-visible) {
        outline: none;
    }

    @media (min-width: 720px) {
        :global(h1) {
            font-size: 2.4rem;
        }
    }
</style>
