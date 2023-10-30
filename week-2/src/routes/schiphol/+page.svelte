<script>
    import { onMount } from 'svelte';
    import mapboxgl from 'mapbox-gl';

    onMount(() => {
        mapboxgl.accessToken =
            'pk.eyJ1IjoibmluYWRlcGluYSIsImEiOiJjbG9kN2g4YmgwNzA1MmtwOGNwZ2pmYm5oIn0.ZxK0Rzq_visQwBFGqSWIZA';

        let map = new mapboxgl.Map({
            container: 'map',
            // style: 'mapbox://styles/mapbox/dark-v11',
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [8, 52],
            zoom: 2,
            minZoom: 1.2
        });

        map.addControl(new mapboxgl.NavigationControl());
        map.addControl(new mapboxgl.FullscreenControl());
    });
</script>

<svelte:head>
    <!-- prettier-ignore -->
    <link href="https://api.mapbox.com/mapbox-gl-js/v2.14.1/mapbox-gl.css" rel="stylesheet" />
    <title>Schiphol</title>
</svelte:head>

<h1>Schiphol</h1>
<div id="map" />

<style>
    h1 {
        position: relative;
        z-index: 1;
    }

    #map {
        position: absolute;
        top: 0;
        bottom: 0;
        width: 100%;
        z-index: 0;
    }
</style>
