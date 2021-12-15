<script lang="ts">
    import { makeid } from "$modules/makeid";
    import GlassPanel from "./GlassElementBackground.svelte";
    import Ripple from "./Ripple.svelte";

    let id = makeid(8);
    export let label: string;
    export let checked: boolean = false;
    export let value: string | number = null;
    export let group: (string | number)[] = null;

    $: group && value && checked && !group.includes(value) && (group = [...group, value]);
    $: group && value && !checked && (group = group.filter((v) => v !== value));
</script>

<label class="container" for={id}>
    <input type="checkbox" {id} {value} bind:checked />
    <span class="checkbox">
        <GlassPanel />
        <span class="checkmark" />
        <Ripple />
    </span>
    <span class="label">{label}</span>
</label>

<style>
    .container {
        display: inline-flex;
        align-items: center;
        gap: 0.4em;
        cursor: pointer;
    }

    .checkbox {
        display: inline-block;
        position: relative;
        width: 1.5em;
        height: 1.5em;
        border-radius: var(--g-input-border-radius);
        overflow: hidden;
        isolation: isolate;
        box-shadow: var(--g-input-box-shadow);
    }

    .checkbox:hover {
        filter: brightness(105%);
    }

    input + .checkbox .checkmark {
        content: "";
        transform: scale(0);
        background: var(--g-primary-color);
        position: absolute;
        inset: -0.2em;
        border-radius: 1000%;
        transition: transform 0.2s;
    }

    input:checked + .checkbox .checkmark {
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
