// components/Reall3d.js
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Reall3dViewer } from '@reall3d/reall3dviewer';
import '@reall3d/reall3dviewer/dist/style.css';
import { Vector3 } from 'three';

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

        // Store initial state for reset
        const initialState = {
            position: { x: 0, y: 0, z: 0 },
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 1, y: 1, z: 1 },
            distance: 23, // initial camera distance
            cameraPosition: [0, -5, 15],
            lookAt: [0, 0, 0],
        };

        // Complex animation sequence
        const performComplexAnimation = async () => {
            if (!viewer.splatMesh) return;

            // Set animating state
            setIsAnimating(true);

            // Store current state as initial
            initialState.position = {
                x: viewer.splatMesh.position.x,
                y: viewer.splatMesh.position.y,
                z: viewer.splatMesh.position.z,
            };
            initialState.rotation = {
                x: viewer.splatMesh.rotation.x,
                y: viewer.splatMesh.rotation.y,
                z: viewer.splatMesh.rotation.z,
            };
            initialState.scale = {
                x: viewer.splatMesh.scale.x,
                y: viewer.splatMesh.scale.y,
                z: viewer.splatMesh.scale.z,
            };

            // Store initial camera settings
            const currentOptions = viewer.options();
            initialState.cameraPosition = currentOptions.position || [0, -5, 15];
            initialState.lookAt = currentOptions.lookAt || [0, 0, 0];
            initialState.distance = currentOptions.maxDistance || 18;

            // Step 1a: Force zoom out to maximum distance first (reset any user zoom)
            const maxZoomOut = 25; // Ensure we start from far out
            await animateProperty(progress => {
                const easedProgress = easeInOutCubic(progress);
                const currentAnimDistance = initialState.distance + (maxZoomOut - initialState.distance) * easedProgress;
                viewer.options({
                    maxDistance: currentAnimDistance,
                    minDistance: currentAnimDistance, // Force to this exact distance
                });
            }, 800);

            // Step 1b: Now zoom in to optimal viewing distance
            const targetDistance = 8; // Good viewing distance
            await animateProperty(progress => {
                const easedProgress = easeInOutCubic(progress);
                const currentAnimDistance = maxZoomOut + (targetDistance - maxZoomOut) * easedProgress;
                viewer.options({
                    maxDistance: currentAnimDistance,
                    minDistance: Math.min(currentAnimDistance, 1), // Allow user control again
                });
            }, 1200);

            // Step 2: Reduce Y position
            const targetY = initialState.position.y - 1;
            await animateProperty(progress => {
                const easedProgress = easeInOutCubic(progress);
                viewer.splatMesh.position.y = initialState.position.y + (targetY - initialState.position.y) * easedProgress;
            }, 1500);

            // Step 3: First full rotation with smooth easing
            await animateProperty(progress => {
                const easedProgress = easeInOutCubic(progress);
                viewer.splatMesh.rotation.y = initialState.rotation.y + Math.PI * 2 * easedProgress;
            }, 3000);

            // Step 4: Second rotation (seamless continuation) while increasing height and adjusting camera look
            await animateProperty(progress => {
                // Use linear progress for seamless rotation continuation (no easing gap)
                // but apply easing only to height changes for smooth up movement
                const easedProgressHeight = easeInOutCubic(progress);
                
                // Continue rotating seamlessly from where first rotation ended (2π to 4π)
                // Use LINEAR progress to maintain constant rotation speed
                viewer.splatMesh.rotation.y = initialState.rotation.y + Math.PI * 2 + Math.PI * 2 * progress;

                // Gradually increase height during second rotation with smooth easing
                const heightIncrease = 2 * easedProgressHeight; // Go up 2 units with easing
                viewer.splatMesh.position.y = targetY + heightIncrease;

                // Adjust camera to look at the model's new position
                // Calculate the model's world position including the height change
                const modelWorldY = initialState.position.y + (targetY - initialState.position.y) + heightIncrease;

                // Update camera lookAt to track the model's center
                viewer.options({
                    lookAt: [
                        initialState.lookAt[0], // Keep X the same
                        modelWorldY, // Follow the model's Y position
                        initialState.lookAt[2], // Keep Z the same
                    ],
                });
            }, 4000);

            // Step 5: Pause for 1 second
            await animateProperty(() => {
                // Do nothing, just wait
            }, 1000);

            // Step 6: Reset to initial state
            await animateProperty(progress => {
                const easedProgress = easeInOutCubic(progress);

                // Reset position
                viewer.splatMesh.position.x = (initialState.position.x - viewer.splatMesh.position.x) * easedProgress + viewer.splatMesh.position.x;
                viewer.splatMesh.position.y = (initialState.position.y - viewer.splatMesh.position.y) * easedProgress + viewer.splatMesh.position.y;
                viewer.splatMesh.position.z = (initialState.position.z - viewer.splatMesh.position.z) * easedProgress + viewer.splatMesh.position.z;

                // Reset rotation
                viewer.splatMesh.rotation.x = (initialState.rotation.x - viewer.splatMesh.rotation.x) * easedProgress + viewer.splatMesh.rotation.x;
                viewer.splatMesh.rotation.y = (initialState.rotation.y - viewer.splatMesh.rotation.y) * easedProgress + viewer.splatMesh.rotation.y;
                viewer.splatMesh.rotation.z = (initialState.rotation.z - viewer.splatMesh.rotation.z) * easedProgress + viewer.splatMesh.rotation.z;

                // Reset scale
                viewer.splatMesh.scale.x = (initialState.scale.x - viewer.splatMesh.scale.x) * easedProgress + viewer.splatMesh.scale.x;
                viewer.splatMesh.scale.y = (initialState.scale.y - viewer.splatMesh.scale.y) * easedProgress + viewer.splatMesh.scale.y;
                viewer.splatMesh.scale.z = (initialState.scale.z - viewer.splatMesh.scale.z) * easedProgress + viewer.splatMesh.scale.z;
            }, 2000);

            // Reset camera distance and look target
            viewer.options({
                maxDistance: initialState.distance,
                minDistance: 1,
                lookAt: initialState.lookAt,
                position: initialState.cameraPosition,
            });

            // Re-enable button
            setIsAnimating(false);
        };

        // Helper function for smooth property animation
        const animateProperty = (updateFn, duration) => {
            return new Promise(resolve => {
                const startTime = performance.now();

                const animate = () => {
                    const elapsed = performance.now() - startTime;
                    const progress = Math.min(elapsed / duration, 1);

                    updateFn(progress);

                    if (progress < 1) {
                        requestAnimationFrame(animate);
                    } else {
                        resolve();
                    }
                };

                requestAnimationFrame(animate);
            });
        };

        // Easing function
        const easeInOutCubic = t => (t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1);

        // Store animation function in viewer for external access
        viewer.performComplexAnimation = performComplexAnimation;
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
