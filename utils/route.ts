import { useRouter } from 'next/router';

export const useCarId = (): { carId: string | null; isLoading: boolean } => {
    const router = useRouter();
    const { gallery, carId } = router.query;

    // Return loading state while router is not ready
    if (!router.isReady) {
        return { carId: null, isLoading: true };
    }

    // Handle 404 for invalid carId
    if (typeof carId !== 'string' || !/^\d+$/.test(carId)) {
        router.push('/404');
        return { carId: null, isLoading: false };
    }

    return { carId, isLoading: false };
};
