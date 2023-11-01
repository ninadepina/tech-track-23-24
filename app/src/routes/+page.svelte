<script>
    import Map from '$lib/Map.svelte';
</script>

<svelte:head>
    <!-- prettier-ignore -->
    <link href="https://api.mapbox.com/mapbox-gl-js/v2.14.1/mapbox-gl.css" rel="stylesheet" />
    <title>Schiphol</title>
</svelte:head>

<h1>Schiphol destinations</h1>
<Map />

<style>
    h1 {
        position: relative;
        display: inline-block;
        margin: 0.625rem;
        padding: 0.1em 0.4em;
        font-weight: 600;
        color: #333;
        background-color: #fff;
        border-radius: 0.25rem;
        z-index: 1;
    }
</style>
