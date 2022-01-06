<script lang="ts">
    import Image from "$lib/GlassUI/Img.svelte";
</script>

<div class="container">
    <div class="image">
        <Image src="https://cdn.discordapp.com/avatars/190142601481945088/a_4a896de9c9af5f4af416ae25ae72f837.gif" fit="cover" alt="Madiator Avatar" />
    </div>
    <div class="content">
        <h1>About Me</h1>
        <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Suscipit maxime, dignissimos magnam debitis, vel ducimus maiores distinctio omnis atque eius accusamus
            temporibus esse sapiente dolorem nihil a! Temporibus, nemo beatae.
        </p>
    </div>
</div>

<style>
    .container {
        display: flex;
        flex-wrap: wrap;
        width: 100%;

        gap: 1.5em;

        align-items: center;
        justify-content: center;
        font-size: 0.9rem;
    }

    .content {
        display: grid;
        grid-auto-flow: row;
        justify-items: left;
        gap: 1em;
        max-width: 35em;
    }

    .image {
        grid-area: img;

        width: min(10em, 100%);
        aspect-ratio: 1/1;
        border-radius: 1000vw;
        overflow: hidden;
    }

    h1 {
        font-size: 1.5em;
    }
</style>
