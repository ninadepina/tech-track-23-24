import { getCoordinate } from '$lib/getCoordinates.js';

export const load = async () => {
    const coordinateData = await getCoordinate();
    return {
        data: coordinateData
    };
};
