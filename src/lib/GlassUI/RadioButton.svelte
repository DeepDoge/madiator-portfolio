<script lang="ts">
    import { makeid } from "$modules/makeid";
    import GlassPanel from "./GlassElementBackground.svelte";
    import Ripple from "./Ripple.svelte";

    let id = makeid(8);
    export let label: string = null;
    export let group: string | number = null;
    export let value: string | number;
</script>

<label for={id}>
    <input type="radio" {id} {value} bind:group />
    <slot checked={value === group}>
        <div class="container">
            <span class="radio-button">
                <GlassPanel />
                <span class="checkmark" />
                <Ripple />
            </span>
            <span class="label">{label}</span>
        </div>
    </slot>
</label>

<style>
    label {
        width: 100%;
    }

    .container {
        display: inline-flex;
        align-items: center;
        gap: 0.4em;
        cursor: pointer;
    }

    .radio-button {
        display: inline-block;
        position: relative;
        width: 1.5em;
        height: 1.5em;
        border-radius: 1000%;
        overflow: hidden;
        isolation: isolate;
        box-shadow: var(--g-input-box-shadow);
    }

    .radio-button:hover {
        filter: brightness(105%);
    }

    input + * .radio-button .checkmark {
        content: "";
        transform: scale(0);
        background: var(--g-primary-color);
        position: absolute;
        inset: 0;
        border-radius: 1000%;
        transition: transform 0.2s;
    }

    input:checked + * .radio-button .checkmark {
        transform: scale(1);
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
