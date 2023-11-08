import { getCoordinate } from '$lib/fetchCoordinates.js';

export const load = async () => {
    const coordinateData = await getCoordinate();
    return {
        data: coordinateData
    };
};
