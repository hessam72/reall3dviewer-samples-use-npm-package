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
import { fetchCarData, CarNotFoundError } from '../utils/carData';
import { useCarId } from '../utils/route';

const ScreenRecorder = dynamic(() => import('../components/ScreenRecorder'), {
    ssr: false,
});
const Reall3dBrowser = dynamic(() => import('../components/Reall3d'), {
    ssr: false,
});

export default function HomeComponent() {
    const router = useRouter();
    const { carId, isLoading: isRouteLoading } = useCarId();


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


    const statusValue = useRef(100);


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
            try {
                setIsDataLoading(true);
                const data = await fetchCarData(carId);
                console.log('car data:  ', data)
                setCarData(data);
            } catch (err) {
                if (err instanceof CarNotFoundError) {
                    router.push('/404');
                } else {
                    console.error('Error loading car data:', err);
                    router.push('/500');
                }
            } finally {
                setIsDataLoading(false);
            }
        };


        if (carId) {
            loadCarData();

        }
    }, [carId, router]); // Add router to dependencies

    // Handle loading completion when both initial load and data fetch are done
    useEffect(() => {
        if (!isDataLoading && carData) {
            handleLoadingComplete();
        }
    }, [isDataLoading, carData]);

    const handleShowBodyStatus = () => {
        isShowBodyStatus ? hideCarBodyStatus() : showCarBodyStatus();
    };

    // Handle animation start from recording
    const handleStartAnimationWithRecording = () => {
        console.log('handleStartAnimationWithRecording called');
        setShouldStartAnimation(true);
    };

    // Handle animation pause (stop recording during pause)
    const handleAnimationPause = () => {
        console.log('----------pause inside index.ts-------------');
        console.log('screenRecorderRef.current:', screenRecorderRef.current);
        console.log('stopRecording method available:', typeof screenRecorderRef.current?.stopRecording);

        setStopRecordingVal(true)
    };

    // Handle animation completion 
    const handleAnimationComplete = () => {
        setIsAnimating(false);
        setShouldStartAnimation(false);
    };

    // Test refs after mount
    useEffect(() => {
        setTimeout(() => {
            console.log('Testing refs after 3 seconds...');
            console.log('screenRecorderRef.current:', screenRecorderRef.current);
            console.log('Methods on ref:', Object.keys(screenRecorderRef.current || {}));
            console.log('reall3dRef.current:', reall3dRef.current);
            if (screenRecorderRef.current?.stopRecording) {
                console.log('stopRecording method is available via ref');
                // Test the method
                console.log('Testing stopRecording method...');
                try {
                    // Don't actually call it, just check if it exists
                    console.log('stopRecording function type:', typeof screenRecorderRef.current.stopRecording);
                } catch (e) {
                    console.log('Error testing stopRecording:', e);
                }
            } else {
                console.log('stopRecording method is NOT available via ref');
            }
        }, 3000);
    }, []);
    // Show loading screen while route is not ready
    if (isRouteLoading) {
        return <CarLoadingScreen isLoading={true} onComplete={() => console.log('Loading animation completed')}
        />;
    }
    // Error state
    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-red-500 text-center">
                    <h2 className="text-xl font-bold mb-2">Error</h2>
                    <p>{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    // Combined loading state
    const isLoading = isInitialLoading || isDataLoading;

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
                            fileUrl={carData.fileUrl}
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
