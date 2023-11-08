import { fetchIata } from '$lib/fetchIata.js';

export const GET = async (request) => {
    const { searchParams } = new URL(request.url);
    const iata = searchParams.get('iata');

    const options = {
        status: 200,
        headers: {
            'Content-Type': 'text/plain'
        }
    };

    if (iata) {
        const data = await fetchIata(iata);

        if (data) {
            return new Response(JSON.stringify(data), options); 
        } else {
            return new Response('No data found', options);
        }
    } else {
        options.status = 400;
        return new Response('Missing "iata" parameter', options);
    }
};
