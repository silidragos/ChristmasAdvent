import React, { useRef } from "react"

export default function Day1_HierarchyAndAttributes({leftBattery, rightBattery} : {leftBattery:React.RefObject<any>, rightBattery: React.RefObject<any>}) {

    return (
        <>
            {/* Left Battery Placeholder */}
            <group position={[-0.75, 2.1, .8]}>
                <mesh ref={leftBattery}>
                    <torusBufferGeometry args={[.25, .2, 8, 16]} attach="geometry" />
                    <meshPhongMaterial color="black" attach="material" specular={0xffffff}></meshPhongMaterial>
                </mesh>
            </group>
            {/* Right Battery Placeholder */}
            <group position={[-.75, 2.1, -.65]}>
                <mesh ref={rightBattery}>
                    <torusBufferGeometry args={[.25, .2, 8, 16]} attach="geometry" />
                    <meshPhongMaterial color="black" attach="material" specular={0xffffff}></meshPhongMaterial>
                </mesh>
            </group>
        </>
    )
}