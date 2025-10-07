import { useRouter } from 'next/router';

export const useCarId = (): string => {
    const router = useRouter();
    const { gallery, carId } = router.query;

    // Wait for router to be ready
    if (!router.isReady) {
        return '52';
    }

    // Handle 404 for invalid carId
    if (typeof carId !== 'string' || !/^\d+$/.test(carId)) {
        router.push('/404');
        return '52';
    }

    return carId;
};
