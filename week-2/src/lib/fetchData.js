import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

const url = 'https://api.schiphol.nl/public-flights/flights';
const headers = {
    resourceversion: 'v4',
    app_id: process.env.APP_ID,
    app_key: process.env.APP_KEY,
    Accept: 'application/json'
};

const params = new URLSearchParams({
    flightdirection: 'D' // departures
});

fetch(`${url}?${params}`, {
    method: 'GET',
    headers: headers
})
    .then((res) => res.text())
    .then((data) => {
        console.log(data);
    })
    .catch((err) => {
        console.error(err);
    });
