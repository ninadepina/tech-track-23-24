import { fetchIata } from '$lib/server/fetchData.js';

export const GET = async (request) => {
    const { searchParams } = new URL(request.url);
    const iata = searchParams.get('iata');

    const options = {
        status: 200,
        headers: {
            'Content-Type': 'text/plain'
        }
    };

    const currentDateTime = new Date();

    if (currentDateTime.getHours() >= 2) {
        currentDateTime.setHours(currentDateTime.getHours() - 2);
    }
    // prettier-ignore
    const dateTime = 
        `${currentDateTime.getFullYear()}-${String(currentDateTime.getMonth() + 1).padStart(2, '0')}-${String(currentDateTime.getDate()).padStart(2, '0')}T${String(currentDateTime.getHours()).padStart(2, '0')}%3A${String(currentDateTime.getMinutes()).padStart(2, '0')}%3A${String(currentDateTime.getSeconds()).padStart(2, '0')}`;

    if (iata) {
        const data = await fetchIata(iata, dateTime);
        // prettier-ignore
        return data !== null 
            ? new Response(JSON.stringify(data), options) 
            : new Response('No data found', options);

    } else {
        options.status = 400;
        return new Response('Missing "iata" parameter', options);
    }
};
