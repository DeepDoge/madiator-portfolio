<script lang="ts">
    import Row from "$lib/Row.svelte";
    import Card from "./Card.svelte";
    import type { CardData } from "./Card.svelte";

    export let cards: CardData[] = [
        {
            image: {
                before: "https://i.imgsli.com/images/a91dde1a-29ee-4eab-8e9d-cde8ac822f26.png",
                after: "https://i.imgsli.com/images/9bb3306a-900d-4cab-ab51-76698122fc61.png",
            },
            text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Suscipit maxime, dignissimos magnam debitis, vel ducimus maiores",
        },
        {
            image: {
                before: "https://i.imgsli.com/images/a91dde1a-29ee-4eab-8e9d-cde8ac822f26.png",
                after: "https://i.imgsli.com/images/9bb3306a-900d-4cab-ab51-76698122fc61.png",
            },
            text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Suscipit maxime, dignissimos magnam debitis, vel ducimus maiores",
        },
        {
            image: {
                before: "https://i.imgsli.com/images/a91dde1a-29ee-4eab-8e9d-cde8ac822f26.png",
                after: "https://i.imgsli.com/images/9bb3306a-900d-4cab-ab51-76698122fc61.png",
            },
            text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Suscipit maxime, dignissimos magnam debitis, vel ducimus maiores",
        },
        {
            image: {
                before: "https://i.imgsli.com/images/a91dde1a-29ee-4eab-8e9d-cde8ac822f26.png",
                after: "https://i.imgsli.com/images/9bb3306a-900d-4cab-ab51-76698122fc61.png",
            },
            text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Suscipit maxime, dignissimos magnam debitis, vel ducimus maiores",
        },
        {
            image: {
                before: "https://i.imgsli.com/images/a91dde1a-29ee-4eab-8e9d-cde8ac822f26.png",
                after: "https://i.imgsli.com/images/9bb3306a-900d-4cab-ab51-76698122fc61.png",
            },
            text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Suscipit maxime, dignissimos magnam debitis, vel ducimus maiores",
        },
        {
            image: {
                before: "https://i.imgsli.com/images/a91dde1a-29ee-4eab-8e9d-cde8ac822f26.png",
                after: "https://i.imgsli.com/images/9bb3306a-900d-4cab-ab51-76698122fc61.png",
            },
            text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Suscipit maxime, dignissimos magnam debitis, vel ducimus maiores",
        },

    ];
</script>

<Row idealSize="30em" gap="1.5em">
    <!-- intead of index im gonna use id later as key -->
    {#each cards as card, index (index)}
        <Card {card} />
    {/each}
</Row>
