import { getPages } from './fetchDestinations.js';
import fetch from 'node-fetch';
import fs from 'fs/promises';

const cacheFileName = 'static/coordinateData.json';

const url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/';
const accessToken = 'pk.eyJ1IjoibmluYWRlcGluYSIsImEiOiJjbG9kN2g4YmgwNzA1MmtwOGNwZ2pmYm5oIn0.ZxK0Rzq_visQwBFGqSWIZA';

const getCoordinate = async () => {
    try {
        const cachedData = await readCachedData();

        if (cachedData && isCacheValid(cachedData)) {
            console.log('Using cached data');
            return cachedData.data;
        }

        console.log('Fetching new data');
        fetchNewDataInBackground();

        return [];
    } catch (err) {
        console.error(`Oops, something went wrong: ${err}`);
    }
};

const fetchNewDataInBackground = async () => {
    try {
        const cities = await getPages();
        let coordinateData = [
            {
                coordinates: [4.762197, 52.308039],
                place_name: 'Schiphol',
                iata: 'AMS'
            }
        ];

        for (let city of cities) {
            try {
                const loc = `${url}${city.city}.json?limit=1&types=place%2Ccountry&access_token=${accessToken}`;

                const res = await fetch(loc, {
                    method: 'GET',
                    headers: {
                        Accept: 'application/json'
                    }
                });

                if (res.ok) {
                    const data = await res.json();
                    // prettier-ignore
                    if (data.features && data.features.length > 0) {
                        const coordinate = data.features[0].geometry.coordinates;
                        const place_name = data.features[0].place_name;

                        coordinateData.push({
                            coordinates: coordinate,
                            place_name: place_name,
                            iata: city.iata
                        });
                    }
                }
            } catch (err) {
                console.error(`Oops, something went wrong: ${err}`);
            }
        }

        await cacheData({
            data: coordinateData,
            timestamp: Date.now()
        });

        console.log('New data has been fetched');
    } catch (err) {
        console.error(`Oops, something went wrong while fetching new data: ${err}`);
    }
};

const readCachedData = async () => {
    try {
        const data = await fs.readFile(cacheFileName, 'utf-8');
        return JSON.parse(data);
    } catch (err) {
        console.error(`No cached data found or error reading cache: ${err}`);
        return null;
    }
};

const isCacheValid = (cachedData) => {
    const timestamp = cachedData.timestamp;
    const oneDayInMs = 24 * 60 * 60 * 1000;
    return Date.now() - timestamp <= oneDayInMs;
};

const cacheData = async (data) => {
    try {
        await fs.writeFile(cacheFileName, JSON.stringify(data));
    } catch (err) {
        console.error(`Oops, something went wrong: ${err}`);
    }
};

export { getCoordinate };
