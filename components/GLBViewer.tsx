// components/GLBViewer.tsx
// 'use client';

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Html, useProgress } from '@react-three/drei';

function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="text-white text-lg">
        Loading {progress.toFixed(0)}%
      </div>
    </Html>
  );
}

type GLBViewerProps = {
  url: string;
};

function Model({ url }: GLBViewerProps) {
  // load the GLTF; this object always has a .scene once ready
  const gltf = useGLTF(url);

  // if for some reason it's not ready, bail:
  if (!gltf.scene) return null;

  // clone the scene so our instance is isolated
  return <primitive object={gltf.scene.clone()} dispose={null} />;
}

export default function GLBViewer({ url }: GLBViewerProps) {
  return (
    <div style={{ width: '100%', height: '100%', position: 'absolute', top: '0', left: 0, zIndex: 0, margin: 'auto' }}>
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 3, 11], fov: 60 }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <Suspense fallback={<Loader />}>
          <Model url={url} />
        </Suspense>
        <OrbitControls enablePan={false} enableZoom={false} enableRotate={false} />
      </Canvas>
    </div>
  );
}
