import React, { useRef } from "react"
import { Materials, Nodes } from "../3d/3d.types"

export default function Day1_HierarchyAndAttributes({ leftBattery, rightBattery, nodes, materials }: { leftBattery: React.RefObject<any>, rightBattery: React.RefObject<any>, nodes: Nodes, materials: Materials }) {

    return (
        <>
            {/* Left Battery Placeholder */}
            <group position={[-0.75, 2.1, .8]}>
                <mesh ref={leftBattery} geometry={nodes.Battery.geometry} material={materials.Battery} rotation={[-Math.PI / 2, 0, Math.PI]} />
            </group>
            {/* Right Battery Placeholder */}
            <group position={[-.75, 2.1, -.65]}>
                <mesh ref={rightBattery} geometry={nodes.Battery.geometry} material={materials.Battery} rotation={[-Math.PI / 2, 0, 0]} />
            </group>
        </>
    )
}