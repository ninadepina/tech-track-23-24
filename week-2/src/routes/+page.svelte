<script>
    import Map from '$lib/Map.svelte';
</script>

<svelte:head>
    <!-- prettier-ignore -->
    <link href="https://api.mapbox.com/mapbox-gl-js/v2.14.1/mapbox-gl.css" rel="stylesheet" />
    <title>Schiphol</title>
</svelte:head>

<h1>Schiphol</h1>
<Map />

<style>
    h1 {
        position: relative;
        z-index: 1;
    }
</style>
