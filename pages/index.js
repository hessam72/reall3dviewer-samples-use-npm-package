// pages/index.js
import dynamic from 'next/dynamic';
import React from 'react';

const Reall3dBrowser = dynamic(() => import('../components/Reall3d'), {
    ssr: false,
});

export default function Home() {
    return (
        <div style={{ width: '100vw', height: '100vh' }}>
            <Reall3dBrowser />
            <span style={{ position: 'absolute', color: 'white', top: 10, left: 10 }}>نمای سه بعدی خودروی ۲۰۷</span>
        </div>
    );
}
