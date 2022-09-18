import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import EnergyCube from './energy-cube';
import { Letters } from './letters';

export function Factory(props) {
    console.log(process.env.PUBLIC_URL);
  const { nodes, materials } = useGLTF(process.env.PUBLIC_URL + '/gltf/scene.glb')
  return (
    <group {...props} dispose={null}>
      <group position={[-0.74, 1.3, 0.07]}>
        <mesh geometry={nodes.Cube.geometry} material={materials.Red} />
        <mesh geometry={nodes.Cube_1.geometry} material={materials.DarkGray} />
      </group>
      <group position={[-0.74, 2.04, 0.07]} rotation={[0, -Math.PI / 2, 0]} scale={0.67}>
        <mesh geometry={nodes.Cube001.geometry} material={materials.Green} />
        <mesh geometry={nodes.Cube001_1.geometry} material={materials.Red} />
        <mesh geometry={nodes.Cube001_2.geometry} material={materials.White} />
        <mesh geometry={nodes.Cube001_3.geometry} material={materials.DarkGray} />
      </group>
      <EnergyCube nodes={nodes} materials={materials}/>
      <group position={[-3.64, 0.64, 3.83]} scale={0.61}>
        <mesh geometry={nodes.Cube002.geometry} material={materials.Red} />
        <mesh geometry={nodes.Cube002_1.geometry} material={materials.Green} />
      </group>
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
      <group position={[0.19, 0, -1.67]}>
        <mesh geometry={nodes.Cube003.geometry} material={materials.Red} />
        <mesh geometry={nodes.Cube003_1.geometry} material={materials.DarkGray} />
      </group>
      <mesh geometry={nodes.Screws.geometry} material={materials.White} position={[0.19, 0.8, -1.54]} />
      <group position={[-2.72, -0.03, 1.23]}>
        <mesh geometry={nodes.Cylinder013.geometry} material={materials.DarkGray} />
        <mesh geometry={nodes.Cylinder013_1.geometry} material={materials.Red} />
      </group>
      <group position={[-2.84, 0.09, 2.02]} scale={0.64}>
        <mesh geometry={nodes.Cylinder014.geometry} material={materials.Red} />
        <mesh geometry={nodes.Cylinder014_1.geometry} material={materials.Green} />
      </group>
      <group position={[-2.16, 0.87, 0.07]}>
        <mesh geometry={nodes.BezierCurve001.geometry} material={materials.Green} />
        <mesh geometry={nodes.BezierCurve001_1.geometry} material={materials.DarkGray} />
      </group>
      <Letters/>
    </group>
  )
}

useGLTF.preload(process.env.PUBLIC_URL + './gltf/scene.glb')