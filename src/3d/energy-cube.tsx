import { Vector3, Mesh } from "three";
import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";

import { Materials, Nodes } from "./3d.types";
import { Test1, Test1Component } from "../services/TestingService";
import HierarchyDay1, { MESH_NAMES } from "../courses/day1-hierarchy-attributes";

export default function EnergyCube({
    nodes,
    materials
}: { nodes: Nodes; materials: Materials }) {
    const { scene } = useThree();
    const batteryCore = useRef<Mesh>(null);
    const batteryCoreMainPosition = useRef<Vector3 | null>(null);

    useEffect(() => {
        if (batteryCore.current === null) {
            return;
        }

        batteryCoreMainPosition.current = batteryCore.current.position.clone();
    }, [batteryCore.current]);

    useFrame(() => {
        if (batteryCore.current === null || batteryCoreMainPosition.current === null) {
            return;
        }

        let { valid: didTest1Pass } = Test1(scene, MESH_NAMES.LEFT_BATTERY, MESH_NAMES.RIGHT_BATTERY);

        if (didTest1Pass) {
            let newPos = new Vector3();
            newPos.addVectors(new Vector3(Math.random(), Math.random(), Math.random()).multiplyScalar(0.2), batteryCoreMainPosition.current);
            batteryCore.current.position.set(newPos.x, newPos.y, newPos.z);
        }

    });
    return (
        <>
            <group>
                <HierarchyDay1 nodes={nodes} materials={materials} />
                <group position={[-0.74, 2.86, 0.07]} scale={0.4}>
                    <mesh ref={batteryCore} geometry={nodes.EnergySphere_1.geometry} material={materials.Red} />
                    <mesh geometry={nodes.EnergySphere_2.geometry} material={materials.Glass} />
                </group>
            </group>
            <Test1Component leftBatteryName={MESH_NAMES.LEFT_BATTERY} rightBatteryName={MESH_NAMES.RIGHT_BATTERY} />
        </>
    );
}