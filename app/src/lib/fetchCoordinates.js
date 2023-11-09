import { getPages } from './fetchDestinations.js';
import fetch from 'node-fetch';
import fs from 'fs/promises';

const cacheFileName = 'static/coordinateData.json';

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
        let coordinateData = [];

        let jsonData = await fs.readFile('static/airports-code@public.json');
        let airports = JSON.parse(jsonData);

        for (let city of cities) {
            try {
                let airport = airports.find((airport) => airport.column_1 === city.iata);

                if (airport) {
                    coordinateData.push({
                        iata: airport.column_1,
                        lat: airport.latitude,
                        long: airport.longitude,
                        city: airport.city_name
                    });
                }
            } catch (err) {
                console.error(`Oops, something went wrong: ${err}`);
            }
        }

        let index = coordinateData.findIndex(obj => obj.iata === 'AMS');

        if (index !== -1) {
            let AMS = coordinateData.splice(index, 1)[0];
            coordinateData.unshift(AMS);
        }

        await cacheData({
            data: coordinateData,
            timestamp: Date.now()
        });

        console.log('New data has been fetched');
    } catch (err) {
        console.error(
            `Oops, something went wrong while fetching new data: ${err}`
        );
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
    const oneMonthInMs = 24 * 60 * 60 * 1000 * 30.44;
    return Date.now() - timestamp <= oneMonthInMs;
};

const cacheData = async (data) => {
    try {
        await fs.writeFile(cacheFileName, JSON.stringify(data));
    } catch (err) {
        console.error(`Oops, something went wrong: ${err}`);
    }
};

export { getCoordinate };
