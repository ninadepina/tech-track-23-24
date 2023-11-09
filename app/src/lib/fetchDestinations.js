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

const fetchPage = async (page) => {
    let cities = [];
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
            if (typeof destination.city === 'string' && typeof destination.iata === 'string') {
                cities.push({ iata: destination.iata });
            }
        });
    } catch (err) {
        console.error(`Oops, something went wrong: ${err}`);
    }
    return cities;
};

// const getPages = async () => {
//     const promises = [];

//     for (let page = 1; page <= 50; page++) {
//         promises.push(fetchPage(page));
//     }

//     try {
//         await Promise.all(promises);
//         return cities;
//     } catch (err) {
//         console.error(`Oops, something went wrong: ${err}`);
//     }
// };
const getPages = async () => {
    let page = 1;
    let cities = [];

    while (true) {
        try {
            const result = await fetchPage(page);
            if (result.length === 0) {
                break;
            }
            cities = cities.concat(result);
            page++;
        } catch (err) {
            console.error(`Oops, something went wrong: ${err}`);
            break;
        }
    }

    return cities;
};

export { getPages };
