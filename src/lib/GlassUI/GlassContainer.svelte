<script lang="ts">
    import Glass from "./Glass.svelte";

    export let fill: boolean = false;
</script>

<div class="glass-wrapper" class:fill>
    <Glass>
        <div class="glass-container">
            <slot />
        </div>
    </Glass>
</div>

<style>
    .glass-wrapper {
        width: fit-content;
        border-radius: var(--g-input-border-radius);
        overflow: hidden;
        isolation: isolate;
    }

    .glass-container {
        padding: .75em;
    }

    .fill.glass-wrapper {
        width: 100%;
    }
</style>
