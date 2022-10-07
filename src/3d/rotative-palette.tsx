import { useBox } from "@react-three/cannon";
import { Group } from "three";
import { Materials, Nodes } from "./3d.types";

export default function RotativePalette({ nodes, materials }: { nodes: Nodes, materials: Materials }) {
    const [palette, physicsAPI] = useBox<Group>((idx) => ({
        args: [1, 1.2, .1],
        position: [-3.2, 1.55, 1.3],
        rotation: [0, 0, 0],
        mass: 0,
        material: {
            friction: 0
        }
    }
    ));
    return (
        <group>
            <mesh geometry={nodes.Cylinder013.geometry} material={materials.DarkGray} />
            <mesh geometry={nodes.Cylinder013_1.geometry} material={materials.Red} />
        </group>
    );
}