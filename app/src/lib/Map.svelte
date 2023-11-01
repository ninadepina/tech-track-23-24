<script>
    import { onMount } from 'svelte';
    // import mapboxgl from 'mapbox-gl';
    // import { initializeMap } from '$lib/mapbox.js';
    import { renderMap } from '$lib/render.js';

    // let map;

    onMount(() => {
        // map = initializeMap();
        renderMap();
        // map.addControl(new mapboxgl.NavigationControl());
        // map.addControl(new mapboxgl.FullscreenControl());
    });
</script>

<div id="map" />

<style>
    #map {
        position: absolute;
        top: 0;
        bottom: 0;
        width: 100%;
        z-index: 0;
    }
</style>
