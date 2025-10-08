// pages/index.js
import dynamic from 'next/dynamic';
import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import CarInfoBox from '../components/CarInfoBox';
import CarBodyStatus from '../components/CarBodyStatus';
import Car‌BodyStatBox from '../components/CarBodyStatusBox';
import ResetCameraButton from '../components/resetCamButton';
import GLBViewer from '../components/GLBViewer';
import FooterLogoSwitch from '../components/FooterLogo';
import CarLoadingScreen from '../components/CarLoadingScreen';
import useCarLoading from '../hooks/useCarLoading';
import { CarData } from '../types/car';
import { getFullFileUrl } from '../utils/url';
import { useCarId } from '../utils/route';

const ScreenRecorder = dynamic(() => import('../components/ScreenRecorder'), {
    ssr: false,
});
const Reall3dBrowser = dynamic(() => import('../components/Reall3d'), {
    ssr: false,
});

// Update fetchCarData to handle 404
const fetchCarData = async (carId: string, router): Promise<any> => {
    // const router = useRouter();

    try {
        const response = await fetch(`/api/cars/${carId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.status === 404) {
            router.push('/404');
        }

        if (!response.ok) router.push('/404');

        return response.json();
    } catch (error) {
        console.error('Error fetching car data:', error);
        router.push('/500');

    }
};

export default function HomeComponent() {
    const { carId, isLoading: isRouteLoading } = useCarId();
    const router = useRouter();

    // State management
    const { isLoading: isInitialLoading, finishLoading } = useCarLoading(true, 4000);
    const [isDataLoading, setIsDataLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [carData, setCarData] = useState<CarData | null>(null);

    // Animation and recording state management
    const [isAnimating, setIsAnimating] = useState(false);
    const [stopRecordingVal, setStopRecordingVal] = useState(false);
    const [shouldStartAnimation, setShouldStartAnimation] = useState(false);
    const reall3dRef = useRef<any>(null);
    const screenRecorderRef = useRef<any>(null);

    // const carDetails = {
    //     manufacturer: 'پژو',
    //     model: '207',
    //     price: '1,200,000 تومان',
    //     year: '1403',
    //     color: 'سفید صدفی',
    //     fuelType: 'بنزینی',
    //     mileage: '۱۵٬۰۰۰ کیلومتر',
    //     engineCondition: 'سالم',
    //     chassisCondition: 'سالم و پلمپ',
    //     bodyCondition: 'سالم و بی‌خط و خش',
    //     insuranceValidity: '۶ ماه',
    //     gearbox: 'اتوماتیک',
    // };
    // const carBodyStats = [
    //     { bodyPart: 'کاپوت', status: 'آسیب دیده' },
    //     { bodyPart: 'درب سمت راست', status: 'سالم' },
    //     { bodyPart: 'شیشه جلو', status: 'ترک خورده' },
    // ];
    const statusValue = useRef(100);

    // const damagedParts = [
    //     {
    //         partName: 'car_door_left',
    //         status: 'replaced',
    //         partModalData: {
    //             title: 'وضعیت بدنه',
    //             imageUrl: '/img/door.png',
    //             description: 'درب جلو سمت راننده تعویض',
    //         },
    //     },
    //     {
    //         partName: 'car_door_right',
    //         status: 'scratch',
    //         partModalData: {
    //             title: 'وضعیت بدنه',
    //             imageUrl: '/img/door-right.png',
    //             description: 'درب جلو سمت شاگرد خط و خش جزیی',
    //         },
    //     },
    //     {
    //         partName: 'car_tier_front_right',
    //         status: 'damaged',
    //         partModalData: {
    //             title: 'وضعیت بدنه',
    //             imageUrl: '/img/tire.png',
    //             description: 'لاستیک ها - 50%',
    //         },
    //     },
    //     {
    //         partName: 'car_tier_front_left',
    //         status: 'damaged',
    //         partModalData: {
    //             title: 'وضعیت بدنه',
    //             imageUrl: '/img/tire.png',
    //             description: 'لاستیک ها - 50%',
    //         },
    //     },
    //     {
    //         partName: 'car_roof',
    //         status: 'scratch',
    //         partModalData: {
    //             title: 'وضعیت بدنه',
    //             imageUrl: '/img/door.png',
    //             description: 'سقف دارای خط و خش جزیی',
    //         },
    //     },
    //     {
    //         partName: 'car_trunk',
    //         status: 'scratch',
    //         partModalData: {
    //             title: 'وضعیت بدنه',
    //             imageUrl: '/img/door.png',
    //             description: 'صندوق دارای خط و خش جزیی',
    //         },
    //     },
    //     {
    //         partName: 'car_caput',
    //         status: 'damaged',
    //         partModalData: {
    //             title: 'وضعیت بدنه',
    //             imageUrl: '/img/door.png',
    //             description: 'درب موتور دارای رنگ شدگی',
    //         },
    //     },
    // ];
    const [isShowBodyStatus, setIsShowBodyStatus] = useState(false);
    const [is3DViewerReady, setIs3DViewerReady] = useState(false);

    const showCarBodyStatus = () => {
        setIsShowBodyStatus(true);
        // setTimeout(() => {
        statusValue.current = 32;
        // }, 500);
    };
    const hideCarBodyStatus = () => {
        setIsShowBodyStatus(false);
        statusValue.current = 100;
    };

    // Handle loading completion when 3D viewer is ready
    const handleLoadingComplete = () => {
        console.log('3D Viewer finished loading');
        finishLoading();
    };

    // Trigger loading completion after a delay to simulate loading
    useEffect(() => {
        const loadingTimer = setTimeout(() => {
            handleLoadingComplete();
        }, 2000); // Simulated loading time

        return () => clearTimeout(loadingTimer);
    }, []);

    // Fetch car data
    useEffect(() => {
        const loadCarData = async () => {
            if (!carId) return; // Don't fetch if carId is null

            try {
                setIsDataLoading(true);
                const data = await fetchCarData(carId);
                setCarData(data?.data);
            } catch (err) {
                if (err.message === 'CAR_NOT_FOUND') {
                    router.push('/404');
                } else {
                    setError('Failed to load car data. Please try again.');
                }
            } finally {
                setIsDataLoading(false);
            }
        };

        loadCarData();
    }, [carId, router]);

    // Combined loading state
    const isLoading = isRouteLoading || isInitialLoading || isDataLoading;

    // Show loading screen while route is not ready
    if (isRouteLoading) {
        return <CarLoadingScreen isLoading={true} />;
    }

    // Show error state
    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-red-500 text-center">
                    <h2 className="text-xl font-bold mb-2">خطا</h2>
                    <p>{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
                    >
                        تلاش مجدد
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* Beautiful Car-Themed Loading Screen */}
            <CarLoadingScreen
                isLoading={isLoading}
                // isLoading={isLoading} 
                onComplete={() => console.log('Loading animation completed')}
            />

            {/* Main App Content */}
            {carData && (
                <div
                    style={{
                        width: '100vw',
                        height: '100vh',
                        opacity: isLoading ? 0 : 1,
                        transition: 'opacity 0.8s ease-in-out',
                        pointerEvents: isLoading ? 'none' : 'auto'
                    }}
                >
                    <ScreenRecorder
                        ref={screenRecorderRef}
                        // @ts-ignore
                        onStartRecording={handleStartAnimationWithRecording}
                        isAnimating={isAnimating}
                        stopRecordingVal={stopRecordingVal}
                    />
                    <CarInfoBox carDetails={carData.carDetails} />
                    <ResetCameraButton onResetTheCamera={handleShowBodyStatus} />
                    {isShowBodyStatus && (
                        <div className={'car-body-stat'}>
                            <Car‌BodyStatBox carBodyStat={carData.bodyStats} />
                            <CarBodyStatus status={statusValue.current} />
                        </div>
                    )}
                    {carData?.fileUrl && (
                        <Reall3dBrowser
                            ref={reall3dRef}
                            // @ts-ignore
                            fileUrl={getFullFileUrl(carData.fileUrl)}
                            shouldStartAnimation={shouldStartAnimation}
                            onAnimationPause={handleAnimationPause}
                            onAnimationComplete={handleAnimationComplete}
                            onAnimationStart={() => setIsAnimating(true)}
                        />
                    )}
                    <FooterLogoSwitch />
                </div>
            )}
        </>
    );
}
