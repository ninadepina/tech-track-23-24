import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const url = 'https://api.schiphol.nl/public-flights/flights';
const params = {
    departure: '?flightDirection=D&route=',
    arrival: '?flightDirection=A&route='
};
const params2 = '&includedelays=false&page=0&sort=%2BscheduleTime';
const headers = {
    resourceversion: 'v4',
    app_id: process.env.APP_ID,
    app_key: process.env.APP_KEY,
    Accept: 'application/json'
};

const fetchData = async (iata, direction) => {
    try {
        const res = await fetch(`${url}${params[direction]}${iata}${params2}`, {
            method: 'GET',
            headers
        });
        // prettier-ignore
        if (!res.ok) {
            throw new Error(`HTTP error for ${direction}! Status: ${res.status}`);
        }

        const data = await res.json();

        if (data && data.flights && data.flights.length > 0) {
            const firstFlight = data.flights[0];
            console.log(`First ${direction} flight:`, firstFlight);
        } else {
            console.log(`No ${direction} flights found in the response.`);
        }
    } catch (err) {
        console.error(`Oops, something went wrong: ${err}`);
    }
};

const fetchIata = async (iata) => {
    try {
        await Promise.all([
            fetchData(iata, 'departure'),
            fetchData(iata, 'arrival')
        ]);
    } catch (err) {
        console.error(`Oops, something went wrong: ${err}`);
    }
};

fetchIata('LAX');
