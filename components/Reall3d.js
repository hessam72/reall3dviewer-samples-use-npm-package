// components/Reall3d.js
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Reall3dViewer } from '@reall3d/reall3dviewer';
import '@reall3d/reall3dviewer/dist/style.css';

export default function Reall3d() {
    const containerRef = useRef(null);
    const viewerRef = useRef(null);

    // URLs for the two PLY models
    const MODEL_B = '/new_3DGS.ply';
    const MODEL_A = '/3DGS _full.ply';
    const [modelUrl, setModelUrl] = useState(MODEL_A);

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

        // Instantiate a new viewer
        const viewer = new Reall3dViewer({
            root: container,
            shDegree: 3,
            position: [0, -5, 15],
            fov: window.innerWidth < 768 ? 20 : 10,
            pointcloudMode: true,
            alpha: true,
            antialias: true,
            turntable: true,
            minPolarAngle: -1,
            maxPolarAngle: 1.63,
            enableKeyboard: false,
            maxDistance: 18,
            minDistance: 1,
            fov: 50,
            // bigSceneMode: true,
        });

        // Remove default environment and background nodes
        viewer.environmentNode = null;
        viewer.backgroundNode = null;

        // Load the selected PLY model
        viewer.addModel(modelUrl).catch(err => console.error('PLY loading error:', err));

        // Store viewer instance in ref
        viewerRef.current = viewer;

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

    // Toggle between models
    const handleSwitch = () => {
        setModelUrl(prev => (prev === MODEL_A ? MODEL_B : MODEL_A));
    };

    return (
        <>
            {/* Toggle button */}
            <button
                onClick={handleSwitch}
                style={{
                    position: 'absolute',
                    top: 35,
                    right: 22,
                    padding: '8px 12px',
                    background: '#162455',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 4,
                    cursor: 'pointer',
                }}
                className="ios-glass-theme"
            >
                مدل بعدی
            </button>

            {/* Viewer container */}
            <div id="viewer1" ref={containerRef} style={{ width: '100%', height: '100%', overflow: 'hidden' }} />
        </>
    );
}
