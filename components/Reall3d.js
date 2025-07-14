// components/Reall3d.js
import { useEffect, useRef } from 'react';
// import '@reall3d/reall3dviewer/dist/style.css';
// import img from 'virtual:svg-icons-register';
import { Reall3dViewer, SplatMesh } from '@reall3d/reall3dviewer';
// import { Scene, Node } from 'reall3d-viewer';

// import { Color, PerspectiveCamera, Scene, WebGLRenderer } from 'three';
// import { OrbitControls } from 'three/examples/jsm/Addons.js';

export default function Reall3d() {
    const container = useRef(null);
    const myScene = {
        // If you also want to clear any environment lighting, you can null that too:
        environmentNode: null,
        // Remove any background (transparent canvas)
        backgroundNode: null,
        // Keep fog disabled or set to null
        fogNode: null,
    };
    useEffect(() => {
        if (!container.current) return;
        const isMobile = /Mobi|Android/i.test(navigator.userAgent) || window.innerWidth < 768;
        const fov = isMobile ? 30 : 20;

        // alert('help');
        // @ts-ignore
        // dynamic import to avoid SSR issues

        const viewer1 = new Reall3dViewer({
            root: container.current,
            shDegree: 3,
            position: [0, -5, 15],
            fov,
            enableKeyboard: true,
            lightFactor: 40,
            pointcloudMode: true,
            // markMode: true,
            // markType: 'plans',
            // maxRenderCountOfPc: 10000,
            background: '#1f2328',

            // scene: myScene,
            renderer: undefined, // let the viewer make its own WebGLRenderer
            turntable: true,
            // maxPolarAngle: 4,
        });
        viewer1.backgroundNode = null;
        viewer1.environmentNode = null;
        viewer1.addModel('/3DGS.ply');

        // Cleanup function
        return () => {
            viewer1?.destroy?.();
        };
    }, []);

    return <div id="viewer1" ref={container} style={{ width: '100%', height: '100%' }} />;
}
