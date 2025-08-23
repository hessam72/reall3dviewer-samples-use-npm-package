// components/Reall3d.js
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Reall3dViewer } from '@reall3d/reall3dviewer';
import '@reall3d/reall3dviewer/dist/style.css';
import { performComplexAnimation } from '../utils/animationUtils.js';

export default function Reall3d() {
    const containerRef = useRef(null);
    const viewerRef = useRef(null);
    const [isAnimating, setIsAnimating] = useState(false);

    // URLs for the two PLY models
    // const MODEL_B = '/new_3DGS.ply';
    // const MODEL_A = '/3DGS _full.ply';
    const MODEL_C = '/last-car-scene.splat';
    // const MODEL_D = '/new_car.splat';
    const [modelUrl, setModelUrl] = useState(MODEL_C);
    const MODELS = [MODEL_C];

    // Re-initialize viewer whenever modelUrl changes
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // Remove previous content (canvas, etc.)
        container.innerHTML = '';

        // Clean up previous viewer instance
        if (viewerRef.current) {
            const prev = viewerRef.current;
            if (typeof prev.destroy === 'function') prev.destroy();
            else if (typeof prev.dispose === 'function') prev.dispose();
            // else no cleanup method available
            viewerRef.current = null;
        }

        // Instantiate viewer with built-in camera controls
        const viewer = new Reall3dViewer({
            root: container,
            shDegree: 3,
            // Camera settings
            fov: 50,
            position: [0, -5, 15],
            lookAt: [0, 0, 0],
            lookUp: [0, -1, 0],
            // Control settings
            enableDamping: true,
            enableZoom: true,
            enableRotate: true,
            enablePan: true,
            enableKeyboard: true,
            autoRotate: false,
            minDistance: 1,
            maxDistance: 18,
            minPolarAngle: -1,
            maxPolarAngle: 1.63,
            // Rendering settings
            pointcloudMode: false,
            alpha: false,
            antialias: false,
        });

        console.log('viewer:   ', viewer.splatMesh);

        // setTimeout(() => {
        //     viewer.splatMesh.scale.x = 2;
        //     viewer.splatMesh.scale.y = 2;
        //     viewer.splatMesh.scale.z = 2;
        // }, 5000);

        // Remove default environment and background nodes
        viewer.environmentNode = null;
        viewer.backgroundNode = null;

        // Load the selected PLY model
        viewer.addModel(modelUrl).catch(err => console.error('PLY loading error:', err));

        // Store viewer instance in ref
        viewerRef.current = viewer;



        // Store animation function in viewer for external access
        viewer.performComplexAnimation = () => performComplexAnimation(viewer, setIsAnimating);
        // Cleanup on component unmount
        return () => {
            const curr = viewerRef.current;
            if (curr) {
                if (typeof curr.destroy === 'function') curr.destroy();
                else if (typeof curr.dispose === 'function') curr.dispose();
            }
            viewerRef.current = null;
            container.innerHTML = '';
        };
    }, [modelUrl]);

    // Complex animation trigger function
    const handleSmoothMove = () => {
        const viewer = viewerRef.current;
        if (!viewer || !viewer.performComplexAnimation || isAnimating) return;

        // Execute the complex animation sequence
        viewer.performComplexAnimation();
    };

    // Toggle between models
    const handleSwitch = () => {
        setModelUrl(prev => {
            const idx = MODELS.indexOf(prev);
            // If somehow prev isn't found, default to 0
            const nextIndex = idx < 0 ? 0 : (idx + 1) % MODELS.length;
            return MODELS[nextIndex];
        });
    };

    return (
        <>
            {/* Smooth animation button */}
            <button
                onClick={handleSmoothMove}
                disabled={isAnimating}
                style={{
                    position: 'absolute',
                    top: 35,
                    right: 22,
                    padding: '8px 12px',
                    background: isAnimating ? '#666' : '#162455',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 4,
                    cursor: isAnimating ? 'not-allowed' : 'pointer',
                    opacity: isAnimating ? 0.6 : 1,
                }}
                className="ios-glass-theme"
            >
                {isAnimating ? 'Animating...' : 'Smooth Move'}
            </button>

            {/* Viewer container */}
            <div id="viewer1" ref={containerRef} style={{ width: '100%', height: '100%', overflow: 'hidden' }} />
        </>
    );
}
