// components/Reall3d.js
import { useEffect, useRef } from 'react';
import { Reall3dViewer } from '@reall3d/reall3dviewer';

export default function Reall3d() {
    const container = useRef(null);

    useEffect(() => {
        if (!container.current || typeof window === 'undefined') return;

        // Detect mobile vs desktop (adjust breakpoint or userAgent check as needed)
        const isMobile = /Mobi|Android/i.test(navigator.userAgent) || window.innerWidth < 768;
        // Set different field of view for mobile or desktop
        const fov = isMobile ? 30 : 20;

        // Initialize the viewer
        const viewer = new Reall3dViewer({
            root: container.current,
            shDegree: 3,
            position: [0, -5, 15],
            fov,
            enableKeyboard: true,
            lightFactor: 40,
            pointcloudMode: true,
            turntable: true,
            // Leave background transparent
            background: null,
            // scene and renderer left undefined to use defaults
            renderer: undefined,
        });

        // Optionally clear environment and background nodes if viewer exposes them
        if (viewer.scene) viewer.scene.background = null;
        if (viewer.environmentNode !== undefined) viewer.environmentNode = null;

        // Load your model
        viewer.addModel('/3DGS.ply');

        return () => {
            viewer.destroy?.();
        };
    }, []);

    return <div ref={container} style={{ width: '100%', height: '100%', position: 'relative' }} />;
}
