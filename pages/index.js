// pages/index.js
import dynamic from 'next/dynamic';
import React from 'react';
import CarInfoBox from '../components/CarInfoBox';

const Reall3dBrowser = dynamic(() => import('../components/Reall3d'), {
    ssr: false,
});
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

export default function Home() {
    return (
        <div style={{ width: '100vw', height: '100vh' }}>
            <span style={{ position: 'absolute', color: 'white', top: 10, left: 10 }}>نمای سه بعدی خودروی ۲۰۷</span>
            <CarInfoBox carDetails={carDetails} />
            <Reall3dBrowser />
        </div>
    );
}
