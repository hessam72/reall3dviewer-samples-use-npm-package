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
                {/* Animated Modern Car SVG */}
                <div className="car-container">
                    <div className="car-body">
                        <svg viewBox="0 0 500 300" className="car-svg">
                            <defs>
                                {/* Gradients */}
                                <linearGradient id="carBodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#e74c3c" />
                                    <stop offset="50%" stopColor="#c0392b" />
                                    <stop offset="100%" stopColor="#a93226" />
                                </linearGradient>
                                <linearGradient id="carRoofGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#2c3e50" />
                                    <stop offset="100%" stopColor="#34495e" />
                                </linearGradient>
                                <linearGradient id="wheelGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#2c3e50" />
                                    <stop offset="50%" stopColor="#34495e" />
                                    <stop offset="100%" stopColor="#2c3e50" />
                                </linearGradient>
                                <linearGradient id="windowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="rgba(135, 206, 235, 0.9)" />
                                    <stop offset="100%" stopColor="rgba(70, 130, 180, 0.6)" />
                                </linearGradient>
                                
                                {/* Filters */}
                                <filter id="carShadow" x="-50%" y="-50%" width="200%" height="200%">
                                    <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="rgba(0,0,0,0.3)"/>
                                </filter>
                                <filter id="wheelShadow" x="-50%" y="-50%" width="200%" height="200%">
                                    <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="rgba(0,0,0,0.5)"/>
                                </filter>
                                <filter id="glow">
                                    <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                                    <feMerge>
                                        <feMergeNode in="coloredBlur"/>
                                        <feMergeNode in="SourceGraphic"/>
                                    </feMerge>
                                </filter>
                            </defs>
                            
                            {/* Car Shadow */}
                            <ellipse cx="250" cy="240" rx="120" ry="20" fill="rgba(0,0,0,0.2)" className="car-shadow" />
                            
                            {/* Main Car Body */}
                            <path
                                d="M100 180 L380 180 L390 170 L400 160 L400 150 L390 140 L370 130 L330 130 L320 135 L180 135 L170 130 L130 130 L110 140 L100 150 Z"
                                fill="url(#carBodyGradient)"
                                className="car-main-body"
                                filter="url(#carShadow)"
                            />
                            
                            {/* Car Roof */}
                            <path
                                d="M140 135 L360 135 L370 130 L350 120 L320 115 L180 115 L150 120 L130 130 Z"
                                fill="url(#carRoofGradient)"
                                className="car-roof"
                            />
                            
                            {/* Windows */}
                            <path
                                d="M160 130 L340 130 L350 125 L330 118 L170 118 L150 125 Z"
                                fill="url(#windowGradient)"
                                className="car-window"
                            />
                            
                            {/* Window Frames */}
                            <rect x="245" y="118" width="10" height="17" fill="#2c3e50" className="window-frame" />
                            
                            {/* Front Grille */}
                            <rect x="95" y="150" width="15" height="25" rx="7" fill="#1a1a1a" className="front-grille" />
                            <rect x="98" y="153" width="9" height="3" fill="#444" />
                            <rect x="98" y="158" width="9" height="3" fill="#444" />
                            <rect x="98" y="163" width="9" height="3" fill="#444" />
                            <rect x="98" y="168" width="9" height="3" fill="#444" />
                            
                            {/* Headlights */}
                            <circle cx="110" cy="155" r="8" fill="#f8f9fa" className="headlight front-light" filter="url(#glow)" />
                            <circle cx="110" cy="155" r="5" fill="#ffd93d" className="headlight-inner" />
                            
                            {/* Taillights */}
                            <circle cx="390" cy="155" r="6" fill="#e74c3c" className="taillight" />
                            <circle cx="390" cy="165" r="4" fill="#f39c12" className="turn-signal" />
                            
                            {/* Door Lines */}
                            <path d="M180 140 L180 175" stroke="#a93226" strokeWidth="2" className="door-line" />
                            <path d="M320 140 L320 175" stroke="#a93226" strokeWidth="2" className="door-line" />
                            
                            {/* Door Handles */}
                            <rect x="200" y="157" width="8" height="3" rx="1.5" fill="#2c3e50" className="door-handle" />
                            <rect x="290" y="157" width="8" height="3" rx="1.5" fill="#2c3e50" className="door-handle" />
                            
                            {/* Front Wheel */}
                            <g className="wheel-group front-wheel">
                                <circle cx="150" cy="200" r="25" fill="url(#wheelGradient)" className="wheel-outer" filter="url(#wheelShadow)" />
                                <circle cx="150" cy="200" r="18" fill="#1a1a1a" className="wheel-tire" />
                                <circle cx="150" cy="200" r="12" fill="#2c3e50" className="wheel-rim" />
                                <circle cx="150" cy="200" r="8" fill="#34495e" className="wheel-center" />
                                {/* Spokes */}
                                <g className="wheel-spokes">
                                    <line x1="142" y1="200" x2="158" y2="200" stroke="#555" strokeWidth="2" />
                                    <line x1="150" y1="192" x2="150" y2="208" stroke="#555" strokeWidth="2" />
                                    <line x1="145" y1="195" x2="155" y2="205" stroke="#555" strokeWidth="1.5" />
                                    <line x1="155" y1="195" x2="145" y2="205" stroke="#555" strokeWidth="1.5" />
                                </g>
                                <circle cx="150" cy="200" r="3" fill="#666" className="wheel-bolt" />
                            </g>
                            
                            {/* Rear Wheel */}
                            <g className="wheel-group rear-wheel">
                                <circle cx="350" cy="200" r="25" fill="url(#wheelGradient)" className="wheel-outer" filter="url(#wheelShadow)" />
                                <circle cx="350" cy="200" r="18" fill="#1a1a1a" className="wheel-tire" />
                                <circle cx="350" cy="200" r="12" fill="#2c3e50" className="wheel-rim" />
                                <circle cx="350" cy="200" r="8" fill="#34495e" className="wheel-center" />
                                {/* Spokes */}
                                <g className="wheel-spokes">
                                    <line x1="342" y1="200" x2="358" y2="200" stroke="#555" strokeWidth="2" />
                                    <line x1="350" y1="192" x2="350" y2="208" stroke="#555" strokeWidth="2" />
                                    <line x1="345" y1="195" x2="355" y2="205" stroke="#555" strokeWidth="1.5" />
                                    <line x1="355" y1="195" x2="345" y2="205" stroke="#555" strokeWidth="1.5" />
                                </g>
                                <circle cx="350" cy="200" r="3" fill="#666" className="wheel-bolt" />
                            </g>
                            
                            {/* Side Mirror */}
                            <ellipse cx="130" cy="145" rx="4" ry="2" fill="#2c3e50" className="side-mirror" />
                            
                            {/* Antenna */}
                            <line x1="370" y1="115" x2="375" y2="105" stroke="#2c3e50" strokeWidth="2" className="antenna" />
                            <circle cx="375" cy="105" r="1.5" fill="#e74c3c" className="antenna-tip" />
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
                    50% { transform: translateY(-12px); }
                }
                
                .car-shadow {
                    animation: shadowPulse 2s ease-in-out infinite;
                }
                
                @keyframes shadowPulse {
                    0%, 100% { transform: scale(1) translateY(0px); opacity: 0.2; }
                    50% { transform: scale(1.1) translateY(-2px); opacity: 0.3; }
                }
                
                .car-main-body {
                    animation: bodyShine 3s ease-in-out infinite;
                    transform-origin: center;
                }
                
                @keyframes bodyShine {
                    0%, 100% { filter: brightness(1) saturate(1); }
                    50% { filter: brightness(1.3) saturate(1.4); }
                }
                
                .car-roof {
                    animation: roofGlow 4s ease-in-out infinite alternate;
                }
                
                @keyframes roofGlow {
                    from { filter: brightness(1); }
                    to { filter: brightness(1.2); }
                }
                
                .wheel-group {
                    animation: wheelSpin 1s linear infinite;
                    transform-origin: center;
                }
                
                @keyframes wheelSpin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                
                .front-wheel {
                    transform-origin: 150px 200px;
                }
                
                .rear-wheel {
                    transform-origin: 350px 200px;
                }
                
                .headlight {
                    animation: headlightPulse 2s ease-in-out infinite;
                }
                
                @keyframes headlightPulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.8; transform: scale(1.1); }
                }
                
                .taillight {
                    animation: taillightBlink 1.5s ease-in-out infinite;
                }
                
                @keyframes taillightBlink {
                    0%, 85%, 100% { opacity: 1; }
                    90%, 95% { opacity: 0.4; }
                }
                
                .turn-signal {
                    animation: turnSignalFlash 1s ease-in-out infinite;
                }
                
                @keyframes turnSignalFlash {
                    0%, 50%, 100% { opacity: 0.3; }
                    25%, 75% { opacity: 1; }
                }
                
                .antenna {
                    animation: antennaWave 3s ease-in-out infinite;
                    transform-origin: 370px 115px;
                }
                
                @keyframes antennaWave {
                    0%, 100% { transform: rotate(0deg); }
                    25% { transform: rotate(2deg); }
                    75% { transform: rotate(-2deg); }
                }
                
                .side-mirror {
                    animation: mirrorGlint 4s ease-in-out infinite;
                }
                
                @keyframes mirrorGlint {
                    0%, 90%, 100% { opacity: 1; }
                    95% { opacity: 0.6; filter: brightness(1.5); }
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