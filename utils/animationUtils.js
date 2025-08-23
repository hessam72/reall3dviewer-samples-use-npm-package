// Animation utilities for Reall3dViewer

/**
 * Easing functions for smooth animations
 */
export const easingFunctions = {
    // Standard cubic easing - balanced acceleration/deceleration
    easeInOutCubic: t => (t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1),

    // Quartic easing - slower peak speed, more gradual
    easeInOutQuart: t => (t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t),

    // Linear (no easing)
    linear: t => t,

    // Sine easing - very smooth and natural
    easeInOutSine: t => -(Math.cos(Math.PI * t) - 1) / 2,

    // Custom smooth easing - even more gradual
    easeSuperSmooth: t => {
        // Sine-based super smooth curve
        return 0.5 * (1 - Math.cos(Math.PI * t));
    },
};

/**
 * Helper function for smooth property animation
 * @param {Function} updateFn - Function to call on each frame with progress (0-1)
 * @param {number} duration - Animation duration in milliseconds
 * @returns {Promise} - Resolves when animation completes
 */
export const animateProperty = (updateFn, duration) => {
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

/**
 * Complex animation sequence for Reall3dViewer
 * @param {Object} viewer - Reall3dViewer instance
 * @param {Function} setIsAnimating - State setter for animation status
 * @param {Function} onAnimationPause - Optional callback to trigger during pause (for stopping recording)
 * @returns {Promise} - Resolves when animation completes
 */
export const performComplexAnimation = async (viewer, setIsAnimating, onAnimationPause = null) => {
    if (!viewer.splatMesh) return;

    // Set animating state
    setIsAnimating(true);

    // Store initial state for reset
    const initialState = {
        position: {
            x: viewer.splatMesh.position.x,
            y: viewer.splatMesh.position.y,
            z: viewer.splatMesh.position.z,
        },
        rotation: {
            x: viewer.splatMesh.rotation.x,
            y: viewer.splatMesh.rotation.y,
            z: viewer.splatMesh.rotation.z,
        },
        scale: {
            x: viewer.splatMesh.scale.x,
            y: viewer.splatMesh.scale.y,
            z: viewer.splatMesh.scale.z,
        },
    };

    // Store initial camera settings
    const currentOptions = viewer.options();
    initialState.cameraPosition = currentOptions.position || [0, -5, 15];
    initialState.lookAt = currentOptions.lookAt || [0, 0, 0];
    initialState.distance = currentOptions.maxDistance || 18;

    try {
        // Step 1a: Force zoom out to maximum distance first (reset any user zoom)
        const maxZoomOut = 25; // Ensure we start from far out
        await animateProperty(progress => {
            const easedProgress = easingFunctions.easeInOutCubic(progress);
            const currentAnimDistance = initialState.distance + (maxZoomOut - initialState.distance) * easedProgress;
            viewer.options({
                maxDistance: currentAnimDistance,
                minDistance: currentAnimDistance, // Force to this exact distance
            });
        }, 800);

        // Step 1b: Now zoom in to optimal viewing distance
        const targetDistance = 8; // Good viewing distance
        await animateProperty(progress => {
            const easedProgress = easingFunctions.easeInOutCubic(progress);
            const currentAnimDistance = maxZoomOut + (targetDistance - maxZoomOut) * easedProgress;
            viewer.options({
                maxDistance: currentAnimDistance,
                minDistance: Math.min(currentAnimDistance, 1), // Allow user control again
            });
        }, 1200);

        // Step 2: Reduce Y position
        const targetY = initialState.position.y - 2;
        await animateProperty(progress => {
            const easedProgress = easingFunctions.easeInOutCubic(progress);
            viewer.splatMesh.position.y = initialState.position.y + (targetY - initialState.position.y) * easedProgress;
        }, 1500);

        // Step 3: Single smooth rotation (360°) with height increase throughout
        await animateProperty(progress => {
            // Apply ultra-smooth easing for rotation
            const easedRotationProgress = easingFunctions.easeSuperSmooth(progress);

            // Single rotation (360°) with ultra-smooth movement
            const totalRotation = Math.PI * 2 * easedRotationProgress; // 0 to 2π (360°)
            viewer.splatMesh.rotation.y = initialState.rotation.y + totalRotation;

            // Height increase happens throughout the entire rotation
            let heightIncrease = 0.5;
            let modelWorldY = initialState.position.y + (targetY - initialState.position.y);

            // Use the same smooth easing for height change
            const easedHeightProgress = easingFunctions.easeSuperSmooth(progress);
            heightIncrease = 2 * easedHeightProgress; // Go up 2 units with ultra-smooth easing
            viewer.splatMesh.position.y = targetY + heightIncrease;

            // Calculate model's world position including height change
            modelWorldY = initialState.position.y + (targetY - initialState.position.y) + heightIncrease;

            // Update camera lookAt to track the model's center during height changes
            viewer.options({
                lookAt: [
                    initialState.lookAt[0], // Keep X the same
                    modelWorldY, // Follow the model's Y position
                    initialState.lookAt[2], // Keep Z the same
                ],
            });
        }, 15000); // Extended time for ultra-smooth single rotation

        // Step 4: Pause for 1 second - trigger recording stop here
        if (onAnimationPause) {
            onAnimationPause(); // Stop recording during pause
        }

        await animateProperty(() => {
            // Do nothing, just wait
        }, 1000);

        // Step 5: Reset to initial state
        await animateProperty(progress => {
            const easedProgress = easingFunctions.easeInOutCubic(progress);

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
    } catch (error) {
        console.error('Animation error:', error);
    } finally {
        // Re-enable button
        setIsAnimating(false);
    }
};
