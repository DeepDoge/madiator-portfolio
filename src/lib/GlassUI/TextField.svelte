<script lang="ts">
    import { makeid } from "$modules/makeid";
    import GlassPanel from "./GlassElementBackground.svelte";
    import NotAllowed from "./NotAllowed.svelte";

    export const id = makeid(8);

    export let type: "text" | "number" | "tel" | "mail" | "textarea" = "text";

    export let label: string = "";
    export let disabled = false;
    export let value: string | number = type === "number" ? 0 : "";
    export let invalid: string = "";
    export let min: number = null;
    export let max: number = null;
    export let step: number = null;

    export let width: string = "100%";
    export let height: string = "auto";

    let innerInvalid: string = "";

    $: (() => {
        switch (type) {
            case "number":
                if (min !== null && value < min) {
                    value = min;
                }
                if (max !== null && value > max) {
                    value = max;
                }
                break;
            case "mail":
            case "tel":
            case "textarea":
            case "text":
                if (value === "") value = null;
                if (typeof value !== "string") break;
                if (max !== null && min !== null && (value.length > max || value.length < min)) {
                    innerInvalid = `Text length should be between ${min}-${max}`;
                    return;
                }
                if (min !== null && value.length < min) {
                    innerInvalid = `Text length should be bigger than ${min}`;
                    return;
                }
                if (max !== null && value.length > max) {
                    innerInvalid = `Text length should be smaller than ${max}`;
                    return;
                }
                break;
        }
        innerInvalid = "";
    })();
</script>

<span class="container" style="width:{width};height:{height}">
    <slot name="prepend" />
    {#if label}
        <label for={id}>{label}</label>
    {/if}
    <NotAllowed allowed={!disabled}>
        <div class="input-container">
            <GlassPanel />
            {#if type === "textarea"}
                <textarea {disabled} {id} bind:value />
            {:else if type === "number"}
                <input type="number" {disabled} {id} {step} bind:value />
            {:else if type === "text"}
                <input type="text" {disabled} {id} bind:value />
            {:else if type === "tel"}
                <input type="tel" {disabled} {id} bind:value />
            {:else if type === "mail"}
                <input type="mail" {disabled} {id} bind:value />
            {/if}
        </div>
    </NotAllowed>
    {#if innerInvalid || invalid}
        <div class="error">{innerInvalid || invalid}</div>
    {/if}
    <slot name="append" />
</span>

<style>
    .container {
        display: inline-block;
    }

    label {
        display: block;
    }

    input,
    textarea,
    input:focus,
    textarea:focus {
        outline: none;
        border: none;
    }

    input,
    textarea {
        width: 100%;
        height: 100%;
        background: transparent;
        color: currentColor;
        padding: 0;
    }

    .input-container {
        display: inline-flex;
        position: relative;
        width: 100%;
        height: 100%;
        isolation: isolate;
        padding: 0.5em;
        border-radius: var(--g-input-border-radius);
        overflow: hidden;
        box-shadow: var(--g-input-box-shadow);
    }

    .error {
        color: var(--g-error-color);
        font-size: small;
    }
</style>
