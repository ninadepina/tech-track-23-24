<script>
    import { onMount } from 'svelte';
    import LayerSwitchButton from '$lib/LayerSwitchButton.svelte';
    import StyleSwitchButton from '$lib/StyleSwitchButton.svelte';
    import Search from '$lib/Search.svelte';
    import Map from '$lib/Map.svelte';
    import { map, coordinatesData } from '$lib/renderMap.js';

    let labelsLayer = ['Dots', 'Lines'];

    let dotsActive = true;
    let linesActive = false;
    // prettier-ignore
    const toggleLayer = (oldLayer, newLayer) => {
        map.getSource('lines').setData({
            type: 'FeatureCollection',
            features: coordinatesData.map((coords) => ({
                type: 'Feature',
                properties: {
                    index: coords.index
                },
                geometry: {
                    type: 'LineString',
                    coordinates: [
                        coords.coordinates,
                        coordinatesData[0].coordinates
                    ]
                }
            }))
        });

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

        map.setLayoutProperty(layerMap['Dots'], 'visibility', visibilityMap['Dots'] ? 'visible' : 'none');
        map.setLayoutProperty(layerMap['Lines'], 'visibility', visibilityMap['Lines'] ? 'visible' : 'none');
    };
    // prettier-ignore
    onMount(() => {
        const scaleControl = document.querySelector('.mapboxgl-ctrl.mapboxgl-ctrl-scale');
        
        document.querySelector('.mapboxgl-ctrl-bottom-left').removeChild(scaleControl);
        document.querySelector('.mapboxgl-ctrl-bottom-right').appendChild(scaleControl);

        const layerList = document.getElementById('menu');
        const inputs = layerList.getElementsByTagName('input');

        for (const input of inputs) {
            input.addEventListener('click', (e) => {
                const layerId = e.target.id;
                const currentLayerUrl = map.getStyle().sprite.split('/');

                if (currentLayerUrl[currentLayerUrl.length - 1] !== layerId) {
                    map.setStyle('mapbox://styles/mapbox/' + layerId);
                    document.querySelector('#radio-Dots').checked = true;
                }
            });
        }
    });
</script>

<svelte:head>
    <!-- prettier-ignore -->
    <link href="https://api.mapbox.com/mapbox-gl-js/v2.14.1/mapbox-gl.css" rel="stylesheet" />
    <title>Schiphol</title>
</svelte:head>

<div id="mapInfo">
    <div class="header">
        <h1>Upcoming flights from/to Schiphol</h1>
        <Search />
    </div>
    <div class="switches">
        <LayerSwitchButton {labelsLayer} {toggleLayer} />
        <StyleSwitchButton />
    </div>
</div>
<Map />

<style>
    #mapInfo {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: fit-content;
        height: 100svh;
    }

    #mapInfo > div {
        width: fit-content;
        z-index: 1;
    }

    .header {
        display: flex;
        flex-direction: column;
    }

    h1 {
        position: relative;
        display: inline-block;
        width: var(--searchbar-width);
        margin: var(--standard-margin);
        padding: 0.1em;
        font-weight: var(--font-weight-title);
        word-wrap: break-word;
        text-align: center;
        color: var(--color-dark);
        background-color: var(--color-light);
        border-radius: var(--border-radius);
        z-index: 1;
    }

    .switches {
        display: flex;
        gap: var(--standard-margin);
        margin: 0 0 var(--standard-margin) var(--standard-margin);
    }

    @media screen and (max-width: 450px) {
        .switches {
            flex-direction: column;
        }
    }
</style>
