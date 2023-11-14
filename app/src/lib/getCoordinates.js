import { scrapeAll } from './scraper/webscraper';
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
        await fetchNewDataInBackground();

        const newData = await readCachedData();
        return newData ? newData.data : [];
    } catch (err) {
        console.error(`Oops, something went wrong: ${err}`);
        return [];
    }
};

const fetchNewDataInBackground = async () => {
    try {
        let cities;
        let data = await scrapeAll();

        if (!data) {
            data = await fs.readFile('static/destinations.json');
            cities = JSON.parse(data);
        } else {
            cities = data;
        }

        let coordinateData = [{
            iata: 'AMS',
            lat: 52.308039,
            long: 4.762197,
            city: 'Amsterdam'
        }];

        let jsonData = await fs.readFile('static/airports-code@public.json');
        let airports = JSON.parse(jsonData);

        for (let city of cities) {
            try {
                let airport = await findAirport(airports, city);
                
                if (airport) {
                    coordinateData.push({
                        iata: airport.column_1,
                        lat: airport.latitude,
                        long: airport.longitude,
                        city: airport.city_name,
                        operator: city.operator
                    });
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

const findAirport = async (airports, city) => {
    return new Promise((resolve, reject) => {
        try {
            let airport = airports.find((airport) =>
                airport.airport_name.trim().toLowerCase().includes(city.city.trim().toLowerCase()) 
                || city.city.trim().toLowerCase().includes(airport.airport_name.trim().toLowerCase())) 
                || airports.find(airport => airport.city_name.trim().toLowerCase().includes(city.city.trim().toLowerCase()));

            resolve(airport);
        } catch (err) {
            reject(err);
        }
    });
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
