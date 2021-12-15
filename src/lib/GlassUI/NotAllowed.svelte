<script lang="ts">
    export let allowed: boolean = false;
</script>

<div class:not-allowed={!allowed}>
    <slot />
</div>

<style>
    div {
        all: inherit;
        padding: 0;
        margin: 0;
        outline: none;
        background: transparent;
        border: none;
    }

    .not-allowed {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .not-allowed > :global(*) {
        pointer-events: none;
    }
</style>
