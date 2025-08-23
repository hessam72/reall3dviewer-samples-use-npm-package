// components/Reall3d.js
'use client';

import React, { useEffect, useRef, useState, useImperativeHandle } from 'react';
import { Reall3dViewer } from '@reall3d/reall3dviewer';
import '@reall3d/reall3dviewer/dist/style.css';
import { performComplexAnimation } from '../utils/animationUtils.js';

const Reall3d = React.forwardRef(({ shouldStartAnimation, onAnimationComplete, onAnimationStart, onAnimationPause }, ref) => {
    const containerRef = useRef(null);
    const viewerRef = useRef(null);

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

        // Custom animation function that handles callbacks
        const handleComplexAnimation = async () => {
            console.log('handleComplexAnimation called, callbacks:', {
                onAnimationStart: typeof onAnimationStart,
                onAnimationPause: typeof onAnimationPause,
                onAnimationComplete: typeof onAnimationComplete
            });
            
            if (onAnimationStart) {
                onAnimationStart();
            }
            
            try {
                await performComplexAnimation(viewer, () => {}, onAnimationPause);
            } finally {
                if (onAnimationComplete) {
                    onAnimationComplete();
                }
            }
        };

        // Store animation function in viewer for external access
        viewer.performComplexAnimation = handleComplexAnimation;
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

    // Watch for shouldStartAnimation prop and trigger animation
    useEffect(() => {
        if (shouldStartAnimation && viewerRef.current?.performComplexAnimation) {
            viewerRef.current.performComplexAnimation();
        }
    }, [shouldStartAnimation]);

    // Expose animation trigger via ref
    useImperativeHandle(ref, () => ({
        startAnimation: () => {
            if (viewerRef.current?.performComplexAnimation) {
                viewerRef.current.performComplexAnimation();
            }
        }
    }), []);

    // Toggle between models (keeping for future use)
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
            {/* Viewer container */}
            <div id="viewer1" ref={containerRef} style={{ width: '100%', height: '100%', overflow: 'hidden' }} />
        </>
    );
});

export default Reall3d;
