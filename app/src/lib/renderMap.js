import mapboxgl from 'mapbox-gl';
import * as d3 from 'd3';

const renderMap = () => {
    mapboxgl.accessToken =
        'pk.eyJ1IjoibmluYWRlcGluYSIsImEiOiJjbG9kN2g4YmgwNzA1MmtwOGNwZ2pmYm5oIn0.ZxK0Rzq_visQwBFGqSWIZA';

    const map = new mapboxgl.Map({
        container: 'map',
        // style: 'mapbox://styles/mapbox/dark-v11',
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [8, 52],
        zoom: 2,
        minZoom: 1.2
    });

    map.addControl(new mapboxgl.NavigationControl());
    map.addControl(new mapboxgl.FullscreenControl());

    d3.json('coordinateData.json').then((data) => {
        update(data);
    });

    const update = (data) => {
        const coordinatesData = data.data.map((item, index) => ({
            coordinates: item.coordinates,
            index
        }));

        map.on('load', () => {
            map.addSource('dots', {
                type: 'geojson',
                data: {
                    type: 'FeatureCollection',
                    features: coordinatesData.map((coords) => ({
                        type: 'Feature',
                        properties: { index: coords.index },
                        geometry: {
                            type: 'Point',
                            coordinates: coords.coordinates
                        }
                    }))
                }
            });

            map.addLayer({
                id: 'dots',
                type: 'circle',
                source: 'dots',
                paint: {
                    'circle-radius': [
                        'case',
                        ['==', ['get', 'index'], 0],
                        7, // radius for Schiphol
                        5 // radius for all other dots
                    ],
                    'circle-color': [
                        'case',
                        ['==', ['get', 'index'], 0],
                        '#914BD2', // color for Schiphol
                        '#292f36' // color for all other dots
                    ]
                }
            });
        });
    };
};

export { renderMap };
