import mapboxgl from 'mapbox-gl';
import { json } from 'd3';
// prettier-ignore
const config = {
    accessToken: 'pk.eyJ1IjoibmluYWRlcGluYSIsImEiOiJjbG9kN2g4YmgwNzA1MmtwOGNwZ2pmYm5oIn0.ZxK0Rzq_visQwBFGqSWIZA',
    dataFile: 'coordinateData.json',
};

let map;

const renderMap = () => {
    mapboxgl.accessToken = config.accessToken;

    map = new mapboxgl.Map({
        container: 'map',
        // style: 'mapbox://styles/mapbox/dark-v11',
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [8, 52],
        zoom: 2,
        minZoom: 1.2
    });

    map.addControl(new mapboxgl.NavigationControl());
    map.addControl(new mapboxgl.FullscreenControl());

    let popup = null;

    json(config.dataFile)
        .then((data) => initializeMap(data))
        .catch((err) => console.error('Error loading data:', err));

    const initializeMap = (data) => {
        const coordinatesData = data.data.map((item, index) => ({
            coordinates: item.coordinates,
            index
        }));

        map.on('load', () => {
            map.addSource('lines', {
                type: 'geojson',
                data: {
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
                }
            });
            map.addLayer({
                id: 'lines-layer',
                type: 'line',
                source: 'lines',
                layout: {
                    'line-join': 'round',
                    'line-cap': 'round',
                    visibility: 'none'
                },
                paint: {
                    'line-color': '#292f36',
                    'line-width': 2
                }
            });

            map.addSource('dots', {
                type: 'geojson',
                data: {
                    type: 'FeatureCollection',
                    features: coordinatesData.map((coords) => ({
                        type: 'Feature',
                        properties: {
                            index: coords.index
                        },
                        geometry: {
                            type: 'Point',
                            coordinates: coords.coordinates
                        }
                    }))
                }
            });
            // all dots except Schiphol
            map.addLayer({
                id: 'other-dots',
                type: 'circle',
                source: 'dots',
                layout: {
                    visibility: 'visible'
                },
                paint: {
                    'circle-radius': 5,
                    'circle-color': '#292f36'
                },
                filter: ['!=', ['get', 'index'], 0]
            });
            // Schiphol dot
            map.addLayer({
                id: 'schiphol-dot',
                type: 'circle',
                source: 'dots',
                paint: {
                    'circle-radius': 7,
                    'circle-color': '#914BD2'
                },
                filter: ['==', ['get', 'index'], 0]
            });

            // click effect for 'other-dots'
            map.on('click', 'other-dots', (e) => {
                const properties = e.features[0].properties;
                const index = properties.index;

                const placeName = data.data[index].place_name;
                const iata = data.data[index].iata;

                const info = `${placeName} (${iata})`;

                if (popup) {
                    popup.remove();
                    popup = null;
                }
                // prettier-ignore
                !popup 
                    ? popup = new mapboxgl.Popup({ closeOnClick: true }).setLngLat(e.lngLat).setHTML(info).addTo(map) 
                    : popup.setHTML(info);
            });
        });

        map.on('idle', () => {
            // prettier-ignore
            if (!map.getLayer('lines-layer') || !map.getLayer('other-dots') || !map.getLayer('schiphol-dot')) {
                return; // if layers not added to map, abort
            }

            const toggleLayerVisibility = (e) => {
                e.preventDefault();
                const clickedLayer = e.target.id;
                const visibility = map.getLayoutProperty(clickedLayer, 'visibility');
                // prettier-ignore
                if (visibility === 'visible') {
                    map.setLayoutProperty(clickedLayer, 'visibility', 'none');
                    e.target.classList.remove('active');
                } else {
                    map.setLayoutProperty(clickedLayer, 'visibility', 'visible');
                    e.target.classList.add('active');
                }
            };
            // enumerate ids of layers
            const toggleableLayerIds = ['lines-layer', 'other-dots'];

            // corresponding toggle button for each layer
            document.addEventListener('DOMContentLoaded', () => {
                toggleableLayerIds.forEach((id) => {
                    const button = document.getElementById(id);
                    button.addEventListener('click', toggleLayerVisibility);
                });
            });
        });
    };
};

export { map, renderMap };
