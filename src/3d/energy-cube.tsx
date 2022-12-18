import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { Vector3, Mesh } from "three";
import HierarchyDay1 from "../courses/day1-hierarchy-attributes";
import { Materials, Nodes } from "./3d.types";
import { Test1, Test1Component } from "../services/TestingService";

export default function EnergyCube({
    nodes,
    materials
}: { nodes: Nodes; materials: Materials }) {
    const batteryCore = useRef<Mesh>(null);
    const batteryCoreMainPosition = useRef<Vector3 | null>(null);

    const leftBattery = useRef<Mesh>(null);
    const rightBattery = useRef<Mesh>(null);

    useEffect(() => {
        if (batteryCore.current === null) return;
        batteryCoreMainPosition.current = batteryCore.current.position.clone();
    },
        [batteryCore.current]
    );

    useFrame(() => {
        if (batteryCore.current === null || batteryCoreMainPosition.current === null ||
            leftBattery.current === null || rightBattery.current === null) {
            return;
        }

        let { valid: didTest1Pass } = Test1(leftBattery.current, rightBattery.current);

        if (didTest1Pass) {
            let newPos = new Vector3();
            newPos.addVectors(new Vector3(Math.random(), Math.random(), Math.random()).multiplyScalar(0.2), batteryCoreMainPosition.current);
            batteryCore.current.position.set(newPos.x, newPos.y, newPos.z);
        }

    });
    return (

        <>
            <group>
                <HierarchyDay1 leftBattery={leftBattery} rightBattery={rightBattery} nodes={nodes} materials={materials} />
                <group position={[-0.74, 2.86, 0.07]} scale={0.4}>
                    <mesh ref={batteryCore} geometry={nodes.EnergySphere_1.geometry} material={materials.Red} />
                    <mesh geometry={nodes.EnergySphere_2.geometry} material={materials.Glass} />
                </group>
            </group>
            <Test1Component leftBattery={leftBattery.current} rightBattery={rightBattery.current} />
        </>
    );
}