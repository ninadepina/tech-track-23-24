import { getPages } from './fetchDestinations.js';

const url = 'https://api.schiphol.nl/public-flights/flights?route=';
const params = '&includedelays=false&page=0&sort=%2BscheduleTime';
const headers = {
    resourceversion: 'v4',
    app_id: process.env.APP_ID_2,
    app_key: process.env.APP_KEY_2,
    Accept: 'application/json'
};

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const cleanDestinations = async () => {
    try {
        const cities = await getPages();
        let cleanedData = [];

        await Promise.all(cities.map(async (city) => {

            let retries = 0;
            while (retries < 3) {
                try {
                    const res = await fetch(`${url}${city.iata}${params}`, {
                        method: 'GET',
                        headers
                    });

                    if (!res.ok) {
                        if (res.status === 204) {
                            console.log('No content found for the specified route.');
                            break;
                        } else if (res.status === 429) {
                            console.log(`Rate limit exceeded. Retrying in ${2 ** retries} seconds.`);
                            await wait(1000 * 2 ** retries);
                            retries++;
                            continue;
                        } else {
                            throw new Error(`HTTP error! Status: ${res.status}`);
                        }
                    }

                    const text = await res.text();

                    if (!text) {
                        console.log(`No data received for ${city.iata}.`);
                        break;
                    }

                    const data = JSON.parse(text);

                    data.flights && data.flights.length > 0 
                        ? cleanedData.push({ iata: city.iata }) 
                        : console.log(`No flights found for ${city.iata}.`);

                    break;
                } catch (err) {
                    console.error(`Oops, something went wrong for city ${city}: ${err}`);
                    break;
                }
            }
        }));

        return cleanedData;
    } catch (err) {
        console.error(`Oops, something went wrong: ${err}`);
        return [];
    }
};

export { cleanDestinations }
