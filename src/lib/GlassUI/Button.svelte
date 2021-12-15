<script lang="ts">
    import { makeid } from "$modules/makeid";
    import NotAllowed from "./NotAllowed.svelte";
    import Ripple from "./Ripple.svelte";

    let id = makeid(8);

    export let fab = false;
    export let text = false;
    export let type: "button" | "submit" = "button";

    export let width: string = "";
    export let height: string = "";

    export let disabled = false;
</script>

<NotAllowed allowed={!disabled}>
    <label for={id} class:fab class:text style="width:{width};height:{height}">
        <input {type} {disabled} {id} on:click|stopPropagation />
        <slot />
        <Ripple {disabled} />
    </label>
</NotAllowed>

<style>
    input {
        position: absolute;
        width: 0;
        height: 0;
        pointer-events: none;
        border: none;
        padding: 0;
        opacity: 0;
    }

    label {
        display: inline-flex;

        justify-content: center;
        align-items: center;
        gap: 0.2em;

        background-color: var(--g-primary-color);
        color: var(--g-primary-text-color);

        padding: 0.5em 1.1em;

        border-radius: var(--g-input-border-radius);

        font-weight: bold;
        text-transform: uppercase;

        transition: box-shadow 1s;

        box-shadow: 0 3px 1px -2px rgb(0 0 0 / 20%), 0 2px 2px 0 rgb(0 0 0 / 14%), 0 1px 5px 0 rgb(0 0 0 / 12%);

        cursor: pointer;

        user-select: none;
    }

    label:not(.disabled):active {
        box-shadow: 0 5px 5px -3px rgb(0 0 0 / 20%), 0 8px 10px 1px rgb(0 0 0 / 14%), 0 3px 14px 2px rgb(0 0 0 / 12%);
    }

    label:not(.disabled):hover {
        filter: brightness(105%);
    }

    .fab {
        padding: 10px;
        width: 50px;
        height: 50px;
        border-radius: 1000%;
    }

    .text,
    .text:hover,
    .text:active {
        color: currentColor;
        background: transparent;
        padding: 0;
        border-radius: unset;
        box-shadow: unset;
    }

    .text:hover::before {
        content: "";
        position: absolute;
        inset: 0;
        background: var(--g-text-color);
        filter: opacity(0.1);
    }
</style>
