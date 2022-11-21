import { useEffect, useMemo, useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import EnergyCube from './energy-cube';
import { GLTF } from 'three-stdlib';
import { GroupProps, useFrame, useLoader } from '@react-three/fiber';
import { Materials, Nodes } from './3d.types';
import Gifts from './gifts';
import GiftsPhysics from './gifts-physics';
import RotativePalette from '../courses/day5-physics';
import DestinationBox from '../courses/day6-spring';
import { MeshBasicMaterial, PointLight, PositionalAudio } from 'three';
import AudioComponent, { listener } from './audio-component';
import * as THREE from 'three';
import { Test1Passed } from '../services/TestingService';

type GLTFResult = GLTF & {
  nodes: Nodes;
  materials: Materials;
}

export function Factory(props: GroupProps) {
  const startLight = useRef<PointLight>(null);
  const hadBattery = useRef<boolean>(false);

  let hoSound: PositionalAudio;
  let factorySound: PositionalAudio;

  let lightMat: THREE.MeshBasicMaterial = useMemo(() => {
    return new MeshBasicMaterial({ color: 0xff0000 });
  }, [])


  useFrame(() => {
    if (startLight.current === null) return;

    let test1Passed : boolean = Test1Passed();
    if (!hadBattery.current && test1Passed) {
      hadBattery.current = true;
      startLight.current.intensity = 5;
      lightMat.color.set(0x00ff00);

      hoSound.play();
      factorySound.play();

    } else if (hadBattery.current && !test1Passed) {
      hadBattery.current = false;
      startLight.current.intensity = 0;
      lightMat.color.set(0xff0000);

      factorySound.stop();
    }
  })

  const { nodes, materials } = useGLTF(process.env.PUBLIC_URL + '/gltf/scene.glb') as GLTFResult;
  return (
    <group {...props} dispose={null}>

      <pointLight ref={startLight} color="green" position={[-2, 2, 0]} intensity={0} distance={3}></pointLight>
      <mesh geometry={nodes.GiftGenerator.geometry} material={materials.Red} position={[-0.74, 1.3, 0.07]} />
      <group position={[-0.74, 2.04, 0.07]} rotation={[0, -Math.PI / 2, 0]} scale={0.67}>
        <mesh geometry={nodes.Cube001.geometry} material={materials.Green} />
        <mesh geometry={nodes.Cube001_1.geometry} material={materials.Red} />
        <mesh geometry={nodes.Cube001_2.geometry} material={materials.White} />
        <group position={[0.04, 0.11, 0]} rotation={[0, Math.PI / 2, 0]} scale={1.49}>
          <mesh geometry={nodes.Signaler_1.geometry} material={materials.White} />
          <mesh geometry={nodes.Signaler_2.geometry} material={lightMat} />
        </group>
      </group>

      <EnergyCube nodes={nodes} materials={materials} />
      <DestinationBox nodes={nodes} materials={materials} />

      <group position={[-2.06, 0.31, -0.01]}>
        <mesh geometry={nodes.BandSupport_1.geometry} material={materials.DarkGray} />
        <mesh geometry={nodes.BandSupport_2.geometry} material={materials.Red} />
        <mesh geometry={nodes.BandSupport_3.geometry} material={materials.White} />
        <mesh geometry={nodes.BandSupport_4.geometry} material={materials.Green} />
      </group>
      <group scale={5.17}>
        <mesh geometry={nodes.Plane.geometry} material={materials.Floor} />
        <mesh geometry={nodes.Plane_1.geometry} material={materials.Green} />
      </group>
      <group position={[0.19, 0, 2.4]}>
        <mesh geometry={nodes.Cube003.geometry} material={materials.Red} />
        <mesh geometry={nodes.Cube003_1.geometry} material={materials.DarkGray} />
      </group>
      <mesh geometry={nodes.Screws.geometry} material={materials.White} position={[0.19, 0.8, 2.5]} />
      <group>
        <RotativePalette nodes={nodes} materials={materials} />
      </group>

      <group position={[-2.84, 0.09, 2.02]} scale={0.64}>
        <mesh geometry={nodes.Cylinder014.geometry} material={materials.Red} />
        <mesh geometry={nodes.Cylinder014_1.geometry} material={materials.Green} />
      </group>

      <group position={[-2.16, 0.87, 0.07]}>
        <mesh geometry={nodes.BezierCurve001.geometry} material={materials.Green} />
        <mesh geometry={nodes.BezierCurve001_1.geometry} material={materials.DarkGray} />
      </group>

      <Gifts />
      <GiftsPhysics />

      <AudioComponent url={"./sfx/factory-loop.mp3"} volume={1} loop={true} autoplay={false} play={false} onInit={sound =>{
        factorySound = sound;
      }}/>
      <AudioComponent url={"./sfx/652617__percyfrench__kitsune.mp3"}  loop={true} volume={0.25}/>
      <AudioComponent url={"./sfx/ho-ho.mp3"} volume={1} loop={false} autoplay={false} play={false} onInit={sound =>{
        hoSound = sound;
      }}/>
    </group>
  )
}

useGLTF.preload(process.env.PUBLIC_URL + './gltf/scene.glb')
