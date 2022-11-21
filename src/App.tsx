import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei';
import { Debug, Physics } from '@react-three/cannon';

import { Factory } from './3d/factory';

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
          {/* <Debug color="white" scale={1.01}> */}
            <Factory />
          {/* </Debug> */}
        </Physics>
      </Canvas>
    </div>
  )
}
