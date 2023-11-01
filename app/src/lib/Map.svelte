<script>
    import { onMount } from 'svelte';
    import { renderMap } from '$lib/renderMap.js';

    onMount(() => {
        renderMap();
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
