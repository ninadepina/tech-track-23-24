import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const url = 'https://api.schiphol.nl/public-flights/flights';
const params = {
    departure: '?flightDirection=D&route=',
    arrival: '?flightDirection=A&route='
};
const params2 = '&includedelays=false&page=0&sort=%2BscheduleTime&fromDateTime=';
const params3 = '&searchDateTimeField=scheduleDateTime'
const headers = {
    resourceversion: 'v4',
    app_id: process.env.APP_ID,
    app_key: process.env.APP_KEY,
    Accept: 'application/json'
};

const fetchData = async (iata, dateTime, direction) => {
    try {
        const res = await fetch(`${url}${params[direction]}${iata}${params2}${dateTime}${params3}`, {
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
            // console.log(`First ${direction} flight:`, firstFlight);
            return firstFlight;
        } else {
            // console.log(`No ${direction} flights found in the response.`);
            return null;
        }
    } catch (err) {
        return null;
    }
};

const fetchIata = async (iata, dateTime) => {
    try {
        const [departureData, arrivalData] = await Promise.all([
            fetchData(iata, dateTime, 'departure'),
            fetchData(iata, dateTime, 'arrival')
        ]);

        if (departureData && arrivalData) {
            return {
                departureData,
                arrivalData
            };
        } else {
            return null;
        }
    } catch (err) {
        return null;
    }
};

export { fetchIata };
