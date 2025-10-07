import { useRouter } from 'next/router';

export const useCarId = (): string => {
    const router = useRouter();
    const { gallery, carId } = router.query;

    // Wait for router to be ready
    if (!router.isReady) {
        return '52'; // fallback while loading
    }

    // Type check and validate carId
    if (typeof carId === 'string' && /^\d+$/.test(carId)) {
        return carId;
    }

    console.warn('Invalid car ID in URL. Using fallback.');
    return '52';
};
