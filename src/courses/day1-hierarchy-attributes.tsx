import React, { useRef } from "react"
import { Materials, Nodes } from "../3d/3d.types"


/*
Concepts:
    - What is TreeJS, what is R3F
    - What is a mesh, what is geometry, what is material
    - position, rotation and scale as attributes
    - rotation in radians
    - Parenting importance, local vs Global
Bonus:
    - Why is our geometry in nodes/materials? -> Imported GLTF scene, the "JPEG" of 3D 
    - **Ref
Tasks:
    - Try putting the batteries into their correct position
Hints:
    - Reparent the objects to the correct empty groups
    - Hmm, something's not right..maybe we can use the rotation attribute?
 */

export default function Day1_HierarchyAndAttributes({ leftBattery, rightBattery, nodes, materials }: { leftBattery: React.RefObject<any>, rightBattery: React.RefObject<any>, nodes: Nodes, materials: Materials }) {

    return (
        <>
            <group position={[-2.5, 1, 0]} rotation={[0, 0, 0]}>
            </group>

            <group position={[-2.5, 1, -.5]} rotation={[-Math.PI/6, Math.PI/6.0, 0]}>
            </group>

            <group name="left-battery-holder" position={[-.75, 2.1, .8]} rotation={[Math.PI/2, 0 , 0]}>
                <mesh ref={leftBattery} geometry={nodes.Battery.geometry} material={materials.Battery}/>
            </group>
            
            <group name="right-battery-holder" position={[-.75, 2.1, -.65]}  rotation={[Math.PI/2, 0 , 0]}>
                <mesh ref={rightBattery} geometry={nodes.Battery.geometry} material={materials.Battery}/>
            </group>
        </>
    )
}