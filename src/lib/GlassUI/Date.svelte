<script lang="ts">
    import GlassPanel from "$lib/GlassUI/GlassElementBackground.svelte";
    import { makeid } from "$modules/makeid";
    import { onDestroy,onMount } from "svelte";
    import NotAllowed from "./NotAllowed.svelte";

    export let width: string = "100%";
    export let height: string = "auto";
    export let disabled = false;

    let mounted = false;
    onMount(() => (mounted = true));
    onDestroy(() => (mounted = false));

    let id = makeid(8);

    export let label: string;
    export let value: Date = null;
    let inputValue: string;

    $: mounted && !value && (value = new Date());

    const updateInputValue = (value) => {
        if (!value) return;
        let newValue = value.toISOString().split("T")[0];
        if (newValue !== inputValue) inputValue = newValue;
    };

    const updateValue = () => {
        value = new Date(inputValue);
    };

    $: updateInputValue(value);

    export let max: Date = null;
    export let min: Date = null;
</script>

<div class="container" style="width:{width};height:{height}">
    <label for={id}>{label}</label>
    <NotAllowed allowed={!disabled}>
        <div class="input-container">
            <GlassPanel />
            <input
                type="date"
                {disabled}
                bind:value={inputValue}
                on:change={updateValue}
                {id}
                min={min ? min.toISOString().split("T")[0] : null}
                max={max ? max.toISOString().split("T")[0] : null}
            />
        </div>
    </NotAllowed>
</div>

<style>
    .input-container {
        display: inline-block;
        width: 100%;
        height: 100%;
        position: relative;
        padding: 0.5em;
        border-radius: var(--g-input-border-radius);
        isolation: isolate;
        overflow: hidden;
        box-shadow: var(--g-input-box-shadow);
    }

    input {
        display: inline-block;
        width: 100%;
        height: 100%;
        inset: 0;
        background: transparent;
        border: none;
        color: currentColor;
    }
    :global(.dark) input {
        color: black;
        filter: invert();
    }

    input:focus {
        outline: none;
    }
</style>
