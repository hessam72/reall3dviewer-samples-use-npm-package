// pages/index.js
import dynamic from 'next/dynamic';
import React, { useEffect, useRef, useState } from 'react';
import CarInfoBox from '../components/CarInfoBox';
import CarBodyStatus from '../components/CarBodyStatus';
import Car‌BodyStatBox from '../components/CarBodyStatusBox';
import ResetCameraButton from '../components/resetCamButton';

const Reall3dBrowser = dynamic(() => import('../components/Reall3d'), {
    ssr: false,
});

export default function Home() {
    const carDetails = {
        manufacturer: 'پژو',
        model: '207',
        price: '1,200,000 تومان',
        year: '1403',
        color: 'سفید صدفی',
        fuelType: 'بنزینی',
        mileage: '۱۵٬۰۰۰ کیلومتر',
        engineCondition: 'سالم',
        chassisCondition: 'سالم و پلمپ',
        bodyCondition: 'سالم و بی‌خط و خش',
        insuranceValidity: '۶ ماه',
        gearbox: 'اتوماتیک',
    };
    const carBodyStats = [
        { bodyPart: 'کاپوت', status: 'آسیب دیده' },
        { bodyPart: 'درب سمت راست', status: 'سالم' },
        { bodyPart: 'شیشه جلو', status: 'ترک خورده' },
    ];
    const statusValue = useRef(100);

    const damagedParts = [
        {
            partName: 'car_door_left',
            status: 'replaced',
            partModalData: {
                title: 'وضعیت بدنه',
                imageUrl: '/img/door.png',
                description: 'درب جلو سمت راننده تعویض',
            },
        },
        {
            partName: 'car_door_right',
            status: 'scratch',
            partModalData: {
                title: 'وضعیت بدنه',
                imageUrl: '/img/door-right.png',
                description: 'درب جلو سمت شاگرد خط و خش جزیی',
            },
        },
        {
            partName: 'car_tier_front_right',
            status: 'damaged',
            partModalData: {
                title: 'وضعیت بدنه',
                imageUrl: '/img/tire.png',
                description: 'لاستیک ها - 50%',
            },
        },
        {
            partName: 'car_tier_front_left',
            status: 'damaged',
            partModalData: {
                title: 'وضعیت بدنه',
                imageUrl: '/img/tire.png',
                description: 'لاستیک ها - 50%',
            },
        },
        {
            partName: 'car_roof',
            status: 'scratch',
            partModalData: {
                title: 'وضعیت بدنه',
                imageUrl: '/img/door.png',
                description: 'سقف دارای خط و خش جزیی',
            },
        },
        {
            partName: 'car_trunk',
            status: 'scratch',
            partModalData: {
                title: 'وضعیت بدنه',
                imageUrl: '/img/door.png',
                description: 'صندوق دارای خط و خش جزیی',
            },
        },
        {
            partName: 'car_caput',
            status: 'damaged',
            partModalData: {
                title: 'وضعیت بدنه',
                imageUrl: '/img/door.png',
                description: 'درب موتور دارای رنگ شدگی',
            },
        },
    ];
    const [isShowBodyStatus, setIsShowBodyStatus] = useState(false);

    const showCarBodyStatus = () => {
        setIsShowBodyStatus(true);
        // setTimeout(() => {
        statusValue.current = 30;
        // }, 500);
    };
    const hideCarBodyStatus = () => {
        setIsShowBodyStatus(false);
        statusValue.current = 100;
    };

    const handleShowBodyStatus = () => {
        isShowBodyStatus ? hideCarBodyStatus() : showCarBodyStatus();
    };

    return (
        <div style={{ width: '100vw', height: '100vh' }}>
            {/* <span style={{ position: 'absolute', color: 'white', top: 10, left: 10 }}>نمای سه بعدی خودروی ۲۰۷</span> */}
            <CarInfoBox carDetails={carDetails} />
            <ResetCameraButton onResetTheCamera={handleShowBodyStatus} />
            {isShowBodyStatus && (
                <div className={'car-body-stat'}>
                    <Car‌BodyStatBox carBodyStat={carBodyStats} />
                    <CarBodyStatus status={statusValue.current} />
                </div>
            )}

            <Reall3dBrowser />
        </div>
    );
}
