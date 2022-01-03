<script lang="ts">
    export let type: "fit" | "fill" = "fill";
    export let idealSize: string = "0px";
    export let gap: string = ".1em";
</script>

<div class="row" style="--ideal-size:{idealSize};--gap:{gap};--type:auto-{type}">
    <slot />
</div>

<style>
    .row {
        display: grid;
        width: 100%;
        grid-template-columns: repeat(var(--type), minmax(min(var(--ideal-size), 100%), 1fr));
        gap: var(--gap);
        justify-items: center;
    }
</style>
