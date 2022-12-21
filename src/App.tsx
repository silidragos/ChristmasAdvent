import { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber'
import { Physics } from '@react-three/cannon';
import { OrbitControls, Environment } from '@react-three/drei';

import { Factory } from './3d/factory';

import './App.css';

function MuteUnmute() {
  const [isMute, setIsMute] = useState(true);

  return (
    <div>
      <button className="mute-but" onClick={() => {
        document.dispatchEvent(new CustomEvent("muteStateUpdated", { detail: { isMute: !isMute } }));
        setIsMute(!isMute);
      }}><span>{isMute ? "unmute" : "mute"}</span></button>
    </div>
  )
}

export default function App() {
  return (
    <div id="canvas-container">
      <MuteUnmute />
      <Canvas>
        <Suspense>
          <OrbitControls></OrbitControls>
          <directionalLight position={[0, 2, -2]} color={"white"} intensity={.5} />
          <ambientLight intensity={.1} />
          <Environment background={false} near={1} far={20} resolution={256} preset="apartment"></Environment>
          <Physics gravity={[0, -1.98, 0]}>
            <Factory />
          </Physics>
        </Suspense>
      </Canvas>
    </div>
  )
}
