<script lang="ts">
    import { ToResizedPath } from "$/plugins/resize/common";
import GlassContainer from "$lib/GlassUI/GlassContainer.svelte";

    import Modal from "$lib/GlassUI/Modal.svelte";

    import BeforeAfterImage from "./BeforeAfterImage.svelte";

    import Card from "./Card.svelte";

    export let image: { before: string; after: string } = null;
    export let text: string = null;
    let modalActive = false;
</script>

<Card on:click={() => (modalActive = true)} {text}>
    <BeforeAfterImage mode={"preview"} beforeSrc={ToResizedPath(image.before, 500)} afterSrc={ToResizedPath(image.after, 500)} />
</Card>
<Modal idealWidth="fit-content" bind:active={modalActive}>
    <div class="modal-content">
        <Card {text}>
            <BeforeAfterImage mode={"compare"} beforeSrc={image.before} afterSrc={image.after} />
        </Card>
    </div>
</Modal>

<style>
    .modal-content {
        display: flex;
        justify-content: center;
        width: min(calc(100vw - 2em), 80em);
        height: min(calc(100vh - 4em), 50em);
    }
</style>
