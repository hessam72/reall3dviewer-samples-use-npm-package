// components/Reall3d.js
import { useEffect, useRef } from 'react';
// import '@reall3d/reall3dviewer/dist/style.css';
// import img from 'virtual:svg-icons-register';
import { Reall3dViewer } from '@reall3d/reall3dviewer';
// import { Color, PerspectiveCamera, Scene, WebGLRenderer } from 'three';
// import { OrbitControls } from 'three/examples/jsm/Addons.js';

export default function Reall3d() {
    const container = useRef(null);

    useEffect(() => {
        if (!container.current) return;
        // alert('help');
        // @ts-ignore
        // dynamic import to avoid SSR issues

        const viewer1 = new Reall3dViewer({
            root: container.current,
            shDegree: 3,
            enableKeyboard: true,
            background: '#1f2328',
        });
        viewer1.addModel('/3DGS.ply');

        // Cleanup function
        return () => {
            viewer1?.destroy?.();
        };
    }, []);

    return <div id="viewer1" ref={container} style={{ width: '100%', height: '100%' }} />;
}
