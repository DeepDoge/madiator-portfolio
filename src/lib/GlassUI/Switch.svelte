<script lang="ts">
    import { makeid } from "$modules/makeid";
    import GlassPanel from "./GlassElementBackground.svelte";
    import Ripple from "./Ripple.svelte";

    let id = makeid(8);
    export let checked: boolean = false;
</script>

<label class="container" for={id}>
    <input type="checkbox" {id} bind:checked />
    <span class="switch">
        <GlassPanel />
        <span class="toggle">
            <Ripple center />
        </span>
    </span>
</label>

<style>
    .container {
        display: inline-flex;
        align-items: center;
        isolation: isolate;
        cursor: pointer;
    }

    .switch {
        display: inline-block;
        position: relative;
        width: 55px;
        height: 30px;
        border-radius: 60px;
        overflow: hidden;
        box-shadow: var(--g-input-box-shadow);
    }

    .switch:hover {
        filter: brightness(105%);
    }

    .toggle {
        content: "";

        position: absolute;
        height: 100%;
        aspect-ratio: 1/1;
        border-radius: 1000%;
        background: var(--g-primary-color);
        filter: saturate(0) opacity(0.3);

        transform: translateX(0);
        left: 0;

        transition: transform, left, filter;
        transition-duration: 0.2s;
    }

    input:checked + .switch .toggle {
        transform: translateX(-100%);
        left: 100%;
        filter: none;
    }

    .switch::after {
        content: "";
        display: block;
        position: absolute;
        left: 0;
        width: 0%;
        height: 100%;
        background: var(--g-primary-color);
        filter: opacity(0.3);

        transition: width, filter;
        transition-duration: 0.2s;

        z-index: -1;
    }

    input:checked + .switch::after {
        width: 100%;
    }

    input {
        opacity: 0;
        pointer-events: none;
        width: 0;
        height: 0;
        margin: 0;
        position: absolute;
    }
</style>
