<script>
    import SwitchButton from '$lib/SwitchButton.svelte';
    import Map from '$lib/Map.svelte';
    import { map } from '$lib/renderMap.js';

    let labels = ['Dots', 'Lines'];

    let dotsActive = true;
    let linesActive = false;

    const toggleLayer = (oldLayer, newLayer) => {
        const layerMap = {
            Dots: 'other-dots',
            Lines: 'lines-layer'
        };

        const visibilityMap = {
            Dots: dotsActive,
            Lines: linesActive
        };

        visibilityMap[oldLayer] = false;
        visibilityMap[newLayer] = true;

        map.setLayoutProperty(
            layerMap['Dots'],
            'visibility',
            visibilityMap['Dots'] ? 'visible' : 'none'
        );
        map.setLayoutProperty(
            layerMap['Lines'],
            'visibility',
            visibilityMap['Lines'] ? 'visible' : 'none'
        );
    };
</script>

<svelte:head>
    <!-- prettier-ignore -->
    <link href="https://api.mapbox.com/mapbox-gl-js/v2.14.1/mapbox-gl.css" rel="stylesheet" />
    <title>Schiphol</title>
</svelte:head>

<h1>Schiphol destinations</h1>
<SwitchButton {labels} {toggleLayer} />
<Map />

<style>
    h1 {
        position: relative;
        display: inline-block;
        margin: var(--standard-margin);
        padding: 0.1em 0.4em;
        font-weight: var(--font-weight-title);
        color: var(--color-dark);
        background-color: var(--color-light);
        border-radius: var(--border-radius);
        z-index: 1;
    }
</style>
