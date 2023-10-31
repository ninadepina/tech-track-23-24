// import { getPages } from './fetchDestinations.js';
// import fetch from 'node-fetch';
// import fs from 'fs/promises';

// const cacheFileName = 'coordinateData.json';

// const url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/';
// const accessToken =
//     'pk.eyJ1IjoibmluYWRlcGluYSIsImEiOiJjbG9kN2g4YmgwNzA1MmtwOGNwZ2pmYm5oIn0.ZxK0Rzq_visQwBFGqSWIZA';

// const getCoordinate = async () => {
//     try {
//         const cachedData = await readCachedData();
//         if (cachedData) {
//             console.log('okidoki');
//             return cachedData;
//         }

//         let cities = await getPages();
//         let coordinateArray = [[4.762197, 52.308039]];

//         for (let city of cities) {
//             try {
//                 const cityLocation = `${url}${city}.json?limit=1&types=place%2Ccountry&access_token=${accessToken}`;
//                 const res = await fetch(cityLocation, {
//                     method: 'GET',
//                     headers: {
//                         Accept: 'application/json'
//                     }
//                 });

//                 if (res.ok) {
//                     const data = await res.json();
//                     if (data.features && data.features.length > 0) {
//                         const coordinate =
//                             data.features[0].geometry.coordinates;
//                         coordinateArray.push(coordinate);
//                     }
//                 }
//             } catch (err) {
//                 console.error(`Oops, something went wrong: ${err}`);
//             }
//         }

//         await cacheData(coordinateArray);

//         console.log(coordinateArray);
//         return coordinateArray;
//     } catch (err) {
//         console.error(`Oops, something went wrong: ${err}`);
//     }
// };

// async function readCachedData() {
//     try {
//         const data = await fs.readFile(cacheFileName, 'utf-8');
//         return JSON.parse(data);
//     } catch (err) {
//         console.error(`Oops, something went wrong: ${err}`);
//         return null;
//     }
// }

// async function cacheData(data) {
//     try {
//         await fs.writeFile(cacheFileName, JSON.stringify(data));
//     } catch (err) {
//         console.error(`Oops, something went wrong: ${err}`);
//     }
// }

// getCoordinate();

import { getPages } from './fetchDestinations.js';
import fetch from 'node-fetch';
import fs from 'fs/promises';

const cacheFileName = 'coordinateData.json';

const url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/';
const accessToken =
    'pk.eyJ1IjoibmluYWRlcGluYSIsImEiOiJjbG9kN2g4YmgwNzA1MmtwOGNwZ2pmYm5oIn0.ZxK0Rzq_visQwBFGqSWIZA';

const getCoordinate = async () => {
    try {
        const cachedData = await readCachedData();

        if (cachedData && isCacheValid(cachedData)) {
            console.log('Using cached data');
            return cachedData.data;
        }

        console.log('Fetching new data');

        let cities = await getPages();
        let coordinateArray = [[4.762197, 52.308039]];

        for (let city of cities) {
            try {
                const loc = `${url}${city}.json?limit=1&types=place%2Ccountry&access_token=${accessToken}`;

                const res = await fetch(loc, {
                    method: 'GET',
                    headers: {
                        Accept: 'application/json'
                    }
                });

                if (res.ok) {
                    const data = await res.json();

                    if (data.features && data.features.length > 0) {
                        const coordinate =
                            data.features[0].geometry.coordinates;

                        coordinateArray.push(coordinate);
                    }
                }
            } catch (err) {
                console.error(`Oops, something went wrong: ${err}`);
            }
        }

        await cacheData({
            data: coordinateArray,
            timestamp: Date.now()
        });

        console.log(coordinateArray);
        return coordinateArray;
    } catch (err) {
        console.error(`Oops, something went wrong: ${err}`);
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

getCoordinate();
