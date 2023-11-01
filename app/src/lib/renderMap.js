import mapboxgl from 'mapbox-gl';
import * as d3 from 'd3';
// prettier-ignore
const config = {
    accessToken: 'pk.eyJ1IjoibmluYWRlcGluYSIsImEiOiJjbG9kN2g4YmgwNzA1MmtwOGNwZ2pmYm5oIn0.ZxK0Rzq_visQwBFGqSWIZA',
    dataFile: 'coordinateData.json',
};

const renderMap = () => {
    mapboxgl.accessToken = config.accessToken;

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

    let popup = null;

    d3.json(config.dataFile)
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

            map.addLayer({
                id: 'lines-layer',
                type: 'line',
                source: 'lines',
                layout: {
                    'line-join': 'round',
                    'line-cap': 'round'
                },
                paint: {
                    'line-color': '#FF5733',
                    'line-width': 2
                }
            });

            // all dots except Schiphol
            map.addLayer({
                id: 'other-dots',
                type: 'circle',
                source: 'dots',
                paint: {
                    'circle-radius': 5,
                    'circle-color': '#292f36'
                },
                filter: ['!=', ['get', 'index'], 0] // filter out Schiphol dot
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
                filter: ['==', ['get', 'index'], 0] // only show Schiphol dot
            });

            // hover effect for 'other-dots'
            map.on('mouseenter', 'other-dots', (e) => {
                const properties = e.features[0].properties;
                const index = properties.index;
                const info = data.data[index].place_name;

                if (!popup) {
                    popup = new mapboxgl.Popup()
                        .setLngLat(e.lngLat)
                        .setHTML(info)
                        .addTo(map);
                } else {
                    popup.setHTML(info);
                }
            });

            map.on('mouseleave', 'other-dots', () => {
                if (popup) {
                    popup.remove();
                    popup = null;
                }
            });
        });
    };
};

export { renderMap };
