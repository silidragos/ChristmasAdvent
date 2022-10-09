import { useBox } from "@react-three/cannon";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { Group } from "three";
import { Materials, Nodes } from "./3d.types";

const initialPosition = [-3, 1.55, 1.5];
export default function RotativePalette({ nodes, materials }: { nodes: Nodes, materials: Materials }) {
    const totalTime = useRef<number>(0);
    const speed = useMemo(() => { return 2.1; }, []);

    const [palette, physicsAPI] = useBox<Group>((idx) => ({
        args: [2, 1.2, .5],
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
        physicsAPI.position.set(initialPosition[0], initialPosition[1],initialPosition[2] + Math.sin(totalTime.current * speed) * 1);
    });

    return (
        <group>
            <group ref={palette}>
                <mesh>
                    <boxBufferGeometry args={[2, 1.2, .5]} attach="geometry" />
                    <meshPhongMaterial attach="material" color="gray" specular={0xffffff} />
                </mesh>
            </group>
        </group>
    );
}