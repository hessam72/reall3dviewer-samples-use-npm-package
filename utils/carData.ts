import { CarData } from '../types/car';
import { getFullFileUrl } from './url';

// Where car data comes from:
//   'local' -> public/data/cars.json, no backend needed (default)
//   'api'   -> backend through /api/cars/[id]
const DATA_SOURCE = process.env.NEXT_PUBLIC_DATA_SOURCE === 'api' ? 'api' : 'local';

const LOCAL_DATA_URL = '/data/cars.json';

export class CarNotFoundError extends Error {
    constructor(carId: string) {
        super(`Car not found: ${carId}`);
        this.name = 'CarNotFoundError';
    }
}

// fileUrl in cars.json is a path under /public (e.g. "/new_car.splat") or a full URL, used as-is
const fetchFromLocalFile = async (carId: string): Promise<CarData> => {
    const response = await fetch(LOCAL_DATA_URL, { cache: 'no-store' });
    if (!response.ok) {
        throw new Error(`Failed to load ${LOCAL_DATA_URL} (status ${response.status})`);
    }

    const { cars } = (await response.json()) as { cars?: Record<string, CarData> };
    const car = cars?.[carId];
    if (!car) throw new CarNotFoundError(carId);

    return car;
};

// fileUrl from the backend is relative to NEXT_PUBLIC_BACKEND_STORAGE_URL
const fetchFromApi = async (carId: string): Promise<CarData> => {
    const response = await fetch(`/api/cars/${carId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if (!response.ok) throw new CarNotFoundError(carId);

    const body = await response.json();
    if (!body?.data) throw new CarNotFoundError(carId);

    return { ...body.data, fileUrl: getFullFileUrl(body.data.fileUrl) };
};

export const fetchCarData = (carId: string): Promise<CarData> =>
    DATA_SOURCE === 'api' ? fetchFromApi(carId) : fetchFromLocalFile(carId);
