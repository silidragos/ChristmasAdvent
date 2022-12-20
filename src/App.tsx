import { Factory } from './3d/factory';
import { useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber'
import { Debug, Physics } from '@react-three/cannon';
import { WINDOW_EVENTS } from './services/Constants';
import { OrbitControls, Environment } from '@react-three/drei';
import { emitWindowEvent, useWindowEvent } from './services/WindowEvents';

import './App.css';

export default function App() {
  return (
    <div id="canvas-container">
      <Canvas>
        <OrbitControls></OrbitControls>
        <directionalLight position={[0, 2, -2]} color={"white"} intensity={.5} />
        <ambientLight intensity={.1}/>
        <Environment background={false} near={1} far={20} resolution={256} preset="apartment"></Environment>
        <Physics gravity={[0, -1.98, 0]}>
          <Debug color="white" scale={1.01}>
            <Factory />
          </Debug>
        </Physics>
        <LoadListener />
      </Canvas>
    </div>
  )
}

// Custom component that
// > 1. emits a custom event on the Window when the Scene has loaded
// > 2. listens to a custom event that intends to check if the scene
// has loaded and responds with 
const LoadListener = () => {
  const [didLoad, setDidLoad] = useState(false);

  // FIXME
  // Current implementation is "fake" and doesn't
  // actually check if the scene is loaded.
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDidLoad(true);
    }, 5000);

    return () => {
      clearTimeout(timeoutId);
    }
  }, []);

  useWindowEvent(WINDOW_EVENTS.TEST_LOAD, () => {
    emitWindowEvent({
      type: WINDOW_EVENTS.TEST_LOAD_RESULT,
      payload: true,
    });
  }, [didLoad]);

  return null;
}
