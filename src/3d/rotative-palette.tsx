import { useBox } from "@react-three/cannon";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { Group } from "three";
import { Materials, Nodes } from "./3d.types";

export default function RotativePalette({ nodes, materials }: { nodes: Nodes, materials: Materials }) {
    const totalTime = useRef<number>(0);
    const speed = useMemo(() => { return 2; }, []);
    const [palette, physicsAPI] = useBox<Group>((idx) => ({
        args: [2, 1.2, .1],
        position: [-2.5, 1.55, 1.2],
        rotation: [0, 0, 0],
        mass: 0,
        material: {
            friction: 0
        }
    }
    ));

    useFrame((state, delta) => {
        totalTime.current += delta;
        physicsAPI.rotation.set(0, -totalTime.current * speed, 0);
    });

    return (
        <group>
            <mesh position={[-2.72, -0.03, 1.23]} geometry={nodes.Cylinder013.geometry} material={materials.DarkGray} />
            <group ref={palette}>
                <mesh>
                    <boxBufferGeometry args={[2, 1.2, .1]} attach="geometry" />
                    <meshPhongMaterial attach="material" color="red" />
                </mesh>
            </group>
        </group>
    );
}