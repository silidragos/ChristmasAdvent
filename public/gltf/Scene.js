/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

export function Model(props) {
  const { nodes, materials } = useGLTF('/scene.glb')
  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes.GiftGenerator.geometry} material={materials.Red} position={[-0.74, 1.3, 0.07]} />
      <group position={[-0.74, 2.04, 0.07]} rotation={[0, -Math.PI / 2, 0]} scale={0.67}>
        <mesh geometry={nodes.Cube001.geometry} material={materials.Green} />
        <mesh geometry={nodes.Cube001_1.geometry} material={materials.Red} />
        <mesh geometry={nodes.Cube001_2.geometry} material={materials.White} />
        <group position={[0.04, 0.11, 0]} rotation={[0, Math.PI / 2, 0]} scale={1.49}>
          <mesh geometry={nodes.Signaler_1.geometry} material={materials.White} />
          <mesh geometry={nodes.Signaler_2.geometry} material={materials.GreenLight} />
        </group>
      </group>
      <group position={[-0.74, 2.86, 0.07]} scale={0.4}>
        <mesh geometry={nodes.EnergySphere_1.geometry} material={materials.Red} />
        <mesh geometry={nodes.EnergySphere_2.geometry} material={materials.Glass} />
      </group>
      <mesh geometry={nodes.EndBucket.geometry} material={materials.Red} position={[-3.64, 0.64, 3.83]} rotation={[-Math.PI / 2, 0, 0]} scale={0.44} />
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
      <group position={[0.19, 0, 2.43]}>
        <mesh geometry={nodes.Cube003.geometry} material={materials.Red} />
        <mesh geometry={nodes.Cube003_1.geometry} material={materials.DarkGray} />
      </group>
      <mesh geometry={nodes.Screws.geometry} material={materials.White} position={[0.19, 0.8, 2.56]} />
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
      <mesh geometry={nodes.DestinationText.geometry} material={materials.Green} position={[-2.98, 1.89, 4.76]} rotation={[Math.PI / 2, 0, -Math.PI]} scale={0.55} />
      <mesh geometry={nodes.Battery.geometry} material={materials.Battery} position={[-0.74, 2.1, -0.67]} rotation={[-Math.PI / 2, 0, 0]} />
    </group>
  )
}

useGLTF.preload('/scene.glb')
