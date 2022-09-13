import { Canvas } from '@react-three/fiber'

import { OrbitControls, Environment } from '@react-three/drei';

import { Factory } from './3d/factory';

import './App.css';

export default function App() {
  return (
    <div id="canvas-container">
      <Canvas>
        <OrbitControls></OrbitControls>

        <Environment background={false} near={1} far={20} resolution={256} preset="apartment"></Environment>
        <directionalLight position={[0, 2, 0]} color={"white"} intensity={.3} />

        <Factory />
      </Canvas>
    </div>
  )
}
