<script lang="ts">
    import Glass from "./Glass.svelte";

    export let fill: boolean = false;
</script>

<div class="glass-wrapper" class:fill>
    <Glass {fill}>
        <div class="glass-container">
            <slot />
        </div>
    </Glass>
</div>

<style>
    .glass-wrapper {
        border-radius: var(--g-input-border-radius);
        overflow: hidden;
        isolation: isolate;
    }

    .glass-wrapper.fill,
    .fill .glass-container {
        width: 100%;
        height: 100%;
    }

    .glass-container {
        padding: .75em;
    }
</style>
