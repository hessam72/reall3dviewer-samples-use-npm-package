'use client';
import React, { useState } from 'react';
import CarLoadingScreen from './CarLoadingScreen';

const CarLoadingDemo = () => {
    const [isLoading, setIsLoading] = useState(false);
    
    const startDemo = () => {
        setIsLoading(true);
    };
    
    const handleComplete = () => {
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    };
    
    if (isLoading) {
        return <CarLoadingScreen isLoading={isLoading} onComplete={handleComplete} />;
    }
    
    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            background: '#1a1a2e',
            fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
            <button
                onClick={startDemo}
                style={{
                    padding: '20px 40px',
                    background: 'linear-gradient(135deg, #ff6b6b, #4ecdc4)',
                    border: 'none',
                    borderRadius: '16px',
                    color: 'white',
                    fontSize: '18px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                    transition: 'all 0.3s ease',
                    transform: 'scale(1)'
                }}
                onMouseOver={(e) => {
                    e.target.style.transform = 'scale(1.05)';
                    e.target.style.boxShadow = '0 12px 48px rgba(0, 0, 0, 0.4)';
                }}
                onMouseOut={(e) => {
                    e.target.style.transform = 'scale(1)';
                    e.target.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3)';
                }}
            >
                🚗 نمایش صفحه بارگیری خودرو
            </button>
        </div>
    );
};

export default CarLoadingDemo;