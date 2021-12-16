<script lang="ts">
</script>

<div class="container">
    <img src="https://cdn.discordapp.com/avatars/190142601481945088/a_4a896de9c9af5f4af416ae25ae72f837.gif" alt="Madiator Avatar" />
    <div class="content">
    <h1>About Me</h1>
    <p>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Suscipit maxime, dignissimos magnam debitis, vel ducimus maiores distinctio omnis atque eius accusamus temporibus esse sapiente dolorem nihil a! Temporibus, nemo beatae.
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
        font-size: .9rem;
    }

    .content {
        display: grid;
        grid-auto-flow: row;
        justify-items: left;
        gap: 1em;
        max-width: 35em;
    }

    img {
        grid-area: img;

        width: min(10em, 100%);
        aspect-ratio: 1/1;
        object-fit: cover;
        border-radius: 1000vw;
        isolation: isolate;
    }

    h1 {
        font-size: 1.5em;
    }
</style>
