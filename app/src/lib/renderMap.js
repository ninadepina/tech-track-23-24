import mapboxgl from 'mapbox-gl';
import { json } from 'd3';
// prettier-ignore
const config = {
    accessToken: 'pk.eyJ1IjoibmluYWRlcGluYSIsImEiOiJjbG9kN2g4YmgwNzA1MmtwOGNwZ2pmYm5oIn0.ZxK0Rzq_visQwBFGqSWIZA',
    dataFile: 'coordinateData.json',
};

let map;
let iataData = null;

const getIATAData = async (selectedIATA) => {
    const url = `/api/flights?iata=${selectedIATA}`;

    const res = await fetch(url);

    if (res.ok) {
        iataData = await res.text();
    } else {
        console.error('Request failed');
    }
};

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
            map.on('click', 'other-dots', async (e) => {
                const properties = e.features[0].properties;
                const index = properties.index;

                const placeName = data.data[index].place_name.split(',')[0];
                const iata = data.data[index].iata;

                await getIATAData(iata);
                // console.log(iataData);
                const iataDataObject = JSON.parse(iataData);

                const estLandingDateA = new Date(iataDataObject.arrivalData.estimatedLandingTime).toISOString().split('T')[0];
                const piecesA = estLandingDateA.split('-');
                const estLandingDateAFormatted = `${piecesA[2]}-${piecesA[1]}-${piecesA[0]}`;
                const estLandingDateD = new Date(iataDataObject.departureData.estimatedLandingTime).toISOString().split('T')[0];
                const piecesD = estLandingDateD.split('-');
                const estLandingDateDFormatted = `${piecesD[2]}-${piecesD[1]}-${piecesD[0]}`;

                const estLandingTimeA = formatTime(iataDataObject.arrivalData.estimatedLandingTime);
                const estLandingTimeD = formatTime(iataDataObject.departureData.estimatedLandingTime);

                const estDepartureTimeA = iataDataObject.arrivalData.scheduleTime.split(':').slice(0, 2).join(':');
                const estDepartureTimeD = iataDataObject.departureData.scheduleTime.split(':').slice(0, 2).join(':');

                const partsA = iataDataObject.arrivalData.scheduleDate.split('-');
                const scheduleDateA = `${partsA[2]}-${partsA[1]}-${partsA[0]}`;
                const partsD = iataDataObject.departureData.scheduleDate.split('-');
                const scheduleDateD = `${partsD[2]}-${partsD[1]}-${partsD[0]}`;

                const htmlContent = `
                    <div class="flightCard">
                        <div>
                            <div>
                                <img src="" alt="" />
                                <div>
                                    <p class="flightName">${iataDataObject.departureData.prefixIATA} ${iataDataObject.departureData.flightNumber}</p>
                                    <p class="flightAirline">${iataDataObject.departureData.prefixICAO || '-'}</p>
                                </div>
                            </div>
                            <span>En Route</span>
                        </div>
                    
                        <div>
                            <div>
                                <span>
                                    <svg
                                        width="13"
                                        height="13"
                                        viewBox="0 0 13 13"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M9.54136 3.1816C7.784 1.42424 4.93475 1.42424 3.17739 3.1816C1.42004 4.93896 1.42004 7.7882 3.17739 9.54556C4.93475 11.3029 7.784 11.3029 9.54136 9.54556C11.2987 7.7882 11.2987 4.93896 9.54136 3.1816Z"
                                            fill="#A0AAB8"
                                        />
                                        <path
                                            fill-rule="evenodd"
                                            clip-rule="evenodd"
                                            d="M8.83425 3.8887C7.46741 2.52187 5.25134 2.52187 3.8845 3.8887C2.51767 5.25554 2.51767 7.47162 3.8845 8.83845C5.25134 10.2053 7.46741 10.2053 8.83425 8.83845C10.2011 7.47162 10.2011 5.25554 8.83425 3.8887ZM3.17739 3.1816C4.93475 1.42424 7.784 1.42424 9.54136 3.1816C11.2987 4.93896 11.2987 7.7882 9.54136 9.54556C7.784 11.3029 4.93475 11.3029 3.17739 9.54556C1.42004 7.7882 1.42004 4.93896 3.17739 3.1816Z"
                                            fill="#939DAE"
                                        />
                                        <path
                                            fill-rule="evenodd"
                                            clip-rule="evenodd"
                                            d="M4.64596 7.89986C4.4507 7.7046 4.4507 7.38802 4.64596 7.19276L6.33789 5.50083L5.50004 5.5009C5.2239 5.50092 5.00002 5.27709 5 5.00094C4.99998 4.7248 5.22381 4.50092 5.49996 4.5009L7.54505 4.50073C7.67964 4.50071 7.80856 4.55496 7.90264 4.65121C7.99672 4.74745 8.04803 4.87757 8.04497 5.01212L7.99938 7.01181C7.99309 7.28788 7.76419 7.50658 7.48812 7.50028C7.21205 7.49399 6.99335 7.26509 6.99964 6.98902L7.0168 6.23612L5.35306 7.89986C5.1578 8.09513 4.84122 8.09513 4.64596 7.89986Z"
                                            fill="white"
                                        />
                                    </svg>
                                    <p class="flightDate">${scheduleDateD || '-'}</p>
                                </span>
                                <p class="flightCity">Amsterdam</p>
                                <p class="flightCityAbbr">AMS</p>
                                <p class="flightTime">${estDepartureTimeD || '-'}</p>
                            </div>
                            <svg
                                viewBox="0 0 76 23"
                                fill="none"
                            >
                                <path
                                    d="M5 11.5C5 12.8807 3.88071 14 2.5 14C1.11929 14 0 12.8807 0 11.5C0 10.1193 1.11929 9 2.5 9C3.88071 9 5 10.1193 5 11.5Z"
                                    fill="#8B95A9"
                                />
                                <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M34.5 12H4.5V11H34.5V12Z"
                                    fill="#8B95A9"
                                />
                                <path
                                    d="M76 11.5C76 12.8807 74.8807 14 73.5 14C72.1193 14 71 12.8807 71 11.5C71 10.1193 72.1193 9 73.5 9C74.8807 9 76 10.1193 76 11.5Z"
                                    fill="#DFE0E4"
                                />
                                <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M51.5 11H71V12H51.5V11Z"
                                    fill="#DFE0E4"
                                />
                                <path
                                    d="M50.6725 11.7084C50.2105 12.1704 49.1883 12.4013 47.606 12.4013H43.7828L38.98 19.4821L38.9402 19.5379C38.8658 19.6122 38.7809 19.6494 38.6853 19.6494L37.6658 19.6494C37.5702 19.6494 37.4853 19.6122 37.4109 19.5379C37.2994 19.4264 37.2702 19.3016 37.3233 19.1635L39.7207 12.4013L35.8179 12.4013C34.9153 14.0262 34.4267 14.8758 34.3524 14.9501C34.2781 15.0244 34.1931 15.0616 34.0975 15.0616L33.078 15.0616C32.9824 15.0616 32.8975 15.0244 32.8231 14.9501C32.7276 14.8545 32.6957 14.7377 32.7276 14.5996L33.7232 11.1349L32.7276 7.67019C32.6851 7.53213 32.7143 7.41266 32.8152 7.31177C32.8895 7.23743 32.9745 7.20026 33.0701 7.20026L34.0975 7.1923C34.1931 7.1923 34.2781 7.22947 34.3524 7.30381C34.4267 7.37814 34.9153 8.22773 35.8179 9.85257L39.7207 9.85257L37.3233 3.09038C37.2702 2.95232 37.2994 2.82754 37.4109 2.71603C37.4853 2.64169 37.5702 2.60452 37.6658 2.60452L38.6853 2.60452C38.7809 2.60452 38.8658 2.64169 38.9402 2.71603C38.9614 2.73727 38.9747 2.75585 38.98 2.77178L43.7828 9.85257H47.606C49.1883 9.85257 50.2105 10.0836 50.6725 10.5455C50.8424 10.7154 50.9273 10.9092 50.9273 11.127C50.9273 11.3447 50.8424 11.5385 50.6725 11.7084Z"
                                    fill="#8B95A9"
                                />
                            </svg>
                    
                            <div>
                                <span>
                                    <svg
                                        width="13"
                                        height="13"
                                        viewBox="0 0 13 13"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M9.54594 9.54624C11.3033 7.78888 11.3033 4.93964 9.54594 3.18228C7.78858 1.42492 4.93934 1.42492 3.18198 3.18228C1.42462 4.93964 1.42462 7.78888 3.18198 9.54624C4.93934 11.3036 7.78858 11.3036 9.54594 9.54624Z"
                                            fill="#A0AAB8"
                                        />
                                        <path
                                            fill-rule="evenodd"
                                            clip-rule="evenodd"
                                            d="M8.83883 8.83913C10.2057 7.4723 10.2057 5.25622 8.83883 3.88938C7.472 2.52255 5.25592 2.52255 3.88909 3.88938C2.52225 5.25622 2.52225 7.4723 3.88909 8.83913C5.25592 10.206 7.472 10.206 8.83883 8.83913ZM9.54594 3.18228C11.3033 4.93964 11.3033 7.78888 9.54594 9.54624C7.78858 11.3036 4.93934 11.3036 3.18198 9.54624C1.42462 7.78888 1.42462 4.93964 3.18198 3.18228C4.93934 1.42492 7.78858 1.42492 9.54594 3.18228Z"
                                            fill="#939DAE"
                                        />
                                        <path
                                            fill-rule="evenodd"
                                            clip-rule="evenodd"
                                            d="M4.8306 4.64791C5.02587 4.45265 5.34245 4.45265 5.53771 4.64791L7.22964 6.33984L7.22957 5.502C7.22954 5.22585 7.45338 5.00198 7.72953 5.00195C8.00567 5.00193 8.22954 5.22577 8.22957 5.50191L8.22974 7.54701C8.22975 7.6816 8.1755 7.81051 8.07926 7.90459C7.98301 7.99868 7.8529 8.04999 7.71835 8.04692L5.71866 8.00133C5.44259 7.99504 5.22389 7.76614 5.23019 7.49007C5.23648 7.214 5.46538 6.9953 5.74145 7.00159L6.49434 7.01876L4.8306 5.35502C4.63534 5.15976 4.63534 4.84317 4.8306 4.64791Z"
                                            fill="white"
                                        />
                                    </svg>
                                    <p class="flightDate">${estLandingDateDFormatted || '-'}</p>
                                </span>
                                <p class="flightCity">${placeName}</p>
                                <p class="flightCityAbbr">${iata}</p>
                                <p class="flightTime">${estLandingTimeD || '-'}</p>
                            </div>
                        </div>
                    </div>

                    <div class="flightCard">
                        <div>
                            <div>
                                <img src="" alt="" />
                                <div>
                                    <p class="flightName">${iataDataObject.arrivalData.prefixIATA} ${iataDataObject.arrivalData.flightNumber}</p>
                                    <p class="flightAirline">${iataDataObject.arrivalData.prefixICAO || '-'}</p>
                                </div>
                            </div>
                            <span>En Route</span>
                        </div>
                    
                        <div>
                            <div>
                                <span>
                                    <svg
                                        width="13"
                                        height="13"
                                        viewBox="0 0 13 13"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M9.54136 3.1816C7.784 1.42424 4.93475 1.42424 3.17739 3.1816C1.42004 4.93896 1.42004 7.7882 3.17739 9.54556C4.93475 11.3029 7.784 11.3029 9.54136 9.54556C11.2987 7.7882 11.2987 4.93896 9.54136 3.1816Z"
                                            fill="#A0AAB8"
                                        />
                                        <path
                                            fill-rule="evenodd"
                                            clip-rule="evenodd"
                                            d="M8.83425 3.8887C7.46741 2.52187 5.25134 2.52187 3.8845 3.8887C2.51767 5.25554 2.51767 7.47162 3.8845 8.83845C5.25134 10.2053 7.46741 10.2053 8.83425 8.83845C10.2011 7.47162 10.2011 5.25554 8.83425 3.8887ZM3.17739 3.1816C4.93475 1.42424 7.784 1.42424 9.54136 3.1816C11.2987 4.93896 11.2987 7.7882 9.54136 9.54556C7.784 11.3029 4.93475 11.3029 3.17739 9.54556C1.42004 7.7882 1.42004 4.93896 3.17739 3.1816Z"
                                            fill="#939DAE"
                                        />
                                        <path
                                            fill-rule="evenodd"
                                            clip-rule="evenodd"
                                            d="M4.64596 7.89986C4.4507 7.7046 4.4507 7.38802 4.64596 7.19276L6.33789 5.50083L5.50004 5.5009C5.2239 5.50092 5.00002 5.27709 5 5.00094C4.99998 4.7248 5.22381 4.50092 5.49996 4.5009L7.54505 4.50073C7.67964 4.50071 7.80856 4.55496 7.90264 4.65121C7.99672 4.74745 8.04803 4.87757 8.04497 5.01212L7.99938 7.01181C7.99309 7.28788 7.76419 7.50658 7.48812 7.50028C7.21205 7.49399 6.99335 7.26509 6.99964 6.98902L7.0168 6.23612L5.35306 7.89986C5.1578 8.09513 4.84122 8.09513 4.64596 7.89986Z"
                                            fill="white"
                                        />
                                    </svg>
                                    <p class="flightDate">${scheduleDateA || '-'}</p>
                                </span>
                                <p class="flightCity">${placeName}</p>
                                <p class="flightCityAbbr">${iata}</p>
                                <p class="flightTime">${estDepartureTimeA || '-'}</p>
                            </div>
                            <svg
                                viewBox="0 0 76 23"
                                fill="none"
                            >
                                <path
                                    d="M5 11.5C5 12.8807 3.88071 14 2.5 14C1.11929 14 0 12.8807 0 11.5C0 10.1193 1.11929 9 2.5 9C3.88071 9 5 10.1193 5 11.5Z"
                                    fill="#8B95A9"
                                />
                                <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M34.5 12H4.5V11H34.5V12Z"
                                    fill="#8B95A9"
                                />
                                <path
                                    d="M76 11.5C76 12.8807 74.8807 14 73.5 14C72.1193 14 71 12.8807 71 11.5C71 10.1193 72.1193 9 73.5 9C74.8807 9 76 10.1193 76 11.5Z"
                                    fill="#DFE0E4"
                                />
                                <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M51.5 11H71V12H51.5V11Z"
                                    fill="#DFE0E4"
                                />
                                <path
                                    d="M50.6725 11.7084C50.2105 12.1704 49.1883 12.4013 47.606 12.4013H43.7828L38.98 19.4821L38.9402 19.5379C38.8658 19.6122 38.7809 19.6494 38.6853 19.6494L37.6658 19.6494C37.5702 19.6494 37.4853 19.6122 37.4109 19.5379C37.2994 19.4264 37.2702 19.3016 37.3233 19.1635L39.7207 12.4013L35.8179 12.4013C34.9153 14.0262 34.4267 14.8758 34.3524 14.9501C34.2781 15.0244 34.1931 15.0616 34.0975 15.0616L33.078 15.0616C32.9824 15.0616 32.8975 15.0244 32.8231 14.9501C32.7276 14.8545 32.6957 14.7377 32.7276 14.5996L33.7232 11.1349L32.7276 7.67019C32.6851 7.53213 32.7143 7.41266 32.8152 7.31177C32.8895 7.23743 32.9745 7.20026 33.0701 7.20026L34.0975 7.1923C34.1931 7.1923 34.2781 7.22947 34.3524 7.30381C34.4267 7.37814 34.9153 8.22773 35.8179 9.85257L39.7207 9.85257L37.3233 3.09038C37.2702 2.95232 37.2994 2.82754 37.4109 2.71603C37.4853 2.64169 37.5702 2.60452 37.6658 2.60452L38.6853 2.60452C38.7809 2.60452 38.8658 2.64169 38.9402 2.71603C38.9614 2.73727 38.9747 2.75585 38.98 2.77178L43.7828 9.85257H47.606C49.1883 9.85257 50.2105 10.0836 50.6725 10.5455C50.8424 10.7154 50.9273 10.9092 50.9273 11.127C50.9273 11.3447 50.8424 11.5385 50.6725 11.7084Z"
                                    fill="#8B95A9"
                                />
                            </svg>
                    
                            <div>
                                <span>
                                    <svg
                                        width="13"
                                        height="13"
                                        viewBox="0 0 13 13"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M9.54594 9.54624C11.3033 7.78888 11.3033 4.93964 9.54594 3.18228C7.78858 1.42492 4.93934 1.42492 3.18198 3.18228C1.42462 4.93964 1.42462 7.78888 3.18198 9.54624C4.93934 11.3036 7.78858 11.3036 9.54594 9.54624Z"
                                            fill="#A0AAB8"
                                        />
                                        <path
                                            fill-rule="evenodd"
                                            clip-rule="evenodd"
                                            d="M8.83883 8.83913C10.2057 7.4723 10.2057 5.25622 8.83883 3.88938C7.472 2.52255 5.25592 2.52255 3.88909 3.88938C2.52225 5.25622 2.52225 7.4723 3.88909 8.83913C5.25592 10.206 7.472 10.206 8.83883 8.83913ZM9.54594 3.18228C11.3033 4.93964 11.3033 7.78888 9.54594 9.54624C7.78858 11.3036 4.93934 11.3036 3.18198 9.54624C1.42462 7.78888 1.42462 4.93964 3.18198 3.18228C4.93934 1.42492 7.78858 1.42492 9.54594 3.18228Z"
                                            fill="#939DAE"
                                        />
                                        <path
                                            fill-rule="evenodd"
                                            clip-rule="evenodd"
                                            d="M4.8306 4.64791C5.02587 4.45265 5.34245 4.45265 5.53771 4.64791L7.22964 6.33984L7.22957 5.502C7.22954 5.22585 7.45338 5.00198 7.72953 5.00195C8.00567 5.00193 8.22954 5.22577 8.22957 5.50191L8.22974 7.54701C8.22975 7.6816 8.1755 7.81051 8.07926 7.90459C7.98301 7.99868 7.8529 8.04999 7.71835 8.04692L5.71866 8.00133C5.44259 7.99504 5.22389 7.76614 5.23019 7.49007C5.23648 7.214 5.46538 6.9953 5.74145 7.00159L6.49434 7.01876L4.8306 5.35502C4.63534 5.15976 4.63534 4.84317 4.8306 4.64791Z"
                                            fill="white"
                                        />
                                    </svg>
                                    <p class="flightDate">${estLandingDateAFormatted || '-'}</p>
                                </span>
                                <p class="flightCity">Amsterdam</p>
                                <p class="flightCityAbbr">AMS</p>
                                <p class="flightTime">${estLandingTimeA || '-'}</p>
                            </div>
                        </div>
                    </div>
                `;

                if (popup) {
                    popup.remove();
                    popup = null;
                }
                // prettier-ignore
                !popup 
                    ? popup = new mapboxgl.Popup({ closeOnClick: true }).setLngLat(e.lngLat).setHTML(htmlContent).addTo(map) 
                    : popup.setHTML(info);
            });
        });

        map.on('idle', () => {
            // prettier-ignore
            if (!map.getLayer('lines-layer') || !map.getLayer('other-dots') || !map.getLayer('schiphol-dot')) {
                return; // if layers not added to map, abort
            }
            // prettier-ignore
            const toggleLayerVisibility = (e) => {
                e.preventDefault();
                const clickedLayer = e.target.id;
                const visibility = map.getLayoutProperty(clickedLayer, 'visibility');

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

function formatTime(inputTime) {
    const date = new Date(inputTime);
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
}

export { map, renderMap };
