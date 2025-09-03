'use client';
import React, { useState, useEffect } from 'react';

const CarLoadingScreen = ({ isLoading = true, onComplete }) => {
    const [progress, setProgress] = useState(0);
    const [loadingPhase, setLoadingPhase] = useState('initializing'); // initializing, loading, completing
    
    useEffect(() => {
        if (!isLoading) return;
        
        const progressInterval = setInterval(() => {
            setProgress(prev => {
                const increment = Math.random() * 15 + 5; // Random increment between 5-20%
                const newProgress = Math.min(prev + increment, 100);
                
                // Update loading phases based on progress
                if (newProgress < 30) {
                    setLoadingPhase('initializing');
                } else if (newProgress < 90) {
                    setLoadingPhase('loading');
                } else {
                    setLoadingPhase('completing');
                }
                
                if (newProgress >= 100) {
                    setTimeout(() => {
                        onComplete && onComplete();
                    }, 800);
                    clearInterval(progressInterval);
                }
                
                return newProgress;
            });
        }, 150);

        return () => clearInterval(progressInterval);
    }, [isLoading, onComplete]);

    if (!isLoading) return null;

    const getLoadingText = () => {
        switch (loadingPhase) {
            case 'initializing':
                return 'راه‌اندازی موتور سه‌بعدی...';
            case 'loading':
                return 'بارگیری مدل خودرو...';
            case 'completing':
                return 'نهایی‌سازی نمایش...';
            default:
                return 'در حال بارگیری...';
        }
    };

    return (
        <div className="car-loading-screen">
            {/* Background with animated gradient */}
            <div className="loading-background">
                <div className="gradient-orb orb-1"></div>
                <div className="gradient-orb orb-2"></div>
                <div className="gradient-orb orb-3"></div>
            </div>
            
            {/* Main loading content */}
            <div className="loading-content">
                {/* Animated Car SVG */}
                <div className="car-container">
                    <div className="car-body">
                        <svg viewBox="0 0 400 200" className="car-svg">
                            {/* Car Body */}
                            <defs>
                                <linearGradient id="carGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#ff6b6b" />
                                    <stop offset="50%" stopColor="#4ecdc4" />
                                    <stop offset="100%" stopColor="#45b7d1" />
                                </linearGradient>
                                <linearGradient id="wheelGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#2c3e50" />
                                    <stop offset="100%" stopColor="#34495e" />
                                </linearGradient>
                                <filter id="glow">
                                    <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                                    <feMerge>
                                        <feMergeNode in="coloredBlur"/>
                                        <feMergeNode in="SourceGraphic"/>
                                    </feMerge>
                                </filter>
                            </defs>
                            
                            {/* Car body */}
                            <path
                                d="M80 120 L320 120 L330 110 L340 100 L340 90 L330 80 L310 70 L280 70 L270 75 L230 75 L220 70 L180 70 L170 75 L120 75 L110 80 L90 90 L80 100 Z"
                                fill="url(#carGradient)"
                                className="car-main-body"
                                filter="url(#glow)"
                            />
                            
                            {/* Car windows */}
                            <path
                                d="M120 75 L270 75 L280 70 L310 70 L320 80 L310 90 L130 90 L120 80 Z"
                                fill="rgba(135, 206, 235, 0.7)"
                                className="car-window"
                            />
                            
                            {/* Car details */}
                            <rect x="90" y="95" width="20" height="8" rx="4" fill="#ffd93d" className="headlight" />
                            <rect x="300" y="95" width="20" height="8" rx="4" fill="#ff6b6b" className="taillight" />
                            
                            {/* Wheels */}
                            <circle cx="130" cy="135" r="15" fill="url(#wheelGradient)" className="wheel wheel-front" />
                            <circle cx="130" cy="135" r="8" fill="#1a1a1a" className="wheel-center" />
                            <circle cx="280" cy="135" r="15" fill="url(#wheelGradient)" className="wheel wheel-back" />
                            <circle cx="280" cy="135" r="8" fill="#1a1a1a" className="wheel-center" />
                            
                            {/* Wheel spokes */}
                            <g className="wheel-spokes">
                                <line x1="125" y1="135" x2="135" y2="135" stroke="#666" strokeWidth="1" />
                                <line x1="130" y1="130" x2="130" y2="140" stroke="#666" strokeWidth="1" />
                                <line x1="275" y1="135" x2="285" y2="135" stroke="#666" strokeWidth="1" />
                                <line x1="280" y1="130" x2="280" y2="140" stroke="#666" strokeWidth="1" />
                            </g>
                        </svg>
                        
                        {/* Moving road lines */}
                        <div className="road-container">
                            <div className="road-line road-line-1"></div>
                            <div className="road-line road-line-2"></div>
                            <div className="road-line road-line-3"></div>
                        </div>
                    </div>
                </div>
                
                {/* Progress Section */}
                <div className="progress-section">
                    <div className="loading-text">
                        <h2>{getLoadingText()}</h2>
                        <div className="progress-percentage">{Math.round(progress)}%</div>
                    </div>
                    
                    {/* Animated Progress Bar */}
                    <div className="progress-container">
                        <div className="progress-track">
                            <div 
                                className="progress-fill"
                                style={{ width: `${progress}%` }}
                            >
                                <div className="progress-shine"></div>
                            </div>
                        </div>
                        <div className="progress-indicators">
                            <div className={`indicator ${progress >= 25 ? 'active' : ''}`}></div>
                            <div className={`indicator ${progress >= 50 ? 'active' : ''}`}></div>
                            <div className={`indicator ${progress >= 75 ? 'active' : ''}`}></div>
                            <div className={`indicator ${progress >= 100 ? 'active' : ''}`}></div>
                        </div>
                    </div>
                </div>
                
                {/* Floating particles */}
                <div className="particles-container">
                    {[...Array(12)].map((_, i) => (
                        <div 
                            key={i}
                            className="particle"
                            style={{
                                '--delay': `${i * 0.5}s`,
                                '--duration': `${3 + Math.random() * 2}s`,
                                '--x': `${Math.random() * 100}%`,
                                '--y': `${Math.random() * 100}%`
                            }}
                        ></div>
                    ))}
                </div>
            </div>
            
            <style jsx>{`
                .car-loading-screen {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: radial-gradient(ellipse at center, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
                    z-index: 9999;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
                    overflow: hidden;
                }
                
                .loading-background {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    overflow: hidden;
                }
                
                .gradient-orb {
                    position: absolute;
                    border-radius: 50%;
                    filter: blur(60px);
                    opacity: 0.6;
                    animation: float 8s ease-in-out infinite;
                }
                
                .orb-1 {
                    width: 300px;
                    height: 300px;
                    background: radial-gradient(circle, #ff6b6b, transparent);
                    top: 10%;
                    left: 10%;
                    animation-delay: 0s;
                }
                
                .orb-2 {
                    width: 250px;
                    height: 250px;
                    background: radial-gradient(circle, #4ecdc4, transparent);
                    top: 60%;
                    right: 15%;
                    animation-delay: 2s;
                }
                
                .orb-3 {
                    width: 200px;
                    height: 200px;
                    background: radial-gradient(circle, #45b7d1, transparent);
                    bottom: 20%;
                    left: 30%;
                    animation-delay: 4s;
                }
                
                @keyframes float {
                    0%, 100% { transform: translateY(0px) scale(1); }
                    33% { transform: translateY(-20px) scale(1.1); }
                    66% { transform: translateY(10px) scale(0.9); }
                }
                
                .loading-content {
                    position: relative;
                    z-index: 10;
                    text-align: center;
                    max-width: 600px;
                    padding: 40px;
                }
                
                .car-container {
                    margin-bottom: 60px;
                    position: relative;
                }
                
                .car-body {
                    position: relative;
                    display: inline-block;
                }
                
                .car-svg {
                    width: 400px;
                    height: 200px;
                    filter: drop-shadow(0 10px 30px rgba(0, 0, 0, 0.3));
                    animation: carBounce 2s ease-in-out infinite;
                }
                
                @keyframes carBounce {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-8px); }
                }
                
                .car-main-body {
                    animation: colorShift 4s ease-in-out infinite;
                    transform-origin: center;
                }
                
                @keyframes colorShift {
                    0%, 100% { filter: hue-rotate(0deg) brightness(1); }
                    50% { filter: hue-rotate(30deg) brightness(1.2); }
                }
                
                .wheel {
                    animation: wheelSpin 1s linear infinite;
                    transform-origin: center;
                }
                
                @keyframes wheelSpin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                
                .headlight {
                    animation: blink 2s ease-in-out infinite;
                }
                
                @keyframes blink {
                    0%, 90%, 100% { opacity: 1; }
                    95% { opacity: 0.3; }
                }
                
                .road-container {
                    position: absolute;
                    bottom: -20px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 500px;
                    height: 4px;
                    overflow: hidden;
                }
                
                .road-line {
                    position: absolute;
                    width: 60px;
                    height: 3px;
                    background: linear-gradient(90deg, transparent, #ffffff, transparent);
                    animation: roadMove 1.5s linear infinite;
                }
                
                .road-line-1 { animation-delay: 0s; }
                .road-line-2 { animation-delay: 0.5s; }
                .road-line-3 { animation-delay: 1s; }
                
                @keyframes roadMove {
                    from { transform: translateX(-100px); }
                    to { transform: translateX(500px); }
                }
                
                .progress-section {
                    margin-top: 40px;
                }
                
                .loading-text {
                    margin-bottom: 30px;
                }
                
                .loading-text h2 {
                    color: #ffffff;
                    font-size: 28px;
                    font-weight: 600;
                    margin: 0 0 15px 0;
                    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
                    animation: textGlow 2s ease-in-out infinite alternate;
                    direction: rtl;
                    text-align: center;
                }
                
                @keyframes textGlow {
                    from { text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3), 0 0 20px rgba(69, 183, 209, 0.5); }
                    to { text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3), 0 0 30px rgba(255, 107, 107, 0.7); }
                }
                
                .progress-percentage {
                    font-size: 48px;
                    font-weight: 700;
                    color: transparent;
                    background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1);
                    background-size: 300% 300%;
                    -webkit-background-clip: text;
                    background-clip: text;
                    animation: gradientMove 3s ease-in-out infinite;
                    font-family: 'SF Mono', Monaco, Consolas, monospace;
                }
                
                @keyframes gradientMove {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                
                .progress-container {
                    position: relative;
                    margin-top: 30px;
                }
                
                .progress-track {
                    width: 100%;
                    height: 8px;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                    overflow: hidden;
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }
                
                .progress-fill {
                    height: 100%;
                    background: linear-gradient(90deg, #ff6b6b, #4ecdc4, #45b7d1);
                    border-radius: 10px;
                    transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative;
                    overflow: hidden;
                }
                
                .progress-shine {
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent);
                    animation: shine 2s linear infinite;
                }
                
                @keyframes shine {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(300%); }
                }
                
                .progress-indicators {
                    display: flex;
                    justify-content: space-between;
                    margin-top: 15px;
                    padding: 0 5px;
                }
                
                .indicator {
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.2);
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative;
                }
                
                .indicator.active {
                    background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
                    box-shadow: 0 0 20px rgba(78, 205, 196, 0.6);
                    transform: scale(1.3);
                }
                
                .indicator.active::after {
                    content: '';
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 6px;
                    height: 6px;
                    background: white;
                    border-radius: 50%;
                }
                
                .particles-container {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                    overflow: hidden;
                }
                
                .particle {
                    position: absolute;
                    width: 4px;
                    height: 4px;
                    background: radial-gradient(circle, #ffffff, transparent);
                    border-radius: 50%;
                    animation: particleFloat var(--duration, 4s) ease-in-out infinite;
                    animation-delay: var(--delay, 0s);
                    left: var(--x, 50%);
                    top: var(--y, 50%);
                }
                
                @keyframes particleFloat {
                    0%, 100% {
                        transform: translateY(0px) scale(0.8);
                        opacity: 0.4;
                    }
                    50% {
                        transform: translateY(-30px) scale(1.2);
                        opacity: 1;
                    }
                }
                
                /* Responsive Design */
                @media (max-width: 768px) {
                    .loading-content {
                        padding: 20px;
                        max-width: 90vw;
                    }
                    
                    .car-svg {
                        width: 300px;
                        height: 150px;
                    }
                    
                    .loading-text h2 {
                        font-size: 22px;
                    }
                    
                    .progress-percentage {
                        font-size: 36px;
                    }
                    
                    .road-container {
                        width: 350px;
                    }
                }
                
                @media (max-width: 480px) {
                    .car-svg {
                        width: 250px;
                        height: 125px;
                    }
                    
                    .loading-text h2 {
                        font-size: 18px;
                    }
                    
                    .progress-percentage {
                        font-size: 28px;
                    }
                    
                    .road-container {
                        width: 280px;
                    }
                }
            `}</style>
        </div>
    );
};

export default CarLoadingScreen;