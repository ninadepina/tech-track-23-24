import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const url = 'https://api.schiphol.nl/public-flights/destinations?page=';
const headers = {
    resourceversion: 'v4',
    app_id: process.env.APP_ID,
    app_key: process.env.APP_KEY,
    Accept: 'application/json'
};

const cities = [];

const fetchPage = async (page) => {
    try {
        const res = await fetch(`${url}${page}`, {
            method: 'GET',
            headers
        });

        if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
        }

        const data = await res.json();
        const destinations = data.destinations;

        destinations.forEach((destination) => {
            if (typeof destination.city === 'string') {
                cities.push(destination.city);
            } else if (destination.publicName && destination.publicName.english) {
                cities.push(destination.publicName.english);
            }
        });
    } catch (err) {
        console.error(`Oops, something went wrong: ${err}`);
    }
};

const getPages = async () => {
    const promises = [];

    for (let page = 1; page <= 50; page++) {
        promises.push(fetchPage(page));
    }

    try {
        await Promise.all(promises);
        // console.log(cities);
        return cities;
    } catch (err) {
        console.error(`Oops, something went wrong: ${err}`);
    }
};

// getPages();
export { getPages };
