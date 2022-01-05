<script lang="ts">
    import { ToResizedPath } from "$/plugins/resize/common";
    import Modal from "$lib/GlassUI/Modal.svelte";
    import BeforeAfterImage from "./BeforeAfterImage.svelte";
    import Card from "./Card.svelte";

    export let image: { before: string; after: string } = null;
    export let text: string = null;
    let modalActive = false;
    let afterImgBlobUrl: string = null

    let modalAbortController: AbortController = null
    $: onModal(modalActive)
    async function onModal(active: boolean)
    {
        if (active)
        {
            modalAbortController?.abort()
            modalAbortController = new AbortController()
            if (afterImgBlobUrl) return
            const respose = await fetch(image.after, { signal: modalAbortController.signal, cache: 'default' })
            afterImgBlobUrl = URL.createObjectURL(await respose.blob())
        }
        else
        {
            modalAbortController.abort()
        }
    }

</script>

<Card on:click={() => (modalActive = true)} {text}>
    <BeforeAfterImage mode={"preview"} beforeSrc={ToResizedPath(image.before, 200)} afterSrc={ToResizedPath(image.after, 500)} />
</Card>
<Modal bind:active={modalActive}>
    <div class="modal-content">
        <Card {text}>
            <BeforeAfterImage mode={"compare"} beforeSrc={image.before} afterSrc={afterImgBlobUrl} />
        </Card>
    </div>
</Modal>

<style>
    .modal-content {
        display: flex;
        justify-content: center;
        width: min(100vw - 2em, 100vh - 4em);
        aspect-ratio: 1/1;
    }
</style>
