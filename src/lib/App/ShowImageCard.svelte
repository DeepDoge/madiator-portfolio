<script lang="ts">
    import { GetChunkInfo, ToResizedPath } from "$/plugins/resize/common";
    import type { ChunkedImageSrc } from "$lib/GlassUI/Image.svelte";
    import Modal from "$lib/GlassUI/Modal.svelte";
    import BeforeAfterImage from "./BeforeAfterImage.svelte";
    import Card from "./Card.svelte";

    export let image: { before: string; after: string } = null;
    export let text: string = null;
    let modalActive = false;

    let afterChunkSrc: ChunkedImageSrc = null
    $: modalActive && GetChunkedImageSrc(image.after)
    
    async function GetChunkedImageSrc(src: string)
    {
        const info = await GetChunkInfo(src, 360)
        const images: ChunkedImageSrc['images'] = []
        let areaLeft = info.height
        for (let i = 0; i < info.images.length; i++)
        {
            images.push({
                area: (areaLeft > info.chunkSize ? info.chunkSize : areaLeft) / info.height,
                url: info.images[i]
            })
            areaLeft -= info.chunkSize
        }

        if (!modalActive) return
        afterChunkSrc = {
            images,
            direction: 'vertical',
            width: info.width,
            height: info.height
        }
    }
</script>

<Card on:click={() => (modalActive = true)} {text}>
    <BeforeAfterImage mode={"preview"} beforeSrc={ToResizedPath(image.before, 200)} afterSrc={ToResizedPath(image.after, 500)} />
</Card>
<Modal bind:active={modalActive}>
    <div class="modal-content">
        <Card {text}>
            <BeforeAfterImage mode={"compare"} beforeSrc={image.before} afterSrc={afterChunkSrc ?? image.before} />
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
